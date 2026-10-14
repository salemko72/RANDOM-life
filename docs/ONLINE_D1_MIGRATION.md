# Shared D1 migration

RANDOM Studio and the public catalog use the existing random-test-content D1 binding. New content, edits, uploaded images, deletions, translation batches and database imports use authenticated online requests. There is no silent local write fallback. Existing browser IndexedDB content is retained as a read-only migration/backup source.

Green outline **ONLINE D1** means the record is in shared D1; blue **LOCAL** means the legacy browser record awaits migration. Online status and the temporary migration controls appear in the right library panel, above Ingredients without illustrations. The authenticated storage meter reads D1 meta.size_after (physical database bytes), including media, history and indexes; it compares this database against the 500 MB free database limit, not the whole 5 GB account allowance. Sign in with the Production secret RANDOM_STUDIO_PASSWORD. Cookie sessions are signed, HttpOnly, Secure and SameSite=Strict. Mutations require the same origin. Public reads expose only published, human-verified records and their images.

**UPDATE local to D1** migrates this browser's legacy items and matching images, retaining IDs, versions, approval and history where valid. Media gets deterministic unique paths, WebP optimization and a 1MB bound. Missing images and conflicts are reported, never overwritten. Repeating migration does not duplicate identical records. Local backup copies are retained; they do not become public merely because they exist locally.

Run migration separately in each browser previously used for authoring. An exported catalog ZIP can also be imported into shared D1. Omitted items are retained. Changed bulk-import records return to review, and version-conflicting batches roll back atomically. JSON-only legacy exports cannot restore missing image bytes.

For the $0 test, optimized media is stored as D1 BLOBs instead of activating R2. Images count against D1 storage. This is suitable for a small test catalog, not unlimited media storage; monitor the database's free capacity. No paid services or API generation are activated.

Device profiles/preferences remain on the device; item content is centralized. Expo's embedded view reads the same public D1 catalog. Native device behavior must be checked separately from browser and bundle tests.

Contributor workflow: docs/AHMED_CONTENT_WORKFLOW.md and scripts/ahmed-content-import.mjs. Downloadable content kit is staged under /downloads/RANDOM-Ahmed-content-kit.zip. CLI contributions always clear human approvals and enter shared D1 review; no new API keys or paid generation are required. Validate with node scripts/smoke-content-import.mjs.

Migration errors open a popup listing each original title, ID and actual failure. When an online record exists but its image is missing, the popup opens that online record for artwork replacement and review. Images are searched in both online media and legacy IndexedDB. Original local copies are never erased. A failure before the server saves a record must not be described as a successful metadata migration.

The library displays online counts versus public-app availability, and each record's exclusion reasons. Published local records are not public D1 records. Original test examples can be recovered with the dedicated button: 25 examples (5 EAT, 5 READ, 5 WATCH, 6 MOVE, 4 GO), with cropped original illustrations. Recovery skips known existing titles/IDs and deleted IDs, adds only missing records under review, and never automatically publishes them. This does not substitute for migrating a user's own missing records or recovering their original covers.
