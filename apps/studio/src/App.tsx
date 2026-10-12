import React, { useEffect, useState } from "react";
import {
  contentSchema,
  createChatGPTPrompt,
  demoItems,
  publicationIssues,
  type Category,
  type ContentRecord,
} from "@random/shared";

const labels = {
  draft: "Nacrt",
  review: "Na pregledu",
  published: "Objavljeno",
};
export default function App() {
  const [api, setApi] = useState("http://127.0.0.1:8787");
  const [token, setToken] = useState("");
  const [connected, setConnected] = useState(false);
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
    return parsed.data;
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
    setJson(JSON.stringify(contentSchema.parse(result.item), null, 2));
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
      JSON.stringify(contentSchema.parse(selected))
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
    const bitmap = await createImageBitmap(file);
    try {
      if (bitmap.width * bitmap.height > 40_000_000)
        throw new Error("Slika je prevelika (maksimalno 40 megapiksela).");
      const canvas = document.createElement("canvas");
      const ratio = Math.min(1, 1440 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.round(bitmap.width * ratio);
      canvas.height = Math.round(bitmap.height * ratio);
      canvas
        .getContext("2d")!
        .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
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
      setStaged({ url: URL.createObjectURL(blob), name, bytes: blob.size });
      setOriginal({ url: URL.createObjectURL(file), name: file.name });
      if (json.trim()) {
        const data = JSON.parse(json);
        data.image.path = `/media/${name}`;
        setJson(JSON.stringify(data, null, 2));
      }
      setMessage(
        "Slika je obrađena lokalno. Preuzmi je u services/api/public/media, sačuvaj nacrt i ponovo provjeri prije objave. Original ostaje dostupan za preuzimanje.",
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
  const valid = parsed?.success ? parsed.data : null;
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
        <div className="nav">BOOK · knjige</div>
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
        <section className="connection">
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
          <button disabled={busy || !token} onClick={() => run(refresh)}>
            Poveži Studio
          </button>
          <span>{connected ? "● Povezano" : "○ Nije povezano"}</span>
        </section>
        <p className="note">
          Token se čuva samo u memoriji ovog taba. Studio je dostupan samo
          lokalno dok ne odaberemo administratorsku prijavu.
        </p>
        <section className="stats">
          <div>
            <span>EAT</span>
            <strong>
              {count("EAT")} <small>/ 50</small>
            </strong>
            <p>odobrenih recepata</p>
          </div>
          <div>
            <span>BOOK</span>
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
                    {c}
                  </button>
                ))}
              </div>
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
                    const demo = demoItems.find(
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
              {staged && (
                <div className="staged">
                  <img src={staged.url} alt="Lokalni pregled uvezene slike" />
                  <div>
                    <a href={staged.url} download={staged.name}>
                      Preuzmi optimiziranu sliku
                    </a>
                    <p>
                      {staged.name} · {Math.round(staged.bytes / 1024)} KB
                    </p>
                    {original && (
                      <a href={original.url} download={original.name}>
                        Sačuvaj original lokalno
                      </a>
                    )}
                  </div>
                </div>
              )}
              <p className="note">
                Ovo nije cloud upload. Optimiziranu sliku dodaj u{" "}
                <code>services/api/public/media</code>; objava provjerava da je
                asset dostupan. Za public test potreban je novi deployment.
              </p>
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
