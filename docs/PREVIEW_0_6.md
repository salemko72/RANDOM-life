# RANDOM life preview 0.6

App: https://random-life-preview.pages.dev/
Studio: https://random-life-preview.pages.dev/#studio

- Logo: razmaknuti RANDOM i manji pravi serifni kurziv life.
- Choose category; DO uklonjen, wheel ima pet jednakih sektora po 72°.
- Studio podržava EAT, READ (interni BOOK), WATCH, MOVE i GO, sa zasebnim strukturiranim podacima i promptovima.
- Prompt kopiran ima zelenu oznaku i vrijeme. Pamti se nakon osvježenja i prestaje važiti nakon promjene izvora/kategorije. To potvrđuje kopiranje, ne automatsko slanje u ChatGPT.
- Obrazac se automatski čuva lokalno. Poslije uspješne objave se prazni za novi unos. Biblioteka ostaje.
- Promjena naslova/izvora otvorenog recepta blokira slučajno prepisivanje; koristi „Sačuvaj kao novi nacrt“.
- Historija sačuvanih unosa omogućava učitavanje ranije verzije kao novog nacrta. Ne može oporaviti unos koji nikada nije sačuvan ili podatke iz drugog browsera/adrese.
- Backup JSON sadrži biblioteku i kumulativni popis ilustracija. Mediji se preuzimaju odvojeno.
- Namirnice bez ilustracije kumulativno se pamte iz svih sačuvanih recepata i validnog trenutnog unosa. Popis sadrži nazive i recepte, izbjegava duplikate i može se kopirati kao prompt za novi atlas. Originalni atlas i tagovi se ne mijenjaju. Nove ilustracije traže provjeru i povezivanje u narednoj verziji.

Lokalna biblioteka zadržava postojeće IndexedDB ime i verziju; popis ilustracija koristi odvojenu lokalnu bazu. Ne traži zatvaranje starih tabova radi nadogradnje biblioteke.

D1 migracija 0003 proširuje kategorije uz očuvanje sadržaja i uredničkih događaja. Provjerena je lokalno, nije primijenjena na udaljenu D1 bazu. Objavljen je samo besplatni statički preview. Studio i dalje nije udaljeni administratorski servis.

Provjere: 49 unit/API testova, TypeScript, browser tok starog zapisa/novog unosa/objave/ponovnog otvaranja, svih 25 demo izbora i pet sektora. Višejezični sistem je sljedeći odvojeni korak; ovo izdanje još sadrži mješovite UI natpise.
