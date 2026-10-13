# RANDOM life 0.7 — ENG/BHS

App: https://random-life-preview.pages.dev/
Studio: https://random-life-preview.pages.dev/#studio

Engleski je početni jezik. ENG/BHS izbor je na vrhu glavnog menija i na početnom upitniku. Izbor se pamti u browseru i u Expo Go native snapshotu. Jezik ne mijenja ID preporuke, historiju, favorite, prehrambena ograničenja ili naučene signale.

Svih 25 ugrađenih demo preporuka imaju kompletne ENG i BHS tekstove: naslov/opis, alt slike, izvor, razloge, žanrove, korake, sastojke/jedinice i opremu prema kategoriji. Originalni/službeni naslovi i imena mogu ostati isti kada je to ispravno. Nema izmišljanja prevoda izdanja.

## Jedan zapis, dvije lokalizacije

Postojeći JSON sadržaja zadržava zajedničke podatke: ID, kategoriju, sliku, URL izvora, autorstvo, godinu, količine, trajanje, alergene i tagove. `translations.en` i `translations.bs` sadrže prikazne tekstove i odvojeni `reviewed` status. Za kompatibilnost postoje osnovni tekstovi i `language`; prikaz koristi odabranu lokalizaciju. Ostali locale kodovi su rezervisani za budućnost; nisu uključeni niti automatski prevedeni.

Objava zahtijeva obje kompletne, ljudski pregledane verzije. Broj i redoslijed prevedenih sastojaka/koraka/opreme mora odgovarati zajedničkom sadržaju. Prevod ne može promijeniti količine ili alergene. Lokalizacija prikaza čuva tagove koji određuju ilustracije i prehrambene filtere.

Stari jednojezični unosi ostaju u biblioteci. Nisu automatski odobreni ili izmišljeno prevedeni. Dok ne dobiju obje verzije, nisu dio javnog dvojezičnog kataloga. Otvori stari unos, kopiraj novi prompt (uključuje postojeći JSON), vrati dvojezični JSON i pregledaj ENG/BHS. Sačuvaj, pošalji na pregled i objavi. Browser podaci drugih uređaja nisu dostupni ovom cloud checkoutu.

## Studio

Svaki prompt odmah zahtijeva ENG i BHS u jednom JSON-u. Panel jezičkih verzija omogućava pregled/izmjenu naslova, opisa, koraka, sastojaka/jedinica i razloga. ENG/BHS tabovi tu biraju sadržaj za pregled; jezik interfejsa dolazi iz glavnog izbora aplikacije. Oba prevoda imaju odvojene checkbox potvrde. Izmjena prevoda poništava njegov pregled. Prazno polje ostaje dostupno za uređivanje, ali blokira čuvanje/objavu dok ne bude validno.

Pretraga biblioteke pretražuje osnovni, ENG i BHS naslov. Lista nedostajućih ilustracija čuva i lokalizirane nazive kada postoje. JSON editor i canonical tagovi nisu automatski prevođeni kao UI.

## API i baza

Postojeća D1 JSON kolona podržava oba prevoda bez nove baze ili promjene SQL tabele. `/catalog?locale=en` (podrazumijevano) ili `locale=bs` vraća lokaliziran prikaz. `/spin` prihvata language en/bs i bira na osnovu istog zapisa; quantity/allergen/tag podaci ostaju isti. Javni API ne vraća nepregledane dodatne prevode.

Remote D1 sadržaj nije migriran niti je otvoren novi servis. Objavljen je postojeći besplatni statički preview; Studio ostaje lokalni IndexedDB alat bez OpenAI API-ja i udaljene administratorske prijave.

Provjere: 55 unit/API testova, TypeScript, svih 25 ENG izbora i detalja, BHS prikaz/sastojci, menijski izbor i povratak, dvojezični Studio import/review/publish, stari zapis i pretraga oba naslova, layout u četiri veličine na oba jezika. Fizički telefon nije testiran.
