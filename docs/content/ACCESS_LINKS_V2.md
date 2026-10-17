# RANDOM life — ugovor sadržaja v2 (17. 10. 2026.)

Zajednički format za oba ChatGPT/Codex toka. Jedna D1 baza ostaje izvor sadržaja.

- Aktuelni ugovor: https://random-life-preview.pages.dev/api/content-contract
- Aktuelni paket: https://random-life-preview.pages.dev/downloads/RANDOM-Ahmed-content-kit.zip

## Nova opcionalna polja za WATCH / BOOK (READ)

`accessLinks` je lista do 12 linkova, zajednička za ENG/BHS, izvan `translations`.
Svaki link ima:

| Polje | Vrijednost |
| --- | --- |
| provider | Naziv servisa ili knjižare, do 80 znakova |
| url | Stvarni javni HTTPS URL bez kredencijala, do 2048 znakova |
| purpose | watch, buy, borrow ili read |
| kind | direct (tačan naslov/izdanje) ili search (samo pretraga) |
| region | Opcionalni ISO kod države BA/HR/RS/US itd.; izostavi bez provjere |
| checkedAt | Opcionalni datum stvarne provjere YYYY-MM-DD; obavezan uz ljudsku potvrdu |
| verified | U ChatGPT/Codex ZIP-u UVIJEK false; potvrđuje čovjek u Studiju |

Primjer pretrage, koji ne tvrdi da je knjiga dostupna:

```json
{"accessLinks":[{"provider":"Amazon","url":"https://www.amazon.com/s?k=9780140449136","purpose":"buy","kind":"search","verified":false}]}
```

Direktni URL dodaj samo ako si stvarno pronašao i provjerio tačan naslov/izdanje.
Ne izmišljaj URL-ove, servisne ID-jeve, cijene ili regionalnu dostupnost. Ako linka
nema, koristi `accessLinks:[]` ili izostavi polje; to nikada ne blokira objavu.
`source.url` je izvor činjenica, a `image.provenance.sourceUrl` izvor omota. Nijedan
automatski ne postaje link za gledanje/kupovinu. Ne dodaj generička upozorenja u opis.

Stari ZIP-ovi ostaju podržani. ZIP manifest ostaje `RANDOM-content-package-v1`,
a izvoz baze `RANDOM-catalog-v2`. v2 označava ugovor sadržaja.
Uvoz poništava potvrde linkova. Loše opcione linkove automatska popravka izostavlja
uz sačuvan original; osnovni sadržaj se zbog njih ne odbacuje.

## Prikaz u appu i Studio

Detalji WATCH/READ itema prikazuju „Gdje gledati” / „Gdje nabaviti knjigu”. Direktni
link se prikazuje nakon pojedinačne ljudske potvrde i objave. Potvrda činjenica ili
prevoda nije potvrda linka. Promjena linka, namjene, države ili datuma poništava
njegovu potvrdu. Editor podržava dodavanje, izmjenu i uklanjanje linkova.

Bez potvrđenog direktnog linka app nudi jasno označenu pretragu. Ona koristi
`translations.en.title` i engleske autore ili ISBN, ne slobodan prevod lokalnog
naslova. Knjige: Amazon i Open Library. WATCH: JustWatch, plus Netflix pretraga ako
je Netflix naveden u platformi. Pretraga ne potvrđuje rezultat, besplatan sadržaj
ni dostupnost u državi. Lokalnu knjižaru dodaj kad imamo stvarni URL. Bez affiliate oznaka.

## Dopuna postojeće D1 baze

Pri prvom otvaranju prijavljenog Studija v2 šalje autorizovani POST koji dopunjava
stare WATCH/BOOK iteme kojima `accessLinks` nedostaje. Dodaje isključivo pretrage.
Ne dira slike, sadržaj, status, prethodne potvrde ili postojeće linkove, uključujući
namjerno praznu listu. Svaka dopuna ima novu verziju i audit događaj
`access-links-upgrade`. Ponovljeni poziv ne pravi duplikate. Verzijska provjera
sprečava prepisivanje drugog urednika; stari otvoreni editor mora ponovo učitati item.
Javna aplikacija nudi pretrage i prije dopune baze, bez Studio prijave.

## Oba saradnička toka

1. U oba ChatGPT projekta postavi `CHATGPT-INSTRUCTIONS.txt` iz novog paketa.
2. U oba Codexa osvježi skriptu i `random-content-contract.mjs` zajedno. Sačuvaj
   postojeće ZIP-ove izvan mape paketa.
3. Pokreni `node ahmed-content-import.mjs --check`; očekivano `contractVersion:2`.
4. Za svaki batch uzmi prompt iz aktuelnog Studija ili generatora u paketu.
5. Skripta provjerava verziju servera prije prompta i unosa; stariji paket traži
   osvježavanje. Novi ključevi ili lozinka nisu potrebni.
6. Novi itemi idu na pregled u istu D1 bazu. Salem odobrava u browseru.

Jedan ChatGPT razgovor ne ažurira drugi nalog. Javni ugovor, paket i projektno
uputstvo su zajednički izvor pravila. Privatne tokene/lozinke nikada ne stavljaj u njih.
