# Četiri prijevoda kataloga — priprema18.11.2026.

Preveden je cijeli pinovani katalog:467zapisa (EAT147,BOOK172,WATCH101,MOVE27,GO20), svaki na es/pt-BR/de/it. To je1868novih prijevoda zapisa, sastavljenih iz3038jedinstvenih tekstova pojeziku. Svih100postojećih offline zapisa dobija iste četiri verzije.

`memory/*.json` sadrži jezičke memorije; `source-strings.json` i `chunks` čuvaju izvor i kontekst. `source-catalog.json` je lokalna prikazna projekcija javnog kataloga nakon postojećeg17-recipe wording patcha i generic-art projekcije, **nije izvoz za zamjenu baze**. Server snapshot59a712e7856e411d0d1b11e7c7c681cdb0e4e769522ccdbcd84a502df53eebf8 i zaseban projection hash nalaze se u source-manifest.json.

- `draft-overlay.json`:467potpunih lokalnih dodataka, source-bound ID/version/fingerprint; svih1868 `reviewed:false`.
- `offline-drafts.json`:100postojećih offlineID-eva i400novih jezičkih dodataka.
- `translation-patch.json`: pregledni operator payload za nove jezičke blokove. **Nije gotov StudioZIP/uvozni ugovor niti dozvola za produkcijski import.** Prvo čitati [predaju](../../docs/CONTENT_TRANSLATION_HANDOFF.md).
- `pilot-drafts.json`: raniji6-record/24-translation pilot (svih5kategorija+film/series); puni overlay je autoritativan za ovu pripremu.

Količine, porcije, alergeni, nutritivne procjene, ID-evi i source URL-ovi nisu mijenjani. Knjige i WATCH zadržavaju izvorni postojeći naslov/autore; ne izmišljaju se lokalna izdanja. Četrdeset mjernih jedinica prevodi se preko zajedničkog kontrolisanog glossaryja, bez konverzije mjera i uz eksplicitne US/UK oznake.

Brojevi, redoslijed, preciznost, razlomci/rasponi, temperaturna skala/predznak i URL-ovi prolaze automatsku provjeru. To nije potvrda medicinske ili lingvističke tačnosti. Postojeće historijske EN/BHS napomene o odobrenjima/licencama nisu novo odobrenje četiri dodatna jezika. Ljudska lektura/stručni pregled i otvoreni rights audit ostaju zasebni koraci.

## Provjere i regeneracija

`node scripts/validate-content-memory.mjs` → svuda3038/3038,0errors. `node scripts/compile-content-translations.mjs` provjerava stvarni source hash/version/count/unique IDs, forme/fieldove, jezike i svih100offline baznih verzija prije upisa izlaza. Kompajler ne poziva Studio/D1.

`node --use-env-proxy scripts/prepare-content-translations.mjs` ponovo čita javni snapshot, ali odbija pomjeren server hash. Ne regenerisati izvore usred jezičkog rada niti ručno editovati source-catalog. Za novu editorial reviziju pregledati razlike i ažurirati pin; postojeće memorije se mogu ponovo koristiti za nepromijenjen English tekst.

Jezici u produkcijskom biraču ostaju en/bs. Izolovan review build sa `--catalog` prikazuje svih467stavki i4dodatna jezika, uz zapakovan postojeći artwork; ne objavljuje bazu ni aplikaciju.
