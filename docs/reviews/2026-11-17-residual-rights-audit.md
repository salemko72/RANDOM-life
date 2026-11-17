# Preostali copyright tragovi — 17.11.2026.

**Zaključak: slike BOOK/WATCH su sanirane, ali potpuna prava na sav sadržaj nisu potvrđena.** Ovo je read-only inventar sa konkretnim tragovima, ne tvrdnja da su navedene stavke nezakonite. Vanjski URL, urednički reviewed ili rightsConfirmed sami ne dokazuju ni kršenje ni licencu.

Pregledani source: `0863aea3ae2ba0ca5e1f6ff49b3374634af0b977`. Svježi javni GET `/api/catalog`:467 stavki; lokalni offline reserve:100. [Matrica svih567 zapisa](2026-11-17-residual-rights-audit.json) navodi ID, izvor i image flagove, bez privatnih korisničkih podataka. Hashovi snimaka su u matrici.

## Potvrđeno popravljeno

- Svih273 BOOK/WATCH javnih stavki ima generičku sliku; isto vrijedi za40 BOOK/WATCH offline stavki. Runtime `readConsumerCatalog` dodatno primjenjuje `withGenericArtwork`, i na cached sadržaj.15 originalnih generičkih asseta uključeno je lokalno; postojeći dokument `generic-artwork-v1-sources.json` čuva trag njihove izrade. Ovo nije nova vizuelna/pravna analiza svakog AI asseta.
- Novi automatski Studio artwork koristi generičke slike. Filmovi i knjige ne trebaju ponovno stvaranje postera/omota.
- Netflix u pregledanom UI putu je ispis platforme kao tekst (`streaming-badge`), uz Netflix CSS boju; nije učitan službeni logo u tom putu. Sam naziv servisa nije isti problem kao preuzeta grafika. Ne tvrditi partnerstvo ili potvrđenu regionalnu dostupnost.
- Fontovi Manrope i DM Serif Display dolaze iz @expo-google-fonts, sa lokalnim LICENSE_FONT dokumentima SIL OFL1.1. Komercijalna upotreba fonta ne zahtijeva kupovinu; poštovati uslove redistribucije i sačuvati licence.

## Šta ostaje za završiti

| Prioritet | Konkretan trag | Šta uraditi |
|---|---|---|
|1| Novi tekstovi17 low-phosphate recepata još su draft: javni sažeci i dalje17/17 odgovaraju `before` tekstu. | Urednički pregledati i primijeniti paket kroz ovlašteni Studio workflow. Ne pretpostavljati da to zatvara sve uslove/licence ili medicinski review. |
|1|147 EAT recepata:116 imaju vanjski source URL,31 ga nema.18 potiče iz kidney-health izvora;17 njih je u rewrite paketu, a **Supa od pečenih paprika i kokosa — KNI** nije. Preostalih98 vanjskih recepata nije obuhvaćeno tim paketom. | Pregledati konkretne opise/upute i porijeklo slika i nutritivnih podataka. Pri pisanju vlastitih kratkih uputa razlikovati kulinarske činjenice od tuđeg kreativnog teksta. Ne uklanjati provenance da bi se stvorio privid originalnosti. |
|1|101 WATCH tekstova/metapodataka:55 TMDB,20 Rotten Tomatoes,11 Criterion,7 BFI/BFI-data,3 IMDb i5 drugih. Nema pronađenog dokaza komercijalne TMDB dozvole u pregledanoj predaji. | Utvrditi šta je stvarno preuzeto/API dobiveno, a šta samostalno napisano. Za TMDB provjeriti ugovorne uslove komercijalnog korištenja odvojeno od copyrighta pojedine činjenice. Provjeriti sinopsise/prevode, atribuciju i licence po polju; samostalne kratke opise pisati gdje je potrebno. |
|1|172 BOOK stavke:167 vanjskih izvora,5 bez URL-a;55 vodi na jergovic.com. | Pregledati sažetke i preporuke prema originalu; bibliografske činjenice odvojiti od tuđeg promotivnog teksta i književnih odlomaka. Generičke slike ne rješavaju licencu eventualno preuzetog teksta. |
|2| Jedna slika ima `generated:false`, `rightsConfirmed:true`: **Piletina tikka masala**, ID `418f8826-b287-4bf7-b720-7e32ab25da93`, path `/media/611df63b-fe64-496b-b685-138d4333c32a-745fdf14.webp`. Source je RecipeTin Eats; napomena kaže da originalna fotografija nije preuzeta, ali traži pregled nove ilustracije. | Pronaći dokaz vlastite generacije/licence i uskladiti metadata; ako ga nema, pripremiti provjerenu originalnu zamjenu. Slika je vizuelno pregledana, bez uočljivog vodenog žiga; izgled ne dokazuje porijeklo. `generated:false` ne znači automatski tuđu fotografiju. |
|2|194 trenutna source rightsNote polja i dalje spominju poster/cover/omot (101 WATCH i93 BOOK), iako je image sada generički. | Pregledati i uskladiti zastarjele napomene bez brisanja historije/provenance ili izmišljanja prava. Ovaj broj znači tekstualni trag, ne194 stvarna postera. Pregledati i ENG/BHS napomene. |
|2| Offline reserve100 zadržava izvorne tekstove;8 recepata iz rewrite paketa je i u njemu. | Poslije odobrenih korekcija osvježiti rezervu, oba jezika i novi zajednički build. Izmjena online baze sama ne mijenja već instalirani offline paket. Testirati offline i cached rezultate. |
|3|27 MOVE stavki,11 sa vanjskim izvorima uključujući Wodwell5;20 GO opisano kao originalne korisničke ideje. | Provjeriti MOVE opise i izvedbu slika. Generičke vježbe/činjenice nisu same po sebi tuđi autorski tekst. Nedostajući URL kod preostalih zapisa nije dokaz originalnosti. |
|3| Stari `/api/artwork` i `/api/artwork-image` kod za TMDB/Open Library ostaje u workeru; Studio sadrži stare import/helper putanje, iako je automatski BOOK/WATCH odabir generički. | Zasebno ukloniti/onemogućiti nepotrebne stare mogućnosti kada je dogovoreno, da ih buduće izmjene slučajno ne vrate. Samo postojanje koda nije dokaz trenutnog povlačenja ili prikazivanja tuđih slika. |
|3| Font licence postoje u node_modules; pregledani build/staging kod ne pokazuje izričit prijenos LICENSE_FONT teksta u standalone HTML. | Uključiti odgovarajuće licence/third-party notices uz distribuirane fontove i provjeriti finalni AAB/IPA. Nije dokazana odsutnost iz finalnih native artefakata; oni nisu ponovo preuzeti/pregledani u ovom auditu. |

## Najpraktičniji redoslijed bez kupovine

1. Objavljeni draft17 recepata urednički pregledati; dodati pregled18. kidney recepta i jedne nejasne slike.
2. Pregledati WATCH/BOOK sažetke i vanjske EAT tekstove prema izvorima; prepisati eventualno preuzetu kreativnu formulaciju svojim kratkim opisima. Prvo riješiti identifikovane ugovorne/API uslove; ne proglašavati sve činjenice zabranjenim.
3. Uskladiti source napomene i pripremiti font notices. Sačuvati tragove vlastitih AI ilustracija.
4. Nakon odobrenih content izmjena osvježiti offline rezervu i pripremiti zajednički release source. RIGHTS-001 zatvarati tek uz dokumentovane dokaze, ne na osnovu promjene teksta ili disclaimer-a.

## Granice pregleda

Nisu uspoređene sve rečenice s izvornim sajtovima niti pribavljene njihove važeće licence. Privatni draftovi, historijske revizije, arhivski ZIP-ovi/downloadovi, svi stari R2 asseti, store screenshotovi i finalni native paketi nisu pregledani u cijelosti. Nije rađen potpuni audit licenci svih npm/SDK zavisnosti. Javni `rightsConfirmed:true` nije nezavisna potvrda prava;466 generated flagova nije dokaz da je svih466 slika originalno generisano. Nađeni tragovi određuju šta provjeriti, ne dokazuju pojedinačno copyright kršenje.

Nema izmjene baze, izvora, flagova, recepata, UI-a ili produkcijskih resursa. Nema builda, deploya, mergea, troška ili kontakta s nosiocima prava.
