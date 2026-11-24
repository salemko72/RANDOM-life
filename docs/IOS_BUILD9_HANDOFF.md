# LifeSpinner 1.1.1 (9) — clear Back navigation while scrolling

## Change

The focused recipe/book/movie/activity/outing scroll view previously moved its social controls and artwork directly under the fixed Back arrow. A stationary cream gradient now increases continuously from zero to full strength over the first 48 px of scroll, then blends to transparent below the navigation zone. Scrolling back to the top reverses it; there is no abrupt class-triggered strip or per-frame React render. The Back button is outside the gradient and above its touch guard. The faded navigation zone blocks accidental taps on the image/Like/Share/Completed underneath.

`DetailScrollSurface.tsx` owns its passive scroll listener and removes it on cleanup. Each item gets a distinct `details-<id>` key to reset the new item's scroll view without colliding with the overview's existing key. Closing details disables the guard immediately in CSS; reopening the same item restores its scroll-dependent fade. Native safe-area top is included in gradient and guard dimensions.

Shared iOS/Android source preserves build8's regional units, all six languages/online/cache/reserve translations, category repeat, renderer recovery, cinema counter5 and next-Spin ad policy. TestFlight profile retains **test ads**. No database or public web changes.

## Validation

- Browser regression observed RED on missing gradient before implementation.
- `node scripts/smoke-detail-top-fade.mjs`: real app, all five categories at390/320px, native top inset44px; opacity0→partial→full→0, Back hit testing during overlapping social controls, guarded top zone and normal result behavior PASS. Browser run caught a duplicate React sibling key during implementation; distinct key prefix fixed it and all ten category/width cases passed.
- Full suite431tests/65files PASS; TypeScript PASS; preview PASS; local iOS Hermes export917modules PASS at `/workspace/shared/ios9-local-export`. These are not a physical iPhone test.
- `smoke-native-resume.mjs` and `smoke-spin-ads.mjs` verify preserved lifecycle and ad behavior with native boundaries simulated.
- Screenshot `/workspace/shared/detail-fade/recipe-scrolled.png` visually inspected: fixed Back remains legible, image/social controls blend into the cream navigation zone.

## Build preflight and continuation

User explicitly requested this correction followed by **1.1.1, iOS build9**. EAS project `@salemko/random` / `04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a`, bundle `com.salemko.randomlife`. Inventory latest8, no9. Free quota before candidate: iOS8/15, total12/30; estimated and overage0. Existing APP_STORE certificate serialCC1209C468F7ABC54F45E3BFA7E67FB and active profile expire3 November2027; freeze credentials. Xcode27.2/scene support preserved. No new signing keys, paid resource, merge, web deploy, production migration or Apple submission.

Build8 remains unchanged/completed; this patch cannot change its IPA. Pin the new clean source and record EAS build9 ID/status below; do not duplicate a queued or completed job. Android code12 remains only a candidate: Ahmed must freshly check Play versionCode, signer and free quota before his build using the same shared source.

After the archive finishes, verify actual Xcode SDK/archive result. TestFlight upload/Apple processing and physical testing are separate statuses. Physical iPhone QA should include slow/fast scrolling in each category, return to top, intentional social actions below the fade, Back/Home and long background/resume. No claim of production publication or App Store approval.

## Frozen source and remote build

Application/frozen EAS source **8bdc628151d8839cf2ebca1f17a203ea73ebfac9**, clean before upload, pushed on `codex/salem-detail-scroll-fade`. [EAS build9](https://expo.dev/accounts/salemko/projects/random/builds/95160386-2cfb-40ab-af7e-74a1ef3cd3aa): **IN_QUEUE**, error null at request. No auto-submit or Apple upload. Reuse this job; source/source ZIP are already available to Ahmed. [Safe status](reviews/ios9-result.json) records the latest verified result.

[Download frozen source ZIP](https://github.com/salemko72/RANDOM-life/archive/8bdc628151d8839cf2ebca1f17a203ea73ebfac9.zip). Local ZIP `/workspace/shared/LifeSpinner-1.1.1-build9-source.zip`, SHA256 `a1206c211426d9e53505d5498c036fcee114303b882cd856de072bcac131333c` (GitHub's archive container may have a different hash; source SHA is the identity). Run root `npm ci` to regenerate ignored installed preview HTML before a build.

Apple server provisioning validation returned403; EAS continued with existing locally valid frozen profile. PR creation returned `Post https://api.github.com/graphql: Forbidden`; no PR exists from this attempt. Branch push succeeded. [Create draft PR against build8 branch](https://github.com/salemko72/RANDOM-life/compare/codex/salem-110-regional-units...codex/salem-detail-scroll-fade?expand=1). This is a GitHub API authorization failure, not an automatic approval rejection.

## Completed native archive

**FINISHED**, error null,24 November2026 at22:43CET. Version **1.1.1 (9)**, frozen clean source **8bdc628151d8839cf2ebca1f17a203ea73ebfac9**, EAS **95160386-2cfb-40ab-af7e-74a1ef3cd3aa**. Supersedes initial queue status above. Actual Xcode log confirms `iPhoneOS27.2.sdk`, Xcodebuild27B52 and `ARCHIVE SUCCEEDED`. Decoded logSHA256 `47570019e1a14bf91947d20dd9d7cd8304982dbf23964bbbf05ff008159acffb`. Independent IPA download from this environment returnedHTTP403; no IPA hash/embedded metadata claim. Free quota after build: iOS9/15,total13/30,estimated/overage0.

**No TestFlight submission requested for9.** The archive is ready for a separately authorized upload using this existing EAS ID; do not rebuild to submit. Apple processing/group availability and physical QA remain open. No production publication, merge, web or DB deployment.
