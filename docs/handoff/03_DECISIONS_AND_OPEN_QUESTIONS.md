# Registar odluka — kanonski, 12.10.2026.

## DECIDED (potvrdio Salem tokom razgovora; zajedničku formalnu potvrdu dodatno evidentirati)
| Tema | Trenutno stanje | Datum |
|---|---|---|
| V1 kategorije | EAT + BOOK | 12.10.2026 |
| Prag za testere | 50 recepata + 50 knjiga, minimum 100 kvalitetnih preporuka | 12.10.2026 |
| Content Studio | Funkcionalan od početka; unapređivaće se | 12.10.2026 |
| AI workflow | Link recepta ili naslov+autor knjige → prikupljanje podataka → normalizacija → tagovi → predložena slika → uređivanje/odobrenje → publish | 12.10.2026 |
| Slike | Generisanje originalnih lifestyle/food scena; resize/crop/kompresija; moderno efikasno serviranje | 12.10.2026 |
| Kontrola objave | Urednik ima završnu riječ, AI ne objavljuje bez pregleda | 12.10.2026 |
| Radni servisi | GitHub, Cloudflare, OpenAI API nalog otvoreni | 12.10.2026 |
| Github / CF | GitHub `salemko72`; Cloudflare `salemko@gmail.com` | 12.10.2026 |
| Centralni kontekst | Zajednički ChatGPT projekt Random life; kod po mogućnosti zajednički GitHub | 12.10.2026 |

**Napomena o statusu:** Ovime su potvrđene Salemove posljednje direktne smjernice; nisu dokaz zasebnog Ahmedovog glasanja. Nakon sastanka osnivača ažurirati status `JOINTLY RATIFIED`.

## RANIJE USAGLAŠENI PRINCIPI (anketa / razgovori, ali neke implementacijske nijanse ostaju OPEN)
Wheel dominira Homeom; jedan SPIN vodi do konačne preporuke; AI priprema a čovjek odobrava; UX treba biti zabavan i jednostavan; ozbiljan MVP s backendom i profilom; kontrolisana slučajnost; kontekst ne tražiti prije svakog spina.

## SUPERSEDED (ne implementirati prema starom)
- V1 sa šest kategorija ili EAT+MOVE: zamijenjeno EAT+BOOK.
- Globalna lokalizacija, GO/MOVE/WATCH/DO/LEARN kao obavezne V1 kategorije: nisu potvrđene.
- Starija preporuka da Content Studio dođe kasnije: zamijenjena obavezom Content Studija u V1.
- Tehničke varijante (D1/R2, PWA, Supabase, Cloudflare Workers) su prijedlozi, ne konačan izbor.

## OPEN — osnivački/produktni razgovor
1. **Prvi ciljni korisnik / jasna situacija upotrebe:** Ahmed traži fokus; Salem želi širu viziju.
2. **SPIN animacija:** šta vizuelno bira Wheel ako postoje samo EAT i BOOK, kategorizacija ili konkretan item, kako izgledaju prelazi?
3. **V1 onboarding:** šta eksplicitno pitamo za EAT/BOOK; šta pratimo; mogu li anonimni korisnici probati aplikaciju?
4. **Dizajn rezultata:** glavna akcija, save, share, time, re-spin, detalji, navigacija do knjige/recepta.
5. **Spin Again:** feedback samo negativan ili više razloga; pravilo nakon 3 odbijanja.
6. **Model sadržaja i odluke:** jedan entitet ili odvojene preporuke i katalog; kako djeluju tagovi.
7. **Decision scoring:** tvrda ograničenja, početne težine, učestalost iznenađenja, duplikati.
8. **V1 platforma:** mobile-first PWA vs iOS/Android native/cross-platform; status nije potvrđen.
9. **Auth i infrastruktura:** Cloudflare D1/R2/Workers vs druge opcije; role, deploy proces, domene.
10. **Content Studio pravila:** dostupni izvori, slike knjiga, pravne dozvole, cijena AI, deduplikacija, uredničke uloge.
11. **Šta tačno znači 50 knjiga:** naslovi, izdanja/jezici, lokalne dostupnosti, udio žanrova.
12. **Acceptance i tester plan:** ko su testeri, koliko njih, koje metrike i minimalna kvaliteta.
13. **Uloge Salema i Ahmeda:** vlasništvo nad repozitorijem, pristupi, uređivački workflow, scope odgovornosti.

## Ne stavljati pod tepih
V1 može biti tehnički dobar ali nepotreban ljudima. Stoga preporučiti rani mali validacijski test, ne pretvarati MVP u višegodišnji megaprojekat.
