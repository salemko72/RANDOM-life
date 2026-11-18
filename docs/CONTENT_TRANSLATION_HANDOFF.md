# Predaja prijevoda sadržaja — 18.11.2026.

App/catalogue source: **b8fa083ea010468a0cb42b67b540dc2516fa42d3**. Review builder/source: **20bc5d9657cb767c7bbf9b5004a755deb47e7f83**. Nije release/native build SHA.

## Rezultat

Cijeli pinovani katalog467stavki ima es/pt-BR/de/it draftove:1868potpunih record translations,3038jedinstvenih tekstova×4. EAT147,BOOK172,WATCH101,MOVE27,GO20. Svih100offline stavki dobija400prijevoda kroz isti consumer adapter; originalni cache/snapshot byteovi i checksum nisu prepisani. UI365ključeva pojeziku naslijeđen je iz prethodne faze.

[Podaci/upute](../content/i18n-2026-11-18/README.md), [review download](../review-previews/README.md), [sesija](../collaboration/sessions/2026-11-18-salem-content-translations-01.md).

## Očuvano ponašanje

EN/BHS i base podaci ostaju nepromijenjeni u odnosu na odobrenu lokalnu projekciju. Količine, porcije, nutritivne procjene, alergeni, ID-evi, source URL-ovi i filteri se ne prevode/ne konvertuju. BOOK/WATCH naslovi i autori ostaju postojeći; opisi/žanrovi/razlozi su prevedeni. Sastojci, koraci i oprema prate originalni redoslijed i broj elemenata.40unit glossary razdvaja kašičicu/kašiku/šolju i čuva US/UK/oz/lb identitet.

Adapter dodaje samo nedostajuće blokove i čuva postojeće serverske prijevode. Veže ID, verziju i kanonski fingerprint protected source+English sadržaja; nepoznata urednička promjena dobija postojeći sadržaj umjesto zastarjelog prijevoda.40offline BOOK/WATCH ima stariji version/updatedAt/accessLinks od online kopije: samo tačno zabilježene alternative mogu koristiti isti, identičan tekst. Svaka druga protected-source razlika odbija dodatak. Isti nepromijenjeni snapshot obrađuje se jednom radi izbjegavanja zastoja pri svakom spinu; novi items array ponovo prolazi provjere.

## Stanje isporuke

Ovo je pripremljen/testiran source i izolovan preview. **Produkcijska D1 baza nije mijenjana, nema deploya, mergea, novog iOS/Android builda ili store slanja.** Aktivni produkcijski Locale/birač/native deklaracije ostaju en/bs; šest jezika je dostupno samo u preglednom bundleu. Ne praviti native build iz ovog sourcea očekujući aktivirana četiri jezika bez naredne activation faze.

Svi novi translation.reviewed flagovi sufalse. Postojeći historijski source notes/EN/BHS odobrenja ne predstavljaju lekturu novih jezika, medicinsku validaciju niti zatvoren rights audit. Browser QA je390px i postojeći ENG/BHS regresioni ekrani; stvarni Mac file-open, fizički Android/iPhone i konačni jezički pregled nisu urađeni.

## Važno prije bilo kakve D1 publikacije

1. **Kompatibilnost starih klijenata:** build5 i stariji source imaju strict translations enum bez pt-BR/it. Objavljivanje novih blokova na istom nefiltriranom javnom endpointu može odbiti cijeli katalog tim klijentima. Prvo pripremiti verzionisani/opt-in šestjezični feed ili drugi provjeren kompatibilan export; postojeći default zadržati kompatibilnim. Sama schema promjena u novom sourceu ne popravlja stare instalirane binarije.
2. **Postojeći17-recipe wording patch:** sadašnja produkcija još čuva starije tekstove, a klijent ih ispravlja samo za tačne izvorne verzije. Upis samo4nova jezika uz increment record.version može ugasiti taj bounded patch i vratiti stari EN/BHS tekst. Postojeći [patch](../content/recipe-wording-2026-11-17/README.md) mora biti pravilno objavljen zajedno s promjenom ili prethodno usklađen u bazi, uz očuvane količine/porcije/nutrition. Ne importovati source-catalog kao cijelu zamjenu.
3. Poslije promjene canonical EN/BHS/verzija ponovo fetchovati javni source i ažurirati baseline/pin/fingerprint. Za isti English tekst sve3038memorija se ponovo koriste; ne ponavljati prevod. Ponovo kompajlirati, provjeriti100offline varijanti i sve source bound testove.
4. Operator koristi postojeći privatni Studio i standardne autorizovane revizije/backup/odobrenje. U ovoj sesiji nema Studio ovlaštenja ili automatskog update alata. Ne zaobilaziti Studio direktnim SQL-om i ne stavljati tajne u Git/chat.
5. Aktivacija jezika u aplikaciji traži proširenje ready Locale/birača/native supportedLocales i audit share/parser/server linkova, UMP/legal/support/store površina. Zatim isti novi source SHA za platforme, inventar novih build brojeva/kvote/signera i fizički QA. Brojevi5/11u app.json su već korišteni, nisu novi release brojevi.

Ovi koraci nisu odobrenje za produkcijsku publikaciju. Repo AGENTS zahtijeva konkretno korisničko odobrenje za merge/deploy/migraciju/store slanje. Novi Codex prvo čita trenutne claimove i sesiju; ne pretpostavlja da je drugi account obaviješten chatom.
