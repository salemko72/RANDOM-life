# RANDOM life: launch and category controls

Implemented in the shared web experience, which is also embedded by the Expo shell.
No new Android build was started for this change. Later fixes made on the user's
Windows machine are not present in the remote `android-expo-windows` branch;
merging UI work must preserve those local build fixes.

- The right rail uses existing inline SVG icons: utensils, book, screen/play,
  running figure and location pin. Only rail photos were replaced; wheel and
  content imagery remain as before.
- Labels are larger, localized, and may wrap to two lines. Fixed square icon
  boxes prevent squashing. Compact-height rules keep the rail and spin action usable.
- Opening the app shows RANDOM life and informational legal links for two seconds.
  The wheel then enters from the left and the rail from the right. New visitors
  proceed to the existing optional-profiling onboarding. Direct Studio URLs skip
  the splash. Legal links are also available in Profile; no acceptance is recorded.
- Reduced-motion styles continue to apply. Startup does not start autoplay audio,
  a recommendation spin, or alter profile data.
- Terms, privacy and deletion pages are static Pages assets. D1/catalog access is
  independent of the splash and editor authentication.

Verification: `npm run typecheck`, `npm test`, `npm run build:preview`,
`node scripts/smoke-launch-categories.mjs`,
`node scripts/smoke-profile-consent.mjs`,
`node scripts/smoke-favorite-images.mjs`.

The launch smoke test verifies timing, all five SVG controls, ENG/BHS labels,
geometry and action placement at 320x568, 360x640, 375x667, 390x844 and 412x915,
READ selection, fresh onboarding and the Studio exception. These are Chromium
viewport checks, not physical Android/iOS tests. The previously reported Android
startup crash remains a separate unresolved issue.
