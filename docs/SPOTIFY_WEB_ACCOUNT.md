# Spotify web account integration

The user supplied public Client ID `9c28494375a04e8c8667b2629dab6515` and registered this exact HTTPS redirect:

`https://random-life-preview.pages.dev/auth/spotify/callback`

No Client Secret is used. Profile offers Connect Spotify, account display name/Premium status and Disconnect. OAuth uses Authorization Code + PKCE S256, fresh random state, a 10-minute one-time pending request tied to the local profile, and clears the authorization query before token exchange. Requested scopes are `streaming user-read-private user-read-email user-modify-playback-state`. Email is not stored or displayed.

Tokens and account display name/product are in dedicated sessionStorage keys for the current tab, never the local profile, D1, catalog cache, native storage bridge or diagnostics. Refreshes are deduplicated; disconnect/profile changes prevent in-flight refresh from recreating a session. Tokens are sent only to Spotify endpoints and the official Web Playback SDK. Browser-session storage can be affected by browser restore behavior; Disconnect explicitly removes it. Permission revocation is managed in Spotify account Apps settings.

Stage generates `/auth/spotify/callback.html` with absolute JS/CSS URLs and no-referrer metadata; Pages clean URLs serve the registered extensionless callback. Client rendering recognizes this route and returns to Profile after successful login. No backend/database changes are needed.

A connected Premium account uses `https://sdk.scdn.co/spotify-player.js`, an SDK device named LifeSpinner, `activateElement()` for user gestures, playback through the Spotify Web API with that device ID, and SDK playback-state events for status/artwork. Play requests are serialized/deduplicated; Pause/Resume does not restart the track. Disconnect stops the active player. The iframe preview remains available without a connected Premium account. This does not promise automatic playback, unrestricted catalogs, background playback with the app closed, or availability on every browser.

This step supports the web preview only. The file-based native APK disables account connection until a native OAuth/deep-link and secure-storage flow is implemented in a future package. Existing embed behavior is preserved there.

`tests/spotify-auth.test.ts` covers PKCE/state/expiry, exchange, refresh deduplication, disconnect races and profile isolation. `scripts/smoke-spotify-login.mjs` exercises the browser redirect/callback, account UI and Premium player with mocked Spotify endpoints/SDK. Actual Spotify login and playback still require the account owner to test. Development-mode Spotify apps may require test accounts to be added in the developer dashboard and are subject to Spotify's current access limits.

Playback reliability: each explicit play request is consumed once; repeated SDK `ready` events do not replay/reclaim a stream. A generic SDK authentication failure is a player error, not proof that the OAuth refresh grant was revoked, so it does not silently erase the account connection. Explicit disconnect and confirmed refresh-token rejection still clear it. Cleanup uses SDK disconnect without queuing another asynchronous pause.

Local diagnostics (no account/device IDs, track names or tokens): `spotify_player` source 1 = Premium SDK, 0 = embed; stages 1 create, 2 ready, 3 requested play, 5 playback state (`paused`: 0 playing, 1 paused, 2 null/inactive), 6 not-ready, 7 play accepted, 8 play request failed, 9 teardown, 10 user pause, 11 initialization error, 12 account error, 13 playback error, 14 SDK authentication error, 17 autoplay failure, 18 token lookup failure, 19 connect rejected. `audio_focus` 1 = interface audio context created, 2 = resumed. These distinguish client teardown, provider errors and playback state changes; they do not establish the cause of a real device failure until its log is examined.

### Autoplay preparation and compact controls

A connected Premium account prepares one silent SDK player before the first LISTEN spin. Capture-phase clicks on spin and music controls activate that existing player during the browser user gesture; the track request still waits until the spin completes. No song starts merely from signing in. Stopping music pauses and cancels pending playback while retaining the silent prepared device; disconnecting the account tears it down. Browsers and Spotify may still reject autoplay, so manual Play remains available.

Outside the full LISTEN view, a small upper-right control opens the song, pauses/resumes, or stops playback. The existing provider instance stays mounted; the large embed and transport no longer occupy the lower content area or shift the recipe action bar.
