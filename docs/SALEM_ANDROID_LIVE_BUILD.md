# Salemov Codex — Android AAB s pravim oglasnim jedinicama

Ahmed je16.11.2026. izričito zatražio da Salem pokrene ovaj **build-only** tok, jer Ahmedova uspješna Expo prijava `ahmochera` nema READ pristup postojećem projektu. Cilj je jedan novi Android AAB i provjeren artefakt; ovo nije nalog za Play upload/submission/rollout, merge, web deploy, iOS build ili nove resurse/troškove.

## Tačan source i konfiguracija

| Stavka | Vrijednost |
|---|---|
| Repo / grana | salemko72/RANDOM-life / codex/ahmed-admob-finish |
| **Zamrznuti build source** | **`1d334308483d9064fb853aa106ec3a9e49b8046e`** |
| Postojeći Expo projekt | `@salemko/random` |
| EAS project ID | `04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a` |
| Android paket | `com.salemko.randomlife` |
| Verzija / kandidat versionCode | **0.23.0 /10** |
| **Build profil** | **ads-live** (nasljeđuje production, store, app-bundle) |
| Env iz profila | `EXPO_PUBLIC_LIFESPINNER_ADS_MODE=live` |
| Android AdMob App ID | `ca-app-pub-8395430021391101~6926064985` |
| Android interstitial unit | `ca-app-pub-8395430021391101/6024046858` |
| NPA | requestNonPersonalizedAdsOnly=true, ostaje uključen |

Koristi ovaj SHA u čistom, izdvojenom checkoutu; noviji docs head nije zamjena za pinovani source. Ne koristiti stari bfc71733 test source niti profile production/ads-test-store: oni biraju testne oglase. Ne mijenjati app.json, SDK/runtime, lock, iOS broj ili projektni identitet na svoju ruku. Code10 je bio slobodan u Play inventaru13.11. (4/4 verzije9/7/6/5), ali to nije današnja rezervacija broja. Ako je u međuvremenu zauzet u EAS/Play inventaru, vrati nalaz Ahmedovom Codexu radi dogovorene izmjene i novog SHA prije builda.

## Prije pokretanja

1. Pročitaj AGENTS, saradničke STATUS/TASKS/README/DECISIONS, [release handoff](RELEASE_HANDOFF.md) i [Ahmedovu sesiju07](../collaboration/sessions/2026-11-13-ahmed-admob-07.md). Provjeri najnovije claimove/PR1. Preuzmi **samo izvršavanje builda i vlastitu dokumentaciju** kroz svoj claim/branch/session; ne uređuj Ahmedove aplikacijske fajlove. Dokumentacioni claim vodi odvojeno od čistog checkouta pinovanog build SHA.
2. `eas whoami` i `eas project:info` moraju potvrditi pristup **postojećem** projektu. Koristi svoj ovlašteni Expo account; nemoj tražiti/slati lozinke, tokene ili keystore kroz chat. Ne koristiti `eas init` za pravljenje nove aplikacije.
3. Provjeri **aktuelni** `eas account:usage salemko --non-interactive` i `eas build:list --platform android --limit 20 --non-interactive`. Ako treba, proširi read-only inventar. Provjeri i Play brojeve kroz ovlaštenog operatora. Potvrdi da je10 slobodan i da jedan Android build staje u besplatnu kvotu, bez overagea ili plana koji uvodi dodatni trošak. Starih5/30 kvota nije aktuelni dokaz. Ako bilo šta nije potvrđeno, vrati tačnu blokadu; ne pokretati naplativ build ili duplikat već postojećeg live builda.
4. Koristi postojeći Android upload signer koji je prihvaćen za code9. Očekivani certifikat SHA256: `67768f6f56b3d542ab700b91e3e2dce6f0682c4798fa908927d53593cde6ed6e`. Ne kreirati/rotirati keystore. Nema potrebe za Apple credentials.
5. U build checkoutu potvrdi puni HEAD i čist git status. Dependencies iz postojećeg locka; projektni postinstall/build:preview generiše ugrađeni HTML iz sourcea, ne zavisi od Ahmedovih lokalnih ignored fajlova. Za samo ponovno preuzimanje već FINISHED odgovarajućeg builda nije potreban novi build.

Ahmed je na ovom Android code10 kandidatu već izvršio **328testova/43fajla**, root/client TypeScript, build:preview i Android live Metro release export: PASS. Export ima literal mode:live, tačan Android unit, NPA i nema runtime env lookup. Lokalni export SHA256 je `6fa52a11bfce628ef80f972afb9592c29ab49866c56fcf3e00dc6f78fe320451`; platformski buildovi nisu obećani kao byte-identični zbog generisanja/alatnog okruženja. Ponovi potrebne provjere za svoj čist source i dokumentuj stvarne rezultate, bez izmjene koda radi prolaza.

## Pokreni samo Android build

Iz `apps/client` u pinovanom checkoutu, uz potvrđene preflight uslove:

```sh
eas build --platform android --profile ads-live --non-interactive --wait
```

Koristi službeni EAS CLI koji zadovoljava eas.json (Ahmed je koristio27.9.0); komanda ne uključuje auto-submit. Ako se build komanda u tvojem okruženju prekine nakon kreiranja build ID-a, prvo provjeri taj postojeći build preko `eas build:view BUILD_ID`. Prati ga do FINISHED ili stvarne greške; ne pokretati duplikat samo zbog prekida čekanja. U zapisu koristi javnu Expo build stranicu, ne privatni potpisani artifact URL.

## Provjeri završni artefakt

Preuzmi stvarni AAB i zabilježi:

- EAS build ID/status/profil/source SHA; profil ads-live, platform Android, distribution store i stvarna verzija/code moraju odgovarati planu.
- Naziv, veličinu i SHA256 AAB-a; jarsigner verify i certifikat SHA256, uz ispravno tumačenje self-signed/no timestamp upozorenja za Android upload certifikat.
- bundletool validate i dump manifest: paket, verzija0.23.0/code10, min24/target36, pravi Android AppID, AD_ID dozvola, delayed measurement flag i portrait. SDK metadata očekivano GMA25.5.0/UMP4.0.0 ako dependency resolution nije promijenjen; iz dokumentacije ne izmišljati finalni binary nalaz.
- Završni ugrađeni JS/Hermes sadržaj ili mjerodavni build/export dokaz za **live** režim. Samo prisustvo live i test ID stringova u istom bundleu nije dokaz aktivne grane; adapter namjerno sadrži obje. Release export provjera i frozen source/EAS profile moraju biti povezani s istim buildom. Prikupljene preference se i dalje ne šalju SDK-u.

Predaj AAB Ahmedu dostupnim ovlaštenim načinom (predloženi naziv `LifeSpinner-0.23.0-10-live.aab`), uz javnu Expo build stranicu i checksum. Ne stavljati AAB, keystore, raw signing JSON ili tajne u Git, niti ga automatski dodavati javnom web downloads direktoriju. Ako download ili isporuka fajla ne rade, upiši tačnu blokadu i sačuvaj build ID; ne tvrdi da je checksum provjeren bez lokalnih bajtova.

## GitHub predaja i šta ostaje otvoreno

Napiši vlastiti session/release nalaz na svojoj grani i predaj commit+push+PR, s tačnim sourceom/buildID/hashovima/rezultatima i preostalim ograničenjima. Ne dirati Ahmedov PR/source ili main; nemoj ponovo tražiti odobrenje za ovaj već zatraženi build-only tok ako su besplatna kvota i postojeći signing potvrđeni.

Stvarni AdMob account/AppID/unit i objavljena EU poruka su korisnički potvrđeni, a javni privacy/support/app-ads objavljeni su13.11. To nije AdMob Ready ili crawler odobrenje. Manualni test-device unos je odgođen; stvarni oglasi se ne klikaju radi QA, a odgovarajući test režim za kasniji device QA treba odvojeno dogovoriti. RIGHTS-001, puna fizička/consent/lifecycle QA, iOS ATT i konačni store pregled ostaju zasebni. **Nema Play submissiona/rollouta ovim nalogom.**
