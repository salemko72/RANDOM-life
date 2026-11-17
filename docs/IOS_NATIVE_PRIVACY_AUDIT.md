# iOS native/privacy preflight — 17.11.2026.

Read-only nalaz nakon korisnikovog “nastavi”. Dopuna [Ahmedovoj predaji](IOS_ADMOB_HANDOFF.md), uz [siguran strukturirani dokaz](reviews/ios-native-preflight-2026-11-17.json). **Nije pokrenut novi build, promijenjen test/live režim ili UMP postavka, kreiran novi ključ, mergean PR ili poslan sadržaj trgovinama.**

## Zaključak i granice

Source i generisana iPhone konfiguracija prolaze provjere. Postojeći signing metadata i besplatna kvota dostupni su za naredni kandidat. **Konačna ATT odluka, finalni IPA audit i fizički QA nisu zatvoreni.** Stara IPA3 nije najnoviji UI/source kandidat. Ne koristiti ovaj dokument kao potvrdu App Store spremnosti, odsustva trackinga ili svih licenci.

## Tačan source i čiste dependencies

- Ahmedov docs head15c07f0971e19c0dbddc6cdfa85c49b9c0209b34; aplikacijski pin **1d334308483d9064fb853aa106ec3a9e49b8046e**.
- Vlastiti claim IOS-PRIVACY-001 objavljen na codex/salem-ios-privacy-audit prije audit dokumentacije. Samo vlastiti dokumenti/task/session.
- Git archive tačnog pina u /tmp/lifespinner-ios-audit-source-20261117, svježi npm ci --ignore-scripts iz lockfilea; preview postinstall izvršen zasebno. Expo57.0.32, GMA JS17.4.0. Glavni checkout ima starije Expo57.0.31 dependencies, zato nije korišten za ovu generaciju.
- **37/37 ads testova,3fajla PASS** na čistom sourceu/dependencies; nisu fizički SDK ili mrežni test.
- expo prebuild --platform ios --no-install i introspection PASS na Linuxu. To generiše Xcode projekt, ne izvršava lokalni pod install/Xcode compile. Historijski EAS build3 već je potvrdio stvarni Pod/Xcode build; novi nije napravljen.

## Generisani iOS projekt

| Stavka | Potvrđeno iz generisanog projekta |
|---|---|
| Bundle/team | com.salemko.randomlife / MNQY6SH96C u obje Xcode konfiguracije |
| Device family | TARGETED_DEVICE_FAMILY=1 u obje konfiguracije; supportsTablet=false |
| Orijentacije | Portrait i PortraitUpsideDown; uspravni interfejs |
| Verzija/broj |0.23.0 (3) — postojeći source broj, **već korišten** |
| GMA App ID | ca-app-pub-8395430021391101~6486035105 |
| Measurement | GADDelayAppMeasurementInit=true |
| SKAdNetwork | cstr6suwn9.skadnetwork |
| ATT | Nema NSUserTrackingUsageDescription i nema aplikacijskog requestTrackingAuthorization toka |

Prije pod installa nema app PrivacyInfo.xcprivacy u generisanom projektu. RN Pod postupak agregira required-reason API podatke; odsustvo prije Pods nije dokaz greške, a generisani predložak nije zamjena za konačni app/SDK privacy report. iPhone family ne garantuje da kompatibilni prikaz na iPadu nikada nije moguć.

## Nezavisni SDK/native nalazi

Službeni CocoaPods podspec i dl.google.com paketi13.10.0/3.1.0 preuzeti su i pregledani. Arm64 GMA manifest SHA256 **69fb112582fc23fc06c635c961d262a3f7b4b5654d284787491de3000dadf9d2**, UMP **45b7adb99fcd2d962a1c800fbfcc1325b57a7fa4165f416182323bb5ffe9c900** — podudarni ranijem nalazu. GMA podspec zaključava13.10.0; njegov UMP dependency >=1.1, dok stvarni historijski EAS Pods log potvrđuje3.1.0. Za budući build provjeriti novi resolved Podfile.lock.

| Nalaz | Značenje / ograničenje |
|---|---|
| Native NPA | RNGoogleMobileAdsCommon.mm pretvara requestNonPersonalizedAdsOnly=true u extras npa=1. Postoji stvarni native put, nije samo JS komentar. |
| Consent | App adapter čeka UMP canRequestAds; SDK ima native info update/privacy form.37 testova obuhvataju adapter/controller greške i privatnost; stvarni iPhone/regionalni tok nije izvršen. |
| First-party ID | GADRequestConfiguration.h iz tačnog SDK paketa izričito kaže da je publisher first-party ID enabled by default i da vrijednost traje kroz sesije. JS setPublisherFirstPartyIdEnabled u17.4.0 samo vraća Promise.resolve: ne isključuje native ključ. App ne poziva djelotvornu native kontrolu za isključenje. |
| Publisher personalization flag | validateAdRequestConfiguration vraća samo dozvoljena polja; publisherPrivacyPersonalizationState se ne prenosi. Ne koristiti ga kao dokaz privatnosti. |
| GMA deklaracije | DeviceID je linked i tracking=true; CoarseLocation/AdvertisingData/ProductInteraction linked; Diagnostics/Performance/Crash not linked. Required reasons: SystemBootTime35F9.1, UserDefaultsCA92.1, DiskSpaceE174.1. |
| UMP deklaracije | CoarseLocation/PerformanceData/ProductInteraction not linked, tracking=false, app functionality; UserDefaultsCA92.1. |

**First-party ID ili SDK manifest tracking flag sami po sebi ne dokazuju da ovaj kandidat obavlja Appleov tracking.** Apple procjenjuje stvarno povezivanje podataka s podacima drugih kompanija i data-broker dijeljenje. Isto tako NPA, odsustvo ATT prozora i IDFA explainera ne dokazuju odsustvo takvog ponašanja. Ne uključivati ATT naslijepo niti deklarisati no-tracking bez stvarnog nalaza.

## Šta konkretno treba za ATT/App Privacy odluku

1. Pregledati finalnu IPA: embedded manifesti i njihov privacy report, Info.plist, resolved SDK verzije, signing i entitlements; ne mijenjati SDK deklaracije radi uklanjanja upozorenja.
2. Na fizičkom iPhoneu provjeriti consent accept/reject/reopen, stvarne identifikatore i mrežne zahtjeve, regionalne poruke i relevantne Google ad-serving postavke. Nepostojeći ATT grant ne znači da nijedan drugi identifikator nije obrađen.
3. Za cilj bez ATT trackinga dokumentovati stvarnu konfiguraciju i dokaze. Ako treba native izmjena first-party-ID kontrole, claimati odvojeni kod/task i testirati; JS stub nije rješenje. Isključenje jednog ključa samo nije kompletan privacy audit.
4. Ako se odluči za stvarni ATT tracking, prvo dogovoriti odgovarajući ATT tok i tekst, pa fizički provjeriti grant/deny prije tracking zahtjeva.
5. App Privacy pripremiti iz **stvarnih** kategorija/svrha/linked/tracking nalaza. GMA/UMP manifest kategorije su ulaz za provjeru, ne gotova tabela checkboxova. Lokalni zdravstveni profil se ne šalje kao ads targeting; tehnički ads podaci ipak postoje. Ne koristiti Data not collected.

## Postojeći IPA i mrežna blokada

EAS IPA3 **734be437-bd03-4453-a125-3d019062c03c**, FINISHED, ads-test-store, source **bfc71733de64d8f7f30fb3831b6b19af64bfc1a7**. Pokušaj artifact downloada nije uspio (prvi curl22; završni probe curl56, proxy CONNECT403 uz finalni HTTP kod000). Nema lokalnog IPA SHA256 ni pregleda konačnog paketa u ovoj sesiji. Prethodno je potvrđena artifact ruta expo.dev → api.expo.dev → wf-artifacts.eascdn.net; ta mrežna blokada nije dokaz neispravnog builda. Potrebna je ovlaštena lokalna dostava IPA ili odgovarajući environment network grant, bez dijeljenja tokena/potpisanih URL-ova u Git-u.

Prvi paket audit može se uraditi na IPA3 radi SDK dokaza, ali on neće potvrditi novije UI/source promjene. Fizički QA novog kandidata mora odgovarati njegovom tačnom sourceu/build broju.

## Brojevi, kvota i signing — aktuelno17.11.

- iOS EAS historija: samo0.23.0 build1,2,3, svi FINISHED. Najviši3; **4 je kandidat**, ne potvrđen slobodan ASC broj ili rezervacija.
- EAS submissions: samo build1 i2, posljednji3.11.2026. Build3 nema EAS submission. Ne isključuje eventualni manualni ASC upload koji nije pregledan; ASC inventar provjerava ovlašteni operator prije novog slanja.
- Free iOS kvota **3/15**, ostaje12; overage/estimated total0. Ponovo provjeriti prije novog builda.
- Postojeći APP_STORE distribution certifikat i active provisioning profil imaju expiration **3.11.2027.09:10UTC**. Metadata nije samostalna provjera da certifikat nije opozvan kod Applea; postojeći signer bez novih ključeva.
- Nema novog builda niti potrebe da se sada troši kvota. Ne koristiti update:ios za build-only jer uključuje submission.

## Kandidat source i preostale vanjske postavke

- iOS test/live izbor još nije potvrđen. Postojanje ads-live i Android live odobrenje nisu iOS odobrenje.
- PR2 ima UI korekciju **850fce3fdaa2a12760c8508bf50c077dee624d21**. GitHub2 head/merge ref i čist trial merge prethodno potvrđeni. Nije automatski mergean; potrebno dogovoreno uključivanje, eventualne native/config izmjene i novi zamrznuti zajednički source. Pin1d33430 ne sadrži nova dugmad.
- Ahmedov AdMob handoff navodi pogrešan LifeSpinner UMP privacy URL na FiftyFifty, za iOS i Android. Ispraviti samo LifeSpinner dodjele na https://random-life-preview.pages.dev/privacy.html uz očuvane FiftyFifty URL-ove. Nije mijenjano ovom sesijom.
- iOS store povezivanje/readiness/crawl otvoreni. Mogu ograničavati live serving; ne treba ih predstavljati kao završene zato što je Android crawler verifikovan. Javna App Store listing dostupnost i test-build priprema su različite faze.
- RIGHTS-001 i fizički iPhone QA/video ostaju otvoreni prije završne App Store predaje.

## Low-phosphorus sadržaj — korisnikov novi pravni upit

Read-only javni snapshot17.11:147EAT, **17 trenutno kvalifikovanih low-phosphate recepata**, svi17 imaju evidenceUrl; **11 imaju phosphorusMgPerServing**,6 nemaju broj mg već opisnu oznaku izvora. Izvori: kidney.org8, Kidney Care UK4, DaVita2, Kidney Fund2, Kidney Nutrition Institute1. To nije nezavisna laboratorijska provjera ili provjera svake namirnice. Sve licence/klinička procjena u strukturiranom inventaru su označene not_verified, ne illegal.

Aktuelni hard filter traži sva tri uslova: dietaryTags uključuje low-phosphate, suitability=low i reviewed=true. Nije oslabljen. Nađen je konkretan jezički problem za item191538a0-ab4f-4f5c-a002-47a1594aac81: BHS napomena uz jogurt sadrži nepovezanu frazu “za hljeb je vrijednost procijenjena”. Treba ponovo pregledati oba jezika i izvor/porciju; nije izvršena produkcijska ispravka.

**Predloženi tekst za budući pregled, nije unesen u aplikaciju:**

> **Filter za ograničen unos fosfora**
> Izbor se oslanja na podatke i oznake navedenih izvora. Nutritivne vrijednosti, kada su dostupne, odnose se na navedenu porciju. Stvarna količina fosfora zavisi od proizvoda, aditiva, pripreme i porcije. Individualnu prikladnost provjerite s dijetetičarom ili ljekarom.

ENG prijedlog za isti budući pregled:

> **Filter for limiting phosphorus intake**
> Selection uses data and classifications from the cited sources. Nutrient values, where available, refer to the stated serving. Actual phosphorus content depends on products, additives, preparation and serving size. Check individual suitability with a dietitian or clinician.

Ovaj tekst ne dodjeljuje licencu za preuzete tekstove ili slike i ne garantuje pravnu zaštitu. Za stvarno smanjenje copyright rizika:

1. Po itemu/jeziku dokazati izvor, preuzeta polja i konkretnu dozvolu/licencu za ads aplikaciju; atribucija nije zamjena za dozvolu, a nedostajući source nije originalnost.
2. Za nezaštićene činjenice i vlastite samostalne doprinose jasno dokumentovati porijeklo. Provjeriti i prava baze/pravila korištenja izvora. Izbjegavati preuzimanje tuđeg kreativnog teksta, fotografija/logoa ili privid institucionalnog odobrenja. Samo sinonimsko prepisivanje nije automatsko pravno rješenje.
3. Gdje nema dovoljne osnove, pripremiti konkretan prijedlog nezavisnog originalnog sadržaja, traženja besplatne dozvole ili povlačenja sporne stavke. Ne mijenjati/brisati produkciju bez reviewable prijedloga i odobrenja.
4. Nutritivnu/kliničku provjeru voditi odvojeno od copyrighta: porcije, proizvodi/aditivi, vrijednosti i dokaz oznake. Namirnice koje obično sadrže manje fosfora same ne potvrđuju cijeli recept niti individualnu prikladnost.

Nije završen audit pravnih uslova navedenih pet organizacija ili svih147 recepata. Nema potvrde da su postojeći recepti nelegalni niti izjave da je aplikacija očišćena od svih copyright rizika.
