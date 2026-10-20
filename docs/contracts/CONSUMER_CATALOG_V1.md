# LifeSpinner consumer catalog v1 — backend handoff

Frontend owner: this Codex, branch android-play-test-ready. Backend owner: second Codex, separate branch. Do not overwrite frontend files, native files or app.json; return commit IDs, deployed endpoint URLs and actual verification results. No new APK/AAB builds or Play submissions in this task.

## Exact wire contract (agree before diverging)

GET /api/catalog/manifest, anonymous public HTTPS, credentials omitted.
200 application/json:
{"schema":1,"version":"<64 lowercase hexadecimal SHA-256>","generatedAt":"<ISO timestamp>","snapshotPath":"/api/catalog/snapshots/<same version>.json","itemCount":413}

GET /api/catalog/snapshots/<version>.json
200 application/json, UTF-8 body EXACTLY representing:
{"schema":1,"items":[<existing public /api/catalog item shape>]}

version is the SHA-256 of the uncompressed UTF-8 snapshot response body bytes (not compressed bytes, not a reserialized parsed object). snapshotPath is the exact relative same-origin path above. No redirects to third-party hosts. Max snapshot body 8 MiB, max 10,000 items. Empty items [] is authoritative and MUST NOT resurrect cached or reserve items. If growth exceeds these limits, coordinate a protocol change first.

Every item must be published, have a stable unique id and positive integer version, and pass current contentSchema/publicationIssues from packages/shared. Include only approved public fields and reviewed EN/BS translations as existing /api/catalog does; no Studio secrets, drafts, approval identities or private profile data. Keep fields required for preferences and dietary validation. Full snapshot REPLACES prior contents atomically: removed or unpublished records disappear; no separate tombstone endpoint needed in v1. If no content changes, retain the same version and immutable snapshot. Publish a new snapshot first, verify it, then change the manifest. Never point to a missing object. Prevent concurrent publishers from moving the manifest backwards.

Manifest: CDN/shared cache short TTL (suggest 60 s), ETag allowed, Access-Control-Allow-Origin: *. Frontend does not use conditional requests/304 in v1; return full small 200 when requested. Snapshot: immutable public max-age=31536000 and CORS *. If an old snapshot is unavailable, 404; current snapshot must remain available. Client verifies hash and itemCount before replacing its local copy. Do not expose historical unpublished material indefinitely: define and document snapshot retention/revocation semantics; client checks only periodically and cannot honor immediate withdrawal while offline.

Client normal validation interval 30 min, failure retry 60 s, first uncached request immediately, force refresh allowed after editorial changes/retry. Cache is catalog data only, never a profile-specific response. Last known good local data retained on errors. Existing built-in emergency reserve is separate. Existing /api/catalog MUST stay compatible for already released APKs and frontend migration fallback (manifest 404/405/501 only). Do not return fake successful empty responses on server failure; use 503.

## Backend work authorized

1. Read AGENTS.md and inspect the real Cloudflare bindings and environment. Verify D1 Edit, R2 Storage Edit, Pages Edit token scopes against this account/project. Never print secrets. Export backups and prepare rollback; no destructive deletion of D1 data in this phase.
2. Create/use an appropriate R2 bucket and add binding to the existing Pages/Worker project. D1 remains editorial source of truth. Copy existing random_media bytes to R2, preserving object names/content type, and verify counts, hashes and representative images. Never substitute artwork. No public draft/private media exposure.
3. Preserve existing /media/<name> addresses. Serve approved public media through R2 + CDN with stable immutable content-hash keys, correct content types/cache headers/CORS and conditional requests where appropriate. Maintain D1 fallback for not-yet-migrated images. Existing native APKs must keep working. A Cache-Control header alone is not proof of an effective edge cache: measure cache hits and D1 reads.
4. Avoid scanning D1 for every public media request. Design an approved-media publication index/cache with bounded invalidation on publish/unpublish/delete. Do not drop approval checks to save reads. Studio authenticated reads/writes remain separate, private and uncached. New uploads must reach R2 before a published record references them; handle failure/retry and rollback.
5. Generate the versioned PUBLIC catalog snapshot and manifest described above from approved content, store immutable snapshots in R2, and serve them through existing origin. Trigger regeneration on publish, edit of published content, unpublish and delete, with dedup/coalescing and concurrency control. Profile data must never reach these APIs. Do not rebuild/read the whole D1 table on each manifest request.
6. Keep old /api/catalog working. For old clients, serve the equivalent current approved snapshot via shared cache so old builds also save D1 reads. Preserve {items:[...]} response shape there. Keep all former unrelated routes and downloadable packages accessible.
7. Verify D1-before/R2-after media hashes, pending/missing-R2 fallback, public draft denial, publication and withdrawal, catalog edits (including dietary corrections), exact snapshot digest, [] publication, simultaneous publications, cache hit metrics and origin failure. Report D1 row reads and R2/Worker operations; do not claim zero costs or guarantee billing savings without measurements.
8. Do not delete old D1 images until a later explicitly reviewed cleanup. Return migration inventory, rollback steps, commit and deployment IDs, test commands/results and sample manifest. Send frontend owner any necessary contract change BEFORE deploying an incompatible format.

## Credentials/environment

Use the account's configured CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID. Account-scoped permissions: D1 Edit, Workers R2 Storage Edit, Cloudflare Pages Edit, Account Settings Read. Extra Workers Scripts Edit/zone permissions only if the actual chosen deployment needs them; do not request global unrestricted access. S3 credentials are separate and only needed if the selected tool uses S3; prefer existing Wrangler/API bindings. Never copy credentials into Git, logs or chat.
