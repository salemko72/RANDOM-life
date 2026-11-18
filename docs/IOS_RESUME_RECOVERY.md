# iOS resume recovery — IOS-RESUME-001

Plan, 18.11.2026. Base: `4a567c339a7efeff625ccecf1024887c7e9c9cd4` (TestFlight1.0.1/5).

1. Reproduce missing recovery in an isolated lifecycle harness and demonstrate stale bootstrap data loss.
2. Add a bounded generation-aware recovery controller. Defer recovery in background. Ignore stale callbacks, including SDK destroyWebView termination notifications.
3. Refresh installed HTML/bootstrap/catalog from current native state before remount; never reread old preferences from disk over in-memory state. Healthy resume must retain its document.
4. Add anonymized diagnostics and an explicit retry on failure. Preserve the ad runtime and its frequency limits.
5. Run lifecycle/state regression tests, full tests, TypeScript and preview. Independent review. Record exact source and physical iPhone QA steps.

Static evidence: react-native-webview13.16.1 RNCWebViewImpl.m forwards webViewWebContentProcessDidTerminate without reload; appDidBecomeActive only handles audio switch. destroyWebView also emits termination, requiring stale generation filtering. No termination handler exists in installed App.tsx. This matches the symptom but is not physical-device proof of the reported cause.

No build, upload, merge, production deploy or cost authorized by this maintenance step. A new binary and real iPhone verification will be necessary.

## Implemented and verified

- Application source: **`9b5f097835cb4d5da44db2d418ce7df4a533492f`**.
- Claim: `7a71cb9`; branch `codex/salem-ios-resume-recovery`.
- Healthy background/inactive/active transitions keep the current WebView, screen and draft.
- A terminated content process invalidates its document generation immediately; recovery runs only while active. Intentional SDK unmount callbacks and stale errors/messages cannot trigger another restart or overwrite current state.
- Before mounting the new WebView, refresh `native-state.js` from the latest in-memory bridge snapshot (not old AsyncStorage or startup seed), and `catalog-cache.js` after any received catalogue writes/clear have finished. Recreate cached installed HTML if iOS has purged it.
- Keep the native ad controller alive. Its existing frequency/session counters are not recreated by WebView recovery. Only the existing per-document reset is used on new document load.
- At most two automatic recoveries in a rolling minute; subsequent failure shows **Try again / Pokušaj ponovo**. File and WebView load errors also expose that retry. Successful initial preference hydration is retained; a failed first storage read is attempted again on manual retry.
- Diagnostics add only whitelisted numeric native lifecycle/recovery events, no preferences, recipe choices or user content.

### Checks executed

All on the source above (documentation-only changes follow):

| Check | Result |
| --- | --- |
| `npm test` | **346 / 346**, 45 files |
| `npm run typecheck` | PASS |
| `npm run build:preview` | PASS; generated ignored preview assets |
| `node scripts/smoke-native-resume.mjs` | PASS; actual App.tsx rendered via React DOM with native boundary doubles |
| `EXPO_NO_TELEMETRY=1 npm run export:ios -w @random/client` | PASS; Hermes/Metro export, 795 modules |
| `git diff --check` | PASS |
| Independent read-only review | One storage retry finding fixed; follow-up found no important remaining defects |

The harness proves normal resume retains the document; background termination is deferred; current preferences, favorites, history, language and catalogue are seeded despite pending preference disk writes; cache purge recovers; old SDK termination/error/storage callbacks are ignored; native ad runtime is retained; failed preparation/manual retry and transient initial storage read recover. Unit tests also cover retry budget expiration, cold background start and background manual retry. Tests were observed failing for missing/latest-state bootstrap support, catalogue read overtaking pending writes, and the initially poisoned read retry, then passing with their fixes.

Local export paths (ignored build artifacts, not an IPA): `apps/client/dist-ios/metadata.json`, `apps/client/dist-ios/_expo/static/js/ios/index-1d7b3bd6c6b59fe64a43b08bff7d8b98.hbc`. No EAS build, signing, Xcode/Pod compilation, store submission or production action occurred; version/build numbers remain unchanged.

## Before the next binary

This is a focused patch from installed build5, **not a combined language release**. To include it in newer source, apply the application source commit above on a new integration branch and review App.tsx conflicts explicitly. Preserve the newer device-language foreground injection and `prepareNativePreview` feature arguments (`deviceLanguages`, `buildInfo`) as well as this recovery state getter. The unbuilt translation source remains on `codex/salem-content-translations` (handoff `854de3d3e315bdacc326f0caf2a6149ec2efc168`). Do not overwrite its App.tsx with this older baseline wholesale.

Before an authorized iOS build: select and freeze the combined clean SHA, check the next unused iOS build number and free EAS quota, retain the existing signer, rebuild the installed preview, and run the checks again. **Do not reuse build5** or assume this commit is already on TestFlight. No need to change D1 for this native bug fix. Android uses the same shared source but its process-death callback is not newly handled in this iOS fix.

## Physical iPhone QA still required

1. Record iPhone model, iOS version and installed candidate version/build. Confirm local preferences, dietary hard filters, history, favorites and cached catalogue before testing.
2. Open a result/detail, leave for 10 seconds, return through app switcher and icon: healthy document should retain its screen.
3. Repeat after 5, 15 and 30 minutes using other apps, including memory-intensive apps. If iOS terminates web content, LifeSpinner should recover to its normal startup/home flow with saved data; current transient result/draft may be reset **only on process recovery**.
4. Repeat offline after a successful catalogue sync; verify installed reserve and durable catalogue, corrected content and filters still work.
5. Repeat around consent/privacy form and test-ad open/close/background; verify no unexpected ad on foreground and existing frequency caps. No live-ad clicking.
6. If cream/blank recurs, record duration and preceding screen/action and export the diagnostic log once accessible. Look for `native_background`, `native_foreground`, `web_content_terminated`, `webview_prepared`, `webview_loaded`, `web_boot`, `ui_ready`, `webview_recovery_failed` and `page_error`.

**Limit:** the report was not reproduced on a physical iPhone here. This repairs the confirmed missing process-termination path; a JS deadlock/GPU/SDK stall without a termination event is not proven or covered by that callback. Loading errors have a visible retry, but this patch does not add a general WebView heartbeat watchdog. Do not mark the exact device symptom physically fixed until QA passes.

## GitHub status

Source and documentation pushed on `codex/salem-ios-resume-recovery`. Draft PR creation was blocked by GitHub GraphQL403; no PR exists from this attempt. [Compare / open PR](https://github.com/salemko72/RANDOM-life/compare/codex/salem-offline-build5...codex/salem-ios-resume-recovery?expand=1) against codex/salem-offline-build5. No merge.
