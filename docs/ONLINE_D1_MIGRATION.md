# Shared D1 migration

RANDOM Studio and the public catalog use the existing random-test-content D1 binding. New content, edits, uploaded images, deletions, translation batches and database imports use authenticated online requests. There is no silent local write fallback. Existing browser IndexedDB content is retained as a read-only migration/backup source.

Green outline **ONLINE D1** means the record is in shared D1; blue **LOCAL** means the legacy browser record awaits migration. Online status appears at the top right. Sign in with the Production secret RANDOM_STUDIO_PASSWORD. Cookie sessions are signed, HttpOnly, Secure and SameSite=Strict. Mutations require the same origin. Public reads expose only published, human-verified records and their images.

**UPDATE local to D1** migrates this browser's legacy items and matching images, retaining IDs, versions, approval and history where valid. Media gets deterministic unique paths, WebP optimization and a 1MB bound. Missing images and conflicts are reported, never overwritten. Repeating migration does not duplicate identical records. Local backup copies are retained; they do not become public merely because they exist locally.

Run migration separately in each browser previously used for authoring. An exported catalog ZIP can also be imported into shared D1. Omitted items are retained. Changed bulk-import records return to review, and version-conflicting batches roll back atomically. JSON-only legacy exports cannot restore missing image bytes.

For the $0 test, optimized media is stored as D1 BLOBs instead of activating R2. Images count against D1 storage. This is suitable for a small test catalog, not unlimited media storage; monitor the database's free capacity. No paid services or API generation are activated.

Device profiles/preferences remain on the device; item content is centralized. Expo's embedded view reads the same public D1 catalog. Native device behavior must be checked separately from browser and bundle tests.
