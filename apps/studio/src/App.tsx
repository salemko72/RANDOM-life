import React, { useEffect, useState } from "react";
import {
  contentSchema,
  createChatGPTPrompt,
  demoItems,
  publicationIssues,
  ingredientDefinitions,
  resolveIngredient,
  tagIngredients,
  type Category,
  type ContentRecord,
  type ContentInput,
} from "@random/shared";

import { previewRequest, putPreviewImage } from "./preview-store";

const labels = {
  draft: "Nacrt",
  review: "Na pregledu",
  published: "Objavljeno",
};
export default function App({preview = false, samples = demoItems}: {preview?: boolean; samples?: ContentInput[]} = {}) {
  const [api, setApi] = useState("http://127.0.0.1:8787");
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(preview);
  const [items, setItems] = useState<ContentRecord[]>([]);
  const [category, setCategory] = useState<Category>("EAT");
  const [source, setSource] = useState("");
  const [json, setJson] = useState("");
  const [selected, setSelected] = useState<ContentRecord | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [staged, setStaged] = useState<{
    url: string;
    name: string;
    bytes: number;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
    originalBytes: number;
    format: string;
  } | null>(null);
  const [original, setOriginal] = useState<{
    url: string;
    name: string;
  } | null>(null);
  useEffect(
    () => () => {
      if (staged) URL.revokeObjectURL(staged.url);
    },
    [staged],
  );
  useEffect(
    () => () => {
      if (original) URL.revokeObjectURL(original.url);
    },
    [original],
  );
  async function request(
    path: string,
    method = "GET",
    body?: unknown,
    version?: number,
  ) {
    if (preview) return previewRequest(path, method, body, version);
    const url = new URL(api);
    if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
      throw new Error(
        "Ovaj Studio je lokalni razvojni alat. Udaljeni admin auth još nije konfiguriran.",
      );
    const response = await fetch(api.replace(/\/$/, "") + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(version ? { "If-Match": `"${version}"` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    const data = (await response.json()) as {
      error?: string;
      issues?: Array<string | { path: string[]; message: string }>;
      items: ContentRecord[];
      item: ContentRecord;
      duplicate?: boolean;
    };
    if (!response.ok)
      throw new Error(
        [
          data.error,
          ...(data.issues?.map((i: any) =>
            typeof i === "string" ? i : `${i.path.join(".")}: ${i.message}`,
          ) ?? []),
        ].join("\n"),
      );
    return data;
  }
  async function refresh() {
    const data = await request("/admin/content");
    setItems(data.items);
    setConnected(true);
  }
  useEffect(() => { if (preview) refresh().catch(e => setMessage(e.message)); }, [preview]);
  async function run(work: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      await work();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Zahtjev nije završen.",
      );
    } finally {
      setBusy(false);
    }
  }
  function parsedInput() {
    const parsed = contentSchema.safeParse(JSON.parse(json));
    if (!parsed.success)
      throw new Error(
        parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("\n"),
      );
    return tagIngredients(parsed.data);
  }
  async function save() {
    const parsed = parsedInput();
    const result = await request(
      selected ? `/admin/content/${selected.id}` : "/admin/content",
      selected ? "PUT" : "POST",
      parsed,
      selected?.version,
    );
    setSelected(result.item);
    setJson(JSON.stringify(tagIngredients(contentSchema.parse(result.item)), null, 2));
    await refresh();
    setMessage(
      result.duplicate
        ? "Duplikat pronađen. Postojeća stavka je učitana; nije prepisana."
        : "Nacrt je sačuvan. Svaka izmjena zahtijeva novi pregled.",
    );
  }
  async function transition(action: "review" | "publish" | "unpublish") {
    if (!selected) return;
    if (
      JSON.stringify(parsedInput()) !==
      JSON.stringify(tagIngredients(contentSchema.parse(selected)))
    )
      throw new Error("Prvo sačuvaj izmjene JSON-a.");
    if (
      action === "publish" &&
      !window.confirm(
        "Potvrđuješ li provjeru činjenica, izvora, alergena i prava na sliku?",
      )
    )
      return;
    const result = await request(
      `/admin/content/${selected.id}/${action}`,
      "POST",
      undefined,
      selected.version,
    );
    setSelected(result.item);
    await refresh();
    setMessage(labels[result.item.status as keyof typeof labels]);
  }
  function updateVerification(
    field: "factsVerified" | "allergensVerified" | "rightsConfirmed",
    value: boolean,
  ) {
    try {
      const data = JSON.parse(json);
      if (field === "rightsConfirmed") data.image.rightsConfirmed = value;
      else data[field] = value;
      setJson(JSON.stringify(data, null, 2));
    } catch {
      setMessage("Prvo unesi validan JSON.");
    }
  }
  async function imageFile(file: File) {
    if (
      !["image/png", "image/jpeg", "image/webp", "image/avif"].includes(
        file.type,
      ) ||
      file.size > 15 * 1024 * 1024
    )
      throw new Error("Izaberi PNG, JPG, WebP ili AVIF do 15 MB.");
    setMessage("Slika se obrađuje u pregledniku: čitanje i proporcionalno smanjivanje…");
    const bitmap = await createImageBitmap(file);
    try {
      if (bitmap.width * bitmap.height > 40_000_000)
        throw new Error("Slika je prevelika (maksimalno 40 megapiksela).");
      const canvas = document.createElement("canvas");
      const ratio = Math.min(1, 1440 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
      canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
      canvas
        .getContext("2d")!
        .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      setMessage("Priprema optimizirane slike bez rezanja i razvlačenja…");
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) =>
            b ? resolve(b) : reject(new Error("Optimizacija nije uspjela.")),
          "image/webp",
          0.84,
        ),
      );
      const stem =
        file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[^a-zA-Z0-9_-]/g, "-")
          .slice(0, 70) || "random-image";
      const name = `${stem}-${crypto.randomUUID().slice(0, 8)}.${blob.type === "image/webp" ? "webp" : "png"}`;
      if (preview) await putPreviewImage(`/media/${name}`, blob);
      setStaged({ url: URL.createObjectURL(blob), name, bytes: blob.size, width: canvas.width, height: canvas.height, originalWidth: bitmap.width, originalHeight: bitmap.height, originalBytes: file.size, format: blob.type === "image/webp" ? "WebP" : "PNG" });
      setOriginal({ url: URL.createObjectURL(file), name: file.name });
      if (json.trim()) {
        const data = JSON.parse(json);
        data.image.path = `/media/${name}`;
        data.image.rightsConfirmed = false;
        setJson(JSON.stringify(data, null, 2));
      }
      setMessage(
        preview ? "Slika je optimizirana i sačuvana u ovom pregledniku. Sačuvaj nacrt i potvrdi prava prije objave." : "Slika je obrađena lokalno. Preuzmi je u services/api/public/media, sačuvaj nacrt i ponovo provjeri prije objave. Original ostaje dostupan za preuzimanje.",
      );
    } finally {
      bitmap.close();
    }
  }
  let parsed: ReturnType<typeof contentSchema.safeParse> | null = null;
  try {
    parsed = contentSchema.safeParse(JSON.parse(json));
  } catch {
    /* preserve pasted input */
  }
  const valid = parsed?.success ? tagIngredients(parsed.data) : null;
  function mapIngredient(index: number, tag: string) {
    try {
      const data = JSON.parse(json);
      if (tag) data.ingredients[index].tag = tag;
      else delete data.ingredients[index].tag;
      setJson(JSON.stringify(data, null, 2));
    } catch {
      setMessage("Prvo unesi validan JSON recepta.");
    }
  }
  const issues = valid ? publicationIssues(valid) : [];
  const count = (c: Category) =>
    items.filter(
      (i) =>
        i.category === c &&
        i.status === "published" &&
        !publicationIssues(i).length,
    ).length;
  return (
    <div className="layout">
      <aside>
        <div className="brand">R A N D O M</div>
        <p className="muted">Content Studio</p>
        <div className="nav active">✦ Urednički stol</div>
        <div className="nav">EAT · recepti</div>
        <div className="nav">READ · knjige</div>
        <div className="aside-note">
          AI priprema.
          <br />
          Čovjek odlučuje.
          <p>
            Ručni ChatGPT workflow.
            <br />
            Bez API troškova.
          </p>
        </div>
      </aside>
      <main>
        <header>
          <div>
            <p className="eyebrow">OD DOBRE IDEJE DO DOBRE PREPORUKE</p>
            <h1>Tvoj urednički stol.</h1>
            <p className="muted">
              Pripremi, provjeri i objavi. Jedna kvalitetna stavka više.
            </p>
          </div>
          <span className="badge">Lokalni razvoj</span>
        </header>
        {!preview && <section className="connection">
          <label>
            API adresa
            <input
              disabled={busy}
              value={api}
              onChange={(e) => {
                setApi(e.target.value);
                setConnected(false);
              }}
            />
            <small className="input-help">Unesi adresu lokalno pokrenutog API-ja, pa poveži Studio.</small>
          </label>
          <label>
            Lokalni admin token
            <input
              disabled={busy}
              type="password"
              autoComplete="off"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setConnected(false);
              }}
            />
          </label>
          <p className="input-help">Token preuzmi iz svoje lokalne konfiguracije; ne šalji ga u ChatGPT.</p>
          <button disabled={busy || !token} onClick={() => run(refresh)}>
            Poveži Studio
          </button>
          <span>{connected ? "● Povezano" : "○ Nije povezano"}</span>
        </section>}
        <p className="note">{preview ? "Lokalni preview Studio: sadržaj i slike ostaju u ovom pregledniku. Objavljeni izbori se pojavljuju u RANDOM previewu. Bez API troškova." : "Token se čuva samo u memoriji ovog taba. Studio je dostupan samo lokalno dok ne odaberemo administratorsku prijavu."}</p>
        <section className="stats">
          <div>
            <span>EAT</span>
            <strong>
              {count("EAT")} <small>/ 50</small>
            </strong>
            <p>odobrenih recepata</p>
          </div>
          <div>
            <span>READ</span>
            <strong>
              {count("BOOK")} <small>/ 50</small>
            </strong>
            <p>odobrenih knjiga</p>
          </div>
          <div>
            <span>NA UREDNIČKOM STOLU</span>
            <strong>
              {items.filter((i) => i.status !== "published").length}
            </strong>
            <p>nacrta i pregleda</p>
          </div>
        </section>
        <div className="workspace">
          <section className="editor card">
            <fieldset className="editor-lock" disabled={busy}>
              <div className="section-head">
                <h2>{selected ? "Uredi stavku" : "Nova preporuka"}</h2>
                <button
                  className="quiet"
                  onClick={() => {
                    setSelected(null);
                    setJson("");
                    setStaged(null);
                    setOriginal(null);
                  }}
                >
                  Novi nacrt +
                </button>
              </div>
              <div className="tabs">
                {(["EAT", "BOOK"] as const).map((c) => (
                  <button
                    key={c}
                    className={category === c ? "selected" : "quiet"}
                    onClick={() => setCategory(c)}
                  >
                    {c === "BOOK" ? "READ" : c}
                  </button>
                ))}
              </div>
              <p className="input-help">1. Pronađi pouzdan izvor za recept ili knjigu. Izaberi EAT za recept, READ za knjigu.</p>
              <label>
                Izvor za ChatGPT
                <textarea
                  rows={3}
                  placeholder={
                    category === "EAT"
                      ? "URL ili tekst recepta i napomene o izvoru…"
                      : "Naslov, autor, izdanje i bibliografski izvor…"
                  }
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </label>
              <p className="input-help">2. Unesi link ili tekst izvora, autora i važne napomene. Izvor će biti dio prompta.</p>
              <div className="actions">
                <button
                  className="quiet"
                  onClick={() =>
                    run(async () => {
                      await navigator.clipboard.writeText(
                        createChatGPTPrompt(category, source),
                      );
                      setMessage(
                        "Prompt kopiran. Koristi ga ručno u ChatGPT-u i vrati JSON i sliku.",
                      );
                    })
                  }
                >
                  Kopiraj ChatGPT prompt ↗
                </button>
                <button
                  className="quiet"
                  onClick={() => {
                    const demo = samples.find(
                      (i) => i.category === category,
                    )!;
                    setSelected(null);
                    setJson(
                      JSON.stringify(
                        {
                          ...demo,
                          factsVerified: false,
                          image: { ...demo.image, rightsConfirmed: false },
                          ...(demo.category === "EAT"
                            ? { allergensVerified: false }
                            : {}),
                        },
                        null,
                        2,
                      ),
                    );
                    setStaged(null);
                    setOriginal(null);
                  }}
                >
                  Učitaj demo nacrt
                </button>
              </div>
              <p className="input-help">3. Kopiraj prompt i ručno ga zalijepi u ChatGPT. Zatraži JSON i fotografiju, pa ih preuzmi. Studio ne šalje API zahtjeve ChatGPT-u i nema API troškova.</p>
              <label>
                JSON iz ChatGPT-a
                <textarea
                  className="json"
                  rows={15}
                  spellCheck={false}
                  value={json}
                  onChange={(e) => setJson(e.target.value)}
                  placeholder="Zalijepi JSON bez markdown oznaka…"
                />
              </label>
              <p className="input-help">4. Zalijepi samo JSON, bez oznaka markdowna. Provjeri naslov, izvor i podatke; demo služi kao primjer.</p>
              {valid?.category === "EAT" && (
                <section className="ingredient-mapper" aria-label="Povezivanje sastojaka">
                  <h3>Ikone sastojaka</h3>
                  <p className="input-help">Prepoznati nazivi automatski dobiju oznaku pri čuvanju. Za ostale izaberi odgovarajući sastojak; naziv i količina ostaju tvoji. Oznaka ikone ne potvrđuje alergene.</p>
                  {valid.ingredients.map((ingredient, index) => {
                    const definition = resolveIngredient(ingredient.name, ingredient.tag);
                    return (
                      <div className="ingredient-row" key={index}>
                        {definition && <span className="ingredient-sprite" aria-hidden="true" style={{backgroundPosition: `${definition.column * 100 / 9}% ${definition.row * 100 / 9}%`}} />}
                        <label>
                          {ingredient.name}
                          <select aria-label={`Ikona za ${ingredient.name}`} value={definition?.id ?? ""} onChange={e => mapIngredient(index, e.target.value)}>
                            <option value="">Bez prepoznate oznake</option>
                            {ingredientDefinitions.map(entry => <option key={entry.id} value={entry.id}>{entry.name} · {entry.id}</option>)}
                          </select>
                          <small className="input-help">{definition ? `Oznaka: ${definition.id}` : "Naziv nije prepoznat; izaberi ikonu ako postoji."}</small>
                        </label>
                      </div>
                    );
                  })}
                  <details>
                    <summary>Pregled svih 100 sastojaka</summary>
                    <div className="ingredient-atlas-grid">{ingredientDefinitions.map(entry => <div key={entry.id} title={entry.id}><span className="ingredient-sprite" aria-hidden="true" style={{backgroundPosition: `${entry.column * 100 / 9}% ${entry.row * 100 / 9}%`}} /><span>{entry.name}</span></div>)}</div>
                  </details>
                  <button className="quiet" onClick={() => run(async () => { await navigator.clipboard.writeText(ingredientDefinitions.map(entry => `${entry.id}: ${entry.name}`).join("\n")); setMessage("Lista oznaka sastojaka je kopirana."); })}>Kopiraj listu oznaka</button>
                </section>
              )}
              <label className="upload">
                + Dodaj sliku iz ChatGPT-a
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) run(() => imageFile(file));
                    e.target.value = "";
                  }}
                />
              </label>
              <p className="input-help">5. Dodaj preuzetu fotografiju. Obrada je lokalna: duža stranica najviše 1440 px, bez povećavanja, rezanja i razvlačenja; WebP kvaliteta 84%. Original ostaje dostupan.</p>
              {staged && (
                <div className="staged">
                  <img src={staged.url} alt="Lokalni pregled uvezene slike" />
                  <div>
                    <a href={staged.url} download={staged.name}>
                      Preuzmi optimiziranu sliku
                    </a>
                    <p>
                      {staged.name} · {staged.width} × {staged.height} px · {staged.format} · {Math.round(staged.bytes / 1024)} KB
                    </p>
                    <p>Original: {staged.originalWidth} × {staged.originalHeight} px · {Math.round(staged.originalBytes / 1024)} KB
                    </p>
                    {original && (
                      <a href={original.url} download={original.name}>
                        Sačuvaj original lokalno
                      </a>
                    )}
                  </div>
                </div>
              )}
              <p className="note">{preview ? "Slika se automatski optimizira i čuva lokalno. Original možeš zasebno preuzeti; prije objave potvrdi prava." : <>Ovo nije cloud upload. Optimiziranu sliku dodaj u <code>services/api/public/media</code>; objava provjerava da je asset dostupan. Za public test potreban je novi deployment.</>}</p>
              <fieldset>
                <legend>Ljudska provjera</legend>
                <label>
                  <input
                    type="checkbox"
                    checked={valid?.factsVerified ?? false}
                    onChange={(e) =>
                      updateVerification("factsVerified", e.target.checked)
                    }
                  />{" "}
                  Provjerio/la sam činjenice i izvor
                </label>
                {valid?.category === "EAT" && (
                  <label>
                    <input
                      type="checkbox"
                      checked={valid.allergensVerified}
                      onChange={(e) =>
                        updateVerification(
                          "allergensVerified",
                          e.target.checked,
                        )
                      }
                    />{" "}
                    Provjerio/la sam sastojke i alergene
                  </label>
                )}
                <label>
                  <input
                    type="checkbox"
                    checked={valid?.image.rightsConfirmed ?? false}
                    onChange={(e) =>
                      updateVerification("rightsConfirmed", e.target.checked)
                    }
                  />{" "}
                  Potvrđujem prava na sliku
                </label>
              </fieldset>
              <p className="input-help">6. Lično provjeri činjenice i izvor, sastojke i alergene te pravo korištenja fotografije. Označi samo ono što si stvarno provjerio/la.</p>
              {!!issues.length && (
                <ul className="warnings">
                  {issues.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              )}
              <div className="actions">
                <button
                  disabled={busy || !connected || !valid}
                  onClick={() => run(save)}
                >
                  Sačuvaj nacrt
                </button>
                {selected && (
                  <>
                    <button
                      className="quiet"
                      disabled={busy}
                      onClick={() => run(() => transition("review"))}
                    >
                      Na pregled
                    </button>
                    <button
                      disabled={
                        busy || selected.status !== "review" || !!issues.length
                      }
                      onClick={() => run(() => transition("publish"))}
                    >
                      Odobri i objavi
                    </button>
                    {selected.status === "published" && (
                      <button
                        className="quiet"
                        disabled={busy}
                        onClick={() => run(() => transition("unpublish"))}
                      >
                        Povuci iz objave
                      </button>
                    )}
                  </>
                )}
              </div>
              <p className="input-help">7. Sačuvaj nacrt, pošalji ga na pregled i nakon provjere odobri objavu. Svaku novu izmjenu prvo sačuvaj i ponovo pregledaj.</p>
            </fieldset>
          </section>
          <section className="library card">
            <div className="section-head">
              <h2>Biblioteka</h2>
              <span>{items.length} stavki</span>
            </div>
            <input
              aria-label="Pretraži sadržaj"
              placeholder="Pretraži naslov…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <p className="input-help">Pronađi sačuvanu stavku po naslovu i otvori je za izmjenu ili pregled. Status pokazuje da li je nacrt, na pregledu ili objavljena.</p>
            {!items.length && (
              <div className="empty">
                ✦
                <h3>
                  Prva dobra preporuka
                  <br />
                  počinje ovdje.
                </h3>
                <p>
                  Poveži Studio i uvezi prvi nacrt.
                  <br />
                  Test traži 50 + 50 stvarnih stavki.
                </p>
              </div>
            )}
            {items
              .filter((i) =>
                i.title.toLowerCase().includes(search.toLowerCase()),
              )
              .map((i) => (
                <button
                  disabled={busy}
                  key={i.id}
                  className="item"
                  onClick={() => {
                    setSelected(i);
                    setCategory(i.category);
                    setJson(JSON.stringify(contentSchema.parse(i), null, 2));
                    setStaged(null);
                    setOriginal(null);
                    setMessage("");
                  }}
                >
                  <span className="item-category">{i.category}</span>
                  <strong>{i.title}</strong>
                  <span className={`status ${i.status}`}>
                    {labels[i.status]}
                  </span>
                  <small>Verzija {i.version}</small>
                </button>
              ))}
          </section>
        </div>
        {!!message && (
          <pre role="status" className="message">
            {message}
          </pre>
        )}
      </main>
    </div>
  );
}
