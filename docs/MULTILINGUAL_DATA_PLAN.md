# Višejezični RANDOM life — predloženi ugovor

Status: ENG/BHS dio implementiran u previewu 0.7, engleski početni jezik. Trenutno translations map živi u postojećem JSON zapisu; normalizovane tabele i preostalih pet jezika su budući prijedlog. Aktuelni ugovor i ograničenja: PREVIEW_0_7.md.

## Jezici

Stabilni locale kodovi: bs, en, fr, de, es, zh-Hans (pojednostavljeni kineski), ar. BHS je naziv zajedničkog početnog uredničkog sadržaja, ne tvrdnja da su svi bosanski/hrvatski/srpski varijeteti identični. Kasnije se mogu dodati hr i sr-Latn/sr-Cyrl. Korisnik bira jezik i izbor se pamti.

## Jedna stavka, više lokalizacija

Jedan stabilni entity ID. Zajednički podaci: kategorija, slika, identitet autora, originalni naslov, ISBN/izdanje, godina, izvor, količine sastojaka, canonical unit codes, tagovi sastojaka, alergeni, trajanje, oprema i ostala strukturirana metadata. Lokalizirani podaci: prikazni naslov, opis, koraci, nazivi sastojaka/opreme, razlog preporuke. Tagovi/žanrovi moraju dobiti zajedničke kodove i odvojene prikazne nazive; ne filtrirati pomoću prevedenih naziva.

Lokalizacija ima entityId + locale, revision, basedOnSourceVersion, status (draft/review/published), provenance, urednika i vrijeme odobrenja. Izmjena izvora označava prevode kao zastarjele. Javni API ne izlaže nacrte; prevod ne može promijeniti zajedničke količine/alergene ili odobriti osnovni recept.

Službeni lokalni naslovi knjiga/filmova moraju imati provjerljiv izvor; čuvati original kada službeni naslov nije potvrđen. Ne prevoditi automatski imena autora ili izmišljati lokalno izdanje.

Predložene tabele: content_entities, content_localizations, taxonomy + taxonomy_labels. Migracija postojeće language=bs stavke čuva ID, historiju, sliku i odobrenja. Potrebna je provjera migracije na kopiji popunjene baze prije primjene; nema otvaranja druge plaćene baze.

## Studio

Prvo urediti i odobriti osnovni sadržaj. Zatim odabrati jezike i kopirati poseban ChatGPT translation prompt. Unos povratnog JSON-a dopušta samo prevodiva polja i traži isti entityId i sourceVersion. Svaki prevod prolazi zaseban pregled. Moguće je grupno pripremanje nacrta; nisu automatski odobreni. Ostaje ručno, bez OpenAI API-ja.

## UI i fallback

Jedan katalog UI poruka; bez miješanja hardcoded ENG/BHS. Kategorije imaju stalne kodove, lokalizirane prikazne nazive. Fallback lanac: odabrani odobreni jezik → odobreni osnovni jezik uz vidljivu oznaku. API vraća requestedLocale i resolvedLocale. Jezik sadržaja ne smije se predstavljati kao prevod koji ne postoji. Internacionalizirati jedinice/brojeve i množinu. Za arapski implementirati dir=rtl, logičke margine i pregled svih ekrana; ne obrtati wheel fiziku niti slike sa tekstom. Kineski font i prelom moraju se provjeriti na telefonu/browseru.

## Obim

100 početnih stavki × 7 jezika = 700 lokalizacija, od čega 600 dodatnih ako osnovnih 100 već postoji. UI i Studio su dodatni skup poruka. Brzina generisanja nacrta nije brzina pregleda recepata, alergena i službenih naslova. Ne obećavati provjerenu sedmojezičnu bazu za jedan dan.
