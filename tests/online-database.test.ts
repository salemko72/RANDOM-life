import { afterAll, beforeAll, it, expect } from 'vitest';
import { Miniflare } from 'miniflare';
import { build } from 'esbuild';
import { demoCatalog } from '@random/shared';
import sharp from 'sharp';
let mf: Miniflare, cookie: string, bytes: Buffer;
const origin = 'https://studio.example';
async function call(path: string, method = 'GET', data?: unknown, auth = true, withOrigin = true) { const headers: Record<string, string> = { 'Content-Type': 'application/json' }; if (auth && cookie)
    headers.Cookie = cookie; if (withOrigin)
    headers.Origin = origin; const response = await mf.dispatchFetch(origin + path, { method, headers, body: data === undefined ? undefined : JSON.stringify(data) }); return { response, data: await response.json() as any }; }
beforeAll(async () => { const result = await build({ stdin: { contents: "import {handleDatabase} from './services/artwork/database'; export default {fetch:handleDatabase}", resolveDir: process.cwd() }, bundle: true, write: false, format: 'esm', platform: 'browser', target: 'es2022' }); mf = new Miniflare({ modules: true, script: result.outputFiles[0].text, compatibilityDate: '2026-08-01', d1Databases: ['CONTENT_DB'], bindings: { RANDOM_STUDIO_PASSWORD: 'only-for-tests' } }); const login = await call('/api/database/login', 'POST', { password: 'only-for-tests' }, false); expect(login.response.status).toBe(200); cookie = login.response.headers.get('set-cookie')!.split(';')[0]; bytes = await sharp({ create: { width: 8, height: 8, channels: 3, background: 'red' } }).webp().toBuffer(); }, 30000);
afterAll(async () => { await mf?.dispose(); });
async function upload(name: string) { return mf.dispatchFetch(origin + '/api/database/media/' + name, { method: 'PUT', headers: { Origin: origin, Cookie: cookie, 'Content-Type': 'image/webp' }, body: bytes }); }
it('exposes the contributor contract publicly and rejects unauthenticated link upgrades',async()=>{
 const contract=await call('/api/content-contract','GET',undefined,false);
 expect(contract.response.status).toBe(200);expect(contract.data.contractVersion).toBe(2);
 expect(contract.data.accessLinks.optional).toBe(true);
 expect((await call('/api/database/upgrade-access-links','POST',{},false)).response.status).toBe(401);
});
it('backfills only missing book/watch links, preserving approval and media, idempotently',async()=>{
 const db=await mf.getD1Database('CONTENT_DB');
 const input=structuredClone(demoCatalog.find(i=>i.category==='BOOK')!);
 const row={...input,id:'links-upgrade-book',status:'published',version:3,updatedAt:'2026-10-01T00:00:00Z',approvedBy:'human',approvedAt:'2026-10-01T00:00:00Z'};
 await db.prepare('INSERT INTO random_items(id,dedup,category,data,status,version,updated_at,approved_by,approved_at,revision) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(row.id,row.id,'BOOK',JSON.stringify(input),row.status,row.version,row.updatedAt,row.approvedBy,row.approvedAt,'original').run();
 const before=await db.prepare('SELECT * FROM random_items WHERE id=?').bind(row.id).first<any>();
 const result=await call('/api/database/upgrade-access-links','POST',{});
 expect(result.response.status).toBe(200);expect(result.data.updated).toBe(1);
 const after=await db.prepare('SELECT * FROM random_items WHERE id=?').bind(row.id).first<any>();
 expect(after.status).toBe(before.status);expect(after.approved_by).toBe(before.approved_by);expect(after.approved_at).toBe(before.approved_at);expect(after.version).toBe(4);
 const upgraded=JSON.parse(after.data);expect(upgraded.accessLinks).toHaveLength(2);
 expect(upgraded.accessLinks.every((l:any)=>l.kind==='search'&&!l.verified)).toBe(true);
 delete upgraded.accessLinks;expect(upgraded).toEqual(JSON.parse(before.data));
 expect((await call('/api/database/upgrade-access-links','POST',{})).data.updated).toBe(0);
 expect((await db.prepare("SELECT COUNT(*) AS n FROM random_events WHERE content_id=? AND action='access-links-upgrade'").bind(row.id).first<any>()).n).toBe(1);
 // Keep the rest of this suite's established public-catalog counts independent.
 await db.prepare('DELETE FROM random_items WHERE id=?').bind(row.id).run();
});
function record(id: string, path: string) { return { ...demoCatalog[0], id, version: 7, updatedAt: '2026-10-01T12:00:00.000Z', image: { ...demoCatalog[0].image, path }, status: 'published', approvedBy: 'human-editor', approvedAt: '2026-10-01T12:00:00.000Z' }; }
it('enforces editor authentication and exact Origin', async () => { expect((await call('/api/content', 'GET', undefined, false)).response.status).toBe(401); expect((await call('/api/content', 'POST', { input: demoCatalog[0] }, true, false)).response.status).toBe(403); const status=await call('/api/database/status', 'GET', undefined, false); expect(status.data).toMatchObject({authenticated:false,configured:true,ok:true}); expect(status.response.headers.get('access-control-allow-origin')).toBeNull(); const catalog=await call('/api/catalog','GET',undefined,false); expect(catalog.response.headers.get('access-control-allow-origin')).toBe('*'); });
it('migrates IDs and approval metadata, deduplicates, and preserves history', async () => { expect((await upload('shared.webp')).status).toBe(200); const item = record('local-record', '/media/shared.webp'); const events = [{ id: 'local-event', action: 'publish', actor: 'original-human', version: 7, snapshot: item, createdAt: item.updatedAt }, {item,action:'reviewed',at:item.updatedAt}]; const migrated = await call('/api/database/migrate', 'POST', { item, events }); expect(migrated.response.status).toBe(201); expect(migrated.data.item).toMatchObject({ id: item.id, version: 7, approvedBy: 'human-editor', __storage: 'd1' }); expect((await call('/api/database/migrate', 'POST', { item, events })).data.idempotent).toBe(true); expect((await call('/api/database/migrate', 'POST', { item: { ...item, id: 'duplicate' } })).data).toMatchObject({ duplicate: true, item: { id: item.id } }); expect((await call('/api/database/migrate', 'POST', { item: { ...item, summary: 'conflicting content' } })).response.status).toBe(409); const admin = await call('/api/content'); expect(admin.data.events.some((e: any) => e.id === 'local-event' && e.actor === 'original-human')).toBe(true); expect((await call('/api/catalog', 'GET', undefined, false)).data.items).toHaveLength(1); expect((await mf.dispatchFetch(origin + '/media/shared.webp')).status).toBe(200); });
it('keeps missing media and human-unverified drafts private', async () => { await upload('draft.webp'); const draft = { ...record('draft', '/media/draft.webp'), title: 'A draft title', factsVerified: false }; const migrated = await call('/api/database/migrate', 'POST', { item: draft }); expect(migrated.data.item.status).toBe('review'); expect((await mf.dispatchFetch(origin + '/media/draft.webp')).status).toBe(404); expect((await mf.dispatchFetch(origin + '/media/draft.webp', { headers: { Cookie: cookie } })).status).toBe(200); expect((await call('/api/catalog', 'GET', undefined, false)).data.items.every((i: any) => i.id !== 'draft')).toBe(true); });
it('guards concurrent updates and records only the winning update and deletion', async () => { const original = (await call('/api/content')).data.items.find((i: any) => i.id === 'local-record'); const updates = await Promise.all([call('/api/content', 'POST', { input: { ...original, summary: 'first update' }, id: original.id, version: 7 }), call('/api/content', 'POST', { input: { ...original, summary: 'second update' }, id: original.id, version: 7 })]); expect(updates.map(x => x.response.status).sort()).toEqual([200, 409]); let admin = await call('/api/content'); expect(admin.data.events.filter((e: any) => e.content_id === 'local-record' && e.action === 'update')).toHaveLength(1); expect((await call('/api/content/local-record', 'DELETE', { version: 7 })).response.status).toBe(409); expect((await call('/api/content/local-record', 'DELETE', { version: 8 })).response.status).toBe(200); admin = await call('/api/content'); expect(admin.data.events.filter((e: any) => e.action === 'delete')).toHaveLength(1); expect(admin.data.items.some((i: any) => i.id === 'local-record')).toBe(false); expect((await mf.dispatchFetch(origin + '/media/shared.webp')).status).toBe(404); });
it('limits login attempts persistently and rejects changed media', async () => { const altered = await sharp({ create: { width: 8, height: 8, channels: 3, background: 'blue' } }).webp().toBuffer(); const conflict = await mf.dispatchFetch(origin + '/api/database/media/shared.webp', { method: 'PUT', headers: { Origin: origin, Cookie: cookie, 'Content-Type': 'image/webp' }, body: altered }); expect(conflict.status).toBe(409); for (let i = 0; i < 9; i++)
    expect((await call('/api/database/login', 'POST', { password: 'wrong' }, false)).response.status).toBe(401); expect((await call('/api/database/login', 'POST', { password: 'only-for-tests' }, false)).response.status).toBe(429); });
it('imports whole catalog batches atomically and resets human approval',async()=>{
 const first=record('batch-a','/media/shared.webp'),second={...record('batch-b','/media/shared.webp'),title:'Batch second title'};
 const initial=await call('/api/database/import-batch','POST',{items:[{item:first},{item:second}]});
 expect(initial.response.status).toBe(200);expect(initial.data.items.every((item:any)=>item.status==='review'&&!item.factsVerified&&!item.image.rightsConfirmed&&item.approvedBy===null)).toBe(true);
 const before=(await call('/api/content')).data;
 const stale=await call('/api/database/import-batch','POST',{items:[{item:{...first,summary:'must not update'},expectedVersion:7},{item:second,expectedVersion:6}]});
 expect(stale.response.status).toBe(409);expect((await call('/api/content')).data).toEqual(before);
 const batch={items:[{item:{...first,summary:'new first'},expectedVersion:7},{item:{...second,summary:'new second'},expectedVersion:7}]};
 const concurrent=await Promise.all([call('/api/database/import-batch','POST',batch),call('/api/database/import-batch','POST',batch)]);
 expect(concurrent.map(result=>result.response.status).sort()).toEqual([200,409]);
 const after=(await call('/api/content')).data;
 expect(after.items.filter((item:any)=>item.id.startsWith('batch-')).map((item:any)=>item.version)).toEqual([8,8]);
 expect(after.events.filter((event:any)=>event.action==='catalog-import')).toHaveLength(4);
 const db=await mf.getD1Database('CONTENT_DB');expect((await db.prepare('SELECT COUNT(*) AS count FROM random_batch_guards').first<any>()).count).toBe(0);
});

it('serves public D1 BLOB media as exact binary bytes and reports configured health',async()=>{
 const status=await call('/api/database/status','GET',undefined,false);expect(status.data).toMatchObject({configured:true,databaseConfigured:true,passwordConfigured:true,ok:true,authenticated:false});
 const health=await call('/api/database/health','GET',undefined,false);expect(health.response.status).toBe(200);expect(health.data).toEqual({ok:true,database:true});
 await upload('binary.webp');
 const item={...record('binary-public','/media/binary.webp'),title:'Unique binary media test'};
 expect((await call('/api/database/migrate','POST',{item})).response.status).toBe(201);
 const response=await mf.dispatchFetch(origin+'/media/binary.webp');expect(response.status).toBe(200);expect(response.headers.get('content-type')).toBe('image/webp');expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array(bytes));
});

it('keeps online deletion tombstones from restoring retained local migration copies',async()=>{
 await upload('tombstone.webp');const item={...record('tombstone-local','/media/tombstone.webp'),title:'Unique retained local tombstone'};
 expect((await call('/api/database/migrate','POST',{item})).response.status).toBe(201);
 expect((await call('/api/content/tombstone-local','DELETE',{version:7})).response.status).toBe(200);
 const retry=await call('/api/database/migrate','POST',{item});expect(retry.response.status).toBe(409);expect(retry.data.error).toBe('MIGRATED_ITEM_DELETED');
 const admin=(await call('/api/content')).data;expect(admin.deletedIds).toContain(item.id);expect(admin.items.some((row:any)=>row.id===item.id)).toBe(false);
});

it('migrates history larger than 64KiB in aggregate but caps each snapshot',async()=>{
 await upload('history.webp');const item={...record('large-history','/media/history.webp'),title:'Unique large history record'};
 const events=Array.from({length:5},(_,index)=>({item:{...item,summary:'x'.repeat(2000),notes:'history'.repeat(2500),version:index+1},action:'updated',at:new Date(Date.UTC(2026,9,index+1)).toISOString()}));
 expect(new TextEncoder().encode(JSON.stringify({item,events})).byteLength).toBeGreaterThan(65536);
 expect((await call('/api/database/migrate','POST',{item,events})).response.status).toBe(201);
 const oversized={item:{...item,id:'oversized-history',title:'Unique oversized history'},events:[{item:{...item,padding:'x'.repeat(65536)},action:'updated',at:item.updatedAt}]};
 const rejection=await call('/api/database/migrate','POST',oversized);expect(rejection.response.status).toBe(413);expect(rejection.data.error).toBe('EVENT_SNAPSHOT_TOO_LARGE');
 expect((await call('/api/content')).data.items.some((record:any)=>record.id==='oversized-history')).toBe(false);
});

it('reports authenticated D1 size including retained media and history',async()=>{
 expect((await call('/api/database/storage','GET',undefined,false)).response.status).toBe(401);
 const stats=await call('/api/database/storage');expect(stats.response.status).toBe(200);
 expect(stats.data.databaseBytes).toBeGreaterThan(0);expect(stats.data.mediaBytes).toBeGreaterThan(0);
 expect(stats.data.items).toBeGreaterThan(0);expect(stats.data.databaseLimitBytes).toBe(500000000);
 expect(stats.data.measuredAt).toBeTruthy();
});

it('serves a published image without parsing unrelated legacy records',async()=>{
 await upload('isolated.webp');const item={...record('isolated-media','/media/isolated.webp'),title:'Isolated published media'};
 expect((await call('/api/database/migrate','POST',{item})).response.status).toBe(201);
 const db=await mf.getD1Database('CONTENT_DB');
 await db.prepare('INSERT INTO random_items(id,dedup,category,data,status,version,updated_at,revision) VALUES (?,?,?,?,?,?,?,?)').bind('legacy-unrelated','legacy-unrelated','EAT','{}','draft',1,'2026-10-01','old').run();
 try{const r=await mf.dispatchFetch(origin+'/media/isolated.webp');expect(r.status).toBe(200);expect(new Uint8Array(await r.arrayBuffer())).toEqual(new Uint8Array(bytes));}
 finally{await db.prepare('DELETE FROM random_items WHERE id IN (?,?)').bind('legacy-unrelated','isolated-media').run();}
});
it('shares only the requested approved published record without editorial identities',async()=>{
 const db=await mf.getD1Database('CONTENT_DB'),input=structuredClone(demoCatalog.find(i=>i.category==='EAT')!);
 await db.prepare('INSERT INTO random_items(id,dedup,category,data,status,version,updated_at,approved_by,approved_at,revision) VALUES (?,?,?,?,?,?,?,?,?,?)').bind('share-test','share-test','EAT',JSON.stringify(input),'published',1,'2026-10-18T00:00:00Z','private-editor','2026-10-18T00:00:00Z','first').run();
 const result=await call('/api/shared-item/share-test','GET',undefined,false);expect(result.response.status).toBe(200);expect(result.data.item.id).toBe('share-test');expect(result.data.items).toBeUndefined();expect(result.data.item.approvedBy).toBeUndefined();expect(result.data.item.approvedAt).toBeUndefined();
 await db.prepare("UPDATE random_items SET status='review' WHERE id='share-test'").run();expect((await call('/api/shared-item/share-test','GET',undefined,false)).response.status).toBe(404);
 expect((await call('/api/shared-item/unknown-id','GET',undefined,false)).response.status).toBe(404);
 await db.prepare("UPDATE random_items SET status='published',approved_by=NULL WHERE id='share-test'").run();expect((await call('/api/shared-item/share-test','GET',undefined,false)).response.status).toBe(404);
});
