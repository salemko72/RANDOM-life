# Privacy i Data safety — 12.11.2026.

## Objavljeno 13.11.2026. — PRIVACY-REL-001 završen u odobrenom scopeu

Korisnik je izričito odgovorio: **Da, odobravam preview i zatim produkcijsku web objavu**. Ranija approval blokada u historijskim odjeljcima ispod time je razriješena. Prije oba koraka provjereni su nepromijenjeni canonical deployment7f9ee8fc i konfiguracijski fingerprint te svi sačuvani fajlovi kandidata. Izvršeni su:

- Preview `f16ac453-a96c-42b9-b635-5d039993bfe9`, https://f16ac453.random-life-preview.pages.dev, s kompletnom HTTP/hash provjerom i browser pregledom prije produkcije.
- Production **`75f058a1-a191-4edd-a416-868c6e39332b`**, branch main postojećeg Pages projekta, javna adresa https://random-life-preview.pages.dev. Pages branch main ovdje nije Git merge; nema izmjene main grane.

Javno provjereni novi ENG/BHS [privacy](https://random-life-preview.pages.dev/privacy.html) i [legal alias](https://random-life-preview.pages.dev/legal/privacy.html), [support](https://random-life-preview.pages.dev/support.html), deletion stranice i tačan [app-ads.txt](https://random-life-preview.pages.dev/app-ads.txt) uz Content-Type text/plain; SHA256 svakog sadržaja odgovara kandidatu. App-ads je59bajtova (publisher red plus završeci reda), nije HTML fallback. Browser pregled produkcijske BHS politike i screenshot sačuvani su lokalno.

**Svi236postojeći statički URL-ovi su ponovo preuzeti/provjereni na preview i produkciji**:235su byte-identični prethodnoj produkciji, a privacy odgovara novoj politici. Posebno56/56downloadova je očuvano,37.684.247bajta. Produkcijski API manifest sada ima241statički fajl:235starih hash referenci, jednu promijenjenu privacy referencu i pet novih putanja (support/app-ads/tri legal aliasa). Nema privatnih backup fajlova u objavljenom paketu.

Katalog/manifest vraćaju200,467stavki i isti version `59a712e7856e411d0d1b11e7c7c681cdb0e4e769522ccdbcd84a502df53eebf8` u preview i production provjerama. Database status200/ok=true/databaseConfigured=true; produkcija i dalje ima passwordConfigured=true i neprijavljeni auth=false. GET uredničkog `/api/content` vraća401. Nije testirana prijava lozinkom niti izvršena urednička ili DB migracijska radnja. Preview bez password bindinga je očekivano imao passwordConfigured=false, uz blokiran urednički API.

Konfiguracijski fingerprint poslije deploya ostaje **`14c15d9022e4c98e2b5d678e4efaf913d391bcb63989459c9cad42fce0a3a237`**, jednak prethodnom; production/preview bindingi i secret konfiguracija nisu mijenjani. Rollback referenca je **`7f9ee8fc-8f34-4330-bc3b-46783ecc4bbe`**; stari deployment nije obrisan. Rollback nije izvršen i ne vraća DB sadržaj.

Provenance je **složena**: legal source `e9ad94304d6da429718cdbc86fa3605c60ff2368`, neizmijenjeni statički assets iz tačnog7f9ee8fc immutable manifesta, i ponovo sastavljen neizmijenjeni backend source opisan ispod. Git SHA u deployment metadata nije dokaz da cijeli sačuvani web paket odgovara jednom čistom checkoutu tog SHA. Native aplikacija nije rebuildana, main nije mergean. [Mašinski čitljiv release dokaz](reviews/privacy-web-release-2026-11-13.json) sadrži sigurne rezultate, ne tajne.

Data safety je već dovršen i sačuvan u Playu iz prethodne sesije. Ovaj nalog **nije uključivao Google Play submission/rollout**, pa izjava i druge pripremljene store promjene nisu poslane ovim radom. AdMob crawler/readiness i produkcijski live-ad native build nisu potvrđeni ovom web objavom. Globalni ADS-001/RIGHTS/QA uslovi ostaju zasebni.

## Nastavak 13.11.2026. — pristup radi, kandidat spreman

Nakon stvarnog logout/login ciklusa i korisnikove potvrde Authorization granted to Wrangler, nova OAuth prijava vidi i Salemov račun `21db5c0516fc09fed9e4b49aed03f06d`. Wrangler pages deployment list za random-life-preview prolazi; nema potrebe za novim API tokenom ili širim admin ulogama. Prethodna autorizacijska blokada ispod je razriješena.

- Canonical produkcija još je `7f9ee8fc-8f34-4330-bc3b-46783ecc4bbe`, branch main. Sigurni metadata backup i hash deployment konfiguracije sačuvani su lokalno; nema ispisa secret vrijednosti. Trenutni fingerprint konfiguracije: `14c15d9022e4c98e2b5d678e4efaf913d391bcb63989459c9cad42fce0a3a237`. CONTENT_DB i CONTENT_BUCKET postoje u preview/production; secret imena su provjerena, vrijednosti nisu stavljene u predaju.
- Cloudflare tačan canonical manifest sadrži **236 statičkih fajlova**. Svih236preuzeto je sa immutable deployment URL-a, uz provjeru Cloudflare asset hash algoritma iz lokalnog Wrangler sourcea (BLAKE3 nad base64 sadržajem+ekstenzijom). Ukupno52.098.698bajtova; **56/56 downloadova,37.684.247bajtova**. Lokalni backup je u roditeljskom `output/privacy-deploy-2026-11-13/backup`, tehnički manifest u backup-verification.json. To sada potvrđuje cijeli statički manifest, a ne samo ranijih56poznatih linkova.
- Kompletan kandidat spaja tu sačuvanu kopiju s privacy patchom. **235/236postojećih statičkih fajlova su byte-identični**, promijenjen je samo `/privacy.html`. Root aplikacijski index/JS/CSS, Studio i svi downloadovi su očuvani. Dodani su support/app-ads/legal aliasi i spojeno app-ads text/plain header pravilo.
- Worker/routing nisu statički assets u tom manifestu. Službeni worker download endpoint odbija čitanje konkretnog Pages script resursa (403), pa nije proglašeno da imamo byte-identičan stari deployed worker. Umjesto dodatnih ovlasti, kandidat koristi ponovo sastavljen postojeći backend source: git diff `d54e69f6a24a327b526f21936681818164c9d1e8..HEAD -- services/artwork packages/shared` je prazan. Staging skripta od te reference ima samo dodatke legal/support/app-ads/header, bez izmjene worker builda ili route liste. Novi worker SHA256 `2c2399033b8780ed538689b8653a2f4678465c256ac4062588bd5691c91b726f`,956.643bajta, jednak ranijem lokalnom AdMob staging workeru. Nema DB migracije ili novog backenda.
- Plan je probni preview iz ovog kompletnog kandidata, provjera privacy/header/static hashes/public katalog/Studio auth granice, pa produkcija tek uz provjeru istog canonical deploymenta i fingerprinta. Nakon produkcije ponoviti sve sačuvane hashove i public/health provjere. Nije korištena destruktivna stage-preview skripta.

**Automatsko odobrenje je odbilo preview deploy prije izvršenja**, uz obrazloženje da je javna remote objava i da posljednje poruke ne daju jasno odobrenje te navode da se stranica ne mijenja. Nema preview deployment ID-a, produkcijskog deploya ili pokušaja zaobilaženja odbijanja. Korisniku je prikazan konkretan spreman paket i zatraženo izričito odobrenje za preview pa produkcijsku privacy web objavu. Raniji nalog za novu javnu politiku bio je naša osnova za pripremu; automatska provjera nije ga prihvatila kao dovoljno jasno odobrenje ove radnje. Google Play review/rollout i dalje nisu dio tog odobrenja.

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
