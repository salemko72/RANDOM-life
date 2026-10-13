# RANDOM demo 0.3

User corrections: remove forced-first EAT spin, fix distorted food photos, activate WATCH with two films and three series. Changes are directly authorized by the user's correction request.

Automatic SPIN randomly samples eligible, unexhausted EAT/WATCH/LEARN categories, starting with the first spin. It avoids the preceding category when alternatives remain. Each item is excluded after selection. All 15 recommendations can be seen before the explicit reset message. Explicit rail category clicks may intentionally repeat a category; exhausted category clicks report no remaining selection.

Food sprites now use `background-size: auto 200%`, retaining natural image proportions in the portrait feature/detail/favorite slots. WATCH mood images use `auto 300%` for their 2-by-3 contact sheet. No real actors or official posters were copied.

WATCH: Enola Holmes (2020), The Adam Project (2022), Dark (2017), Wednesday (2022), The Queen’s Gambit (2020). These are provisional Netflix-related demo suggestions with original illustrations. Regional availability is not verified, and this is not a streaming integration. WATCH is a local PreviewRecord union: the existing EAT/BOOK D1 schema, API and human approval workflow are unchanged. Studio manual content import currently supports EAT/LEARN, not WATCH.

Published a separate static-only free Cloudflare Pages project:
- App: https://random-life-preview.pages.dev/
- Studio: https://random-life-preview.pages.dev/studio.html
- Deployment: a0771e22-aac1-41cb-9501-c286b1ec653f
- Immutable URL: https://a0771e22.random-life-preview.pages.dev
- Cloudflare API canonical production deployment status: deploy/success.

`npm run build:preview` plus `node scripts/stage-preview.mjs` produces the static deployment folder. Large self-contained offline HTML/native JSON are excluded; only JS/CSS/static assets and HTML entry points are deployed. `_headers` requires cache revalidation so normal refresh loads subsequent deployments on the same URL. Token remains only in the secure process environment/proxy; no token is built into static assets. No D1 remote changes, paid services or unrelated Cloudflare resources were changed.

Validation: 23 unit tests passed; typecheck passed; original browser wheel/Studio smoke passed; browser demo smoke decoded every image and completed 15 automatic spins with exactly five unique recommendations in each category. Review found no important regressions. Native physical-device rendering remains unverified.

Direct HTTPS public-site checks from this cloud machine are blocked by egress policy (proxy tunnel 403), not an observed website error. The Cloudflare API confirmed successful publication. A configuration draft preserves the three existing allowed hosts and adds only random-life-preview.pages.dev, with refreshed reusable startup instructions. Saving the draft does not apply it; user review/save and environment publication remain necessary for direct live-site testing in this machine.

Windows Expo Go source package includes the updated embedded demo; use POKRENI_EXPO_GO.cmd on the local PC and scan its LAN QR. Existing Expo owner/project ID and $0 extra service cost constraint are preserved. This mobile preview remains a WebView bridge, not the final native implementation.
