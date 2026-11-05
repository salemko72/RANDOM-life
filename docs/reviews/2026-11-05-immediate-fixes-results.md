# Immediate fixes — implementation and verification

Scope approved after the testing report: Android Back; iOS zoom confirmation; live/reserve dietary verification; current iOS/Android privacy; Share App in Profile and social/system sharing. No advertising SDK, issue-report UI, guide, rating prompt or store-graphics production is included.

## Android Back

A bounded request/acknowledgement bridge handles the hardware button. An exit acknowledgement is accepted only for the currently pending hardware request; unsolicited messages cannot exit the app. Back consumes the active spin lock, then closes a photo, profile step/draft, panel, details or result as appropriate; only the wheel root allows Android exit. Profile steps preserve unsaved draft values when navigating backwards. Discard/cancel prompts appear only for changed values that would be lost. Initial onboarding exit, editing cancellation and Escape cancellation use the same dirty-value protection. iOS does not gain a programmatic exit.

Browser regression testing exposed an event-priority detail: a CustomEvent targeted at Window runs target listeners in registration order. The native request now targets Document and bubbles, so the active profile capture listener handles its own steps before the outer scene handler. Closing panel transitions are awaited in the browser test, not mistaken for a navigation failure.

Physical Android/IME/predictive-Back verification remains a signed-device test; simulated browser bridge events are not that proof.

## Dietary data and offline recovery

Read-only public audit: 467 items, 147 recipes, public snapshot `026e09e98ea6d0ad3b70f815991789b34faac053e88eb24416d5363362dfacd6`.

| Filter | Public recipes | Old installed reserve | Refreshed installed reserve |
|---|---:|---:|---:|
| Gluten-free | 24 | 0 | 3 |
| Lactose-free | 56 | 0 | 15 |
| Vegan | 38 | 7 | 13 |
| Vegetarian | 62 | 8 | 15 |
| Reviewed low-phosphate | 17 | 7 (old snapshot) | 8 (current approvals) |
| Gluten + lactose free | 19 | 0 | 3 |

The old EAT reserve predates dietary corrections in the public database, including later removal/review of some old low-phosphate labels. All twenty EAT rows were refreshed from currently approved public records; no label was inferred, no D1 record was modified, and eighty non-food records remain untouched. Images are local, optimized, and the full reserve metadata/images use 3,715,448 bytes (under 4 MB decimal and the 10 MiB budget).

The selection/refresh tool now requires seven reviewed low-phosphate, seven vegan, three gluten+lactose-free and seven lactose-free entries, allowing overlap. A refresh stops instead of publishing an inadequate reserve. Regression tests cover the real bundled data and selection failure cases. Exhausted recommendation cycles never reintroduce excluded allergens; truly empty combinations still return no match rather than weakening constraints.

Network-return events now force a deduplicated catalogue check. A failed check retries after backoff even when the retained snapshot is otherwise fresh; cached data is retained. An authoritative empty public catalogue remains empty rather than silently resurrecting the reserve. Existing reserve smoke expectations were updated for retained-cache semantics, hidden mobile footer state and counting only the reserve's 100 assets rather than unrelated bundled pictures.

Audit results in `2026-11-05-dietary-audit.json` include single allergens, combinations, online/cached/reserve paths and publication checks. This is consistency/selection validation against reviewed data, not independent clinical certification or a guarantee about manufacturing cross-contact. The three bundled gluten-free recipes' ingredient lists were also inspected; ingredient labels still matter.

## Sharing

Profile includes Share LifeSpinner. Native uses the OS share sheet; web uses Web Share/clipboard/manual fallback. Recipients receive `https://random-life-preview.pages.dev/get-app?lang=en|bs`. There are no social login/SDK integrations or fixed recipients. Social apps appear only if installed and able to receive that type of share; plain links do not guarantee Instagram Story/feed publishing.

Item shares retain their standalone item URL, add the app-information link and include the same link in the standalone page footer. No profile name, dietary answers or tokens are added to the payload. Native app-share messages carry a strict type+locale only; content/link generation is controlled locally. The public landing page shows testing status and a web-preview option. Private TestFlight/Play invitations are not published, and public store buttons stay disabled in `apps/client/public/app-distribution.json` until the listings are confirmed public.

## Privacy and zoom

English/BHS privacy text now covers iOS, Android, sharing, user-directed local diagnostic export, cache/reserve and external services. The historical Spotify section is labelled as an earlier web experiment, not a current mobile feature. Operator/contact are preserved. No ad SDK or tracking was added, so the current no-ad statement remains truthful; future ad integration still requires its own policy/consent/store declarations.

The 16px editable-field fix and native-only viewport zoom lock from iOS build 2 remain intact. Browser/native HTML checks pass. Actual iPhone confirmation after typing and dismissing the keyboard is still requested from the user; no cloud test is described as a physical iPhone result.

## Verification / delivery boundaries

285 Vitest tests (39 files), TypeScript, native iOS/Android Hermes export, EN/BS Back/profile/share browser smoke, reserve asset/offline/recovery smoke, profile/cache and input-zoom smoke passed. The installed-file test uses a local HTTP fixture with native bootstrap; it does not prove physical file:// operation. Four existing Node release-planning checks also pass.

No new signed APK/AAB/IPA is created by this source-fix scope. Phone changes require the next test binaries. Public share/privateness documents are staged for the web; deployment must preserve all existing 56 downloads, bindings/secrets and the public catalogue version. Backend source and D1 are unchanged. Remaining next-package items remain in the original review backlog.
