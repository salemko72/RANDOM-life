# Server handoff — 20 October 2026

Implemented from frontend commit `c7b8df9347dbc8347c9f39f2f33a51e0aee25b5a` on **codex/r2-versioned-catalog**. Final deployed implementation commit **81caea48d2e1fd664d9339946cb9198feb0ebaf6** (initial implementation 4843043). Frontend/native/shared schema files are unchanged. No APK/AAB build or store submission.

## Actual deployments and endpoints

- Final production deployment: `42db61bd-a2d4-4b42-b4f3-10d1d025e86e`, https://42db61bd.random-life-preview.pages.dev (initial server rollout: 532ce6bc).
- Production origin: https://random-life-preview.pages.dev
- Preview validation deployment: `33c85da0` at https://33c85da0.random-life-preview.pages.dev (the final commit also atomizes access-link index upgrades; final full suite re-run before production).
- Manifest: https://random-life-preview.pages.dev/api/catalog/manifest
- Legacy catalog: https://random-life-preview.pages.dev/api/catalog
- Snapshot: https://random-life-preview.pages.dev/api/catalog/snapshots/89621cfe2c35c020df412f95c2a6cda17626092f09b83ff5054016d116bbf67e.json

Actual manifest:
```json
{"schema":1,"version":"89621cfe2c35c020df412f95c2a6cda17626092f09b83ff5054016d116bbf67e","generatedAt":"2026-10-20T09:36:48.118Z","snapshotPath":"/api/catalog/snapshots/89621cfe2c35c020df412f95c2a6cda17626092f09b83ff5054016d116bbf67e.json","itemCount":413}
```

The snapshot response is **1,854,711 uncompressed UTF-8 bytes**. Independently downloaded SHA-256 matches the manifest version exactly. Legacy `items` is deeply identical. Current production publication set is 413; there are 446 private editorial rows, including 33 reviews. Migration did not change any item, status, version, approval, dietary label or link.

## Migration and preservation

- Private bucket `lifespinner-content`, binding `CONTENT_BUCKET`; R2 managed public domain is **disabled**. Existing `CONTENT_DB`, `RANDOM_STUDIO_PASSWORD`, `TMDB_READ_TOKEN` preserved.
- **457 / 457 media objects**, **33,550,326 bytes**, D1 hash and R2 re-download SHA-256 verified for each. All 457 original D1 blobs retained.
- Full SQL backup: **75,558,320 bytes**, SHA-256 `c0aee8c19ab4db25c6e5697f52f2fe584f51a292be0312384fce22c1aa11e402`. This private backup and full item/media inventories remain outside Git/public assets in the operator workspace `work/r2-handoff/`.
- Final direct D1 query comparison: all **446 original rows exactly unchanged**; path/mime/hash/length for all **457 D1 images exactly unchanged**.
- Preserved 167 production static/download assets (26,919,020 bytes). Wrangler uploaded **0 new static files**, reusing all 167; only Worker/routes/headers deployed. Live `index.html`, `standalone.js`, CSS, content kit and handoff ZIP hashes match pre-deploy bytes. Existing recipe manifest files are preserved. No missing assets are synthesized from SPA HTML.

## Checks actually run

Final `npx vitest run`: **32 files / 252 tests passed**, including schema-field whitelisting against private metadata. `npx tsc --noEmit -p tsconfig.json`: passed. `git diff --check`: passed.

Local Miniflare covers publication, edited content, withdrawal and authoritative empty catalog, deletion, no-op version/timestamp, concurrent publication, missing-R2 fallback with equal original bytes, anonymous draft denial, private/no-store reads, conditional image response, warm cache instrumentation and origin failure returning 503.

Live preview and production: manifest/snapshot/legacy 200; exact hash/itemCount; public snapshot excludes approval identities/storage internals; unreferenced review image 404; unknown snapshot 404; original static hashes match. Authenticated production Studio GET `/api/content` now succeeds with all **446** rows (it previously failed with 1102/503).

Measured live example `/media/book-cover-0fc7f7cdbc37bdfb77d1.webp`: cold authorization/body MISS, **1 D1 row read / 1 R2 GET**; next request approval/body HIT, **0 D1 rows / 0 R2 GET**, `cf-cache-status: HIT`. Warm manifest and snapshot likewise **0 D1 rows / 0 R2 operations** in the observed requests. Measurements are per request/POP, not a guarantee of zero account costs.

Observed explicit migration-tool metrics:

| Task | D1 rows read | D1 rows written | R2 GET | R2 PUT | Cloudflare API requests |
|---|---:|---:|---:|---:|---:|
| Backup/inventory | 903 | 0 | 0 | 0 | 9 |
| Image migration | 457 | 0 | 457 | 457 | 1373 |
| Index/snapshot initialization | 1279 | 1663 | 1 | 2 | 427 |
| Binding setup | 0 | 0 | 0 | 0 | 2 |
| Final preservation check | 904 | 0 | 0 | 0 | 5 |

These counters cover explicit tool queries, not internal SQL-export work, all Worker traffic, total CPU time or the account bill. No broad analytics scope was requested. Existing dependency audit reported 26 vulnerabilities (8 moderate, 18 high); dependency upgrades were not mixed into this server change.

## Limits and coordination

- Wire contract is unchanged. No frontend cherry-pick should overwrite this backend. Merge/cherry-pick the server branch before any future full Pages deployment, otherwise the old backend can be restored accidentally.
- Server authorization/pointer caches have at most 60-second normal convergence across POPs. Only the current snapshot is publicly routed. Old snapshot objects stay private for rollback. Browser immutable caches and offline/native cached data cannot be immediately revoked; agreed client refresh is 30 minutes.
- Studio history wire shape is unchanged and still potentially large. A paginated history endpoint should be coordinated with frontend rather than silently truncating events.
- Artificially dirtying the production derivative index solely for a test was rejected by automatic safety review; it was **not executed**. Regeneration/concurrency/empty/withdrawal/failure tests ran locally. Production content was not edited to force those cases. Future production write CPU-budget performance is not inferred from unlimited local runtime tests.
- Cause of the historical 1102 remains unconfirmed. The observed error page established a Worker resource-limit failure, not which CPU/memory operation exceeded it. Sanitized runtime tails recorded the former `/api/catalog` at **80 ms CPU / 288 ms runtime wall time**, and the new `/api/catalog/manifest` at **1 ms CPU / 33 ms runtime wall time**, both `outcome:ok`, HTTP 200. These are individual requests to different payload paths, not a benchmark distribution or retrospective CPU proof of the earlier failure. No confirming exception was captured. Do not report the history implementation as a proven root cause or paid-plan exhaustion without the failed invocation's metrics/logs.

## Rollback

Saved previous production deployment: **ea061935-e85f-4179-bce5-eba8e80d7f55**.

Stop editorial writes, open Cloudflare Pages → random-life-preview → Deployments → that deployment → **Rollback to this deployment**. Preserve D1 and existing secrets; optionally remove only the added `CONTENT_BUCKET` binding. No D1 restoration/deletion is needed because all original rows and images remain. Derived tables/private R2 objects can remain dormant. The previous Worker has the original resource-limit problem, so rollback can restore that failure too. Do not import the full backup over newer editorial writes. See `R2_SERVER_OPERATIONS.md` for publication, retention and recovery details.
