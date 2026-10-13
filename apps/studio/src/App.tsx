import BaseBrowser,{Photo} from './BaseBrowser';
import {readContentPackage} from './content-package';
import {planAtlasBatches,atlasBatchPrompt,atlasBatchManifestJson,type AtlasBatch} from './atlas-batches';
import {inspectImport,recoverImport,draftInput,batchTranslationPrompt,needsTranslationRepair} from './import-recovery';
import React, { useEffect, useState } from "react";
import { contentSchema, createChatGPTPrompt, demoItems, publicationIssues, ingredientDefinitions, resolveIngredient, tagIngredients, type Category, type ContentRecord, type ContentInput, type Locale, localizeContent, } from "@random/shared";
import {editableSource} from "./editable-translations";
import { studioText } from './studio-language';
import { restorePreviewBackup, applyPreviewTranslationBatch, previewRequest, putPreviewImage, readMissingIngredients, rememberMissingIngredients, readPreviewRevisions } from "./preview-store";
import { unresolvedIngredients, missingAtlasPrompt, type MissingIngredient } from './missing-ingredients';
const EDITOR_KEY = 'random-life.studio-editor.v1';
function readEditor() { try {
    const data = JSON.parse(localStorage.getItem(EDITOR_KEY) || '{}');
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
}
catch {
    return {};
} }
const labels = {
    draft: "Nacrt",
    review: "Na pregledu",
    published: "Objavljeno",
};
export default function App({ preview = false, samples = demoItems, locale = 'en' }: {
    preview?: boolean;
    samples?: ContentInput[];
    locale?: Locale;
} = {}) {
    const tx = (value: string) => studioText(locale, value);
    const [atlasQueue,setAtlasQueue]=useState<AtlasBatch[]>(()=>{try{const saved=JSON.parse(localStorage.getItem('random-life.atlas-queue.v1')||'[]');return Array.isArray(saved)?saved.filter(b=>b?.status==='pending'&&b?.columns===10&&b?.rows===10&&Array.isArray(b.cells)&&b.cells.length===100):[];}catch{return [];}});
    const [batchJSON,setBatchJSON]=useState('');
    const [browse,setBrowse]=useState(false);
    const [zipUpload,setZipUpload]=useState<{name:string;state:'loading'|'saved'|'error';error?:string}|null>(null);
    const [recoveryBackup,setRecoveryBackup]=useState('');
    const [translationLocale, setTranslationLocale] = useState<Locale>(locale);
    const [initial] = useState(readEditor);
    const [revisions, setRevisions] = useState<ContentRecord[]>([]);
    const [missing, setMissing] = useState<MissingIngredient[]>([]);
    const [copied, setCopied] = useState<{
        signature: string;
        at: string;
    } | null>(initial.copied ?? null);
    const [storageWarning, setStorageWarning] = useState('');
    const [api, setApi] = useState("http://127.0.0.1:8787");
    const [token, setToken] = useState("");
    const [connected, setConnected] = useState(preview);
    const [items, setItems] = useState<ContentRecord[]>([]);
    const [category, setCategory] = useState<Category>(["EAT", "BOOK", "WATCH", "MOVE", "GO"].includes(initial.category) ? initial.category : "EAT");
    const [source, setSource] = useState(typeof initial.source === 'string' ? initial.source : "");
    const [json, setJson] = useState(typeof initial.json === 'string' ? initial.json : "");
    const [selected, setSelected] = useState<ContentRecord | null>(()=>{try{if(initial.selected?.id){draftInput(initial.selected);return initial.selected;}}catch{}return null;});
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
    const promptSignature = JSON.stringify([category, source]);
    const promptCopied = copied?.signature === promptSignature;
    useEffect(() => { try {
        localStorage.setItem(EDITOR_KEY, JSON.stringify({ category, source, json, selected, copied }));
        setStorageWarning('');
    }
    catch {
        setStorageWarning('Obrazac nije automatski sačuvan: provjeri prostor ili dozvole preglednika.');
    } }, [category, source, json, selected, copied]);
    useEffect(() => { readMissingIngredients().then(setMissing).catch(e => setStorageWarning(e.message)); }, []);
    useEffect(() => { const timer = setTimeout(() => { try {
        const input = contentSchema.parse(JSON.parse(json));
        rememberMissingIngredients(input).then(setMissing).catch(e => setStorageWarning(e.message));
    }
    catch { } }, 300); return () => clearTimeout(timer); }, [json]);
    function resetEditor() { setSelected(null); setJson(''); setSource(''); setCopied(null); setStaged(null); setOriginal(null); }
    function downloadLibrary() { const blob = new Blob([JSON.stringify({ format: 'RANDOM-content-backup-v1', exportedAt: new Date().toISOString(), items, missingIngredients: missing }, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'RANDOM-content-backup.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    useEffect(() => () => {
        if (staged)
            URL.revokeObjectURL(staged.url);
    }, [staged]);
    useEffect(() => () => {
        if (original)
            URL.revokeObjectURL(original.url);
    }, [original]);
    async function request(path: string, method = "GET", body?: unknown, version?: number) {
        if (preview)
            return previewRequest(path, method, body, version);
        const url = new URL(api);
        if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
            throw new Error("Ovaj Studio je lokalni razvojni alat. Udaljeni admin auth još nije konfiguriran.");
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
            issues?: Array<string | {
                path: string[];
                message: string;
            }>;
            items: ContentRecord[];
            item: ContentRecord;
            duplicate?: boolean;
        };
        if (!response.ok)
            throw new Error([
                data.error,
                ...(data.issues?.map((i: any) => typeof i === "string" ? i : `${i.path.join(".")}: ${i.message}`) ?? []),
            ].join("\n"));
        return data;
    }
    async function refresh() {
        const data = await request("/admin/content");
        setItems(data.items);
        for (const row of data.items)
            await rememberMissingIngredients(row);
        setMissing(await readMissingIngredients());
        setConnected(true);
    }
    useEffect(() => { if (preview)
        refresh().catch(e => setMessage(e.message)); }, [preview]);
    async function run(work: () => Promise<void>) {
        if (busy)
            return;
        setBusy(true);
        setMessage("");
        try {
            await work();
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Zahtjev nije završen.");
        }
        finally {
            setBusy(false);
        }
    }
    function openRecord(i:ContentRecord){
        if(i.id.startsWith('__demo:')){const input=draftInput({...i,factsVerified:false,image:{...i.image,rightsConfirmed:false},translations:Object.fromEntries(Object.entries(i.translations??{}).map(([code,t])=>[code,{...t,reviewed:false}])),...(i.category==='EAT'?{allergensVerified:false}:{})});setSelected(null);setCategory(input.category);setSource(input.source.url);setJson(JSON.stringify(input,null,2));setStaged(null);setOriginal(null);setBrowse(false);setMessage(locale==='en'?'Demo opened as an unsaved editable copy.':'Demo je otvoren kao nesačuvana kopija za uređivanje.');return;}

        setSelected(i);setCategory(i.category);setSource(i.source.url);setCopied(null);setJson(JSON.stringify(draftInput(i),null,2));setStaged(null);setOriginal(null);setMessage('');setBrowse(false);
        requestAnimationFrame(()=>document.querySelector('.editor')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
    }
    function parsedInput() {
        return tagIngredients(preview ? draftInput(JSON.parse(json)) : contentSchema.parse(JSON.parse(json)));
    }
    async function save() {
        const parsed = parsedInput();
        if (selected && (parsed.title !== selected.title || parsed.source.url !== selected.source.url))
            throw new Error('Naslov ili izvor pripadaju novom unosu. Klikni „Sačuvaj kao novi nacrt“; prethodna stavka neće biti prepisana.');
        const result = await request(selected ? `/admin/content/${selected.id}` : "/admin/content", selected ? "PUT" : "POST", parsed, selected?.version);
        setSelected(result.item);
        setJson(JSON.stringify(tagIngredients(preview ? draftInput(result.item) : contentSchema.parse(result.item)), null, 2));
        await refresh();
        setMessage(result.duplicate
            ? "Duplikat pronađen. Postojeća stavka je učitana; nije prepisana."
            : "Nacrt je sačuvan. Svaka izmjena zahtijeva novi pregled.");
    }
    async function transition(action: "review" | "publish" | "unpublish") {
        if (!selected)
            return;
        if (JSON.stringify(parsedInput()) !==
            JSON.stringify(tagIngredients(preview ? draftInput(selected) : contentSchema.parse(selected))))
            throw new Error("Prvo sačuvaj izmjene JSON-a.");
        if (action === "publish" &&
            !window.confirm(tx("Potvrđuješ li provjeru činjenica, izvora, alergena i prava na sliku?")))
            return;
        const result = await request(`/admin/content/${selected.id}/${action}`, "POST", undefined, selected.version);
        if (action === 'publish')
            resetEditor();
        else
            setSelected(result.item);
        await refresh();
        setMessage(action === 'publish' ? `Objavljeno: ${result.item.title}. Stavka je u Biblioteci; obrazac je spreman za novi unos.` : labels[result.item.status as keyof typeof labels]);
    }
    function updateVerification(field: "factsVerified" | "allergensVerified" | "rightsConfirmed", value: boolean) {
        try {
            const data = JSON.parse(json);
            if (field === "rightsConfirmed")
                data.image.rightsConfirmed = value;
            else
                data[field] = value;
            setJson(JSON.stringify(data, null, 2));
        }
        catch {
            setMessage("Prvo unesi validan JSON.");
        }
    }
    async function imageFile(file: File, packageInput?: ContentInput) {
        if (!["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type) ||
            file.size > 15 * 1024 * 1024)
            throw new Error("Izaberi PNG, JPG, WebP ili AVIF do 15 MB.");
        setMessage("Slika se obrađuje u pregledniku: čitanje i proporcionalno smanjivanje…");
        const bitmap = await createImageBitmap(file);
        try {
            if (bitmap.width * bitmap.height > 40000000)
                throw new Error("Slika je prevelika (maksimalno 40 megapiksela).");
            const canvas = document.createElement("canvas");
            const ratio = Math.min(1, 1440 / Math.max(bitmap.width, bitmap.height));
            canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
            canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
            canvas
                .getContext("2d")!
                .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
            setMessage("Priprema optimizirane slike bez rezanja i razvlačenja…");
            const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Optimizacija nije uspjela.")), "image/webp", 0.84));
            const stem = file.name
                .replace(/\.[^.]+$/, "")
                .replace(/[^a-zA-Z0-9_-]/g, "-")
                .slice(0, 70) || "random-image";
            const name = `${stem}-${crypto.randomUUID().slice(0, 8)}.${blob.type === "image/webp" ? "webp" : "png"}`;
            let imported=false;
            if(packageInput){
                const input=tagIngredients({...packageInput,image:{...packageInput.image,path:`/media/${name}`,rightsConfirmed:false}});
                await putPreviewImage(input.image.path,blob);imported=true;
                setSelected(null);setCategory(input.category);setSource(input.source.url);setJson(JSON.stringify(input,null,2));
            } else if (preview)
                await putPreviewImage(`/media/${name}`, blob);
            setStaged({ url: URL.createObjectURL(blob), name, bytes: blob.size, width: canvas.width, height: canvas.height, originalWidth: bitmap.width, originalHeight: bitmap.height, originalBytes: file.size, format: blob.type === "image/webp" ? "WebP" : "PNG" });
            setOriginal({ url: URL.createObjectURL(file), name: file.name });
            if (!packageInput && json.trim()) {
                const data = JSON.parse(json);
                data.image.path = `/media/${name}`;
                data.image.rightsConfirmed = false;
                setJson(JSON.stringify(data, null, 2));
            }
            if(imported){setMessage(locale==='en'?'ZIP loaded for review. Check content and image, then click Save draft.':'ZIP je učitan za pregled. Provjeri sadržaj i sliku, zatim klikni Sačuvaj nacrt.');return;}
            setMessage(preview ? "Slika je optimizirana i sačuvana u ovom pregledniku. Sačuvaj nacrt i potvrdi prava prije objave." : "Slika je obrađena lokalno. Preuzmi je u services/api/public/media, sačuvaj nacrt i ponovo provjeri prije objave. Original ostaje dostupan za preuzimanje.");
        }
        finally {
            bitmap.close();
        }
    }
    let parsed: ReturnType<typeof contentSchema.safeParse> | null = null;
    try {
        parsed = contentSchema.safeParse(JSON.parse(json));
    }
    catch {
        /* preserve pasted input */
    }
    const inspection=inspectImport(json);
    const raw=inspection.raw;
    let draftValid:ContentInput|null=null;try{draftValid=draftInput(raw);}catch{}
    const valid = parsed?.success ? tagIngredients(parsed.data) : null;
    function mapIngredient(index: number, tag: string) {
        try {
            const data = JSON.parse(json);
            if (tag)
                data.ingredients[index].tag = tag;
            else
                delete data.ingredients[index].tag;
            setJson(JSON.stringify(data, null, 2));
        }
        catch {
            setMessage("Prvo unesi validan JSON recepta.");
        }
    }
    const displayValid = valid ? localizeContent(valid, locale) : null;
    const translationOwner=valid??editableSource(json);
    const activeTranslation = translationOwner?.translations?.[translationLocale];
    function editTranslation(field: string, value: unknown) { try {
        const data = JSON.parse(json);
        data.translations ??= {};
        data.translations[translationLocale] = { ...(data.translations[translationLocale] ?? {}), [field]: value, reviewed: false };
        setJson(JSON.stringify(data, null, 2));
    }
    catch {
        setMessage('Prvo unesi validan JSON.');
    } }
    function reviewTranslation(code: Locale, value: boolean) { try {
        const data = JSON.parse(json);
        if (!data.translations?.[code])
            throw Error();
        data.translations[code].reviewed = value;
        setJson(JSON.stringify(data, null, 2));
    }
    catch {
        setMessage('Prvo dodaj obje jezičke verzije u JSON.');
    } }
    useEffect(()=>{
      setAtlasQueue(existing=>{const assigned=new Set(existing.flatMap(b=>b.cells.map(c=>c.key)));const additional=planAtlasBatches(missing.filter(entry=>!assigned.has(entry.key))).ready;if(!additional.length)return existing;const queue=[...existing,...additional];try{localStorage.setItem('random-life.atlas-queue.v1',JSON.stringify(queue));}catch{setStorageWarning(locale==='en'?'Atlas queue could not be saved. Download its manifest before closing this tab.':'Atlas red nije sačuvan. Preuzmi manifest prije zatvaranja taba.');}return queue;});
    },[missing]);
    const atlasPlan={ready:atlasQueue};
    const issues = valid ? publicationIssues(valid) : inspection.errors;
    const count = (c: Category) => items.filter((i) => i.category === c &&
        i.status === "published" &&
        !publicationIssues(i).length).length;
    return (<div className="layout">
      <aside>
        <div className="brand">R A N D O M <em className="logo-life">life</em></div>
        <p className="muted">Content Studio</p>
        <button className="nav quiet" onClick={()=>setBrowse(true)}>Base browser &amp; editor</button>
        <div className="nav active">{tx("\u2726 Uredni\u010Dki stol")}</div>
        <div className="nav">{tx("EAT \u00B7 recepti")}</div>
        <div className="nav">{tx("READ \u00B7 knjige")}</div><div className="nav">{tx("WATCH \u00B7 filmovi i serije")}</div><div className="nav">{tx("MOVE \u00B7 aktivnosti")}</div><div className="nav">{tx("GO \u00B7 izlasci")}</div>
        <div className="aside-note">{tx("AI priprema.")}<br />{tx("\u010Covjek odlu\u010Duje.")}<p>{tx("Ru\u010Dni ChatGPT workflow.")}<br />{tx("Bez API tro\u0161kova.")}</p>
        </div>
      </aside>
      <main>
        <header>
          <div>
            <p className="eyebrow">{tx("OD DOBRE IDEJE DO DOBRE PREPORUKE")}</p>
            <h1>{tx("Tvoj uredni\u010Dki stol.")}</h1>
            <p className="muted">{tx("Pripremi, provjeri i objavi. Jedna kvalitetna stavka vi\u0161e.")}</p>
          </div>
          <span className="badge">{tx("Lokalni razvoj")}</span>
        </header>
        {!preview && <section className="connection">
          <label>{tx("API adresa")}<input disabled={busy} value={api} onChange={(e) => {
                setApi(e.target.value);
                setConnected(false);
            }}/>
            <small className="input-help">{tx("Unesi adresu lokalno pokrenutog API-ja, pa pove\u017Ei Studio.")}</small>
          </label>
          <label>{tx("Lokalni admin token")}<input disabled={busy} type="password" autoComplete="off" value={token} onChange={(e) => {
                setToken(e.target.value);
                setConnected(false);
            }}/>
          </label>
          <p className="input-help">{tx("Token preuzmi iz svoje lokalne konfiguracije; ne \u0161alji ga u ChatGPT.")}</p>
          <button disabled={busy || !token} onClick={() => run(refresh)}>{tx("Pove\u017Ei Studio")}</button>
          <span>{connected ? tx("\u25CF Povezano") : tx("\u25CB Nije povezano")}</span>
        </section>}
        <p className="note">{preview ? tx("Lokalni preview Studio: sadr\u017Eaj i slike ostaju u ovom pregledniku. Objavljeni izbori se pojavljuju u RANDOM previewu. Bez API tro\u0161kova.") : tx("Token se \u010Duva samo u memoriji ovog taba. Studio je dostupan samo lokalno dok ne odaberemo administratorsku prijavu.")}</p>
        <section className="stats">
          <div>
            <span>EAT</span>
            <strong>
              {count("EAT")} <small>/ 50</small>
            </strong>
            <p>{tx("odobrenih recepata")}</p>
          </div>
          <div>
            <span>READ</span>
            <strong>
              {count("BOOK")} <small>/ 50</small>
            </strong>
            <p>{tx("odobrenih knjiga")}</p>
          </div>
          <div>
            <span>{tx("NA UREDNI\u010CKOM STOLU")}</span>
            <strong>
              {items.filter((i) => i.status !== "published").length}
            </strong>
            <p>{tx("nacrta i pregleda")}</p>
          </div>
        </section>
        <div className="actions studio-mode"><button className={!browse?'selected':'quiet'} onClick={()=>setBrowse(false)}>{locale==='en'?'Prompt creator & editor':'Kreator prompta i uređivanje'}</button><button className={browse?'selected':'quiet'} onClick={()=>setBrowse(true)}>Base browser &amp; editor</button></div>
        {browse&&<BaseBrowser samples={samples} items={items} preview={preview} locale={locale} busy={busy} onEdit={openRecord}/>}
        <div className={`workspace ${browse?'browse-hidden':''}`}>
          <section className="editor card">
            <fieldset className="editor-lock" disabled={busy}>
              <div className="section-head">
                <h2>{selected ? tx("Uredi stavku") : tx("Nova preporuka")}</h2>
                <button className="quiet" onClick={resetEditor}>{tx("Novi nacrt +")}</button>
              </div>
              {selected && <p className="editing-status">{tx("Ure\u0111uje\u0161:")}{localizeContent(selected,locale).title} · {tx(labels[selected.status])}{tx(". Za drugi recept koristi novi nacrt.")}</p>}
              {selected && <button className="quiet" onClick={() => { setSelected(null); setStaged(null); setOriginal(null); setCopied(null); }}>{tx("Sa\u010Duvaj kao novi nacrt")}</button>}
              <details open className="prompt-builder"><summary>{locale==='en'?'1. URL or source → 2. Copy prompt into ChatGPT':'1. URL ili izvor → 2. Kopiraj prompt u ChatGPT'}</summary>
              <div className="tabs">
                {(["EAT", "BOOK", "WATCH", "MOVE", "GO"] as const).map((c) => (<button key={c} className={category === c ? "selected" : "quiet"} onClick={() => { if (c !== category && json.trim() && !window.confirm(tx("Otvoriti prazni obrazac za drugu kategoriju? Sa\u010Duvani recept ostaje u biblioteci.")))
            return; if (c !== category)
            resetEditor(); setCategory(c); }}>
                    {c === "BOOK" ? "READ" : c}
                  </button>))}
              </div>
              <p className="input-help">{tx("1. Prona\u0111i pouzdan izvor za recept ili knjigu. Izaberi EAT, READ, WATCH, MOVE ili GO. Svaka kategorija ima svoj JSON i prompt.")}</p>
              <label>{tx("Izvor za ChatGPT")}<textarea rows={3} placeholder={category === "EAT"
            ? tx("URL ili tekst recepta i napomene o izvoru\u2026") : category === "BOOK" ? tx("Naslov, autor, izdanje i bibliografski izvor\u2026") : category === "WATCH" ? tx("Naslov filma/serije, pouzdan izvor, platforma i napomene\u2026") : tx("Aktivnost ili izlazak, pouzdan izvor, oprema, mjesto i napomene\u2026")} value={source} onChange={(e) => setSource(e.target.value)}/>
              </label>
              <p className="input-help">{locale==='en'?'Enter a URL, source text or inspiration, author and relevant notes. These become part of the prompt.':'Unesi URL, tekst izvora ili inspiraciju, autora i važne napomene. To postaje dio prompta.'}</p>
              <div className="actions">
                <button className={`quiet ${promptCopied ? "prompt-copied" : ""}`} disabled={busy || (!source.trim() && !valid)} onClick={() => run(async () => {
            await navigator.clipboard.writeText(createChatGPTPrompt(category, valid ? JSON.stringify(valid) : source));
            setCopied({ signature: promptSignature, at: new Date().toISOString() });
            setMessage(locale==='en'?'Prompt copied. Return one ZIP from ChatGPT.':'Prompt kopiran. Vrati jedan ZIP iz ChatGPT-a.');
        })}>
                  {promptCopied ? tx("\u2713 Prompt kopiran") : tx("Kopiraj ChatGPT prompt \u2197")}
                </button>
                <button className="quiet" onClick={() => {
            const demo = samples.find(i => i.category === category);
            if (!demo) {
                setMessage(tx("Za ovu kategoriju prvo unesi izvor i kopiraj prompt."));
                return;
            }
            setSelected(null);
            setJson(JSON.stringify({
                ...demo,
                factsVerified: false,
                image: { ...demo.image, rightsConfirmed: false },
                translations: Object.fromEntries(Object.entries(demo.translations ?? {}).map(([code, t]) => [code, { ...t, reviewed: false }])),
                ...(demo.category === "EAT"
                    ? { allergensVerified: false }
                    : {}),
            }, null, 2));
            setStaged(null);
            setOriginal(null);
        }}>{tx("U\u010Ditaj demo nacrt")}</button>
              </div>
              {promptCopied && <p className="copy-status" role="status">{tx("\u2713 Kopirano")} {new Date(copied!.at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}{tx(". Spremno za ru\u010Dno lijepljenje u ChatGPT; slanje nije automatsko.")}</p>}
              <p className="input-help">{locale==='en'?'2. Copy the prompt into ChatGPT and download its ZIP with JSON and the generated image. Import the ZIP below. No API requests or API costs.':'2. Kopiraj prompt u ChatGPT i preuzmi ZIP sa JSON-om i generisanom slikom. Uvezi ZIP ispod. Nema API poziva ni troškova.'}</p>
              </details>
              {preview && <section className="zip-import"><h3>{locale==='en'?'3. Import ChatGPT ZIP':'3. Uvezi ChatGPT ZIP'}</h3><p>{locale==='en'?'Paste the prompt into ChatGPT, download its ZIP containing content.json and one image, then select it here. Studio reads both languages, category and image. Review them below, then Save draft. Existing items are never overwritten.':'Zalijepi prompt u ChatGPT, preuzmi ZIP sa content.json i jednom slikom, pa ga izaberi ovdje. Studio čita oba jezika, kategoriju i sliku. Pregledaj ih ispod, zatim sačuvaj nacrt. Postojeći unosi se ne prepisuju.'}</p><label>{locale==='en'?'ChatGPT content ZIP':'ChatGPT ZIP sadržaja'}<input type="file" accept=".zip,application/zip" disabled={busy} onChange={e=>{const file=e.target.files?.[0];if(file)run(async()=>{setZipUpload({name:file.name,state:'loading'});try{if(file.size>25*1024*1024)throw new Error('ZIP exceeds 25 MB.');const pack=readContentPackage(new Uint8Array(await file.arrayBuffer()));await imageFile(new File([new Uint8Array(pack.image.bytes)],pack.image.name,{type:pack.image.mime}),pack.input);setZipUpload({name:file.name,state:'saved'});}catch(error){setZipUpload({name:file.name,state:'error',error:error instanceof Error?error.message:String(error)});throw error;}});}}/></label>{zipUpload && <div data-testid="zip-import-status" className={`zip-upload-status ${zipUpload.state}`} role={zipUpload.state==='error'?'alert':undefined}><strong>{zipUpload.name}</strong><p>{zipUpload.state==='loading'?(locale==='en'?'Reading ZIP and checking content…':'Čitam ZIP i provjeravam sadržaj…'):zipUpload.state==='saved'?(locale==='en'?'✓ ZIP loaded for review. Category, both languages and image came from this ZIP. Not saved to the library yet.':'✓ ZIP učitan za pregled. Kategorija, oba jezika i slika pročitani su iz ZIP-a. Još nije sačuvano u biblioteci.'):(locale==='en'?'ZIP was not imported. Your existing items are unchanged.':'ZIP nije uvezen. Postojeći unosi nisu izmijenjeni.')}</p>{zipUpload.error&&<p>{zipUpload.error}</p>}</div>}</section>}

              {valid && <section className="review-preview" aria-label={locale==='en'?'Content review preview':'Pregled sadržaja za provjeru'}><h3>{locale==='en'?'4. Human review · content & image':'4. Ljudska provjera · sadržaj i slika'}</h3><div className="tabs">{(['en','bs'] as const).map(code=><button type="button" key={code} className={translationLocale===code?'selected':'quiet'} onClick={()=>setTranslationLocale(code)}>{code==='en'?'ENG':'BHS'}</button>)}</div><Photo item={valid} preview={preview} locale={translationLocale}/><h2>{localizeContent(valid,translationLocale).title}</h2><p>{localizeContent(valid,translationLocale).summary}</p>{valid.category==='BOOK'&&<p>{valid.authors.join(', ')}</p>}{valid.category==='WATCH'&&<p>{valid.format} · {valid.year} · {localizeContent(valid,translationLocale).category==='WATCH'?localizeContent(valid,translationLocale).durationLabel:''} · {valid.platform}</p>}<a href={valid.source.url} target="_blank" rel="noreferrer">{localizeContent(valid,translationLocale).source.label}</a>{valid.category==='EAT'&&<><p>{valid.totalMinutes} min · {valid.servings} {locale==='en'?'servings':'porcija'}</p><h4>{locale==='en'?'Ingredients':'Sastojci'}</h4><ul>{valid.ingredients.map((ingredient,index)=><li key={index}>{valid.translations?.[translationLocale]?.ingredientNames?.[index]??ingredient.name} · {ingredient.quantity} {valid.translations?.[translationLocale]?.ingredientUnits?.[index]??ingredient.unit}</li>)}</ul><p>{locale==='en'?'Allergens':'Alergeni'}: {valid.allergens.join(', ')||'—'}</p></>}{'steps' in valid&&<ol>{(valid.translations?.[translationLocale]?.steps??valid.steps).map((step,index)=><li key={index}>{step}</li>)}</ol>}<p>{locale==='en'?'Review the source, both translations, image and applicable dietary claims. Importing does not save or publish the item.':'Provjeri izvor, oba prevoda, sliku i odgovarajuće prehrambene oznake. Uvoz ne čuva niti objavljuje stavku.'}</p></section>}
              {json.trim() && <details className="package-data"><summary>{locale==='en'?'Imported package data · read only':'Podaci iz paketa · samo pregled'}</summary><label>{locale==='en'?'Imported package data':'Podaci iz uvezenog paketa'}<textarea readOnly className="json" rows={10} spellCheck={false} value={json}/></label></details>}
              {json.trim() && inspection.errors.length>0 && <section className="validation-errors" role="alert"><strong>{locale==='en'?'JSON needs attention':'JSON zahtijeva ispravke'}</strong><ul>{inspection.errors.map((error,index)=><li key={index}>{error}</li>)}</ul>{preview&&draftValid&&<p>{locale==='en'?'You can save incomplete translations as local draft work. Publication remains blocked.':'Nepotpune prevode možeš sačuvati kao lokalni nacrt. Objava ostaje blokirana.'}</p>}</section>}
              {raw && <button className="quiet" type="button" onClick={()=>{try{const repair=recoverImport(raw);setRecoveryBackup(json);setJson(JSON.stringify(repair.data,null,2));setMessage(repair.corrections.length?repair.corrections.join('\n'):(locale==='en'?'No safe metadata corrections needed. Review validation paths.':'Nema sigurnih ispravki metapodataka. Provjeri navedena polja.'));}catch(e){setMessage(String(e));}}}>{locale==='en'?'Repair import metadata (review required)':'Ispravi metapodatke uvoza (provjera obavezna)'}</button>}
              {recoveryBackup&&<details><summary>{locale==='en'?'Original JSON before repair':'Originalni JSON prije ispravke'}</summary><textarea readOnly value={recoveryBackup} rows={8}/></details>}
              {translationOwner && <section className="translation-editor" aria-label={tx("Jezi\u010Dke verzije")}>
                <h3>{tx("ENG i BHS \u00B7 jedna preporuka")}</h3>
                <p className="input-help">{tx("Prompt uvijek tra\u017Ei obje verzije. Koli\u010Dine, alergeni, izvor i slika su zajedni\u010Dki. Prevode provjeri odvojeno; bez obje kompletne verzije nema objave.")}</p>
                <div className="tabs">{(['en', 'bs'] as const).map(code => <button type="button" className={translationLocale === code ? 'selected' : 'quiet'} key={code} onClick={() => setTranslationLocale(code)}>{code === 'en' ? 'ENG' : 'BHS'}</button>)}</div>
                {!activeTranslation ? <p role="alert">{tx("Nedostaje ova jezi\u010Dka verzija. Kopiraj dvojezi\u010Dni prompt i vrati JSON sa translations.en i translations.bs.")}</p> : <>
                 <label>{tx("Prevedeni naslov")}<input value={activeTranslation.title} onChange={e => editTranslation('title', e.target.value)}/></label>
                 <label>{tx("Prevedeni opis")}<textarea value={activeTranslation.summary} rows={3} onChange={e => editTranslation('summary', e.target.value)}/></label>
                 <label>{locale==='en'?'Translated source label':'Prevedeni naziv izvora'}<input value={activeTranslation.sourceLabel} onChange={e=>editTranslation('sourceLabel',e.target.value)}/></label>
                 <label>{locale==='en'?'Translated rights note':'Prevedena napomena o pravima'}<textarea rows={2} value={activeTranslation.rightsNote} onChange={e=>editTranslation('rightsNote',e.target.value)}/></label>
                 <label>{tx("Opis slike")}<input value={activeTranslation.imageAlt} onChange={e => editTranslation('imageAlt', e.target.value)}/></label>
                 {activeTranslation.recommendationReason !== undefined && <label>{tx("Razlog preporuke")}<textarea rows={3} value={activeTranslation.recommendationReason} onChange={e => editTranslation('recommendationReason', e.target.value)}/></label>}
                 {activeTranslation.steps?.map((step, index) => <label key={index}>{tx("Korak")} {index + 1}<textarea value={step} rows={2} onChange={e => editTranslation('steps', activeTranslation.steps!.map((s, i) => i === index ? e.target.value : s))}/></label>)}
                 {translationOwner.category === 'EAT' && activeTranslation.ingredientNames?.map((name, index) => <div className="translation-ingredient" key={index}><label>{tx("Prevedeni sastojak")}<input value={name} onChange={e => editTranslation('ingredientNames', activeTranslation.ingredientNames!.map((n, i) => i === index ? e.target.value : n))}/></label><label>{tx("Jedinica")}<input value={activeTranslation.ingredientUnits?.[index] ?? ''} onChange={e => editTranslation('ingredientUnits', (activeTranslation.ingredientUnits ?? []).map((unit, i) => i === index ? e.target.value : unit))}/></label></div>)}
                </>}
                <div className="translation-reviews">{(['en', 'bs'] as const).map(code => <label key={code}><input type="checkbox" disabled={!translationOwner?.translations?.[code]} checked={translationOwner.translations?.[code]?.reviewed ?? false} onChange={e => reviewTranslation(code, e.target.checked)}/>{code === 'en' ? tx("Provjerio/la sam ENG prevod") : tx("Provjerio/la sam BHS prevod")}</label>)}</div>
              </section>}
              {valid?.category === "EAT" && (<section className="ingredient-mapper" aria-label={tx("Povezivanje sastojaka")}>
                  <h3>{tx("Ikone sastojaka")}</h3>
                  <p className="input-help">{tx("Prepoznati nazivi automatski dobiju oznaku pri \u010Duvanju. Za ostale izaberi odgovaraju\u0107i sastojak; naziv i koli\u010Dina ostaju tvoji. Oznaka ikone ne potvr\u0111uje alergene.")}</p>
                  {valid.ingredients.map((ingredient, index) => {
                const definition = resolveIngredient(ingredient.name, ingredient.tag);
                return (<div className="ingredient-row" key={index}>
                        {definition && <span className="ingredient-sprite" aria-hidden="true" style={{ backgroundPosition: `${definition.column * 100 / 9}% ${definition.row * 100 / 9}%` }}/>}
                        <label>
                          {displayValid?.category === 'EAT' ? displayValid.ingredients[index].name : ingredient.name}
                          <select aria-label={`${tx(tx("Ikona za"))} ${displayValid?.category === 'EAT' ? displayValid.ingredients[index].name : ingredient.name}`} value={definition?.id ?? ""} onChange={e => mapIngredient(index, e.target.value)}>
                            <option value="">{tx("Bez prepoznate oznake")}</option>
                            {ingredientDefinitions.map(entry => <option key={entry.id} value={entry.id}>{locale==='en'?entry.id.replace(/-/g,' '):entry.name} · {entry.id}</option>)}
                          </select>
                          <small className="input-help">{definition ? `Oznaka: ${definition.id}` : tx("Naziv nije prepoznat; izaberi ikonu ako postoji.")}</small>
                        </label>
                      </div>);
            })}
                  <details>
                    <summary>{tx("Pregled svih 100 sastojaka")}</summary>
                    <div className="ingredient-atlas-grid">{ingredientDefinitions.map(entry => <div key={entry.id} title={entry.id}><span className="ingredient-sprite" aria-hidden="true" style={{ backgroundPosition: `${entry.column * 100 / 9}% ${entry.row * 100 / 9}%` }}/><span>{locale==='en'?entry.id.replace(/-/g,' '):entry.name}</span></div>)}</div>
                  </details>
                  <button className="quiet" onClick={() => run(async () => { await navigator.clipboard.writeText(ingredientDefinitions.map(entry => `${entry.id}: ${locale==='en'?entry.id.replace(/-/g,' '):entry.name}`).join("\n")); setMessage(tx("Lista oznaka sastojaka je kopirana.")); })}>{tx("Kopiraj listu oznaka")}</button>
                </section>)}
              {valid && <p className="input-help">{locale==='en'?'The ZIP image is optimized automatically: longest side up to 1440 px, proportional scaling, WebP quality 84%. Review the imported content below.':'Slika iz ZIP-a automatski se optimizira: duža stranica najviše 1440 px, proporcionalno smanjivanje, WebP kvaliteta 84%. Pregledaj uvezeni sadržaj ispod.'}</p>}
              {staged && (<div className="staged">
                  <img src={staged.url} alt={tx("Lokalni pregled uvezene slike")}/>
                  <div>
                    <a href={staged.url} download={staged.name}>{tx("Preuzmi optimiziranu sliku")}</a>
                    <p>
                      {staged.name} · {staged.width} × {staged.height} px · {staged.format} · {Math.round(staged.bytes / 1024)} KB
                    </p>
                    <p>{tx("Original:")}{staged.originalWidth} × {staged.originalHeight} px · {Math.round(staged.originalBytes / 1024)} KB
                    </p>
                    {original && (<a href={original.url} download={original.name}>{tx("Sa\u010Duvaj original lokalno")}</a>)}
                  </div>
                </div>)}
              <p className="note">{preview ? tx("Slika se automatski optimizira i \u010Duva lokalno. Original mo\u017Ee\u0161 zasebno preuzeti; prije objave potvrdi prava.") : <>{tx("Ovo nije cloud upload. Optimiziranu sliku dodaj u")}<code>services/api/public/media</code>{tx("; objava provjerava da je asset dostupan. Za public test potreban je novi deployment.")}</>}</p>
              {valid?.classification && <section className="copy-status"><strong>{locale==='en'?'AI category suggestion':'AI prijedlog kategorije'}: {valid.classification.suggestedCategory==='BOOK'?'READ':valid.classification.suggestedCategory}</strong><p>{valid.classification.reason[locale]}</p></section>}
              {valid?.dietaryAssessment && <section className="copy-status"><strong>{locale==='en'?'AI dietary suggestions · human confirmation required':'AI prijedlog ograničenja · čovjek potvrđuje'}</strong><p>Gluten: {valid.dietaryAssessment.gluten} · {locale==='en'?'Lactose':'Laktoza'}: {valid.dietaryAssessment.lactose}</p><p>{valid.dietaryAssessment.notes[locale]}</p></section>}
              {valid?.category==='EAT' && <section className="copy-status"><strong>{locale==='en'?'Low-phosphate diet':'Prehrana s malo fosfora'}</strong><p>{valid.phosphateAssessment?.notes[locale]??(locale==='en'?'No phosphate assessment supplied. This recipe will not be recommended to a low-phosphate profile.':'Procjena fosfora nije priložena. Ovaj recept neće biti preporučen profilu s prehranom s malo fosfora.')}</p>{valid.phosphateAssessment && <><p>{locale==='en'?'AI suggestion':'AI prijedlog'}: {valid.phosphateAssessment.suitability}{valid.phosphateAssessment.phosphorusMgPerServing!==undefined?` · ${valid.phosphateAssessment.phosphorusMgPerServing} mg/${locale==='en'?'serving':'porcija'}`:''}</p><label><input type="checkbox" disabled={valid.phosphateAssessment.suitability!=='low'} checked={valid.phosphateAssessment.reviewed} onChange={e=>{const data=JSON.parse(json);data.phosphateAssessment.reviewed=e.target.checked;data.dietaryTags=data.dietaryTags.filter((tag:string)=>tag!=='low-phosphate');if(e.target.checked)data.dietaryTags.push('low-phosphate');setJson(JSON.stringify(data,null,2));}}/>{locale==='en'?'I verified the low-phosphate classification and evidence':'Provjerio/la sam klasifikaciju s malo fosfora i njenu osnovu'}</label><p>{locale==='en'?'Phosphate restriction is individual; this classification does not imply low potassium, low sodium or suitability for every kidney patient.':'Ograničenje fosfora je individualno; ova oznaka ne znači nizak kalij, nizak natrij niti prikladnost za svakog bubrežnog bolesnika.'}</p></>}</section>}
              <fieldset>
                <legend>{tx("Ljudska provjera")}</legend>
                <label>
                  <input type="checkbox" checked={raw?.factsVerified === true} onChange={(e) => updateVerification("factsVerified", e.target.checked)}/>{" "}{tx("Provjerio/la sam \u010Dinjenice i izvor")}</label>
                {raw?.category === "EAT" && (<label>
                    <input type="checkbox" checked={raw?.allergensVerified === true} onChange={(e) => updateVerification("allergensVerified", e.target.checked)}/>{" "}{tx("Provjerio/la sam sastojke i alergene")}</label>)}
                <label>
                  <input type="checkbox" checked={raw?.image?.rightsConfirmed === true} onChange={(e) => updateVerification("rightsConfirmed", e.target.checked)}/>{" "}{tx("Potvr\u0111ujem prava na sliku")}</label>
              </fieldset>
              <p className="input-help">{tx("6. Li\u010Dno provjeri \u010Dinjenice i izvor, sastojke i alergene te pravo kori\u0161tenja fotografije. Ozna\u010Di samo ono \u0161to si stvarno provjerio/la.")}</p>
              {!!issues.length && (<ul className="warnings">
                  {issues.map((i) => (<li key={i}>{tx(i)}</li>))}
                </ul>)}
              <h3>{locale==='en'?'5. Save draft':'5. Sačuvaj nacrt'}</h3>
              <div className="actions">
                <button disabled={busy || !connected || !(preview ? draftValid : valid)} onClick={() => run(save)}>{tx("Sa\u010Duvaj nacrt")}</button>
                {selected && (<>
                    <button className="quiet" disabled={busy} onClick={() => run(() => transition("review"))}>{tx("Na pregled")}</button>
                    <button disabled={busy || selected.status !== "review" || !!issues.length} onClick={() => run(() => transition("publish"))}>{tx("Odobri i objavi")}</button>
                    {selected.status === "published" && (<button className="quiet" disabled={busy} onClick={() => run(() => transition("unpublish"))}>{tx("Povuci iz objave")}</button>)}
                  </>)}
              </div>
              <p className="input-help">{tx("7. Sa\u010Duvaj nacrt, po\u0161alji ga na pregled i nakon provjere odobri objavu. Svaku novu izmjenu prvo sa\u010Duvaj i ponovo pregledaj.")}</p>
            </fieldset>
          </section>
          <section className="library card">
            {preview&&<section className="storage-summary"><h3>{locale==='en'?'Library & recovery':'Biblioteka i oporavak'}</h3><p>{items.length} {locale==='en'?'saved items in this browser':'sačuvanih stavki u ovom browseru'} · {samples.length} {locale==='en'?'built-in demo items available in Base browser':'demo stavki dostupnih u Base browseru'}</p><p>{locale==='en'?'Local storage belongs to this browser and website address. Another browser or address has a separate library. A version update does not clear it.':'Lokalni podaci pripadaju ovom browseru i adresi stranice. Drugi browser ili adresa imaju drugu biblioteku. Promjena verzije je ne briše.'}</p><button className="quiet" onClick={()=>run(refresh)}>{locale==='en'?'Reload saved library':'Ponovo učitaj biblioteku'}</button><label>{locale==='en'?'Restore content backup JSON':'Vrati JSON backup sadržaja'}<input type="file" accept=".json,application/json" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)run(async()=>{if(file.size>10*1024*1024)throw Error('Backup exceeds 10 MB.');const result=await restorePreviewBackup(JSON.parse(await file.text()));await refresh();setMessage(locale==='en'?`${result.added} items restored as drafts; ${result.skipped} existing items left unchanged. Backup image paths do not contain the image files.`:`${result.added} stavki vraćeno kao nacrt; ${result.skipped} postojećih stavki sačuvano bez izmjene. Putanje slika u backupu nisu fajlovi slika.`);});}}/></label></section>}
            <section className="missing-illustrations" aria-label={tx("Namirnice bez ilustracije")}>
              <h2>{tx("Namirnice bez ilustracije")}</h2>
              <p className="input-help">{tx("Kumulativna lista iz svih sa\u010Duvanih recepata i validnog trenutnog unosa. Ne bri\u0161e se kad zapo\u010Dne\u0161 drugi recept. Novi atlas i tagovi moraju se povezati u sljede\u0107oj verziji aplikacije.")}</p>
              {atlasPlan.ready.map(batch=><section className="atlas-ready" role="status" key={batch.atlasId}><strong>{tx('Atlas serija spremna · 100 sastojaka')}</strong><p>{tx('Manifest je pripremljen za originalnu PNG sliku 10 × 10. Slika još nije generisana; nakon generisanja potreban je ljudski pregled.')}</p><button className="quiet" onClick={()=>run(async()=>{await navigator.clipboard.writeText(atlasBatchPrompt(batch));setMessage(tx('Prompt atlas serije kopiran.'));})}>{tx('Kopiraj prompt atlas serije')}</button><button className="quiet" onClick={()=>{const url=URL.createObjectURL(new Blob([atlasBatchManifestJson(batch)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`${batch.atlasId}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}}>{tx('Preuzmi manifest atlas serije')}</button></section>)}
              {unresolvedIngredients(missing).length ? <><ul>{unresolvedIngredients(missing).map(entry => <li key={entry.key}><strong>{entry.names?.[locale]??entry.name}{locale==='en'&&!entry.names?.en?' (BHS)':''}</strong><small>{entry.recipes.join(' · ')}</small></li>)}</ul><button className="quiet" onClick={() => run(async () => { await navigator.clipboard.writeText(missingAtlasPrompt(unresolvedIngredients(missing))); setMessage(tx("Popis i prompt za nove ilustracije kopirani.")); })}>{tx("Kopiraj listu za novi atlas (")}{unresolvedIngredients(missing).length})</button></> : <p>{tx("Nema evidentiranih sastojaka bez ilustracije.")}</p>}
            </section>

            <div className="section-head">
              <h2>{tx("Biblioteka")}</h2>
              <span>{items.length} {tx("stavki")}</span>
              <button className="quiet" onClick={downloadLibrary}>{tx("Preuzmi backup JSON")}</button>
            </div>
            <p className="input-help">{tx("Biblioteka je lokalna za ovaj browser i ovu adresu. Preuzmi backup JSON prije brisanja podataka; slike se preuzimaju odvojeno. Osvje\u017Eenje verzije aplikacije ne bri\u0161e biblioteku.")}</p>
            {preview && <details className="translation-batch"><summary>{locale==='en'?'Translate existing EAT recipes · batch':'Prevedi postojeće EAT recepte · grupa'}</summary><p>{locale==='en'?'Copies complete originals with IDs and versions. Paste translations only; all entries are checked before any write. Images and recipes stay in place. Every affected recipe becomes an unchecked draft.':'Kopira kompletne originale sa ID i verzijom. Zalijepi samo prevode; svi unosi se provjeravaju prije čuvanja. Slike i recepti ostaju sačuvani. Svaki izmijenjeni recept postaje neprovjeren nacrt.'}</p><button className="quiet" disabled={busy||!items.some(needsTranslationRepair)} onClick={()=>run(async()=>{await navigator.clipboard.writeText(batchTranslationPrompt(items.filter(needsTranslationRepair)));setMessage(locale==='en'?'Batch prompt copied.':'Grupni prompt kopiran.');})}>{locale==='en'?'Copy recipe translation batch prompt':'Kopiraj grupni prompt za prevode'}</button><label>{locale==='en'?'Upload translation batch JSON':'Uvezi JSON grupnih prevoda'}<input type="file" accept=".json,application/json" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)run(async()=>{if(file.size>2*1024*1024)throw Error('Translation file exceeds 2 MB.');setBatchJSON(await file.text());});}}/></label><label>{locale==='en'?'Batch translation JSON':'JSON grupnih prevoda'}<textarea value={batchJSON} onChange={e=>setBatchJSON(e.target.value)} rows={8}/></label><button disabled={busy||!batchJSON.trim()} onClick={()=>run(async()=>{const count=await applyPreviewTranslationBatch(JSON.parse(batchJSON));await refresh();setSelected(null);setMessage(locale==='en'?`${count} recipes updated as drafts. Review each translation before publishing.`:`${count} recepata sačuvano kao nacrt. Pregledaj svaki prevod prije objave.`);setBatchJSON('');})}>{locale==='en'?'Validate and apply all translations':'Provjeri i primijeni sve prevode'}</button></details>}
            {preview && <details className="saved-revisions"><summary onClick={() => readPreviewRevisions().then(setRevisions).catch(e => setMessage(e.message))}>{tx("Historija sa\u010Duvanih unosa \u00B7 oporavak ranijeg recepta")}</summary><p className="input-help">{tx("Ako je sa\u010Duvani recept kasnije promijenio naslov, ovdje potra\u017Ei njegov raniji zapis. U\u010Ditava se kao novi nacrt i tra\u017Ei novu provjeru; ne mijenja postoje\u0107u stavku. Unos koji nikad nije sa\u010Duvan ovdje nije dostupan.")}</p>{revisions.map((record, index) => <button className="quiet revision-entry" key={`${record.id}-${index}`} onClick={() => { resetEditor(); setCategory(record.category); setSource(record.source.url); const data = draftInput(record); setJson(JSON.stringify({ ...data, factsVerified: false, image: { ...data.image, rightsConfirmed: false }, ...(data.category === 'EAT' ? { allergensVerified: false } : {}) }, null, 2)); setMessage(tx("Ranija verzija u\u010Ditana kao novi nacrt. Provjeri podatke i sa\u010Duvaj.")); }}>{localizeContent(record,locale).title} · {tx("verzija")} {record.version}</button>)}</details>}
            <input aria-label={tx("Pretra\u017Ei sadr\u017Eaj")} placeholder={tx("Pretra\u017Ei naslov\u2026")} value={search} onChange={(e) => setSearch(e.target.value)}/>
            <p className="input-help">{tx("Prona\u0111i sa\u010Duvanu stavku po naslovu i otvori je za izmjenu ili pregled. Status pokazuje da li je nacrt, na pregledu ili objavljena.")}</p>
            {!items.length && (<div className="empty">
                ✦
                <h3>{tx("Prva dobra preporuka")}<br />{tx("po\u010Dinje ovdje.")}</h3>
                <p>{tx("Pove\u017Ei Studio i uvezi prvi nacrt.")}<br />{tx("Test tra\u017Ei 50 + 50 stvarnih stavki.")}</p>
              </div>)}
            {items
            .filter((i) => [i.title,...Object.values(i.translations??{}).map(t=>t?.title)].some(title=>typeof title==='string'&&title.toLocaleLowerCase(locale).includes(search.toLocaleLowerCase(locale))))
            .map((i) => (<button disabled={busy} key={i.id} className="item" onClick={() => openRecord(i)}>
                  <span className="item-category">{i.category === "BOOK" ? "READ" : i.category}</span>
                  <strong>{localizeContent(i, locale).title}</strong><span className="locale-status">{(['en','bs'] as const).map(code=><small key={code}>{code==='en'?'ENG':'BHS'} {i.translations?.[code]?.reviewed?'✓':tx('nedostaje pregled')}</small>)}</span>
                  <span className={`status ${i.status}`}>
                    {tx(labels[i.status])}
                  </span>
                  <small>{tx("Verzija")} {i.version}</small>
                </button>))}
          </section>
        </div>
        {!!storageWarning && <p role="alert">{tx(storageWarning)}</p>}
        {!!message && (<pre role="status" className="message">
            {tx(message)}
          </pre>)}
      </main>
    </div>);
}
