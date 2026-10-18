import { contentSchema, publicationIssues, contentContract,defaultAccessLinks,visibleAccessLinks,resetAccessLinkReviews, type ContentRecord, type ContentInput } from '@random/shared';
export interface DatabaseEnv {
    CONTENT_DB?: D1Database;
    RANDOM_STUDIO_PASSWORD?: string;
}
const encoder = new TextEncoder();
const cookieName = 'random_studio';
const json = (value: unknown, status = 200, headers: Record<string, string> = {}) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
const schema = [
    'CREATE TABLE IF NOT EXISTS random_items (id TEXT PRIMARY KEY,dedup TEXT NOT NULL UNIQUE,category TEXT NOT NULL,data TEXT NOT NULL,status TEXT NOT NULL,version INTEGER NOT NULL,updated_at TEXT NOT NULL,approved_by TEXT,approved_at TEXT,revision TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS random_media (path TEXT PRIMARY KEY,bytes BLOB NOT NULL,mime TEXT NOT NULL,hash TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS random_events (id TEXT PRIMARY KEY,content_id TEXT NOT NULL,action TEXT NOT NULL,actor TEXT NOT NULL,version INTEGER NOT NULL,snapshot TEXT NOT NULL,created_at TEXT NOT NULL)',
    'CREATE TABLE IF NOT EXISTS random_auth_attempts (ip TEXT NOT NULL,attempted_at INTEGER NOT NULL)',
    'CREATE TABLE IF NOT EXISTS random_batch_guards (id TEXT PRIMARY KEY,valid INTEGER NOT NULL CHECK(valid=1))',
    'CREATE INDEX IF NOT EXISTS random_attempt_time ON random_auth_attempts(ip,attempted_at)',
];
const hex = (bytes: ArrayBuffer) => Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, '0')).join('');
async function hash(value: string | Uint8Array) { return hex(await crypto.subtle.digest('SHA-256', typeof value === 'string' ? encoder.encode(value) : value as BufferSource)); }
async function signature(value: string, password: string) { const key = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return hex(await crypto.subtle.sign('HMAC', key, encoder.encode(value))); }
function equal(a: string, b: string) { let difference = a.length ^ b.length; for (let i = 0; i < Math.max(a.length, b.length); i++)
    difference |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0); return difference === 0; }
async function authenticated(request: Request, password?: string) { if (!password)
    return false; const token = request.headers.get('cookie')?.split(';').map(x => x.trim()).find(x => x.startsWith(cookieName + '='))?.slice(cookieName.length + 1) ?? ''; const [expires, nonce, sig, ...extra] = token.split('.'); if (extra.length || !/^\d+$/.test(expires ?? '') || Number(expires) <= Date.now() || Number(expires) > Date.now() + 8 * 3600000 || !nonce || !sig)
    return false; return equal(sig, await signature(expires + '.' + nonce, password)); }
function rowRecord(row: any): ContentRecord & {
    __storage: string;
} { return { ...contentSchema.parse(JSON.parse(row.data)), id: row.id, status: row.status, version: row.version, updatedAt: row.updated_at, approvedBy: row.approved_by, approvedAt: row.approved_at, __storage: 'd1' }; }
async function identity(item: ContentInput) { return hash(item.category + '|' + (item.category === 'BOOK' && item.isbn ? item.isbn : item.source.url + '|' + item.title.trim().toLowerCase())); }
async function body(request: Request, maxBytes = 65536) { if (!request.headers.get('content-type')?.startsWith('application/json'))
    throw new Error('JSON_REQUIRED'); const bytes = await limited(request, maxBytes); return JSON.parse(new TextDecoder().decode(bytes)); }
async function limited(request: Request, max: number) { const reader = request.body?.getReader(); if (!reader)
    return new Uint8Array(); const chunks: Uint8Array[] = []; let size = 0; for (;;) {
    const next = await reader.read();
    if (next.done)
        break;
    size += next.value.length;
    if (size > max) {
        await reader.cancel();
        throw new Error('BODY_TOO_LARGE');
    }
    chunks.push(next.value);
} const result = new Uint8Array(size); let offset = 0; for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
} return result; }
const mediaPath = /^\/media\/[A-Za-z0-9_-]{1,180}\.webp$/;
function webp(bytes: Uint8Array) { const ascii = (start: number, end: number) => new TextDecoder().decode(bytes.slice(start, end)); if (bytes.length < 30 || ascii(0, 4) !== 'RIFF' || ascii(8, 12) !== 'WEBP')
    return false; const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength); if (view.getUint32(4, true) + 8 !== bytes.length)
    return false; let width = 0, height = 0; const kind = ascii(12, 16); if (kind === 'VP8X') {
    width = 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16);
    height = 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16);
}
else if (kind === 'VP8 ' && bytes[23] === 157 && bytes[24] === 1 && bytes[25] === 42) {
    width = view.getUint16(26, true) & 16383;
    height = view.getUint16(28, true) & 16383;
}
else if (kind === 'VP8L' && bytes[20] === 47) {
    const bits = view.getUint32(21, true);
    width = (bits & 16383) + 1;
    height = ((bits >>> 14) & 16383) + 1;
} return width > 0 && height > 0 && width * height <= 40000000; }
export async function handleDatabase(request: Request, env: DatabaseEnv): Promise<Response> {
    const url = new URL(request.url), path = url.pathname, db = env.CONTENT_DB;
    try {
        const auth = await authenticated(request, env.RANDOM_STUDIO_PASSWORD);
        if(path==='/api/content-contract'&&request.method==='GET')
            return json(contentContract,200,{'Access-Control-Allow-Origin':'*'});
        if (path === '/api/database/status' || path === '/api/database/config') {
            let ok = false;
            if (db) { try { await db.prepare('SELECT 1').first(); ok = true; } catch {} }
            return json({ configured: !!db && !!env.RANDOM_STUDIO_PASSWORD, databaseConfigured: !!db, passwordConfigured: !!env.RANDOM_STUDIO_PASSWORD, authenticated: auth, ok, ...(db && !ok ? {error:'DATABASE_UNAVAILABLE'} : {}) });
        }
        if (!db)
            return json({ error: 'DATABASE_NOT_CONFIGURED' }, 503);
        await db.prepare('SELECT 1').first();
        await db.batch(schema.map(sql => db.prepare(sql)));
        if (path === '/api/database/health')
            return json({ ok: true, database: true });
        if (request.method !== 'GET' && request.method !== 'HEAD' && request.headers.get('origin') !== url.origin)
            return json({ error: 'ORIGIN_REQUIRED' }, 403);
        if (path === '/api/database/login' && request.method === 'POST') {
            if (!env.RANDOM_STUDIO_PASSWORD)
                return json({ error: 'PASSWORD_NOT_CONFIGURED' }, 503);
            const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown', now = Date.now();
            const attempts = await db.batch([db.prepare('DELETE FROM random_auth_attempts WHERE attempted_at<?').bind(now - 900000), db.prepare('INSERT INTO random_auth_attempts(ip,attempted_at) VALUES (?,?)').bind(ip, now), db.prepare('SELECT COUNT(*) AS count FROM random_auth_attempts WHERE ip=? AND attempted_at>=?').bind(ip, now - 900000)]);
            if (Number((attempts[2].results[0] as any).count) > 10)
                return json({ error: 'RATE_LIMITED' }, 429, { 'Retry-After': '900' });
            const data = await body(request);
            if (typeof data.password !== 'string' || !equal(await hash(data.password), await hash(env.RANDOM_STUDIO_PASSWORD)))
                return json({ error: 'INVALID_PASSWORD' }, 401);
            const payload = (now + 8 * 3600000) + '.' + crypto.randomUUID();
            return json({ authenticated: true }, 200, { 'Set-Cookie': `${cookieName}=${payload}.${await signature(payload, env.RANDOM_STUDIO_PASSWORD)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800` });
        }
        if (path === '/api/database/logout' && request.method === 'POST')
            return json({ authenticated: false }, 200, { 'Set-Cookie': `${cookieName}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0` });
        const all = async () => (await db.prepare('SELECT * FROM random_items').all()).results.map(rowRecord);
        const publishable = (item: ContentRecord) => item.status === 'published' && !!item.approvedBy && !!item.approvedAt && !publicationIssues(item).length;
        if (path === '/api/catalog' && request.method === 'GET') {
            const items = (await all()).filter(publishable).map(({ approvedBy, approvedAt, ...item }) => ({ ...item, ...((item.category==='BOOK'||item.category==='WATCH')?{accessLinks:visibleAccessLinks(item)}:{}), translations: Object.fromEntries(Object.entries(item.translations ?? {}).filter(([, value]) => value.reviewed)) }));
            return json({ items }, 200, auth ? {} : {'Access-Control-Allow-Origin':'*'});
        }
        if (mediaPath.test(path) && ['GET', 'HEAD'].includes(request.method)) {
            if (!auth) {
                const references = (await db.prepare("SELECT * FROM random_items WHERE status='published' AND json_extract(data,'$.image.path')=?").bind(path).all()).results;
                if (!references.some(row => publishable(rowRecord(row)))) return json({ error: 'NOT_FOUND' }, 404);
            }
            const media = await db.prepare('SELECT * FROM random_media WHERE path=?').bind(path).first<any>();
            if (!media)
                return json({ error: 'NOT_FOUND' }, 404);
            return new Response(request.method === 'HEAD' ? null : Array.isArray(media.bytes) ? new Uint8Array(media.bytes) : media.bytes, { headers: { 'Content-Type': media.mime, 'Cache-Control': auth ? 'private, no-store' : 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff', ...(auth ? {} : {'Access-Control-Allow-Origin':'*'}) } });
        }
        if (!auth)
            return json({ error: 'UNAUTHORIZED' }, 401);
        if(path==='/api/database/upgrade-access-links'&&request.method==='POST'){
            // Representation-only upgrade: add search destinations, never infer availability
            // or rewrite editorial approvals. Each CAS update owns its audit event.
            const rows=(await db.prepare("SELECT * FROM random_items WHERE category IN ('BOOK','WATCH') AND json_type(data,'$.accessLinks') IS NULL LIMIT 50").all()).results;
            let updated=0;
            for(const row of rows as any[]){
                const original=JSON.parse(row.data),parsed=contentSchema.safeParse(original);
                if(!parsed.success)continue;
                const links=defaultAccessLinks(parsed.data);
                if(!links.length)continue;
                const revision=crypto.randomUUID(),now=new Date().toISOString();
                const input={...original,accessLinks:links};
                const snapshot={...input,id:row.id,status:row.status,version:row.version+1,updatedAt:now,approvedBy:row.approved_by,approvedAt:row.approved_at};
                const result=await db.batch([
                    db.prepare('UPDATE random_items SET data=?,version=version+1,updated_at=?,revision=? WHERE id=? AND version=?').bind(JSON.stringify(input),now,revision,row.id,row.version),
                    db.prepare("INSERT INTO random_events(id,content_id,action,actor,version,snapshot,created_at) SELECT ?,?,'access-links-upgrade','system-contract-v2',?,?,? WHERE EXISTS(SELECT 1 FROM random_items WHERE id=? AND revision=?)").bind(crypto.randomUUID(),row.id,row.version+1,JSON.stringify(snapshot),now,row.id,revision),
                ]);
                updated+=result[0].meta.changes;
            }
            return json({updated,hasMore:rows.length===50});
        }
        if (path === '/api/database/storage' && request.method === 'GET') {
            const measurement = await db.prepare('SELECT (SELECT COUNT(*) FROM random_items) AS items,(SELECT COALESCE(SUM(length(bytes)),0) FROM random_media) AS mediaBytes,(SELECT COUNT(*) FROM random_events) AS revisions').all();
            const row = measurement.results[0] as any;
            const databaseBytes = measurement.meta.size_after;
            if (!Number.isFinite(databaseBytes) || databaseBytes <= 0) return json({error:'STORAGE_MEASUREMENT_UNAVAILABLE'},503);
            return json({database:'random-test-content',databaseBytes,mediaBytes:Number(row.mediaBytes),items:Number(row.items),revisions:Number(row.revisions),databaseLimitBytes:500000000,accountLimitBytes:5000000000,measuredAt:new Date().toISOString()});
        }
        if (path === '/api/content' && request.method === 'GET')
            return json({ items: await all(), deletedIds: (await db.prepare("SELECT DISTINCT content_id FROM random_events WHERE action='delete' AND NOT EXISTS(SELECT 1 FROM random_items WHERE random_items.id=random_events.content_id)").all()).results.map((row:any)=>row.content_id), events: (await db.prepare('SELECT * FROM random_events ORDER BY created_at,id').all()).results.map((event: any) => ({ ...event, snapshot: JSON.parse(event.snapshot) })) });
        if (path === '/api/database/import-batch' && request.method === 'POST') {
            const data = await body(request, 15 * 1024 * 1024);
            if (!Array.isArray(data.items) || data.items.length < 1 || data.items.length > 1000)
                return json({error:'IMPORT_BATCH_REQUIRES_1_TO_1000_ITEMS'},400);
            const ids = new Set<string>(), identities = new Set<string>();
            const now = new Date().toISOString(), token = crypto.randomUUID();
            const guards:D1PreparedStatement[] = [], changes:D1PreparedStatement[] = [], events:D1PreparedStatement[] = [];
            const items:ContentRecord[] = [];
            for (const entry of data.items) {
                const source = entry.item, parsed = contentSchema.safeParse(source);
                if (!parsed.success || !source || typeof source.id !== 'string' || !source.id.length || source.id.length > 180 || !Number.isSafeInteger(source.version) || source.version < 1)
                    return json({error:'INVALID_IMPORT_RECORD'},400);
                if (encoder.encode(JSON.stringify(source)).byteLength > 65536)
                    return json({error:'IMPORT_RECORD_TOO_LARGE',id:source.id},413);
                const id = source.id, input = parsed.data;
                if((input.category==='BOOK'||input.category==='WATCH')&&input.accessLinks===undefined)input.accessLinks=defaultAccessLinks(input);
                const dedup = await identity(input);
                if (ids.has(id) || identities.has(dedup)) return json({error:'IMPORT_DUPLICATE_ID_OR_CONTENT',id},409);
                ids.add(id); identities.add(dedup);
                const existing = await db.prepare('SELECT * FROM random_items WHERE id=?').bind(id).first<any>();
                const expected = entry.expectedVersion;
                if (existing ? !Number.isSafeInteger(expected) || expected !== existing.version : expected !== undefined)
                    return json({error:'IMPORT_VERSION_CONFLICT',id},409);
                if (await db.prepare('SELECT id FROM random_items WHERE dedup=? AND id<>?').bind(dedup,id).first())
                    return json({error:'IMPORT_DUPLICATE_CONTENT',id},409);
                input.factsVerified = false;
                resetAccessLinkReviews(input);
                input.image.rightsConfirmed = false;
                if (input.category === 'EAT') {
                    input.allergensVerified = false;
                    if (input.phosphateAssessment) input.phosphateAssessment.reviewed = false;
                }
                for (const translation of Object.values(input.translations ?? {})) if (translation) translation.reviewed = false;
                const item:ContentRecord = {...input,id,status:'review',version:existing?expected+1:source.version,updatedAt:now,approvedBy:null,approvedAt:null};
                items.push(item);
                const guardId = token + ':' + id;
                guards.push(db.prepare('INSERT INTO random_batch_guards(id,valid) SELECT ?,CASE WHEN ((? IS NULL AND NOT EXISTS(SELECT 1 FROM random_items WHERE id=?)) OR (? IS NOT NULL AND EXISTS(SELECT 1 FROM random_items WHERE id=? AND version=?))) AND NOT EXISTS(SELECT 1 FROM random_items WHERE dedup=? AND id<>?) THEN 1 ELSE 0 END').bind(guardId,expected??null,id,expected??null,id,expected??null,dedup,id));
                const revision = crypto.randomUUID();
                changes.push(existing
                    ? db.prepare('UPDATE random_items SET dedup=?,category=?,data=?,status=?,version=?,updated_at=?,approved_by=NULL,approved_at=NULL,revision=? WHERE id=? AND version=?').bind(dedup,input.category,JSON.stringify(input),'review',item.version,now,revision,id,expected)
                    : db.prepare('INSERT INTO random_items(id,dedup,category,data,status,version,updated_at,approved_by,approved_at,revision) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(id,dedup,input.category,JSON.stringify(input),'review',item.version,now,null,null,revision));
                events.push(db.prepare('INSERT INTO random_events(id,content_id,action,actor,version,snapshot,created_at) VALUES (?,?,?,?,?,?,?)').bind(crypto.randomUUID(),id,'catalog-import','studio-editor',item.version,JSON.stringify(item),now));
            }
            await db.batch([...guards,...changes,...events,db.prepare('DELETE FROM random_batch_guards WHERE id LIKE ?').bind(token+':%')]);
            return json({items:items.map(item=>({...item,__storage:'d1'}))});
        }
        if (path.startsWith('/api/database/media/') && request.method === 'PUT') {
            const target = '/media/' + path.slice('/api/database/media/'.length);
            if (!mediaPath.test(target) || request.headers.get('content-type')?.split(';')[0] !== 'image/webp')
                return json({ error: 'WEBP_REQUIRED' }, 400);
            const bytes = await limited(request, 1024 * 1024);
            if (!webp(bytes))
                return json({ error: 'INVALID_WEBP_OR_DIMENSIONS' }, 400);
            const digest = await hash(bytes);
            await db.prepare('INSERT OR IGNORE INTO random_media(path,bytes,mime,hash) VALUES (?,?,?,?)').bind(target, bytes.buffer, 'image/webp', digest).run();
            const existing = await db.prepare('SELECT hash FROM random_media WHERE path=?').bind(target).first<any>();
            if (existing.hash !== digest)
                return json({ error: 'MEDIA_CONFLICT' }, 409);
            return json({ path: target });
        }
        if ((path === '/api/content' || path === '/api/database/migrate') && request.method === 'POST') {
            const migration = path.endsWith('/migrate'), data = await body(request, migration ? 8 * 1024 * 1024 : 65536), source = migration ? data.item : data.input, parsed = contentSchema.safeParse(source);
            if (!parsed.success)
                return json({ error: 'INVALID_CONTENT', issues: parsed.error.issues }, 400);
            if (encoder.encode(JSON.stringify(source)).byteLength > 65536) return json({error:'CONTENT_TOO_LARGE'},413);
            const input = parsed.data;
            if((input.category==='BOOK'||input.category==='WATCH')&&input.accessLinks===undefined)input.accessLinks=defaultAccessLinks(input);
            const dedup = await identity(input), id = migration ? source.id : data.id ?? crypto.randomUUID();
            if (typeof id !== 'string' || !id.length || id.length > 180)
                return json({ error: 'INVALID_ID' }, 400);
            const existing = await db.prepare('SELECT * FROM random_items WHERE id=?').bind(id).first<any>();
            if (migration && !existing && await db.prepare("SELECT id FROM random_events WHERE content_id=? AND action='delete' LIMIT 1").bind(id).first()) return json({error:'MIGRATED_ITEM_DELETED',id},409);
            const duplicate = await db.prepare('SELECT * FROM random_items WHERE dedup=? AND id<>?').bind(dedup, id).first<any>();
            if (duplicate)
                return migration || !data.id ? json({ item: rowRecord(duplicate), duplicate: true }) : json({ error: 'DUPLICATE_CONTENT' }, 409);
            const now = new Date().toISOString();
            const issues = publicationIssues(input);
            if (!await db.prepare('SELECT path FROM random_media WHERE path=?').bind(input.image.path).first())
                issues.push('Shared image is missing.');
            if (migration && (!Number.isSafeInteger(source.version) || source.version < 1 || !['draft', 'review', 'published'].includes(source.status) || typeof source.updatedAt !== 'string' || Number.isNaN(Date.parse(source.updatedAt)) || (source.approvedBy !== null && typeof source.approvedBy !== 'string') || (source.approvedAt !== null && (typeof source.approvedAt !== 'string' || Number.isNaN(Date.parse(source.approvedAt))))))
                return json({ error: 'INVALID_RECORD' }, 400);
            const status = migration ? (source.status === 'published' && (!source.approvedBy || !source.approvedAt || issues.length) ? 'review' : source.status) : (issues.length ? 'review' : 'published');
            const item: ContentRecord = { ...input, id, status, version: migration ? source.version : existing ? existing.version + 1 : 1, updatedAt: migration ? source.updatedAt : now, approvedBy: status === 'published' ? (migration ? source.approvedBy : 'studio-editor') : null, approvedAt: status === 'published' ? (migration ? source.approvedAt : now) : null };
            const revision = crypto.randomUUID();
            if (migration && existing) {
                const current = rowRecord(existing);
                const clean = { ...current } as any;
                delete clean.__storage;
                if (JSON.stringify(clean) === JSON.stringify(item))
                    return json({ item: current, idempotent: true, issues });
                return json({ error: 'ID_CONFLICT' }, 409);
            }
            if (existing && (!Number.isSafeInteger(data.version) || existing.version !== data.version))
                return json({ error: 'VERSION_CONFLICT' }, 409);
            const change = existing ? db.prepare('UPDATE random_items SET dedup=?,category=?,data=?,status=?,version=?,updated_at=?,approved_by=?,approved_at=?,revision=? WHERE id=? AND version=?').bind(dedup, input.category, JSON.stringify(input), status, item.version, item.updatedAt, item.approvedBy, item.approvedAt, revision, id, data.version) : db.prepare(migration ? "INSERT OR IGNORE INTO random_items(id,dedup,category,data,status,version,updated_at,approved_by,approved_at,revision) SELECT ?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM random_events WHERE content_id=? AND action='delete')" : 'INSERT OR IGNORE INTO random_items(id,dedup,category,data,status,version,updated_at,approved_by,approved_at,revision) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(id, dedup, input.category, JSON.stringify(input), status, item.version, item.updatedAt, item.approvedBy, item.approvedAt, revision, ...(migration ? [id] : []));
            const event = (action: string, snapshot: unknown, eventId = crypto.randomUUID(), actor = 'studio-editor', version = item.version, createdAt = now) => db.prepare('INSERT OR IGNORE INTO random_events(id,content_id,action,actor,version,snapshot,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM random_items WHERE id=? AND revision=?)').bind(eventId, id, action, actor, version, JSON.stringify(snapshot), createdAt, id, revision);
            const events = migration && Array.isArray(data.events) ? data.events : [];
            if (events.length > 100)
                return json({ error: 'TOO_MANY_EVENTS' }, 400);
            const statements = [change, event(migration ? 'migrate' : existing ? 'update' : 'create', item)];
            for (const e of events) {
                const snapshot = e.snapshot ?? e.item ?? item;
                if (encoder.encode(JSON.stringify(snapshot)).byteLength > 65536) return json({error:'EVENT_SNAPSHOT_TOO_LARGE'},413);
                const action = e.action, actor = e.actor ?? 'local-editor';
                const version = e.version ?? e.item?.version ?? item.version;
                const createdAt = e.createdAt ?? e.at;
                if (typeof action !== 'string' || action.length > 100 || typeof actor !== 'string' || actor.length > 180 || !Number.isSafeInteger(version) || typeof createdAt !== 'string' || Number.isNaN(Date.parse(createdAt)))
                    return json({ error: 'INVALID_EVENT' }, 400);
                const eventId = typeof e.id === 'string' ? e.id : await hash(JSON.stringify({id, action, actor, version, createdAt, snapshot}));
                statements.push(event(action, snapshot, eventId, actor, version, createdAt));
            }
            const result = await db.batch(statements);
            if (!result[0].meta.changes) {
                const collision = await db.prepare('SELECT * FROM random_items WHERE dedup=?').bind(dedup).first<any>();
                if (!existing && collision && collision.id !== id)
                    return json({ item: rowRecord(collision), duplicate: true });
                return json({ error: 'VERSION_OR_ID_CONFLICT' }, 409);
            }
            return json({ item: { ...item, __storage: 'd1' }, issues }, existing ? 200 : 201);
        }
        const deletion = /^\/api\/content\/([^/]+)$/.exec(path);
        if (deletion && request.method === 'DELETE') {
            const data = await body(request);
            if (!Number.isSafeInteger(data.version))
                return json({ error: 'VERSION_REQUIRED' }, 400);
            const id = decodeURIComponent(deletion[1]), existing = await db.prepare('SELECT * FROM random_items WHERE id=?').bind(id).first<any>();
            if (!existing)
                return json({ error: 'NOT_FOUND' }, 404);
            if (existing.version !== data.version)
                return json({ error: 'VERSION_CONFLICT' }, 409);
            const revision = crypto.randomUUID(), now = new Date().toISOString(), snapshot = { ...rowRecord(existing), version: existing.version + 1, deleted: true };
            const results = await db.batch([db.prepare('UPDATE random_items SET revision=? WHERE id=? AND version=?').bind(revision, id, data.version), db.prepare('INSERT INTO random_events(id,content_id,action,actor,version,snapshot,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM random_items WHERE id=? AND revision=?)').bind(crypto.randomUUID(), id, 'delete', 'studio-editor', snapshot.version, JSON.stringify(snapshot), now, id, revision), db.prepare('DELETE FROM random_items WHERE id=? AND revision=?').bind(id, revision)]);
            return results[0].meta.changes ? json({ deleted: true, id }) : json({ error: 'VERSION_CONFLICT' }, 409);
        }
        return json({ error: 'NOT_FOUND' }, 404);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : '';
        if (/CHECK constraint failed/i.test(message)) return json({error:'IMPORT_VERSION_CONFLICT'},409);
        if (/UNIQUE constraint failed/i.test(message))
            return json({ error: 'CONTENT_CONFLICT' }, 409);
        return json({ error: message === 'BODY_TOO_LARGE' ? 'BODY_TOO_LARGE' : message === 'JSON_REQUIRED' ? 'JSON_REQUIRED' : 'REQUEST_FAILED' }, message === 'BODY_TOO_LARGE' ? 413 : message === 'JSON_REQUIRED' || error instanceof SyntaxError ? 400 : 500);
    }
}
