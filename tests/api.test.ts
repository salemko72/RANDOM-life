import { beforeAll, afterAll, it, expect } from "vitest";
import { Miniflare } from "miniflare";
import { build } from "esbuild";
import { readFile, readdir } from "node:fs/promises";
import { demoItems } from "@random/shared";

let mf: Miniflare;
const token = "local-test-token-never-deploy";
beforeAll(async () => {
  const output = await build({
    entryPoints: ["services/api/src/index.ts"],
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    target: "es2022",
  });
  mf = new Miniflare({
    modules: true,
    script: output.outputFiles[0].text,
    compatibilityDate: "2026-08-01",
    d1Databases: ["CONTENT_DB"],
    bindings: { ADMIN_TOKEN: token, ALLOWED_ORIGINS: "http://localhost:5173" },
  });
  const db = await mf.getD1Database("CONTENT_DB");
  const directory = "services/api/migrations";
  const names = (await readdir(directory))
    .filter((name) => name.endsWith(".sql"))
    .sort();
  const migration = (
    await Promise.all(
      names.map((name) => readFile(`${directory}/${name}`, "utf8")),
    )
  ).join("\n");
  await db.batch(
    migration
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => db.prepare(s)),
  );
}, 30000);
afterAll(async () => {
  if (mf) await mf.dispose();
});
async function call(
  path: string,
  method = "GET",
  body?: unknown,
  auth = true,
  expectedVersion?: number,
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (auth) headers.Authorization = `Bearer ${token}`;
  const id = path.match(/^\/admin\/content\/([^/]+)/)?.[1];
  if (id && ["PUT", "POST"].includes(method)) {
    const db = await mf.getD1Database("CONTENT_DB");
    const row = await db
      .prepare("SELECT version FROM content_items WHERE id=?")
      .bind(id)
      .first<{ version: number }>();
    if (row) headers["If-Match"] = `"${expectedVersion ?? row.version}"`;
  }
  const response = await mf.dispatchFetch("http://localhost" + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, data: (await response.json()) as any };
}
it("unauthorized requests never expose drafts", async () => {
  expect((await call("/admin/content", "GET", undefined, false)).status).toBe(
    401,
  );
});
it("JSON import, review, publish, spin, edit and unpublish use real local D1", async () => {
  const created = await call("/admin/content", "POST", demoItems[0]);
  expect(created.status).toBe(201);
  const id = created.data.item.id;
  expect(created.data.item.status).toBe("draft");
  expect((await call("/catalog")).data.items).toEqual([]);
  expect((await call(`/admin/content/${id}/publish`, "POST")).status).toBe(409);
  expect((await call(`/admin/content/${id}/review`, "POST")).status).toBe(200);
  expect((await call(`/admin/content/${id}/publish`, "POST")).status).toBe(200);
  const spin = await call("/spin", "POST", { category: "EAT" });
  expect(spin.data.item.id).toBe(id);
  expect(spin.data.item).not.toHaveProperty("approvedBy");
  expect(
    (
      await call("/spin", "POST", {
        category: "EAT",
        excludedAllergens: ["milk"],
      })
    ).data.item,
  ).toBeNull();
  const edited = await call(`/admin/content/${id}`, "PUT", {
    ...demoItems[0],
    title: "Reviewed edit",
  });
  expect(edited.data.item.status).toBe("draft");
  expect((await call("/catalog")).data.items).toEqual([]);
  await call(`/admin/content/${id}/review`, "POST");
  await call(`/admin/content/${id}/publish`, "POST");
  expect((await call(`/admin/content/${id}/unpublish`, "POST")).status).toBe(
    200,
  );
  expect((await call("/catalog")).data.items).toEqual([]);
  const db = await mf.getD1Database("CONTENT_DB");
  const audit = await db
    .prepare(
      "SELECT COUNT(*) AS count FROM editorial_events WHERE content_id = ?",
    )
    .bind(id)
    .first<{ count: number }>();
  expect(audit?.count).toBeGreaterThanOrEqual(7);
});
it("BOOK publication requires source verification", async () => {
  const created = await call("/admin/content", "POST", {
    ...demoItems[1],
    factsVerified: false,
  });
  const id = created.data.item.id;
  await call(`/admin/content/${id}/review`, "POST");
  const result = await call(`/admin/content/${id}/publish`, "POST");
  expect(result.status).toBe(422);
  expect(result.data.error).toContain("provjer");
});
it("duplicate import returns existing content without resetting status", async () => {
  const first = await call("/admin/content", "POST", demoItems[1]);
  const second = await call("/admin/content", "POST", demoItems[1]);
  expect(second.status).toBe(200);
  expect(second.data.item.id).toBe(first.data.item.id);
});
it("malformed inputs and unexpected routes return useful errors", async () => {
  expect((await call("/spin", "POST", { category: "BOOKING" })).status).toBe(
    400,
  );
  expect(
    (await call("/admin/content", "POST", { title: "invalid" })).status,
  ).toBe(400);
  expect((await call("/unknown")).status).toBe(404);
});
it("missing admin secret fails closed", async () => {
  const output = await build({
    entryPoints: ["services/api/src/index.ts"],
    bundle: true,
    write: false,
    format: "esm",
  });
  const closed = new Miniflare({
    modules: true,
    script: output.outputFiles[0].text,
    compatibilityDate: "2026-08-01",
    d1Databases: ["CONTENT_DB"],
  });
  try {
    expect(
      (await closed.dispatchFetch("http://localhost/admin/content")).status,
    ).toBe(503);
  } finally {
    await closed.dispose();
  }
});
it("rejects an edit from a stale tab without overwriting newer content", async () => {
  const item = { ...demoItems[0], title: "Version test" };
  const created = await call("/admin/content", "POST", item);
  const id = created.data.item.id;
  expect(
    (
      await call(
        `/admin/content/${id}`,
        "PUT",
        { ...item, title: "Newer edit" },
        true,
        1,
      )
    ).status,
  ).toBe(200);
  expect(
    (await call(`/admin/content/${id}`, "PUT", item, true, 1)).status,
  ).toBe(409);
  const rows = (await call("/admin/content")).data.items;
  expect(rows.find((row: any) => row.id === id).title).toBe("Newer edit");
});
it("simultaneous changes commit only one new version and one event", async () => {
  const item = { ...demoItems[0], title: "Concurrent test" };
  const created = await call("/admin/content", "POST", item);
  const id = created.data.item.id;
  const results = await Promise.all([
    call(
      `/admin/content/${id}`,
      "PUT",
      { ...item, title: "Concurrent A" },
      true,
      1,
    ),
    call(
      `/admin/content/${id}`,
      "PUT",
      { ...item, title: "Concurrent B" },
      true,
      1,
    ),
  ]);
  expect(results.map((r) => r.status).sort()).toEqual([200, 409]);
  const db = await mf.getD1Database("CONTENT_DB");
  expect(
    (
      await db
        .prepare(
          "SELECT COUNT(*) AS count FROM editorial_events WHERE content_id=?",
        )
        .bind(id)
        .first<{ count: number }>()
    )?.count,
  ).toBe(2);
});
it("concurrent duplicate imports return the same item without duplicate audit rows", async () => {
  const item = { ...demoItems[1], title: "Concurrent import" };
  const results = await Promise.all([
    call("/admin/content", "POST", item),
    call("/admin/content", "POST", item),
  ]);
  expect(results.map((r) => r.status).sort()).toEqual([200, 201]);
  expect(results[0].data.item.id).toBe(results[1].data.item.id);
  const db = await mf.getD1Database("CONTENT_DB");
  expect(
    (
      await db
        .prepare(
          "SELECT COUNT(*) AS count FROM editorial_events WHERE content_id=?",
        )
        .bind(results[0].data.item.id)
        .first<{ count: number }>()
    )?.count,
  ).toBe(1);
});

it('imports all new categories into D1 using their own structured fields',async()=>{
 for(const category of ['WATCH','MOVE','GO'] as const){
  const base={...demoItems[1],title:'API '+category,category,factsVerified:false};
  const fields=category==='WATCH'?{format:'Film',year:2020,durationLabel:'90 min',platform:'Test',genres:['Drama'],recommendationReason:'Za test'}:{subtype:category==='MOVE'?'yoga':'cafe',durationMinutes:15,intensity:'low',equipment:[],steps:['Provjeri uslove.'],company:'solo',genres:['Mir'],recommendationReason:'Za test'};
  const created=await call('/admin/content','POST',{...base,...fields});
  expect(created.status).toBe(201);expect(created.data.item.category).toBe(category);
 }
});
