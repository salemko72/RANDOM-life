# LifeShuffler 0.21.0 (versionCode 4)

Build source: `67dc231`. Package `com.salemko.randomlife`, existing Expo project
`@salemko/random` and existing Android keystore. Display name: LifeShuffler.

Build pages (check actual completion status on Expo):
- APK: https://expo.dev/accounts/salemko/projects/random/builds/bca4ec26-886d-4ef5-af2d-829a34736cba
- AAB: https://expo.dev/accounts/salemko/projects/random/builds/d0eecdae-3311-4633-94e8-1a335893705c

Included:
- Approved two-tone serif wordmark with the small wheel over the i; splash and
  home wordmark reduced by 15 percent following review.
- Wheel launcher icon, Android adaptive foreground/background, monochrome icon.
- Shuffle terminology, original animation durations and category photography.
- Item descriptions immediately below titles, wrapping around raised metadata
  pills; compact screens keep readable stacked content.
- Real catalog artwork for related books and similar stories.
- Reused online catalog with background refresh, cached approval validation and
  one category-candidate preparation per shuffle.
- Offline reserve of 100 items; installed HTML approximately 11 MB.
- Corrected native startup timing. Diagnostics are stored separately per release
  so reports from an older APK are not attributed to this build. The native
  menu shares the local JSON report; web downloads use the current app version.

Validation: 222 unit tests, root/native type checking, Expo dependency check,
Android Metro export, branding at 320/390/1000px, English/Bosnian onboarding,
wheel touch/keyboard, related-image bytes/navigation, offline native bootstrap
and diagnostic-share smoke checks passed. Launcher/adaptive assets are 1024px.
Physical phone startup and performance still require the tester's device check.

Install the APK over the previous version without clearing app data. Test cold
launch, several shuffles, related titles, favorites after restart, full images,
and airplane-mode reserve. Open the menu and share the diagnostic log for review.

The AAB is for Play Console upload; creating it does not submit or publish it.
Store listing title changes are separate from the launcher display name.
Store-name availability has not been verified: access to Google Play and Apple's
search service is restricted in this environment. Do not interpret the successful
build or selected brand as evidence of name availability or trademark clearance.
