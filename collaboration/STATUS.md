# Trenutno stanje

**Ažurirano: 11.11.2026.** Ovaj pregled je handoff, ne automatska sinhronizacija. Prije rada fetch i provjeri PR/head SHA ponovo. Odgovorni za ovaj zapis: `salem-collab`.

## GitHub i aktivna koordinacija

| Grana | Zadnji potvrđeni puni SHA | Stanje / namjena |
|---|---|---|
| `codex/salem-collaboration-setup` | Claim `800c93f7e6aa33784ea50cc3b352fca7cf514925`; konačni docs head provjeri na GitHubu | `COLLAB-001`, ovaj početni dokumentacijski PR; base je generička artwork grana |
| `codex/generic-artwork-v1` | `d54e69f6a24a327b526f21936681818164c9d1e8` | Trenutna potvrđena aplikacijska source osnova; 15 generičkih slika |
| `codex/ios-testflight` | `7ddf52f3f35034123bad683ba8446eea72860fcb` | Ranija iOS/source grana; nema posljednje generičke slike; ne pretpostaviti da je ovo najnovija osnova |
| `codex/r2-versioned-catalog` | `f7861c49185aa982b58e87186bc6905390f77e7d` | Serverski handoff iz oktobra je u ancestryju aktuelnog sourcea; ne redeployati staru granu preko novijeg backend koda |
| `android-expo-windows` (GitHub default) | `a46c155a47c8bc6c1b526c447c6558914b438b2e` | Stari odvojeni snapshot, **nije** aktuelni integration base; nema merge-base s trenutnim sourceom |
| `codex/listen-playlists` | `0a688c13083d468594fd6404bad9fb6537c38187` | Arhiva LISTEN prototipa; ne vraćati u izdanje |

**PR evidencija:** Git fetch/push potvrđeni. GitHub REST/GraphQL je u ovoj sesiji vraćao 403; lista otvorenih PR-ova nije potvrđena. Početni PR je `blocked_pr` dok ne postoji potvrđen broj/URL. [Pripremljeno poređenje](https://github.com/salemko72/RANDOM-life/compare/codex/generic-artwork-v1...codex/salem-collaboration-setup?expand=1). Ne označavati predaju kompletnom samo na osnovu compare linka.

## Source, testovi, build i produkcija su različita stanja

- **Source provjeren ponovo:** `d54e69f6a24a327b526f21936681818164c9d1e8`; izvučen Git arhivom, bez lokalnih AdMob izmjena. `npm run build:preview`, **291 test / 40 datoteka**, `npm run typecheck` prolaze. Korišten je postojeći instalirani `node_modules`; ovo nije novi hermetički `npm ci` niti native build.
- **Web/katalog, zadnja provjera 11.11.:** Pages deployment `7f9ee8fc-8f34-4330-bc3b-46783ecc4bbe`; 467 javnih stavki, svih 273 BOOK/WATCH stavki koristi generičke slike, ostale 194 neizmijenjene. Vidi [rollout](../docs/reviews/2026-11-11-generic-artwork-rollout.md) i ograničenje dirty-tree provenance u [release handoffu](../docs/RELEASE_HANDOFF.md).
- **iOS stvarni build:** 0.23.0 (2), source `1e6f8efc1d0e3ccfb0daf4df6e234f8761992683`, EAS build `a73b11b1-93e0-4af5-b12c-70b77a6a185c`. Apple je zatražio informacije/video po Guideline 2.1; nije odobrena javna objava. Nema oglasa/LISTEN-a ni novih offline generičkih slika u tom buildu.
- **Android:** committed config na d54 navodi 0.23.0 / versionCode 8; nema novog artefakta potvrđenog na tom sourceu. Lokalni WIP mijenja code na 9 i dodaje AdMob, ali nije izdan ni predat. Ne koristiti taj broj kao dokaz Google Play releasea.

## Blokade i rezervisani fajlovi

- **AdMob WIP kod nije predat:** vlasnik `salem-android-wip`; druga sesija ga nema automatski. Rezervisani: `apps/client/App.tsx`, `app.json`, `eas.json`, `package.json`, `src/native/preview-assets.ts`, `src/native/ads-*`, `src/web/ads-bridge.ts`, `src/web/WebExperience.tsx`, client plugin/autolink config, root `package-lock.json`, `tests/ads-*.test.ts`. Ne počinjati paralelno uređivanje bez nove grane/PR-a i dogovora.
- **Pristup servisima se provjerava po accountu:** direktni D1 API je ranije vraćao 401, Pages i ovlašteni Studio su radili. To nije dozvola drugom Codexu da preuzima tajne ili mijenja bazu. Ovaj docs posao nema novo odobrenje za deploy/upis u produkciju.
- **Prava na podatke:** generičke slike zamjenjuju postere/omote; porijeklo ranijih tekstova/podataka i dalje traži provjeru. Nema budžeta za komercijalnu TMDB licencu. Ne aktivirati monetizaciju s neriješenom zavisnošću.
- **iPhone-only i lokalne preference:** odluke potvrđene; `supportsTablet: true` i terminologija profila još traže implementaciju u narednoj sesiji/build-u.
- GitHub API odredište `api.github.com` trenutno nije dostupno; pokušaj dopune environment drafta nije sačuvan (draft nije editabilan). Nikakva promjena mreže nije potvrđena.

## Sljedeći koraci

1. Završiti/otvoriti i pregledati `COLLAB-001` PR; drugi account prihvata GitHub poziv i čita [ulazne upute](../docs/SECOND_CODEX_START_HERE.md).
2. Dogovoriti zajedničku integration/default granu (`COLLAB-002`); bez spajanja nepovezanih historija napamet.
3. Preuzeti zasebno rights audit, iPhone/preferences korekcije ili pripremu native izdanja iz [TASKS](TASKS.md). Native/AdMob zadaci se preklapaju: prvo dogovoriti vlasnika fajlova.
