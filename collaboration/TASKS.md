# Zajednički zadaci

Zapis je dogovor o radu, **nije automatsko zaključavanje**. Prije preuzimanja provjeri najnovije udaljene grane, claim commitove i otvorene PR-ove. Ne preuzimaj tuđi aktivni zadatak bez dogovora. Vidi [postupak](README.md).

## COLLAB-001 — Postaviti saradnju između Codex accounta

- **Odgovorni:** Codex uz Salemov account (`salem-collab`); identitet je oznaka sesije, ne GitHub korisnički račun.
- **Grana:** `codex/salem-collaboration-setup`
- **Status:** `blocked_pr` — dokumenti su commitovani/pushani; API otvaranje PR-a vraća 403.
- **Opis:** Uspostaviti zajednička pravila, status, backlog, odluke, zasebne sesijske zapise i release handoff.
- **Datoteke:** `AGENTS.md`, `collaboration/README.md`, `collaboration/STATUS.md`, `collaboration/TASKS.md`, `collaboration/DECISIONS.md`, `collaboration/sessions/2026-11-11-salem-collab-01.md`, `docs/RELEASE_HANDOFF.md`, `docs/SECOND_CODEX_START_HERE.md`.
- **Kriteriji prihvatanja:** postojeća pravila ostaju netaknuta; svih deset korisničkih pravila je pokriveno; trenutno stanje razlikuje source/build/deploy; drugi account može nastaviti bez chata; početni PR ima konkretan diff i provjere.
- **Zavisnosti:** potvrđene remote grane; pristup GitHubu; izuzeti postojeći lokalni AdMob rad iz PR-a.
- **Predaja:** claim `800c93f7e6aa33784ea50cc3b352fca7cf514925`, dokumenti `d9c8073aab1b580a46417306fc3f0d4d54c9341d`; PR nije potvrđen. Nema odobrenja za merge/deploy.

## COLLAB-002 — Dogovoriti zajedničku integration/default granu

- **Odgovorni:** korisnik je potvrdio odluku; izvršenje koordinira `salem-collab`.
- **Grana:** nije kreirana; koristiti `codex/<ime>-integration-base` nakon dogovora.
- **Status:** `in_progress` — nova main je objavljena; promjena GitHub defaulta još čeka browser potvrdu.
- **Opis:** Korisnik je odabrao novu main iz aktuelnog sourcea, bez spajanja stare Android historije.
- **Datoteke:** nakon dogovora `collaboration/STATUS.md`, `collaboration/README.md`, vlastiti sesijski zapis; eventualne GitHub postavke samo uz zasebno odobrenje.
- **Kriteriji prihvatanja:** dokumentovana base grana i source SHA, očuvane stare grane, saradnici mogu otvoriti PR s razumljivim diffom; nikakav neodobren force push.
- **Zavisnosti:** `COLLAB-003`; GitHub API 403 blokira promjenu defaulta iz ovog okruženja. Korisnik je sada odobrio novu osnovu/uklanjanje starih Android grana.

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
- **Grana:** `codex/salem-admob-handoff`, code SHA `d4d0a6a150baa71591a2c427223aea69e8bcf17d`; **nije u mainu**.
- **Status:** `blocked_pr` — WIP code push je potvrđen; scope nastavka sada je ADS-001 za obje platforme.
- **Opis:** Postojeći AdMob rad sada je objavljen na zasebnoj grani; završiti pregled kroz PR i nastaviti prema ADS-001. Ahmed je potvrdio objavljene UMP poruke; to nije dokaz ponašanja SDK-a na telefonu.
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


## COLLAB-003 — Nova main osnova, arhiva starih Android grana i kompletna AdMob predaja

- **Odgovorni:** `salem-collab`, korisnikov izričit nalog 11.11.2026.
- **Grana:** `codex/salem-collaboration-setup` za koordinaciju; nova `main` kao zajednička stabilna osnova; `codex/salem-admob-handoff` isključivo za postojeći WIP.
- **Status:** `in_progress` — claim prije promjene remote refova i predaje WIP-a.
- **Opis:** Sačuvati posljednji source bez miješanja AdMob-a, arhivirati/ukloniti samo stare Android radne grane, pripremiti kompletne upute u Markdown/Word formatu za drugi account i Ahmeda.
- **Datoteke:** postojeći saradnički dokumenti; `docs/ADMOB_AND_COLLABORATION_HANDOFF.md`, `.docx`, početni linkovi u `README.md`; poseban sesijski zapis za WIP. AdMob kod se ne stavlja u main/docs commit.
- **Kriteriji prihvatanja:** nova main dostupna na GitHubu; stari Android vrhovi sačuvani tagovima prije brisanja; default-brancha blokada iskreno navedena; WIP dostupna na zasebnoj grani sa tačnim SHA; kompletan vodič uključuje Android i iOS, test/prod razliku, vlasnike, saglasnosti, store obaveze i fizički QA.
- **Zavisnosti:** GitHub default trenutno blokira brisanje android-expo-windows; API 403 može zahtijevati vlasnikov browser korak. Korisnik je odobrio kreiranje nove osnove i brisanje starih Android grana, ne produkcijski deploy ili store submission.

## ADS-001 — Dovršiti AdMob za Android i iOS (zamjenjuje Android-only opseg ANDROID-001)

- **Odgovorni:** `ahmed-admob`, Codex uz Ahmeda, preuzimanje 12.11.2026. prema korisnikovom nalogu za izvršenje handoffa.
- **Grana:** `codex/ahmed-admob-finish`, iz `origin/main` na `2c98dea77951048e00649e8f72cb7e0a848c1bf2`; nakon objavljenog claima prenijeti samo WIP `d4d0a6a150baa71591a2c427223aea69e8bcf17d`.
- **Status:** `claimed` lokalno; objava claima i provjera write pristupa slijede prije implementacije. Remote TASKS pregledan na svim granama koje ga sadrže; otvoreni PR-ovi nisu potvrđeni zbog TLS greške API pristupa.
- **Opis:** Zajednički AdMob source za obje native aplikacije. Postojeći WIP je Android-first, ne gotova iOS integracija. Ne mijenjati već poslani build 2.
- **Datoteke:** App.tsx, app.json, eas.json, native ads moduli/plugin/autolink, ads bridge, WebExperience.tsx, dependencies/lock, ads testovi, privacy/support/app-ads hosting i release handoff prema dogovoru.
- **Kriteriji prihvatanja:** završena iOS i Android integracija; testni oglasi podrazumijevani; pravilno mapirani javni ID-ovi; UMP i kasnija promjena izbora; ATT odluka prema stvarnom trackingu; bez slanja zdravstvenih preferencija; rijetki oglasi na prirodnoj pauzi; fizički QA za obje platforme; isti zaključani source SHA i zasebni artefakti/testovi. Implementirano nije isto što i buildano ili objavljeno.
- **Zavisnosti:** zasebna WIP predaja, RIGHTS-001, IOS-001 i PREF-001; svi ovi taskovi sada se usklađuju s istim release koordinatorom. Osnovni SDK/AdMob ne zahtijevaju kupovinu licence; kvote EAS-a i hosting limiti provjeriti bez paid upgradea. Posebno odobrenje prije produkcijske objave ili slanja trgovinama.
