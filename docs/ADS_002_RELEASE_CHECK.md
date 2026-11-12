# ADS-002 — Salemov release nalaz

Provjera: 12.11.2026. Ovaj dokument dopunjava [Ahmedov pregled](ADS_001_REVIEW.md) i [release handoff](RELEASE_HANDOFF.md); ne zamjenjuje historijske rezultate. [Zadaci za Ahmedov Codex](AHMED_CODEX_NEXT_STEPS.md) i [Apple Notes nacrt](APPLE_REVIEW_RESPONSE_DRAFT.md) su dio ove predaje.

## Source, vlasništvo i ovlaštenje

- PR #1 head pregledan: `5a603da71b1716143887fcdb3a8dec3614a1a016`; aplikacijska implementacija `e1228ed725d63a56e280e00d3c840ab5890311b6`.
- Zajednički testni build SHA: **`bfc71733de64d8f7f30fb3831b6b19af64bfc1a7`**. To je PR head + objavljeni Salemov claim/plan, bez aplikacijskih izmjena. `git diff origin/pr-1 HEAD -- apps packages services scripts package.json package-lock.json tests` bio je prazan na tom commitu.
- Grana `codex/salem-ads-release-check`; claim push potvrđen prije build pokušaja. Za build koristi se odvojen čist checkout. Korisničke untracked datoteke u izvornom checkoutu nisu u ovom sourceu niti su brisane.
- Ahmed zadržava ADS-001 kod/config/web fajlove. Ova grana dodaje odvojene release dokumente; ne preuzima njegove datoteke.
- Korisnikov nalog: završiti dostupni dio i pripremiti konkretan nastavak. Nema odobrenja za merge, produkcijski deploy, DB promjene, dodatni trošak ili slanje trgovinama.

## Pristupi i kvota — stvarno provjereno

| Stavka | Dokaz / granice |
|---|---|
| Git | fetch/push rade; PR #1 source preuzet kroz refs/pull/1/head. GitHub REST iz ovog okruženja vraća403. To nije stanje Ahmedovog accounta. |
| Expo | whoami potvrđuje `salemko` Owner; project:info potvrđuje postojeći `@salemko/random`, ID `04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a`. |
| Free kvota prije buildova | Ciklus1.11–1.12.2026: ukupno2/30 iskorišteno; Android0/15, iOS2/15; overage0, estimated cost0. Tri build pokušaja staju u tada raspoloživu kvotu. Ponovo provjeriti prije novih pokušaja. |
| Android credentials | EAS metadata potvrđuje default keystore za com.salemko.randomlife; EAS je odabrao postojeći ključ. Poklapanje Play upload certifikata nije provjereno u konzoli. |
| iOS credentials | Postojeći APP_STORE distribution certifikat i active provisioning profil ističu3.11.2027. EAS prihvata postojeće credentials. Metadata nije nezavisna potvrda Apple revocation statusa. Tok je imao prolazne Apple403/retry poruke prije korištenja postojećeg profila; nisu kreirani novi ključevi. |
| EAS brojevi prije pokušaja | Najnoviji Android production0.22.0/code7; iOS0.23.0/build2. Play/ASC inventar nije dostupan. Testni9/3 nisu rezervacija slobodnog store broja; upload je blokiran do konzolne provjere. |
| Cloudflare | Read-only GET postojećeg Pages projekta uspio. Tajne nisu ispisane ili sačuvane u predaji. Nema deploya. |
| Uređaji/konzole | Nema priključenog fizičkog Androida/iPhonea, macOS/Xcodea ili potvrđenog direktnog AdMob/Play/ASC console pristupa. EAS signing service nije pristup tim konzolama. |

## EAS build-only pokušaji

Svi koriste source **`bfc71733de64d8f7f30fb3831b6b19af64bfc1a7`**, verziju0.23.0 i eksplicitni test mode. EAS metadata potvrđuje source SHA i brojeve. Nije korišten auto-submit ili update:ios.

| Artefakt | EAS ID | Profil | Verzija/build | Zadnji provjereni status |
|---|---|---|---|---|
| APK | `77706c67-6214-45f7-abd9-120d8603036b` | `ads-test-apk` | 0.23.0 (9) | **FINISHED** |
| AAB | `665b90e5-16f0-44aa-8115-823e57403b4f` | `ads-test-store` | 0.23.0 (9) | **FINISHED** |
| iOS App Store IPA | `734be437-bd03-4453-a125-3d019062c03c` | `ads-test-store` | 0.23.0 (3) | **FINISHED** |

Sva tri EAS statusa su **FINISHED**, bez prijavljene build greške. Android logovi potvrđuju `BUILD SUCCESSFUL` (APK7m46s, AAB7m42s), iOS potvrđuje `Archive Succeeded`. Artefakti postoje na EAS-u; **nisu preuzeti u ovom okruženju**, pa SHA256 i pregled konačnog APK/AAB/IPA paketa nisu potvrđeni.

- [APK — EAS build](https://expo.dev/accounts/salemko/projects/random/builds/77706c67-6214-45f7-abd9-120d8603036b)
- [AAB — EAS build](https://expo.dev/accounts/salemko/projects/random/builds/665b90e5-16f0-44aa-8115-823e57403b4f)
- [iOS — EAS build](https://expo.dev/accounts/salemko/projects/random/builds/734be437-bd03-4453-a125-3d019062c03c)

Ovo su EAS stranice buildova, ne privatni potpisani download URL-ovi. Poslije buildova usage potvrđuje ukupno5/30, Android2/15, iOS3/15, overage0 i estimated total0. Preostaje13 Android i12 iOS besplatnih buildova u tom ciklusu; provjeriti ponovo prije novih pokušaja. Fizički QA nije izvršen. App Store IPA za iPhone ne daje direktnu instalaciju bez odgovarajuće distribucije; TestFlight upload traži zasebno odobrenje.

Build-only komande, iz `apps/client` na čistom pinu:

```sh
eas build --platform android --profile ads-test-apk --non-interactive --freeze-credentials --no-wait --json
eas build --platform all --profile ads-test-store --non-interactive --freeze-credentials --no-wait --json
```

Za drugi poziv korišten je EAS_SKIP_AUTO_FINGERPRINT=1; to ne mijenja source ili test mode. Prvi poziv iz root direktorija stao je prije builda zbog pogrešne lokacije eas.json; lokalni auto-generisani fajl uklonjen je iz izdvojenog checkouta, zatim je provjeren čist git status i komanda pravilno ponovljena iz apps/client. Nema dodatnog remote builda od tog pogrešnog poziva.

## Lokalne provjere

Na izdvojenoj PR kopiji sa npm ci --ignore-scripts, zatim zasebnim preview postinstall korakom:

| Provjera | Rezultat i granice |
|---|---|
| npm run build:preview | PASS |
| npm test | 328 PASS /43 fajla; ne predstavljati kao testiranje Google SDK-a na uređaju |
| npm run typecheck | PASS root i client |
| expo prebuild --no-install --platform all | PASS; Android i Xcode projekt generisani na Linuxu; bez lokalnog pod install/Xcode compile |
| check-ads-native-config.mjs | PASS manifest/Gradle, iOS introspection, oba autolinka, profile i publisher red |
| expo export --platform all --no-bytecode uz test mode | PASS; Android/iOS/web release JS |
| check-ads-release-output.mjs | PASS test literal i NPA put za oba native paketa; bez native GMA modula u webu; staging publisher/header/contact |
| smoke-ads-bridge.mjs | PASS web bez oglasa; native capability, spin/povratak/privacy, ograničen payload bez lokalnih preferencija |
| smoke-generic-artwork.mjs | PASS tri generičke porodice offline; nema zahtjeva za stare postere/omote |
| smoke-immediate-fixes.mjs | PASS ENG/BHS Back/busy/profile/share tokovi i first-run draft; browser, ne fizički SDK QA |
| stage-preview.mjs | PASS samo u izolovanom test direktoriju; nije produkcijski deploy |

Pri prvom autolink checku nedostajao je --json, pa je parser odbio formatirani izlaz. Ponovljeno s ispravnim JSON flagom prolazi; nije aplikacijska greška.

## iOS konfiguracija i ATT/privacy nalaz

Generisani Xcode project.pbxproj ima TARGETED_DEVICE_FAMILY="1" u obje konfiguracije. Info.plist sadrži GADApplicationIdentifier za iOS, GADDelayAppMeasurementInit=true i portrait/portrait-upside-down orijentacije. supportsTablet=false. Nema NSUserTrackingUsageDescription ni aplikacijskog ATT request toka. Ovo ne dokazuje da se iPhone kompatibilna aplikacija nikad ne može prikazati na iPadu.

Službeni CocoaPods podspec i Google binarni paketi pregledani su bez mijenjanja dependencyja. GMA podspec je zaključan na13.10.0; njegova UMP zavisnost je >=1.1. Resolved Podfile.lock je mjerodavan za konačnu UMP verziju. EAS pod-install log zatim potvrđuje **GMA13.10.0 i UMP3.1.0**, a Xcode log potvrđuje uspješno arhiviranje i kopiranje GMA/UMP i agregiranog app privacy manifesta. Podfile.lock i manifeste unutar finalne IPA još treba izvaditi i uporediti: download je ovdje blokiran.

| Manifest | Nalaz |
|---|---|
| Google Mobile Ads13.10.0 | CoarseLocation, DeviceID, AdvertisingData i ProductInteraction označeni linked; DeviceID ima tracking=true. Diagnostics/performance/crash navedeni kao not linked. To opisuje SDK deklaraciju i nije samo po sebi dokaz svakog runtime prikupljanja u ovom kandidatu. |
| GMA required-reason API | SystemBootTime35F9.1, UserDefaultsCA92.1, DiskSpaceE174.1. |
| UMP3.1.0 | CoarseLocation, PerformanceData i ProductInteraction, not linked/tracking=false, svrha app functionality; UserDefaultsCA92.1. |

GMA arm64 manifest SHA256: `69fb112582fc23fc06c635c961d262a3f7b4b5654d284787491de3000dadf9d2`. UMP3.1.0 arm64 manifest SHA256: `45b7adb99fcd2d962a1c800fbfcc1325b57a7fa4165f416182323bb5ffe9c900`. Izvori: CocoaPods CDN verzijski podspeci za Google-Mobile-Ads-SDK13.10.0 i GoogleUserMessagingPlatform3.1.0; Google paketi preko dl.google.com.

**ATT/live gate ostaje otvoren.** NPA nije dokaz da ATT nije potreban. Treba provjeriti stvarni resolved SDK, ugrađene manifeste, mrežno ponašanje i AdMob iOS poruke. Ako nema trackinga koji zahtijeva ATT, to dokumentovati; ako postoji, prvo implementirati i fizički provjeriti pravilan tok. Ne označiti Data not collected; ne koristiti publisher first-party-ID stub kao dokaz zaštite. Testni oglasi i build uspjeh ne uklanjaju ovaj release uslov.

## Web priprema i očuvanje postojećeg sadržaja

Source/staging ispravke za app-ads.txt, support.html i ads privacy postoje. Javne app-ads/support putanje u provjeri vraćaju isti SPA HTML fallback, pa HTTP200 nije uspjeh. Nema deploya niti crawler verifikacije.

Sačuvano je **56/56 poznatih javnih download fajlova, 37.684.247 bajtova**. Svi byte-identični ranijem poznatom inventaru; recipes/index.html je legitimni HTML dokument istog hasha. Ovo potvrđuje poznati inventar, ne dokazuje da ne postoje novododane putanje izvan njega. Prije deploya ponovo uskladiti puni aktuelni inventar.

Lokalni backup i provjera: `/workspace/shared/ads-release-check-2026-11-12/downloads/`, `downloads-verification.json`. Samo lokalno u ovom okruženju, nije automatski dostupno drugom accountu; ništa od toga nije objavljeno.

Read-only Pages metadata: deployment ostaje `7f9ee8fc-8f34-4330-bc3b-46783ecc4bbe`. Deployment-config SHA256 `cb133a5767db1a9519c6d76665de3d75c44b3a742c9c02ea112040e4795563ed`. CONTENT_DB i CONTENT_BUCKET su prisutni u preview/production konfiguraciji. Sačuvana je samo sigurna metadata i hash konfiguracije; ne raw secret vrijednosti. Hash nije zamjena za mogućnost povrata credentials kroz ovlašteni Cloudflare account.

Stage skripta briše staging. Backup mora biti vraćen i hash provjeren u stvarnom deploy paketu prije nego Salem odobri konkretan deploy. Postojeći probni staging nije odobren za direktan production upload.

## Read-only inventar porijekla kataloga — nije dozvola

Javni katalog:467 stavki (BOOK172, WATCH101, EAT147, MOVE27, GO20). Svih273 BOOK/WATCH stavki koriste generičke image putanje. WATCH source hostovi uključuju TMDB55, Rotten Tomatoes20, Criterion11, BFI4 i druge. Pet BOOK stavki nema source host. Source URL ne dokazuje kopiranje teksta, ali ne potvrđuje ni licencu.

Historijske source.rightsNote napomene još spominju omote/postere kod172 BOOK i78 WATCH zapisa. Migracija je namjerno sačuvala historiju; to nisu dokazi prava za novu ilustraciju ili svaki tekst. Nisu mijenjane ni brisane produkcijske stavke. Za RIGHTS-001 treba provjera po stavci, posebno tekst/prijevod/fakti/licenca; generičke slike ne zatvaraju taj zadatak.

## Mrežne blokade preuzimanja i PR-a

Artifact request ide expo.dev → api.expo.dev → **wf-artifacts.eascdn.net**, gdje restricted proxy vraćaHTTP403. Zbog toga nisu napravljeni lokalni SHA256 niti finalni package audit. Potrebno je lokalno preuzimanje kroz ovlašteni Expo account ili odobreno dodavanje tog hosta u environment network allowlist. Ne prosljeđivati potpisane URL-ove u Git.

GitHub PR create vraća403 za api.github.com. Pokušaj čuvanja mrežnog drafta sa ova dva dodatna hosta vratio je **draft_not_editable**; promjena nije sačuvana, primijenjena ni objavljena. Prijedlog za settings operatora je `/workspace/shared/ads-release-check-2026-11-12/NETWORK_ACCESS_REQUEST.md`. Nema potrebe za novim tokenom u chatu.

Dokumentacijski PR **nije otvoren**. Objavljena grana/compare za ručno otvaranje: [Ahmedova grana → Salemove release upute](https://github.com/salemko72/RANDOM-life/compare/codex/ahmed-admob-finish...codex/salem-ads-release-check?expand=1). Ovaj stacked diff sadrži samo Salemov claim/plan i dokumente. PR #1 prema mainu ostaje neizmijenjen.

## Predaja i ograničenja

Pročitati [Ahmedove naredne korake](AHMED_CODEX_NEXT_STEPS.md). Apple Notes su nacrt s eksplicitnim poljima za fizički video, regionalnu provjeru i prava; nisu spremni za automatsko slanje. Fizički QA, konačni ATT/store disclosures, console brojevi i sadržajna prava ostaju otvoreni.

Nema mergea u main, promjene GitHub defaulta, live oglasa, produkcijskog deploya, DB promjene, TestFlight/Play/ASC uploada ili objave. GitHub API403 blokadu pri otvaranju dokumentacijskog PR-a navesti sa stvarnim compare linkom; ne predstavljati compare link kao već otvoren PR.
