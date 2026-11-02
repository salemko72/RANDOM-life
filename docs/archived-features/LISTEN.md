# LISTEN — parked for a future release

User decision, 2026-11-02: remove LISTEN from the shipping application, preserve it for later. The iOS release has five categories (EAT, READ, WATCH, MOVE, GO), no Spotify account controls, SDK, automatic music preparation, music navigation or OAuth callback handling. Existing music favourites/history remain stored but are hidden from the current UI.

Preserved implementation: commit `0a688c1` on remote branch `codex/listen-playlists`. It contains the fifteen-playlist prototype, PKCE account connection, SDK/iframe players, mood selection, compact controls, artwork, tests and the metadata verification tool. Spotify playlist references still need live verification; that feature was not rolled out.

A portable source snapshot was also exported as `/workspace/shared/ios-preparation/LifeSpinner-LISTEN-archive.zip`. No secrets or account tokens are part of this snapshot. The unused implementation modules remain in source for study/testing but are not imported by the shipping application. Old music favourites are not deleted or converted to unrelated content.

To restore later: start from the current release, review the archived implementation and reintroduce the integration deliberately; do not overwrite the full current WebExperience/CSS with the old snapshot. Verify current Spotify policies, playlist metadata and playback access. Native Spotify OAuth, deep links and device playback require separate implementation/testing; the archived web connection alone is not native support.
