# Language foundation ledger — 18.11.2026.

Plan: docs/superpowers/plans/2026-11-18-language-foundation.md; spec: docs/LANGUAGE_EXPANSION_PLAN.md.

Ruling: User approved phased work and asked to start; execute inline without another approval loop. This session completes foundation1A, while four full dictionaries/content remain separate next phases. Cost if mistaken: users expecting finished languages must be told clearly that only en/bs is active.

Ruling: Reuse random-life.locale.v1 with auto instead of a new persisted key. Existing snapshot readers reject unknown keys and could lose profile data on downgrade. Cost: old binaries treat auto as English, while preserving profile/history; new binaries resolve it correctly.

Pre-flight: Task1 generic locale resolver supports Task3 ready-only Locale; Task2 optional native boot tags feed Task3 with browser fallback. No new Locale union activation is allowed while legacy en/else-BHS strings remain.

Task1: pending. Task2: pending. Task3: pending.

Task1 complete: focused RED showed5 expected behavior failures; implementation then full suite343/343 PASS. Shared helper keeps only reviewed locales active and preserves old manual choices. Task2 dependency installed with scripts disabled and shared npm cache (default home cache unavailable).

Task2 native bridge: SDK-matched expo-localization installed, boot and foreground tags serialized through bounded shared sanitizer. Focused7tests PASS after RED; foreground changes dispatch an event without reload. Web tag-source helper implemented here because it shares sanitization tests with native bridge. No new storage key.

Final fresh-context review (gpt-6.2-astra) found two important issues. Fixed malformed BCP47-only native lists overriding the browser: regression observed bs-a instead of en-US, then Intl structural validation makes3/3focused tests PASS. Config fix registers only en/bs through the installed SDK plugin and Android dynamic locale handling; generated platform config verification follows. Reviewer confirmed auto persistence, legacy manual preservation, old snapshot acceptance and no form remount.

Task3 implemented: one shared automatic/manual chooser in setup/edit/menu; ready locales remain en/bs. Browser RED observed fresh bs-BA incorrectly selecting English before provider implementation. Browser GREEN covers fresh BHS, explicit ENG/reload, automatic/reload, unsupported German gating, foreground native updates, legacy BHS priority, retained draft and blocked storage. Profile and footer checks included. Existing binaries are unchanged.

Task2/3 final unit suite347/347 PASS, TypeScript and preview PASS. Generated Expo introspection PASS: CFBundleLocalizations en/bs, Android localeConfig reference and locale/layoutDirection configChanges; existing iPhone-only/portrait retained. Full `expo install --check` could not complete because CLI attempts unavailable /home/agent/.expo; direct installed-package comparison against Expo bundledNativeModules confirms expo-localization57.0.2 matches~57.0.2. Native Xcode/Gradle build and physical device language/settings tests remain for the next authorized native candidate.

Ruling: Register only reviewed en/bs in native per-app language settings now, using the installed plugin's documented supportedLocales options; no unfinished locale declarations. Cost if wrong: platform behavior needs physical QA before release. app.json is added to this claim's scope; no parallel app config operator is active in reviewed claims.
