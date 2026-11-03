# LifeSpinner iOS / TestFlight preparation

Initial preparation: 2026-11-02. Membership was subsequently activated. User confirmed successful build 0.23.0 (1), upload to App Store Connect and installation through TestFlight on 2026-11-03.

## Release identity

- Display name: LifeSpinner; Expo project/owner unchanged (`random`, `salemko`).
- Version 0.23.0; iOS build 1; bundle identifier `com.salemko.randomlife`.
- iPhone and iPad, portrait/full-screen. Generated Expo iOS project targets iOS 16.4 or newer. Existing Xcode compatibility must satisfy this Expo SDK; do not lower deployment targets by hand.
- iOS icon: `apps/client/assets/ios-icon.png`, 1024×1024 RGB PNG, no alpha; derived from the existing approved icon with a solid brand background. No new logo design.
- Standard HTTPS encryption declaration: ITSAppUsesNonExemptEncryption=false. Native generated ATS blocks arbitrary insecure network loads.
- EAS `testflight`: store distribution, physical-device iOS build. `ios-simulator`: simulator build, not installable on an iPhone or uploadable to TestFlight.
- Android's next source version code is 8 to match the next common app version; no Android build is requested or started.

## Product state

LISTEN/Spotify is parked: five wheel categories and no music controls, Spotify login, SDK load or OAuth callback in shipping JS. Old music favourites/history are retained locally but hidden. Archive: `docs/archived-features/LISTEN.md` and branch `codex/listen-playlists` at 0a688c1. Archived tests/modules remain available without being imported by the application.

The application retains installed local UI/assets, device-local profile and history, catalogue cache/reserve, native share and native diagnostics export. iOS diagnostic build/OS fields now report iOS values instead of Android's version code. No new telemetry, trackers, app permissions or backend schema changes.

## Reproduce on the Mac

From the repository root, with the configured compatible Node/npm versions:

```sh
npm ci
npm run prepare:ios
cd apps/client
npx expo prebuild --platform ios
npm run ios
```

The prebuild installs CocoaPods on macOS and generates `ios/LifeSpinner.xcworkspace`. Open the workspace, not only the xcodeproj. `npm run ios` compiles/launches the local simulator; it is not TestFlight distribution. Simulator testing does not require paid membership activation. Testing on a physical phone may require choosing your Apple development team and configuring signing in Xcode.

Native ios/android folders and build outputs are intentionally ignored by git; EAS regenerates the native project from app.json. Root npm postinstall rebuilds the embedded UI so the generated local HTML is available during cloud builds. Do not submit the Hermes export directory as an IPA.

## When membership is Active

1. Sign in to App Store Connect, accept pending agreements and confirm your Apple team. Do not share passwords or signing certificates in chat.
2. Register/confirm the bundle identifier above under that team. Create the LifeSpinner iOS app record in App Store Connect using that same identifier (SKU can be `lifespinner-ios`). App-name availability is not yet verified.
3. From `apps/client`, run `npx eas-cli build --platform ios --profile testflight`. Complete Apple's interactive signing/2FA in your authenticated session, or use approved App Store Connect credentials. Never invent a Team ID, ASC App ID or signing profile. If a local EAS token is not available, sign in to the existing salemko Expo account rather than creating a different project.
4. After a successful signed store build, run `npx eas-cli submit --platform ios --latest` and select the correct app/team. Upload is not public App Store publication; TestFlight processing/compliance and external testing review are separate.
5. Confirm processing in App Store Connect → TestFlight, provide test information, and invite internal testers first. Build 1 has not been uploaded. Increase ios.buildNumber for every subsequent upload of this version.

Remaining account dependencies: active membership; correct Apple team; app record; distribution certificate/provisioning; final App Privacy, content rating and tester/review details. The Apple team, ASC app ID and certificates are intentionally not guessed or stored in source.

## Verification and device checklist

Run root `npm test`, `npm run typecheck`, `npm run prepare:ios`, `node scripts/smoke-ios-preparation.mjs`, `node scripts/smoke-wheel-touch.mjs`, and `node scripts/smoke-native-file.mjs`. Browser viewport checks are not Safari, Simulator or physical iOS runs. iOS prebuild without CocoaPods on Linux is project generation only; Hermes export is JS/assets only, not an Xcode native compilation.

On an actual iPhone/iPad: first launch/splash, five sectors and spin animation, touch/back navigation, notch/home-indicator safe areas, profile persistence after force-close, fresh/cached/offline content, photo expansion, recipe/details scrolling, favourites/history, native share, diagnostics export and dynamic network changes. Check iPad portrait layout separately. No purchase/subscription, Spotify or tracking controls should be present.

Do not claim all users tested, a signed build, Apple approval, or a TestFlight upload based on the source/export/browser checks alone. No web/backend deployment is part of this preparation task.

## Recorded preparation results

Expo dependency check passed after the SDK-recommended patch update from 57.0.30 to 57.0.31 (no SDK major upgrade). 273 unit tests/36 files and root/native TypeScript passed. The iOS Hermes/assets export, iOS prebuild without pod installation, five-category interaction checks, hidden/retained music favourites checks, cache/profile checks and native-file bootstrap smoke passed. The generated project reports iOS 16.4, version 0.23.0/build 1, opaque 1024px icon and arbitrary HTTP loads disabled. Prebuild emitted a non-fatal note that top-level backgroundColor integration requires expo-system-ui; the app already paints its own warm native root/loading views. No Xcode compilation, Simulator/device run, signed IPA, Apple credential generation, submission or production deployment was performed.

The old `smoke-d1.mjs` is not a release gate for this source-only iOS preparation: it previously stalled on retired Studio publication text and contains retired consumer Studio selectors. Backend files were not changed. Do not describe that legacy script as passing.

## Updating after the first successful TestFlight installation

Apple Team ID: MNQY6SH96C. ASC app ID: 6830084481. EAS retains the distribution credentials and the App Manager API key created in the user’s authenticated session; their private contents are not stored in this repository. The testflight submit profile selects that app/team explicitly.

For each new upload, the release operator increments ios.buildNumber (the input/zoom fix is build 2), runs the checks, then uses root `npm run update:ios`. This rebuilds the embedded UI and runs EAS Build with `--auto-submit`. Noninteractive authorized agents can add `--non-interactive --no-wait --json` to the underlying EAS command. Build/submission results must still be checked; a queued job is not a completed upload. This is a one-command build/submit flow, not a scheduled GitHub Actions deployment or EAS Update/OTA setup.

Apple still processes the uploaded binary. Testers update through TestFlight; automatic updates depend on their TestFlight settings. New signing logins should not be necessary while EAS credentials remain valid, but expiration/revocation or new permissions can require the account owner again. Public App Store review/release remains separate.

Build 2 fixes sub-16px consumer form inputs (the name field was 12px), which can trigger iOS focus zoom. Installed native HTML locks page zoom with min/max scale 1 and user-scalable=no, and Android WebView zoom controls are disabled. Browser HTML keeps user zoom available. The separate full-image dialog remains functional; this does not disable iOS system accessibility magnification. Browser regression checks verify CSS, viewport policy and input/blur flow; the reported iOS keyboard issue must be confirmed on the real device after updating.

### One-command update operator

`npm run update:ios` now queries EAS for up to 100 recent iOS builds, chooses an integer above both local and remote build numbers, runs TypeScript/unit/release-planning checks, rebuilds the embedded UI, then requests EAS Build plus automatic submission. It requires the existing Expo login or EXPO_TOKEN, and valid EAS-held Apple credentials. The source app.json is updated locally; commit the resulting build number when recording a release. Keep release operations serialized; a local exclusive lock prevents two simultaneous updates from the same checkout, not from different machines. Unsupported metadata/authentication/check failures stop the release instead of guessing. No signing secrets are downloaded into source by this script. Browser-specific regression checks are run in the supported CI/agent environment rather than assuming Chromium exists on the user's Mac.

Current confirmed update: build a73b11b1-93e0-4af5-b12c-70b77a6a185c, version 0.23.0 (2), EAS build FINISHED; auto-submission 182c291c-08f0-471d-ba3d-a82e01af0e24 FINISHED on 2026-11-03. Apple processing/TestFlight group availability is separate. Build 2 was created and submitted without another interactive Apple login, using previously authorized EAS credentials. Do not claim that a future expired/revoked credential can never require renewal.
