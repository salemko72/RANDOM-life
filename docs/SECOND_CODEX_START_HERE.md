# Upute drugom Codexu / drugom accountu

Ovaj dokument je početak bez pristupa Salemovom chatu. Detaljan zadatak za Ahmeda/drugi Codex je [AdMob i saradnja](ADMOB_AND_COLLABORATION_HANDOFF.md), uz [Word kopiju](ADMOB_AND_COLLABORATION_HANDOFF.docx). Ne traži slanje tokena, lozinki ili privatnih ključeva. Nisi ovim dokumentom dobio odobrenje za merge, produkcijski deploy, promjenu baze ili slanje trgovini.

## Čovjek prvo povezuje svoj GitHub i Codex

1. Vlasnik repozitorija šalje GitHub poziv: repo **Settings → Collaborators → Add people**, username ili email vezan za GitHub račun. Ako GitHub traži **Confirm access / Verify via email**, to je potvrda identiteta vlasnika na njegovom emailu, ne polje za saradnikov email. Kod se unosi samo na GitHubu.
2. Saradnik prihvata poziv na svom GitHub accountu. Samo primljen email nije dokaz prihvaćenog pristupa. Ne dijeliti login vlasnika.
3. Saradnik na svom ChatGPT/Codex accountu povezuje GitHub i dopušta pristup **ovom istom repozitoriju**. Po potrebi provjeriti GitHub App repository access. Drugi chat/account ne nasljeđuje prvo okruženje, secrets ili konektore.
4. U Codexu izabrati `salemko72/RANDOM-life`. Provjeriti koji account može pushati; pravo čitanja javnog repoa nije pravo pisanja. Cloudflare/Expo dozvole su zasebne i nisu potrebne za prvi read-only pregled dokumenata.

## Koju granu otvoriti

**Ulaz i zajednička stabilna osnova je `main`.** Ona sadrži posljednji predati source sa generičkim slikama i dokumente saradnje, bez AdMob WIP-a. Dok GitHub default još pokazuje stari `android-expo-windows`, biraj main izričito. Ne miješati nepovezanu staru Android historiju s novim sourceom.

Otvori [AGENTS](https://github.com/salemko72/RANDOM-life/blob/main/AGENTS.md), [STATUS](https://github.com/salemko72/RANDOM-life/blob/main/collaboration/STATUS.md), [TASKS](https://github.com/salemko72/RANDOM-life/blob/main/collaboration/TASKS.md) i [kompletno AdMob + saradnja uputstvo](https://github.com/salemko72/RANDOM-life/blob/main/docs/ADMOB_AND_COLLABORATION_HANDOFF.md).

U postojećem checkoutu prvo `git status --short` i zaštita lokalnog rada. U **novom praznom direktoriju**, kada nema checkouta:

```sh
git clone --branch main https://github.com/salemko72/RANDOM-life.git
cd RANDOM-life
git fetch origin --prune 'refs/heads/*:refs/remotes/origin/*'
git status --short
```

Ne klonirati preko postojeće radne kopije. U cloud okruženju često već postoji `/workspace/RANDOM-life`; provjeri ga prije pravljenja novog checkouta.

## Prvi zadatak u tvom chatu

Možeš mu dati ovaj nalog:

> Radiš na postojećem salemko72/RANDOM-life. Prvo provjeri lokalne izmjene i remote stanje. Na grani main pročitaj AGENTS.md, collaboration/STATUS.md, TASKS.md, README.md, DECISIONS.md i docs/RELEASE_HANDOFF.md. Ne prepisuj lokalni rad. Predloži slobodan task i potvrdi njegov file scope; prije implementacije objavi svoj claim commit na posebnoj codex/<ime>-<zadatak> grani i provjeri druge claimove/PR-ove. Ne mergeaj, ne deployaj i ne piši u produkciju bez odgovarajućeg odobrenja. Sve potrebne rezultate predaj kroz sesijski zapis, commit, push i PR. Nema novih plaćenih usluga.

Korisnik je zadao drugom Codexu da pomogne Ahmedu s **ADS-001 za Android i iOS**. Upute, javni ID-ovi, WIP source i kriteriji su u kompletnom vodiču. IOS-001/PREF-001 i prava se s njim usklađuju; ne uređivati iste fajlove paralelno. WIP code je objavljen, ali još nije gotova multiplatform integracija.

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
- AdMob: postoje samo ranije potvrđeni account/ID-ovi i **predat Android-first WIP na zasebnoj grani**. Ovo nije već buildano izdanje s reklamama.
- Korisnik želi iPhone portrait, lokalne **promjenjive preference**, pet rubrika bez LISTEN-a i bez dodatnih troškova.
- Privatni backupi/credentials nisu u Git-u. Ne izmišljaj da ih imaš; za opravdanu operaciju zatraži svoje minimalno ovlaštenje od vlasnika i koristi odgovarajući task/handoff.
