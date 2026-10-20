# Client/server integration verified — 20 October 2026

Frontend base c7b8df9 was fast-forwarded to backend handoff branch commit f7861c4 (deployed server source 81caea4, subsequent handoff documentation only). No conflicting frontend/native/schema/contract changes were present. This integration performed no Pages/Worker deployment, D1 mutation, R2 migration or APK/AAB build.

Independently exercised the current frontend createCatalogTransport against the production origin:
- Manifest 200, 413 public items.
- Snapshot 1,854,711 UTF-8 bytes; exact SHA-256 matches version `89621cfe2c35c020df412f95c2a6cda17626092f09b83ff5054016d116bbf67e`.
- All 413 records passed client schema/publication validation.
- Existing /api/catalog items exactly match snapshot items.
- First transport call requested manifest + snapshot. Revalidation requested only manifest and reused the same item array.
- Persisted snapshot loads all 413 records through PersistentCatalog with an offline network function.
- Representative image /media/book-cover-0fc7f7cdbc37bdfb77d1.webp returned 200: first observed request approval/body MISS, 1 D1 row and 1 R2 operation; next request approval/body HIT, 0 D1 rows and 0 R2 operations. These are individual observed requests, not account-wide billing estimates.

On the combined source: 252 tests / 32 files passed; root/native TypeScript passed; installed HTML/browser build passed. Browser cache smoke passed persistent reload, manifest-only checks, authoritative empty/removal handling, offline cached data, legacy fallback, native bootstrap with unavailable IndexedDB and separate reserve fallback.

Physical Android persistence, cold-start performance and behavior across installed app updates remain to be tested in the next authorized build. Existing installed APKs do not acquire new local-cache code automatically; they continue to benefit from the server's legacy endpoint and image caching. Predictive/persistent image downloads are not implemented yet.

Future deployments must include the merged R2 backend, preserve current production static/download assets and CONTENT_BUCKET/CONTENT_DB bindings, and use the coordinated deployment safeguards. Do not deploy stale pre-R2 preview-site/_worker.js artifacts. The cause of historical 1102 is still not established by these successful checks.
