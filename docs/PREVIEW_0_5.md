# RANDOM preview 0.5

Stalni preview: https://random-life-preview.pages.dev/
Studio: https://random-life-preview.pages.dev/studio.html

Demo sadrži 5 EAT, 5 READ, 5 WATCH, 6 MOVE (po dvije gym, trim i joga) i 4 GO prijedloga. DO još nije aktivan. GO su ilustrativni planovi, bez stvarnih lokacija, termina ili cijena.

Autor knjige je odmah ispod naslova. Ispod srca nalazi se oznaka već čitao/gledao/probao: označeni sadržaj isključen je iz budućih spinova. Oznaka se može poništiti iz historije ili favorita. Spin again ostaje u desnoj traci. Uže oznake uz naslov imaju smeđu podlogu sa 60% neprozirnosti i bijele ikone/tekst.

Desni panel sadrži sastojke za EAT, druga djela autora za READ, tematski povezane naslove za WATCH, opremu i sličnu aktivnost za MOVE te podsjetnik za GO. Naslovi koji nemaju puni demo zapis prikazuju informaciju, bez izmišljenog sadržaja ili reprodukcije.

## Lokalni testni profil

Upitnik pamti ime, interesovanja, vrijeme, energiju, društvo, alergene, vegetarijanski izbor i gluten/laktoza intolerancije. Slobodni opis drugih intolerancija služi kao podsjetnik; automatski filter ne tumači taj tekst. Gluten/laktoza filter zahtijeva odgovarajuću oznaku u receptu. Urednik mora provjeriti stvarne sastojke i alergene.

Engine koristi izričite odgovore i, uz uključeno lokalno učenje, otvaranje, spremanje, prihvatanje i preskakanje. Prikaz sam po sebi nije negativan signal. Ograničenja hrane i već konzumirani sadržaj ostaju isključeni. Učenje se može isključiti ili obrisati u profilu.

Browser čuva profil i historiju lokalno za ovu web adresu. Expo Go WebView prenosi stanje u AsyncStorage prije sljedećeg pokretanja. Ovo nije stvarna autentikacija, serverski račun ili sinhronizacija uređaja. Brisanje podataka aplikacije/browsera briše profil. Ponovno otvaranje na fizičkom telefonu još nije provjereno; provjereni su most za pohranu i Android/iOS export.

## Studio i slike

Svaki korak ima podsjetnik: odabir izvora, JSON, slika, ljudska provjera i spremanje. Preview Studio čuva sadržaj u lokalnom IndexedDB-u; nije javni administratorski backend.

Atlas je jedna originalna slika sa 100 sastojaka. Nazivi i sinonimi povezuju se sa stabilnim tagovima; urednik može ručno promijeniti tag. Nepoznati sastojak ostaje generičan. Stare JSON datoteke bez tagova ostaju podržane. Nova verzija atlasa mora zadržati identitete i postojeće koordinate ili eksplicitno verzionirati mapu.

Uvoz slike čuva original i pravi proporcionalni WebP, kvaliteta 84%, sa najdužom stranicom do 1440 px. Nema povećavanja, razvlačenja ili automatskog rezanja. Prikazane su dimenzije i veličina izlaza. Odobrenje sadržaja, prava slike i alergena ostaje ljudsko. Nema OpenAI API poziva ili aktiviranja plaćenih servisa.
