import {
  contentSchema,
  localizeContent,
  type Locale,
  publicationIssues,
  selectRecommendation,
  spinContextSchema,
  type ContentRecord,
  type ContentInput,
  type ContentStatus,
} from "@random/shared";

interface Env {
  CONTENT_DB: D1Database;
  ADMIN_TOKEN?: string;
  ALLOWED_ORIGINS?: string;
  ASSETS?: Fetcher;
}
interface Row {
  id: string;
  data: string;
  status: ContentStatus;
  version: number;
  updated_at: string;
  approved_by: string | null;
  approved_at: string | null;
}
const columns = "id,data,status,version,updated_at,approved_by,approved_at";
function record(row: Row): ContentRecord {
  return {
    ...contentSchema.parse(JSON.parse(row.data)),
    id: row.id,
    status: row.status,
    version: row.version,
    updatedAt: row.updated_at,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
  };
}
function publicItem(item: ContentRecord) {
  const { approvedBy, approvedAt, ...publicData } = item;
  return {...publicData,translations:Object.fromEntries(Object.entries(publicData.translations??{}).filter(([,t])=>t.reviewed))};
}
function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
async function input(request: Request): Promise<unknown> {
  if (!request.headers.get("Content-Type")?.startsWith("application/json"))
    throw new Error("JSON_REQUIRED");
  const raw = await request.text();
  if (raw.length > 65536) throw new Error("BODY_TOO_LARGE");
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("INVALID_JSON");
  }
}
async function key(item: ContentInput) {
  const identity =
    item.category === "BOOK" && item.isbn
      ? item.isbn
      : `${item.source.url}|${item.title.trim().toLowerCase()}`;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${item.category}|${identity}`),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
async function find(env: Env, id: string) {
  const row = await env.CONTENT_DB.prepare(
    `SELECT ${columns} FROM content_items WHERE id=?`,
  )
    .bind(id)
    .first<Row>();
  return row ? record(row) : null;
}
function event(
  env: Env,
  item: ContentRecord,
  action: string,
  revisionToken?: string,
) {
  const query = revisionToken
    ? "INSERT INTO editorial_events(id,content_id,action,actor,version,snapshot,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM content_items WHERE id=? AND revision_token=?)"
    : "INSERT INTO editorial_events(id,content_id,action,actor,version,snapshot,created_at) VALUES (?,?,?,?,?,?,?)";
  const args = [
    crypto.randomUUID(),
    item.id,
    action,
    "local-editor",
    item.version,
    JSON.stringify(item),
    new Date().toISOString(),
  ];
  if (revisionToken) args.push(item.id, revisionToken);
  return env.CONTENT_DB.prepare(query).bind(...args);
}
async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  if (path === "/health")
    return json({
      ok: true,
      service: "RANDOM",
      mode: "manual-content-no-ai-api",
    });
  if (path.startsWith("/admin/")) {
    // Development-only adapter. No admin route can be deployed publicly with this shared token.
    if (
      !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
      !env.ADMIN_TOKEN
    )
      return json(
        { error: "Administracija nije konfigurirana za ovaj host." },
        503,
      );
    if (request.headers.get("Authorization") !== `Bearer ${env.ADMIN_TOKEN}`)
      return json({ error: "Prijava je potrebna." }, 401);
  }
  if (path === "/catalog" && request.method === "GET") {
    const rows = await env.CONTENT_DB.prepare(
      `SELECT ${columns} FROM content_items WHERE status='published' ORDER BY updated_at DESC LIMIT 500`,
    ).all<Row>();
    const requested:Locale=url.searchParams.get('locale')==='bs'?'bs':'en';
    return json({
      locale:requested,
      items: rows.results
        .map(record)
        .filter((item) => !publicationIssues(item).length)
        .map(item=>publicItem(localizeContent(item,requested))),
    });
  }
  if (path === "/spin" && request.method === "POST") {
    const parsed = spinContextSchema.safeParse(await input(request));
    if (!parsed.success)
      return json(
        {
          error: "Neispravan kontekst preporuke.",
          issues: parsed.error.issues,
        },
        400,
      );
    const rows = await env.CONTENT_DB.prepare(
      `SELECT ${columns} FROM content_items WHERE status='published' AND category=? LIMIT 500`,
    )
      .bind(parsed.data.category)
      .all<Row>();
    const selected = selectRecommendation(
      rows.results.map(record),
      parsed.data,
    );
    return json({
      recommendationId: crypto.randomUUID(),
      item: selected ? publicItem(localizeContent(selected,parsed.data.language==='bs'?'bs':'en')) : null,
      reason: selected
        ? "Odabrano iz provjerenog kataloga uz tvoja ograničenja."
        : "Nema odgovarajuće preporuke. Ograničenja nisu promijenjena.",
    });
  }
  if (path === "/admin/content" && request.method === "GET") {
    const rows = await env.CONTENT_DB.prepare(
      `SELECT ${columns} FROM content_items ORDER BY updated_at DESC LIMIT 500`,
    ).all<Row>();
    return json({ items: rows.results.map(record) });
  }
  if (path === "/admin/content" && request.method === "POST") {
    const parsed = contentSchema.safeParse(await input(request));
    if (!parsed.success)
      return json(
        {
          error: "JSON ne odgovara ugovoru sadržaja.",
          issues: parsed.error.issues,
        },
        400,
      );
    const dedup = await key(parsed.data);
    const existing = await env.CONTENT_DB.prepare(
      `SELECT ${columns} FROM content_items WHERE dedup_key=?`,
    )
      .bind(dedup)
      .first<Row>();
    if (existing) return json({ item: record(existing), duplicate: true });
    const item: ContentRecord = {
      ...parsed.data,
      id: crypto.randomUUID(),
      status: "draft",
      version: 1,
      updatedAt: new Date().toISOString(),
      approvedBy: null,
      approvedAt: null,
    };
    try {
      await env.CONTENT_DB.batch([
        env.CONTENT_DB.prepare(
          "INSERT INTO content_items(id,dedup_key,category,data,updated_at) VALUES (?,?,?,?,?)",
        ).bind(
          item.id,
          dedup,
          item.category,
          JSON.stringify(parsed.data),
          item.updatedAt,
        ),
        event(env, item, "import"),
      ]);
    } catch (error) {
      // A concurrent identical import may win the unique constraint after our read.
      const winner = await env.CONTENT_DB.prepare(
        `SELECT ${columns} FROM content_items WHERE dedup_key=?`,
      )
        .bind(dedup)
        .first<Row>();
      if (winner) return json({ item: record(winner), duplicate: true });
      throw error;
    }
    return json({ item }, 201);
  }
  const match = path.match(
    /^\/admin\/content\/([a-zA-Z0-9-]+)(?:\/(review|publish|unpublish))?$/,
  );
  if (match) {
    const item = await find(env, match[1]);
    if (!item) return json({ error: "Stavka nije pronađena." }, 404);
    if (!["PUT", "POST"].includes(request.method))
      return json({ error: "Metoda nije podržana." }, 405);
    if (request.headers.get("If-Match") !== `"${item.version}"`)
      return json(
        {
          error:
            "Stavka je promijenjena u drugom tabu. Učitaj najnoviju verziju iz biblioteke prije izmjene.",
        },
        409,
      );
    let next = { ...item };
    let data: ContentInput = contentSchema.parse(item);
    if (!match[2] && request.method === "PUT") {
      const parsed = contentSchema.safeParse(await input(request));
      if (!parsed.success)
        return json(
          { error: "Neispravan sadržaj.", issues: parsed.error.issues },
          400,
        );
      if (parsed.data.category !== item.category)
        return json({ error: "Kategorija se ne može mijenjati." }, 400);
      data = parsed.data;
      next = {
        ...item,
        ...data,
        status: "draft",
        approvedBy: null,
        approvedAt: null,
      };
    } else if (match[2] && request.method === "POST") {
      if (match[2] === "publish") {
        if (item.status !== "review")
          return json({ error: "Prvo pošalji stavku na pregled." }, 409);
        const issues = publicationIssues(item);
        if (issues.length)
          return json({ error: issues.join(" "), issues }, 422);
        if (env.ASSETS) {
          const image = await env.ASSETS.fetch(
            new Request(new URL(item.image.path, request.url)),
          );
          if (
            !image.ok ||
            !image.headers.get("Content-Type")?.startsWith("image/")
          )
            return json(
              {
                error:
                  "Statička slika nije dostupna. Prvo je dodaj u public/media.",
              },
              422,
            );
        }
        next.status = "published";
        next.approvedBy = "local-editor";
        next.approvedAt = new Date().toISOString();
      } else {
        next.status = match[2] === "review" ? "review" : "draft";
        next.approvedBy = null;
        next.approvedAt = null;
      }
    } else return json({ error: "Metoda nije podržana." }, 405);
    next.version = item.version + 1;
    next.updatedAt = new Date().toISOString();
    const revisionToken = crypto.randomUUID();
    const statements = [
      env.CONTENT_DB.prepare(
        "UPDATE content_items SET data=?,status=?,version=?,updated_at=?,approved_by=?,approved_at=?,dedup_key=?,revision_token=? WHERE id=? AND version=?",
      ).bind(
        JSON.stringify(data),
        next.status,
        next.version,
        next.updatedAt,
        next.approvedBy,
        next.approvedAt,
        await key(data),
        revisionToken,
        item.id,
        item.version,
      ),
      event(env, next, match[2] ?? "edit", revisionToken),
    ];
    try {
      const results = await env.CONTENT_DB.batch(statements);
      if (results[0].meta.changes !== 1)
        return json(
          {
            error:
              "Stavka je upravo promijenjena. Učitaj novu verziju prije ponovnog pokušaja.",
          },
          409,
        );
    } catch {
      return json(
        { error: "Izmjena nije sačuvana; provjeri duplikat i pokušaj ponovo." },
        409,
      );
    }
    return json({ item: next });
  }
  if (path.startsWith("/media/") && env.ASSETS)
    return env.ASSETS.fetch(request);
  return json({ error: "Putanja nije pronađena." }, 404);
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim());
    if (origin && !allowed.includes(origin))
      return json({ error: "Origin nije dozvoljen." }, 403);
    let response: Response;
    if (request.method === "OPTIONS")
      response = new Response(null, { status: 204 });
    else {
      try {
        response = await route(request, env);
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (
          ["JSON_REQUIRED", "INVALID_JSON", "BODY_TOO_LARGE"].includes(message)
        )
          response = json(
            { error: "Pošalji validan JSON do 64 KB." },
            message === "BODY_TOO_LARGE" ? 413 : 400,
          );
        else
          response = json(
            {
              error:
                "Zahtjev nije završen. Provjeri lokalne migracije i konfiguraciju.",
            },
            500,
          );
      }
    }
    const headers = new Headers(response.headers);
    if (origin) {
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Vary", "Origin");
    }
    headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, If-Match",
    );
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    return new Response(response.body, { status: response.status, headers });
  },
};
