# LifeSpinner 1.1.0 (8) — regional units and six languages

Prepared 24 November 2026 on `codex/salem-110-regional-units`, based on build7 branch `3b35368512ff967b0b3e46e4829e91278d741860`. Application and frozen build SHAs are recorded below after commit. No merge, D1 migration, web deploy or store publication.

## Behavior

- EN, BS, ES, PT-BR, DE and IT enabled in native locale declarations, automatic device-language selection, profile/onboarding and settings. All 467 online records and 100 installed reserve records have the four added language variants. Existing source-bound translation overlay is used; server feed, revision versions and persisted canonical cache remain compatible with older clients. Draft human-review flags remain false; availability is not certification of linguistic or medical review.
- Cooking units default to device measurement settings, then device region. US uses US units; other regions/unknown use metric cooking. No IP lookup/GPS. Manual Automatic/Metric/US selection in settings and onboarding preferences is independent of UI language, survives relaunch and uses the already native-allowlisted `random-life.experience.units.v1` key.
- Display-only ingredient, preparation and temperature conversion uses original ingredient units. Canonical quantities, nutrients, phosphate assessments and allergen/diet hard filters remain unchanged. Summaries preserve nutrient mass; no cup-to-gram density assumptions. Unspecified cups/other ambiguous measures retain their original labels. Mixed US/UK recipes do not assign a standard to bare measures. Approximate conversions use ≈.
- Native foreground region/language changes update the current view without remounting it. Renderer-recovery, profile/history/favorites, ad close barrier and stale-document protections are preserved.
- Previous build7 cinema counter5, onboarding/category repeat fixes and ad policy retained: after five completed spins, next explicit central/category/repeat Spin can show an ad; navigation does not. Existing three-minute spacing and three-per-30-minute cap remain. `testflight` profile uses **test ads**.
- Public item/install URLs for new app locales use compatible English pages. Existing public legal/share/support pages and private Studio remain EN/BS; no public web deploy is implied.

## Verification

- Full suite: **431 tests / 65 files PASS**, TypeScript PASS; preview generation PASS.
- `smoke-release110.mjs`: real app, six locales, all five categories online and cold installed reserve; saved 467-record offline cache; DE/US/BA foreground region change, manual unit override across language change/relaunch, retained result and 320px layout PASS. Final unit-only rerun after parser fixes PASS.
- `smoke-auto-language.mjs`, `check-language-native-config.mjs`: automatic/manual/blocked-storage language behavior and six native declarations, iPhone-only/portrait PASS.
- `smoke-native-resume.mjs`: actual App.tsx with boundary doubles, iOS and Android foreground region injection, latest persisted state and renderer recovery PASS. This is not physical QA.
- `smoke-spin-ads.mjs`, `smoke-ads-bridge.mjs`, `smoke-generic-artwork.mjs`: three Spin entry points, close sequencing, no navigation placement, privacy/capability and offline generic images PASS.
- Final local Hermes/Metro exports: iOS 917 modules at `/workspace/shared/release110-ios-export-final`; Android 915 at `/workspace/shared/release110-android-export-final`. These are not IPA/AAB artifacts or Xcode/Gradle builds.
- Read-only independent review found mixed/explicit UK unit context and missing contextual fluid ounces. Both reproduced RED then fixed GREEN; reviewer reran all20 measurement tests, no material issue remaining in those fixes.
- Read-only live catalogue projection audit:467/467 records receive ES/PT-BR/DE/IT variants through the actual normalized consumer pipeline. No production data changed.

## Preflight and release limits

[Safe preflight evidence](reviews/release110-build8-preflight.json). EAS project `@salemko/random`, ID `04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a`, bundle `com.salemko.randomlife`. Latest EAS iOS build is7; candidate8 not present in EAS inventory. Free iOS7/15, total11/30, estimated/overage0 before this candidate. Existing APP_STORE certificate/profile active through3 November2027; no new credentials. Pinned testflight image `macos-tahoe-26.6-xcode-27.2`, scene support preserved. Build7 actual Xcode log already verified SDK27.2; build8 must independently complete its native build.

iOS target is **1.1.0 (8)**. Android version is1.1.0, code12 is only a candidate and must be rechecked against Play drafts/inventory by Ahmed before his build. Do not automatically build both platforms or submit Android. Use the frozen shared source SHA for both platform handoffs; record separate artifact IDs/hashes.

Build7 EAS `d2164cee-e1b0-4a7e-81f0-71b17b1c62fc` and submission `05b7385a-dc5b-4ba1-ab00-c6841807710f` are FINISHED. This supersedes older IN_QUEUE notes; actual TestFlight group/Apple processing still needs UI confirmation. Do not duplicate7.

## Physical QA still required

Test actual iPhone/Android: regional auto and manual unit choice; six languages in each category, profile and long text; online/cache/cold offline; low-phosphate/allergen filters; cold start and long background/resume; five spins then next explicit Spin, consent/refusal/no-fill/offline and ad return. Human review of translated content and existing RIGHTS-001/ATT/store-console checks remain separate. No claim that the binary is store-approved.

## Ahmed / GitHub continuation

Fetch this branch, read AGENTS/STATUS/TASKS and this handoff, claim your own task/branch before editing. Do not work from stale Android11/build5 source. Test shared behavior on Android with original signer, fresh Play versionCode and free-quota check. No merge, web/database deploy, paid resource or store publication without the user's specific authorization. GitHub API PR creation has returned403 in this environment; a pushed branch/compare link is not an existing PR.
