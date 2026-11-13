# Zajedničke odluke

Samo potvrđeno označiti `DECIDED`; prijedlog je `OPEN`. Najnovija izričita korisnička odluka ima prednost. Sačuvati historiju, datum, razlog i posljedice; stare dokumente ne prepravljati tako da izgledaju kao da je nova odluka oduvijek važila.

## D-010 — Publika 16+ i publisher izjava za ADS-001

- **Datum/status/owner:** 12.11.2026., `DECIDED`, Ahmed kroz izričit odgovor u ovoj sesiji.
- **Problem/opcije:** handoff traži potvrdu namjeravane publike i tačan app-ads.txt red; publisher ID sam nije dovoljan za izmišljanje cijele izjave.
- **Odluka/razlog:** namjeravana publika **16+**; dostavljen red `google.com, pub-8395430021391101, DIRECT, f08c47fec0942fa0`.
- **Posljedice:** source/staging sadrže taj red i aplikacija se ne označava child-directed. Stvarna dob i under-age consent status ne zaključuju se iz publike. Ahmed/Salem usklađuju store upitnike, UMP i stvarne SDK izjave; nema automatskog live builda, deploya ili store submissiona. Live /app-ads.txt još nije ispravan niti crawler potvrđen.

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

## D-008 — Nova zajednička main, bez miješanja starog Androida i WIP-a

- **Datum/status/owner:** 11.11.2026., `DECIDED`, korisnik je nakon prvog prijedloga izričito odobrio novu osnovu i uklanjanje starih Android grana.
- **Problem/opcije:** stari default i aktuelni source nemaju merge-base; nedovršeni AdMob ne smije u stabilnu verziju.
- **Odluka/razlog:** nova `main` iz posljednjeg predatog sourcea i saradničkih dokumenata. WIP ostaje na zasebnoj grani. Samo stare Android radne grane arhivirati tagovima pa ukloniti; ne raditi unrelated-history merge ili force push.
- **Posljedice:** `android-play-test-ready` je obrisan; `android-expo-windows` čeka promjenu GitHub defaulta. Ne tvrditi da je default već promijenjen bez provjere. Historijski početni docs PR je pripremljen prema generičkoj source grani; stvarno otvaranje PR-ova i dalje zavisi od pristupa API-ju ili browsera.

## D-009 — AdMob obuhvata obje platforme

- **Datum/status/owner:** 11.11.2026., `DECIDED`, najnoviji izričit nalog korisnika.
- **Problem/opcije:** početni WIP je Android-only; korisnik želi oglase i u iOS-u.
- **Odluka/razlog:** ADS-001 se dodjeljuje drugom Codexu uz Ahmeda za **Android i iOS** iz zajedničkog sourcea, sa odvojenim platformskim ID-ovima i testovima.
- **Posljedice:** iOS no-op/autolink zabrana u WIP-u moraju biti dovršeni, ne predstavljeni kao gotova integracija. Novi buildovi, ista zamrznuta source osnova, zasebni fizički QA, UMP/ATT/privatnost/store izjave. Postojeći iOS build 2 ostaje neizmijenjen. Bez automatske produkcijske objave.
