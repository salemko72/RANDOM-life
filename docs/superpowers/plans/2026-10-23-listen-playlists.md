# LISTEN playlists implementation plan

Goal: replace the four-song demo with fifteen mood-grouped Spotify playlists.
Architecture: a minimal playlist registry feeds typed Spotify URIs to the persistent SDK/embed player. Old track identifiers resolve only for saved-item compatibility.
Tech stack: existing React, TypeScript, Spotify SDK, Vitest and Playwright.
Spec: ../specs/2026-10-23-listen-playlists-design.md

Constraints: no backend/content contract changes, audio/track caching, new scopes or native packages. Preserve background playback, silent preparation, Play fallback and small upper-right controls.
Review focus: playlist context versus track URI; automatic next-track metadata; mood repeats; old saved tracks; inaccessible provider/playlist.

- [x] Test registry grouping/no-repeat selection, stable saved keys, strict share destinations, playlist-context and legacy-track API requests.
- [x] Add minimal playlist registry and URI helpers; retain old saved-track lookup.
- [x] Update SDK/embed playback, share links, mood labels and initial calm selection; show current Spotify metadata for changing songs.
- [ ] Run unit/type/build checks, mocked browser tests and existing D1 smoke; inspect compact UI.
- [ ] Verify real playlist names/IDs and official documentation when network access is available. Deploy only once content can be verified; preserve existing downloads/catalog/bindings.

Verification evidence: 273 unit tests pass, root/native TypeScript pass, preview build passes, BHS/EN mocked playlist and Premium OAuth smoke checks pass. The required legacy `smoke-d1.mjs` reaches successful migration and publication but waits for obsolete “Published and saved” text; current unchanged Studio says “Published · content and image saved to D1”. The script also contains retired consumer Studio/status selectors. Do not report it as passing or change production Studio to fit the stale test.

Rollout remains pending: public Spotify metadata/documents are blocked by the active restricted network policy. The user attempted to publish unrestricted access, but the settings UI reported publication/concurrent-environment errors. Keep the running web release intact until real playlist verification can finish.
