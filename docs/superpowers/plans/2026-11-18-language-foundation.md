# Language Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Implement the first independently testable language foundation: device-language default, remembered manual choice and return-to-automatic, ready for later ES/pt-BR/DE/IT UI/content batches.

**Architecture:** Keep current en/bs active while incomplete translations remain gated. A generic pure locale resolver accepts the available-locale list; existing locale.v1 storage holds en/bs or auto, preserving native snapshot compatibility. Native Expo localization feeds the WebView ordered device languages at boot/resume; one shared chooser works across setup/edit/menu.

**Tech Stack:** TypeScript, React, Expo57, expo-localization~57.0.2 (Expo bundled recommendation), Vitest, Playwright.

**Spec:** docs/LANGUAGE_EXPANSION_PLAN.md, approved by user18.11.2026 with instruction to start gradually.

## Global Constraints

- Budget:0additional costs. No translation API, paid resource, native build, deploy, D1 publication or store submission.
- Active UI/content locales remain en/bs until four full UI dictionaries/content are sufficiently reviewed; pt-BR is the announced starting variant following user acceptance of the recommendation.
- Existing stored en/bs remains a manual preference; do not infer that an old saved en was an automatic default.
- Use language preferences, never GPS/IP/storefront country, for defaults. User manual selection wins and persists locally.
- Preserve all profile/history/favorites/native bridge data, strict dietary filters, approved content and existing en/bs translations. No new server account.
- This source includes existing menu footer/Home-repeat work; it does not change installed build5 or Android11 artifacts.

## Review Focus

1. A new auto selection must not become frozen after saving a resolved locale to the old storage key.
2. Upgrades with existing en/bs must not unexpectedly change language; old native snapshot readers should still preserve profile data.
3. Native bootstrap/resume tags may be absent, malformed or ordered differently; no country inference, script injection or empty-list override.
4. Automatic setting must not activate unfinished Spanish/Portuguese/German/Italian through existing implicit BHS else branches.
5. Language changes while editing preferences must persist without losing unsaved form answers or requiring a server connection.

---

### Task1: Pure preference/resolver foundation

**Files:** Create packages/shared/src/language-preference.ts; tests/language-preference.test.ts. Export from shared index.
**Interfaces:** chooseSupportedLocale<L extends string>(tags: readonly string[],available:readonly L[],fallback:L):L; readLanguagePreference<L extends string>(storage:{getItem:(key:string)=>string|null},available:readonly L[]):L|'auto'. Existing key random-life.locale.v1, new allowed value auto.

- [x] Write tests: ordered preferences, regional/case/underscore tags, pt-PT→pt-BR when only pt-BR available, BHS bs/hr/sr, unsupported locale fallback, malformed inputs, stored en/bs manual priority, stored auto persistence, unavailable/corrupt storage.
- [x] Run focused test and observe missing behavior failure.
- [x] Implement normalization/matching only against passed available list; never select an unfinished locale implicitly.
- [x] Focused and full suite PASS, commit and ledger result.

### Task2: Native language bridge

**Files:** apps/client/package.json; package-lock.json; App.tsx; native/preview-assets.ts; native/device-language.ts; tests/native-preview-assets.test.ts; tests/device-language.test.ts.
**Interfaces:** native helper language update script accepts readonly string[], safely serializes valid bounded BCP47 tags; features.deviceLanguages optional boot array. Native App reads getLocales() and updates WebView on foreground without reloading or resetting profile/spin state.

- [x] Test boot tags, foreground dispatch script, empty/malformed/hostile tags and retained ads/build/profile bootstrap before implementation.
- [x] Add SDK-matched Expo localization dependency with scripts disabled, inspect limited lock diff.
- [x] Implement native boot/update path; no new persisted key or expanded native profile allowlist.
- [x] Unit suite, TypeScript, preview and generated Expo config checks PASS, commit and ledger; full install --check is environment-blocked (see session).

### Task3: Provider/chooser and browser persistence

**Files:** web/device-language.ts; ui-language.tsx; experience.css; scripts/smoke-auto-language.mjs; scripts/smoke-profile-language.mjs; tests/device-language.test.ts.
**Interfaces:** LanguageContext adds preference/setPreference while retaining locale/setLocale compatibility. Native injected tags take priority over browser navigator.languages when valid; empty/malformed native value falls back to browser. Chooser exposes Automatic plus current ready en/bs; it is shared by Onboarding/edit/menu.

- [x] Browser regression: no saved value + bs-BA→BHS; unsupported de-DE/en-US→English while DE unfinished; manual English beats BHS device and survives reload; selecting automatic returns to device and survives another reload; legacy stored BHS wins over English device; profile edit retains draft while changing locale.
- [x] Implement resolver/provider with document.lang=resolved locale and preference value persisted, not resolved auto locale. Listen to languagechange; storage errors cannot crash rendering.
- [x] Preserve existing ENG/BHS buttons for existing flows, add accessible compact automatic control and resolved language indication; verify320×568 and390 screens and menu footer ordering.
- [x] Full suite/typecheck/preview, browser profile/footer/auto tests PASS, commit.

## Completion / next phases

One fresh read-only whole-branch review, address important findings with regression tests. Push own branch and document exact source, checks and limitations. Do not report four language versions as completed: next phase is full dictionaries/inline copy migration, then reviewed five-category content pilot and bulk catalogue/offline work. No app build until a new shared release source is selected.
