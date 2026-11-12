# Android Google Play priprema 12 novembra 2026

Ovaj zapis nastavlja ADS-001 i Salemovu granu `codex/salem-ads-release-check`. Ne mijenja aplikacijski kod niti postojeće buildove. Korisnik je odobrio nastavak pripreme za Google Play; nije izvršeno slanje Googleu, rollout, merge ili web deploy.

## Pregled lokalnog APK artefakta

Korisnik je preuzeo `application-77706c67-6214-45f7-abd9-120d8603036b.apk`, instalirao ga na fizički telefon i sačuvao u svom lokalnom folderu. APK nije dodat u Git. Naziv odgovara EAS APK buildu iz Salemove predaje; EAS provenance/source ostaje dokumentovana tvrdnja iz te predaje, dok su bajtovi, manifest i potpis nezavisno pregledani lokalno.

| Stavka | Provjereni rezultat |
|---|---|
| APK veličina | 91.367.188 bajtova |
| SHA256 | `3b03a1aabd7615158197664cd962c5c5e94f3d91ea20eade90112f9072a6d7fd` |
| Paket | `com.salemko.randomlife` |
| Verzija / versionCode | `0.23.0` / `9` |
| minSdk / targetSdk / compileSdk | 24 / 36 / 36 |
| Native ABI | arm64-v8a, armeabi-v7a, x86, x86_64 |
| APK potpis | apksigner verify PASS, jedan signer, APK Signature Scheme v2 validna |
| Upload signer SHA256 iz APK-a | `67768f6f56b3d542ab700b91e3e2dce6f0682c4798fa908927d53593cde6ed6e` |
| Signer SHA1 iz APK-a | `234da4a077fdf859db10325449af03cc890ae44d` |
| Ključ | RSA 2048 |
| Google Mobile Ads metadata | play-services-ads / ads-api 25.5.0 |
| UMP metadata | user-messaging-platform 4.0.0 |
| Android AdMob App ID | `ca-app-pub-8395430021391101~6926064985` |
| Measurement / load flags | DELAY_APP_MEASUREMENT_INIT i oba OPTIMIZE flaga true u finalnom APK manifestu |
| Orijentacija | MainActivity portrait |

Finalni APK manifest uključuje INTERNET, ACCESS_NETWORK_STATE, VIBRATE, WAKE_LOCK, FOREGROUND_SERVICE, AD_ID, ACCESS_ADSERVICES_AD_ID, ACCESS_ADSERVICES_ATTRIBUTION i ACCESS_ADSERVICES_TOPICS. Uključuje i SYSTEM_ALERT_WINDOW, READ_EXTERNAL_STORAGE/WRITE_EXTERNAL_STORAGE s maxSdkVersion32 i paketnu DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION. Ne traži preciznu lokacijsku dozvolu. Prije live kandidata pregledati potrebu za naslijeđenim storage/overlay dozvolama; sama deklaracija nije dokaz njihove stvarne upotrebe.

Alati su postojeći Android SDK build-tools36.1.0 aapt/apksigner i postojeći Android Studio JBR21. Nisu instalirani novi alati ni mijenjane postavke telefona. adb devices nije pronašao priključen uređaj. Native bundle je Hermes bytecode98; lokalni hermesc s `-b -dump-bytecode` potvrdio je ugrađene ads-runtime/controller/adapter funkcije. Samo prisustvo stringa nije dokaz izvršenog test/live puta; ranija release export provjera i Salemov build profile dokaz ostaju zasebni od fizičke provjere oznake testnog oglasa.

## Korisnikov izvještaj sa fizičkog Androida

Korisnik je izričito potvrdio:

- aplikacija se otvara i normalno radi;
- nakon korištenja pojavio se oglas;
- Profil → Privatnost oglasa prikazuje poruku „Za tvoju regiju nije potreban dodatni obrazac za oglase“.

To je korisnikov izvještaj, ne automatizovani SDK test ili kompletna QA matrica. Model/OS, video/screenshot, tačan broj/vrijeme spinova, test-ad oznaka i testna UMP regija nisu još evidentirani. Nisu potvrđeni accept/reject/change tok u regiji koja traži obrazac, restart/cap/cooldown, background/resume, offline/no-fill, Android Back kroz sve ekrane ili kompletni dietary filteri. Ne tvrditi da odsustvo regionalnog obrasca samo po sebi predstavlja grešku ili punu consent provjeru.

## Direktno provjereno u Play Consoleu

Korišten je postojeći LifeSpinner listing za isti package; drugi projekti nisu mijenjani.

- Dashboard izričito potvrđuje **odobren pristup produkciji**. Production je još inactive; nije kreiran ili objavljen production release.
- All app bundles prikazuje **3 od3** verzije: **7 /0.22.0**, **6 /0.21.1**, **5 /0.21.0**, bez sljedeće stranice. Kandidat9 nije već u tom inventaru u trenutku provjere; ponovo provjeriti neposredno prije uploada.
- Closed testing Alpha služi7; internal testing služi5. Pregled je prije izmjena pokazivao da nema drugih neposlanih promjena.
- Target audience već ima **16–17, 18 and over**; nije mijenjan.
- App signing je uključen. Public digital-asset-links isječak prikazuje Play app-signing fingerprint `75d607eb890572a2d7cd2e7e9c91d43099ec4e87387cd6d52aba43046a57863a`. To je **app-signing**, ne upload certifikat; razlika u odnosu na EAS APK signer nije dokaz neispravnog upload ključa.
- Upload key odjeljak postoji, ali njegov fingerprint nije uspješno preuzet: copy operacija nije vratila tekst kroz browser clipboard alat, a download čekanje je isteklo. Nije resetovan ni promijenjen ključ. **Poklapanje Play upload certifikata i EAS APK/AAB signera još nije potvrđeno.**

## Sačuvane Play promjene bez slanja na pregled

| Deklaracija | Zatečeno | Sačuvana priprema |
|---|---|---|
| Ads | No ads | **Yes, my app contains ads**; neposlana promjena |
| Advertising ID | No | **Yes**; svrhe Analytics, Advertising or marketing, Fraud prevention/security/compliance. Ostavljena uključena provjera AD_ID release grešaka; nema personalisation/account-management svrhe |
| Privacy policy URL | `/legal/privacy.html` | **https://random-life-preview.pages.dev/privacy.html**; neposlana promjena |
| Target audience | 16–17, 18+ | Već ispravno; bez izmjene |
| Data safety | No collection/sharing; not encrypted | Radni nacrt, nije dovršena/poslana deklaracija |

Publishing overview na kraju provjere eksplicitno prikazuje **Changes not yet submitted for review**: dvije promjene (Privacy policy i Ads declaration), dugme Submit2changes nije pritisnuto. Advertising ID se prikazuje pod What you've told us kao ažurirana izjava koja nije objavljena. Managed publishing je već bio off i nije mijenjan. Naknadno slanje može voditi automatskoj objavi nakon odobrenja; zato nema slanja dok kandidat i obavezne provjere nisu usklađeni.

### Data safety radni nacrt

Nacrt je sačuvan pomoću Save draft, a preview je pregledan bez završnog Save/submission koraka. Označeno je prikupljanje/dijeljenje, TLS u prijenosu, bez kreiranja računa i bez prijave kroz vanjski kreirane račune. Opcionalno pitanje o zahtjevu za brisanje nije popunjeno; nije izmišljena mogućnost brisanja Googleovih SDK podataka ili rok od90dana.

Nacrt sadrži Approximate location, Diagnostics, App interactions i Device or other IDs. Za te četiri kategorije pripremljeni su collection+sharing, ne-ephemeral obrada i tri svrhe iz Googleovog SDK disclosurea: advertising, analytics i fraud prevention. Collection je konzervativno označen required jer trenutni UI nema univerzalni prekidač za potpuno isključivanje svih SDK zahtjeva u svim regijama; to treba potvrditi prema stvarnom regionalnom ponašanju prije završne izjave. UMP reject ili NPA ne znače automatski da nijedan podatak neće biti obrađen.

Zdravstvene/prehrambene preference i ime nisu dodani kao SDK collection jer ih bridge ne šalje; ostaju lokalni. Ovo nije tvrdnja da je nacrt konačan za svaku biblioteku ili mogući payload. Prije završnog Save treba provjeriti scope dijagnostike/crash/other-performance podataka, eventualne dodatne servise, required/optional i data-retention/deletion pravila, te objaviti novu odgovarajuću privacy politiku. Stara javna politika još opisuje ad-free aplikaciju.

Osnova nacrta: [Google Mobile Ads25.5.0 disclosure](https://developers.google.com/admob/android/privacy/play-data-disclosure) i [Play Data safety definicije](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en). SDK metadata u ovom APK-u potvrđuje odgovarajući25.5.0. Mapiranje u Play kategorije i konzervativna required postavka su priprema za operatorov pregled, ne nezavisna pravna potvrda.

## Javne web putanje

Ponovljen stvarni HTTP GET:

| Putanja | Stanje prije deploya |
|---|---|
| /privacy.html | HTTP200, text/html,8876 znakova, postojeća prava privacy stranica |
| /legal/privacy.html | HTTP200, text/html,370 znakova SPA fallback, nije politika |
| /support.html | HTTP200, text/html,370 znakova SPA fallback |
| /app-ads.txt | HTTP200, text/html,370 znakova SPA fallback, bez publisher reda |

Privacy URL u Play nacrtu zato je ispravljen na root putanju. Nova ads politika, support i publisher fajl i dalje čekaju odobren deploy uz očuvanje stvarnog produkcijskog downloads inventara i bindinga. Ovaj nalaz nije potvrda AdMob crawler statusa. Nema Cloudflare deploya ili DB promjena.

## AAB preuzimanje — prethodno stanje

Postojeći AAB build ID je `665b90e5-16f0-44aa-8115-823e57403b4f`, source `bfc71733de64d8f7f30fb3831b6b19af64bfc1a7`, prema Salemovoj predaji FINISHED. Nije napravljen novi build. Anonimna EAS stranica store builda kaže da nema internal-distribution builda na tom URL-u; projektna lista kaže da nema dozvole. To ne dokazuje da AAB nedostaje, nego da taj anonimni prikaz nije ovlašten za store artefakt. Korisniku je zatražena Expo prijava s pristupom ili lokalni AAB koji preuzme Salem. Nema traženja/dijeljenja tokena.

Sljedeći spisak opisuje stanje prije korisnikove dostave AAB-a; nastavak ispod ga ažurira:

1. Preuzeti **postojeći** AAB kroz ovlašteni račun, hashirati i provjeriti JAR potpis/finalni manifest. Upload certificate fingerprint iz Play upload-key odjeljka usporediti s AAB certifikatom; ne s Play app-signing ključem.
2. AAB/test profil ostaje kandidat za testni track, ne production s live oglasima. Nema automatskog uploada/rollouta. Za produkcijske live oglase dogovoriti odgovarajući source/profile/versionCode i eventualno novi build tek uz kvotu i potrebu.
3. Dovršiti fizičku Android matricu, zabilježiti model/OS i regionalne consent accept/reject/change dokaze.
4. Dovršiti/odobriti Data safety i sadržajni rating prema stvarnom SDK/katalogu; RIGHTS-001 nije zatvoren.
5. Pripremiti konkretan siguran web deploy paket s aktualnim downloads/bindingima, pa tražiti odobrenje. Tek poslije provjeriti javne putanje i AdMob/store linking/readiness.
6. Pregledati konačni neposlani skup u Publishing overview prije bilo kakvog slanja Googleu. Promjene nisu već objavljene samo zato što su sačuvane.

## Dostavljeni AAB i spremljeni interni nacrt

Korisnik je zatim dostavio postojeći `application-665b90e5-16f0-44aa-8115-823e57403b4f.aab`. Nije rađen novi build. Nezavisni pregled lokalnih bajtova daje:

| Stavka | Rezultat |
|---|---|
| Veličina | 65.894.561 bajt |
| SHA256 | `af4a755d6c9c8a72834522b8fc22f0f8067c79980f1e0a6243b13c70886c620d` |
| JAR potpis | jarsigner: jar verified; SHA256withRSA, RSA2048 |
| Signer SHA256 | `67768f6f56b3d542ab700b91e3e2dce6f0682c4798fa908927d53593cde6ed6e`, identičan APK signeru |
| Bundletool validate | PASS, službeni Google bundletool1.18.3 |
| Paket/verzija | com.salemko.randomlife, 0.23.0/code9, min24/target36/compile36 |
| Finalni manifest | AD_ID i AdServices dozvole prisutne, tačan AdMob App ID, delayed-measurement flag true, portrait |
| SDK metadata | GMA25.5.0 i UMP4.0.0 |

Self-signed/no timestamp upozorenja jarsignera nisu neuspješan potpis Android upload artefakta. Potpis certifikata važi do 2054-03-02. Korišten je postojeći JBR21; službeni bundletool jar preuzet je iz google/bundletool GitHub releasea, uz SHA256 `a099cfa1543f55593bc2ed16a70a7c67fe54b1747bb7301f37fdfd6d91028e29` jednak objavljenom asset digestu. Alat i binarni artefakti nisu u Git-u.

APK i AAB sadrže byte-identičan glavni Hermes JS bundle (1.472.236 bajtova, SHA256 `f61cb3489646e33aea520e666aa65fada640bf086445537e46e77ef7a6c945d2`) i ugrađeni WebView HTML (13.545.802 bajta, SHA256 `cfa14df1f53b039d63af290b3b53e5f83ad0c3d11de8565acac4f043cbbd4bd5`). Ovo nije tvrdnja o fizičkom testiranju Play-generisanog APK-a ili svim native razlikama APK/AAB kontejnera.

Play Console je prihvatio i obradio upload code9 bez greške upload potpisa. Time je potvrđena prihvatljivost konkretnog upload artefakta; zasebno kopiranje fingerprinta iz Play upload-key odjeljka i dalje nije urađeno. Code9 je sada zauzet učitanim AAB-om, više nije slobodan broj.

Sačuvan je **internal testing draft**, release2 na postojećem internom tracku, naziv **0.23.0 (9) - AdMob internal test**. Play je prikazao potvrdu Changes saved. Bilješke izričito kažu Google test ads i traže provjeru navigacije, privacy kontrola i offline preporuka. Prethodni interni code5 nije uključen u novi nacrt. Nije pritisnut Save and publish; nema distribucije testerima ili production rollouta.

Pregled Preview and confirm pokazuje:

- **1 error:** Advertising ID izjava kaže Yes, ali jedan od aktivnih artefakata nema `com.google.android.gms.permission.AD_ID`. Novi code9 tu dozvolu dokazano ima. Stariji aktivni codes5/7 su kandidati za uzrok; konkretan problematični artefakt nije još nezavisno identifikovan. Ne mijenjati istinitu izjavu u No i ne tvrditi da treba rebuild9 zbog nedostajuće dozvole.
- **1 warning:** nije priložen deobfuscation mapping fajl. Ovo je dijagnostičko upozorenje, zasebno od blokirajuće AD_ID greške; ne izmišljati mapping fajl ako R8 nije korišten.
- Save and publish je disabled. Dugme Release without permission nije pritisnuto i release-error provjere nisu isključene.

Sljedeće: pregledati dozvole starijih aktivnih track artefakata i pripremiti njihovu odgovarajuću zamjenu/deaktivaciju prije odobrene distribucije; konačnu odluku uskladiti sa stvarnim trackovima. Dovršiti Data safety, javnu ads privacy/support/app-ads objavu s očuvanim downloads/bindingima, fizičku QA i RIGHTS-001. Ovaj ads-test-store AAB ostaje kandidat za interni test. Production sa stvarnim oglasima zahtijeva eksplicitno odabran live profil, novi nezauzeti versionCode i potrebne provjere/odobrenje. Nema mergea, store-review submissiona, web deploya ili dodatnog EAS troška.
