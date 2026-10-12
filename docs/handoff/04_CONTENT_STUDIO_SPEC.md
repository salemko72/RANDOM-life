# RANDOM Content Studio V1 — AI-assisted Editorial Engine

## A. Vizija i granice
Studio je zasebna zaštićena web aplikacija za urednike/osnivače, ne puka SQL forma. Pokriva **EAT** i **BOOK**, uz zajednički editor, AI asistenta, biblioteku asseta, status objavljivanja i povezanost s Decision Engineom. V1 mora raditi bez potrebe da programer ručno unosi stavke u bazu.

## B. Korisnički tok: EAT
1. Editor odabere EAT i zalijepi URL recepta (alternativa: ručni unos/paste teksta kad je URL blokiran).
2. Server sigurno preuzme dozvoljen javni sadržaj, zabilježi izvor, datum i uslove; zabraniti pristup privatnim/adresama interne mreže (SSRF).
3. AI parsira naslov, sastojke s količinama, porcije, korake, ukupno vrijeme, tip jela, moguće alergene/dijetne oznake. **Ne smije pretpostavljati da su netačni ili odsutni podaci provjereni.**
4. Normalizacija jedinica i naziva sastojaka, jezik i metrike, validacija numerike i logike recepata.
5. AI generiše originalni sažetak i semantičke tagove, ne kopira veliki originalni tekst za objavu.
6. AI generiše novu realističnu sliku gotovog jela zasnovanu na provjerenim sastojcima i tipu jela; označiti generated.
7. Editor vidi uređivački ekran s poljima, upozorenjima, izvorom, predloženom slikom i previewom result ekrana.
8. Editor može popraviti tekst i tagove, regenerisati sliku ili korigovati prompt.
9. Klik **Approve & Publish** radi validacije i atomarnog objavljivanja upotrebljive stavke s assetima.

## C. Korisnički tok: BOOK
1. Editor unese naslov + autor (+ opciono ISBN/jezik/izdanje).
2. Prvo tražiti pouzdane bibliografske izvore/kataloge/API-je; dohvatiti naslov, autora, ISBN izdanje (ako postoji), godine, žanrove/teme, jezik, broj stranica samo kad se mogu potvrditi.
3. Odvojiti činjenice od uredničkih/AI procjena („za koga je“, atmosfera, složenost, tempo, teme). Nikad izmišljati bibliografske činjenice ni citate iz knjige.
4. Generisati originalan kratak opis/recommendation angle i tagove.
5. AI slika: zadani **editorial lifestyle still-life** (knjiga na stolu, uz druge knjige, ambijent, bez lažne precizne naslovnice). Alternativa kompoziting stvarne naslovnice SAMO uz odgovarajuću licencu/dozvolu i verifikovan asset.
6. Editor pregleda bibliografiju, tagove, sažetak, vizual i objavi.

## D. Zajedničke funkcije V1 — predložena obavezna lista
- Admin auth + role permissions (`admin`, `editor` kao predložena podjela).
- Content listing s pretragom, filterima po kategoriji/statusu, sorting, dupliciranjem i soft archive.
- Create, edit, preview, draft, review, publish, unpublish; statusi i audit (ko je šta i kad mijenjao).
- Izvor URL / ISBN / datum pristupa / source title / napomena o pravima / provjerena polja / AI confidence.
- Kategorije + tagovi + validacija kategorijski potrebnih polja.
- AI import na zahtjev + AI enrichment pojedinačnih polja; retry/failure i ručni override.
- Jedan ili više prijedloga AI vizuala, human regenerate/accept; zabrana automatskog objavljivanja.
- Asset pipeline: original + derivatives, preview, kvaliteta, crop focal point, alt text, attribution/status prava.
- Duplicate detection (URL/title/ISBN/normalizovani nazivi), unpublish i ispravka.
- Publish checklist: obavezna polja, nema neprovjerenih blokirajućih činjenica, validna glavna slika, odgovarajuća prava.
- Brojači stanja: objavljeni EAT / BOOK, dashboard prema cilju 50+50.

## E. Strukturirana polja — prijedlog
**Common:** `id`, `category`, `slug`, `title`, `subtitle`, `short_summary`, `long_description?`, `language`, `tags[]`, `audience_tags[]`, `status`, `content_quality`, `source_records[]`, `editor_id`, `approved_by`, `approved_at`, `published_at`, `version`, `primary_image_id`, `created_at`, `updated_at`.

**EAT:** `recipe_yield`, `prep_minutes`, `cook_minutes`, `total_minutes`, `ingredients[{name, quantity, unit, notes}]`, `steps[{order, text}]`, `meal_type[]`, `cuisine[]`, `difficulty`, `dietary_tags[]`, `allergens[]`, `equipment[]`, `estimated_cost?`, `season_tags[]`, `nutrition?` (samo verificirano).

**BOOK:** `canonical_work_title`, `authors[]`, `isbn_13?`, `edition?`, `original_language?`, `available_languages[]`, `publication_year?`, `page_count?`, `genres[]`, `themes[]`, `reading_difficulty?` (urednička procjena), `reading_mood[]`, `reading_length_band?`, `recommendation_reason`, `purchase_or_library_links?` (kasnije uz provjeru dostupnosti).

Sva polja s `?` su opciona; sigurnosni i urednički status nisu. Pravi schema/validacijski model odrediti tek nakon potvrde granice Content vs Decision.

## F. AI architecture / guardrails
- OpenAI API se poziva **isključivo sa servera** uz secret manager/env var; ChatGPT Plus pretplata i OpenAI API billing su odvojeni.
- Za rezultate koristiti strogo definisanu JSON shemu, provjeru tipova, schema validation i razliku `value/source/confidence/verified` gdje treba.
- Nije potreban autonomni web crawler: editor pokreće uvoz za poznat URL ili bibliografski unos.
- Izvorne HTML stranice tretirati kao nepouzdan podatak (prompt injection), nikada kao instrukcije za AI/alat.
- External connectors za knjige ne birati bez procjene prava, quota i tačnosti (npr. Open Library / Google Books su opcije, ne potpisana integracija).
- Ispitati pravila korištenja izvornog teksta i slika, ne masovno kopirati recepte/izdavačke blurbove.
- AI generisana slika može biti autorski nezavisna od fotografije izvora, ali to **ne garantuje potpunu pravnu sigurnost niti preciznost hrane/korica**. Ne imitirati namjerno konkretnu zaštićenu fotografiju.
- Budget limit, rate limit, retries, idempotency, task queue, evidencija troška po itemu, throttling generisanja.

## G. Image pipeline (PROPOSED)
Generisanje visokokvalitetnog originalnog vizuala → AI/editor accept → provjeren crop 4:5 i/ili 16:9, proizvodi izvedene responsive verzije (npr. 480/960/1440px) → AVIF primarno / WebP fallback → R2 objekti s verzioniranim ključevima → CDN/cache → metapodaci, putanje, focal point, width/height, alt, rights u DB. Ne pohranjivati image binarne blobove u D1. Ne prebrisati original; sačuvati za budući redesign. Veličine i quality parametre odabrati testiranjem na stvarnim slikama; nisu fiksno usvojeni.

## H. DoD za urednički tok
Editor može od URL-a ili naslova knjige doći do validiranog objavljenog itema **bez SQL-a ili intervencije programera**; neuspjeli import ne gubi draft; može popraviti AI greške; ne može objaviti nevalidan predmet; korisnička aplikacija prikazuje novu objavljenu stavku; povlačenje iz objave radi; bilježi se autor i izvor, trošak i audit.
