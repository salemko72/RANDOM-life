# RANDOM life preview 0.8

App: https://random-life-preview.pages.dev/
Studio: https://random-life-preview.pages.dev/#studio

## App

Poredak wheel/bočne trake je EAT, READ, WATCH, MOVE, GO. Centralni spin bira kategoriju; klik na kategoriju zamjenjuje wheel fotografijama i naslovima konkretnih izbora te kategorije. Prikazuje najviše šest prikladnih primjera, uključujući stvarnog pobjednika. Pointer i otvoreni izbor koriste isti indeks i ID; fizički smjer i zaustavljanje rade sa 1–6 sektora. Povratak na Home vraća kategorijski wheel. Hard ograničenja, historija i već viđene stavke ostaju aktivni.

Čuvanje kroz srce/bookmark prikazuje malo pismo koje leti u Favorites, puls ikone i lokaliziranu potvrdu. Uklanjanje iz favorita nema lažnu animaciju čuvanja. Reduced motion prikazuje mirnu potvrdu. Dodane su diskretne sjenke, poluprozirna zaobljena donja navigacija iznad wheela i čitljiviji natpis tokom spina.

## Studio blokada i nacrti

Ranije je jedan nevalidan JSON podatak vraćao cijeli `valid` objekt na null; checkboxi su zato ponovo pokazivali false, bez objašnjenja. Sada se čitaju iz stvarnog JSON-a, a greške prikazuju tačnu putanju. EAT checkbox alergena ostaje vidljiv i dok drugi podatak nedostaje.

Lokalni nacrt može čuvati nedovršene jezičke verzije. Zajednički podaci recepta moraju ostati validni; nije dopušteno izmišljanje količina, alergena ili činjenica. Objava i dalje traži kompletan ENG/BHS, ljudski pregled, prava i postojeću sliku. Privremeno prazni prevodi ostaju dostupni za uređivanje. Nepotpun lokalizirani zapis koristi osnovni naslov umjesto praznog polja ili rušenja biblioteke.

„Repair import metadata“ popravlja sigurne metapodatke, navodi izmjene i zadržava originalni JSON. Nepodržana dodatna polja prevoda ne ulaze u objavu. Root/source/image korisničke napomene ostaju u lokalnom nacrtu; ID, verzija i urednička odobrenja ne mogu se prepisati uvozom JSON-a.

## Stari EAT unosi

Nedostajući status dobija draft, a nedostajuća verzija 1; postojeći podaci se ne prepravljaju. „Translate existing EAT recipes · batch“ kopira kompletne postojeće recepte sa ID/verzijama u grupni ChatGPT prompt. Povratni JSON sadrži samo ID, verziju i translations. „Validate and apply all translations“ provjerava sve i mijenja zapise u jednoj lokalnoj transakciji. Greška u jednom unosu sprečava sve izmjene. Slike, količine, sastojci, izvor i ID ostaju isti; prevodi idu u draft sa novom verzijom i novim pregledom.

Ovaj cloud nema pristup korisničkom IndexedDB-u. Za prevođenje tih stvarnih recepata kroz ovaj chat potreban je Studio backup JSON. Grupni tok nije automatski API prevodilac i nema API troškova.

## Novi atlas

Na 100 različitih nepoznatih namirnica automatski se sprema nepromjenjiv paket: stabilni ID-jevi, ćelije 10×10, nazivi i recepti. Naknadna 101. namirnica ne pomjera ćelije već pripremljenog paketa. Studio nudi prompt i manifest za preuzimanje; ostatak čeka sljedeći paket.

Priprema paketa nije generisanje PNG-a. U ovom $0 ručnom toku nema OpenAI image API-ja ili pozadinskog ChatGPT servisa. Novi PNG se generiše iz stvarnog paketa u ChatGPT-u/ovom chatu, pregleda i uveže u narednu verziju. Originalnih 100 tagova i koordinata ostaje nepromijenjeno. Nije generisan lažni atlas bez popisa korisničkih namirnica.

## Provjere

71 unit/API test, TypeScript, animacija čuvanja, pravi spin item-wheela i podudaranje pobjednika, nevalidan prijevod + checkboxi + čuvanje/povratak nacrta, atomic batch rollback i verzije, queue100/101 i preuzimanje manifesta. Postojeći dvojezični tok i layout ENG u četiri veličine su također provjereni. Fizički telefon nije provjeren. Remote D1 i plaćeni servisi nisu mijenjani.
