# Saradnja između Codex accounta

Ovi dokumenti služe za rad na jednom LifeSpinner repozitoriju bez zajedničkog chata. Početak za drugi account: [SECOND_CODEX_START_HERE](../docs/SECOND_CODEX_START_HERE.md).

## Izaberi ispravnu osnovu

GitHub default `android-expo-windows` trenutno pokazuje stari Windows/Android snapshot i nema zajednički merge-base s aktuelnom razvojnom historijom. **Ne počinji novi posao iz default grane samo zato što ju je GitHub otvorio.** Potvrđena source osnova za ovaj bootstrap je `codex/generic-artwork-v1` na `d54e69f6a24a327b526f21936681818164c9d1e8`.

Dok početni dokumentacijski PR nije merged, saradnički dokumenti su na `codex/salem-collaboration-setup`. To je ulaz za čitanje pravila, a ne automatsko odobrenje da mijenjaš njegov sadržaj ili deployaš. Vlasnik projekta kasnije bira zajedničku integracijsku/default granu; ova predaja ne spaja nepovezane historije.

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

Pročitaj AGENTS, STATUS, TASKS, DECISIONS i relevantnu sesiju. Ako lokalna grana još nema dokumente, prvo ih pročitaj s bootstrap grane:

```sh
git show origin/codex/salem-collaboration-setup:AGENTS.md
git show origin/codex/salem-collaboration-setup:collaboration/STATUS.md
git show origin/codex/salem-collaboration-setup:collaboration/TASKS.md
```

## 2. Preuzimanje zadatka prije implementacije

1. Provjeri TASKS na zajedničkoj osnovi **i u drugim nedavno objavljenim granama**. Provjeri otvorene PR-ove (`gh pr list --repo salemko72/RANDOM-life --state open`) ili GitHub UI. Ako API nije dostupan, zabilježi nepoznato stanje i uskladi preklapanje s korisnikom.
2. Izaberi slobodan ID ili dodaj novi; ne dodjeljuj sebi tuđi `in_progress` zadatak. Odgovorni Codex neka bude stabilna oznaka, npr. `ahmed-backend` ili `salem-ios`, bez emaila.
3. Napravi vlastitu granu iz **potvrđene osnove** u čistom checkoutu. Dok bootstrap nije merged, čitljivi početak s pravilima je `git switch -c codex/ahmed-catalog-review origin/codex/salem-collaboration-setup`; takav PR je zavisan od docs PR-a i cilja bootstrap granu dok se base ne uskladi. Poslije prihvatanja docs PR-a koristi novu potvrđenu integration osnovu. Ne cherry-pickaj zajednički TASKS preko tuđih claimova.
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
