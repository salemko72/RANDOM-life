# LifeSpinner — release handoff

## Privacy/Data safety najnoviji nastavak

**OBJAVLJENO13.11.:** previewf16ac453-a96c-42b9-b635-5d039993bfe9 i production**75f058a1-a191-4edd-a416-868c6e39332b** prošli provjere uz izričito korisničko odobrenje. Nova privacy/support/app-ads stvarno javni,235starih statičkih hash referenci i56downloadova očuvani; novi manifest241assets. Backend source neizmijenjen/rebuilt, config fingerprint isti, katalog467 i auth401 PASS. Rollback referenca7f9ee8fc-8f34-4330-bc3b-46783ecc4bbe. [Release dokaz](reviews/privacy-web-release-2026-11-13.json), [sesija06](../collaboration/sessions/2026-11-13-ahmed-admob-06.md); ranije blokade ispod su historijske. Data safety sačuvan, nema Google Play submissiona/rollouta, native builda ili mergea.

**13.11.:** Pages pristup radi nakon logout/login.236/236canonical statičkih fajlova (uključujući56downloadova) backupovano i hashirano. Kompletni privacy kandidat čuva235postojećih fajlova i mijenja samo politiku, uz dodatne support/app-ads/alias putanje; backend source isti, worker ponovo sastavljen. Preview deploy je odbijen automatskom approval provjerom prije izvršenja; čeka izričito odobrenje. Nema novog deploy ID-a. [Dokaz i ograničenja](PRIVACY_DATA_SAFETY_RELEASE.md), [sesija05](../collaboration/sessions/2026-11-13-ahmed-admob-05.md).

[PRIVACY-REL-001 audit](PRIVACY_DATA_SAFETY_RELEASE.md): nova ENG/BHS politika i statički patch spremni, Data safety završni Save potvrđen kao neposlana promjena. Publishing overview ima6promjena, uključujući odvojene country/track izmjene; Submit nije pritisnut. Javna politika još nije objavljena: Cloudflare prijava s odobrenim Pages scopeom vidi samo Ahmedov račun bez projekata, i nakon korisnikovog retry zahtjeva. Treba pristup stvarnom random-life-preview, potpuni aktuelni asset/download/binding inventar i očuvanje prije deploya. Nema novog native builda, DB promjena, mergea ili store objave.

## Najnovija Android Play priprema 12.11.2026.

**Posljednja Play provjera:** korisnik je pauzirao prethodne testne trackove; osvježeni Preview internog release2 više nema AD_ID error. Samo deobfuscation warning ostaje, Save and publish enabled. Nije pritisnut; poruka izričito najavljuje neposrednu objavu nakon tog koraka. Ostale obaveze nisu time riješene. Ovo zamjenjuje navode AD_ID blokade u ranijim odlomcima.

**Nastavak nakon dostave AAB-a:** postojeći build665b90e5 preuzet je preko korisnika, lokalno provjeren (SHA256 `af4a755d6c9c8a72834522b8fc22f0f8067c79980f1e0a6243b13c70886c620d`, jarsigner/bundletool PASS, signer jednak APK-u). Play je prihvatio AAB0.23.0/code9 i sačuvan je interni draft release2. Code9 je sada zauzet. Nema objave/slanja na review. Preview blokira AD_ID greška jednog aktivnog artefakta; novi AAB dozvolu ima, a stariji aktivni codes5/7 traže pregled. Nije korišten Release without permission. AAB download blokada u ranijim odlomcima je razriješena; puna QA, Data safety, web i RIGHTS-001 ostaju otvoreni. Detalji i byte-identičan JS/HTML u [readiness nastavku](ANDROID_PLAY_READINESS.md#dostavljeni-aab-i-spremljeni-interni-nacrt).

[APK audit i Play readiness](ANDROID_PLAY_READINESS.md) sada evidentiraju preuzeti APK0.23.0/code9, SHA256/validanpotpis/finalni manifest i GMA25.5.0/UMP4.0.0. Korisnik potvrđuje pojavu oglasa i regionalnu privacy-options poruku; ostali fizički scenariji su otvoreni. Salemova remote grana `codex/salem-ads-release-check` dokumentuje tri završena builda na `bfc71733de64d8f7f30fb3831b6b19af64bfc1a7`. Nisu pokrenuti duplikati.

Play access i potpuni inventar3/3 (codes5,6,7) provjereni su direktno; code9 nije zauzet u tom trenutku. Pripremljene su neposlane promjene Containsads/AdvertisingID/tačan privacyURL i Data safety radni draft. Nema review submissiona ili rollouta. AAB i match upload-certifikata još su blokirani preuzimanjem/pristupom; nema tvrdnje da je APK potpis jednak Play upload ključu. Nema novog web deploya ili potpune fizičke QA. Ranije sekcije ispod su historijske i čitaju se uz ovaj nastavak.

## Nastavak ADS-001 od 12.11.2026.

Najnoviji implementacijski kandidat na `codex/ahmed-admob-finish` je **`e1228ed725d63a56e280e00d3c840ab5890311b6`**; oba native runtimea su pripremljena u sourceu, iOS više nije no-op. **328 testova/43 fajla**, TypeScript, Expo dependency check, release JS exports i browser smoke prolaze. [Kompletan pregled i tačne granice](ADS_001_REVIEW.md) razlikuju Android generated manifest od konačnog merged manifest-a, iOS introspekciju od Xcode/Pod/device builda, i staging od live deploya.

Nema novih potpisanih artefakata: Expo CLI vraća Not logged in, kvota/signing/remote build brojevi nisu potvrđeni. Kandidati Android code9/iOS build3 nisu rezervisani remote brojevi. Nije zamrznut konačni release SHA. Potrebni su signing/build-only tok iz jednog čistog sourcea i zasebni fizički QA; zatim posebno odobrenje za slanje trgovinama. Ahmed je potvrdio publiku16+ i publisher red; app-ads/support/privacy su pripremljeni, ali javne prve dvije putanje još vraćaju HTML fallback. Nema web deploya; prije njega sačuvati stvarne downloads/bindinge. Main, produkcijski backend i stari iOS build2 ostaju neizmijenjeni.

Sljedeći tekst čuva prethodnu predaju od 11.11.; za novi AdMob kandidat čitati prvo gornji pregled.

**Stanje: 11.11.2026. Ovo nije odobrenje za build, deploy, merge ili store submission.** Zajednička stabilna grana je `main`; AdMob ostaje zasebno dok ne bude pregledan. Prije izdanja pročitati [AGENTS](../AGENTS.md), [STATUS](../collaboration/STATUS.md), [TASKS](../collaboration/TASKS.md) i provjeriti šta se u međuvremenu promijenilo.

## 1. Source provenance — ne miješati verziju, source i artefakt

| Predmet | Tačan source / identitet | Stvarno stanje |
|---|---|---|
| Kandidat sa generičkim slikama | **`d54e69f6a24a327b526f21936681818164c9d1e8`**, `codex/generic-artwork-v1` | Commitovan i objavljen source; ponovo testiran na čistom Git arhivu. Nema novog APK/AAB/IPA na ovom SHA potvrđenog ovom predajom. |
| Posljednji web rollout | Pages **`7f9ee8fc-8f34-4330-bc3b-46783ecc4bbe`** | Objavljen 11.11.2026. iz tadašnjeg dirty radnog direktorija prije commita d54. Generički code odgovara d54, ali bundle je uključivao i lokalni neobjavljeni bridge iz AdMob WIP-a. **Ne postoji potvrđen jedan čist Git SHA za identičan kompletan deploy source.** Ne predstavljati d54 kao byte-identičnu provenance cijelog deploya. |
| iOS TestFlight build 2 | **`1e6f8efc1d0e3ccfb0daf4df6e234f8761992683`**, EAS **`a73b11b1-93e0-4af5-b12c-70b77a6a185c`** | Verzija **0.23.0 (2)**; build/submission ranije potvrđeni, fizička instalacija i kasniji Apple upit prijavljeni od korisnika. Nema novih generičkih offline slika ni oglasa. |
| Naredni Android/iOS release | **NIJE ODABRAN** | Nakon reviewa prihvaćenih PR-ova zamrznuti jedan čist source SHA za obje platforme, pa upisati posebne build rezultate. Ne izmišljati artefakt. |

Committed `apps/client/app.json` na d54: version **0.23.0**, Android versionCode **8**, iOS buildNumber **2**, portrait i **supportsTablet: true**. To su source vrijednosti, ne dokaz da je novi build napravljen. Predati AdMob WIP ima Android **9** i SDK izmjene, ali nije u d54 niti u stabilnom mainu. Source: `d4d0a6a150baa71591a2c427223aea69e8bcf17d`, grana `codex/salem-admob-handoff`; 300 testova i TypeScript prolaze, bez potvrđenih novih binarnih artefakata. iOS je u tom WIP-u još no-op. Novi nalog ADS-001 obuhvata obje platforme; vidi [kompletno uputstvo](ADMOB_AND_COLLABORATION_HANDOFF.md).

### Provjerljivi web artefakti

- Produkcija: https://random-life-preview.pages.dev/
- Javni katalog: `/api/catalog`; manifest: `/api/catalog/manifest`.
- `standalone.js` SHA-256: `81b9a4f7d71c02791c3734da00578edee44ef2ca0946eac00824c98c2d142655`.
- `standalone.css` SHA-256: `a7e678bfe47c397debeb2c3928d93091437c2171cff1ffbc21078dc6b7ab4278`.
- Tadašnji live JS/CSS i svih 15 slika poređeni su s testiranim staging datotekama. Provjeri ponovo prije rollbacka/novog deploya.
- Source slika u Git-u: `apps/client/src/web/assets/generic/` (15 WebP, 1024 × 1024, ukupno 1.696.950 bajtova). Lokalni originalni PNG fajlovi iz generation sesije nisu nužni za build i nisu garantovano dostupni drugom accountu.
- Reproducibilan web output: `apps/client/preview-dist/`; staging: `apps/client/preview-site/`; generisani native HTML: `apps/client/src/generated/`. Ti direktoriji se ponovo grade, ne tretiraju kao source.
- Lokalni originalni paket: `/workspace/shared/generic-artwork-v1/LifeSpinner-15-generic-images.zip`; nije garantovan na drugim accountima. Optimized source je u Git-u, pa nijedan naredni korak ne smije zavisiti isključivo od tog lokalnog ZIP-a.
- Privatni before/after snapshoti baze ostaju izvan Git-a i javnog `/downloads`. Drugom operatoru trebaju vlastiti ovlašteni backup i provjera; ne prenositi credentials/privatne podatke kroz PR.

## 2. Implementirano i provjereno

- Pet filmskih, pet serijskih i pet knjiških originalnih generičkih slika. Sesijski izbor ostaje stabilan kroz prikaz iste stavke, s retro kompatibilnim poolom.
- Svih **273 BOOK/WATCH** zapisa u tadašnjoj produkciji prešlo na nove slike. Ukupno ostaje **467**; ostale **194** javne stavke poređene neizmijenjene. Tekst, autori, izvori, tagovi i prehrambene informacije nisu mijenjani artwork migracijom; normalni revision/approval timestampi nisu sadržajni diff.
- Offline reserve više ne uvozi 40 starih BOOK/WATCH slika. Stare instalacije zadržavaju stari instalirani bundle do novog native builda.
- Dijeljene stranice/OG i Studio generički izbor ne vraćaju stare postere/omote. Automatski artwork tok ne poziva TMDB/Open Library.
- Bounded migracija ima editor auth, dry-run, optimističke revizije i audit. Ne pokretati ponovo samo zato što postoji komanda; provjeriti stvarno stanje i odobrenje.

## 3. Tačni rezultati provjera i ograničenja

Ponovljeno za **d54e69f6a24a327b526f21936681818164c9d1e8**, u izdvojenom Git arhivu bez lokalnog AdMob sourcea:

| Komanda | Rezultat |
|---|---|
| `npm run build:preview` | PASS |
| `npm test` | **291 PASS / 40 test fajlova** |
| `npm run typecheck` | PASS, root i client |

Arhivska provjera koristila je postojeći instalirani `node_modules` iz radnog okruženja, ne svježi hermetički `npm ci`. Raniji rollout izvještaj navodi **300 testova**: to je bio mixed working tree s devet lokalnih AdMob testova. Ne prenosi broj 300 kao rezultat čistog d54 sourcea.

Ranije browser provjere na mixed working treeu: `node scripts/smoke-generic-artwork.mjs` (film/serija/knjiga offline, bez starih image requestova), `node scripts/smoke-immediate-fixes.mjs` (EN/BS Back, profile draft, share landing). Rezultati su funkcionalni dokaz te radne verzije, nisu fizički Android/iPhone QA niti byte-identičan novi store build. `scripts/smoke-d1.mjs` ima poznata zastarjela očekivanja; ne tvrditi da prolazi bez nove provjere.

## 4. Deployment / build postupak — samo uz odobrenje

1. Izabrati potvrđenu integration osnovu i prihvaćene PR-ove. Čist checkout, `git status --short`, puni `git rev-parse HEAD`; upisati **isti source SHA** u Android i iOS red prije buildova. Ako se source promijeni između njih, evidentirati različite SHA i ne zvati ih istim izdanjem.
2. Node 24 LTS; `npm ci` samo kada je potrebno. Ponoviti testove, typecheck i relevantan preview/native export. Provjeriti Expo/EAS kompatibilnost i postojeću kvotu; nema odobrenja za plaćenu nadogradnju.
3. **Web:** sačuvati i inventarisati postojeće download fajlove prije `node scripts/stage-preview.mjs` (briše staging); obnoviti ih uz provjeru hashova. Bindinge/tajne provjeriti bez ispisa vrijednosti. Produkcijski worker je `services/artwork`. Ne vraćati stari `services/api` ili stari server branch preko novijeg sourcea.
4. Ovlašteni web deploy cilja postojeći Pages `random-life-preview`, branch `main` na Pages platformi (to **nije** dokaz da postoji Git grana `main`). Poslije upisati deployment ID, source SHA/dirty stanje, hashes, health/catalog/shared-page rezultate i plan rollbacka. Originalni rollout je sačuvao 56 download fajlova; broj se može promijeniti, zato ponovno inventarisati.
5. **Android:** iz potvrđenog sourcea u `apps/client` odabrati EAS APK test ili AAB profil iz `eas.json`; prije builda provjeriti postojeće remote versionCode brojeve. Sačuvati stvarni EAS build ID/URL, verziju/code i checksum artefakta. Ne pretpostavljati da neobjavljeni `play-ads-*` profili postoje na d54.
6. **iOS:** prije narednog izdanja riješiti IOS-001. `npm run update:ios` povećava build broj, radi build i **auto-submit**; nije bezopasna provjera. Pokrenuti ga samo uz odobrenje koje pokriva i slanje Appleu. Upisati source nakon verzijskih izmjena, EAS build/submission ID i stvarni App Store Connect status.
7. Bez automatskog mergea, force pusha, produkcijske migracije ili store objave. Rollback backend deploya nije vraćanje baze; sačuvati novije uredničke zapise i historiju.

## 5. Javna identifikacija i AdMob handoff

- Repo: `salemko72/RANDOM-life`; Expo project `04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a`.
- Bundle/package: `com.salemko.randomlife`; Apple Team `MNQY6SH96C`; ASC app `6830084481`.
- Backend: postojeći D1 `random-test-content`, binding `CONTENT_DB`; privatni R2 `lifespinner-content`, binding `CONTENT_BUCKET`. Ne praviti nove resurse ili mijenjati druge projekte.
- AdMob račun/prihod vodi Ahmed. Javne vrijednosti (nisu credentials):

| Platforma | App ID | Interstitial unit |
|---|---|---|
| Android | `ca-app-pub-8395430021391101~6926064985` | `ca-app-pub-8395430021391101/6024046858` |
| iOS | `ca-app-pub-8395430021391101~6486035105` | `ca-app-pub-8395430021391101/6733447119` |

Ovi ID-ovi ne dokazuju da SDK, consent, app-ads.txt, publika ili store izjave rade. Testni artefakti koriste testne oglase. UMP poruke su potvrđene od korisnika, ali nisu zamjena za test na uređaju. Nema public live-ad releasea potvrđenog ovom predajom.

## 6. Preostale ručne provjere

- Fizički iPhone: prvi start, ime/tastatura/zoom, svih pet rubrika, povratak, skrol, favoriti, share, suspend/resume i cold offline sa novim slikama. Najnoviji javni iOS za Appleov traženi video. Ne koristiti browser screenshot/video kao dokaz fizičkog iPhone testa.
- iPhone-only odluka još nije implementirana: device-family i `supportsTablet` provjeriti na novom sourceu; iPhone compatibility mode na iPadu je odvojen koncept.
- Fizički Android, uključujući sporiji uređaj: Back stack, lifecycle, hard dietary filters i offline. Ako sadrži oglase: UMP/odbijanje/izmjena izbora, background/no-fill, cooldown, povratak iz oglasa i bez zdravstvenog targetinga.
- Porijeklo tekstova/podataka i prava: posebni task RIGHTS-001. Slike su zamijenjene, nema dokaza kupljene komercijalne TMDB licence. Open Library CC0 katalog nije automatska licenca za omote.
- Support URL i privacy page stvarno otvoriti i provjeriti; ne slati samo predloženi URL koji nije postavljen. Store tekstovi/screenshotovi moraju odgovarati konkretnoj poslanoj binarnoj verziji.
- Apple Guideline 2.1 odgovor: fizički video od pokretanja, svrha/publika, upute bez demo login-a (nema serverskog računa), stvarni vanjski servisi, regionalne razlike, dokumentacija prava gdje je primjenjivo. Appleov upit nije dokaz pronađenog crasha ili presuda o autorskim pravima.

## Predložak za naredno izdanje

```text
Release ID / odgovorni / odobrenje:
Source branch / puni čisti SHA:
Android: verzija/code, EAS ID, artefakt/checksum, QA, Play status:
iOS: verzija/build, EAS ID, artefakt/checksum, QA, ASC status:
Web: deployment ID, source SHA, hashes, catalog verzija, provjere:
Privatni backup/rollback referenca (bez tajni i privatnih javnih linkova):
Neizvršene provjere / blokade / odluka go-no-go:
```
