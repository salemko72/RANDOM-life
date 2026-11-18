# Predaja UI prijevoda — 18.11.2026.

Aplikacijski source: **2c0ce132f6dcfca7967143f880e0a949e40dae59**. Nije release build SHA.

## Šta je pripremljeno

Grana `codex/salem-ui-translations` nadograđuje `codex/salem-i18n-foundation` (basef4ae7e299a8a241220d05eee368fee3007f96c86). Četiri rječnika sadrže po365ključeva, ukupno1460draft vrijednosti: neutralni španski, brazilski portugalski, njemački(du) i italijanski(tu). Rječnici su u [web/i18n](../apps/client/src/web/i18n/README.md).

Zajednički helperi pokrivaju postojeću UI mapu i eksplicitne English/BHS poruke u web ekranima: početno podešavanje, preferencije, meni, rezultat/detalji, dijeljenje, greške i cache. Dinamičke image/streaming/category oznake koriste imenovane parametre; React ih prikazuje kao tekst. Postojeći ENG/BHS izbori i ponašanje ostaju sačuvani. Dio unosa je historijski/archived; identičan key count nije potvrda prevedenog kataloga.

## Šta još nije završeno

- Ova4jezika nisu aktivirana u biraču niti u native deklaracijama. Aktivni Locale i dalje je en/bs, uz prethodno pripremljen automatski/ručni izbor.
- Nije preveden online katalog467stavki niti100-item offline rezerva. Nisu mijenjani recepti, sastojci, količine, nutritivni podaci, alergeni, prehrambeni filteri, artwork ili source/rights podaci.
- Nije urađena ljudska lektura ili medicinska validacija. Osjetljivi tekstovi su ciljano pregledani za očuvanje značenja, uz automatsku provjeru ključeva/parametara.
- Raspored cijele aplikacije na4nova jezika, veći font i fizički iPhone/Android još nisu provjereni. Postojeće browser regresije ostaju ENG/BHS.
- Native startup greške, vanjske legal/support/store stranice, UMP i share-server/parser ugovori idu u activation audit prije proširenja aktivnog Locale.

## Provjere

`npm test`, `npm run typecheck`, `npm run build:preview`; UI key/placeholder/boundary whitespace testovi; statička provjera translation callova i preostalih sirovih JSX/accessibility tekstova. Jedini dozvoljeni sirovi JSX tekstovi su imena LifeSpinner/Spotify i univerzalna jedinica min. `node scripts/inventory-ui-copy.mjs --check` provjerava pokrivenost trenutnog sourcea; historijski ključevi se čuvaju.

Browser regresije: auto/manual/restart/storage failure i očuvanje drafta, create/edit profila320/390, footer menija320x568/320/390/430, svih5kategorija i Spin again sa povratkom kroz Home/detalje. Konačni rezultat i puni source SHA nalaze se u [sesiji](../collaboration/sessions/2026-11-18-salem-ui-translations-01.md).

## Tačan sljedeći korak

Pripremiti mali pilot iz stvarne važeće baze: EAT, BOOK, WATCH, MOVE i GO, sva4jezika. Za EAT očuvati broj/redoslijed sastojaka/koraka, količine/jedinice, porcije, nutritivne vrijednosti i upozorenja. Ne izmišljati službene prevode naslova knjiga/filmova. Pilot je lokalni pregledni artefakt, bez produkcijske publikacije.

Nakon pilota prevesti preostale zapise i offline rezervu te proširiti zajednički content/schema/share ugovor, uz zadržavanje postojećih recipe-wording korekcija. Tek poslije sadržaja i QA proširiti ready locale listu, profil/menu birač i native platform deklaracije. Izdanje traži nov zamrznut source i provjeru novih build brojeva/kvote; nema odobrenja za merge, deploy ili store slanje u ovom zadatku.
