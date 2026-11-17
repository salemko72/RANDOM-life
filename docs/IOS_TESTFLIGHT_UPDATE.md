# Zajednička predaja 1.0.1 — iOS4 / Android kandidat11

**Zamrznuti aplikacijski source: `ded4bf65474d88e129afb391ff40ea492727f68d`.** Grana `codex/salem-ios-testflight-update`. Ovo zamjenjuje stare0.23.0/1d3343 build upute samo za novi UI kandidat. Android10 postojeći AAB ostaje historijski artefakt, ne novi1.0.1 kandidat.

## Šta je uključeno

- Onboarding CSS850fce3: veći primarni tekst; dva sekundarna izbora kao svjetlija dugmad.
- Spin321b946: rail Spin again sa rezultata ostaje u kategoriji prikazanog itema (BOOK→READ uključeno), uz postojeće hard filtere, seen cycle, personalizaciju i ads tok. Home spin ostaje opći.
- Verzija1.0.1 prema korisniku; iOS build4 potvrđen korisnikom nakon ASC screenshot-a. Android versionCode11 je kandidat koji Ahmed provjerava.
- iPhone-only/portrait i postojeći AdMob source. TestFlight profil nasljeđuje literal test ads; Android live AAB može koristiti ads-live iz istog sourcea.

## ZIP za GitHub/Ahmeda

[Preuzmi patch ZIP](../downloads/LIFE-SPINNER-1.0.1-build4-KOREKCIJE.zip),43573bytes, SHA256 `0fd179a3d89abd3b9318b0fc381509d027851b6e87a50248af7cc9b82fd28149`. Sadrži4 potpuna izmijenjena source/test fajla u originalnim putanjama, KOREKCIJE.patch prema bazi15bbcca, PROCITAJ.txt i PAKET.json s pinom i hashovima. ZIP nije kompletan clone niti APK/AAB/IPA. Source je već pushan; nema potrebe za ponovnim ručnim uploadom istih fajlova na GitHub. Koristiti tačan pin i review/PR, bez tihog mijenjanja ili automatskog mergea.

## Ahmedov Codex — Android

1. Prvo AGENTS/STATUS/TASKS i vlastiti claim. Ne prepisivati tuđe grane/fajlove; ne pretpostavljati automatsku obavijest iz Salemovog chata.
2. Fetch `codex/salem-ios-testflight-update`, zatim pripremiti čistu vlastitu build kopiju baš sourcea `ded4bf65474d88e129afb391ff40ea492727f68d`. ZIP/patch je alternativa; nakon njegovog primjenjivanja nastaje drugi SHA i treba ga ponovo uskladiti za obje platforme, pa je poželjniji postojeći pin.
3. Provjeriti Play App Bundle Explorer, sve draftove/trackove i EAS inventar da je Android11 slobodan; kvotu prije builda. Ako nije, zaustaviti i dogovoriti novi zajednički pin, ne mijenjati samo Android izvor bez zapisa.
4. Provjeriti postojeći upload signer koji odgovara code10/code9. Ne kreirati/rotirati keystore. Očekivani ranije potvrđeni SHA256 `67768f6f56b3d542ab700b91e3e2dce6f0682c4798fa908927d53593cde6ed6e`.
5. Iz apps/client: AAB1.0.1/code11, profil **ads-live** za prave oglase; prije pokretanja provjeriti config/ID i literal live u release JS. QA APK po potrebi **ads-test-apk**, testni oglasi, uz zasebnu provjeru besplatne kvote. Nema plaćenog upgradea.
6. Predati tačan source SHA, build ID/link, stvarni AAB/APK hash/veličinu, finalni versionCode/versionName/manifest/signature/SDK i rezultate QA. Fizički provjeriti oba UI popravka i ads consent/odbijanje/promjenu izbora/no-fill/background.
7. **Nema Play upload/submission/objave, main/PR mergea ili web deploya** ovim build nalogom. Ne graditi iz stare0.23.0 kopije ili starog Mac updater foldera01 ako pin nije ovaj.

## iOS priprema i status

- Projekt @salemko/random; bundle com.salemko.randomlife; ASC app6830084481; postojeći team MNQY6SH96C.
- Svježi EAS inventar samo0.23.0/1,2,3; ASC screenshot samo1,2. Korisnik izričito potvrdio4 i zatim1.0.1.
- Svježa Free kvota: iOS3/15, ukupno6/30, overage0. Postojeći APP_STORE cert/profil aktivan, expiration3.11.2027.09:10:33UTC; postojeći ASC APP_MANAGER submit ključ dostupan. Nisu kreirani/rotirani ključevi.
- Clean detached worktree tačnog sourcea; nema tuđih untracked fajlova u build arhivi. Lokalno korištene zavisnosti iz ranijeg npm ci sa identičnim package-lock hashom i Expo57.0.32; nije ponovljen novi npm ci za ove tekst/CSS/config izmjene. Cloud build instalira iz locka.
- TestFlight: `eas build --platform ios --profile testflight --freeze-credentials --non-interactive --no-wait --json` iz **apps/client**, bez auto-submit. Nakon native uspjeha ide provjera broja/sourcea i zasebni `eas submit --platform ios --id BUILD_ID --profile testflight --non-interactive`. Korisnikov nalog pokriva TestFlight, ne App Store review ili javno izdanje.
- **EAS build pokrenut:** d42fa459-d386-42fb-a29f-646bc0efbad2, status IN_PROGRESS,1.0.1(4), testflight/STORE, server potvrđuje gitCommitHash ded4bf65474d88e129afb391ff40ea492727f68d. [Build](https://expo.dev/accounts/salemko/projects/random/builds/d42fa459-d386-42fb-a29f-646bc0efbad2). Native završetak/IPA/TestFlight processing još nisu potvrđeni; rezultat dopisati, ne zaključivati iz source broja.

## Izvršene provjere i granice

328testova/43fajla i TypeScript PASS, preview PASS; iOS Metro/Hermes export PASS. ENG/BHS mobilni browser regression svih5kategorija/repeat/3neviđena izbora/wrap/promjena kategorije i Home general PASS. Patch provjeren forward primjenom na tačnu bazu i byte poređenjem svih4fajla sa ZIP sourceom; ZIP CRC/manifest SHA PASS.

Introspection potvrđuje1.0.1(4), iPhone-only, portrait/upside-down, GMA AppID i delayed measurement. Dodatna ad-hoc ATS provjera nije prošla: generisani postojeći config ima NSAllowsArbitraryLoads=true, kao dio postojećeg native/plugin toka; nije mijenjan ovim UI nalogom. To nije regressionski test Spin popravke niti zatvoren network/privacy audit. Pod/Xcode build i finalni IPA ostaju posebna provjera.

RIGHTS/ATT finalni audit ostaje otvoren. Ovaj build služi fizičkom QA/video toku, nije potvrda licence, odsustva trackinga ili App Store spremnosti.17recipe rewrite draft nije primijenjen na bazu; source/backups i dalje nose postojeće recepte. Nema promjene Cloudflare politike/baze/weba niti Google Play slanja.
