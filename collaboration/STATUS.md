> **25.11.2026.14:39CET — TestFlight10 upload FINISHED:** submissiona751bc73-c295-4309-8634-b2d53904264e, existing1.1.1(10)/buildc4ef113d/source09eb611/ASC6830084481 verified. Errornull; Apple processing/group/tester availability not independently confirmed. No rebuild/publicrelease. [Handoff](../docs/IOS_BUILD10_HANDOFF.md). Supersedes historical pending/no-upload notes below.

> **TestFlight10 upload authorized25.11.2026:** existing1.1.1(10), submissiona751bc73-c295-4309-8634-b2d53904264e IN_QUEUE/errornull. No rebuild/publicrelease. [Current upload handoff](../docs/IOS_BUILD10_HANDOFF.md). Do not duplicate; tester availability not confirmed yet.

> **1.1.1(10) scheduled:** EASc4ef113d-35cd-4915-abaa-98e3907d4e73 FINISHED, errornull, source09eb6116050a69b12f07f253fc289a1ca86e2ae4. No Apple submission. [Handoff](../docs/IOS_BUILD10_HANDOFF.md). Do not duplicate.

> **1.1.1(10) preparation25.11.2026:** user requests new iOS10 with organized popup layout. Branchcodex/salem-ios-build10, unchanged popupcode3b1a70a plus build-number bump; fresh preview/TS/11metadata-assets tests/native locale config PASS. EAS number10 free; Free9/15iOS; existing signer. [Handoff](../docs/IOS_BUILD10_HANDOFF.md). Native1.1.1(10) FINISHED, SDK27.2/archive confirmed; no Apple submission.

> **25.11.2026. popup layout:** codex/salem-profile-action-buttons implements ordered primary menu + separated settings/profile categories and2×2 transparent profile actions.431tests/65files, TS/preview PASS; browser six locales×390/320px/menu order/dividers/handlers and web fallback PASS. [Handoff](../docs/PROFILE_MENU_LAYOUT_HANDOFF.md). Source-only; not included in already uploaded1.1.1(9), no new native build or deploy.

> **25.11.2026.09:05CET — TestFlight9:** existing1.1.1(9) uploaded, EASsubmission7570c8e9-ce23-48bb-98f2-568ba0ad4e54 **FINISHED**, error null; correct build95160386/ASC6830084481 verified. User authorized “ok dizi gore”. Apple processing/tester group availability not independently confirmed; no new build/public release. [Handoff](../docs/IOS_BUILD9_HANDOFF.md).

> **1.1.1 (9):** fade correction source8bdc628151d8839cf2ebca1f17a203ea73ebfac9; EAS95160386-2cfb-40ab-af7e-74a1ef3cd3aa FINISHED, no Apple submission. [Handoff](../docs/IOS_BUILD9_HANDOFF.md). Build8 stays unchanged.

## UI-SCROLL-009 — claimed24.11.2026

Preparing focused content fade beneath fixed Back arrow, then1.1.1(9), on codex/salem-detail-scroll-fade. Build8 remains completed and unchanged. Implemented/tested:431tests, TS/preview/iOSHermes, fade browser all5categories at390/320px/native safe area, Back touch guard and lifecycle/Spin ads PASS. [Handoff](../docs/IOS_BUILD9_HANDOFF.md); native9 FINISHED; subsequent authorized upload also FINISHED, see newest entry above.

> **Build8 status24.11.2026.:** EAS62ad0b5a-91e6-4de7-a05c-f099fecec2f7 **FINISHED**, version1.1.0(8), frozen source05990c0f86bba45d0d871ac06856cff71307f7d5. No Apple upload/auto-submit. Do not duplicate. [Current handoff](../docs/RELEASE_110_BUILD8_HANDOFF.md).

# Trenutno stanje

##1.1.0(8) regionalne jedinice iaktivacija jezika —24.11.2026.

Korisnik izričito traži metric/US po regiji i aktivacijuES/PT-BR/DE/IT uzENG/BHS u1.1.0(8). RELEASE-110-008 claimed na codex/salem-110-regional-units. Client overlay već sadrži467/100prevode; zadržati unchanged defaultfeed/D1 i originalne količine/nutrition/filtere. Regional setting odvojen odUIjezika, manualoverride local. Implementirano i testirano:431tests/65files, TS,6jezični online/cache/reserve browser, regional/manual jedinice, native lifecycle i oba Hermes exporta PASS. [Predaja](../docs/RELEASE_110_BUILD8_HANDOFF.md). Stvarni build8/Apple upload još nisu završeni.

## Novi iOS kandidat24.11.2026.

IOS-BUILD-007-ADS implementiran/testiran, source2a0503c249b11a3e2afad44266cc687644bfb417,403tests/TS/native scene config/browser/iOSexport PASS. [Predaja](../docs/IOS_BUILD7_HANDOFF.md). EASbuildd2164cee-e1b0-4a7e-81f0-71b17b1c62fc FINISHED iz čistog source99625ee9b7488d9af5a70e323434e7ae1a2f056b, submission05b7385a-dc5b-4ba1-ab00-c6841807710f FINISHED; ne pokretati duplikat. Xcode27.2/iPhoneOS27.2.sdk/ARCHIVE SUCCEEDED i95pods potvrđeni logom. IPAhash nije provjeren zbogCDN403. PRcreate API403, grana pushana. Preuzet na codex/salem-ios-build7-cinema iz Ahmedovog zajedničkog sourcea2fa6854/docs15dad55. Korisnik traži novu kino sliku sa counterom5 i potvrđuje oglas nakon5završenih vrtnji isključivo na sljedeći Spin pritisak. Dosadašnji kod je6spins/2min/Home; prvo regresije i handshake. EAS pristup radi kao postojeći owner; inventar najvišeiOS6. Bez novog builda ili store slanja u trenutku claima.

## Zajednička Android/iOS integracija22.11. — source predan, fizički QA otvoren

`codex/ahmed-android-shared-update`, [draft PR6](https://github.com/salemko72/RANDOM-life/pull/6), jedan kandidatski source **`2fa68549d444a309fb4e1dd32b953fe18476a037`** za Android i naredni iOS. Najnoviji translation source854de3d + recovery9b5f097 uz očuvani language/build-info bridge; dodat Android onRenderProcessGone, zaštita stale catalog-clear callbacka i PR5 optional portrait feature. Onboarding/Home repeat/recipe online-cache-offline/generic/language chooser/menu diagnostics i stvarni build sačuvani.392testa/60fajlova, TS/preview/native config/Android live JS+Hermes i lifecycle/browser PASS. Kandidati1.0.1/Android12/iOS7, nisu potvrđeni u Play/ASC; EAS nema12/7, Free10/30(Android4/15,iOS6/15),overage0; Android signer isti. **Nema novog APK/AAB/IPA niti fizičkog QA** (ADB prazan). Novi jezici ostaju pripremljeni draftovi, en/bs aktivni; nema D1/web aktivacije, mergea ili store slanja. [Predaja/blokade](../docs/ANDROID_SHARED_UPDATE.md), [sesija15](sessions/2026-11-22-ahmed-admob-15.md). Ovo ne vraća source na stariji build5 niti mijenja postojeće instalirane buildove.

## Preveden katalog u sourceu i punom previewu — 18.11.2026.

**App/catalogue sourceb8fa083ea010468a0cb42b67b540dc2516fa42d3**, review20bc5d9657cb767c7bbf9b5004a755deb47e7f83 na `codex/salem-content-translations`. Svih467zapisa×4jezika=1868potpunih draftova; svi100offline/400dodataka pokriveni.3038jedinstvenih tekstova pojeziku,365UIključeva.376tests/58files, TypeScript/preview i4jezika×5kategorija browserPASS; postojećiENG/BHS regresioni tokoviPASS. [Novi puni ZIP](../review-previews/README.md), [operator handoff](../docs/CONTENT_TRANSLATION_HANDOFF.md). StariUI-onlyZIP nije aktuelni paket u ovoj grani.

**D1/live/native nisu ažurirani; aktivni sourceLocale/birač jošen/bs.** Svi novi reviewed flagovi false. Prije produkcije riješiti strictlegacy enum(pt-BR/it), canonical17recipe wording/version zavisnost, activation/share/native/legal/UMP i fizičkiQA. Nema mergea/productiondeploya/store slanja/EASbuilda/troška. Ovaj source nije novi releasebuild; TestFlight5 i Android11 ostaju raniji artefakti.


## UI prijevodi1B — 18.11.2026.

`codex/salem-ui-translations`, aplikacijski source **2c0ce132f6dcfca7967143f880e0a949e40dae59**:365English-source ključeva i1460draft vrijednosti za es/pt-BR/de/it. Zajednički UI helperi i inline copy migracija;358tests/TypeScript/preview/static inventory i postojeće ENG/BHS browser regresije PASS, fresh review bez preostalih bitnih nalaza. [Predaja](../docs/UI_TRANSLATION_HANDOFF.md). Novi jezici **nisu aktivirani**; en/bs ostaje ready. Naredni korak stvarni5-category content pilot, pa467online/100offline i activation audit. Nema izmjene podataka/nutrition/filtera, native builda, D1/deploya/mergea/store slanja.


## Jezička osnova1A — 18.11.2026.

`codex/salem-i18n-foundation`, aplikacijski source **fdf3c25f0886873da39f77418c2c0ccfa0ebe5d4** iz base9065ae8. Automatski uređaj/browser izbor i zapamćen ručni en/bs; zajednički chooser u setup/edit/menu, native boot/foreground bez reloada, en/bs sistemske deklaracije.347tests, TypeScript, preview, generated Expo config i browser auto/profile/footer PASS; svježi nezavisni review s2ispravke. Detalji/ograničenja u [sesiji](sessions/2026-11-18-salem-i18n-foundation-01.md). ES/pt-BR/DE/IT još nisu prevedeni/aktivirani; naredni korak dictionaries/inline migracija i content pilot. Nema native builda/deploya/D1/store slanja/mergea; TestFlight5 i Android11 ostaju stari artefakti. Git fetch/push radi; API403 blokira automatski PR.


## Source za naredni kandidat — meni/jezici,18.11.2026.

Grana codex/salem-menu-language-prep, code53d50fdce0a7d722e48f35fec05bd73939efb7dc: Share diagnostic log u footeru, verzija/build posljednji na dnu popup-a, raniji header label uklonjen. Nasljeđuje dinamički native broj i zaseban Home-repeat fix.337tests/TypeScript/preview i footer+profile-language browser PASS. [Procjena4jezika](../docs/LANGUAGE_EXPANSION_PLAN.md):467stavki/1868novih prijevoda, aktivni jezici jošENG/BHS, PT varijanta otvorena; device-language+manual override preporuka, nije još implementirana. Nema novog native builda/D1/deploya/store slanja/mergea. TestFlight5 source4a567c3 je odvojen od ovog budućeg kandidata.

## Aktuelno — build5 zamjenjuje build4, 17.11.2026.

**Novi zajednički source4a567c339a7efeff625ccecf1024887c7e9c9cd4** na codex/salem-offline-build5 uključuje UI, Spin again i recipe offline/cache korekcije; [nova predaja/ZIP](../docs/BUILD5_SHARED_HANDOFF.md). iOS1.0.1(5) EASf1644fa5-f626-4963-9eda-e8be438f6a4e FINISHED, test ads; submission795ff8f0-4f2c-4d09-a62d-4d75e410cf8c **FINISHED17.11.18:15CET** — EAS upload Appleu uspješan; Apple processing i dostupnost konkretnoj tester grupi nisu nezavisno provjereni; Android11 kandidat provjerava Ahmed. **Ne koristiti build4 ZIP/ded4bf6 za novi Android.** Rezerva100/20,8ispravljenih recepata u njoj i17bounded consumer korekcija. Online D1 nije publikovan ovim radom; vidi zaseban Studio operator korak.333tests/TypeScript/preview/ENG+BHS online→offline-cache PASS. iOS4 FINISHED, ali nije uploadan Appleu: scheduling odbijen zbog opcionalnog Enterprise changeloga; nema troška/upgradea. Nema PR mergea/web deploya/Play slanja. Ništa ovdje nije potvrda završenog RIGHTS/ATT audita.


## iOS nastavak — UMP URL korekcija, sesija11, 17.11.2026.

**ISPRAVLJENO uz izričit nalog:** Published UMP per-app dodjela nakon Save/Confirm i punog reloada potvrđuje LifeSpinner iOS/Android `https://random-life-preview.pages.dev/privacy.html`; oba FiftyFifty URL-a očuvana. Ovo zamjenjuje otvoreni URL nesklad u početnom nalazu ispod. [Handoff](../docs/IOS_ADMOB_HANDOFF.md), [sesija11](sessions/2026-11-17-ahmed-admob-11.md). PR2 headb775efabb179a9cd5830281b2f9a2889f50b5d5a pregledan; CSS code850fce3fdaa2a12760c8508bf50c077dee624d21 treba u sljedeći zajednički source, nema mergea. Novi vlastiti claim raspoređen da merge-tree ostane čist. iOS store link/Requires review/limited serving i iOS crawl nisu zatvoreni: treba javni App Store listing/Developer Website preko Marketing URL-a, pa odgovarajuća AdMob verifikacija/readiness. RIGHTS-001 dopunjen s18konkretnih kidney-health itema i K1–K5 zadacima. Salemov zasebni IOS-PRIVACY-001 vodi ATT/native/pin/broj/kvotu/signing. Nema novog builda, mode promjene, web deploya, store slanja ili troška.

## iOS AdMob predaja 17.11.2026.

[IOS_ADMOB_HANDOFF](../docs/IOS_ADMOB_HANDOFF.md) i [sesija10](sessions/2026-11-17-ahmed-admob-10.md): iOS AppID/unit potvrđeni source+AdMob; Published EU poruka uključuje iOS, EEA/UK/CH, Consent/Do not consent/Manage options. **UMP privacy URL još vodi na FiftyFifty politiku — otvoren nesklad, bez izmjene.** Nema aktivnog objavljenog IDFA explainera u pregledanom inventaru; ATT/native audit ostaje otvoren. iOS Requires review/limited serving/Add shop/storeID prazno; iOS app-ads crawl nije potvrđen (javni fajl ispravan, crawler red samo Google Play). 37 ciljanih testova PASS; nema novog builda ili promjene režima. Aplikacijski pin1d334308483d9064fb853aa106ec3a9e49b8046e ostaje; novi iOS test/live izbor nije potvrđen. Raniji testni IPA3 nije novi kandidat niti store objava; Salem preuzima native/privacy/broj/kvotu/signing/pripremu, ASC i fizički video. RIGHTS-001 ostaje open uz javni source-domain inventar. Ovaj novi nalaz zamjenjuje ranije neprovjerene iOS konzolne tvrdnje, bez zatvaranja ADS-001.


**Ažurirano: 17.11.2026.** Prije rada fetch i provjeri stvarne headove/PR-ove. Vidi [kompletno uputstvo za AdMob i saradnju](../docs/ADMOB_AND_COLLABORATION_HANDOFF.md) i [Word kopiju](../docs/ADMOB_AND_COLLABORATION_HANDOFF.docx).

## Android AAB s pravim oglasnim jedinicama

**GOTOV16.11.:** AAB0.23.0/code10, EAS**ff9cee28-f381-454b-9954-ec0bb63b1546**, ads-live/STORE iz čistog1d334308483d9064fb853aa106ec3a9e49b8046e je FINISHED, preuzet i provjeren. Bundletool/manifest/JAR potpis/signer jednak code9/GMA25.5/UMP4.0 PASS. SHA25626b5d59e387987392f1574520af473a310ec98fdac4fbec5a145e8e342e5cd47. Free Android3/15, ukupno6/30, overage0. [Konačni rezultat](../docs/ANDROID_LIVE_AAB_RESULT.md), [sesija09](sessions/2026-11-16-ahmed-admob-09.md). ANDROID-LIVE-001 build-only done; nema Google Play uploada/submissiona/rollouta. Ranije auth/handoff/navodi bez AAB-a ispod su historijski.

**16.11.:** Expo CLI login radi kao ahmochera, ali READ postojećeg @salemko/random odbijen. Korisnik bira da build izvrši Salem; [tačne upute](../docs/SALEM_ANDROID_LIVE_BUILD.md) imaju pinned source1d334308483d9064fb853aa106ec3a9e49b8046e, code10/ads-live, kvotu/signing/validation/isporuku. [Sesija08](sessions/2026-11-16-ahmed-admob-08.md). Nema novog AAB-a ili troška; raniji tekst da login nije završen ispod sada je historijski.

Korisnik je zatražio novi Android build-only AAB s pravim oglasnim jedinicama. Kandidat0.23.0/code10 uz postojeći ads-live profil je pripremljen;328tests/TypeScript/live JS export prolaze, ID/NPA/literal live provjereni. Play inventar4/4 sadrži9/7/6/5. EAS whoami nije prijavljen; pokrenut browser login čeka korisnika, pa EAS inventar/kvota/signing i remote build nisu još potvrđeni. Nema novog AAB-a, troška ili store slanja. [Sesija07](sessions/2026-11-13-ahmed-admob-07.md).

## Privacy i Data safety nastavak

**OBJAVLJENO13.11.:** korisnik odobrio preview→production, oba provjerena. Novi canonical deploy **75f058a1-a191-4edd-a416-868c6e39332b** javno služi novu ENG/BHS privacy politiku, support i tačan text/plain app-ads; svi56downloadova i235neizmijenjenih statičkih fajlova očuvani, binding/config fingerprint isti. Katalog467/health/auth401 PASS. PRIVACY-REL-001 done, Data safety dovršen/sačuvan bez Google review submissiona. [Sesija06](sessions/2026-11-13-ahmed-admob-06.md) i [dokaz](../docs/reviews/privacy-web-release-2026-11-13.json) zamjenjuju ranije neobjavljeno/access/approval navode ispod. Main nije mergean, native live-ad build i druge release obaveze ostaju otvoreni.

**13.11.:** nova OAuth prijava sada vidi Salemov račun i Pages projekt. Svi236canonical statička fajla i56downloadova su sačuvani i provjereni; kompletan privacy kandidat spreman bez promjene postojećeg aplikacijskog JS/CSS. Automatski approval je odbio javni preview prije izvršenja; traženo izričito preview/production odobrenje. Nema novog web deploya. [Sesija05](sessions/2026-11-13-ahmed-admob-05.md) zamjenjuje raniju access blokadu, Data safety ostaje sačuvan/neposlan.

Data safety je dovršen završnim Save korakom; Publishing overview potvrđuje njegov red među6neposlanih promjena. Nije poslan na review. Nova ENG/BHS ads politika i statički patch s hashovima su pripremljeni/pregledani. Web objava čeka ovlašten pristup postojećem Pages projektu: korisnički odobrena nova prijava i retry rade, ali vide samo Ahmedov račun s0Pagesprojekata. Javni GET još pokazuje staru politiku i support/appads fallback. [Aktuelni audit](../docs/PRIVACY_DATA_SAFETY_RELEASE.md) zamjenjuje ranije navode da je Data safety samo radni draft; nema web deploya ili app rollouta.

## Android Play nastavak nakon Salemovih buildova

**Najnoviji rezultat provjere:** nakon korisnikovog pauziranja ranijih testnih trackova, Play Preview više ne prikazuje AD_ID error. Ostao je samo deobfuscation warning; Save and publish je enabled i nije pritisnut. Interni draft ostaje neobjavljen. Ovo zamjenjuje ranije navode aktivne AD_ID blokade ispod; privacy/web/QA/prava ostaju otvoreni.

**Najnoviji nastavak:** dostavljeni AAB0.23.0/code9 je hashiran, jarsigner/bundletool provjere prolaze, signer odgovara APK-u; glavni JS i WebView HTML identični su testiranom APK-u. Play je prihvatio upload i sačuvao interno izdanje kao draft, bez objave. Code9 je sada zauzet. Preview blokira AD_ID greška jednog aktivnog artefakta, iako novi AAB dozvolu ima; stariji aktivni buildovi traže pregled. Data safety/web/QA/prava ostaju otvoreni. [Sesija03](sessions/2026-11-12-ahmed-admob-03.md) i završni odjeljak audita zamjenjuju raniju AAB-download blokadu u odlomcima ispod.

[Najnoviji Android Play audit](../docs/ANDROID_PLAY_READINESS.md): lokalni APK0.23.0/code9 je hashiran, validanv2potpis i finalni manifest/SDKmetadata su pregledani. Korisnik potvrđuje normalan rad, pojavu oglasa i regionalnu poruku bez dodatnog privacy obrasca; kompletna fizička QA još nije provedena. Salemova zasebna grana dokumentuje završene APK/AAB/IPA buildove na `bfc71733de64d8f7f30fb3831b6b19af64bfc1a7`; to nadopunjuje raniji zapis ove grane bez native buildova.

Direktni Play pregled potvrđuje production access i bundle codes5/6/7; code9 nije u inventaru3/3. Publika16–17/18+ već je ispravna. Sačuvane su neposlane Ads=Yes i privacyURL=/privacy.html promjene, AdvertisingID=Yes te radni Data safety draft. Ništa nije poslano na review/rollout. AAB nije lokalno preuzet zbog nedostajućeg Expo pristupa kroz trenutni prikaz, a upload-key fingerprint match još nije potvrđen. Web privacy/app-ads/support deploy i prava na tekstove ostaju otvoreni. Prethodni odjeljci ispod čuvaju ranije stanje implementacije.

## ADS-001 nastavak 12.11.

Source i predaja su objavljeni u [draft PR #1 prema mainu](https://github.com/salemko72/RANDOM-life/pull/1). Status je in_review za source, s otvorenim release uslovima; nema mergea.

`ahmed-admob` je objavio claim i prenio samo WIP code commit na vlastitu `codex/ahmed-admob-finish` granu iz maina. Novi implementacijski source **`e1228ed725d63a56e280e00d3c840ab5890311b6`** uključuje zajednički Android/iOS runtime, iOS autolink/config, iPhone-only konfiguraciju, testne profile i staged app-ads/support/privacy ispravke. **328 testova/43 fajla PASS**, TypeScript, Expo compatibility, release exports i browser smoke PASS. Detalji i ograničenja su u [ADS-001 pregledu](../docs/ADS_001_REVIEW.md).

GitHub write/API pristup ove sesije je potvrđen; ranija API403 blokada ispod opisuje prethodni account/okruženje. Expo prijava nije dostupna, kvota/signing/remote brojevi nisu provjereni. Nema novih APK/AAB/IPA, fizičkog SDK QA, web deploya ili store submissiona. Publika 16+ i tačan publisher red potvrđeni su od Ahmeda. Javni /app-ads.txt i /support.html još vraćaju HTML fallback; pripremljeni source to popravlja tek nakon posebno odobrenog deploya s očuvanim downloads. ADS-001 nije završen; main je neizmijenjen. Preostali odjeljci bilježe osnovu i prethodnu predaju od 11.11.

## Zajednička osnova i predaja

| Grana/source | Namjena i stanje |
|---|---|
| **`main`** | Nova stabilna integracijska osnova koju je korisnik odobrio: generički artwork source i saradnički dokumenti. **Bez AdMob WIP-a.** Docs head nije zamrznuti release artefakt; fetch prije rada. |
| `codex/salem-collaboration-setup` | Dokumentacijska/koordinacijska grana. Claim `800c93f7e6aa33784ea50cc3b352fca7cf514925`, početni docs `d9c8073aab1b580a46417306fc3f0d4d54c9341d`, prošireni claim `557873d10c4c476b959ed7f7bdd0740569da15a3`. |
| **`codex/salem-admob-handoff`** | Predati Android-first WIP **`d4d0a6a150baa71591a2c427223aea69e8bcf17d`**. 300 testova/42 fajla i TypeScript prolaze. iOS runtime je no-op/autolink isključen; nema novog native artefakta potvrđenog na ovom SHA. |
| `codex/generic-artwork-v1` | Aplikacijska referenca **`d54e69f6a24a327b526f21936681818164c9d1e8`**; čist Git arhiv: preview build, 291 test/40 fajlova, root/client TypeScript prolaze. Dependencies ponovo korištene, nije hermetički npm ci. |
| `codex/ios-testflight` | Raniji source `7ddf52f3f35034123bad683ba8446eea72860fcb`; nema najnoviji artwork. Nije nova radna osnova. |
| `codex/r2-versioned-catalog` | `f7861c49185aa982b58e87186bc6905390f77e7d` u ancestryju aktuelnog sourcea; ne redeployati staru granu preko novije. |
| `codex/listen-playlists` | Arhiva `0a688c13083d468594fd6404bad9fb6537c38187`; ne vraćati LISTEN bez naloga. |

**Stare Android grane:** `android-play-test-ready` obrisan nakon arhiviranja; `android-expo-windows` čeka promjenu GitHub defaulta na main. Sačuvani tagovi: `archive/android-play-test-ready-2026-11-11` (`39167eb69c051d49a17c9a4991d274981f2ea99e`) i `archive/android-expo-windows-2026-11-11` (`a46c155a47c8bc6c1b526c447c6558914b438b2e`). Default i novi source su imali nepovezane historije; nisu spajane.

**PR blokada:** Git push/fetch radi; REST/GraphQL `api.github.com` vraća403. Stanje otvorenih PR-ova nije potvrđeno. Pokušaj dopune environment drafta nije sačuvan jer draft nije editabilan. Compare link nije PR: [početna docs provjera](https://github.com/salemko72/RANDOM-life/compare/codex/generic-artwork-v1...codex/salem-collaboration-setup?expand=1), [AdMob WIP prema mainu](https://github.com/salemko72/RANDOM-life/compare/main...codex/salem-admob-handoff?expand=1). Korisnik je naknadno odobrio kreiranje maina iz postojeće source osnove; nije izvršen PR merge niti deploy.

## Isporuka nije isto što i source

- Web/katalog, zadnja provjera11.11.: Pages `7f9ee8fc-8f34-4330-bc3b-46783ecc4bbe`; 467 javnih stavki, 273 generičke BOOK/WATCH slike, ostale194 neizmijenjene. Deployed dirty-tree provenance ograničenje je u [release handoffu](../docs/RELEASE_HANDOFF.md).
- iOS stvarni build0.23.0(2): source `1e6f8efc1d0e3ccfb0daf4df6e234f8761992683`, EAS `a73b11b1-93e0-4af5-b12c-70b77a6a185c`. Apple traži dodatne informacije/video; javna objava nije potvrđena. Nema oglasa ni novih offline slika.
- Stabilni source config je Android0.23.0/code8 i iOS build2; WIP code9 nije već napravljen ili objavljen build.
- AdMob ide u **naredne Android i iOS buildove**, iz zajedničkog zamrznutog sourcea, s odvojenim artefaktima/QA. Ovo nije odobrenje za automatsko slanje trgovinama.

## Sljedeće za Ahmeda i drugi Codex

1. Prihvatiti GitHub collaborator poziv i povezati svoj Codex account; pročitati AGENTS/STATUS/TASKS i kompletan vodič.
2. Objaviti claim **ADS-001** na svojoj `codex/ahmed-admob-finish` grani iz maina, provjeriti preklapanje, zatim prenijeti tačan WIP code commit ako već nije integrisan. Ne raditi na mainu ili starim Android granama.
3. Dovršiti iOS + Android SDK, consent/ATT, privatnost/app-ads.txt/store provjere, testne buildove i fizički QA. IOS-001, PREF-001 i RIGHTS-001 uskladiti s istim vlasnikom fajlova.
4. Pristup Cloudflare/Expo/Apple/AdMob je zaseban po accountu. Ne dijeliti tajne niti pretpostavljati credentials iz drugog chata. Nema dodatnih plaćenih usluga.
