# Saradnja između Codex accounta

Ovi dokumenti služe za rad na jednom LifeSpinner repozitoriju bez zajedničkog chata. Početak za drugi account: [SECOND_CODEX_START_HERE](../docs/SECOND_CODEX_START_HERE.md).

## Izaberi ispravnu osnovu

Korisnik je potvrdio novu zajedničku osnovu **`main`**, iz posljednjeg sourcea sa generičkim slikama i saradničkim dokumentima. AdMob WIP **nije** u mainu. Stari default `android-expo-windows` je nepovezani Windows snapshot; dok vlasnik ne promijeni GitHub default, izričito biraj main, ne automatski HEAD.

AdMob nastavak je poseban ADS-001 zadatak: vidi [kompletan vodič](../docs/ADMOB_AND_COLLABORATION_HANDOFF.md). WIP je na `codex/salem-admob-handoff` (`d4d0a6a150baa71591a2c427223aea69e8bcf17d`); ne raditi direktno na mainu ili tuđoj grani. Stare Android grane se arhiviraju tagovima, ne miješaju s novim sourceom.

## 1. Pregled prije rada

```sh
git status --short
git branch --show-current
git remote -v
git fetch origin --prune 'refs/heads/*:refs/remotes/origin/*'
git ls-remote --heads origin
```

Ako origin URL sadrži credentials, ne kopiraj njegov ispis u chat/zapisnik. Neki cloud checkouti imaju fetch refspec samo za `HEAD`; obični `git fetch` zato nije dovoljan za sve grane. Izričiti refspec iznad rješava čitanje remote grana, ne radi force push.

Ako postoji lokalni rad, utvrdi čiji je. Ne prebacuj granu ako bi izmjene bile izgubljene ili prenesene u pogrešan PR. Koristi odobren čist checkout/izolaciju ili dogovor s vlasnikom. Nema `reset --hard`, `clean -fd`, automatskog stasha ili uključivanja tuđih fajlova u svoj commit.

Pročitaj AGENTS, STATUS, TASKS, DECISIONS i relevantnu sesiju. Ako lokalna grana još nema dokumente, prvo ih pročitaj s main grane:

```sh
git show origin/main:AGENTS.md
git show origin/main:collaboration/STATUS.md
git show origin/main:collaboration/TASKS.md
```

## 2. Preuzimanje zadatka prije implementacije

1. Provjeri TASKS na zajedničkoj osnovi **i u drugim nedavno objavljenim granama**. Provjeri otvorene PR-ove (`gh pr list --repo salemko72/RANDOM-life --state open`) ili GitHub UI. Ako API nije dostupan, zabilježi nepoznato stanje i uskladi preklapanje s korisnikom.
2. Izaberi slobodan ID ili dodaj novi; ne dodjeljuj sebi tuđi `in_progress` zadatak. Odgovorni Codex neka bude stabilna oznaka, npr. `ahmed-backend` ili `salem-ios`, bez emaila.
3. Napravi vlastitu granu iz **potvrđene osnove main** u čistom checkoutu, npr. `git switch -c codex/ahmed-catalog-review origin/main`. Za ADS-001 nakon objavljenog claima prenesi samo tačan WIP code commit prema kompletnom vodiču. Ne cherry-pickaj zajednički TASKS preko tuđih claimova.
4. Upiši opis, odgovornog, granu, status, datoteke, kriterije prihvatanja i zavisnosti. Commit i push **claim prije programskih izmjena**.
5. Ponovo fetch i provjeri je li drugi claim nastao u međuvremenu. Ako postoji preklapanje, stani na preklapajućim fajlovima i dogovorite granice. Zapis u različitim granama nije atomski lock.
6. Otvori draft PR rano kada je moguće. Link dostavi korisniku/koordinatoru; drugi Codex ne dobija automatski obavijest iz ovog chata.

Za pregled drugog claima bez checkouta: `git show origin/codex/<grana>:collaboration/TASKS.md`. Ne pretpostavljaj da jedan lokalni TASKS sadrži sve udaljene izmjene.

## 3. Implementacija i predaja

- Drži se dogovorenih datoteka. Ako se opseg širi, prvo ažuriraj task i dogovori preklapanje.
- Testiraj promjenu; navedene provjere moraju biti stvarno izvršene na navedenom sourceu. Zabilježi i promašene/ograničene provjere.
- Napravi vlastiti sesijski zapis iz predloška ispod. Upiši puni implementacijski SHA nakon commita; taj zapis ide u naredni dokumentacijski commit. Nemoj pokušavati upisati SHA commita u samog sebe.
- Dodaj samo svoje datoteke, commit, push i PR prema dogovorenoj osnovi. Za multiline PR opis koristi datoteku i `gh pr create --body-file ...`.
- Predaja je završena tek kada je na GitHubu. Ako API blokira PR, status je `blocked_pr`, uz objavljenu granu, body i compare link — ne `handed_off`.
- Ažuriraj TASKS/STATUS sa PR-om i testiranim SHA. Bez automatskog mergea ili produkcijskih radnji.

Statusi: `open`, `claimed`, `in_progress`, `blocked`, `blocked_handoff`, `blocked_pr`, `in_review`, `done`. `done` ne znači automatski objavljeno; isporuku zabilježi odvojeno.

## 4. Nastavak tuđeg rada

Pročitaj zadnju sesiju i release handoff, provjeri puni SHA na GitHubu, fetch i uporedi s PR headom. Provjeri postoji li noviji claim. Dogovori preuzimanje s vlasnikom/kroz korisnika, zatim upiši novog odgovornog i push claim. Ne mijenjaj tuđu granu: nastavi na svojoj, s precizno navedenim base SHA i eventualnim cherry-pickovima. Konflikte rješavaj po fajlovima i uz očuvanje oba namjeravana ponašanja; ne prihvataj slijepo cijeli `ours`/`theirs`.

## Predložak sesije

```markdown
# YYYY-MM-DD — oznaka Codexa — sesija NN
- Task ID / odgovorni / grana / PR:
- Base SHA / claim SHA / implementacijski SHA (puni):
- Šta se promijenilo i zašto:
- Datoteke / preklapanja:
- Provjere: komanda, source SHA, rezultat, ograničenje:
- Build/deploy: platforma, build ID, artefakt ili "nije pokrenuto":
- Blokade i preostale provjere:
- Tačni sljedeći koraci i zavisnosti za drugi Codex:
- Korisničko odobrenje: na koju radnju se odnosi; nije trajna dozvola:
```

Tajne, korisnički podaci i privatni backupi ne pripadaju ovim zapisima. Javne app/package i ad-unit identifikatore možeš evidentirati gdje su potrebni; oni nisu credentials, ali nisu ni dokaz ispravne integracije.
