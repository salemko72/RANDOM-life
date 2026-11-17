# iOS AdMob predaja Salemu — 17.11.2026.

Dokumentaciona predaja uz naknadno izričito odobrenu per-app UMP privacy URL korekciju; bez novog builda. **Novi iOS test/live izbor nije potvrđen.** Salemov Codex preuzima konačni native/privacy audit, slobodan build broj, kvotu, postojeći signing i pripremu builda. Salem preuzima App Store Connect i fizički iPhone video. Ovaj nalog ne odobrava build, merge, deploy, store slanje ili dodatni trošak.

**Nastavak17.11., sesija11:** po novom izričitom nalogu ispravljeni su **samo per-app LifeSpinner iOS/Android UMP privacy URL-ovi** na `https://random-life-preview.pages.dev/privacy.html`; oba FiftyFifty URL-a očuvana. Spremanje i ponovni pregled nakon browser reloada potvrđeni. Ovo zamjenjuje prethodni otvoreni URL nesklad i raniju granicu bez UMP izmjena samo za tu konkretnu korekciju. Ostali ATT/native/store/RIGHTS uslovi ostaju otvoreni; PR2 još treba u sljedeći zajednički source. [Sesija11](../collaboration/sessions/2026-11-17-ahmed-admob-11.md) sadrži tačan claim/source i provjere.

## Source i preuzimanje

- Repo/grana: `salemko72/RANDOM-life`, `codex/ahmed-admob-finish`; [draft PR #1 prema mainu](https://github.com/salemko72/RANDOM-life/pull/1). Main nije mergean.
- Najnoviji aplikacijski source i Android10 build pin: **`1d334308483d9064fb853aa106ec3a9e49b8046e`**. Dokumentacioni head prije ove sesije: `44576897c06f50e807dff1c34ba94974dd47a582`. Claim prije audit izmjena: `40f1bc461305ab1485ec3962641090e01668b691`.
- Fetch svih remote grana i GitHub otvoreni PR inventar provjereni 17.11.; PR #1 jedini otvoren. Salemove grane `codex/salem-ads-release-check` (`3641356d8bfe4f8f6879e705844381aa19b2cb11`) i `codex/salem-android-live-build` (`d3e9a4e79622e594155d6c8d680fc92fee3bcd4f`; fetch potvrđen) imaju zasebne dokumentacijske scopeove; njihovi fajlovi nisu uređivani.
- `git diff 1d334308483d9064fb853aa106ec3a9e49b8046e -- apps/client packages package-lock.json scripts/check-ads-native-config.mjs` prazan 17.11. Ova predaja ne mijenja aplikacijski source. Konačni docs SHA je u [sesiji10](../collaboration/sessions/2026-11-17-ahmed-admob-10.md), čiji naredni commit izbjegava samoreferencu.
- Salem neka fetchuje PR head, provjeri puni SHA i najnovije claimove, objavi vlastiti claim na svojoj grani. Za novi build nakon eventualnih native/privacy/broj izmjena pinovati novi čist SHA i jasno ga razlikovati od Android10.

## iOS identitet i source konfiguracija — potvrđeno

| Stavka | Nalaz / dokaz |
|---|---|
| AdMob App ID | **`ca-app-pub-8395430021391101~6486035105`**, `apps/client/app.json`, podudaran s LifeSpinner iOS redom u AdMobu |
| Interstitial | **`ca-app-pub-8395430021391101/6733447119`**, `google-ads-adapter.ts` i direktni AdMob ad-unit pregled; naziv `Interstitial baner 1`, format Interstitial |
| Bundle / Expo / ASC | `com.salemko.randomlife`; postojeći Expo project `04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a`; source ASC app `6830084481`, team `MNQY6SH96C`. ASC nije pregledan ovom sesijom. |
| Target / verzija | Source `0.23.0`, iOS `buildNumber: "3"`, `supportsTablet:false`, portrait. Broj3 je već korišten za raniji testni IPA, nije slobodan broj za novi build. |
| SDK | Zaključana JS biblioteka `react-native-google-mobile-ads 17.4.0`; njen package/podspec bira iOS GMA13.10.0 / UMP3.1.0. Env/Pod override je moguć; mjerodavni su resolved Podfile.lock i konačni IPA. |
| Runtime | iOS re-exportuje zajednički native runtime; UMP `gatherConsent()` i `canRequestAds` gate prije SDK inicijalizacije/zahtjeva; svaki interstitial koristi `requestNonPersonalizedAdsOnly:true`. Preference/zdravstveni podaci nisu ads payload. |
| ATT u aplikacijskom sourceu | Nema aplikacijskog ATT request toka ni `NSUserTrackingUsageDescription`; GAD measurement delay=true, Google SKAdNetwork ID prisutan. To nije konačan privacy audit. |
| Režim | Preview/production/testflight/ads-test-store ostaju testni; zasebni ads-live postavlja live. Postojanje tog profila i Android live odobrenje nisu izbor režima za novi iOS. |
| AdMob cap | iOS konzola: app-level i unit-level No cap, 0 aktivnih mediation grupa, 0 enabled campaigns. Source ima vlastite limite: 6 uspješnih spinova, 2 aktivne minute, razmak3min, najviše3/30min. Fizički iOS rezultat nije potvrđen. |

## PR #2 — korekcija dugmadi za sljedeći zajednički source

[PR #2](https://github.com/salemko72/RANDOM-life/pull/2), head **`b775efabb179a9cd5830281b2f9a2889f50b5d5a`**, base `codex/ahmed-admob-finish`, pregledan17.11.: GitHub open/non-draft, mergeable=true/clean. Code commit **`850fce3fdaa2a12760c8508bf50c077dee624d21`** mijenja samo `apps/client/src/web/experience.css`: scoped consent-actions stil nadjačava reset, glavno dugme16px, sekundarna dugmad puna/svjetlija/zaobljena, min-height55px, prelamanje bez promjene handlera/SDK/configa. Diff i Salemov sesijski zapis pregledani; nema uočenog blokirajućeg nalaza u tom CSS scopeu. Njegovi browser rezultati ENG/BHS320/390/430px i tri postojeća toka su ranije PASS, **nisu novo fizičko iPhone testiranje ove sesije**.

Konflikt TASKS je riješen u PR-u. Novi Ahmedov URL claim privremeno je ponovo dotakao kraj istog fajla; premješten je samo taj vlastiti claim između postojećih taskova (`1c1314d9c49bf789e6f4f1ecf79f18908c36f74e`). `git merge-tree --write-tree HEAD origin/codex/salem-onboarding-buttons` nakon toga PASS/exit0, bez promjene radnog stabla ili stvarnog mergea. **PR2/code850fce3 treba uključiti u sljedeći dogovoreni zajednički Android/iOS source**; još nije u ovoj grani, Android10 ili starom IPA3. Salemov Codex bira i zapisuje novi puni source pin nakon dogovorene integracije i audit izmjena. Nema automatskog mergea/cherry-picka ili novog builda.

## AdMob UMP — direktni read-only pregled 17.11.

Pregledani [Privacy & messaging](https://admob.google.com/v2/privacymessaging), European regulations Messages, dodjela aplikacija te Setup i Targeting objavljene poruke. Nije pritisnut Publish changes/Confirm/Unpublish, nisu mijenjani izbori ili URL-ovi; pregled aplikacija zatvoren je Cancel, builder povratkom.

| Stavka | Potvrđeno u konzoli |
|---|---|
| Objavljena evropska poruka | `Untitled European regulations message`, **Published**, posljednja izmjena26.10.2026., English(en), 4 aplikacije |
| iOS dodjela | LifeSpinner **iOS je označen** među četiri aplikacije (uz LifeSpinner Android i dvije FiftyFifty aplikacije). Ovo nije zaključak izveden iz Android poruke. |
| Regija | Izabrano **Countries subject to GDPR (EEA, UK and Switzerland)**; Everywhere nije izabrano. BHS jezik nije potvrđen; inventar navodi English(en). |
| Izbori | Consent On; Manage options On; Do not consent On; Close(do not consent) Off. Preview ima tri odgovarajuća dugmeta. |
| Privatnost poruke — ISPRAVLJENO u sesiji11 | Prvobitno LifeSpinner iOS/Android pogrešno pokazuju FiftyFifty politiku. Nakon odobrene per-app korekcije i punog reloada, **oba LifeSpinner reda pokazuju `https://random-life-preview.pages.dev/privacy.html`**. FiftyFifty iOS i Android i dalje imaju `https://sites.google.com/view/fiftyfiftyapp-privacy-policy/home`. |
| Tekst previewa | Opisuje personalizaciju/measurement, uređajne identifikatore i dijeljenje s partnerima te mogućnost precizne lokacije. To je tekst konfiguracije, nije dokaz da LifeSpinner traži preciznu lokaciju. Uskladiti s namjeravanim NPA tokom i stvarnim SDK nalazom. |
| US state regulations | Početni inventar nudi Create a new message, bez aktivne poruke. **Objavljena US poruka nije potvrđena.** Detaljne US ad-serving/RDP postavke nisu pregledane; ne tvrditi da je svaka regionalna obrada isključena. |
| IDFA/ATT explainer | Inventar nudi **IDFA explainer — Create a new message**, bez aktivne poruke: **objavljen AdMob IDFA explainer tok nije uključen u pregledanom inventaru**. To uz odsustvo aplikacijskog ATT requesta ne dokazuje da ATT nije potreban. |

Ponovno otvaranje privatnosti je **implementirano u sourceu**, ne fizički testirano na iPhoneu: link Ad privacy / Privatnost oglasa šalje `privacy` događaj; controller odmah odbacuje stari preload. Adapter osvježava UMP info i za REQUIRED poziva `showPrivacyOptionsForm()`. Inače radi `loadAndShowConsentFormIfRequired()` i prikazuje obavijest da dodatni obrazac nije potreban u regiji. Preview poruke spominje povlačenje pristanka kroz app menu. Testirati stvarno odbijanje, kasniju izmjenu/povlačenje, grešku, offline, restart i lifecycle za konkretan IPA i EEA/UK/CH te regiju izvan njih. UMP geografski testovi moraju biti testni i odvojeni od stvarnih korisničkih izbora.

**Potvrda korekcije sesija11:** u Published poruci otvoren `4 apps`, zasebno editovan samo privacy URL LifeSpinner iOS pa Android, svaki Save, zatim Confirm. Nakon jednog prolaznog Can't load page pri ponovnom otvaranju urađen browser reload. Svježi Published inventar i ponovo učitana dodjela potvrđuju4aplikacije, dva ispravna LifeSpinner linka, dva originalna FiftyFifty linka i SugarDebt Add URL neizmijenjen. Status je ostao **Published**, datum poruke26.10. ostao isti; per-app URL promjena nije zahtijevala Publish changes u builderu. Nije izvršen Unpublish/novi message ili promjena regije, izbora, IDFA/ATT ili fallback deploymenta. Javni LifeSpinner privacy GET HTTP200, LifeSpinner i Google Mobile Ads sadržaj prisutni. Ovo je provjera **objavljene konzolne konfiguracije i linka**, ne dokaz prikaza na fizičkom iPhoneu ili završenog propagation/SDK QA.

## iOS store, readiness i app-ads.txt

Direktni [AdMob Apps inventar](https://admob.google.com/v2/apps/list) 17.11. potvrđuje za LifeSpinner iOS: **Requires review**, **Limited ad serving — Add store to lift limit**, **Add shop**, store ID `—`, jedna aktivna jedinica. App Store povezivanje u AdMobu nije završeno; iOS nije Ready. Source ASC ID nije dokaz povezivanja, objave ili Apple odobrenja. Nisu promijenjeni store link niti readiness postavke.

Javni GET `https://random-life-preview.pages.dev/app-ads.txt` 17.11.: HTTP200, `text/plain; charset=utf-8`, tačno `google.com, pub-8395430021391101, DIRECT, f08c47fec0942fa0` s newline. **To je potvrđena objava fajla, ne iOS verifikacija.** AdMob app-ads ekran prikazuje2/2 crawler reda, LifeSpinner samo za **Google Play**, Ready / file found and verified, last crawled6mins ago u času pregleda. **Nema LifeSpinner iOS crawler reda ili potvrđene iOS verifikacije.** Account aggregate100% i Android Ready u app-ads tabeli ne prenose se na iOS app readiness. Android app inventar je zasebno Getting ready / Review in progress.

Otvoreno za Salem/ovlaštenog AdMob operatora: stvarni ASC listing/status i developer website, ispravno iOS store povezivanje kada bude dostupno, domain crawl/iOS verifikacija i app review/serving ograničenja. Ne obećavati live fill prije odobrenja. Nova javna ENG/BHS LifeSpinner politika objavljena je ranije13.11. ([dokaz](reviews/privacy-web-release-2026-11-13.json)); UMP URL nesklad je sada razriješen sesijom11. Readiness/store status iznad je direktni raniji pregled17.11.; ova URL korekcija nije novi review ili store povezivanje.

### Šta zavisi od javnog App Store listinga

Prema [Google readiness uputama](https://support.google.com/admob/answer/10564477?hl=en), aplikacija za readiness pregled mora biti objavljena/dostupna korisnicima, navedena u podržanoj trgovini i ispravno povezana s AdMobom. Sam ASC app ID, EAS FINISHED, privatni IPA ili TestFlight nisu dokaz takvog javnog listinga. **U ovoj sesiji nije nezavisno potvrđeno da je LifeSpinner javno dostupan na App Storeu**; Salem provjerava konkretan javni listing i dostupnost preuzimanja. AdMob status Requires review/Add shop ostaje potvrđeni početni nalaz; URL korekcija sama ne uklanja to ograničenje.

[Google app-ads FAQ](https://support.google.com/admob/answer/9675354?hl=en) zahtijeva objavljen store listing da crawler otkrije developer website; za iOS se website dodaje kroz **Marketing URL**, a na javnoj stranici mora se vidjeti Developer Website link. Za postojeći domain cilj je `https://random-life-preview.pages.dev/`, s publisher fajlom na `/app-ads.txt`. Privacy URL u UMP-u ili ASC Privacy Policy polju nije zamjena za taj Marketing URL. Salem prvo potvrđuje javni iOS listing/Developer Website, zatim ovlašteni AdMob operator povezuje tačan listing i provjerava iOS verification/crawler rezultat. [App verification](https://support.google.com/admob/answer/14538460) i readiness odobrenje zasebni su uslovi za punu isporuku oglasa. Nema unaprijed obećanog vremena odobrenja niti zaključka iz Android crawler reda. Ova predaja ne mijenja ASC/store linkove niti pokreće review/submission.

## Postojeći iOS artefakti i privacy/ATT gate

Historijski ad-free build0.23.0(2), EAS `a73b11b1-93e0-4af5-b12c-70b77a6a185c`, source `1e6f8efc1d0e3ccfb0daf4df6e234f8761992683`, nije novi ads kandidat. Appleov zahtjev za dodatnim informacijama/fizičkim videom ostaje odvojena obaveza.

Salemov [verzionirani release nalaz](https://github.com/salemko72/RANDOM-life/blob/3641356d8bfe4f8f6879e705844381aa19b2cb11/docs/ADS_002_RELEASE_CHECK.md) potvrđuje raniji **testni** iOS IPA0.23.0(3), `ads-test-store`, EAS **`734be437-bd03-4453-a125-3d019062c03c`**, FINISHED, source **`bfc71733de64d8f7f30fb3831b6b19af64bfc1a7`**. Pod-install log: GMA13.10.0/UMP3.1.0, Archive Succeeded; Xcode device-family1. To je ranije dokumentovan rezultat, nije novopreuzet/retestiran IPA17.11. Download tada403; finalni IPA SHA256, ugrađeni manifesti i fizički QA ostaju otvoreni. Build3 nije dokaz TestFlight uploada, reviewa ili javne objave. Android10 i ovaj IPA nemaju isti source SHA.

**Poznati podaci iz Salemovog verzijski određenog pregleda SDK paketa (nisu nezavisno izvučeni iz IPA):**

| SDK / manifest | Deklarisano u prethodnom auditu |
|---|---|
| GMA13.10.0 | CoarseLocation, DeviceID, AdvertisingData, ProductInteraction linked; DeviceID tracking=true. Diagnostics/performance/crash not linked. Required-reason API: SystemBootTime35F9.1, UserDefaultsCA92.1, DiskSpaceE174.1. |
| UMP3.1.0 | CoarseLocation, PerformanceData, ProductInteraction not linked/tracking=false, app functionality; UserDefaultsCA92.1. |

GMA arm64 manifest SHA256 iz tog nalaza `69fb112582fc23fc06c635c961d262a3f7b4b5654d284787491de3000dadf9d2`; UMP `45b7adb99fcd2d962a1c800fbfcc1325b57a7fa4165f416182323bb5ffe9c900`. Konačni IPA audit treba potvrditi paket/verzije/manifeste, ukupni app privacy report, tracking domene i sva required-reason API korištenja.

Aktuelna [Google iOS disclosure stranica](https://developers.google.com/admob/ios/privacy/data-disclosure), provjerena17.11., opisuje **13.12.0**, ne zaključani13.10.0. Kao poznate kategorije navodi crash/performanse, uređajne identifikatore, podatke o oglasima, približnu lokaciju/IP i interakcije; svrhe uključuju oglase i analitiku. Služi kao dodatna provjera kategorija, ne zamjena za audit tačne verzije. [Google privacy strategije](https://developers.google.com/admob/ios/privacy/strategies) opisuju i publisher first-party ID te SKAdNetwork bez IDFA. U zaključanoj17.4.0 biblioteci first-party-ID setter je JS stub, a publisherPrivacyPersonalizationState validator ne prenosi; nisu dokaz da su identifikatori/personalizacija isključeni.

**NPA nije dokaz odsustva trackinga.** UMP consent i Apple ATT su odvojeni. Prema [Apple definiciji](https://developer.apple.com/app-store/user-privacy-and-data-use/), procijeniti povezivanje korisničkih/uređajnih podataka s podacima drugih kompanija radi oglašavanja/mjerenja i data-broker dijeljenje, ne samo pristup IDFA-u. Otvoreno: stvarno mrežno ponašanje i identifikatori, native defaulti/first-party ID, SDK tracking deklaracije/domene, UMP i ad-serving konfiguracija te ispravne ASC App Privacy kategorije, linked/tracking i svrhe. Ne koristiti staru Data not collected izjavu za ads izdanje.

Salemov Codex treba dokumentovati jednu dokazanu odluku prije novog izdanja: ako stvarna konfiguracija uključuje ATT tracking, dodati i fizički provjeriti pravilan ATT tok i tekst uz dogovor o promjeni; ako ga ne uključuje, dokazati to stvarnim nalazima i uskladiti izjave. Trenutno **ATT/live gate otvoren**, explainer nije samostalna zamjena za audit. Ova sesija ništa nije uključila ili isključila.

## Android build10 — konačan zaseban nalaz

Autoritativni [rezultat](ANDROID_LIVE_AAB_RESULT.md) i [sigurni JSON](reviews/android-live-aab-2026-11-16.json) iz16.11.; hash stvarnog lokalnog AAB-a ponovo izračunat17.11. i jednak:

| Stavka | Potvrđeno |
|---|---|
| EAS / source | `ff9cee28-f381-454b-9954-ec0bb63b1546`, FINISHED, `1d334308483d9064fb853aa106ec3a9e49b8046e` |
| AAB | `LifeSpinner-0.23.0-10-live.aab`, 65.894.590bajta, **SHA256 `26b5d59e387987392f1574520af473a310ec98fdac4fbec5a145e8e342e5cd47`** |
| Signer | jarsigner verified/RSA; cert SHA256 **`67768f6f56b3d542ab700b91e3e2dce6f0682c4798fa908927d53593cde6ed6e`**, isti kao Play prihvaćeni code9; self-signed/no timestamp upozorenja zabilježena, nije novi key |
| Manifest | `com.salemko.randomlife`,0.23.0/code10,min24/target36, AppID `ca-app-pub-8395430021391101~6926064985`, AD_ID prisutan, delayed measurement=true, portrait enum1; bundletool validate PASS |
| SDK / režim | GMA25.5.0/UMP4.0.0 iz AAB; ads-live/STORE, Android unit `ca-app-pub-8395430021391101/6024046858`, NPA=true. Live potvrđen source+EAS env/profile+Metro export+final metadata, uz pregled Hermes paketa; nije zaključen samo po stringovima. |
| Granice | Nije uploadan/poslan/objavljen u Playu; live AAB10 nije fizički QA potvrđen. Jedan build, bez duplikata; tada Free6/30,Android3/15,overage/cost0. To nije današnja kvota za iOS. |

Lokalni fajl u roditeljskom workspaceu `output/android-live-release-2026-11-16/`; drugi account nema automatski taj folder. Koristiti [postojeći EAS build](https://expo.dev/accounts/salemko/projects/random/builds/ff9cee28-f381-454b-9954-ec0bb63b1546) i ovlašten download/prijenos; privatni artifact URL-ovi/credentials nisu u Git-u. **Android rezultat ne potvrđuje iOS linking, SDK manifest, ATT, readiness ili QA.**

## Izvršene provjere i nastavak

17.11., neizmijenjen aplikacijski source1d33430 uz docs claim40f1bc4: source AppID/unit/profile/UMP/ATT statički pregled PASS; ciljani Vitest `google-ads-adapter`, `ads-controller`, `ads-policy` **37/37,3fajla PASS**. `node scripts/check-ads-native-config.mjs` PASS nad **ranije generisanim** `.native-check` introspection/autolink/Android fajlovima, nije svježi prebuild niti finalni iOS native dokaz. Git diff potvrđuje nepromijenjene relevantne source fajlove. AAB SHA256 ponovljen PASS; potpis/bundletool/manifest/SDK ostaju audit16.11., nisu svi ponovo izvršeni. Ranijih328testova/43fajla i typecheck PASS za code10 vidi [sesiju07](../collaboration/sessions/2026-11-13-ahmed-admob-07.md); nisu predstavljeni kao nova puna test runda.

Salemov nastavak redom: nastaviti vlastiti IOS-PRIVACY-001 claim; potvrditi preuzeti SHA i pregledati ispravljenu UMP dodjelu bez dupliranja korekcije; dovršiti otvoreni ATT/native audit postojećeg IPA3; uključivanje PR2 dogovoriti za sljedeći zajednički source; provjeriti ASC/EAS inventar, aktuelnu besplatnu kvotu i postojeći signing; zapisati novi čist source pin, predložiti sljedeći broj i eksplicitni iOS test/live izbor. Tek zasebno odobrenje dopušta novi build. Ne koristiti `npm run update:ios`: povećava broj i uključuje submit. Fizički iPhone QA/video i konačni ASC odgovori ostaju Salemovi; RIGHTS-001 ostaje release uslov.

## RIGHTS-001 — otvoreni izvori tekstova/podataka

Ovo je read-only inventar za nastavak **RIGHTS-001, status open**; nije zatvoren audit licenci niti preuzimanje uređivanja sadržaja. Javna `/api/catalog` provjera17.11. daje467stavki: BOOK172,EAT147,WATCH101,MOVE27,GO20. Lokalni offline fallback ima100stavki; njegovi izvori zasebno pregledani. `source.url` i rightsNote/uredničko odobrenje nisu dokaz licence, a nedostajući URL nije dokaz originalnosti. Nisu pregledani privatni draftovi, sve revizije ili svi uvezeni ZIP-ovi; njihovo porijeklo ostaje dodatni scope.

- WATCH: TMDB55, Rotten Tomatoes20, Criterion11, BFI4 i BFI data3, IMDb3, AFI/Cineteca/Wikipedia/Netflix/Google Play po1. Provjeriti opis/sinopsis, prevode, metadata, uslove komercijalne upotrebe, atribuciju i izvor po itemu. Nema potvrđene komercijalne TMDB dozvole.
- BOOK: autorske, izdavačke, knjižarske i medijske stranice u tabeli ispod; naročito jergovic.com55, Planetadelibros10, Vrisak/VBZ8 i Libreriauniversitaria8. Provjeriti bibliografske činjenice odvojeno od preuzetih opisa/prevoda. Open Library CC0 katalog ne pokriva automatski omote, tuđe opise ili svaki povezani sadržaj; nema Open Library domena u trenutnim javnim source.url vrijednostima, što ne isključuje raniju upotrebu/import.
- EAT: receptne stranice i institucionalni nutritivni izvori u tabeli; provjeriti originalnost postupka/prevoda, količine/nutritivne baze, atribuciju i prava ponovne upotrebe. Medicinska pouzdanost/alergeni su dodatna provjera, nisu posljedica licence.
- MOVE: Wodwell, fitness/sportske stranice; provjeriti tekstove treninga/uputa, pripisivanje i prava medija odvojeno. GO20 bez source.url: utvrditi autorstvo i eventualne korištene izvore, ne pretpostaviti originalnost.
- Nedostaje source.url za BOOK5,EAT31,MOVE16,GO20, ukupno72javne stavke. Prioritet je dohvatiti provenance i odvojiti samostalno napisani tekst od tuđih činjenica/opisa.
- Petnaest generičkih BOOK/WATCH slika rješava samo taj artwork scope. Ne zatvara prava na tekstove/podatke, preostale slike/media, starije offline instalacije ili sadržaj koji nije u sadašnjem javnom snapshotu. Bez automatskog brisanja, plaćenih licenci ili izmjene produkcijskog sadržaja.

### RIGHTS-001-KIDNEY — konkretan audit backlog, bez izmjene recepata

Read-only javni katalog17.11., sesija11: **18 EAT stavki** ima `source.url` na kidney-health domenama ispod; **17 ima low-phosphate**, jedna KNI supa uncertain/reviewed=false bez oznake. Ovo je prioritetni podskup, ne tvrdnja da su svi bubrežni izvori pronađeni preko domena ili da su prava riješena. Inventarisati i druge recepte bez URL-a, offline100, revizije i pakete. Vlasnik audita nije još dodijeljen; Ahmed/Salem trebaju imenovati rights urednika i kvalifikovanog nutritivnog recenzenta. Svi zadaci su **open**, ne mijenjaju produkciju niti potvrđuju zdravstvenu prikladnost.

| Podzadatak | Konkretan rezultat / kriterij prihvatanja |
|---|---|
| RIGHTS-001-K1 — komercijalna licenca po izvoru | Za NKF/kidney.org, AKF/Kidney Kitchen, Kidney Care UK, KNI i DaVita sačuvati tačan recipe URL, autor/nosilac prava, datum i verziju uslova/licence. Provjeriti dopušta li konkretna licenca redistribuciju u aplikaciji s oglasima, prevod/preradu i offline kopiju. Ako uslovi ne daju jasan odgovor, evidentirati nepoznato i potreban pisani dokaz/dozvolu. Sam status udruge, besplatan pristup ili javni URL ne tretirati kao komercijalnu dozvolu. Bez kupovine ili slanja zahtjeva trećima iz ove sesije. |
| RIGHTS-001-K2 — tekst i fotografije odvojeno | Po svih18ID-eva i ENG/BHS verziji označiti preuzeta polja: sastojci/količine, postupak, opis, recommendationReason, zdravstvene napomene i prevod. Usporediti s originalom i evidentirati originalni urednički rad i atribuciju. Za svaku sliku posebno provjeriti izvor, autora/licencu ili dokaz originalnog AI artworka, uključujući offline/revizije; tekstualna licenca ne podrazumijeva fotografije. Preformulisanje/atribucija/disclaimer i generičke BOOK/WATCH slike ne zatvaraju ovaj zadatak. |
| RIGHTS-001-K3 — porijeklo nutritivnih vrijednosti | Za svaku vrijednost (posebno fosfor) dokumentovati je li sa source nutrition panela, iz baze/računa ili procjene; navesti datum/verziju, tačnu recepturu, proizvode i količine, broj i masu/volumen porcija, jedinice mg po porciji naspram100g i sve preračune/zamjene. Provjeriti uslove ponovne upotrebe nutrition podataka zasebno. Ne izmišljati mg gdje izvor daje samo oznaku ili raspon. |
| RIGHTS-001-K4 — dokaz za low phosphorus | Nutritivni recenzent provjerava podudarnost lokalne recepture/porcije i deklaracija/aditiva s izvorom, dokaz eksplicitne source oznake ili dokumentovane procjene, `phosphateAssessment.evidenceUrl`, notes ENG/BHS i ko/na osnovu čega je dao reviewed=true/suitability=low. Postojeći flag nije dokaz nezavisne kliničke verifikacije; low sodium/protein/potassium ili naziv kidney-friendly sami ne zatvaraju osnov za fosfor. Ne uvoditi univerzalni prag niti mijenjati hard filter. |
| RIGHTS-001-K5 — urednički nalaz i odluka | Napraviti matricu itemID/jezik/tekst-prava/slika-prava/nutrition-izvor/porcija/low-phosphate-osnov/otvoreno/owner i preporuku vlasnicima. Čuvati historiju. Tek zaseban dogovor dopušta prepisivanje, zamjenu, uklanjanje ili promjenu oznake; ovaj nalog ništa od toga ne izvršava. |

Prioritetne provjere iz **postojećih javnih napomena**, koje nisu nov nezavisan audit izvora: KNI salata `a2b479dc` ima razliku vegan/obična majoneza i nema objavljen mg; NKF smuti `a99d9c81` navodi brand-dependent raspon, bez jedinstvenog mg; Kidney Care UK četiri jela imaju source oznaku bez mg, uz tačno uključene priloge i porcije. Za NKF frozen yogurt `191538a0` i egg cups `bf5f9042` BHS napomena spominje procjenu za hljeb iako nije riječ o hljebu — provjeriti konzistentnost ENG/BHS i porijeklo boilerplate teksta, **bez automatske korekcije**. KNI supa `0cdb7e36` ostaje uncertain u javnom zapisu; ne dodavati low-phosphate na osnovu naziva izvora. Ove stavke su audit tragovi, ne zaključak o licenci ili medicinskoj sigurnosti.

Početna lista za svih18ID-eva slijedi. mg je **vrijednost trenutno deklarisana u aplikacijskom katalogu**, nije ponovo potvrđena u izvornom nutritivnom panelu u ovoj sesiji. Crtica znači da numeričko polje nedostaje, ne0mg.

| Item ID / naziv | Izvor za provjeru | low-phosphate sada | mg/porcija sada |
|---|---|---|---:|
| `0cdb7e36-8cf5-41f4-b52c-e3d7031ed4b6` Supa od pečenih paprika i kokosa — KNI | [source](https://kidneynutritioninstitute.org/recipes/roasted-red-pepper-soup-kidney-friendly-soup/) | ne; uncertain | — |
| `191538a0-ab4f-4f5c-a002-47a1594aac81` Smrznuti jogurt s jagodama i čokoladom — NKF | [source](https://www.kidney.org/nutrition/recipes/strawberry-and-chocolate-frozen-yogurt-bark) | da | 36 |
| `2f3dc6d8-f393-4c71-a3c3-d1d2ef0a1ea3` Brza supa od povrća — NKF | [source](https://www.kidney.org/nutrition/recipes/ten-minute-veggie-soup) | da | 70 |
| `3f21f4f2-3737-4697-a7b7-3e75bb000a3f` Curry od tikve i leblebija — Kidney Care UK | [source](https://kidneycareuk.org/get-support/healthy-diet-support/kidney-kitchen/recipe-index/butternut-squash-and-chickpea-curry/) | da | — |
| `678aff01-e165-4764-90a2-2ad894ff3a15` Salata od kelja i prokulica — DaVita | [source](https://davita.com/diet-nutrition/recipes/salads-dressings/kale-slaw/) | da | 38 |
| `7208b38d-d14f-401a-9b11-d6e9874fb264` Tjestenina s pestom od bosiljka i oraha — AKF | [source](https://kitchen.kidneyfund.org/recipe/creamy-pesto-pasta/) | da | 112 |
| `8106f94a-8b5b-46af-8c55-2b383787d002` Pire od karfiola — Almost Mashed Potatoes | [source](https://davita.com/diet-nutrition/recipes/vegetables/almost-mashed-potatoes/) | da | 54 |
| `813f521a-885d-4f88-8865-f8a83a2b3e5c` Lisnato povrće s tofuom i susamom — NKF | [source](https://www.kidney.org/nutrition/recipes/sesame-greens-tofu) | da | 170 |
| `8236cc39-3ea9-49bd-a55d-41f37087d62a` Rižoto s graškom i mentom — Kidney Care UK | [source](https://kidneycareuk.org/get-support/healthy-diet-support/kidney-kitchen/recipe-index/pea-and-mint-risotto/) | da | — |
| `85372e63-ddbd-4eb5-aeea-1c81563f8626` Boranija s lješnjacima i brusnicama — NKF | [source](https://www.kidney.org/nutrition/recipes/green-beans-hazelnuts-and-dried-cranberries) | da | 73 |
| `9d106338-9cec-49ac-b59f-20a1621a5f2d` Male palačinke — NKF Kidney Cooking | [source](https://www.kidney.org/sites/default/files/docs/kidney_cookbook_lr.pdf) | da | 64 |
| `a0053379-39f3-4178-879a-20d5fc7e5f98` Salata od breskve i krastavca — AKF | [source](https://kitchen.kidneyfund.org/recipe/peach-cucumber-salad/) | da | 36 |
| `a2b479dc-456f-4dad-882f-cf021a7bc9fd` Salata od karfiola i krompira — KNI | [source](https://kidneynutritioninstitute.org/recipes/cauliflower-potato-salad/) | da | — |
| `a99d9c81-7df6-4c7a-a118-b101928e6c88` Smuti od jagode i ananasa — NKF | [source](https://www.kidney.org/nutrition/recipes/strawberry-pineapple-plant-based-smoothie) | da | — |
| `bd086db2-7ef4-45ca-af12-65297cc6b18f` Bolognese od crvene leće — Kidney Care UK | [source](https://kidneycareuk.org/get-support/healthy-diet-support/kidney-kitchen/recipe-index/red-lentil-bolognese/) | da | — |
| `bf5f9042-d1a0-45e5-976f-8bb1469ca705` Pečene korpice od jaja, svinjetine i paprika — NKF | [source](https://www.kidney.org/nutrition/recipes/savory-sausage-and-pepper-egg-cups) | da | 154 |
| `db0e1d46-7738-445b-bd6e-96b8b3a0059e` Začinjeni hljeb s mrkvom i grožđicama — NKF | [source](https://www.kidney.org/nutrition/recipes/spiced-carrot-raisin-bread) | da | 75 |
| `e80d9051-d084-4e69-a68c-c7e4cca6a037` Kedgeree s lososom — Kidney Care UK | [source](https://kidneycareuk.org/get-support/healthy-diet-support/kidney-kitchen/recipe-index/salmon-kedgeree/) | da | — |

Sljedeći RIGHTS operator treba za svaki item/jezik upisati tačan izvor, preuzeta polja, dokaz prava/uslova/verzije i atribucije, originalne uredničke doprinose i odluku zadržati/prepisati/zamijeniti uz vlasnikovo odobrenje. Donja tabela je kompletan inventar **javnih source.url domena**, ne tvrdnja da domen nema dozvolu; **pravo nije provjereno u ovoj predaji**.

| Kategorija | source.url domen / nedostatak | Javne stavke17.11. | RIGHTS-001 |
|---|---|---:|---|
| BOOK | [no source.url] | 5 | otvoreno |
| BOOK | anahuang.com | 1 | otvoreno |
| BOOK | balkans.aljazeera.net | 1 | otvoreno |
| BOOK | bompiani.it | 1 | otvoreno |
| BOOK | booka.rs | 1 | otvoreno |
| BOOK | books.apple.com | 1 | otvoreno |
| BOOK | books.google.ba | 1 | otvoreno |
| BOOK | booksa.eu | 1 | otvoreno |
| BOOK | boydellandbrewer.com | 2 | otvoreno |
| BOOK | buybook.ba | 3 | otvoreno |
| BOOK | canongate.co.uk | 1 | otvoreno |
| BOOK | edenbooks.rs | 1 | otvoreno |
| BOOK | fraktura.hr | 3 | otvoreno |
| BOOK | giuntialpunto.it | 1 | otvoreno |
| BOOK | impedimenta.es | 1 | otvoreno |
| BOOK | kreativnicentar.rs | 1 | otvoreno |
| BOOK | laguna.rs | 5 | otvoreno |
| BOOK | link.springer.com | 1 | otvoreno |
| BOOK | mozaik-knjiga.hr | 1 | otvoreno |
| BOOK | oceanmore.hr | 1 | otvoreno |
| BOOK | oceano.mx | 1 | otvoreno |
| BOOK | paulahawkinsbooks.com | 1 | otvoreno |
| BOOK | shop.naklada-val.hr | 1 | otvoreno |
| BOOK | vrisak.vbz.hr | 8 | otvoreno |
| BOOK | www.beopolis.rs | 1 | otvoreno |
| BOOK | www.bloomsbury.com | 1 | otvoreno |
| BOOK | www.castelvecchieditore.com | 1 | otvoreno |
| BOOK | www.chrispavone.com | 1 | otvoreno |
| BOOK | www.diogenes.ch | 1 | otvoreno |
| BOOK | www.droemer-knaur.de | 2 | otvoreno |
| BOOK | www.dtv.de | 2 | otvoreno |
| BOOK | www.einaudi.it | 1 | otvoreno |
| BOOK | www.hachette.co.uk | 1 | otvoreno |
| BOOK | www.hachettebookgroup.com | 1 | otvoreno |
| BOOK | www.jergovic.com | 55 | otvoreno |
| BOOK | www.kiwi-verlag.de | 1 | otvoreno |
| BOOK | www.knjizare-vulkan.rs | 5 | otvoreno |
| BOOK | www.libreriaeditricevaticana.va | 1 | otvoreno |
| BOOK | www.libreriauniversitaria.it | 8 | otvoreno |
| BOOK | www.littlebrown.co.uk | 3 | otvoreno |
| BOOK | www.nakladaneptun.hr | 1 | otvoreno |
| BOOK | www.nocknjige.rs | 1 | otvoreno |
| BOOK | www.panmacmillan.com | 2 | otvoreno |
| BOOK | www.penguin.co.uk | 1 | otvoreno |
| BOOK | www.penguin.com.au | 1 | otvoreno |
| BOOK | www.penguin.de | 5 | otvoreno |
| BOOK | www.penguinlibros.com | 1 | otvoreno |
| BOOK | www.penguinrandomhouse.com | 3 | otvoreno |
| BOOK | www.planetadelibros.com | 10 | otvoreno |
| BOOK | www.rizzolilibri.it | 1 | otvoreno |
| BOOK | www.rowohlt.de | 2 | otvoreno |
| BOOK | www.sarajevopublishing.ba | 2 | otvoreno |
| BOOK | www.sellerio.it | 1 | otvoreno |
| BOOK | www.simonandschuster.com | 1 | otvoreno |
| BOOK | www.thalia.de | 1 | otvoreno |
| BOOK | www.tunue.com | 1 | otvoreno |
| BOOK | www.ullstein.de | 1 | otvoreno |
| BOOK | www.vulkani.rs | 2 | otvoreno |
| BOOK | www.ynharari.com | 4 | otvoreno |
| BOOK | yalebooks.yale.edu | 1 | otvoreno |
| BOOK | znanje.hr | 1 | otvoreno |
| EAT | [no source.url] | 31 | otvoreno |
| EAT | blog.giallozafferano.com | 1 | otvoreno |
| EAT | cafedelites.com | 2 | otvoreno |
| EAT | cookieandkate.com | 3 | otvoreno |
| EAT | davita.com | 2 | otvoreno |
| EAT | deliciousbyarduana.com | 1 | otvoreno |
| EAT | downshiftology.com | 2 | otvoreno |
| EAT | japan.recipetineats.com | 1 | otvoreno |
| EAT | kidneycareuk.org | 4 | otvoreno |
| EAT | kidneynutritioninstitute.org | 2 | otvoreno |
| EAT | kitchen.kidneyfund.org | 2 | otvoreno |
| EAT | lilluna.com | 1 | otvoreno |
| EAT | momsdish.com | 1 | otvoreno |
| EAT | natashaskitchen.com | 1 | otvoreno |
| EAT | norecipes.com | 1 | otvoreno |
| EAT | omnivorescookbook.com | 2 | otvoreno |
| EAT | rasamalaysia.com | 1 | otvoreno |
| EAT | thewoksoflife.com | 3 | otvoreno |
| EAT | vidarbergum.com | 1 | otvoreno |
| EAT | www.bbcgoodfood.com | 4 | otvoreno |
| EAT | www.chasingthedonkey.com | 1 | otvoreno |
| EAT | www.food.com | 1 | otvoreno |
| EAT | www.foodswinesfromspain.com | 1 | otvoreno |
| EAT | www.giallozafferano.com | 19 | otvoreno |
| EAT | www.gimmesomeoven.com | 1 | otvoreno |
| EAT | www.justonecookbook.com | 2 | otvoreno |
| EAT | www.kidney.org | 8 | otvoreno |
| EAT | www.lacucinaitaliana.com | 1 | otvoreno |
| EAT | www.lacucinaitaliana.it | 1 | otvoreno |
| EAT | www.laylita.com | 2 | otvoreno |
| EAT | www.maangchi.com | 1 | otvoreno |
| EAT | www.onceuponachef.com | 1 | otvoreno |
| EAT | www.puffpastry.com | 8 | otvoreno |
| EAT | www.recipetineats.com | 12 | otvoreno |
| EAT | www.saltandlavender.com | 1 | otvoreno |
| EAT | www.seriouseats.com | 10 | otvoreno |
| EAT | www.simplyrecipes.com | 2 | otvoreno |
| EAT | www.spendwithpennies.com | 4 | otvoreno |
| EAT | www.thekitchn.com | 1 | otvoreno |
| EAT | www.themediterraneandish.com | 4 | otvoreno |
| GO | [no source.url] | 20 | otvoreno |
| MOVE | [no source.url] | 16 | otvoreno |
| MOVE | bowlcanada.ca | 1 | otvoreno |
| MOVE | gethealthyu.com | 1 | otvoreno |
| MOVE | impossiblefitness.com | 1 | otvoreno |
| MOVE | thedailywod.com | 1 | otvoreno |
| MOVE | wodwell.com | 5 | otvoreno |
| MOVE | www.killerspin.com | 1 | otvoreno |
| MOVE | www.rajansbadmintonakademy.com | 1 | otvoreno |
| WATCH | bfidatadigipres.github.io | 3 | otvoreno |
| WATCH | catalog.afi.com | 1 | otvoreno |
| WATCH | cinetecadibologna.it | 1 | otvoreno |
| WATCH | en.wikipedia.org | 1 | otvoreno |
| WATCH | play.google.com | 1 | otvoreno |
| WATCH | www.bfi.org.uk | 4 | otvoreno |
| WATCH | www.criterion.com | 11 | otvoreno |
| WATCH | www.imdb.com | 3 | otvoreno |
| WATCH | www.netflix.com | 1 | otvoreno |
| WATCH | www.rottentomatoes.com | 20 | otvoreno |
| WATCH | www.themoviedb.org | 55 | otvoreno |
