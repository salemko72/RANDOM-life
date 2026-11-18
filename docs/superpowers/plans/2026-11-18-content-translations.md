# Four-language Content Translation Plan

**Goal:** Prepare translations of the pinned467-record public catalogue and its100-record offline subset for es/pt-BR/de/it, first checking a representative pilot. Produce reviewable draft data and an updated isolated preview, without publishing D1 or enabling new production locales.
**Spec:** docs/LANGUAGE_EXPANSION_PLAN.md, UI_TRANSLATION_HANDOFF.md; user18.11.2026 explicitly says OK go after catalogue/offline explanation.
**Method:** Independent locale translation memories under dispatching-parallel-agents; root owns source pinning, contracts, numeric/array/data invariants, merge adapter and testing. No paid API or external translation service.

## Constraints and shared interfaces

- Pin public snapshot59a712e7856e411d0d1b11e7c7c681cdb0e4e769522ccdbcd84a502df53eebf8 (467items), validate downloaded bytes before applying existing recipe-wording/generic-art projections. Preserve raw server hash separately from projected source hash.
- Keep English/BHS, IDs, versions, status, source URLs, nutrition, ingredient tags/quantities and dietary filters unchanged. Do not invent official BOOK/WATCH titles or author translations. Proper names remain literal.
- Each locale worker owns only content/i18n-2026-11-18/memory/<locale>.json and its own temporary progress files. Source is read-only. No commits, push, D1 or source code changes by workers.
- Translations remain reviewed:false linguistic drafts. No implication of human linguistic/medical review or cleared rights. New production ready list stays en/bs until activation QA and content publication are explicitly complete.
- Overlay is bound to itemID + sourceVersion + English fingerprint after the existing wording/generic-art projection. Stale/newer editorial content wins. Never relabel a modified snapshot with the original server checksum.

## Tasks

1. Fetch/verify snapshot, compare offline source and generate canonical string inventory (deduplicated English with context). Select pilot covering EAT low-phosphate,BOOK,WATCHfilm+series,MOVE,GO; write shape/number/invariant tests before overlay implementation.
2. Translate pilot in4locales, validate arrays/numbers/proper titles/false review flags, then continue remaining unique source strings for all467records. Shared repeated strings reuse one translation. Keep all decimals/fractions and US measuring qualifiers explicit.
3. Add bounded draft overlay and shared schema support for pt-BR/it without activating Locale. Compile overlay/patch files with per-record provenance, preserve extra fields and reject partial or stale entries. Correct generic artwork alt text handling for additional locales.
4. Cover current100offline records using the same translations, both cold reserve and cached/online consumer boundaries. Produce isolated review bundle showing translated records; retain existing safe review storage/remote restrictions.
5. Run full suite/typecheck, numeric/field/coverage validation, browser checks of every category/language and offline/cached/stale sources; fresh independent review. Push source/data/updated ZIP and record exact SHA/counts/remaining human and publication steps. No merge/native build/production deploy/store submission.

## Review focus

- Quantities, serving/nutrition, allergens, intolerances, time and temperature must not drift through wording or localized decimals.
- Ingredient/step arrays retain correspondence and explicit US units; optional fields and author/original-title identity must survive.
- Reworded English recipes and existing cache/reserve metadata must remain intact; no stale translation over newer editorial changes.
- Generic artwork must remain generic in every language; no BHS alt fallback masquerading as new-language text.
- Draft schema acceptance is not publication/medical review; all new flags false and production locale gating remains unchanged.

## Completion18.11.2026.

Preparation tasks1–5 complete: all467×4drafts and100offline, guarded adapter, full isolated catalogue review and376tests/TypeScript/browser verification. Codeb8fa083ea010468a0cb42b67b540dc2516fa42d3; standalone review20bc5d9657cb767c7bbf9b5004a755deb47e7f83. Production gating/publishing deliberately remains outside this preparation; exact blockers and next activation steps are in docs/CONTENT_TRANSLATION_HANDOFF.md. No paid resource, native build or external publication occurred.
