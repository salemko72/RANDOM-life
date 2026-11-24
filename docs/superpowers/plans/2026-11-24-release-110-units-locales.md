# 1.1.0 regional units and six locales implementation plan

> For agentic workers: use executing-plans; independent units worker per dispatching-parallel-agents. Root owns integration; scoped worker owns only measurement.ts/test. No user approval pause: explicit user instruction supplies scope/version.

**Goal:** Activate EN/BS/ES/PT-BR/DE/IT and device-region recipe units with manual override in1.1.0(8).
**Architecture:** Existing source-bound translation overlay projects the unchanged online/cache/reserve feed. Add a pure display-only measurement module, native OSregional settings bootstrap/resume, separate persistent UI preference. No D1/version/nutrition mutation. Native/build7 corrections remain.
**Stack:** TS/React/Expo57, expo-localization, existingWebView/nativeState, Vitest/Playwright.
**Spec:** user's24Nov explicit instruction and RELEASE-110-008 claim.

## Constraints and design calls
- 0extra cost; no data migration, paid API, automaticmerge or prod web/store release.
- Measurement preference auto/metric/us; OSmeasurementSystem first, then regionCode/device-language region, UScustomary onlyUS, otherregions metric for cooking. UKsetting mapsmetric cooking. UIlanguage change never changes a manual units setting.
- formatIngredientAmount(original:{quantity:number|null,unit:string},localizedUnit:string,system:'metric'|'us',locale:string):string. Conversion operates canonical originalunit even when labels are translated. No cup→mass without density; unqualified cups retain source, explicitUScups236.588ml, tsp4.92892ml,tbsp14.7868ml; modernUKspoons5/15ml only when origin explicit. g/oz and ml/fl-oz never mixed. Counts/toTaste/unknown retain source semantic. Finite positive quantity, locale decimals, sensible approximation.
- formatRecipeText(text,system,locale,sourceRegion?:'us'|'uk'):string handles explicit temperature and unambiguous volumetric/mass mentions, fractions/ranges. SourceRegion onlyfromexplicitrecipeunitmarkers; unknownreferences unchanged. Preserve cookingsteps content/numbers semantically; nutritiontext not converted.
- Existing new reviewed flags remain false; activation is user-authorized product availability, not a claim of human linguistic/medical review. Stale/unknown record revision falls back safely to existingcontent.
- Existing public share/legal/download web endpoints stayEN/BS; new app locales share English-compatible URLs until separately authorized web rollout. Native/app share text can be localized. Do not break external URLs or imply externalSDK/legaltranslation.

## Tasks and verification
1. Pure units module (worker): write failing tests for mass/volume distinctions, USvsUK, ambiguouscups/counts, rawdata immutability, null/toTaste, regional/manualchoice, locale decimals, fractions/ranges/temp; implement minimal pure functions; focusedtests and report. Own only measurement.ts/test; no index/docs/Git mutations.
2. Root six-language activation: fail tests proving selectablelocales6/nativeprofile/manual/autopersist and safe sharefallback; extend Locale union/readylocale chooser/native settings and repair actual typecheck/inline English/BHS fallback surfaces; existing overlay preserved and catalogue not mutated. Tests forall467/100records retain numeric signatures/reviewflags/versionbounds.
3. Root regional UI bridge: sanitize native settings and bootstrapbeforeJS, refreshforeground withoutreload; separateallowlisted units.v1 preference, chooser in profile/menu; recipe ingredient and instruction display uses canonicalunit/context, works online/cache/reserve and sharedview. Test native persistence/profile/history preservation, browser regionmanualswap and locale swaps.
4. Fulltests/TS/preview,6lang×5cat browser, region US/BA/DE/UK and override/relaunch, renderer recovery, spin ads5-nextSpin, genericoffline, exportiOS/Android and native6locale/scene/iPhoneportrait config. Read-only independent review then fix/test meaningful findings.
5. Freezeclean source1.1.0/iOS8 (Androidcandidate12 unchanged until operatorchecks). Recheck EASnumber/quota/signer before actualnewbuild; no duplicatebuild7. Commit/push/PR or exact403compare handoff, distinguish source/tests/native/submission/physicalQA. User authorization covers prep; only advance release actions within confirmed scope.

## Review focus
- Conversion on localized units/doubleconversion mustnotchange canonicalrecipe or phosphorus/nutrition.
- English UI in non-USregion mustuse metric; SpanishUI on USdevice mustretainUS unlessmanualoverride.
- Unsupported/ambiguous measures and mixedsourceUS/UK mustnotbe silently guessed.
- Locale/resume/manual setting mustnotreset profile/history/favorites orlose bridgeallowlist.
- Newlocale sharelinks and oldstrict feed clients mustremain functional without backendmigration.
