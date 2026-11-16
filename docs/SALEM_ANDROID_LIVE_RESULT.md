# Salem — Android live AAB: preflight16.11.2026.

## Trenutni status: čeka današnji Play inventar

Predaja [SALEM_ANDROID_LIVE_BUILD](SALEM_ANDROID_LIVE_BUILD.md) zahtijeva: “Provjeri i Play brojeve kroz ovlaštenog operatora” i ako uslov nije potvrđen, “vrati tačnu blokadu”. Zadnji repo dokaz Play inventara9/7/6/5 je od13.11.2026. Današnja potvrda je zatražena od korisnika; screenshot aktivnog Expo članstva nije Play provjera. **Novi remote build nije pokrenut**, nema novog AAB-a, troška ili slanja trgovinama.

## Potvrđeno ovim izvršavanjem

- Vlasnik pristupa: salemko-2, Owner organizacije salemko. whoami i project:info potvrđuju postojeći @salemko/random, projectID04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a.
- Expo screenshot pokazuje ahmochera u Members, Developer. Stari pogrešni email invitation je odvojeni pending Viewer poziv; nije mijenjan.
- Pinned build source: **1d334308483d9064fb853aa106ec3a9e49b8046e**, čist izdvojeni checkout /tmp/lifespinner-android-live-20261116. Dokumentacioni claim je odvojen od build sourcea.
- Profil ads-live, version0.23.0/code10, paket com.salemko.randomlife, NPA uključen. Nema source/config/lock izmjena.
- Današnja EAS Android historija nema code10; najnoviji su code9 testni APK/AAB. Nema postojećeg live builda na ovom sourceu u pregledanom inventaru.
- Free kvota: ukupno5/30, Android2/15, iOS3/15; ostaje13 Android buildova. Overage0, estimated total0. Ponovo provjeriti neposredno prije remote builda ako se čeka duže.
- Default signer metadata SHA256 **67768f6f56b3d542ab700b91e3e2dce6f0682c4798fa908927d53593cde6ed6e** podudara se s prihvaćenim code9 potpisom iz predaje. Privatni keystore/lozinke nisu preuzimani ni ispisivani; nema novih ključeva.

## Ponovljene lokalne provjere pinovanog sourcea

- npm ci --ignore-scripts iz zaključanog lockfilea: PASS. Postinstall preview korak zasebno izvršen kroz build:preview: PASS.
- npm test: **328 PASS /43 fajla**.
- npm run typecheck: PASS root i client.
- Android Metro release export, EXPO_PUBLIC_LIFESPINNER_ADS_MODE=live i --no-bytecode: PASS.
- Export provjere: literal mode:live, tačan Android unit ca-app-pub-8395430021391101/6024046858, NPA:true, nema runtime env lookupa, version0.23.0/code10 i eksplicitni live profil: PASS.
- Export JS: **1154204 bajta**, SHA256 **6fa52a11bfce628ef80f972afb9592c29ab49866c56fcf3e00dc6f78fe320451** — jednak Ahmedovom prijavljenom exportu. Ovo je JS dokaz, ne AAB checksum.
- Čist git status build checkouta potvrđen nakon ovih provjera. Izvorni checkout untracked korisničke datoteke sačuvane.

## Nastavak bez dupliranja

1. Ovlašteni Play operator potvrđuje današnji App Bundle Explorer i sve draftove: da je10 slobodan. Ako nije, ne mijenjati broj/source samostalno; dogovoriti novi SHA s Ahmedovim Codexom.
2. Ponovo provjeriti EAS inventar zbog mogućeg paralelnog builda nakon obnove Ahmedovog članstva, te kvotu.
3. Iz čistog pinovanog checkouta/apps/client pokrenuti samo Android ads-live uz postojeći signer, --freeze-credentials i bez auto-submit. Jedan build, pratiti isti ID.
4. Preuzeti AAB, provjeriti source/profile/verziju/finalni manifest/potpis/live dokaz i stvarni SHA256, predati fajl i EAS build stranicu. Ako CDN download ostane blokiran, ne izmišljati checksum ili lokalni artefakt.

## Repo i komunikacija

Grana codex/salem-android-live-build. Claim objavljen prije izvršavanja preflighta. Ahmed zadržava aplikacijski scope. GitHub API provjera PR1 i dalje vraća403; direktno otvoren PR nije potvrđen. Git fetch/push rade. [Compare samo dokumentacionih dopuna](https://github.com/salemko72/RANDOM-life/compare/codex/ahmed-admob-finish...codex/salem-android-live-build?expand=1) nije PR niti automatska chat obavijest.

Bez Play upload/submission/rollouta, iOS builda, mergea ili web deploya. Fizički QA, prava na tekstove i finalna store spremnost ostaju zasebni od build-only naloga.
