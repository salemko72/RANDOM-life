# Zajednički zadaci

Zapis je dogovor o radu, **nije automatsko zaključavanje**. Prije preuzimanja provjeri najnovije udaljene grane, claim commitove i otvorene PR-ove. Ne preuzimaj tuđi aktivni zadatak bez dogovora. Vidi [postupak](README.md).

## COLLAB-001 — Postaviti saradnju između Codex accounta

- **Odgovorni:** Codex uz Salemov account (`salem-collab`); identitet je oznaka sesije, ne GitHub korisnički račun.
- **Grana:** `codex/salem-collaboration-setup`
- **Status:** `in_progress` — početni claim; objaviti na GitHubu prije pisanja preostalih dokumenata.
- **Opis:** Uspostaviti zajednička pravila, status, backlog, odluke, zasebne sesijske zapise i release handoff.
- **Datoteke:** `AGENTS.md`, `collaboration/README.md`, `collaboration/STATUS.md`, `collaboration/TASKS.md`, `collaboration/DECISIONS.md`, `collaboration/sessions/2026-11-11-salem-collab-01.md`, `docs/RELEASE_HANDOFF.md`, `docs/SECOND_CODEX_START_HERE.md`.
- **Kriteriji prihvatanja:** postojeća pravila ostaju netaknuta; svih deset korisničkih pravila je pokriveno; trenutno stanje razlikuje source/build/deploy; drugi account može nastaviti bez chata; početni PR ima konkretan diff i provjere.
- **Zavisnosti:** potvrđene remote grane; pristup GitHubu; izuzeti postojeći lokalni AdMob rad iz PR-a.
- **Predaja:** claim i kasniji implementacijski SHA/PR upisati u sesijski zapis. Nema odobrenja za merge/deploy.

## COLLAB-002 — Dogovoriti zajedničku integration/default granu

- **Odgovorni:** nije preuzeto; odluka vlasnika repozitorija.
- **Grana:** nije kreirana; koristiti `codex/<ime>-integration-base` nakon dogovora.
- **Status:** `open`.
- **Opis:** Aktuelni source i GitHub default imaju odvojene historije. Odabrati gdje se PR-ovi dugoročno spajaju; ne raditi automatski merge ili zamjenu defaulta.
- **Datoteke:** nakon dogovora `collaboration/STATUS.md`, `collaboration/README.md`, vlastiti sesijski zapis; eventualne GitHub postavke samo uz zasebno odobrenje.
- **Kriteriji prihvatanja:** dokumentovana base grana i source SHA, očuvane stare grane, saradnici mogu otvoriti PR s razumljivim diffom; nikakav neodobren force push.
- **Zavisnosti:** `COLLAB-001`, vlasnik projekta; nije odobreno izvršenje GitHub promjene defaulta.

## RIGHTS-001 — Provjera porijekla tekstova/podataka nakon zamjene slika

- **Odgovorni:** nije preuzeto; drugi Codex može predložiti claim za read-only audit.
- **Grana:** npr. `codex/ahmed-content-provenance` (primjer, nije postojeći claim).
- **Status:** `open`.
- **Opis:** Utvrditi koje činjenice/opisi zavise od TMDB-a i drugih izvora; razdvojiti Open Library CC0 katalog od prava na omote. Ne zaključiti da je zamjena slika riješila sve licence.
- **Datoteke:** vlastiti audit u `docs/reviews/`, `collaboration/DECISIONS.md`, vlastita sesija. Pristup produkciji najprije read-only i uz postojeće ovlaštenje; bez objavljivanja backupâ.
- **Kriteriji prihvatanja:** dokaz po izvoru i kategoriji; odvojeno potvrđeno/nepoznato; konkretan plan bez plaćenih licenci/API-ja; nema automatskog brisanja ili izmišljenih dozvola.
- **Zavisnosti:** D-003, D-004; pristup izvorima/bazi nije isti na svim accountima. Uređivanje sadržaja traži zaseban dogovor o opsegu.

## IOS-001 — iPhone-only konfiguracija i fizička provjera

- **Odgovorni:** nije preuzeto.
- **Grana:** npr. `codex/salem-iphone-scope` nakon claima.
- **Status:** `open`.
- **Opis:** U narednom iOS sourceu ukloniti deklarisanu iPad podršku i provjeriti stvarni iPhone portrait UI, zoom/tastaturu i lokalni offline katalog.
- **Datoteke:** `apps/client/app.json`, potrebni native config/testovi, `docs/RELEASE_HANDOFF.md`, vlastita sesija.
- **Kriteriji prihvatanja:** `supportsTablet: false`, provjerena generisana targeted-device-family konfiguracija, realni test na podržanom iPhoneu; bez tvrdnje da iPhone kompatibilni prikaz nikad nije dostupan na iPadu.
- **Zavisnosti:** dogovor s `ANDROID-001` zbog zajedničkog app.json; source osnova sa generičkim slikama. Novi build/deploy/store submission posebno odobrava korisnik.

## PREF-001 — "Profil" opisati kao lokalne preference

- **Odgovorni:** nije preuzeto.
- **Grana:** npr. `codex/<ime>-local-preferences` nakon claima.
- **Status:** `open`.
- **Opis:** ENG/BHS tekstovi jasno govore da nema serverskog računa, registracije ili javnog profila. Preference se mogu naknadno mijenjati; lokalno učenje ostaje.
- **Datoteke:** `apps/client/src/web/WebExperience.tsx`, `Onboarding.tsx`, jezičke mape i relevantni testovi; vlastita sesija. Konačan file scope navesti pri claimu.
- **Kriteriji prihvatanja:** očuvani favoriti, historija, uređivanje, lokalno brisanje i svi prehrambeni hard filteri; ažurirani Apple Notes bez izmišljene prijave.
- **Zavisnosti:** dogovor s `ANDROID-001` zbog WebExperience.tsx; D-002.

## ANDROID-001 — Predaja i dovršavanje postojećeg AdMob WIP-a

- **Odgovorni:** `salem-android-wip` (postojeći lokalni rad, nije nova GitHub predaja).
- **Grana:** namjenska grana još nije objavljena; **ne nastavljati iz docs PR-a kao da sadrži SDK kod**.
- **Status:** `blocked_handoff`.
- **Opis:** Objaviti postojeći AdMob rad na svojoj grani s novom provjerom i PR-om prije nastavka na drugom accountu. Ahmed je potvrdio objavljene UMP poruke; to nije dokaz ponašanja SDK-a na telefonu.
- **Datoteke:** rezervisani AdMob fajlovi iz STATUS; `package-lock.json`; `tests/ads-*.test.ts`; poseban release handoff i sesija.
- **Kriteriji prihvatanja:** source/PR dostupni drugom Codexu, testne jedinice u testnim profilima, consent prije oglasa, korisničke preference se ne šalju SDK-u, prirodna pauza/frekvencijski limiti, fizički Android QA, stvarni AAB i tačan source SHA. Build/objava nisu izvršeni samo zato što kod postoji.
- **Zavisnosti:** `RIGHTS-001`, potvrđena publika/Privacy/Data safety/Contains ads/app-ads.txt; zasebno odobrenje za release. Preklapanje s IOS-001 i PREF-001 dogovoriti prije rada.

## RELEASE-001 — Novo native izdanje i Apple odgovor

- **Odgovorni:** nije preuzeto; jedan release koordinator nakon dogovora.
- **Grana:** kreirati nakon prihvaćenih prethodnih PR-ova, npr. `codex/<ime>-native-release`.
- **Status:** `blocked`.
- **Opis:** Pinovati zajednički source SHA, napraviti posebno evidentirane Android/iOS artefakte i pripremiti Apple Guideline 2.1 odgovor.
- **Datoteke:** `docs/RELEASE_HANDOFF.md`, release config/scripts samo po dogovoru, vlastiti sesijski zapis; store konzole odvojeno.
- **Kriteriji prihvatanja:** čist source, odgovarajući verzija/build brojevi bez kolizije, generičke slike u instaliranom offline paketu, fizički QA, video s fizičkog iPhonea i tražene informacije, stvarno dostupna podrška/privatnost, navedeno šta nije testirano.
- **Zavisnosti:** IOS-001, PREF-001, RIGHTS-001; ANDROID-001 samo ako izdanje sadrži oglase. Nema automatskog submit/deploy odobrenja.
