# Privacy i Data safety — 12.11.2026.

## Rezultat i granice

Korisnik je izričito zatražio novu javnu politiku privatnosti i dovršavanje Data safety. [Politika u sourceu](../apps/client/public/legal/privacy.html) je dopunjena za Android ads izdanje, publiku16+, stvarne kategorije podataka, TLS/NPA, regionalne kontrole i razliku između lokalnog brisanja i SDK podataka. ENG i BHS tekst su pregledani u browseru. Nema izmjene native aplikacije ili novog builda.

**Data safety je dovršen završnim Save korakom**, ne samo Save draft. Play je potvrdio: Change saved. Send for review in Publishing overview. U Publishing overview sada postoji red **Data safety — Complete Data safety questionnaire** među neposlanim promjenama. Izjava nije još poslana na Google review niti objavljena. Managed publishing je i dalje off. Tamo je ukupno6promjena, uključujući korisnikove track/country izmjene uz raniji privacyURL/Ads; Submit6changes nije pritisnut.

**Web politika još nije objavljena** zbog Cloudflare članstva/projekta. Nova prijava s izričito odobrenim account:read, pages:write i automatski dodanim offline_access je uspjela. API /accounts i Pages list vraćaju200, ali dostupan je samo Ahmedov račun i prazna lista Pages projekata. Nakon korisnikove poruke da je Salem možda omogućio pristup, postojeća prijava je osvježena i provjera ponovljena s istim rezultatom. Nema tvrdnje da Salemov projekt ne postoji; nije dostupan ovoj prijavi. Nisu traženi ili prenošeni tokeni/lozinke, niti kreiran zamjenski projekt.

## Dovršeni Data safety odgovori

| Pitanje | Sačuvani odgovor i osnova |
|---|---|
| Prikupljanje/dijeljenje | Yes; uključuje SDK, ne samo podatke direktno na našem serveru |
| Enkripcija u prijenosu | Yes; Google SDK TLS i HTTPS zahtjevi kataloga |
| Kreiranje računa | My app does not allow users to create an account |
| Prijava vanjskim računom | No; lokalni profil nije račun, arhivirani Spotify nije aktivan native tok |
| Mehanizam zahtjeva za brisanje prikupljenih podataka | No; ne tvrditi da lokalno brisanje profila briše sve Google SDK podatke; nije obećan rok90dana |
| Badges | Nema tvrdnje o independent security review, UPI ili Families badgeu |

| Kategorija | Collected | Shared | Ephemeral | Optional/required | Svrhe za collection i sharing |
|---|---|---|---|---|---|
| Approximate location | Yes | Yes | No | Required | Advertising or marketing; Analytics; Fraud prevention, security and compliance |
| Diagnostics | Yes | Yes | No | Required | Iste tri svrhe |
| App interactions | Yes | Yes | No | Required | Iste tri svrhe |
| Device or other IDs | Yes | Yes | No | Required | Iste tri svrhe |

Svaki od četiri dijaloga je pojedinačno pregledan, uključujući radio/checkbox vrijednosti; sve četiri kategorije Completed. Required se odnosi na cijelu kategoriju jer nema univerzalnog isključenja svih SDK zahtjeva za sve korisnike/regije. Mogućnost brisanja Android advertising ID-a nije dokaz da se ostali app-set/device identifikatori nikada ne obrađuju. NPA nije potpuni opt-out prikupljanja.

Osnova je [Google Mobile Ads25.5.0 Android disclosure](https://developers.google.com/admob/android/privacy/play-data-disclosure), ista verzija kao u pregledanim APK/AAB, i [Play definicije](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en). Google navodi IP/inferred general location, product interactions, performance diagnostics i device/account identifiers za te tri svrhe, TLS prijenos. Ovo je mapiranje dokumentovanih SDK podataka na Play kategorije, uz pregled sourcea; nije tvrdnja da je izvršen puni mrežni penetration ili regulatorni audit.

Crash logs/other performance nisu automatski dodani bez dokaza zasebne kategorije; aktuelni25.5.0 disclosure navodi launch time/hang rate/energy usage kao Diagnostics. Source nema Sentry/Firebase/Crashlytics integraciju. Vlastiti bounded performance log ostaje lokalno do eksplicitnog sistemskog dijeljenja s odabranim primaocem. Lokalno ime/prehrambeni i zdravstveni odgovori, favoriti i learning historija ne prelaze ads bridge; nisu označeni kao SDK health/name collection. Javna dijeljenja stavki šalju naslov i javne linkove, ne profil.

## Statički paket i sigurna objava

Source za objavu:

- `apps/client/public/legal/privacy.html` → `/privacy.html` i kompatibilni `/legal/privacy.html` alias.
- `apps/client/public/legal/support.html` → `/support.html` i opcionalni `/legal/support.html`.
- `apps/client/public/legal/delete-data.html` → `/delete-data.html` i opcionalni `/legal/delete-data.html`.
- `apps/client/public/app-ads.txt` → `/app-ads.txt`; spojiti postojeći `_headers` s pravilom Content-Type:text/plain za taj path.

Pripremljen je lokalni `output/LifeSpinner-privacy-patch-2026-11-12.zip` u roditeljskom workspace folderu. Sadrži samo ove statičke fajlove/aliase, SHA256.json i README; **nije kompletan Pages site i ne smije biti direktno deployan kao puni site**. Drugom Codexu lokalni ZIP nije garantovan; svi izvori i tačan mapping su gore na GitHubu.

Privacy HTML je17.146bajta, SHA256 `0703ba052178b43b356099ca9e4c34e80d74249a42629dc13a51bf893774d5ac`. Paket ne sadrži tajne, bazu, privatne backupe ili promjenu native builda.

Nakon dobijenog pristupa operator treba:

1. Na postojećem `random-life-preview` evidentirati current canonical deployment i fingerprint konfiguracije; očuvati production/preview bindinge i tajne bez ispisa vrijednosti.
2. Inventarisati i sačuvati sve trenutne javne assets/download fajlove i worker/routing/header konfiguraciju. Ranijih56poznatih downloadova nije automatski potpun aktuelni inventar. Lokalni probni preview-site ima samo15download fajlova i nije prihvatljiv za direktno prepisivanje produkcije.
3. Spojiti statički patch s kompletnim provjerenim aktuelnim deploy paketom; sve postojeće download hashove usporediti prije objave. Ne pokretati stage-preview preko jedine kopije backupa. Za ovu promjenu nije potrebna DB migracija, novi resurs ili native build.
4. Objaviti samo na postojećem projektu uz korisnikov nalog za ovu politiku. Ako se canonical deployment promijenio od inventara, ponovo uskladiti paket. Korisnikov nalog nije dozvola za neplanirane promjene aplikacije/backend ponašanja.
5. Provjeriti stvarne GET odgovore i nove privacy odjeljke, app-ads tačan tekst/plain, support, root UI, Studio auth granicu, katalog i sve sačuvane download hashove. Upisati deploymentID/source/preserved-assets dokaz/rollback referencu.
6. Tek nakon stvarno javne politike pregledati konačan Play skup i odvojeno odobrenje/slanje. Data safety Save ne znači store review/approval/publication. Ne slati svih6promjena naslijepo.

Zadnji javni GET u ovoj sesiji još potvrđuje staru privacy stranicu (8982bajta, SHA256 `11be54b23db6cf841f7d0dc0d77ccf899353c0e8530c6071c4371a4280a8907d`, bez Google Mobile Ads teksta), te support/app-ads370bajta HTML fallback. Nema uspješnog web deploya.
