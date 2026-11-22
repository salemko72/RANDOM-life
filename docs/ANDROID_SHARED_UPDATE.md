# Zajednički LifeSpinner source — Android priprema22.11.2026.

**Jedan zajednički kandidatski source SHA za Android i naredni iOS: `2fa68549d444a309fb4e1dd32b953fe18476a037`.**

Grana `codex/ahmed-android-shared-update`, [draft PR6](https://github.com/salemko72/RANDOM-life/pull/6) prema `codex/salem-content-translations`. Docs head može biti noviji od ovog pina; source se ne bira proizvoljnim HEAD-om. [Strukturirani dokaz](reviews/android-shared-update-2026-11-22.json), [sesija15](../collaboration/sessions/2026-11-22-ahmed-admob-15.md).

| Stanje | Rezultat |
|---|---|
| Implementirano | Najnoviji jezički/kataloški source, iOS recovery s očuvanim novijim bridgeom, Android renderer recovery i portrait feature fix |
| Testirano |392testa/60fajlova, root/client TypeScript, preview, native config, Android JS+Hermes export, lifecycle i browser regresije PASS |
| Buildano | Lokalni preview i Android Metro/Hermes export; **nije novi APK/AAB/IPA** |
| Fizički Android | **Nije proveden**; ponovljeni adb devices -l prazan, korisniku zatraženo povezivanje uređaja |
| Produkcija | Nema mergea, deploya, D1 izmjena, aktivacije novih jezika ili store slanja |

## Izvori i očuvano ponašanje

- Osnova je tačno traženi translation dokumentacijski head **854de3d3e315bdacc326f0caf2a6149ec2efc168**, uključujući content sourceb8fa083/review20bc5d9. Njegovi UI/content/shared podaci nisu zamijenjeni starim build5 paketom.
- Prenesen je aplikacijski recovery commit **9b5f097835cb4d5da44db2d418ce7df4a533492f**. Konflikti App.tsx/preview-assets/testa riješeni spajanjem getter funkcije najnovijeg stanja sa novijim deviceLanguages/buildInfo argumentima. Foreground jezička injekcija ostaje bez reloada zdravog dokumenta.
- Android **onRenderProcessGone** sada koristi isti generation-aware kontroler kao iOS termination. Android callback(API26+) razlikuje sistemsko gašenje/crash kroz anonimni broj failed0/1. Stari callbacks ne mogu prepisivati novo stanje. Background čeka foreground; najviše2automatska pokušaja/minutu, zatim vidljiv ručni retry. OnError ima isti ograničeni failure/manual put. Ovo nije generalni heartbeat watchdog niti fizička potvrda svih uzroka praznog ekrana.
- Recovery uzima najnovije in-memory preference/favorite/historiju/jezik, ne staru AsyncStorage kopiju, te čeka već zaprimljene katalog upise/clear. Cache purge ponovno kopira instalirani HTML. Zastarjeli clear callback poslije smrti dokumenta ne smije upisivati catalog-cache.js zamjenskog dokumenta ili mu poslati ack.
- Native AdMob runtime ostaje jedna instanca sa postojećim frequency/session counters; postojeći consent/NPA/profili i stvarne Android jedinice nisu promijenjeni. AppID `ca-app-pub-8395430021391101~6926064985`, interstitial `ca-app-pub-8395430021391101/6024046858`.
- PR5 code **dacad203fc7e48901a830d55d4483130e1aeec72** uključen: portrait UI ostaje, uses-feature screen.portrait je optional. Native locale plugin ostaje uz njega, nije prepisan.
- Novi onboarding stilovi, rail Spin again prema posljednjem itemu i nakon Home/detalja, centralni opći Home spin, recipe old-online/cache/offline korekcije,100-item rezerva i generičke slike sačuvani su iz novije osnove.
- Automatski/ručni EN/BHS izbor postoji u setup/edit preferencama i meniju. Share diagnostic log i stvarni platformski version/build su na dnu menija; browser bez native metapodataka ne izmišlja broj.

## Jezici: pripremljeno, nije aktivirano

Pročitani [CONTENT_TRANSLATION_HANDOFF](CONTENT_TRANSLATION_HANDOFF.md) i povezane upute.467×4=1868draft record translations i100×4=400offline dodataka su u sourceu; sve nove reviewed oznake ostaju false. Aktivni ready/native locales su **en/bs**. Nema D1 publikacije ni omogućavanja ES/PT-BR/DE/IT u produkcijskom biraču.

Read-only javni manifest22.11. i dalje ima467stavki i version **59a712e7856e411d0d1b11e7c7c681cdb0e4e769522ccdbcd84a502df53eebf8**, jednak translation pinu. To nije zatvaranje activation blokada:

1. Očuvati kompatibilan default feed za stare strict-enum klijente; provjeren versioned/opt-in šestjezični export tek pripremiti prije D1 novih blokova.
2. Uskladiti17recipe wording izmjena kroz ovlašteni Studio prije/zajedno s version incrementom; inače bounded patch može prestati važiti. Ne mijenjati protected nutrition/allergen/quantity polja i ne importovati cijeli source-catalog kao zamjenu.
3. Poslije canonical promjena osvježiti baseline/fingerprint/compile i ponovno provjeriti467/100varijanti bez ponovnog plaćenog prevođenja.
4. Ljudska lingvistička/medicinska provjera, share/parser/server ugovor te UMP/legal/support/store/native startup površine za nove jezike ostaju otvoreni. Postojeća EN/BHS odobrenja nisu lektura novih jezika.

## Izvršene provjere

Zavisnosti su instalirane **npm ci --ignore-scripts** iz postojećeg locka u izolovani checkout; zatim eksplicitni build:preview. Puni suite392/392u60fajlova i root/client TypeScript prolaze. Postojeći full-catalog testovi potvrđuju svih467×4/100×4, protected source/EN/BHS očuvanje, false review flagove, novije uredničke verzije i data budgets. Dietary hard filter/allergen/reserve testovi ostaju uključeni.

`smoke-native-resume.mjs` izvršava stvarni App.tsx sa native boundary doubles za iOS i Android: zdrav foreground bez remounta, foreground jezik, background termination, pending preference writes, katalog queue/cache purge, latest profile/favorite/history/locale/build, stale SDK callbacks, catalog clear/recovery race, crash budget/manual retry, anonimni dijagnostički export i zadržani native ads runtime PASS. Ovo je harness, **nije fizički uređaj**.

ENG/BHS browser provjere: svih5kategorija/repeat/unseen-cycle/Home/detail return; old-online→retained-offline-cache tekstovi; setup/edit/relaunch language320/390; auto/manual/foreground language; menu footer320×568/320/390/430 i browser bez lažnog build broja; ads bridge capability/natural-break/privacy/bounded payloads; generic movie/series/book offline images PASS. Native locale/portrait/AppID introspection i UI inventory362/365 PASS.

Android live release export(913modula) potvrđuje literal mode:live, pravu jedinicu, NPA, odsustvo runtime env lookupa, onRenderProcessGone i novije language/build mostove. JS1,898,768bytes/SHA256 **db9a405df5e6fdd87dbbab9a8c631de21eb68d7214967a6ec57fb3d98d2e399a**. Hermes2,724,093bytes/SHA256 **4505085aeca2bc2398851dbf4351622d60f955629ec74a0d8aa308e9b3f9d967**, parsiran hermesc -b. Nijedan hash ovdje nije APK/AAB hash.

## Prije novog native builda

Konfiguracija nosi **kandidate1.0.1/Android12/iOS7**, jer EAS potvrđuje već korištene11/6. Nema12/7u svježem EAS inventaru, ali **Play sve trackove/draftove i ASC dostupnost nisu potvrđeni**. To nisu rezervisani brojevi. Prije builda obavezno ponoviti store inventar, EAS aktivne/već postojeće buildove i kvotu. Ako postoji kolizija, uskladiti oba broja i novi zajednički pin; ne mijenjati jedan artefakt tiho.

EAS22.11.: postojeći @salemko/random, Free10/30ukupno, Android4/15/iOS6/15, overage0/estimated0. Read-only default Android cert fingerprint **67768f6f56b3d542ab700b91e3e2dce6f0682c4798fa908927d53593cde6ed6e** odgovara code11; nisu čitani privatni key/password ni mijenjani credentials. Za izvršavanje zadržati postojeći signer, --freeze-credentials i postojeći profil: QA APK ads-test-apk(test ads), završni AAB ads-live. Ne pokretati update:ios auto-submit skriptu. Ove provjere ne rezervišu kvotu za buduću sesiju.

## Fizički Android QA — otvorena matrica

Povezati USB debugging uređaj i evidentirati model/OS/WebView verziju i stvarni candidate package/versionCode/source. Novi testni APK prvo zahtijeva gore navedeni preflight; stari instalirani code11 ne može validirati ovaj native recovery patch.

| Scenarij | Provjeriti na novom kandidatu | Status |
|---|---|---|
| Zdrav background/resume |10s,5/15/30min, icon/app switcher, rezultat/detail bez neočekivanog remounta | Nije provedeno |
| Renderer ugašen/crashed | Oporavak tek active, najnoviji podaci, max2automatska pokušaja i ručni retry bez petlje | Nije provedeno |
| Offline | Poslije synca durable cache i cold100-item rezerva, generičke slike i ispravljeni tekstovi | Nije provedeno |
| Podaci/filteri/navigacija | Preference/allergeni/low-phosphate hard filteri/favorite/historija/jezik ostaju nakon resume/recovery/relaunch; Android Back i Home repeat | Nije provedeno |
| AdMob | Consent/reject/reopen/privacy/no-fill, test ad open/close/background/resume, bez iznenadnog oglasa na foreground i bez resetovanja limita; ne klikati live oglase | Nije provedeno |
| Dijagnostika | Native render-gone/foreground/recovery events, stvarni version/build na dnu menija; izvoz bez korisničkog sadržaja | Nije provedeno |

Source je predan na pregled; **release nije označen spremnim za trgovinu** dok fizički QA i relevantni release uslovi nisu zatvoreni. Nema dodatnog troška, automatskog mergea, D1/web deploya ili Google Play slanja ovom sesijom.
