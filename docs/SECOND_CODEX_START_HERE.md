# Upute drugom Codexu / drugom accountu

Ovaj dokument je dovoljan početak bez pristupa Salemovom chatu. Ne traži slanje tokena, lozinki ili privatnih ključeva. Nisi ovim dokumentom dobio odobrenje za merge, produkcijski deploy, promjenu baze ili slanje trgovini.

## Čovjek prvo povezuje svoj GitHub i Codex

1. Vlasnik repozitorija šalje GitHub poziv: repo **Settings → Collaborators → Add people**, username ili email vezan za GitHub račun. Ako GitHub traži **Confirm access / Verify via email**, to je potvrda identiteta vlasnika na njegovom emailu, ne polje za saradnikov email. Kod se unosi samo na GitHubu.
2. Saradnik prihvata poziv na svom GitHub accountu. Samo primljen email nije dokaz prihvaćenog pristupa. Ne dijeliti login vlasnika.
3. Saradnik na svom ChatGPT/Codex accountu povezuje GitHub i dopušta pristup **ovom istom repozitoriju**. Po potrebi provjeriti GitHub App repository access. Drugi chat/account ne nasljeđuje prvo okruženje, secrets ili konektore.
4. U Codexu izabrati `salemko72/RANDOM-life`. Provjeriti koji account može pushati; pravo čitanja javnog repoa nije pravo pisanja. Cloudflare/Expo dozvole su zasebne i nisu potrebne za prvi read-only pregled dokumenata.

## Koju granu otvoriti

**Ulaz za saradnju trenutno je `codex/salem-collaboration-setup`.** Dok docs PR nije merged, AGENTS i collaboration folder nisu na starom defaultu. Aktuelni aplikacijski base je **`codex/generic-artwork-v1`**, source **`d54e69f6a24a327b526f21936681818164c9d1e8`**. Stari default `android-expo-windows` nije dobra osnova za novi posao: historije nemaju merge-base.

Otvori [AGENTS na bootstrap grani](https://github.com/salemko72/RANDOM-life/blob/codex/salem-collaboration-setup/AGENTS.md), zatim [STATUS](https://github.com/salemko72/RANDOM-life/blob/codex/salem-collaboration-setup/collaboration/STATUS.md) i [TASKS](https://github.com/salemko72/RANDOM-life/blob/codex/salem-collaboration-setup/collaboration/TASKS.md).

U postojećem checkoutu prvo `git status --short` i zaštita lokalnog rada. U **novom praznom direktoriju**, kada nema postojećeg checkouta:

```sh
git clone --branch codex/salem-collaboration-setup https://github.com/salemko72/RANDOM-life.git
cd RANDOM-life
git fetch origin --prune 'refs/heads/*:refs/remotes/origin/*'
git status --short
```

Ne klonirati preko postojeće radne kopije. U nekim cloud okruženjima treba koristiti već pripremljeni `/workspace/RANDOM-life`; ne pretpostavljati da moraš praviti drugi checkout.

## Prvi zadatak u tvom chatu

Možeš mu dati ovaj nalog:

> Radiš na postojećem salemko72/RANDOM-life. Prvo provjeri lokalne izmjene i remote stanje. Na grani codex/salem-collaboration-setup pročitaj AGENTS.md, collaboration/STATUS.md, TASKS.md, README.md, DECISIONS.md i docs/RELEASE_HANDOFF.md. Ne prepisuj lokalni rad. Predloži slobodan task i potvrdi njegov file scope; prije implementacije objavi svoj claim commit na posebnoj codex/<ime>-<zadatak> grani i provjeri druge claimove/PR-ove. Ne mergeaj, ne deployaj i ne piši u produkciju bez odgovarajućeg odobrenja. Sve potrebne rezultate predaj kroz sesijski zapis, commit, push i PR. Nema novih plaćenih usluga.

Ako još nema dodijeljenog posla, počni **read-only** pregledom RIGHTS-001 ili predloži drugi slobodan task. ANDROID-001 je rezervisan i blokiran dok lokalni WIP ne bude predat; IOS-001/PREF-001 se s njim preklapaju. Ne započinjati ih paralelno bez podjele.

## Predaja prema postojećem dogovoru

Prati [collaboration/README](../collaboration/README.md). Vlastita grana, claim push prije implementacije, zaseban sesijski fajl. Prije početka provjeri da task nije već claimovan u drugoj grani — lokalni TASKS nije automatski lock. PR se radi prema dogovorenoj osnovi, ne prema starom defaultu napamet.

Ako Git radi, a `gh` javlja **403**, to može biti mrežno/API ograničenje, ne dokaz da korisnik nema collaborator prava. Za `gh` treba dostupnost `api.github.com` i autentifikacija vlastitog accounta; Git HTTPS pristup sam nije dovoljan. Ne tražiti privatni token u chatu i ne zaobilaziti politiku mreže. Zabilježi blokadu, objavi branch i pripremi PR body/compare link. Drugi ovlašteni operator može otvoriti PR iz browsera.

Početni docs PR, ako još nije otvoren:

```sh
gh pr create --repo salemko72/RANDOM-life \
  --base codex/generic-artwork-v1 \
  --head codex/salem-collaboration-setup \
  --title "Set up shared Codex collaboration and release handoff" \
  --body-file collaboration/sessions/2026-11-11-salem-collab-01.md
```

Prije komande provjeri postoji li već isti PR (`gh pr list` ili GitHub UI), da ne praviš duplikat. Browser fallback: [otvori početno poređenje](https://github.com/salemko72/RANDOM-life/compare/codex/generic-artwork-v1...codex/salem-collaboration-setup?expand=1), provjeri base/head i klikni Create pull request. **Compare link nije već otvoren PR.** Nakon stvaranja upiši stvarni broj/URL u TASKS, STATUS i svoju sesiju kroz novi commit/PR update. Nema automatskog mergea.

## Šta već postoji, bez pretpostavki

- Web/katalog: 15 generičkih slika, 273 ažurirane BOOK/WATCH stavke, ukupno 467 pri zadnjoj provjeri. Source i rollback ograničenja su u release handoffu.
- iOS 0.23.0 (2): stari stvarni build, bez oglasa i novih offline slika; Apple traži dodatne informacije/video. Nije odobrena objava.
- AdMob: postoje samo ranije potvrđeni account/ID-ovi i **nepredat lokalni WIP**. Ovo nije već buildano izdanje s reklamama.
- Korisnik želi iPhone portrait, lokalne **promjenjive preference**, pet rubrika bez LISTEN-a i bez dodatnih troškova.
- Privatni backupi/credentials nisu u Git-u. Ne izmišljaj da ih imaš; za opravdanu operaciju zatraži svoje minimalno ovlaštenje od vlasnika i koristi odgovarajući task/handoff.
