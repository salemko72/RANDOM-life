# Bundled reserve catalog

RANDOM life ships a read-only snapshot of 100 published D1 items and their optimized WebP pictures. Target: 20 per category and under 10 MiB. Selection is shuffled at refresh time; recipe selection also reserves space for verified low-phosphate and vegan options. IDs, translations, rights provenance and safety flags are retained.

D1 remains authoritative whenever reachable, including a valid empty catalog. Only failed public consumer reads activate the reserve; Studio reads/writes never fall back. A short public timeout prevents long waits. While in reserve, spins use the bundle immediately. A background check every 30 seconds and the browser online/focus events retry D1. Returning connectivity updates future choices without replacing an item the user is reading. Existing profile restrictions remain the sole eligibility engine.

A quiet status reads “D1 disconnected · Backup active”. No blocking dialog is shown. Reserve images are served from application assets, not the unavailable D1 media endpoint. The same static assets are included as local blob URLs in the generated self-contained HTML consumed by the Expo shell. An APK must be rebuilt to receive this bundle; changing the website alone cannot update an already installed APK.

Refresh explicitly with `npm run backup:refresh` (Node 24.5+). This reads only the public catalog and media, without API keys or editing D1. A normal build uses the checked-in snapshot and needs no D1 connection. Refresh is atomic and leaves the previous snapshot intact on failure. The build checks the asset budget and includes both PNG and WebP assets in self-contained output.

Web reserve works when the site is reachable but D1 is not. Fully disconnected first-time browser loading still requires a previously installed/cached web shell; this change does not add a service worker. APK HTML and reserve images are bundled together.
