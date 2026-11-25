## IOS-BUILD-011 — 25.11.2026.

- Owner: Salem. Branch: codex/salem-ios-build11. Base: 47e88def2c78d75489539c81716f2e42a64af981.
- “ok dizibuild” authorizes preparing iOS 1.1.1 (11) and uploading that archive for TestFlight. Scope: build number and release evidence.
- Verify the existing EAS project, free quota, signing and archive identity. Confirm upload status separately from Apple processing. Includes HRV, edition titles, Personalize artwork and Spin audio changes.

## BOOK-EDITION-TITLES — prikaz implementiran, vanjska provjera otvorena 25.11.2026.

- Nastavak na istoj grani: provjera preko javnih bibliografskih skupova podataka i ispravka naslova potvrđenih naslovom, autorom i izdanjem.

- Aplikacijski source: `6ea2e7efb93359befc9c94196972d77c0e347e64`. Testirani su svi naslovi u snimci kataloga i u offline rezervi. Mrežni izvori vraćaju 403.

- Owner: Salem. Branch: codex/salem-book-edition-titles. Scope: localized book titles, catalog projection, user-facing HRV label, checks and handoff.
- Verify edition titles online and use English fallback when there is no local edition. Preserve stored locale compatibility. Check the published and reserve catalogs.
- Prior GitHub PR listing returned 403, so open PR claims cannot be fully verified.

## UI-SPIN-AUDIO — implementirano i testirano 25.11.2026.

- Rezultat: `9282fde4c27a1266ed1b37bd2fd5d322fa417043`. Oporavak prekinutog zvuka i sprečavanje kasnog pokretanja potvrđeni regresijskim testovima. Fizički iPhone ostaje za naredni build.

- Vlasnik: Salemov Codex. Grana: `codex/salem-personalize-remove-books`. Datoteke: `sfx.ts` i regresijski test.
- Istražiti prekid zvuka pri ponovnom Spin pritisku. Provjeriti oporavak Web Audio konteksta nakon prekida i sačuvati ponašanje prekidača zvuka. Ranija provjera PR-ova vraća 403.
- UI-PERSONALIZE-ART je testiran i pushan kao `fe30f52`.

## UI-PERSONALIZE-ART — 25.11.2026.

- Vlasnik: Salemov Codex. Grana: `codex/salem-personalize-remove-books`. Osnova: `17bb42d`.
- Opseg: `Onboarding.tsx` i zapis sesije. Ukloniti dekorativnu sliku knjiga s koraka Personalize i pri uređivanju profila. Početni ekran za unos imena pri prvom otvaranju zadržava svoj izgled.
- Provjera: tok odabira personalizacije i uređivanje profila u pregledniku, uz TypeScript i izradu previewa. GitHub API vratio je 403 pri provjeri PR-ova.

## IOS-SUBMIT-010 — upload FINISHED25.11.2026

- Result: submissiona751bc73-c295-4309-8634-b2d53904264e FINISHED/errornull14:39CET, independently matched to buildc4ef113d/ASC6830084481. Apple processing/group/tester availability still unverified; no duplicate, no new build/publicrelease.

- Owner salem-release, branch codex/salem-ios-build10; user explicitly requests “salji da testiram” after completed1.1.1(10) handoff. Authorizes existing archive upload to TestFlight only.
- Exact EASbuild c4ef113d-35cd-4915-abaa-98e3907d4e73/source09eb6116050a69b12f07f253fc289a1ca86e2ae4, LifeSpinner ASC6830084481. FINISHED identity verified; last20iOS submissions contain no upload for10, no duplicate requested. Existing testflight submit profile/team/remote API key, no key copying.
- Files: own session/handoff/safe result/STATUS/RELEASE only. Claim pushed before upload. Acceptance: existing build submitted once, terminal upload result recorded, Apple processing/tester availability distinguished from upload. No rebuild, new costs, public AppStore release, merge or DB/web deploy.

## IOS-BUILD-010 — archive FINISHED25.11.2026

- Result:1.1.1(10), EASc4ef113d-35cd-4915-abaa-98e3907d4e73, frozen source09eb6116050a69b12f07f253fc289a1ca86e2ae4, SDK27.2/ARCHIVE SUCCEEDED. Free10/15iOS,14/30total,cost0. No Apple upload; physical QA pending.

- Owner salem-release, branch codex/salem-ios-build10, base80ec1125c71c168ee48192b17ac9d4c53df7064c; popup application source3b1a70a849203d724254ba726ac03b4716ba214d.
- User authorizes “idemo novi build10”; target1.1.1(10), existing testflight profile/test ads. Scope app.json iOS build number and own release records only; preserve popup layout plus all9 functionality. No new code feature, Android build, merge, DB/web deploy, paid resources or public release/Apple submission.
- Fresh preflight: EAS latest9, no10 in inventory; read-only free-quota/signer check before scheduling. Acceptance: clean pinned source, generated preview and build-metadata checks, existing signer, successful actual Xcode archive and accurate evidence; don't duplicate jobs or imply tester availability from build completion.
- Files: app.json, own session, handoff, safe preflight/result JSON, TASKS/STATUS/RELEASE summary. No overlapping owner edits; remote ownbase verified. Prior GitHub PRAPI403 means open PR visibility not fully verified.

## UI-PROFILE-ACTIONS — implemented/tested25.11.2026

- Final verification:431tests/65files, TS/preview, native-mode browser six locales×390/320px with layout/dividers/menu order, clear/delete-cancel/privacy/share callbacks, and web3-action fallback PASS. Native build not requested; ready for next binary.

- User followup expands scope: main menu title, My profile and Saved picks first, then language chooser, units and remaining settings; diagnostics/build remain bottom. Same WebExperience file/branch owner. No new binary requested. Further user followup: organize settings/profile into clear groups with divider lines between categories; preserve primary navigation first and all existing actions.

- Owner salem-release, branch codex/salem-profile-action-buttons, base9e5e13a; user screenshot specifies four smaller transparent black-text controls in two rows below EDIT ANSWERS with more separation.
- Scope: WebExperience profile action wrapper, scoped experience.css, own session/status/handoff; preserve all existing handlers, destructive confirmation, native privacy/share and catalog controls. No app version/native build/upload/deploy/merge.
- Acceptance: native four controls2×2, transparent background/black text/thin outline, separated from primary Edit; multiline six-language labels fit390/320px; no effect on other profile-reset controls; web three-control fallback tidy. Claim pushed before implementation; fetched remote refs unchanged, PR API visibility still403 from previous attempt.

## IOS-SUBMIT-009 — upload FINISHED,25.11.2026

- Result: submission7570c8e9-ce23-48bb-98f2-568ba0ad4e54 FINISHED/errornull for exact build9 and ASC6830084481,09:05CET. Apple processing/tester group confirmation remains; no new build/public release.

- Owner salem-release, branch codex/salem-detail-scroll-fade; scope existing finished EAS95160386-2cfb-40ab-af7e-74a1ef3cd3aa,1.1.1(9), source8bdc628151d8839cf2ebca1f17a203ea73ebfac9, to LifeSpinner6830084481. User explicitly says “ok dizi gore” after finished9 handoff.
- Files: own25Nov session, current handoff/status and safe submission evidence only. No application change, new build, merge, public App Store release, web or DB deployment.
- Preflight: build identity/FINISHED verified; last20iOS submissions have no submission for9 (five older completed uploads). Existing target6830084481/teamMNQY6SH96C verified. Uses original remote API key; no credential copying.
- Acceptance: submit existing archive, monitor terminal status, distinguish upload from Apple processing/tester availability, preserve exact IDs/result. No new cost/build quota consumed.
- Ordering exception: initial claim write used apps/client cwd and failed; shell then continued to submit command. Corrected claim immediately in repository root; do not claim pre-upload claim push succeeded. User authorization/preflight were already verified before submit.

## UI-SCROLL-009 — Fading content below fixed Back button

- ID/status: UI-SCROLL-009, implementation verified431tests/TS/preview/iOSHermes/browser; native1.1.1(9) FINISHED, EAS95160386-2cfb-40ab-af7e-74a1ef3cd3aa. Actual SDK27.2/archive PASS; no TestFlight upload. Claimed24.11.2026 before implementation.
- Owner: salem-release; branch codex/salem-detail-scroll-fade; base ca7de2c from verified1.1.0(8).
- Files: focused detail scroll wrapper/CSS/WebExperience; browser smoke; app version1.1.1/iOS9; own session/handoff/STATUS. No parallel file editing.
- Acceptance: all item categories fade continuously toward upper fixed Back zone as user scrolls, no sudden strip; Back stays legible and wins touches over scrolled Like/Share/Completed; scroll-to-top restores original artwork; respect safe-area and small screens; language/units/ads/renderer fixes preserved. Prepare native1.1.1(9) after tests, clean source, quota/inventory/signer check.
- Dependencies:1.1.0(8) frozen application8de3199/source05990c0, no DB/web changes. PR API403 means remote PR claim visibility not fully verified; fetched published refs show no newer shared work. Do not claim automatic lock.
- Authorized: user asks correction and new1.1.1(9) build. No store submission, merge, web/DB deploy, paid resources or replacing finished8.

> **Build8 status24.11.2026.:** EAS62ad0b5a-91e6-4de7-a05c-f099fecec2f7 **FINISHED**, version1.1.0(8), frozen source05990c0f86bba45d0d871ac06856cff71307f7d5. No Apple upload/auto-submit. Do not duplicate. [Current handoff](../docs/RELEASE_110_BUILD8_HANDOFF.md).

# Zajednički zadaci

## RELEASE-110-008 — Regionalne jedinice i6aktivnih jezika

- **Napredak:** implementirano/testirano431tests/65files, TS, browser6jezika+regional units, oba nativeHermes exporta; remote build8 još nije završen. [Predaja](../docs/RELEASE_110_BUILD8_HANDOFF.md).

- **Owner/grana:** salem-release / codex/salem-110-regional-units, claimed24.11.2026; korisnik izričito traži jedinice po regiji, aktivne jezike i1.1.0/build8. Ovo zamjenjuje raniji EN/BS-only activation hold za novu binariju, ne daje lažnu ljudsku review oznaku.
- **Base:**3b35368512ff967b0b3e46e4829e91278d741860, application2a0503c, build7source99625ee. Sačuvati cinema5/ads5-nextSpin/WebViewrecovery/Xcode27.2scene/latestAhmedshared.
- **Scope:** measurement helper/tests, regional boot+foreground bridge/native allowlist, web unit preference/provider/chooser i recipe ingredient/text rendering;6locale UI selection/native supportedLocales/sharefallback/inline surfaces, relevant tests/browser harness;1.1.0/iOS8config i vlastiti plan/session/handoff. Dva nezavisna file scopea: root jezici/UI/native/integration; units worker samo packages/shared/src/measurement.ts i tests/measurement.test.ts.
- **Kriteriji:** OSmeasurement/region automatski, manualauto/metric/us rememberedlocal, ne zavisi od izabranog UIjezika; coreUS conversions mass/volume/temp tačne, ne pogađati densitycup→grams/neodređene mjere;6lokalizacijaonline/cache/100reserve/profile/menu, locale-aware display, izvorni protected quantities/nutrition/allergens/filteri/IDs/hash/cachebytes nepromijenjeni. Native boot/resume i shared views.
- **Pristup:** postojeći guarded consumer overlay već dodaje4prevoda preko nepromijenjenog javnog feeda. Aktivirati klijent bez D1/versionmutacija; stari klijenti i17recipe wording bounds ostaju sigurni. Existing server/share/legal endpoints EN/BS imaju eksplicitni English fallback za nove appjezike, bez tvrdnje da su prevedeni eksterni dokumenti/SDKporuke.
- **Ovlaštenje/granice:** source, provjere i priprema1.1.0(8); novi nativebuild tek nakon pinnedsource/broj/kvota/signercheck. Bez paidresursa, mergea, DB/web/prodAppStorereleasea. Build7submission ne duplirati/ne otkazivati.


## IOS-BUILD-007-ADS — Cinema counter i oglas na Spin poslije5vrtnji

- **Owner/grana:** salem-ios / codex/salem-ios-build7-cinema; build_in_progress24.11.2026 (buildd2164cee-e1b0-4a7e-81f0-71b17b1c62fc; submission05b7385a-dc5b-4ba1-ab00-c6841807710f; bez duplikata), nalog korisnika za novi TestFlight i korekciju oglasa.
- **Osnova:** Ahmedov predani zajednički source2fa68549d444a309fb4e1dd32b953fe18476a037, docs head15dad55fce4a82af3dad317e2f8879d19e593df3; ne prepisivati novije language/build/Android recovery bridgeove.
- **Scope:** cinema webp asset/provenance and offline imageBytes metadata; shared native ads-policy/controller/runtime, web ads-bridge/WebExperience i App.tsx handshake; relevantni testovi/harnessi; eas.json/Xcode27.2 image, SDK57 expo-build-properties scene support/dependency/lock, native build number ako potrebno; vlastita sesija/handoff, kratki TASKS/STATUS. Nema promjene tuđe grane.
- **Kriteriji:** nakon5završenih vrtnji oglas isključivo na sljedeći centralni/category/repeat Spin; menu/Home/profile/navigation/foreground/late load nisu prilike; pauzirati vrtnju tokom oglasa, nastaviti nakon close ili odmah ako unavailable/consent/no-fill; nema beskonačnog čekanja/duplih oglasa/starih callbacks. Vremenski cap3min/3u30min zadržan kao saopšteni default; korisnik još nije odgovorio na optional pitanje. Brojač i capovi trajni; ne slati preference SDK-u. Nova kino slika s counterom5 umjesto praznog platna, bundled online/cache/reserve tokovi.
- **Aplikacijski source:** `2a0503c249b11a3e2afad44266cc687644bfb417`,403tests/61files, TS/preview/native config/iOSexport/browser+native harness PASS; [handoff](../docs/IOS_BUILD7_HANDOFF.md).
- **Provjere:** test-first regresije i puni suite, TS/preview, stvarni web/native-boundary lifecycle i spin browser harness; lokalni iOS export/native config. Prije jednog EASbuilda provjeriti kvotu, postojeći signer, slobodan broj i Xcode/SDK.
- **Ovlaštenje/granice:** novi iOS TestFlight build/upload, test oglasi ostaju u testflight profilu; bez prod releasea, mergea, DB/web deploya ili troška. Nove4lokalizacije ostaju neaktivirane prema postojećoj predaji. IOS7 kandidat provjeren u EAS inventaru (najveći6), ASC dostupnost još nije nezavisno potvrđena.


## ANDROID-SHARED-20261122 — Zajednički Android/iOS source i Android WebView recovery

- **Odgovorni/grana:** ahmed-admob / `codex/ahmed-android-shared-update`, izričit nalog22.11.2026.
- **Status:** in_review za source, fizički QA/release uslovi otvoreni; [draft PR6](https://github.com/salemko72/RANDOM-life/pull/6), [predaja](../docs/ANDROID_SHARED_UPDATE.md), [sesija15](sessions/2026-11-22-ahmed-admob-15.md). Zajednički kandidatski pin **`2fa68549d444a309fb4e1dd32b953fe18476a037`**, Android12/iOS7 kandidati, store brojevi još nepotvrđeni.392testa/60fajlova, TypeScript/preview/native config/Android live JS+Hermes/iOS+Android lifecycle/browser PASS. Claim `d52843d1cacfe564eb9a2aa72b41fe0c06695bfa` pushan prije integracije. Base854de3d, recovery9b5f097 i PR5 portrait plugin integrisani. ADB nema uređaja, fizički QA nije proveden; novi APK/AAB nije pokrenut.
- **Scope:** integrisati application recovery commit `9b5f097835cb4d5da44db2d418ce7df4a533492f` uz očuvanje novijeg device-language/build-info bridgea; Android onRenderProcessGone sa generation/retry/background/storage zaštitama; prenijeti vlastiti portrait-feature fix iz PR5. App.tsx, native recovery/preview/catalog/diagnostics moduli, relevantni testovi/harnessi/config i vlastiti handoff/sesija15/kratki TASKS/STATUS. Test alati uključuju Windows-safe review-share-stubs i lokalni screenshot output smoke-build-label, potrebni za punu izolaciju/provjere u ovom okruženju. Ne prepisivati prevode ili noviji source build5 paketom.
- **Kriteriji:** svi zahtijevani UI/spin/Home/menu/language/catalog/offline/generic/AdMob tokovi sačuvani; puni testovi/TypeScript/preview/Android release export i lifecycle/browser regresije; fizički Android QA ako uređaj dostupan, inače precizna blokada i preostali koraci. Jedan čist zajednički source SHA, commit/push/PR.
- **Jezici/granice:** pročitati CONTENT_TRANSLATION_HANDOFF activation blokade; četiri nova jezika ne aktivirati u produkciji niti objavljivati D1 bez njihovog zatvaranja. Postojeći EN/BHS/izbor jezika i puni draft source ostaju. Bez automatskog mergea, D1/web deploya, Play slanja ili dodatnog troška. Novi APK/AAB tek nakon svježe provjere Play/EAS broja/kvote/postojećeg signera; fizički QA nije isto što i harness/browser.
- **Saradnja:** fetch svih grana i API PR1–5 potvrđeni. Pročitani jezički/content/iOS resume claimovi i novi zasebni IOS build6 source4b09443; build6 nije jezički integration source i ne preuzima se. Korisnik izričito ovdje delegira kombinovanu integraciju; tuđe grane/claimovi/sesije ne uređuju se.

## I18N-CONTENT-004 — Prevod467stavki i100offline rezerve

- **Odgovorni/grana:** salem-content / codex/salem-content-translations; base2b0ef74527b9f953c3f61aa05cab1d1f759fa042; nalog OK go18.11.2026.
- **Status:** implemented/tested, source/data priprema završena; sourceb8fa083ea010468a0cb42b67b540dc2516fa42d3, review20bc5d9657cb767c7bbf9b5004a755deb47e7f83.467×4=1868prevoda,100offline/400dodataka,376tests/58files+TypeScript/browserPASS. [Predaja](../docs/CONTENT_TRANSLATION_HANDOFF.md), [novi ZIP](../review-previews/README.md). Produkcijska D1/native aktivacija nije urađena; PR API ranije403.
- **Scope:** content/i18n-2026-11-18/*, translation source/compile/validation scripts, shared localization/generic-art helpers i testovi; bounded consumer adapter/backup translations, isolated preview builder/tests/ZIP, vlastita sesija/plan/TASKS/STATUS. Nema native signer/config/build brojeva ili backend upisa.
- **Podjela:** root jedini mijenja zajednički kod; po jedan locale worker za es/pt-BR/de/it mijenja samo svoj memory JSON. Claimovi drugih operatora provjereni fetchom; nema novog preklapanja sa source scopeom.
- **Kriteriji:** pilot sve5kategorija(+film/series);1868draft record translations,100offline pokriveno; ID/version/data/array/number/proper-title invariants, guarded stale-source behavior, false review flags. Source raw hash nije fingerprint projekcije.
- **Granice:** nije dozvola za produkcijsku D1 publikaciju, deploy/merge/native build/store slanje ili plaćeni API. Aktivni produkcijski Locale ostaje en/bs do završene aktivacije/QA; draft preview je odvojen.


## I18N-PREVIEW-003 — Preuzimljiv zaseban pregled UI prijevoda

- **Odgovorni/grana:** salem-i18n / codex/salem-language-preview, baseaa0f1d3; korisnik pita gdje može pogledati preview novih prijevoda.
- **Status:** implemented/tested; review builder96983f36f4387034e7907a41266f19400fc072fb. [ZIP/upute](../review-previews/README.md); sva4jezika/izolacija storage/clear smoke PASS, full suite358PASS. GitHub predaja artefakta u ovoj grani; nije web deploy.
- **Scope:** scripts/build-language-review.mjs, scripts/smoke-language-review.mjs; review-previews/README.md i zaseban ZIP/HTML artefakt; vlastita sesija i TASKS. Bez izmjene produkcijske ready liste/native izvoda/kataloga.
- **Kriteriji:** samostalan HTML u ZIP-u za Mac/browser,6jezičkih izbora u preglednom bundleu; jasna oznaka draftUI/English katalog; blockedremote fetch/Studio/share; nema backend zahtjeva/upisa, tajni ili korisničkog profila u artefaktu; browser testsvih4novajezika i očuvan produkcijski en/bs build.
- **Granice:** ovo nije web deploy/store/native build/aktivacija u produkciji.0dodatnih troškova; GitHub grana služi za preuzimanje artefakta.


## I18N-UI-002 — Četiri UI rječnika i uklanjanje implicitnog BHS fallbacka

- **Odgovorni/grana:** salem-i18n / codex/salem-ui-translations, iz f4ae7e299a8a241220d05eee368fee3007f96c86.
- **Status:** implemented/tested, blocked_pr (GraphQL403potvrđen nakon pusha); source2c0ce132f6dcfca7967143f880e0a949e40dae59.365ključeva×4=1460draft vrijednosti;358tests/TypeScript/preview/inventory i postojeće browser regresije PASS. [Predaja](../docs/UI_TRANSLATION_HANDOFF.md), [sesija](sessions/2026-11-18-salem-ui-translations-01.md). Korisnik18.11.: ok idemo prevod.
- **Scope:** web/i18n/*, ui-copy.ts, ui-language.tsx, aktivne web komponente/bilingual helperi, inventory/coverage testovi i skripte; vlastiti plan/sesija/STATUS/TASKS. Ne dirati native signing/build config ili produkciju.
- **Kriteriji:** es/pt-BR/de/it puni UI-source key parity i placeholders; medicinski/privacy smisao sačuvan; postojeći en/bs, draftovi i navigation/filteri nepromijenjeni; prijevodna infrastruktura bez automatskog aktiviranja nepotpunog kataloga. Ne tvrditi ljudsku lingvističku/medicinsku provjeru.
- **Podjela:** četiri izolovana dictionary fajla mogu pripremati zasebni lokalni agenti; root jedini mijenja zajednički kod i dokumentaciju. Nema novih Ahmedovih source claimova u fetchu; njegov Android11 je odvojena predaja.
- **Zavisnosti/granice:** I18N-FOUNDATION-001; nakon UI slijede content pilot/467online/100offline i contract.0dodatnih troškova, bez mergea/builda/deploya/D1/store slanja.


## I18N-FOUNDATION-001 — Postepeno proširenje jezika, prvi osnovni korak

- **Odgovorni/grana:** salem-i18n / codex/salem-i18n-foundation; korisnik18.11. prihvatio LANGUAGE_EXPANSION_PLAN i traži polako krenuti.
- **Status:** implemented/tested, blocked_pr (GitHub API403). Source fdf3c25f0886873da39f77418c2c0ccfa0ebe5d4,347tests/TypeScript/preview/native config/browser PASS. Claim46bed383e4b6c32937895956f483662d39dfce21 objavljen prije koda; [sesija](sessions/2026-11-18-salem-i18n-foundation-01.md).
- **Scope:** shared language-preference helper/export/test; ui-language/provider/chooser i CSS; native App/app.json/preview-assets/device-language helper; Expo localization dependency/lock; unit/browser tests; docs/superpowers/plans/2026-11-18-language-foundation.md, vlastita sesija i TASKS/STATUS/plan.
- **Kriteriji:** native/browser device-language default, zapamćen ručni en/bs i povratak automatic, kompatibilnost postojećeg locale.v1/profile/history stanja; chooser u setup/edit/menu; platform/local storage i ordering/invalid-input regresije; nepotpuni ES/pt-BR/DE/IT još neaktivni. Generički resolver pripremljen za naredne dictionaries/pilot faze. PT-BR najavljena preporučena početna varijanta.
- **Saradnja:** pročitan Ahmedov ANDROID11-LIVE-001 done, postojeći1.0.1/code11source4a567c3 nije diran ili dupliran; naš budući WIP nije izdanje. Nema preklapanja s njegovim dokumentacijskim claimom.
- **Granice:**0dodatnih troškova, bez builda/mergea/deploya/DB/store slanja, bez masovnih neprovjerenih prevoda. Ne mijenjati stroge dietary filtere. Prva1A faza je samostalno testirana osnova, ne završen prevod svih1868varijanti.

## MENU-LANG-PREP-001 — Donji tehnički dio menija i procjena4jezika

- **Odgovorni/grana:** salem-menu-language / codex/salem-menu-language-prep; korisnički nalog18.11.2026.
- **Status:** implemented/tested;337testova/45fajlova, TypeScript/preview i footer ENG/BHS320x568/320/390/430 browser PASS. Postojeći profile language chooser: create→persist→edit→persist320/390 PASS. Novi jezici/auto-locale samo procjena u docs/LANGUAGE_EXPANSION_PLAN.md, nisu aktivirani; PT varijanta otvorena. Claim3e46d66 pushan prije koda.
- **Scope:** WebExperience.tsx/experience.css, smoke-build-label.mjs i browser provjera postojećeg izbora jezika u kreiranju/uređivanju preferencija; docs/LANGUAGE_EXPANSION_PLAN.md, vlastita sesija i TASKS. Ne mijenjati aktivni Locale/content contract niti pokretati masovne prevode bez dogovorenog obima/varijante.
- **Kriteriji:** Share diagnostic log poslije glavnih menu stavki, build/verzija ispod njega na dnu popup-a; ukloniti raniju header oznaku prema novom zahtjevu. Zadržati native dinamički build, accessibility/scroll/male ekrane i locale persistence. Provjeriti postojeći LanguageChooser u svim Onboarding koracima/edit toku i po povratku. Procjena realnog UI/content obima za es/pt/de/it i preporuka device language + ručni override, zemlja downloada nije implementirana kao nepouzdan proxy. PT-BR/PT-PT pitanje otvoreno.
- **Saradnja/granice:** nasljeđuje prethodni build-label i Home-repeat source kandidat, ne mijenja uploadani1.0.1(5). Bez native builda, ZIP-a, mergea, deploya, D1 izmjena, store slanja ili novih troškova. Sačuvati Ahmedove grane i lokalni untracked rad. Claimovi pročitani preko Git; GitHub API PR status nije nezavisno provjeren.

## BUILD-LABEL-001 — Sitna verzija/build u gornjem meniju

- **Odgovorni/grana:** salem-build-label / codex/salem-build-label.
- **Status:** implemented/tested;337testova/45fajlova, TypeScript, preview i browser390/320/430ENG/BHS/native ios+android+web PASS. Native broj ide iz kompajliranog paketa preko bootstrap skripte. Claim0595ed3 pushan prije koda. Nema novog native builda; ulazi u naredni kandidat.
- **Scope:** apps/client/App.tsx, src/native/preview-assets.ts, src/web/build-info.ts/WebExperience.tsx/experience.css; tests/build-info.test.ts i native-preview-assets.test.ts; scripts/smoke-build-label.mjs i vlastita sesija/TASKS.
- **Kriteriji:** native bootstrap prenosi kompajliranu verziju i platformski broj instalirane aplikacije (iOS/Android), UI ih sitno pokazuje u vrhu i meniju bez hardkodiranja5; browser bez native metapodataka ne pokazuje izmišljeni native build; sigurni validation/escaping i unit/browser provjere. Bez oslanjanja na online bazu.
- **Granice:** kod za naredni zajednički kandidat, ne mijenja već uploadani5. Nasljeđuje zasebno potvrđen Home-path spin fix; prijavljeni direktni spin bio je stari instalirani3. Nema novog builda/ZIP-a/store slanja ili main mergea dok korisnik ne završi tekući test i zatraži novo izdanje. Ne dirati Ahmedovu granu.

## SPIN-AGAIN-002 — Zadržati posljednju kategoriju pri povratku Home

- **Odgovorni/grana:** salem-spin-home / codex/salem-spin-again-home.
- **Status:** source fix/browser PASS. Korisnik zatim potvrdio da je prijavljeni fizički problem bio na buildu3, a tek sada instalira5; ne označavati taj izvještaj kao dokaz greške direktnog spina u5. Nezavisno reproduciran Home povratak ostaje pripremljen za naredni kandidat, bez novog native builda. Claim19c0a3e objavljen prije koda.
- **Scope:** apps/client/src/web/WebExperience.tsx rail-respin handler, scripts/smoke-spin-again-category.mjs, vlastiti session i ovaj task. Osnova objavljena grana codex/salem-offline-build5, bez promjene iOS5 artefakta ili online baze.
- **Dokaz:** test na build5 kodu reproducira FOOD→Home→Spin again prelazak u opći wheel (expected items, actual categories). Prethodni test je pogrešno očekivao general za Home rail-respin; direktni result repeat je prošao. Ovo je konkretna preostala rupa, ne potvrda instaliranog iOS broja.
- **Kriteriji:** rail Spin again ponavlja kategoriju zadnjeg prikazanog itema i nakon Home ili recipe detail→Home; cold Home bez itema i centralni hub ostaju general. Pet kategorija/ENG+BHS/seen cycle i postojeći filteri sačuvani.
- **Granice:** samo source fix i testovi. Nema novog native builda/ZIP promjene/store slanja dok se ne uskladi fizički nalaz i novi zajednički release source. Ne mijenjati Ahmedove grane ili postojeće pina/source artefakte.

## OFFLINE-RECIPES-005 — Zajednički paket s novim receptima i iOS5

- **Odgovorni/grana:** salem-offline / codex/salem-offline-build5; korisnik17.11. izričito traži offline korekciju, zamjenski ZIP i odmah TestFlight build5.
- **Status:** iOS native5 FINISHED (f1644fa5), standardni submission795ff8f0 **FINISHED17.11.18:15CET**, upload Appleu završen; processing/tester dostupnost još nisu nezavisno potvrđeni.333testa/44fajla, TypeScript, preview i ENG/BHS stari online→offline-cache browser PASS.8offline+17consumer corrections uključene, protected fields očuvani. Build4 FINISHED ali Apple nije primio submission: scheduling odbijen zbog Enterprise-only changelog parametra. Novi build5 koristi standardni besplatni submit bez tog parametra. Claim7659cb9 pushan prije koda.
- **Scope:** apps/client/src/web/recipe-wording*.ts, bundled-catalog.ts, backup/catalog.json/.ts/README.md, tests/recipe-wording.test.ts i fixture, scripts/smoke-recipe-wording.mjs, content/recipe-wording-2026-11-17/ javni paket, apps/client/app.json iOS5 (Android11 kandidat ostaje), vlastiti docs/BUILD5_SHARED_HANDOFF.md i session, zamjenski ZIP.
- **Kriteriji:** primijeniti pripremljene ENG/BHS tekstove na svih8 prisutnih reserve recepata; svih17 bounded corrections u consumer boundary za matching old online/cache verzije, bez prepisivanja novijih uredničkih verzija i bez promjene sastojaka/filtera/nutritivnih podataka. Cache snapshot byte/hash ostaje serverov, izmjena je lokalna projekcija.100stavki/20po kategoriji, postojeća dietary coverage i slike ostaju. Testovi/protected-field check, zajednički source SHA, iOS1.0.1(5) test ads i novi ZIP za Ahmeda.
- **Saradnja:** Ahmed ima claim BUILD4-KOREKCIJE-001 na svojoj grani za primjenu starog ZIP-a; ne mijenjati njegovu granu ili sesiju. Novi handoff izričito zamjenjuje ded4bf6/build4 ZIP i traži preuzimanje novog istog SHA. Android11 se provjerava prije builda.
- **Granice:** normalna online baza još zahtijeva ovlašteni Studio operator pristup; nema Studio credentials u ovom okruženju, ne izvlačiti password iz Cloudflarea ili zaobilaziti SQL-om. Ne tvrditi da su online podaci objavljeni. Lokalna projekcija omogućuje nove tekstove i pri starom cacheu/bazi. Bez App Store reviewa/Play slanja, PR mergea, web deploya ili troška. Korisnik odobrio TestFlight upload5.

## IOS-TF-UPDATE-001 — Onboarding i Spin again iOS TestFlight kandidat

- **Odgovorni/grana:** salem-ios-release / codex/salem-ios-testflight-update.
- **Status:** superseded by OFFLINE-RECIPES-005. iOS4/d42fa459 FINISHED iz ded4bf6 ali nije Apple uploadan; opcionalni Enterprise changelog odbijen prije zakazivanja. Aktuelni source4a567c3 i build5/ZIP su u docs/BUILD5_SHARED_HANDOFF.md. Claim51670a0 historijski.
- **Scope:** vlastiti kandidat s CSS850fce3fdaa2a12760c8508bf50c077dee624d21 i Spin321b9460851629f00271433c7a4c66cb19127de7, apps/client/app.json iOS build broj nakon provjere i Android kandidat11 prema nalogu za zajednički ZIP, vlastiti docs/IOS_TESTFLIGHT_UPDATE.md, ZIP/patch u downloads/, vlastita collaboration/sessions/2026-11-17-salem-tf-01.md i ovaj task.
- **Kriteriji:** isti čist source s oba UI popravka; test ads; iPhone-only/portrait; besplatna kvota i postojeći signing; EAS i ASC broj provjeren prije builda; objavljen ZIP sa source SHA/patchom i uputama; remote native build i TestFlight slanje samo uz ove provjere. Native build uspjeh/submission/Apple processing odvojeno evidentirati.
- **Granice:** bez PR/main mergea, produkcijskog deploya, App Store review slanja ili plaćenih resursa. Nema novih/rotiranih signing ključeva. RIGHTS/ATT pitanja ostaju dokumentovana; fizički QA/video radi korisnik. Korisnik potvrdio iOS4 i verziju1.0.1; svježi EAS1/2/3 i ASC screenshot1/2. Android kandidat11 nije potvrđen u Play konzoli; Ahmed ga provjerava prije svog builda. Ne mijenjati receptnu bazu ili tuđe handoffe.

## SPIN-AGAIN-001 — Ponovni spin unutar kategorije prikazanog rezultata

- **Odgovorni/grana:** salem-spin / codex/salem-spin-again-category; korisnički nalog17.11.
- **Status:** implemented/tested, PR API blocked; regression prvo reproducirao READ→EAT, nakon korekcije ENG/BHS pet kategorija/repeat/seen wrap i general Home PASS.328testova/43fajla, typecheck i preview build PASS. Nije još u native buildu.
- **Scope:** apps/client/src/web/WebExperience.tsx (isključivo rail-respin handler), scripts/smoke-spin-again-category.mjs, vlastita collaboration/sessions/2026-11-17-salem-spin-01.md i ovaj task.
- **Kriteriji:** na rezultatu Spin again zadržava uiCategory(item), uključujući READ/BOOK mapiranje; ponovljeni klikovi ostaju u kategoriji; promjena kategorije bira novu; početni/opći spin ostaje opći. Postojeći hard filteri, seen-cycle, personalizacija i ad bridge ostaju u postojećem toku. Browser test prije/poslije, postojeći testovi/typecheck/preview build.
- **Saradnja:** Ahmedov remote claim scope sada je dokumentacija/UMP; PR2 CSS odvojen. Osnova origin/codex/ahmed-admob-finish15bbcca506a1bce976bddd4d62f8fc896460e3de. GitHub API stanje blokirano, Git remote claimovi pregledani. Ne mijenjati postojeće release pinove ili druge sesije.
- **Granice:** nema mergea, produkcijskog deploya, native builda ili store slanja; code fix tek treba integrisati u zajednički release.

## IOS-ADMOB-HANDOFF-001 — Ahmedova dokumentovana predaja Salemu

- **Odgovorni / grana:** ahmed-admob / `codex/ahmed-admob-finish`; korisnikov nalog 17.11.2026.; postojeći draft PR #1.
- **Status:** in_review; claim `40f1bc461305ab1485ec3962641090e01668b691` pushan prije audit dokumentacije. [Predaja](../docs/IOS_ADMOB_HANDOFF.md), [sesija10](sessions/2026-11-17-ahmed-admob-10.md), postojeći PR #1. iOS UMP privacy URL nesklad/ATT/readiness/crawl i RIGHTS ostaju otvoreni; nema native release odobrenja. Base `44576897c06f50e807dff1c34ba94974dd47a582`; aplikacijski/build source `1d334308483d9064fb853aa106ec3a9e49b8046e`.
- **Datoteke:** novi `docs/IOS_ADMOB_HANDOFF.md`, vlastita `collaboration/sessions/2026-11-17-ahmed-admob-10.md`, kratke dopune ovog TASKS i STATUS. Bez uređivanja Salemovih release fajlova ili aplikacijskog koda.
- **Kriteriji:** read-only iOS AdMob ID/UMP/regional/IDFA/store/readiness/app-ads provjera s potvrđeno/otvoreno dokazima; poznati SDK podaci i ATT pitanja; konačni Android10 hash/signer/manifest/live nalaz; RIGHTS-001 preostali izvori; commit/push i PR/compare predaja.
- **Saradnja:** fetch i otvoreni PR #1 provjereni 17.11.; Salemove remote grane ANDROID-LIVE-002 i RELEASE-002 pročitane, njihovi scopeovi ostaju netaknuti. Ovo je nastavak vlastitog ADS-001 rada na istoj grani, nije novi native release.
- **Granice:** bez builda, mode/config/UMP izmjena, mergea, deploya, store slanja ili troška. Novi iOS test/live izbor nije potvrđen. Salemov Codex preuzima native/privacy audit, broj, kvotu, signing i pripremu builda; Salem ASC i fizički iPhone video. RIGHTS-001 ostaje open.

## IOS-UMP-URL-001 — Ispraviti samo LifeSpinner UMP privacy linkove

- **Odgovorni/grana:** ahmed-admob, `codex/ahmed-admob-finish`; nastavak korisnikovog naloga17.11.2026.; base `15c07f0971e19c0dbddc6cdfa85c49b9c0209b34`, PR #1.
- **Status:** in_review; claim `d2225a80c077898167eb5822797e61162eb0d22c` pushan prije izmjene. Oba LifeSpinner linka ispravljena, Save/Confirm i puni reload/ponovni pregled Published dodjele PASS; oba FiftyFifty linka očuvana. [Predaja](../docs/IOS_ADMOB_HANDOFF.md), [sesija11](sessions/2026-11-17-ahmed-admob-11.md). iOS/ATT/RIGHTS ostaju otvoreni; nije novi build/release.
- **Scope:** u AdMobu per-app privacy URL samo LifeSpinner iOS/Android na `https://random-life-preview.pages.dev/privacy.html`, očuvati oba FiftyFifty URL-a i ostale postavke; `docs/IOS_ADMOB_HANDOFF.md`, vlastita `collaboration/sessions/2026-11-17-ahmed-admob-11.md`, kratke TASKS/STATUS dopune i konkretni RIGHTS-001 recipe audit zadaci.
- **Kriteriji:** ponovnim otvaranjem objavljene poruke potvrditi oba LifeSpinner linka i oba neizmijenjena FiftyFifty linka; pregledati PR2 head/diff/clean konflikt status i zabilježiti buduću integraciju; razdvojiti iOS listing/readiness/crawl blokade; receptni licence/media/nutrition/low-phosphorus zadaci bez izmjene podataka; commit/push i puni SHA.
- **Saradnja:** fetch pokazuje Salemov IOS-PRIVACY-001 claim `a5c9766254b3c4d2bd4fbac430667041f4d77810`, koji izričito ostavlja Ahmedov handoff/UMP netaknutim; PR2 `b775efabb179a9cd5830281b2f9a2889f50b5d5a` mijenja CSS i vlastite zapise. Njihov scope se ne preuzima. Vlastiti novi claim premješten s kraja na ovo mjesto u `1c1314d9c49bf789e6f4f1ecf79f18908c36f74e` radi čistog PR2 spajanja; merge-tree PASS. PR2/code `850fce3fdaa2a12760c8508bf50c077dee624d21` treba u sljedeći zajednički source, nije mergean ovom sesijom.
- **Granice:** konkretna UMP URL korekcija sada je izričito odobrena; nema drugih UMP/ATT/test-live izmjena, builda, mergea, web deploya, store slanja, novih ključeva ili troška. Salemov Codex zadržava ATT/native audit, novi source pin, broj, kvotu i signing. RIGHTS-001 ostaje open.

## ANDROID-LIVE-001 — Novi AAB s pravim oglasnim jedinicama

- **BUILD ZAVRŠEN — ne praviti duplikat:** EAS `ff9cee28-f381-454b-9954-ec0bb63b1546`, FINISHED, ads-live, Android STORE0.23.0/code10, source1d334308483d9064fb853aa106ec3a9e49b8046e. Stvarni AAB preuzet, SHA25626b5d59e387987392f1574520af473a310ec98fdac4fbec5a145e8e342e5cd47; manifest/bundletool/signature/cert/SDK provjere PASS. Salemov ANDROID-LIVE-002 claim nije automatski označen done; za oba operatora koristi se ovaj jedan rezultat. [Rezultat](../docs/ANDROID_LIVE_AAB_RESULT.md), [sesija09](sessions/2026-11-16-ahmed-admob-09.md). Nema Play uploada/slanja/objave.

- **16.11. ponovo preuzima Ahmedov Codex:** korisnik je nakon prihvatanja Expo invitationa izričito zatražio da ovaj Codex napravi AAB. Pristup ahmochera/Developer sada potvrđen. Free kvota5/30 ukupno, Android2/15, overage0; EAS inventar nema live/code10 ili aktivan Android build, a Play4/4 i dalje9/7/6/5. Salemov zasebni ANDROID-LIVE-002 claim na8b3db30 je primijećen; nije mijenjan niti proglašen završenim. Ovaj najnoviji korisnički nalog vraća izvršavanje ovdje; neposredno prije kreiranja ponovo provjeriti EAS i koristiti postojeći odgovarajući build ako se pojavi. Pin1d334308483d9064fb853aa106ec3a9e49b8046e ostaje, aplikacijski fajlovi se ne mijenjaju. Vlastiti rezultat/session09, bez Play objave.

- **16.11. predaja za izvršavanje:** Expo login uspješan kao ahmochera, ali project READ odbijen. Korisnik izričito bira da **Salem pokrene build**; [kompletne upute](../docs/SALEM_ANDROID_LIVE_BUILD.md), [sesija08](sessions/2026-11-16-ahmed-admob-08.md). Build source pin ostaje1d334308483d9064fb853aa106ec3a9e49b8046e; nijedan novi build nije pokrenut. Ahmed zadržava aplikacijske fajlove, Salem preuzima samo build izvršavanje i vlastiti dokumentacioni claim nakon čitanja uputa.

- **Odgovorni/grana/PR:** ahmed-admob; codex/ahmed-admob-finish; postojeći draft PR1,13.11.2026.
- **Status:** done za build-only cilj; AAB10 završen/preuzet/provjeren uz besplatnu kvotu i postojeći signer. Store i opći ADS-001/QA/RIGHTS uslovi ostaju otvoreni. Historijska priprema u [sesiji07](sessions/2026-11-13-ahmed-admob-07.md); stvarni rezultat u sesiji09.
- **Scope:** apps/client/app.json (novi slobodan Android versionCode), postojeći eksplicitni ads-live EAS profil i potrebne release provjere/dokumentacija; vlastita sesija07 i kratki status/handoff. Bez nepotrebnih SDK/runtime promjena, iOS builda, web deploya ili novog signera.
- **Kriteriji:** potvrditi postojeću Expo autorizaciju i besplatnu EAS kvotu prije builda; provjeriti EAS/Play brojeve, zamrznuti čist source SHA, provjeriti live mode/NPA i tačne Android ID-ove, napraviti samo Android AAB bez auto-submit. Preuzeti postojeći rezultat, provjeriti finalni manifest/potpis/SHA256 i predati artefakt+GitHub dokaz. Ako pristup ili kvota nedostaju, ne izmišljati build i ne pokretati naplativu zamjenu.
- **Korisničke potvrde:** screenshot AdMob Android AppID odgovara sourceu, ad-unit ID podudaran po korisniku, Published European regulations/Android/policy/choices korisnički potvrđeni. Manualno dodavanje testnog uređaja korisnik odgodio; novi AAB nije time fizički QA ili AdMob Ready potvrđen. RIGHTS-001 i druge store release obaveze ostaju otvorene.

## PRIVACY-REL-001 — Objaviti ads privacy i dovršiti Play Data safety

- **Završeno13.11.:** uz izričito odobren preview→production, privacy/support/app-ads javno objavljeni na deployu75f058a1-a191-4edd-a416-868c6e39332b. Preview i production HTTP/hash/backend provjere PASS,56downloadova/235neizmijenjenih assets i binding fingerprint očuvani. Data safety dovršen/sačuvan, nije poslan Googleu. [Release dokaz](../docs/reviews/privacy-web-release-2026-11-13.json), [sesija06](sessions/2026-11-13-ahmed-admob-06.md). Ovim je razriješena ranija approval/access blokada.

- **13.11. nastavak:** logout/login je razriješio pristup Salemovom projektu; canonical manifest236/236assets sačuvan i hashiran, uključujući56downloadova. Kompletan kandidat spreman,235postojećih fajlova identično i samo privacy izmijenjen. Preview pokušaj odbijen automatskom approval provjerom prije izvršenja; čeka izričito odobrenje preview/production web objave. Nema deploya. Vidi [nastavak audita](../docs/PRIVACY_DATA_SAFETY_RELEASE.md) i [sesiju05](sessions/2026-11-13-ahmed-admob-05.md); ranija access blokada ispod je historijska.

- **Odgovorni/grana/PR:** ahmed-admob; codex/ahmed-admob-finish; postojeći draft PR1.
- **Status:** done za ovaj odobreni scope; javna politika/support/app-ads i dovršen neposlani Data safety potvrđeni. Source PR ostaje draft, opći ADS-001/native-release uslovi nisu ovim zatvoreni. [Detalji](../docs/PRIVACY_DATA_SAFETY_RELEASE.md).
- **Scope:** apps/client/public/legal/privacy.html i povezane legal/support/app-ads statičke putanje; vlastiti release audit/sesija04 i kratki TASKS/STATUS/RELEASE_HANDOFF. Samo potrebni deployment pomoćni alati; nema izmjena native aplikacije, novog builda, DB migracije ili Play rollouta.
- **Kriteriji:** pregledati stvarne SDK/server podatke i Google kategorije; sačuvati kompletan aktuelni javni download inventar i Pages bindinge prije konkretnog odobrenog web deploya; provjeriti live privacy sadržaj i dovršeni neposlani Data safety obrazac. Ne tvrditi da je izjava objavljena na Playu bez submission/review dokaza. Korisnikov nalog odobrava ovu web objavu; ne odobrava automatski objavu aplikacije ili slanje svih drugih store promjena.
- **Zavisnosti:** ovlašten pristup postojećem random-life-preview Pages projektu; bez širenja account ovlasti ili troška. Salemovi RELEASE-002 dokumenti ostaju izvan ovog scopea.

## ANDROID-REL-001 — Ahmedov APK audit i Google Play priprema

- **AD_ID blokada razriješena:** nakon korisnikovog pauziranja starih testnih trackova, direktno osvježeni Preview prikazuje samo1deobfuscation warning i omogućeno Save and publish. Nema objave; preostale privacy/web/QA/rights obaveze ostaju otvorene. Raniji zapisi AD_ID errora ispod su historijski.

- **Nastavak dostavljenog AAB-a:** lokalni AAB provjeren i prihvaćen u Playu; interno izdanje0.23.0(9) sačuvano kao draft, nije objavljeno. Novi scope uključuje AAB audit i `collaboration/sessions/2026-11-12-ahmed-admob-03.md`. Ranija download blokada ispod je razriješena. Otvoreni su AD_ID release error aktivnog artefakta (code9 ima dozvolu), finalne izjave/web/QA/prava. Nema promjene aplikacijskog sourcea ili novog builda.

- **Odgovorni:** `ahmed-admob`, nastavak po korisnikovom nalogu da se pripremi Google Play izdanje.
- **Grana / PR:** `codex/ahmed-admob-finish`, postojeći PR #1.
- **Status:** `in_review` za audit/pripremu; [APK i Play nalazi](../docs/ANDROID_PLAY_READINESS.md) su pripremljeni. AAB download i upload-certificate match još čekaju ovlašten pristup/lokalni fajl; fizički QA nije potpun. Ovo je nastavak ADS-001, ne preuzimanje Salemovih RELEASE-002 fajlova.
- **Scope:** vlastiti `docs/ANDROID_PLAY_READINESS.md`, `collaboration/sessions/2026-11-12-ahmed-admob-02.md`, kratke dopune TASKS/STATUS/RELEASE_HANDOFF; read-only lokalni APK/manifest/potpis i Play inventar, priprema Play deklaracija kao neposlanih promjena/nacrta. Bez promjene aplikacijskog sourcea.
- **Kriteriji:** zabilježiti APK hash/potpis/verziju/dozvole, stvarne Play brojeve, razlikovati korisnikov izvještaj s telefona od kompletne fizičke QA matrice, sačuvati tačne nacrte i blokade AAB/credentials/potpisa/weba. Ništa ne poslati Googleu niti objaviti produkcijski release bez konkretnog odobrenja.
- **Zavisnosti:** postojeći EAS build source `bfc71733de64d8f7f30fb3831b6b19af64bfc1a7`; AAB treba ovlašteno preuzeti, konačni potpis usporediti s Play upload certifikatom. Postojeći ADS-001 aplikacijski file scope ostaje isti; RIGHTS-001 ostaje otvoren.

Zapis je dogovor o radu, **nije automatsko zaključavanje**. Prije preuzimanja provjeri najnovije udaljene grane, claim commitove i otvorene PR-ove. Ne preuzimaj tuđi aktivni zadatak bez dogovora. Vidi [postupak](README.md).

## COLLAB-001 — Postaviti saradnju između Codex accounta

- **Odgovorni:** Codex uz Salemov account (`salem-collab`); identitet je oznaka sesije, ne GitHub korisnički račun.
- **Grana:** `codex/salem-collaboration-setup`
- **Status:** `blocked_pr` — dokumenti su commitovani/pushani; API otvaranje PR-a vraća 403.
- **Opis:** Uspostaviti zajednička pravila, status, backlog, odluke, zasebne sesijske zapise i release handoff.
- **Datoteke:** `AGENTS.md`, `collaboration/README.md`, `collaboration/STATUS.md`, `collaboration/TASKS.md`, `collaboration/DECISIONS.md`, `collaboration/sessions/2026-11-11-salem-collab-01.md`, `docs/RELEASE_HANDOFF.md`, `docs/SECOND_CODEX_START_HERE.md`.
- **Kriteriji prihvatanja:** postojeća pravila ostaju netaknuta; svih deset korisničkih pravila je pokriveno; trenutno stanje razlikuje source/build/deploy; drugi account može nastaviti bez chata; početni PR ima konkretan diff i provjere.
- **Zavisnosti:** potvrđene remote grane; pristup GitHubu; izuzeti postojeći lokalni AdMob rad iz PR-a.
- **Predaja:** claim `800c93f7e6aa33784ea50cc3b352fca7cf514925`, dokumenti `d9c8073aab1b580a46417306fc3f0d4d54c9341d`; PR nije potvrđen. Nema odobrenja za merge/deploy.

## COLLAB-002 — Dogovoriti zajedničku integration/default granu

- **Odgovorni:** korisnik je potvrdio odluku; izvršenje koordinira `salem-collab`.
- **Grana:** nije kreirana; koristiti `codex/<ime>-integration-base` nakon dogovora.
- **Status:** `in_progress` — nova main je objavljena; promjena GitHub defaulta još čeka browser potvrdu.
- **Opis:** Korisnik je odabrao novu main iz aktuelnog sourcea, bez spajanja stare Android historije.
- **Datoteke:** nakon dogovora `collaboration/STATUS.md`, `collaboration/README.md`, vlastiti sesijski zapis; eventualne GitHub postavke samo uz zasebno odobrenje.
- **Kriteriji prihvatanja:** dokumentovana base grana i source SHA, očuvane stare grane, saradnici mogu otvoriti PR s razumljivim diffom; nikakav neodobren force push.
- **Zavisnosti:** `COLLAB-003`; GitHub API 403 blokira promjenu defaulta iz ovog okruženja. Korisnik je sada odobrio novu osnovu/uklanjanje starih Android grana.

## RIGHTS-001 — Provjera porijekla tekstova/podataka nakon zamjene slika

- **Odgovorni:** nije preuzeto; drugi Codex može predložiti claim za read-only audit.
- **Grana:** npr. `codex/ahmed-content-provenance` (primjer, nije postojeći claim).
- **Status:** `open`.
- **Kidney-health backlog17.11.:** [RIGHTS-001-K1–K5 u iOS predaji](../docs/IOS_ADMOB_HANDOFF.md#rights-001-kidney--konkretan-audit-backlog-bez-izmjene-recepata): pet izvora NKF/AKF/Kidney Care UK/KNI/DaVita,18javnih recepata od kojih17ima low-phosphate. Po itemu i ENG/BHS provjeriti komercijalnu/ads/offline/prevod licencu i tekst odvojeno od fotografije; tačno porijeklo nutritivnih podataka, formulaciju/porciju/preračune i osnov reviewed/low oznake; provjeriti navedene KNI majoneza, source-only oznake/raspone te NKF BHS boilerplate nesklade. Predati matricu dokaza i otvorenih stavki; vlasnik rights audita/nutritivnog reviewa tek se dodjeljuje. Nema automatskog brisanja, izmjene recepata/oznaka ili popuštanja filtera.
- **Opis:** Utvrditi koje činjenice/opisi zavise od TMDB-a i drugih izvora; razdvojiti Open Library CC0 katalog od prava na omote. Ne zaključiti da je zamjena slika riješila sve licence.
- **Datoteke:** vlastiti audit u `docs/reviews/`, `collaboration/DECISIONS.md`, vlastita sesija. Pristup produkciji najprije read-only i uz postojeće ovlaštenje; bez objavljivanja backupâ.
- **Kriteriji prihvatanja:** dokaz po izvoru i kategoriji; odvojeno potvrđeno/nepoznato; konkretan plan bez plaćenih licenci/API-ja; nema automatskog brisanja ili izmišljenih dozvola.
- **Zavisnosti:** D-003, D-004; pristup izvorima/bazi nije isti na svim accountima. Uređivanje sadržaja traži zaseban dogovor o opsegu.

## IOS-001 — iPhone-only konfiguracija i fizička provjera

- **Odgovorni:** nije preuzeto.
- **Grana:** npr. `codex/salem-iphone-scope` nakon claima.
- **Status:** `open`.
- **Opis:** U narednom iOS sourceu ukloniti deklarisanu iPad podršku i provjeriti stvarni iPhone portrait UI, zoom/tastaturu i lokalni offline katalog.
- **Datoteke:** `apps/client/app.json`, potrebni native config/testovi, `docs/RELEASE_HANDOFF.md`, vlastita sesija.
- **Kriteriji prihvatanja:** `supportsTablet: false`, provjerena generisana targeted-device-family konfiguracija, realni test na podržanom iPhoneu; bez tvrdnje da iPhone kompatibilni prikaz nikad nije dostupan na iPadu.
- **Zavisnosti:** dogovor s `ANDROID-001` zbog zajedničkog app.json; source osnova sa generičkim slikama. Novi build/deploy/store submission posebno odobrava korisnik.

## PREF-001 — "Profil" opisati kao lokalne preference

- **Odgovorni:** nije preuzeto.
- **Grana:** npr. `codex/<ime>-local-preferences` nakon claima.
- **Status:** `open`.
- **Opis:** ENG/BHS tekstovi jasno govore da nema serverskog računa, registracije ili javnog profila. Preference se mogu naknadno mijenjati; lokalno učenje ostaje.
- **Datoteke:** `apps/client/src/web/WebExperience.tsx`, `Onboarding.tsx`, jezičke mape i relevantni testovi; vlastita sesija. Konačan file scope navesti pri claimu.
- **Kriteriji prihvatanja:** očuvani favoriti, historija, uređivanje, lokalno brisanje i svi prehrambeni hard filteri; ažurirani Apple Notes bez izmišljene prijave.
- **Zavisnosti:** dogovor s `ANDROID-001` zbog WebExperience.tsx; D-002.

## ANDROID-001 — Predaja i dovršavanje postojećeg AdMob WIP-a

- **Odgovorni:** `salem-android-wip` (postojeći lokalni rad, nije nova GitHub predaja).
- **Grana:** `codex/salem-admob-handoff`, code SHA `d4d0a6a150baa71591a2c427223aea69e8bcf17d`; **nije u mainu**.
- **Status:** `blocked_pr` — WIP code push je potvrđen; scope nastavka sada je ADS-001 za obje platforme.
- **Opis:** Postojeći AdMob rad sada je objavljen na zasebnoj grani; završiti pregled kroz PR i nastaviti prema ADS-001. Ahmed je potvrdio objavljene UMP poruke; to nije dokaz ponašanja SDK-a na telefonu.
- **Datoteke:** rezervisani AdMob fajlovi iz STATUS; `package-lock.json`; `tests/ads-*.test.ts`; poseban release handoff i sesija.
- **Kriteriji prihvatanja:** source/PR dostupni drugom Codexu, testne jedinice u testnim profilima, consent prije oglasa, korisničke preference se ne šalju SDK-u, prirodna pauza/frekvencijski limiti, fizički Android QA, stvarni AAB i tačan source SHA. Build/objava nisu izvršeni samo zato što kod postoji.
- **Zavisnosti:** `RIGHTS-001`, potvrđena publika/Privacy/Data safety/Contains ads/app-ads.txt; zasebno odobrenje za release. Preklapanje s IOS-001 i PREF-001 dogovoriti prije rada.

## RELEASE-001 — Novo native izdanje i Apple odgovor

- **Odgovorni:** nije preuzeto; jedan release koordinator nakon dogovora.
- **Grana:** kreirati nakon prihvaćenih prethodnih PR-ova, npr. `codex/<ime>-native-release`.
- **Status:** `blocked`.
- **Opis:** Pinovati zajednički source SHA, napraviti posebno evidentirane Android/iOS artefakte i pripremiti Apple Guideline 2.1 odgovor.
- **Datoteke:** `docs/RELEASE_HANDOFF.md`, release config/scripts samo po dogovoru, vlastiti sesijski zapis; store konzole odvojeno.
- **Kriteriji prihvatanja:** čist source, odgovarajući verzija/build brojevi bez kolizije, generičke slike u instaliranom offline paketu, fizički QA, video s fizičkog iPhonea i tražene informacije, stvarno dostupna podrška/privatnost, navedeno šta nije testirano.
- **Zavisnosti:** IOS-001, PREF-001, RIGHTS-001; ANDROID-001 samo ako izdanje sadrži oglase. Nema automatskog submit/deploy odobrenja.


## COLLAB-003 — Nova main osnova, arhiva starih Android grana i kompletna AdMob predaja

- **Odgovorni:** `salem-collab`, korisnikov izričit nalog 11.11.2026.
- **Grana:** `codex/salem-collaboration-setup` za koordinaciju; nova `main` kao zajednička stabilna osnova; `codex/salem-admob-handoff` isključivo za postojeći WIP.
- **Status:** `in_progress` — claim prije promjene remote refova i predaje WIP-a.
- **Opis:** Sačuvati posljednji source bez miješanja AdMob-a, arhivirati/ukloniti samo stare Android radne grane, pripremiti kompletne upute u Markdown/Word formatu za drugi account i Ahmeda.
- **Datoteke:** postojeći saradnički dokumenti; `docs/ADMOB_AND_COLLABORATION_HANDOFF.md`, `.docx`, početni linkovi u `README.md`; poseban sesijski zapis za WIP. AdMob kod se ne stavlja u main/docs commit.
- **Kriteriji prihvatanja:** nova main dostupna na GitHubu; stari Android vrhovi sačuvani tagovima prije brisanja; default-brancha blokada iskreno navedena; WIP dostupna na zasebnoj grani sa tačnim SHA; kompletan vodič uključuje Android i iOS, test/prod razliku, vlasnike, saglasnosti, store obaveze i fizički QA.
- **Zavisnosti:** GitHub default trenutno blokira brisanje android-expo-windows; API 403 može zahtijevati vlasnikov browser korak. Korisnik je odobrio kreiranje nove osnove i brisanje starih Android grana, ne produkcijski deploy ili store submission.

## ADS-001 — Dovršiti AdMob za Android i iOS (zamjenjuje Android-only opseg ANDROID-001)

- **Odgovorni:** `ahmed-admob`, Codex uz Ahmeda, preuzimanje 12.11.2026. prema korisnikovom nalogu za izvršenje handoffa.
- **Grana:** `codex/ahmed-admob-finish`, iz `origin/main` na `2c98dea77951048e00649e8f72cb7e0a848c1bf2`; nakon objavljenog claima prenijeti samo WIP `d4d0a6a150baa71591a2c427223aea69e8bcf17d`.
- **Status:** `in_review` — [draft PR #1](https://github.com/salemko72/RANDOM-life/pull/1) prema mainu, potvrđen kroz GitHub API. Claim `25e817e36cce4014256d055d49d78e2b02825203` objavljen prije cherry-picka/koda; implementacija `e1228ed725d63a56e280e00d3c840ab5890311b6`. Signed buildovi i fizički SDK QA nisu urađeni; task nije done. [Pregled i release blokade](../docs/ADS_001_REVIEW.md).
- **Opis:** Zajednički AdMob source za obje native aplikacije. Postojeći WIP je Android-first, ne gotova iOS integracija. Ne mijenjati već poslani build 2.
- **Datoteke:** App.tsx, app.json, eas.json, native ads moduli/plugin/autolink, ads bridge, WebExperience.tsx, dependencies/lock, ads testovi, privacy/support/app-ads hosting i release handoff prema dogovoru.
- **Dodatni scope provjera:** scripts/check-ads-native-config.mjs, check-ads-release-output.mjs, smoke-ads-bridge.mjs i postojeće dvije smoke skripte za Windows putanju preglednika; stage-preview.mjs i vlastita dokumentacija. IOS-001 source konfiguracija je dio istog app.json scopea; fizički dio IOS-001 ostaje otvoren. PREF-001 i RIGHTS-001 nisu preuzeti niti proglašeni završenim.
- **Potvrde Ahmeda 12.11.:** ciljna publika 16+; publisher red `google.com, pub-8395430021391101, DIRECT, f08c47fec0942fa0`. Nisu potvrde live crawla, stvarne dobi korisnika, native QA ili store izjava.
- **Kriteriji prihvatanja:** završena iOS i Android integracija; testni oglasi podrazumijevani; pravilno mapirani javni ID-ovi; UMP i kasnija promjena izbora; ATT odluka prema stvarnom trackingu; bez slanja zdravstvenih preferencija; rijetki oglasi na prirodnoj pauzi; fizički QA za obje platforme; isti zaključani source SHA i zasebni artefakti/testovi. Implementirano nije isto što i buildano ili objavljeno.
- **Zavisnosti:** zasebna WIP predaja, RIGHTS-001, IOS-001 i PREF-001; svi ovi taskovi sada se usklađuju s istim release koordinatorom. Osnovni SDK/AdMob ne zahtijevaju kupovinu licence; kvote EAS-a i hosting limiti provjeriti bez paid upgradea. Posebno odobrenje prije produkcijske objave ili slanja trgovinama.

- **IOS-TF-UPDATE-001 dopuna opsega:** korisnik traži isti GitHub ZIP za Ahmedov novi Android build. Dodati Android versionCode kandidat11 prije zamrzavanja zajedničkog sourcea; Ahmed provjerava Play/EAS broj, kvotu/signer i gradi Android. iOS pre-upload CLI za raniji fab01bc zaustavljen tokom kompresije; prije novog pokušaja ponovo provjeriti da nije kreiran build. Nema duplog builda.
