# 2026-11-11 — salem-collab — sesija02

- **Taskovi:** COLLAB-003, source predaja za ADS-001; korisnik je eksplicitno tražio novu osnovu, uklanjanje starih Android grana, pomoć drugog Codexa Ahmedu i AdMob za **obje** platforme.
- **Claim SHA:** `557873d10c4c476b959ed7f7bdd0740569da15a3`, objavljen prije promjena refova/predaje WIP-a.
- **Aplikacijski source osnova:** `d54e69f6a24a327b526f21936681818164c9d1e8`.
- **AdMob WIP source SHA:** `d4d0a6a150baa71591a2c427223aea69e8bcf17d`, grana `codex/salem-admob-handoff`, commit/push potvrđeni. Tačno16 WIP datoteka, bez miješanja u main.
- **Provjere WIP-a:** `npm test`:300 PASS/42 fajla; `npm run typecheck`:PASS root/client. Nema APK/AAB/IPA potvrđenog na tom SHA. iOS nije dovršen; vodič navodi noop/autolink/bridge/plugin prepreke.
- **Novi main:** kreiran iz predatog aktuelnog sourcea i docs, ne iz stare Windows grane. AdMob nije merged u njega. Početni main ref bio je557873d; kasnije docs dopune su normalni fast-forwardi, ne release zamrzavanje.
- **Arhivski tagovi:** `archive/android-expo-windows-2026-11-11` na `a46c155a47c8bc6c1b526c447c6558914b438b2e`; `archive/android-play-test-ready-2026-11-11` na `39167eb69c051d49a17c9a4991d274981f2ea99e`. Push potvrđen prije brisanja grane.
- **Brisanje:** `android-play-test-ready` obrisan. Stari default `android-expo-windows` blokiran dok vlasnik ne promijeni default na main; provjeriti remote prije naredne radnje. Nije brisana LISTEN arhiva niti nepovezani projekti.
- **Dokumenti:** kompletni `docs/ADMOB_AND_COLLABORATION_HANDOFF.md` i Word kopija, osvježeni status/odluke/taskovi/entrypoint/release handoff. Puni zadatak za drugog Codexa je ADS-001; korisnik još nije automatski prenio chat niti drugi Codex objavio svoj claim.
- **Lokalni rad:** originalni WIP sačuvan u vlastitom source commitu, ostali untracked fajlovi ostaju netaknuti. Privatni backupi, credentials i lični podaci nisu dodani u Git.
- **Odobrenje:** korisnik je odobrio ove Git branch/dokumentacijske/source-handoff radnje. Nije bilo novog produkcijskog deploya, migracije, automatskog mergea, force pusha, naplate ili store submissiona.
- **PR:** API403 je i dalje blokada. Source grane su na GitHubu; compare linkovi u STATUS nisu potvrđeni PR brojevi. Otvoriti/registrirati PR kroz ovlašteni browser ili API kada bude dostupan.
- **Nastavak:** drugi Codex čita main dokumente, objavljuje ADS-001 claim na svojoj grani i prenosi samo WIP code commit. Dovršava iOS/Android i priprema konkretne testne artefakte uz odgovarajuće odobrenje/kvotu, bez tvrdnje da postojeći iOS build2 sadrži oglase.
