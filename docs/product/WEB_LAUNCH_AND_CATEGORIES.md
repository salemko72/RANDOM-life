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

## Full item images

Tapping the exposed artwork on either an item or its detail view opens a native
HTML dialog over the full viewport. It reuses the item's loaded image Blob URL,
fits the complete artwork without cropping, and does not change the curved layout.
The high-contrast close control is 60x60 pixels. Backdrop tap and Escape close it,
restore focus and preserve the underlying detail screen. The viewer locks body
scrolling and keyboard focus; unavailable images are not offered as full previews.
No new libraries, image copies or download requests are required.

`node scripts/smoke-image-viewer.mjs` verifies the exact image bytes/dimensions,
containment, close-control geometry, focus, backdrop/Escape, favorites and details
for all five categories, using mobile touch and desktop click at 320x568, 390x844
and 1000x900. Mock image fixtures are used for deterministic checks.

## Entrance animation regression

The base wheel previously retained `wheel-arrive`; removing `launch-reveal`
therefore started another animation after `launch-wheel-in` finished. The base
wheel now has no entrance animation. `node scripts/smoke-wheel-entrance.mjs`
records animation-start events with normal and reduced motion, verifies exactly
one entrance, and checks that settled opacity/position are not reset.

## Direct wheel category selection

The category-mode SVG sectors are touch/click controls, each mapped to its own
category through the same spin handler used by the side rail. Sector geometry
rotates with the visual, so no screen-coordinate/category guessing is needed.
Enter and Space activate focused sectors. Controls are disabled while spinning;
the existing synchronous spin lock rejects repeated taps. Item-mode previews
have no category controls. The center button still selects a random category.
The hidden home scene is inert while an item is displayed.

`node scripts/smoke-wheel-touch.mjs` verifies visible touch targets for all five
categories on rotated wheels at 320x568, 390x844 and desktop 1000x900, double-tap
locking, Enter/Space and the separate center random mode.
