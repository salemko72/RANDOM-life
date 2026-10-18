# Item actions and shared pages

All five categories use one `ItemActions` component: Like (heart), Share, and
completed/seen (eye). The separate bookmark controls have been removed. Like
uses the existing favorites IDs and persistence; no favorites migration is needed.
The eye uses the existing completed IDs, independent of favorites.

Sharing creates `https://random-life-preview.pages.dev/item/ID?lang=bs` or `en`.
Web Share opens the browser/OS share sheet. Unsupported browsers copy the link;
if clipboard access also fails, a selectable link is shown. Cancellation does not
copy anything. The installed native app uses React Native Share via a validated
bridge message. Existing APKs need rebuilding to gain the new controls/bridge.

The Pages worker renders item-specific Open Graph metadata, then the browser
loads `SharedItem` instead of the full app. This route never mounts the wheel,
category rail, onboarding, Studio or main navigation, even with `#studio` in the
URL. It shows the complete selected recipe/plan or book/film description and
existing external sources. Reactions are local device data without a sign-in.
This is a restricted presentation, not an authentication boundary: the main app
and public catalog continue to be public at their normal addresses.

The worker's `/api/shared-item/ID` reads one record using a bound ID. Only fully
approved, publishable records are returned, without editorial approver identities.
Missing/draft/withdrawn records return 404; database failures return 503. Pages
are not cached or indexed. No new content fields, migrations or generator format
changes are required. Images retain the existing public-publication checks.

Verification: `npm test`, `npm run typecheck`, `npm run build:preview`,
`node scripts/smoke-item-sharing.mjs` and `node scripts/smoke-image-viewer.mjs`.
Sharing smoke tests cover both languages, 320/390px screens, all five categories,
full recipe content, isolated navigation, correct link targets, persistent likes,
withdrawn content, and escaping hostile title/metadata text.
