# 2026-11-11 — salem-collab — sesija 01

## Predmet i GitHub predaja

- **Task:** COLLAB-001; odgovorni `salem-collab`, grana `codex/salem-collaboration-setup`.
- **PR base:** `codex/generic-artwork-v1`.
- **Aplikacijski base SHA:** `d54e69f6a24a327b526f21936681818164c9d1e8`.
- **Claim SHA:** `800c93f7e6aa33784ea50cc3b352fca7cf514925`, push potvrđen prije implementacije ostalih dokumenata.
- **Dokumentacijski implementacijski SHA:** `d9c8073aab1b580a46417306fc3f0d4d54c9341d`.
- **PR:** još nije potvrđen; API provjera/otvaranje blokirani. [Compare, nije već PR](https://github.com/salemko72/RANDOM-life/compare/codex/generic-artwork-v1...codex/salem-collaboration-setup?expand=1).

## Šta je promijenjeno

Dodan root AGENTS sa obaveznim početnim čitanjem i svih deset pravila saradnje; zadržani originalni handoff/pravila. Dodani postupak preuzimanja i nastavka rada, konkretni taskovi s vlasnicima/file scopeom, status stvarnih grana/buildova, odluke, release provenance i upute za drugi GitHub/Codex account. Početni PR je dokumentacijski: aplikacijski kod, dependencies, produkcija i GitHub default nisu mijenjani ovom sesijom.

GitHub default `android-expo-windows` je star odvojen snapshot bez merge-base s aktuelnom historijom. Zato docs PR cilja aktuelnu generičku artwork granu, ne default. Promjena default/integration politike je poseban otvoreni task, nije izvršena.

## Preklapanja i očuvanje lokalnog rada

U checkoutu su postojale lokalne AdMob izmjene i nepovezani untracked fajlovi. Nisu stavljeni u docs commit, resetovani, stashovani niti obrisani. Sačuvani su privatni hash fingerprinti početnih lokalnih datoteka za završnu provjeru. Drugi Codex nema taj WIP kroz ovu granu; ANDROID-001 je `blocked_handoff` i zahtijeva zasebnu source predaju.

## Provjere

- Git fetch i `git ls-remote --heads`: potvrđene grane/SHA iz STATUS, potvrđen claim push.
- Ponovljene source provjere iz čistog `git archive d54e69f6a24a327b526f21936681818164c9d1e8`:
  - `npm run build:preview`: PASS.
  - `npm test`: **291 PASS / 40 fajlova**.
  - `npm run typecheck`: PASS, root/client.
  - Ponovo korišten postojeći instalirani node_modules; nije rađen novi hermetički npm ci ili native build.
- Ranijih 300 testova odnosilo se na mixed working tree s devet nepredatih AdMob testova. Ta razlika je ispravljena u novom handoffu bez prepisivanja historijskog rollout izvještaja.
- Dokumentacijska provjera linkova, SHA identiteta, dozvoljenog file scopea, odsustva tajni i hashova lokalnog WIP-a: rezultati u završnoj dopuni ove sesije.

## Build/deploy i odobrenje

**Nije pokrenut novi native build, deploy, produkcijska migracija, store submission, merge ili force push.** Korisnik je odobrio kreiranje saradničkih dokumenata, claim/commit/push i početni PR. To nije odobrenje za druge produkcijske radnje niti trajna dozvola novim sesijama.

## Blokade i nastavak

GitHub Git transport radi; REST/GraphQL preko `api.github.com` vraća 403. Pokušaj pripreme mrežne dopune nije sačuvan jer environment draft nije editabilan. Nisu mijenjani credentials niti potvrđena mrežna promjena. Ne tvrditi da nema drugih PR-ova ili da je ovaj PR otvoren dok ne postoji broj/URL.

Drugi ovlašteni operator može provjeriti postojeće PR-ove i otvoriti početni kroz compare link ili `gh pr create` komandu u [ulaznim uputama](../../docs/SECOND_CODEX_START_HERE.md). Nakon toga ažurirati stvarni PR broj i TASKS/STATUS. Nema automatskog mergea.

Sljedeće čitati: [AGENTS](../../AGENTS.md), [STATUS](../STATUS.md), [TASKS](../TASKS.md), [DECISIONS](../DECISIONS.md), [RELEASE_HANDOFF](../../docs/RELEASE_HANDOFF.md). Predloženi read-only naredni posao je RIGHTS-001; prvo objaviti vlastiti claim i provjeriti preklapanje. IOS-001/PREF-001/ANDROID-001 dijele fajlove i traže dogovor vlasnika.


## Kasnija dopuna / nova korisnička odluka

Ovaj zapis opisuje početnu docs fazu. Dokumentacijski linkovi, SHA identiteti, osam fajlova i početni 23 lokalna fingerprinta su provjereni. Korisnik je zatim odobrio novu main, arhiviranje starih Android grana i zasebnu predaju AdMob WIP-a; opseg oglasa proširio je na Android i iOS. Vidi sesiju 02 i kompletan vodič. WIP više nije samo lokalni: d4d0a6a150baa71591a2c427223aea69e8bcf17d. Nije merged u main i nije produkcijski deployan. Početni PR pokušaj i dalje je vraćao403, bez potvrđenog PR broja.
