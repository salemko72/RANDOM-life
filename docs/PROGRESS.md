# RANDOM development ledger

Plan: docs/superpowers/plans/2026-10-12-first-slice.md

- Direct user instruction authorizes development in the existing checkout. No new worktree or repository.
- Latest decisions and documents 00–06 read; earlier OpenAI API and R2 automation is superseded.
- Stable npm Expo sdk-57/latest is 57.0.28; official blank TypeScript template 57.0.30 pins React 19.2.3 and React Native 0.86.3.
- create-expo-app cannot create /home/agent/.expo on this managed host. Used the checksum-verified npm template package instead, without changing HOME or disabling verification.
- Root React DOM type dependency must use ~19.2.2 to match Expo types, not ^19.2.2 which resolves to 19.3.
- Anonymous local profile and development admin bearer token are provisional adapters; final user auth/admin RBAC remain open. Remote deployment must not use a shared dev token.
- Recommendation is separate from content: an ephemeral result references one published item; no universal decision-template system yet.
- This cloud session has no Cloudflare MCP or credentials. Existing D1 ID is configured, but remote inspection/migrations/deploy are not possible here. Local D1 validation is independent.

## Completed first slice

- Shared validation/prompt and hard-filter selection implemented; status from imported JSON is discarded.
- D1 API and two migrations implemented and applied locally. Editing invalidates approval; admin fails closed on nonloopback/missing token.
- Expo app and local Studio implemented. Manual JSON and image optimization/download tested; no remote cloud upload or AI API.
- Independent review found stale writes, late SPIN preference races and Studio navigation races. All fixed with regression tests; stale versions return 409, conditional D1 updates/events are atomic, busy controls are locked. Concurrent duplicate import was also reproduced and fixed.
- Verification: npm ci repeat installation succeeded; npm test 17/17; typecheck passed; Studio production build passed; Expo web export passed; Android and iOS Hermes bundle exports passed.
- Browser test completed EAT and BOOK import/review/publish, image optimization/download/static serving, public D1 catalog, Expo SPIN/details, allergy filtering, pool exhaustion and busy guards at desktop/mobile viewport. SMOKE records were unpublished afterward; local test drafts may remain.
- Live Expo development server loaded and completed SPIN in Chromium. Optional React Native DevTools cache update failed on read-only home, then shipped fallback was used; app workflow still passed. Vite's Zod annotation warnings do not fail build.
- Expo SDK dependency check used offline bundled SDK metadata and passed, with runner warning that offline validation is weaker. Official template dependency versions and native exports were also checked.
- install_script/start_skill saved in environment draft; publishing the environment remains separate.
- Not run: physical Android/iPhone Expo Go, remote D1 migrations/deploy, production auth/RBAC, actual 50+50 editorial release gate.
- No paid services/resources or account plan changes performed.
