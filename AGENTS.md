# LifeSpinner — obavezna pravila za Codex saradnike

## Prvo čitanje u svakoj sesiji

Prije rada pročitaj ovaj fajl, [STATUS](collaboration/STATUS.md) i [TASKS](collaboration/TASKS.md). Zatim pročitaj [postupak saradnje](collaboration/README.md), relevantne [odluke](collaboration/DECISIONS.md), sesiju prethodnika i [release handoff](docs/RELEASE_HANDOFF.md) ako radiš na izdanju.

Postojeća pravila se zadržavaju: [originalne Codex instrukcije](docs/handoff/01_CODEX_INSTRUCTIONS.md), [handoff odluke](docs/handoff/03_DECISIONS_AND_OPEN_QUESTIONS.md), [raniji dodatak](docs/handoff/READ_FIRST_LATEST_DECISIONS.md), [content contract v2](docs/content/ACCESS_LINKS_V2.md) i [D1 operativne upute](docs/ONLINE_D1_MIGRATION.md). Stare tvrdnje o tada praznoj bazi, demo verziji ili nepostojećem R2 nisu opis današnje produkcije. Pri sukobu najnovija izričita korisnička odluka ima prednost; ne tretiraj prijedlog kao odobrenje. Zabilježi šta je i zašto zamijenjeno, bez brisanja historijskih dokumenata.

## Obavezna saradnja

1. Provjeri `git status --short`, trenutnu granu, remote refs i GitHub stanje prije izmjena. Nikad ne briši, resetuj, stashuj, čisti ili prepisuj tuđe lokalne izmjene bez dogovora. Ne koristi `git add .` u prljavom checkoutu.
2. Svaki Codex radi na svojoj grani `codex/<ime>-<kratak-zadatak>`. Accounti nemaju zajedničku memoriju ni automatsko obavještavanje. Sav materijal potreban za nastavak mora biti na GitHubu.
3. Prije implementacije upiši claim u `collaboration/TASKS.md`, sa vlasnikom, granom, datotekama i kriterijima prihvatanja; commit i push claim. Provjeri i claimove u drugim granama/PR-ovima. TASKS nije automatski lock. Ako provjera nije moguća, ne tvrdi da zadatak nije zauzet.
4. Ne mijenjaj iste datoteke paralelno s drugim Codexom. Prvo dogovorite podjelu kroz repo/PR ili preko korisnika. Ne pretpostavljaj da je drugi Codex pročitao tvoj chat.
5. Predaja = commit + push + Pull Request. Lokalni fajl ili commit nije predaja. U sesiji navedi puni source SHA, ponašanje prije/poslije, izvršene provjere, rezultate i preostale probleme. Ako je PR blokiran, upiši blokadu i tačan compare link; ne tvrdi da PR postoji.
6. Razlikuj **implementirano**, **testirano**, **buildano**, **poslano trgovini**, **odobreno** i **objavljeno**. Broj u `app.json` nije dokaz napravljenog ili objavljenog builda.
7. Bez automatskog mergea, force pusha, produkcijskog deploya, migracije produkcije ili store submissiona bez odgovarajućeg korisničkog odobrenja za konkretnu radnju. Ranija dozvola ne daje drugim sesijama trajno odobrenje za novi deploy.
8. Android, iOS i web koriste zajednički source gdje dijele ponašanje. Za isto izdanje pinuj jedan čist source SHA, uz posebne build ID-eve, artefakte i rezultate provjera svake platforme. Platformski SDK/config mogu se razlikovati i moraju biti evidentirani.
9. Lozinke, tokene, privatne ključeve, cookies, potpisane download URL-ove i lične podatke korisnika nikada ne stavljaj u Git, PR ili zapisnik. Ne ispisuj cijeli Cloudflare project JSON: može sadržavati tajne. Koristi samo odabrana sigurna polja. Ne prenosi credentials između accounta kroz chat; svaki operator uređuje vlastito ovlaštenje.
10. Svaki Codex piše svoj `collaboration/sessions/YYYY-MM-DD-ime-NN.md`; zajedničke fajlove ažurira kratko i uz provjeru konflikata. Ne označavaj tuđi zadatak završenim bez dokaza i predaje.

## Pravila ovog projekta

- Koristi postojeći `salemko72/RANDOM-life`. Ne praviti novu aplikaciju, D1 bazu, bucket ili paralelni backend radi zaobilaženja problema pristupa.
- Budžet: **0 dodatnih troškova**. Bez plaćenih licenci, AI API-ja, nadogradnje planova ili naplativih resursa. Prije builda provjeri postojeću kvotu i potrebu za izdanjem.
- Produkcijski backend je `services/artwork`, ne razvojni `services/api`. Sačuvaj manifest/snapshot ugovor, privatni Studio, historiju revizija i postojeće `CONTENT_DB`/`CONTENT_BUCKET` bindinge. Ne tvrdi da je uzrok ranijeg 1102 dokazan.
- D1 sadrži urednički sadržaj; korisnik nema serverski račun. Preference i lokalno učenje ostaju na uređaju i mogu se mijenjati. Ne šalji zdravstvene/prehrambene preference oglasnom SDK-u.
- Prehrambeni hard filteri, alergeni i odobreni low-phosphate kriteriji ne popuštaju radi dobijanja rezultata. Testiraj i lokalni pričuvni katalog.
- BOOK/WATCH koriste 15 originalnih generičkih slika. Bez automatskog vraćanja TMDB postera ili tuđih omota. Zamjena slika nije dokaz licence za ranije preuzete tekstove/podatke.
- Potvrđene rubrike: EAT, READ/BOOK, WATCH, MOVE, GO. LISTEN ostaje arhiviran; ne vraćati bez naloga. ENG riječ je **Spin**, BHS **Zavrti**.
- Željeni naredni iOS target je iPhone, portrait. `supportsTablet: true` u postojećem sourceu još nije ispravljen: ne tvrdi da je iPad već uklonjen niti da portrait sam isključuje iPad.
- `scripts/stage-preview.mjs` briše staging direktorij. Prije ovlaštenog web deploya sačuvaj i provjeri sve postojeće `/downloads` fajlove; ne objavljuj privatne backupe. Ne dirati resurse drugih projekata (npr. pomaaalodesk/bookweb).
- Provjere biraj prema promjeni. Za aplikacijski kod uobičajeno: `npm test`, `npm run typecheck`, relevantni build/browser/native check. Za dokumentaciju provjeri linkove, SHA/grane, potpunost i odsustvo tajni; ne pokreći native release bez potrebe.
