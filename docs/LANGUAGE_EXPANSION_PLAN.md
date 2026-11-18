# Priprema ES / PT / DE / IT — 18.11.2026.

## Izvedivost i trenutno stanje

Četiri jezika su izvediva uz postojeći zajednički Android/iOS/web source i bez novog plaćenog translation API-ja. Ovaj dokument je procjena i prijedlog faza; novi jezici nisu aktivirani niti je katalog prevođen u ovoj sesiji.

Svježi javni katalog18.11. ima467stavki (EAT147,BOOK172,WATCH101,MOVE27,GO20), bez prijevoda izvan ENG/BHS. Četiri jezika znače **1868 dodatnih content prijevoda**. Približno63908 riječi u sadašnjim engleskim translation poljima uključuje ponovljene source/rights tekstove i bibliografske nazive; to nije broj jedinstvenih tekstova. Postojeća UI mapa ima209 English unosa i22 BHS overridea, uz53 locale==en provjere u web sourceu i dodatne inline tekstove. Ovo nije iscrpan broj svih vidljivih stringova.

Aktivni Locale i LanguageChooser su samo en/bs. Content schema već ima neke dodatne enum kodove (npr.de/es), ali to nije aktivna aplikacijska podrška niti preveden sadržaj. pt/it nisu dovršeni u ugovoru. `locale==='en'?…:BHS` grane treba sistematski zamijeniti prije aktiviranja trećeg jezika.

## Automatski jezik — preporuka, nije implementirano

Na prvom pokretanju koristiti listu preferiranih jezika uređaja (native locale bridge/Expo lokalizacija, uz browser navigator.languages fallback), odabrati prvi stvarno podržani jezik. Ako nema podudaranja, English. Jezik biran ručno pri podešavanju ili u meniju ima prednost, pamti se lokalno i nije promijenjen narednim putovanjem/restartom. Opcija „jezik uređaja / automatic“ omogućila bi povratak automatskom izboru.

**Zemlja preuzimanja nije isto što i jezik korisnika i nema jedinstvenog pouzdanog signala dostupnog ovom sourceu za obje trgovine.** Storefront/Billing/account regija može se razlikovati od uređaja, lokacije i jezika. Ne tražiti GPS/IP geolokaciju ili dodatne dozvole radi prevođenja. Korisniku predložen device-language pristup; country-based aktivacija nije implementirana.

Predložene locale porodice: en,bs,es,de,it i odabrana portugalska varijanta. `es-MX/es-ES` i `de-AT/de-DE` mogu se mapirati na odobreni zajednički prijevod. Za PT je poslano opcionalno pitanje **pt-BR ili pt-PT**; odluka ostaje otvorena dok korisnik ne odgovori. Brazilski PT preporučen za širu publiku; ne tretirati preporuku kao korisničko odobrenje varijante.

## Izbor u profilu/preferencijama

**Već postoji za ENG/BHS:** isti LanguageChooser se prikazuje kroz sve Onboarding korake i pri uređivanju odgovora/preferencija. Jezik je app-level lokalna postavka na uređaju, bez serverskog računa; izbor je odmah vidljiv u UI i pamti se u random-life.locale.v1, koji native profile bridge čuva. Nije potrebno praviti drugi profil ili novi backend.

Kod proširenja promijeniti zajednički chooser jednom (npr.kompaktni dropdown s nazivima jezika), pa isti izbor radi u setupu, uređivanju i meniju. Šest dugmadi u jednom redu ne staje na320px; nazive/scroll/focus provjeriti s većim fontom i njemačkim tekstom. Korisnički zahtjev za ručni izbor potvrđen; novi4jezika nisu još tu dostupni.

## Predloženi redoslijed

1. **Infrastruktura i UI:** jedinstvena active-locale lista, dictionaries, bez implicitnog BHS else za treći jezik; manual/automatic preference prioritet i migracija en/bs bez gubitka lokalnog izbora; chooser na svim mjestima; native/browser jezik i potpunost UI/profila/dietary/consent/error/share tekstova. Uključiti deklaracije podržanih jezika za iOS/Android per-app language settings (CFBundleLocalizations/localeConfig), uz native preferred-locale listu; sama promjena navigator ili content enum liste nije dovoljna. Ova faza može se pripremati dok korisnik testira sadašnji build.
2. **Urednički pilot:** mali reprezentativni batch za sva4jezika: EAT s low-phosphate/allergenima, BOOK/WATCH s originalnim naslovima i MOVE/GO. Provjeriti prirodan jezik, imperativne upute, regionalni PT izbor, dužine i raspored. Zadržati ID, originalne naslove/autore gdje lokalno izdanje nije potvrđeno; ne izmišljati službene prevode naslova.
3. **Content batch-evi:** svih467stavki i zajednički ponovljeni termini uz glossary. Prijevodi sastojaka/jedinica/koraka/napomena/alt/source tekstova uz čuvanje brojeva, porcija, allergy tagova, nutritivnih vrijednosti i izvora. Potrebna lingvistička provjera; prehrambene/medicinske napomene traže poseban sadržajni pregled. AI prvi nacrt nije samostalna potvrda kliničke tačnosti ili prava.
4. **Online/cache/offline zajedno:** proširiti schema/contract/editor, ažurirati isti publikovani snapshot i100-item reserve; provjeriti stariji cache i fallback bez miješanja jezika. Ne ograničiti prevođenje samo na meni. Sačuvati checksum, verzije, revizije i stroge prehrambene filtere. Postojeći17-recipe wording patch i buduće nove jezičke verzije treba uskladiti, da lokalna projekcija ne briše dodatne prijevode.
5. **Izdanje:** provjeriti Google UMP jezičke varijante, privacy/support/terms linkove i store lokalizacije/screenshotove; fizički Android+iPhone QA, promjena jezika, cold/warm offline, restart i veći font. Jedan čist source SHA, zasebni brojevi i besplatna kvota. Aktivirati samo dovoljno pregledane jezike; English fallback ne predstavljati kao kompletan prijevod.

## Kvalitet i obim

Realna je kvalitetna višejezična aplikacija. Prijevodi svih1868varijanti predstavljaju odvojenu sadržajnu fazu, s pregledom i regressionom. Ne obećavati gotov sav katalog u istom malom menu popravku ili unaprijed garantovati native-grade/medicinski pregled bez recenzenta. Ponovljeni termini i generičke slike mogu se ponovo koristiti, a lokalno učenje/health preference ne šalju se translation/ads servisima. Budžet ostaje0dodatnih troškova; nema plaćenog API-ja ili automatskog kupovanja lekture.

## Ovaj pripremljeni kandidat

Korisnik mijenja prethodni zahtjev za top build oznaku: **Share diagnostic log ide ispod glavnih stavki, a build/verzija ispod njega na dno popup-a.** Ranija header oznaka se uklanja. Dinamički native broj i postojeći izbor ENG/BHS se zadržavaju. Nema novog native builda ili store publikacije u ovoj sesiji.
