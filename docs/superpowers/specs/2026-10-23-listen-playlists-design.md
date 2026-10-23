# LISTEN playlists

Approved in conversation: fifteen existing Spotify playlists, three each for energy, ambient, feel-good classics, upbeat and mellow/melancholy. Keep only playlist name, Spotify identifier and mood. Default spins select ambient; mood changes select within their group without immediately repeating the previous playlist. Spotify owns the songs and queue. Maintain background playback, autoplay preparation, compact upper-right controls, and legacy saved songs.

Approaches: individual local tracks were rejected in favor of existing Spotify playlists. No recommendation API, playlist-track import, audio caching, new scopes or backend writes are required. Premium uses playback context_uri; iframe fallback uses playlist URI. Actual current-song artwork/title come from SDK state, never from a local song catalog.

Constraint: this environment currently denies Spotify network access. Candidate playlist names/IDs need live verification before a production rollout. Technical playback tests are provider mocks, not evidence of real Spotify availability or account access.
