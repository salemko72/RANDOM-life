# Zajedničke odluke

Samo potvrđeno označiti `DECIDED`; prijedlog je `OPEN`. Najnovija izričita korisnička odluka ima prednost. Sačuvati historiju, datum, razlog i posljedice; stare dokumente ne prepravljati tako da izgledaju kao da je nova odluka oduvijek važila.

## D-001 — Saradnja kroz isti repo i zasebne grane

- **Datum/status/owner:** 11.11.2026., `DECIDED`, korisnik; operativni vlasnik se navodi po tasku.
- **Problem/opcije:** accounti ne dijele chat; privatne upute ili jedan zajednički checkout/grana stvaraju izgubljene predaje i konflikte.
- **Odluka/razlog:** AGENTS + STATUS/TASKS/DECISIONS, vlastita sesija po Codexu, claim push prije implementacije, commit/push/PR predaja. TASKS je dogovor, ne automatski lock.
- **Posljedice:** preklapanje prvo dogovoriti; bez automatskog mergea, force pusha ili produkcijskih radnji bez odobrenja. PR API blokadu iskreno evidentirati.

## D-002 — Lokalne preference, bez serverskog računa

- **Datum/status/owner:** 11.11.2026., `DECIDED`, korisnik.
- **Problem/opcije:** riječ "profil" sugeriše registraciju ili javni/account profil; ukidanje uređivanja bila je nejasna alternativa.
- **Odluka/razlog:** lokalne preference za izbor i lokalno učenje; **mogu se naknadno mijenjati**. Nema obaveznog accounta/login-a.
- **Posljedice:** promijeniti terminologiju, ne brisati postojeće lokalne podatke/favorite niti uklanjati hard filtere. Zadatak PREF-001 nije već isporučen.

## D-003 — Bez dodatnog troška i plaćenih licenci

- **Datum/status/owner:** potvrđeno ponovo 11.11.2026., `DECIDED`, korisnik; stariji budžetski dogovor se zadržava.
- **Problem/opcije:** komercijalni API/image ugovori i automatizovani AI API mogu tražiti naknadu.
- **Odluka/razlog:** 0 dodatnih troškova; bez kupovine licenci, plaćenih AI/API poziva, paid planova ili simulatora. Postojeća pretplata nije API kredit.
- **Posljedice:** ne pretpostavljati TMDB komercijalnu dozvolu ili besplatne neograničene resurse; licence i kvote provjeravati prije radnji.

## D-004 — 15 generičkih slika umjesto pojedinačnih postera/omota

- **Datum/status/owner:** 11.11.2026., `DECIDED`, korisnik; implementacija `d54e69f6a24a327b526f21936681818164c9d1e8`.
- **Problem/opcije:** prava i održavanje stvarnih postera/omota; pojedinačno generisanje za svaki naslov naspram male generičke biblioteke.
- **Odluka/razlog:** pet filmskih motiva, pet TV/serijskih i pet knjiških motiva, bez čitljivih naslovnica/zaštićenih scena. Randomizovan kompatibilan izbor, stabilan tokom gledanja iste stavke. Stariji sadržaj dobija odgovarajući retro motiv.
- **Posljedice:** naslov/autor/platforma ostaju UI tekst, ne na generičkoj slici. Ne vraćati automatski TMDB/Open Library artwork. Porijeklo tekstova/podataka ostaje zasebna provjera. Stare već instalirane offline slike traže novi native build.

## D-005 — Naredni iOS target je iPhone, portrait

- **Datum/status/owner:** 11.11.2026., `DECIDED`, korisnik.
- **Problem/opcije:** trenutni source deklarira iPad iako korisnik želi iPhone UI.
- **Odluka/razlog:** iPhone-only deklaracija u narednom buildu, uspravni UI. Portrait sam po sebi ne isključuje iPad podršku.
- **Posljedice:** provjeriti `supportsTablet` i generisanu device-family konfiguraciju; ne izmišljati već izvršene fizičke testove ili obećavati zabranu iPad kompatibilnog prikaza. IOS-001 je otvoren.

## D-006 — LISTEN arhiviran; Spin/Zavrti terminologija

- **Datum/status/owner:** dogovor iz prethodnih sesija, evidentiran 11.11.2026., `DECIDED`, korisnik.
- **Problem/opcije:** eksperimentalna Spotify funkcija nije dio narednog izdanja; "Spinn" je ranija greška u običnoj ENG riječi.
- **Odluka/razlog:** pet rubrika EAT/READ/WATCH/MOVE/GO; LISTEN sačuvan na arhivskoj grani. ENG Spin, BHS Zavrti; brand LifeSpinner.
- **Posljedice:** nema Spotify prijave ni reprodukcije u trenutnom native izdanju. Arhivu ne vraćati bez novog naloga.

## D-007 — Planirani AdMob interstitial, još bez objavljenog builda

- **Datum/status/owner:** ranije potvrđen izbor i ID-ovi; evidentirano 11.11.2026., `DECIDED` za format/vlasnika, konkretna isporuka **nije odobrena ovim zapisom**. AdMob i Android operator Ahmed; Apple operator Salem.
- **Problem/opcije:** povremeni interstitial naspram bannera i rewarded formata.
- **Odluka/razlog:** native interstitial na prirodnim pauzama, bez bannera, bez targeting-a iz zdravstvenih podataka; testni oglasi tokom razvoja/testa.
- **Posljedice:** početni prijedlog šest uspješnih spinova, dvije aktivne minute, tri minute razmaka i najviše tri/30 minuta ostaje podesiv režim za provjeru, ne dokazana politika prihoda. UMP, store izjave, publika i prava moraju biti usklađeni; iOS build 2 nema oglase.

## D-008 — Integration/default grana nije još odlučena

- **Datum/status/owner:** 11.11.2026., `OPEN`, vlasnik repozitorija.
- **Problem/opcije:** stari GitHub default i aktuelna source historija nemaju merge-base. Moguće je odabrati aktuelnu integracijsku granu bez brisanja arhive; ne spajati historije naslijepo.
- **Preporuka/posljedice:** početni docs PR cilja `codex/generic-artwork-v1`; trajna default/integration odluka čeka korisnika. Ne mijenjati GitHub postavku ili raditi merge pod izgovorom dokumentacije.
