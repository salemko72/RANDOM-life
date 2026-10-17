## 17 October 2026 — shared content contract v2

WATCH/BOOK support optional accessLinks. Read docs/content/ACCESS_LINKS_V2.md.
Both contributor accounts must use the current kit and Studio prompt; public contract
at /api/content-contract. Old ZIPs remain compatible. Direct links require individual
human approval; searches never assert availability. Existing D1 items are enriched
idempotently via an authenticated Studio POST, preserving content and approvals.
Do not create another database, pay for APIs, or use local storage as final destination.

# RANDOM — razvojni handoff, 12.10.2026.

Najnovije direktne odluke korisnika imaju prednost nad originalnim handoffom.

## Potvrđeno
- Koristiti isključivo postojeći salemko72/RANDOM-life. Ne praviti novi repo.
- EAT = recepti; BOOK = preporuke knjiga. Minimum 50 različitih validnih, odobrenih i objavljenih stavki po kategoriji prije eksternog testa.
- Jedan SPIN bira jednu preporuku iz odobrenog kataloga. Nema AI API poziva pri SPIN-u.
- Testna faza: $0 dodatnih troškova uz postojeću ChatGPT pretplatu. Bez OpenAI API integracije, plaćenog plana, automatskog upgradea i plaćenih simulatora.
- Korisnik želi Expo/React Native aplikaciju za Android/iOS, web preview u browseru i Expo Go na stvarnim telefonima. Web preview nije native emulator. Birati zavisnosti kompatibilne s Expo Go; tačnu stabilnu SDK verziju provjeriti prije scaffolda.
- Content Studio je privatni web alat. Studio priprema standardizovani prompt; urednik ručno koristi ChatGPT za tekst i sliku, vraća JSON i sliku u Studio, provjerava i objavljuje. Pretplata nije API kredit. Nema automatizovanja ChatGPT web interfejsa radi zamjene API-ja.

## Stvarno kreirano i provjereno
Cloudflare account: 21db5c0516fc09fed9e4b49aed03f06d
D1 database: random-test-content
D1 ID: d47c89e2-e2ab-42fd-be29-dce5ba809b6d
Binding koji konfiguracija treba koristiti: CONTENT_DB
Region: EEUR; prazna baza, bez tabela, migracija i podataka.
POST kreiranje i naknadni GET vratili su HTTP 200. D1 write pravo za kreiranje je time potvrđeno; schema/query operacije nisu testirane.

## Nije kreirano / nije potvrđeno
- Workers API/web deployment, R2, Queue, Access aplikacija, Expo projekt/account, schema i aplikacijski kod.
- Čitanje Cloudflare subscriptions kroz MCP vratilo je authentication error. Plan i preostale kvote nisu potvrđeni. Ostali D1 pozivi rade; ne tražiti ponovno povezivanje svih servisa.
- Ne pretpostavljati da drugi/cloud chat ima lokalni Cloudflare MCP ili lokalne datoteke. Prvo provjeriti njegove alate; za vanjske radnje bez pristupa pripremiti konfiguraciju i koristiti lokalni chat.
- Korisnički auth/anonimni pristup, urednički auth i content/decision granica nisu zaključeni. Razvoj može početi s lokalnim/mock podacima, ali admin endpointi ne smiju biti javno nezaštićeni.

## Plan razvoja i konfiguracija
1. Pročitati originalne dokumente 00–06 i ovaj dodatak. Ne implementirati ranije predloženu OpenAI API automatizaciju.
2. Pregledati stanje postojećeg repo/check­outa, AGENTS.md i izmjene prije rada. Ne prepisivati tuđi rad.
3. Pripremiti Expo klijent, privatni web Studio, zajedničke validacijske ugovore i Workers API. Početni razvoj lokalno, bez potrebe da svi cloud resursi unaprijed postoje.
4. Konfigurirati CONTENT_DB navedenim ID-jem. Migracije tek uz pregled modela podataka.
5. APP/API javni URL u Expo konfiguraciji smije biti javna vrijednost; serverske tajne nikada EXPO_PUBLIC_*.
6. Testne slike inicijalno kao statički asseti uz deployment; privatni originali lokalno. To zahtijeva build/deploy za promjenu javnih slika. Cloud upload u Studio nije završen ovim pristupom; trajno R2 upload rješenje tek nakon provjere zajedničkih kvota i kontrole troška.
7. Bez Queue/AI poslova u ovoj ručnoj AI fazi. Studio treba JSON import, upload/obradu lokalnih slika, validaciju, source records, draft/review/publish/unpublish, revizije i brojač 50+50.
8. Siguran import URL-a, validacija bibliografskih činjenica, prava na izvore/slike, blokiranje privatnih adresa i redirecta. AI ne potvrđuje alergene ni ISBN bez izvora.
9. Expo Go testirati na Androidu i iPhoneu. Expo CLI i fizički iPhone koriste isti Expo account prema aktuelnim Expo uputama. Lokalni dev server mora biti dostupan telefonu: LAN ili tunnel; cloud preview URL nije automatski Expo Go QR.
10. Testirati jedan EAT i BOOK tok, objavu/povlačenje, hard filters i jedan SPIN. 50+50 je zaseban urednički release gate.

## Trošak i izolacija
D1/Workers/R2 kvote i billing su account-wide. Ne mijenjati računsku pretplatu jer drugi projekti koriste račun. Ne aktivirati paid opcije ni R2 prije provjere plana/kvota. Prazna D1 baza nije dokaz da je cijela aplikacija besplatna ili spremna.
Pomaaalodesk Workers/R2 i bookweb pripadaju drugim projektima: ne koristiti podatke, ključeve, bindinge ili resurse.

## Izvori
https://docs.expo.dev/get-started/start-developing/
https://docs.expo.dev/get-started/set-up-your-environment/
https://developers.cloudflare.com/d1/platform/pricing/
https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
https://developers.cloudflare.com/r2/pricing/
