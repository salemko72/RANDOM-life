# RANDOM / Random Life

Decide Less. Live More. EAT recepti i BOOK preporuke knjiga; jedan SPIN daje jednu preporuku iz pregledanog kataloga.

Prvi razvojni tok: Expo Android/iOS/web klijent, lokalni privatni Content Studio, Workers API i D1 migracija. Najnovije odluke su u [docs/handoff/READ_FIRST_LATEST_DECISIONS.md](docs/handoff/READ_FIRST_LATEST_DECISIONS.md).

## Najbrža proba na Windowsu

Raspakuj source ZIP i dvoklikni **POKRENI_RANDOM.cmd**. Script instalira zaključane pakete samo kada nedostaju ili se lockfile promijeni, pokreće Expo i otvara browser. Node.js 24 LTS treba biti instaliran. Ostavi terminal otvoren; Ctrl+C zaustavlja preview.

Ovo je demo s dva primjera, bez baze, tokena ili cloud servisa. Postojeće API/.env postavke se ne mijenjaju; demo proces ih ignoriše. Detalji su u PROBAJ_PRVO.txt. Za puni urednički tok koristi upute ispod.

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

Studio koristi lokalni token; Expo bez `EXPO_PUBLIC_API_URL` prikazuje jasno označen demo s dvije stavke. Za puni tok postavi javni API URL u `apps/client/.env` prema `.env.example`; na telefonu koristi LAN IP računara. Expo terminal nudi web preview i QR za Expo Go. Detalji za Windows, sliku iz ChatGPT-a i fizičke telefone su u [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

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
