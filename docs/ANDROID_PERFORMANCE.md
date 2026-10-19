# Android performance testing — 0.20.0 (3)

Build source: `96f5416`.

- APK: https://expo.dev/accounts/salemko/projects/random/builds/1065fef0-3d2c-4ffe-83d3-68dda3c284a9
- AAB: https://expo.dev/accounts/salemko/projects/random/builds/bc7e59d5-2747-4298-9e84-c719b56f6d0f

Both Expo builds finished successfully on 19 October 2026.

- APK: 80.5 MB
- AAB: 57.0 MB

Validation: 220 unit tests, type checking, Expo dependency check, Android Metro
export, offline/native bootstrap and share smoke, wheel touch/keyboard smoke
and eight full-motion diagnostic summaries passed. Both remote builds passed
21/21 Expo Doctor checks. Physical-device speed improvements remain to be measured.

This build includes the latest wheel, category photography, consumer navigation,
item sharing and Studio placeholder changes. APK and AAB use the existing signing
credentials and package name; neither build submits the application to Play.

## Optimizations

The preview build converts original PNG art into WebP outputs. Original art is
untouched. Photographs are limited to 1200 pixels; ingredient atlases retain up
to 2048 pixels with higher compression quality and unchanged normalized sprite
coordinates. Packaged legacy PNG art becomes approximately 3.3 MB of WebP.
The installed HTML decreases from approximately 49 MB to 11 MB (decimal).
The wheel's shadow now stays on a stationary layer instead of filtering the
rotating SVG. Reserve catalog and its 100 local images remain available offline.
These are reductions in packaged/processed content, not measured device speedups.

## Tester instructions

1. Install the new APK over the previous version; do not clear app data.
2. Close the application completely. Open it and note any visible wait.
3. Spin using the central button and category segments several times. Open an
   item, its details, the full image, and favorites. Repeat after reopening.
4. Test once in airplane mode to check the installed reserve catalog.
5. Open the top-left menu and choose **Podijeli dijagnostički log** /
   **Share diagnostic log**. Share/copy the JSON text and send it in this Codex
   conversation, along with which action felt slow. On the web this downloads
   `RANDOM-diagnostics.json` instead.

There is no automatic upload or external telemetry service. Native logs retain
at most 80 events across restarts under a separate local storage key. Export
includes app version/build, Android/API version, model/manufacturer and timestamps.
It does not include name, profile, favorites, item titles/IDs, tokens, URLs or
error text. Long task events are capped at 20 per WebView session; no per-frame
bridge messages are sent. Diagnostic storage failure does not block the UI.

## Interpretation

- `native_start`, `profile_loaded`, `assets_ready`, `webview_loaded`: elapsed
  milliseconds since the native JavaScript module began, not OS process launch
  or the user's launcher tap. `webview_loaded` is load-end, not proof of success;
  inspect `page_error` as well.
- `web_boot` / `ui_ready`: elapsed since WebView navigation start, including
  HTML processing. Ready includes the deliberate splash and reveal animations;
  first-time users can still be on onboarding.
- `catalog`: duration, number of items, online/backup or failure. Cached reserve
  reads are not a network latency measurement.
- `spin`: measured animation duration, frame samples, 95th percentile, maximum
  frame interval and count above 34 ms. Compare the same action/device. Hidden
  app/background runs and reduced-motion runs are flagged; do not treat their
  samples as normal rendering performance. This is rAF interval sampling, not
  GPU profiling or an exact dropped-frame count.
- `long_task`: main-thread tasks above the browser's supported long-task limit.
  Unsupported WebViews simply omit them. Errors are counted without capturing
  personal page content or stack text.

Tests use the same prepared installed HTML via local HTTP because managed browser
policy prevents file:// navigation. Physical device testing remains necessary.
