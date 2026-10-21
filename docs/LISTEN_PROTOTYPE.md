# LISTEN local prototype

LISTEN / SLUŠAJ is the sixth UI category. GO remains. This is a local prototype, not a new backend content category: D1/R2 schemas, publication contracts and Studio have not changed.

- Three bundled Spotify track references; no copied artwork/audio. Spotify's embed provides its artwork, branding and playback controls. No automatic playback is requested.
- Central spin can select LISTEN; its wheel sector and rail button also work. A chosen vibe lasts for the current page session only.
- Like and history use `listen:<Spotify track ID>` in the existing per-profile experience store. Explicit Listened uses the existing completed IDs. Opening a player does not mark a track listened.
- Share sends the direct Spotify track URL, not a nonexistent LifeSpinner item page. Native messages accept only the exact Spotify HTTPS track URL format.
- Offline UI replaces the iframe with a connection notice. Exiting LISTEN unmounts its iframe.
- Native navigation allows the exact Spotify track embed only when reported as a subframe. Local main-document navigation stays restricted. Native integration and actual Spotify playback still require physical-device testing; browser smoke tests mock the external iframe transport.

Before expanding the catalog or releasing: verify Spotify embeds on Safari/iPhone and Android WebView, artwork/track metadata and Spotify's current integration terms, availability/login behavior, and decide the editorial/backend LISTEN schema. Do not assume full-track playback or availability for all listeners.

The user authorized a web preview for testing. New APK/AAB builds remain on hold.
