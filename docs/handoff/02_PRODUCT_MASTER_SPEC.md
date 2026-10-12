# RANDOM — Product Master Specification (prijelazna verzija)

## 1. Vizija
**RANDOM — Decide Less. Live More.** Nije generator nasumičnih stvari. To je personalizirani decision engine koji razumije korisnika, trenutnu situaciju i kvalitetnu bazu preporuka, pa predlaže **jednu dobru odluku**. Glavno pitanje korisnika: „Šta je dobro da uradim upravo sada?” Dobitak: manje odlučivanja, više djelovanja; uz mali osjećaj iščekivanja pri SPIN-u.

## 2. Trenutni scope V1 — DECIDED
Dva korisnička vertikala: **EAT (recepti)** i **BOOK (preporuke knjiga)**. Do početka eksternog testiranja cilj je najmanje **50 objavljenih i provjerenih recepata + 50 objavljenih i provjerenih preporuka knjiga**, ukupno minimum 100 stavki. V1 ima funkcionalan web Content Studio s AI pomoću i generisanjem/optimizacijom slika, ljudskom provjerom i objavljivanjem.

Nisu automatski u V1: MOVE, GO, WATCH, DO, LEARN, restoran/delivery integracije, kupovina knjiga, globalna lokalizacija, društvena mreža i napredni agenti. Arhitektura smije pripremiti modularno dodavanje drugih kategorija.

## 3. Korisničko iskustvo
**Home:** Wheel dominantan, mekši razigran vizuelni identitet, minimalna gužva i trenje. **SPIN:** jedan korisnikov klik; sistem u pozadini bira / rangira, ne traži višestruko ručno vrtenje. **Result:** rezultat i korisna akcija zauzimaju glavni dio ekrana; mini-wheel ili SPIN AGAIN ostaje dostupan. Kompletna animacija, izbor kategorije vs konkretne stavke te raspored result ekrana su još **OPEN**, iako se osnivači slažu da je jedan SPIN = jedna konačna preporuka. Wheel treba pružiti zabavno iščekivanje, ali bez agresivnih gambling obrazaca.

**Spin Again** ne znači grešku; to je odgovor korisnika koji treba zabilježiti. Ponovljeno odbijanje može povećati raznolikost, ali ponašanje poslije trećeg odbijanja je **OPEN**.

## 4. Personalizacija
Pristup: kratak onboarding + učenje iz eksplicitnih preferencija, konteksta i interakcija, uz korisnikovu mogućnost pregleda/ispravke. Obavezna ograničenja (alergije, prehrana) imaju veću težinu od preferencija i iznenađenja. Koristiti samo kontekst za koji imamo osnov i dozvolu; bez skrivene procjene osjetljivih karakteristika.

Primjeri EAT: tip obroka, kuhinja, vrijeme pripreme, sastojci, porcije, prehrambena ograničenja, težina, cijena/budžet samo gdje je podatak smislen i provjeren. BOOK: žanrovi, teme, jezik izdanja, dužina, nivo zahtjevnosti, prethodno čitano / odbijeno, format ako je relevantno. Želimo učiti iz feedbacka bez zatrpavanja korisnika formularima.

## 5. Decision Engine — predloženi princip
`Profile + Context + Eligible Published Content + History -> hard filters -> context/personal-fit scoring -> diversity/novelty -> controlled randomness -> one result`.

Prvo eliminisati: neobjavljeno, nedostupno, već iskorišteno ako treba, alergene ili neprihvatljive/isključene stavke, neodgovarajući jezik i druga obavezna ograničenja. Zatim bodovati relevantnost i kvalitet; slučajnost birati unutar prikladnog skupa, ne potpuno nasumično. Logirati **zašto je opcija izabrana** na strukturiran način, bez izlaganja osobnih podataka i internog scoringa drugim korisnicima. Početne težine su **OPEN**: pitanje 24 u anketi nema valjano međusobno jedinstveno rangiranje.

## 6. Model odluke naspram content itema — OPEN
Ne smije se prećutno zaključiti da su „content“ i „decision“ ista stvar. Jedna knjiga može imati jedan ili više načina preporuke / situacijskih prezentacija; recept može biti content, a „skuhaš ovaj recept večeras“ preporučena akcija. Predložiti jednostavnu domensku granicu i testirati na EAT/BOOK prije gradnje generičkog univerzalnog enginea.

## 7. Identitet i estetika
Nije strogi productivity app niti hladni AI dashboard. Poželjno: pastel/lavender, mekše zaobljene kartice, izražena ali uredna tipografija, mnogo zraka, editorial slike/ilustracije, povremena tamnoplava, suptilan bottom nav, jedna jača akcent boja; dopustiti zabavan osjećaj. Referentne slike u `visual_refs/`, istorijski deck u `source_docs/`. Nije finalno usvojen piksel-po-piksel dizajn.

## 8. Kako mjerimo uspjeh (PROPOSED)
Korisnik brzo dolazi do upotrebljive preporuke; razumije šta da uradi; ponavlja posjete; skraćuje vrijeme donošenja odluke; prihvata preporuke; povremeni skip je normalan. Pratiti anonimizovanu metriku: impressions, spin, accept, spin again, save, open details, return; privatnost i consent prije implementacije.

## 9. Rizici
Nedovoljna korisnička potreba; zabavnost ne vodi retenciji; premalo raznolikih podataka za relevantne preporuke; prava na slike/opise; halucinacije o knjigama i receptima; alergije; skupi AI poslovi i storage; preambiciozan scope; težak onboarding; urednička uska grla; zagušen sadržaj/ponavljanja; platforma (PWA/native) još nije izabrana.
