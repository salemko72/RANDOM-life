# RANDOM / Random Life

Decide Less. Live More. EAT recepti i BOOK preporuke knjiga; jedan SPIN daje jednu preporuku iz pregledanog kataloga.

Prvi razvojni tok: Expo Android/iOS/web klijent, lokalni privatni Content Studio, Workers API i D1 migracija. Najnovije odluke su u [docs/handoff/READ_FIRST_LATEST_DECISIONS.md](docs/handoff/READ_FIRST_LATEST_DECISIONS.md).

## Najbrža proba na Windowsu

Raspakuj source ZIP i dvoklikni **POKRENI_RANDOM.cmd** za browser ili **POKRENI_EXPO_GO.cmd** za telefon. Script instalira zaključane pakete samo kada nedostaju ili se lockfile promijeni i pokreće Expo. Expo Go launcher automatski otvara QR stranicu u browseru; skeniraj telefonom na istom Wi-Fi-ju (Android: Expo Go, iPhone: kamera). Node.js 24 LTS treba biti instaliran. Ostavi terminal otvoren; Ctrl+C zaustavlja preview.

Ovo je demo 0.5 s pet recepata, pet knjiga, pet filmova/serija, šest MOVE aktivnosti i četiri GO ideje, bez baze, tokena ili cloud servisa. Postojeće API/.env postavke se ne mijenjaju; demo proces ih ignoriše. Detalji su u PROBAJ_PRVO.txt. Za puni urednički tok koristi upute ispod.

## Lokalno pokretanje bez dodatnih troškova

Node 24 LTS i npm 11. Iz korijena repozitorija:

```sh
npm ci
npm run setup:local
npm run db:local
```

`setup:local` pravi ignorisani `services/api/.dev.vars` s nasumičnim lokalnim ADMIN_TOKEN i ne prepisuje postojeći fajl. Ne unosi stvarni token u chat ili Git. Pokreni u odvojenim terminalima:

```sh
npm run dev:api
npm run dev:studio
npm run dev:client
```

Samostalni Studio uz lokalni API koristi lokalni token. Browser i Expo Go preview 0.5 koriste ugrađeni demo s pet recepata, pet knjiga, pet filmova/serija, šest MOVE aktivnosti i četiri GO ideje; Studio u tom previewu čuva ručno uvezen sadržaj i slike samo na tom uređaju. Expo Go trenutno prikazuje isti dizajn kroz lokalni WebView, bez API poziva. Expo terminal nudi web preview i QR za Expo Go. Detalji za Windows, sliku iz ChatGPT-a i fizičke telefone su u [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Provjere

```sh
npm test
npm run typecheck
npm run check:expo
npm run build:studio
npm run build:client
```

`npm run smoke:browser` dodatno provjerava pokrenut lokalni API/Studio i izgrađeni Expo web uz postojeći Chromium (CHROMIUM_PATH). Ne koristi plaćeni simulator.

## Granice prve razvojne verzije

- Nema OpenAI API-ja, automatskog ChatGPT browsera, R2, Queue, EAS buildova, upgradea ili udaljenog deploymenta.
- D1 binding koristi postojeći ID; `db:local` mijenja lokalnu razvojnu kopiju. Udaljena baza nije migrirana ovom sesijom.
- Admin token radi samo na localhostu. Udaljeni admin endpointi odbijaju pristup dok ne implementiramo odabrani identitet i uloge.
- JSON i uređivanje stanja imaju D1 revizije; lokalno uvezene slike treba preuzeti u static assets. To nije trajni cloud upload.
- Profil je privremen tokom sesije. Nema potvrđenog korisničkog autha ili server-side historije; nema prikupljanja analitike.
- Engine primjenjuje hard filters i slučajni izbor iz prihvatljivog skupa. Personal-fit scoring nije još usvojeno pravilo niti implementiran model.
- Demo sadržaj nije 50+50 katalog. Eksterni test zahtijeva stvaran urednički sadržaj i dodatne native/auth provjere.

Ne dirati Cloudflare resurse `pomaaalodesk` ili `bookweb`.

Detalji previewa 0.2, povezivanja Expo projekta i razlike između preuzetog HTML-a i stalne web adrese: [docs/PREVIEW_0_2.md](docs/PREVIEW_0_2.md).

Aktuelni stalni demo: https://random-life-preview.pages.dev/ — Studio: https://random-life-preview.pages.dev/studio.html. Korekcije i provjere verzije 0.3: [docs/PREVIEW_0_3.md](docs/PREVIEW_0_3.md).

Raspored oznaka uz naslov (verzija 0.4): [docs/PREVIEW_0_4.md](docs/PREVIEW_0_4.md).

Najnovije korekcije, lokalni profil, kontekstualni paneli i atlas 100 sastojaka: [preview 0.5](docs/PREVIEW_0_5.md).

Najnoviji logo i Studio tok: [preview 0.6](docs/PREVIEW_0_6.md). Predložena struktura jezika: [višejezični podaci](docs/MULTILINGUAL_DATA_PLAN.md).
