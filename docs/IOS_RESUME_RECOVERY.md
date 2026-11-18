# iOS resume recovery — IOS-RESUME-001

Plan, 18.11.2026. Base: `4a567c339a7efeff625ccecf1024887c7e9c9cd4` (TestFlight1.0.1/5).

1. Reproduce missing recovery in an isolated lifecycle harness and demonstrate stale bootstrap data loss.
2. Add a bounded generation-aware recovery controller. Defer recovery in background. Ignore stale callbacks, including SDK destroyWebView termination notifications.
3. Refresh installed HTML/bootstrap/catalog from current native state before remount; never reread old preferences from disk over in-memory state. Healthy resume must retain its document.
4. Add anonymized diagnostics and an explicit retry on failure. Preserve the ad runtime and its frequency limits.
5. Run lifecycle/state regression tests, full tests, TypeScript and preview. Independent review. Record exact source and physical iPhone QA steps.

Static evidence: react-native-webview13.16.1 RNCWebViewImpl.m forwards webViewWebContentProcessDidTerminate without reload; appDidBecomeActive only handles audio switch. destroyWebView also emits termination, requiring stale generation filtering. No termination handler exists in installed App.tsx. This matches the symptom but is not physical-device proof of the reported cause.

No build, upload, merge, production deploy or cost authorized by this maintenance step. A new binary and real iPhone verification will be necessary.
