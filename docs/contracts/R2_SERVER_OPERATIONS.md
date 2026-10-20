# R2 / versioned catalog server operations

Wire format remains `CONSUMER_CATALOG_V1.md` schema 1. Content contract remains v2. No client/native files, profile storage or APK/AAB build changes.

## Storage and publication

- Existing Pages project `random-life-preview`, D1 `random-test-content` remains editorial authority. Private R2 bucket `lifespinner-content`, binding `CONTENT_BUCKET`.
- D1 `random_media` is retained as the rollback mirror. Migration copies **all** objects, including private draft objects, into the **private** bucket. The Worker never permits anonymous reads merely because an object exists in R2. No r2.dev/custom public bucket domain is required.
- `random_public_items` is a derivative publication index, built only from published records with approval identities/timestamps, positive versions and current shared schema/publication validation. Anonymous media checks use its indexed `image_path`, not a scan/parse of every editorial row. Public data omits approval identities and storage internals, keeps reviewed EN/BS, dietary validation and approved access links.
- New uploads go to R2 before the D1 mirror is committed. Content publication also ensures an old D1 image exists in R2 first. Failed R2 upload prevents publication; private orphan objects can remain and are not exposed. Existing media paths are immutable: a conflicting byte hash returns 409. Legacy names are retained; all new importer hash names remain valid.
- Public index changes are in the same D1 batch and guarded by the content revision that won CAS. Insert/update/delete triggers increment the derivative generation. No direct D1 content writes should bypass this path. An external maintenance edit requires a coordinated index refresh using the same validator.
- Snapshot publisher concatenates already validated public JSON in stable ID order; max 10,000 items and 8 MiB. R2 bytes are written and re-read/hash-verified before a CAS changes the D1 manifest pointer. CAS requires the same generation, so an older publisher cannot move the pointer backwards. Isolate-local work coalesces; CAS handles different isolates. Up to three concurrent-change retries; subsequent manifest cache misses retry pending generations. An authenticated POST `/api/database/rebuild-catalog` also retries a failed publication. A committed Studio write can report `catalogPending:true`; it must not be re-created as a duplicate.
- Identical snapshot bytes retain version and generatedAt. Empty public index produces an authoritative `{schema:1,items:[]}`. Failures return 503 and never synthesize successful empty data.

## Cache and withdrawal semantics

- Manifest is a full 200 JSON response, CORS `*`, 60-second TTL, ETag. No required 304 behavior. Its tiny generation/version row is cached through the Workers Cache API; no editorial table scan per manifest.
- Snapshot body is immutable, max-age 31536000. Legacy `/api/catalog` serves the equivalent `{items:[...]}` object from R2/shared cache with 60-second TTL. Download/static routes remain assets.
- Public image authorization is cached **60 seconds**; body bytes are separately cached by immutable path for a year. Approval is checked before a cached body is returned. Local POP state/permission entries are invalidated after edits; other POPs converge within 60 seconds under normal operation. Authenticated image/Studio reads are private/no-store and do not populate public caches.
- Only the current snapshot is addressable at the public origin. Retired hashes return 404 once the 60-second cached pointer expires. Historical R2 objects are retained privately for rollback, not exposed via a public bucket. Current object must exist before pointer changes. R2 deletion/cleanup is a separate reviewed operation.
- Browsers and offline/native clients can retain previously fetched images/snapshots; immutable HTTP caching and offline storage cannot guarantee immediate withdrawal. Client refresh interval is 30 minutes per the agreed protocol. Do not describe a server withdrawal as immediate removal from an offline device.
- `X-LifeSpinner-State-Cache`, `Body-Cache`, `Approval-Cache`, `D1-Rows` and `R2-Ops` expose non-sensitive per-path measurements. Warm reads are not a claim that all account usage/billing is zero. D1/API migration metrics are recorded separately. CPU and account billing need Cloudflare analytics, not inferred from byte counts.

## Studio read compatibility

`GET /api/content` keeps its existing private `{items,deletedIds,events}` response including historical snapshots. It streams the validated stored JSON rather than re-running the entire content schema and parse/stringify of all event snapshots on every read. No frontend history format changes. This retains a potentially large private response; a future paginated history API requires frontend coordination.

## Deployment / migration

Use private `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`; never put values in Git/logs. Required scoped account permissions: D1 Edit, Workers R2 Storage Edit, Pages Edit, Account Settings Read. Each actual write verifies the applicable write capability; list/read success alone does not prove it.

`scripts/r2-admin.mjs` tasks, in order: `backup`, `migrate`, `initialize`, `bind`. Backup includes full SQL, original item/media inventories and former Pages deployment ID. Migration checks every D1/R2 byte hash, storing a resumable inventory and private media mirror outside Git. Initializer must run before enabling the new binding/routes. Do not run it concurrently with editorial writers; it is a bootstrap/maintenance operation, not the per-request publisher.

`scripts/preserve-production-assets.mjs` preserves deployed static assets/downloads, including files listed in the recipe manifest. `scripts/r2-deploy.mjs preview|production` refuses if the canonical deployment changed since backup. Bundle only `services/artwork/worker.ts` into the staged `_worker.js` after preservation. Do not run frontend/native builds after preservation or silently deploy a newer/different frontend. `scripts/r2-verify-live.mjs <origin>` checks exact hash, itemCount, legacy equivalence, draft denial, cache hit instrumentation and original frontend/download hashes.

Tests: `npx vitest run`; `npx tsc --noEmit -p tsconfig.json`. Miniflare tests cover concurrent publication, no-op hash retention, withdrawal/empty authority, delete, D1 media fallback, cache hits, private reads and cold origin failure. Production content must not be artificially edited merely to force a test; use local fixtures. Do not infer production CPU-budget performance for future writes from unlimited local runtime tests.

## Rollback

1. Stop editorial writes; record current generation/version and the current deployment.
2. In Cloudflare Pages choose the saved former production deployment and **Rollback to this deployment**, or POST the existing project deployment rollback API using its saved ID. This restores original Worker/assets; D1 originals and secret bindings remain intact. The old resource-limit bug may return.
3. Remove only the newly added `CONTENT_BUCKET` binding if required; preserve CONTENT_DB and all secret env vars. Derived tables can remain dormant. Do not delete original D1 images, items or editorial events. Do not restore the full SQL over newer editorial writes.
4. For forward recovery, redeploy the corrected Worker against retained R2/D1 data, validate the current snapshot/pointer and invalidate cache state; never point to a missing R2 object. Keep the private SQL backup for disaster recovery, not routine rollback.
5. Already fetched immutable/offline content cannot be revoked by deployment rollback. Old clients remain supported by `/api/catalog` and `/media/`.
