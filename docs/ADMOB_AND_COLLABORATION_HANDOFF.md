# LifeSpinner — kompletna predaja za Ahmeda i drugi Codex

**Datum: 11.11.2026. | Opseg: saradnja + AdMob za Android I iOS.**

Ovo je izvršivo uputstvo za nastavak na drugom accountu. Dokument nije tvrdnja da su oglasi već gotovi, buildani ili objavljeni. Word kopija: `docs/ADMOB_AND_COLLABORATION_HANDOFF.docx`. Markdown je uređivi izvor; nakon izmjena uskladiti Word kopiju.

## 1. Cilj i granice

Dovršiti native AdMob interstitial za obje aplikacije, iz jednog zajedničkog sourcea, uz zasebne identifikatore, saglasnosti i rezultate builda/testiranja. Korisnik je izričito proširio raniji Android-only plan na **Android i iOS**. Već poslani iOS build 0.23.0 (2) ne mijenja se retroaktivno; potreban je novi build.

- Budžet je **0 dodatnih troškova**: ne kupovati licence, AI/API kredite, paid planove ili simulatore. Prije EAS builda provjeriti raspoloživu kvotu. Ne pokretati naplativu radnju/upgrade bez novog odobrenja.
- Bez oglasa na webu, bez bannera, rewarded modela, billing-a, obavezne registracije ili promjene baze radi oglasa.
- Nema automatskog mergea, force pusha, produkcijskog deploya ili store submissiona bez odgovarajućeg odobrenja. `npm run update:ios` uključuje auto-submit; nije samo test.
- Korisnik želi iPhone portrait, ne deklarisanu iPad aplikaciju. Preference su lokalne i promjenjive; nema serverskog korisničkog računa. Ne ukidati uređivanje, favorite, historiju ili prehrambene hard filtere.
- Generičkih 15 slika ostaje. Ne vraćati TMDB postere/tuđe omote; tekstualno porijeklo/licence i dalje su zaseban zadatak prije monetizacije.

## 2. Šta je stvarno dostupno na GitHubu

Repo: https://github.com/salemko72/RANDOM-life

| Grana / source | Namjena | Stanje |
|---|---|---|
| `main` | Nova zajednička stabilna osnova: posljednji predati generički artwork source i saradnički dokumenti | Bez AdMob WIP koda. Tačan head uvijek provjeriti fetchom; dokumenti se još mogu dopunjavati. |
| `codex/salem-admob-handoff` | **Postojeći Android-first WIP** za nastavak | Puni source SHA **`d4d0a6a150baa71591a2c427223aea69e8bcf17d`**. Nije spreman za javno izdanje. |
| `codex/salem-collaboration-setup` | Radna grana za početne saradničke dokumente | Nije druga aplikacijska verzija; dokumentacijski diff. |
| `codex/generic-artwork-v1` | Provjerena prethodna source referenca | **`d54e69f6a24a327b526f21936681818164c9d1e8`**, 291 test; source osnova novog maina. |

Ne raditi na starim Android granama. `android-play-test-ready` je arhiviran tagom i obrisan. Stari `android-expo-windows` je arhiviran; dok GitHub još koristi njega kao default ne može se obrisati. Vlasnik u **Settings → General → Default branch** postavlja `main`, zatim operator provjerava i briše preostalu staru granu. Ne tvrditi da je default promijenjen dok GitHub to ne potvrdi. Arhivski tagovi čuvaju historiju, ne služe za novi rad.

Važno: stari default i aktuelni source imali su odvojene historije. Nova main nastaje iz aktuelnog sourcea, bez spajanja starog Android snapshot-a. Ne birati `--allow-unrelated-histories` kao rutinsko rješenje.

## 3. Ko šta radi

| Odgovorni | Posao |
|---|---|
| Ahmed | Vlasnik postojećeg AdMob računa/prihoda i Google Play konzole; provjere računa, Android listing i test track. |
| Salem | Apple developer/ASC operator; Apple izjave, signing pristup i fizički iPhone/video po potrebi. |
| Drugi Codex uz Ahmeda | Preuzima ADS-001, pregleda WIP, dovršava obje platforme, radi testove i priprema PR/build handoff. Ne pretpostavlja pristup tuđem chatu ili credentials. |
| Release koordinator kojeg korisnik potvrdi | Zamrzava jedan source SHA, usklađuje verzije, evidentira Android/iOS artefakte i odobrenja. |

GitHub collaborator pristup ne daje automatski Cloudflare, Expo/EAS, Apple ili AdMob pristup. Ne dijeliti vlasnikove lozinke. Ako Ahmed nema EAS/signing pristup postojećem projektu, ovlašteni operator pokreće build; ne praviti novi Expo projekt, bundle ID ili signing identitet.

## 4. GitHub i Codex povezivanje

1. Vlasnik šalje poziv preko repo Settings → Collaborators → Add people, na saradnikov GitHub username/email. Ako traži Confirm access, vlasnik potvrđuje sebe preko svog emaila/GitHub Mobile; taj kod se ne šalje Codexu.
2. Saradnik prihvata poziv na svom GitHub računu.
3. Na svom ChatGPT/Codex accountu povezuje GitHub i dopušta isti repo. Samo vidjeti javni repo nije dokaz write prava.
4. U postojećem checkoutu prvo provjeriti lokalni rad. Ne klonirati preko njega, ne resetovati i ne stashovati tuđi rad.
5. Ako nema checkouta, klonirati `--branch main`, jer promjena GitHub defaulta možda još nije završena.

```sh
git clone --branch main https://github.com/salemko72/RANDOM-life.git
cd RANDOM-life
git status --short
git fetch origin --prune 'refs/heads/*:refs/remotes/origin/*'
```

Ne kopirati origin URL u zapisnik ako sadrži credentials. Neki cloud checkouti fetchuju samo HEAD; zato je naveden izričit refspec za sve branch reference.

## 5. Obavezni tok saradnje

Prije svakog rada pročitati redom:

1. `AGENTS.md`.
2. `collaboration/STATUS.md` i `collaboration/TASKS.md`.
3. `collaboration/README.md` i `DECISIONS.md`.
4. Zadnju odgovarajuću sesiju i `docs/RELEASE_HANDOFF.md`.
5. Ovaj vodič i tačan source WIP-a.

TASKS je dogovor, **nije atomski lock**. Provjeriti taskove u drugim granama i PR-ovima; drugi account ne dobija automatski chat obavijest. Za iste fajlove prvo dogovoriti vlasništvo. Svaki Codex ima svoju granu i sesijski fajl `YYYY-MM-DD-ime-NN.md`.

### Preuzimanje ADS-001 bez miješanja sa mainom

U čistom checkoutu, nakon čitanja pravila:

```sh
git switch -c codex/ahmed-admob-finish origin/main
```

Prije cherry-picka/koda upisati claim ADS-001 u TASKS: odgovorni, grana, `claimed`/`in_progress`, file scope, kriteriji i zavisnosti. Commit i push claima. Ponovo fetch i provjeriti je li neko drugi preuzeo isti scope.

Zatim prenijeti **samo** postojeći WIP code commit:

```sh
git cherry-pick d4d0a6a150baa71591a2c427223aea69e8bcf17d
git diff --stat origin/main...HEAD
```

Ako se pojavi konflikt, pregledati konkretne fajlove i dogovoriti preklapanje. Ne prihvatati kompletan ours/theirs i ne vraćati stare source grane preko novog maina. Ako je WIP već prihvaćen u main u međuvremenu, ne cherry-pickati duplikat: provjeriti ancestry/diff.

Predaja: commit + push + PR prema mainu, sa punim testiranim SHA i zasebnim sesijskim zapisom. Ako API ne radi, objaviti granu i PR body/compare link uz status `blocked_pr`; ne tvrditi da PR već postoji. Review i merge radi ovlašteni vlasnik nakon odobrenja.

## 6. Trenutni WIP: šta postoji, šta ne

WIP source `d4d0a6a150baa71591a2c427223aea69e8bcf17d`:

- Pinned `react-native-google-mobile-ads` **17.4.0**; postojeći Expo **57.0.31** / React Native **0.86.3**.
- Pure policy/controller, persistentni lokalni brojači, strogo ograničene native bridge poruke bez profila/zdravstvenih podataka.
- Android runtime sa UMP prije inicijalizacije/zahtjeva, jednim preloaded interstitialom, NPA zahtjevom i konzervativnim ad ratingom. To nije potvrda da SDK ne prikuplja podatke.
- Android-only plugin sa App ID-em i delayed measurement; testne jedinice podrazumijevane, poseban live profil.
- Profilni link za ad privacy choices postoji kada je native ads capability uključen.
- **300 testova / 42 fajla i root/client TypeScript prolaze** na predatom WIP sourceu, s postojećim instaliranim dependencies. Nema potvrđenog signed APK/AAB/IPA s ovim kodom i nema fizičkog SDK QA.

**iOS NIJE integrisan:** osnovni `ads-runtime.ts` je no-op, autolink config namjerno isključuje iOS, App i capability flag su Android-only, plugin je samo za Android. To je najvažniji nedovršeni dio, ne gotova multiplatform integracija.

Relevantne datoteke:

- `apps/client/App.tsx` — lifecycle, bridge i runtime enablement.
- `apps/client/src/native/ads-policy.ts`, `ads-controller.ts` — limiti i prikaz na prirodnoj pauzi.
- `ads-runtime.android.ts`, `ads-runtime.ts` — platform integration; iOS treba dovršiti.
- `apps/client/plugins/with-android-admob.cjs`, `react-native.config.js` — trenutna Android-only konfiguracija.
- `apps/client/app.json`, `eas.json`, `package.json`, root `package-lock.json`.
- `src/native/preview-assets.ts`, `src/web/ads-bridge.ts`, `WebExperience.tsx` — capability i UI događaji.
- `tests/ads-policy.test.ts`, `tests/ads-controller.test.ts`.

Pregledati kod, ne pretpostaviti da prolazak unit testova potvrđuje consent/ATT, SDK lifecycle ili store prihvatljivost.

## 7. Javni ID-ovi i postojeći projekti

| Platforma | App ID | Interstitial ad unit |
|---|---|---|
| Android | `ca-app-pub-8395430021391101~6926064985` | `ca-app-pub-8395430021391101/6024046858` |
| iOS | `ca-app-pub-8395430021391101~6486035105` | `ca-app-pub-8395430021391101/6733447119` |

App ID ima `~`, unit ima `/`; nisu zamjenjivi. Navedeni ID-ovi su javni, nisu passwordi. Za testiranje koristiti Google test unit za odgovarajuću platformu ili pravilno registrovane test uređaje. Nikad motivisati testere da klikaju stvarne oglase.

- Bundle/package obje aplikacije: `com.salemko.randomlife`.
- Expo project: `04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a` (postojeći projekt).
- Apple Team: `MNQY6SH96C`; App Store Connect app: `6830084481`.
- Web: https://random-life-preview.pages.dev/ ; produkcijski backend `services/artwork`.

Ahmed je potvrdio da su regionalne UMP poruke objavljene. Ponovo provjeriti da su vezane za **obje ispravne AdMob aplikacije** i da ih stvarni SDK dobija. Potvrda objave poruke nije uređajski test.

## 8. Redoslijed tehničkog dovršavanja

### A. Pregled i zajednička arhitektura

- Zadržati jedan zajednički eligibility/persistence/controller kod; Android/iOS adaptere odvojiti samo gdje API to zahtijeva.
- Ukloniti Android-only iOS autolink blokadu kada iOS SDK/config budu pravilno spremni. Napraviti stvarni iOS adapter ili zajednički native adapter; noop ne smije ostati aktivni iOS runtime.
- Povezati oba App ID-a kroz odgovarajući Expo/config plugin; provjeriti stvarni generisani AndroidManifest i iOS Info.plist/pod konfiguraciju, ne samo app.json.
- Omogućiti native bridge/capability na obje platforme; web ostaje bez ad SDK-a i oglasa.
- Sačuvati postojeće ikone, bundle/package, lokalnu pohranu, Android Back i iOS zoom popravku. Za naredni iOS build postaviti i provjeriti iPhone-only/portrait odluku.

### B. Consent i privatnost u aplikaciji

- Ažurirati UMP informacije pri odgovarajućem pokretanju i pokazati obavezni obrazac; ne inicijalizovati/tražiti oglase prije dozvoljenog stanja.
- UMP greška, odbijanje, offline ili no-fill ne blokiraju osnovnu aplikaciju i ne stvaraju beskonačni retry/loader.
- Omogućiti kasniju promjenu privacy izbora kada je potrebna. Poslije promjene odbaciti stare učitane oglase i uskladiti buduće zahtjeve.
- UMP i Apple ATT su odvojeni. Provjeriti stvarni tracking/IDFA tok i namjeravanu konfiguraciju. ATT nije automatski obavezan samo zbog oglasa, ali se ne smije preskočiti ako postoji tracking koji ga zahtijeva. Odbijanje ne blokira aplikaciju.
- NPA/personalization disabled ne znači da nema prikupljanja podataka. Apple/Google izjave popuniti prema stvarnom SDK-u i podešenju.
- Ne slati ime, alergije, intolerancije, low-phosphate preference ili local learning događaje Googleu kao targeting/custom data.
- Publiku i under-age flags potvrditi s vlasnikom. Appleova dobna ocjena 13+ nije potvrda stvarne dobi korisnika ni opća GDPR saglasnost.

### C. Učestalost i prirodna pauza

Početni režim za testiranje: šest uspješnih spinova prije mogućeg oglasa; najmanje dvije minute aktivnog korištenja prije prvog, tri minute razmaka i najviše tri prikaza u 30 minuta. Ovo je početna konfiguracija za provjeru, ne garantovano optimalna monetizacija.

Brojati samo stvarno završene spinove s rezultatom. Oglas pokazivati tek pri korisnikovom povratku iz rezultata na wheel, nikada između klika Spin i očekivanog rezultata, tokom vrtnje, čitanja recepta, profila ili starta aplikacije. Ako u toj prilici nije spreman, nastaviti odmah — ne pokazati ga zakašnjelo iz loaded/consent/network callbacka. Provjeriti duple poruke, brzo klikanje, novo spinovanje tokom persistence-a, background/resume, zatvaranje/restart i istek učitanog oglasa.

### D. app-ads.txt i web stranice

- Od Ahmeda uzeti **tačan red iz AdMob uputstva** za publisher, bez passworda/tokena. Publisher iz dostavljenih ID-ova je `pub-8395430021391101`; ne izmišljati druge dijelove izjave ili tvrditi da je crawler potvrdio fajl.
- Postaviti obični tekst na korijen developer domena: `/app-ads.txt`, javni HTTP 200 i odgovarajući tekstualni sadržaj, bez login-a ili SPA HTML fallbacka.
- Povezati developer website s Google Play listingom i odgovarajući Marketing URL u Apple listingu. Putanja `/get-app` može biti landing, ali app-ads.txt je na **korijenu hosta**.
- Provjeriti AdMob app/readiness/verification status. Crawler može kasniti; postojeći fajl sam nije dokaz verifikacije.
- Dopuniti privatnost za Android/iOS oglase, actual SDK podatke, svrhe/servise i kontrole saglasnosti. Ne prepraviti staru ad-free verziju kao da je oduvijek imala reklame; objasniti platformu/verziju/opseg.
- Provjeriti da Support URL zaista radi i vodi na korisnu podršku. Ne slati nepostojeći predloženi URL.
- Web deploy samo nakon konkretnog odobrenja. Stage skripta briše output: sačuvati postojeće downloads i bindinge, provjeriti hashove. Ne objaviti privatne backupe.

## 9. Obaveze u konzolama

### Ahmed — AdMob i Google Play

- Ispravne Android/iOS aplikacije i store povezivanje u postojećem AdMob računu; status naloga, potrebne provjere, privacy poruke za obje aplikacije i oglasne kategorije/publika.
- Google Play: Contains ads → Yes za izdanje s oglasima; Data safety prema SDK-u, dostupna politika privatnosti, Target audience/content rating i Advertising ID izjava prema generisanom manifestu i stvarnom ponašanju.
- Ne kopirati staru tvrdnju "Data not collected" u novu ads verziju. Ne tražiti lokaciju samo za oglase.
- Test track/produkciono pravo i AAB: koristiti pravi package i signing postojećeg projekta. GitHub invitation nije Play ovlaštenje.

### Salem — Apple / App Store Connect

- App Privacy ažurirati za novi SDK; provjeriti tracking/ATT, relevantne manifest/required-reason/API i SKAdNetwork zahtjeve prema odabranom SDK-u.
- Sljedeći iPhone build i novi stvarni screenshotovi moraju odgovarati sourceu i imati ispravnu device-family deklaraciju. Ne koristiti stari build 2 za predstavljanje oglasa.
- Guideline 2.1: fizički video od otvaranja na najnovijem javnom iOS-u, tipičan tok, svrha/publika, upute bez account login-a, stvarni vanjski servisi, regionalne razlike i dokaz prava gdje je potreban.
- Ne tvrditi da je Apple već odobrio aplikaciju. Zadnje poznato stanje je zahtjev za dodatnim informacijama.

Banka, porezni podaci, privatni signing ključevi i 2FA se uređuju samo u službenim konzolama; ne ulaze u Git/ovaj dokument/chat.

## 10. Provjere prije builda i matrica na uređajima

Node 24 LTS; dependencies instalirati zaključano kada je potrebno. Postojeća source provjera:

```sh
npm ci
npm test
npm run typecheck
npm run build:preview
node scripts/smoke-generic-artwork.mjs
node scripts/smoke-immediate-fixes.mjs
```

U cloud okruženju ne instalirati ponovo ako su dependencies već spremne. Browser smoke nije zamjena za native SDK test. Provjeriti Expo dependency compatibility i export/prebuild za obje platforme, pa generated manifest/Info.plist/autolink. Poznati stari smoke-d1 ima zastarjela očekivanja; ne proglašavati ga zelenim bez provjere.

| Scenarij | Android fizički | iPhone fizički | Kriterij |
|---|---|---|---|
| Prvi start i consent | obavezno | obavezno | UI se otvara, poruka odgovara regiji; bez nedozvoljenog ad requesta |
| Odbijanje/izmjena privacy izbora | obavezno | obavezno | app radi; budući oglasi usklađeni, stari preload odbačen |
| ATT, ako je primjenjiv | nije primjenjivo | obavezno | ispravan redoslijed i ponašanje za allow/deny |
| 6 spinova, aktivno vrijeme, cooldown/cap | obavezno | obavezno | samo uspješni spinovi i prirodna pauza; restart ne zaobilazi limite |
| Brzo klikanje/new spin pri prikazu | obavezno | obavezno | bez preklapanja, duplog spina ili zakašnjelog oglasa |
| Background, resume, zatvaranje oglasa | obavezno | obavezno | isto stanje sadržaja, aktivna navigacija, nema blokade |
| Offline, no-fill, consent/SDK greška | obavezno | obavezno | nema čekanja na oglas; lokalni katalog radi |
| Back / tastatura / zoom | Back obavezno | tastatura/zoom obavezno | postojeće popravke nisu regresirale |
| Generičke slike i prehrambeni filteri | obavezno | obavezno | svi prikazi/offline bez starih omota; alergeni se ne popuštaju |
| Performanse/startup/memorija | i sporiji uređaj | podržani iPhone | zabilježeno stanje s oglasa/bez, bez izmišljenog benchmarka |

Unit testovi trenutno ne dokazuju sve ove redove. Svaki rezultat zapisati s uređajem/OS-om/verzijom/buildom, bez ličnih podataka testera.

## 11. Izdanje bez miješanja sourcea

1. Nakon reviewa dogovoriti prihvaćene promjene i zamrznuti **jedan čist source SHA** koji sadrži obje platforme. Dovršiti potrebne verzijske izmjene prije zamrzavanja; ne mijenjati source između platformskih buildova i zvati ih istim izdanjem.
2. Provjeriti remote EAS/Play/ASC brojeve. WIP Android versionCode 9 i iOS buildNumber 2 su samo vrijednosti u fajlu; nisu potvrđeni novi artefakti i iOS broj mora porasti bez kolizije.
3. U testnim profilima podrazumijevati Google testne oglase. Posebno eksplicitno live izdanje tek nakon potvrđenih prava, consent-a, konzola i QA. Ne oslanjati se na `__DEV__`: release test AAB takođe mora biti siguran.
4. Android: APK za internu provjeru i AAB za Play, oba s testnim oglasima u ovoj fazi; upisati stvarni EAS build ID, source SHA, verziju/code, putanju/URL i checksum.
5. iOS: novi TestFlight build s testnim oglasima, ispravnim targetom i consent-om. Signing koristi postojeći tim/projekt; Apple/EAS prijavu radi ovlašteni operator, kod ne ide u chat.
6. **Upozorenje:** `npm run update:ios` u postojećem sourceu automatski povećava build i uključuje submit. Ne pokretati ga ako odobrenje pokriva samo lokalnu pripremu ili build bez slanja. Provjeriti skriptu i odabrati odgovarajući build-only tok.
7. Ne pokretati produkcijski Play/Apple submission ili web deploy samo zato što je build završen. Pripremiti konkretne artefakte i handoff; završnu radnju izvršiti samo u odobrenom opsegu.
8. `docs/RELEASE_HANDOFF.md` i sesija dobijaju posebne rezultate za Android/iOS: isti source SHA, različiti build ID-i, provedeni/neprovedeni testovi i pravi status u trgovini.

### Predloženi build profili i komande za drugi Codex

Ova imena su **zahtjev za dovršavanje konfiguracije**, nisu tvrdnja da već postoje u WIP-u:

- `ads-test-apk`: internal Android APK, testni oglasi.
- `ads-test-store`: store build za Android AAB i iOS TestFlight, testni oglasi.
- `ads-live`: store build s pravim jedinicama za obje platforme, samo za posebno odobreno izdanje.

U svim testnim profilima eksplicitno postaviti test mode i provjeriti ga u minificiranom release buildu, ne samo u devu. Potvrditi prije komandi da profili postoje, version/build brojevi su unaprijed usklađeni, source je commitovan/čist i kvota/odobrenje pokrivaju build.

```sh
cd apps/client
npx eas-cli whoami
npx eas-cli build --platform android --profile ads-test-apk
npx eas-cli build --platform android --profile ads-test-store
npx eas-cli build --platform ios --profile ads-test-store
```

Ove komande su za **build**, bez `--auto-submit`. Signing/login može tražiti ovlaštenog operatora i 2FA na službenom ekranu. Za odobreno slanje koristiti konkretni build ID, ne naslijepo `--latest`:

```sh
npx eas-cli submit --platform ios --id VERIFIED_IOS_BUILD_ID --profile testflight
```

`VERIFIED_IOS_BUILD_ID` zamijeniti stvarnim provjerenim ID-em; ova komanda traži posebno odobrenje koje pokriva slanje. Za Android Ahmed ručno učitava konkretni AAB u dogovoreni Play test track ili koristi ranije posebno podešen ovlašteni EAS Submit tok. Ne postoji univerzalna automatska Play predaja samo zato što EAS može napraviti AAB.

## 12. Kriteriji dovršenosti ADS-001

- Source i PR su na GitHubu; main nije pomiješan s nedovršenim kodom.
- Oba native SDK-a stvarno rade; iOS nije no-op i nije isključen autolinkom.
- Testni oglasi i test/prod zaštita provjereni za release test buildove obje platforme.
- Consent/privacy choices i ATT odluka dokumentovani i testirani; aplikacija radi pri odbijanju/grešci/offline.
- Nema zdravstvenog targetinga; prehrambeni filteri i lokalne preference očuvani.
- app-ads.txt, developer website i platformsku privatnost provjerio operator; status crawla nije izmišljen.
- Google Play/Apple izjave odgovaraju stvarnoj konfiguraciji, ne starom buildu.
- Pripremljeni Android i iOS testni artefakti iz istog zaključanog sourcea, s fizičkim QA dokazima. Ako neko ovlaštenje/kvota nedostaje, jasno navesti blokadu umjesto izmišljanja builda.
- Release predaja razlikuje implementirano/testirano/buildano/poslano/odobreno/objavljeno. Bez automatskog mergea ili produkcijske objave.

## 13. Nalog koji korisnik može zalijepiti drugom Codexu

> Preuzmi LifeSpinner zadatak ADS-001 i pomozi Ahmedu dovršiti AdMob za ANDROID I iOS. Prvo pročitaj AGENTS.md, collaboration/STATUS.md, TASKS.md, DECISIONS.md i docs/ADMOB_AND_COLLABORATION_HANDOFF.md na main grani. Provjeri lokalne izmjene i sve remote claimove/PR-ove. Otvori vlastitu codex/ahmed-admob-finish granu iz maina i objavi claim prije implementacije. Postojeći Android-first WIP je commit d4d0a6a150baa71591a2c427223aea69e8bcf17d na codex/salem-admob-handoff; pregledaj ga i prenesi samo taj code commit ako već nije integrisan. iOS je tamo no-op/autolink isključen i mora se dovršiti. Koristi zajednički native controller, posebne ID-ove po platformi, testne oglase, UMP i ispravnu ATT odluku. Ne šalji zdravstvene preference SDK-u. Dovrši app-ads/privatnost/store checklist s Ahmedom i Salemom. Pripremi testni APK/AAB i TestFlight iz istog čistog source SHA uz postojeće ovlaštenje i besplatnu kvotu; ako pristup ili odobrenje nedostaju, predaj konkretnu blokadu. Nema novih plaćenih servisa, automatskog mergea, force pusha, produkcijskog deploya ili store submissiona bez odgovarajućeg naloga. Sve rezultate predaj u repo kroz svoju sesiju, puni SHA, push i PR prema mainu. Ne pretpostavljaj da vidiš druge chatove.

## Reference za provjeru aktuelnih servisnih zahtjeva

- Google Android privacy: https://developers.google.com/admob/android/privacy
- Google iOS privacy: https://developers.google.com/admob/ios/privacy
- Play SDK disclosure: https://developers.google.com/admob/android/privacy/play-data-disclosure
- Apple SDK disclosure: https://developers.google.com/admob/ios/privacy/app-store-data-disclosure
- SDK Expo integration: https://docs.page/invertase/react-native-google-mobile-ads
- app-ads.txt: https://support.google.com/admob/answer/9363762
- Apple App Review: https://developer.apple.com/app-store/review/guidelines/

Ovo su reference za operatorovu provjeru; aktuelne stranice nisu sve dostupne iz ovog cloud okruženja. Dokument nije dokaz potpisane licence niti garancija prihvatanja od strane trgovine.
