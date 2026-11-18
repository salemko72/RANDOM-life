# Language foundation ledger — 18.11.2026.

Plan: docs/superpowers/plans/2026-11-18-language-foundation.md; spec: docs/LANGUAGE_EXPANSION_PLAN.md.

Ruling: User approved phased work and asked to start; execute inline without another approval loop. This session completes foundation1A, while four full dictionaries/content remain separate next phases. Cost if mistaken: users expecting finished languages must be told clearly that only en/bs is active.

Ruling: Reuse random-life.locale.v1 with auto instead of a new persisted key. Existing snapshot readers reject unknown keys and could lose profile data on downgrade. Cost: old binaries treat auto as English, while preserving profile/history; new binaries resolve it correctly.

Pre-flight: Task1 generic locale resolver supports Task3 ready-only Locale; Task2 optional native boot tags feed Task3 with browser fallback. No new Locale union activation is allowed while legacy en/else-BHS strings remain.

Task1: pending. Task2: pending. Task3: pending.
