# Spin audio recovery — 25.11.2026.

Application source `9282fde4c27a1266ed1b37bd2fd5d322fa417043` includes the Personalize artwork correction. Before this change, Spin discarded wheel audio when its Web Audio context was no longer running. The recovery code handled suspended contexts only. A simulated interrupted context reproduced the loss.

Spin now checks the context again when the animation starts and attempts recovery. A delayed resume plays only the remaining spin time and is discarded on landing, mute or pause. The animation can continue while audio resumes.

433 tests, TypeScript and preview generation passed. Two focused tests cover interruption recovery and cancellation of late audio. The Chromium smoke passed with a local invocation that waits for onboarding and uses the current navigation control. Physical iPhone verification remains pending.

Source pushed. GitHub returned 403 for PR creation. [Compare changes](https://github.com/salemko72/RANDOM-life/compare/codex/salem-ios-build10...codex/salem-personalize-remove-books?expand=1). Both corrections are ready for the next build.
