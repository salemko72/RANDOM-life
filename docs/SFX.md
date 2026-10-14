# Original interface SFX

The preview synthesizes its own sounds using Web Audio; no third-party audio files are downloaded. Clicks use a short low-volume sine tone; wheel ticks follow actual sector transitions and slow down with the rotation; landing and saving use a soft two-tone confirmation.

Main menu → Sound effects toggles all effects. This setting is stored locally and is included in the native profile bridge. Audio initializes only after interaction. Background tabs suspend playback; unsupported audio contexts fall back silently. Music is not included yet.

Browser validation exercises actual oscillators, tick and landing calls, mute and persistent preferences. Device audio loudness and hardware silent-mode behavior should be checked on phones.
