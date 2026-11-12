# AdMob Android i iOS implementacija za pregled

Stanje 12.11.2026. Implementacijski source: `e1228ed725d63a56e280e00d3c840ab5890311b6`, grana `codex/ahmed-admob-finish`, osnova main `2c98dea77951048e00649e8f72cb7e0a848c1bf2`. Ovo je source predaja za review i pripremu testnih izdanja. ADS-001 nije završen: nema novih potpisanih APK/AAB/IPA artefakata niti fizičkog SDK QA.

## Implementirano ponašanje

Android i iOS sada biraju zajednički native runtime i controller; iOS više nije no-op niti isključen autolink konfiguracijom. Web runtime ostaje no-op i web release paket ne uključuje native GMA modul. Jedan Expo plugin iz zaključane biblioteke postavlja oba App ID-a, Android classic backend, odgođenu measurement inicijalizaciju i Google SKAdNetwork identifikator. Ne uvodimo mediation partnere.

UMP osvježava informacije pri pokretanju runtimea i dopušta inicijalizaciju/zahtjeve samo ako canRequestAds to dopušta. Izričita promjena privacy izbora odmah odbacuje stari preload. Neuspjeh/odbijanje ne blokira katalog; ponovni pokušaj ograničen je na kasniji lifecycle događaj nakon najmanje 60 sekundi, bez retry petlje. Load, consent i mrežni callback nikada ne prikazuju oglas. Zadržan je link Privatnost oglasa na obje native platforme.

Broje se završeni spinovi s rezultatom. Prilika za prikaz postoji samo pri povratku s običnog rezultata na točak: šest spinova, dvije aktivne minute prije prvog oglasa, tri minute razmaka, najviše tri u 30 minuta. Brojači se čuvaju prije prikaza; novi spin, interakcija, background ili promjena dokumenta poništavaju priliku koja čeka pohranu. Nečitljiva pohrana isključuje oglase u toj sesiji i ne prepisuje postojeće limite nulama. Preload ističe nakon 55 minuta. Brisanje profila nije prilika za oglas niti briše zasebne limite oglasa.

Bridge dopušta samo event/seq/type; nema profilnih, zdravstvenih, lokacijskih ili custom targeting podataka. Svaki interstitial zahtjev ima requestNonPersonalizedAdsOnly:true. Ahmed je 12.11. potvrdio namjeravanu publiku **16+**, pa aplikacija nije označena kao child-directed. Ne pretpostavljamo stvarnu dob korisnika i ne postavljamo globalno tagForUnderAgeOfConsent:false na osnovu store ocjene.

## Važna privatnost i ATT ograničenja

Ovo izdanje ne poziva ATT authorization API, ne dodaje NSUserTrackingUsageDescription i namjerava koristiti nepersonalizovane oglase bez namjernog IDFA trackinga. To nije dokaz da SDK ne prikuplja podatke ili da su sve Apple izjave već potvrđene. UMP i ATT su odvojene odluke. Prije live izdanja Salem treba potvrditi da AdMob iOS poruka ne pokreće IDFA/ATT tok i provjeriti stvarni SDK/network/privacy-manifest nalaz. Ako željena konfiguracija uključuje tracking za koji je ATT obavezan, ovaj kandidat ostaje blokiran dok se ne doda i testira odgovarajući ATT tok.

Pregled zaključane biblioteke 17.4.0 otkrio je da validator ne prenosi publisherPrivacyPersonalizationState native SDK-u, a setPublisherFirstPartyIdEnabled je JS stub bez native efekta. Ne koristimo te opcije kao dokaz privatnosti. Stvarni NPA request put postoji u Android classic i iOS native kodu biblioteke. Nije dokazano isključivanje publisher first-party ID-a. Store izjave moraju obuhvatiti stvarne SDK podatke; stara tvrdnja Data not collected nije prikladna za novo ads izdanje.

Zaključani native SDK izbor biblioteke: Android Google Mobile Ads 25.5.0 / UMP 4.0.0; iOS GMA 13.10.0 / UMP 3.1.0. Definitivne resolved native dependency verzije potvrditi u stvarnom Gradle/Pod build rezultatu. Aktuelna Google iOS disclosure stranica opisuje noviji 13.12.0, pa nije sama po sebi audit zaključanog 13.10.0.

Reference za operatora:

- [UMP iOS](https://developers.google.com/admob/ios/privacy)
- [iOS privacy strategije](https://developers.google.com/admob/ios/privacy/strategies)
- [Android SDK disclosure](https://developers.google.com/admob/android/privacy/play-data-disclosure)
- [iOS SDK disclosure](https://developers.google.com/admob/ios/privacy/data-disclosure)
- [Apple privatnost i tracking](https://developer.apple.com/app-store/user-privacy-and-data-use/)

## Konfiguracija i build profili

Postojeći package/bundle, Expo project, Apple team i ikone su očuvani. iOS sada ima supportsTablet:false i portrait; Expo device-family plugin daje [1]. Source buildNumber je kandidat 3, Android versionCode kandidat 9, version 0.23.0. Ti brojevi nisu provjereni prema EAS/Play/ASC i moraju se uskladiti prije zamrzavanja sourcea za build. Stari iOS build 2 nije izmijenjen.

Expo i expo-asset su patch ažurirani na 57.0.32 / 57.0.21 prema expo install --check; lockfile bilježi pripadajuće dependency promjene. GMA ostaje 17.4.0. Node ove sesije je 24.16.0; EAS profili zadržavaju postojeći 24.19.0.

| Profil | Namjena | Oglasi |
|---|---|---|
| ads-test-apk | Android internal APK | Google test |
| ads-test-store | Android store AAB / iOS device store build | Google test |
| ads-live | Zasebno odobreno store izdanje | Platformski live unit |

Preview, production i testflight također ostaju testni. Release JS export za Android i iOS potvrđuje literal mode:"test" bez oslanjanja na __DEV__. ads-live je samo konfiguracija; nije odobrenje za live build ili submission.

## Izvršene provjere

Dependencies instalirane preko npm ci --ignore-scripts s task-local cacheom; preview postinstall korak izvršen je zasebno kroz build:preview. Nakon patch dependency promjene npm install je ažurirao lock. Nije ponovljen drugi hermetički npm ci poslije tog ažuriranja.

| Provjera | Rezultat i granice |
|---|---|
| npm test | **328 PASS / 43 fajla**, uključujući SDK adaptere, consent/privacy greške, odgođenu pohranu, expiry i lifecycle |
| npm run typecheck | PASS root i client |
| npm run build:preview | PASS |
| expo install --check | PASS nakon patch ažuriranja |
| Expo export all, test mode | PASS Android/iOS/web; i minificirani JS export bez bytecodea za pregled test moda |
| check-ads-release-output.mjs | PASS literal test mode i NPA put u oba native JS paketa; native GMA modul nije u web paketu; staged publisher/header/contact |
| Android prebuild --no-install | PASS izolovani checkout; stvarni manifest/Gradle pregledani; nije Gradle compile niti konačni merged release manifest |
| iOS config introspection | PASS oba App ID/measurement/SKAdNetwork/portrait parametra; device-family [1] je Expo plugin rezultat |
| Native autolink Android/iOS | PASS, uključujući iOS podspec i configuration script fazu |
| check-ads-native-config.mjs | PASS generisani/config/autolink/profile/publisher rezultati |
| smoke-generic-artwork.mjs | PASS film/serija/knjiga offline; nema starih image requestova |
| smoke-immediate-fixes.mjs | PASS EN/BHS Back, busy lock, uređivanje/draft i share landing |
| smoke-ads-bridge.mjs | PASS web bez oglasa; native capability, uspješan spin, prirodna pauza, privacy, brisanje profila bez home prilike; nema profilnog payload-a |
| Lokalni Pages staging | PASS; nastao u prethodno nepostojećem preview-site, bez deploya |

Prvi sandbox pokušaji test/builda nisu prošli zbog pristupa nadređenom direktoriju; uspješni su ponovljeni iz ovlaštenog lokalnog procesa. Prvi typecheck prije generisanja preview.json nije prošao; završni je prošao nakon builda. Windows izričito preskače iOS native prebuild: Xcode projekt, Pod install, linker i stvarni target family tek treba potvrditi na macOS/EAS-u. Browser test nije native SDK dokaz.

## Web i app-ads status

Ahmed je dostavio tačan javni red:

```text
google.com, pub-8395430021391101, DIRECT, f08c47fec0942fa0
```

Source je u apps/client/public/app-ads.txt; stage kopira na korijen i dodaje Content-Type:text/plain. Dodana je korisna bilingual support.html stranica s postojećim javnim kontaktom i proširena privacy.html politika koja razlikuje raniji ad-free iOS build 2, web i nova native ads izdanja.

Javna provjera 12.11. prije bilo kakvog deploya:

| Putanja | Zatečeno stanje |
|---|---|
| /privacy.html | HTTP 200, postojeća stara politika |
| /support.html | HTTP 200, text/html, 370 znakova, fallback bez support kontakta |
| /app-ads.txt | HTTP 200, text/html, isti fallback, nema publisher reda |
| /get-app | HTTP 200, postojeća landing stranica |

Ispravke postoje samo u sourceu/stagingu. Nema tvrdnje da je live problem riješen, da su store developer/Marketing URL-ovi promijenjeni ili da je AdMob crawler verifikovao aplikacije. Prije odobrenog Pages deploya operator mora sačuvati postojeći kompletan /downloads i bindinge; lokalno generisani staging nije potpuna kopija postojećih javnih download fajlova. Ne deployati ga direktno preko produkcije bez tog koraka.

## Preostali release uslovi

1. Review PR-a i potvrda ko koordinira release; bez automatskog mergea.
2. Expo CLI whoami vraća **Not logged in**. Ovlašteni operator treba svoj pristup postojećem salemko projektu, signing i besplatnu kvotu; ne praviti novi projekt. Nije pokrenut EAS build niti update:ios.
3. Provjeriti remote verzije, napraviti potreban version commit i zamrznuti isti čisti SHA za obje platforme. Potom izabrati build-only komande iz handoffa. Store/TestFlight upload nije automatski odobren time što je build pripremljen.
4. APK, AAB i iOS device/TF kandidat: zapisati stvarne EAS ID-eve, checksumove, verzije i fizičku QA matricu. Svi su za sada **nije napravljeno / nije testirano na uređaju**.
5. Fizički QA obuhvata UMP regionalne poruke za oba App ID-a, deny/change/error/offline/no-fill, ATT odluku, frequency cap/restart, background/close/new spin, Android Back, iPhone zoom/tastaturu, generičke slike i hard dietary filtere. Upisati uređaj/OS/build; nemamo izmišljene rezultate ili benchmarke.
6. Ahmed: 16+ publika (Play dobne grupe uskladiti), Contains ads, Data safety, Advertising ID prema konačnom merged manifestu, app readiness/store linking i UMP poruke obje aplikacije. Konačni ads SDK manifest može dodati AD_ID iako ga app-level prebuild manifest ne prikazuje.
7. Salem: stvarni Pod/privacy manifest/required-reason API i ATT audit, App Privacy, novi screenshots i Apple Guideline 2.1 fizički video. Appleovo odobrenje nije potvrđeno.
8. Posebno odobren web deploy potrebnih statičkih ispravki uz očuvane downloads/bindinge; nakon toga provjeriti javni text/plain sadržaj, podršku, store URL-ove i AdMob readiness/crawl.
9. RIGHTS-001 ostaje otvoren za porijeklo tekstova/podataka; zamjena 15 slika nije dokaz svih licenci. PREF-001 nije označen završenim. IOS-001 konfiguracijski dio je ovdje pripremljen, fizički dio ostaje otvoren.

## Reprodukcija lokalnih provjera

Iz repo roota: npm ci, npm run build:preview, npm test, npm run typecheck. Za Windows browser provjere postaviti LIFESPINNER_BROWSER_EXECUTABLE na stvarni chrome.exe i LIFESPINNER_QA_DIR na lokalni screenshot direktorij. Zatim pokrenuti tri smoke skripte navedene u tabeli.

Native pomoćne skripte očekuju lokalni .native-check: izolovanu kopiju clienta s Android prebuildom, introspect.json iz expo config --type introspect --json i autolink-ios.json/autolink-android.json iz expo-modules-autolinking react-native-config. check-ads-release-output.mjs dodatno očekuje export-test-js iz expo export --platform all --no-bytecode uz EXPO_PUBLIC_LIFESPINNER_ADS_MODE=test i lokalni preview-site. To nisu potpisani build artefakti. Ne pokretati stage skriptu preko postojećeg preview-site bez čuvanja downloads.
