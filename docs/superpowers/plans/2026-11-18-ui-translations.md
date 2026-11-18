# Four-language UI Translation Implementation Plan

> **For agentic workers:** Use the approved existing language expansion specification. Independent dictionary files may be translated in parallel under dispatching-parallel-agents; integrate and verify centrally. No merge/build/deploy.

**Goal:** Complete draft UI dictionaries for es,pt-BR,de,it and route existing bilingual UI copy through one translation interface, without prematurely activating untranslated catalog locales.

**Architecture:** A checked English-keyed source inventory collects existing English map entries and inline bilingual UI copy. Independent JSON dictionaries preserve keys/placeholders. uiText handles explicit English/BHS pairs; translate preserves old BHS source keys. Existing en/bs runtime selection and content contract stay compatible until catalogue/offline translation phase.

**Tech Stack:** TypeScript/React, JSON dictionaries, TypeScript AST inventory, Vitest and existing Playwright smoke tests.

**Spec:** docs/LANGUAGE_EXPANSION_PLAN.md; user18.11.2026: 'ok idemo prevod'.

## Global Constraints

- Four targets es,pt-BR,de,it; natural everyday language, names/brands unchanged, no paid API.
- Do not change recipe facts, nutrition, allergens, filter logic, rights claims, source metadata or generic artwork.
- No new locale selectable in production until UI and catalogue/offline readiness are established. en/bs behavior must remain compatible.
- No database changes, native build, store upload, production deploy, merge or paid resources.
- Source English medical/dietary limitations must be preserved, not strengthened into clinical assurances.

## Review Focus

- Inline English/BHS conditional copy must not silently show BHS for a future third locale.
- Template placeholders must remain exact and escaped by React; names/IDs must never be dictionary keys derived from user input.
- Warnings, data deletion, privacy and offline errors need the same coverage as visible navigation.
- Translated dietary language must preserve individual restrictions and source-data limitations.
- Draft translations do not constitute human linguistic/medical review or activated full language versions.

## Task1: Inventory and independent dictionaries

Files: web/i18n/source.json,es.json,pt-BR.json,de.json,it.json; inventory script and tests.
- [x] Generate deterministic inventory from existing English map and literal bilingual expressions/functions; add stable placeholders for dynamic labels.
- [x] Write parity/nonempty/placeholder tests; observe missing dictionary failure.
- [x] Translate four isolated dictionary files, preserving key set and meaning; central spot review medical/privacy/dangerous actions.
- [x] Verify all source keys covered and no placeholder changes; commit.

## Task2: Translation interface and inline migration

Files: web/ui-copy.ts,ui-language.tsx; active components Onboarding,WebExperience,SharedItem,AccessLinks,ItemActions,ImageViewer,CatalogControls,ShareAppControl; app-share,companions.
- [x] Regression tests for existing en/bs, new translated UI labels/warnings, placeholders and unsupported locale fallback; observe failure before integration.
- [x] Implement typed UiLocale and uiText/formatting; leave active ready locales en/bs.
- [x] Route inline copy through interface; no profile reset, filtering, IDs, navigation or sharing-host behavior changes.
- [x] Full tests,TypeScript,preview and existing auto/profile/menu/category browser checks; inspect residual ternaries and document inactive/archive exceptions.

## Task3: Handoff and review

- [x] Fresh read-only review of whole diff; fix important issues with reproducing tests.
- [x] Record exact source, dictionary coverage, checks and activation limits; push own branch and attempt draft PR, or record API blocker/compare URL.
- [x] Next phase: reviewed five-category content pilot, then all467online +100offline records and contracts. Do not claim four complete language versions or physical QA.
