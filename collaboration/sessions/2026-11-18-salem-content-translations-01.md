# Content translations — 18.11.2026.

Task I18N-CONTENT-004, branch codex/salem-content-translations, base2b0ef74527b9f953c3f61aa05cab1d1f759fa042. User authorizes catalogue/offline translation after seeing UI-only preview.

Plan docs/superpowers/plans/2026-11-18-content-translations.md, spec docs/LANGUAGE_EXPANSION_PLAN.md. Pilot then full catalogue/offline preparation; no production write, human review claim, paid resource or native/store release. Public API read confirms467items, server manifest59a712e7856e411d0d1b11e7c7c681cdb0e4e769522ccdbcd84a502df53eebf8, BOOK172/WATCH101/EAT147/MOVE27/GO20. All100reserve IDs exist;8English differences are existing recipe-wording projections, to preserve before translation. Generic-art helper currently maps every non-en alt to BHS; must fix for additional translations.

## Nastavak nakon prekida okruženja/kvote

18.11.15:56CET ponovo potvrđeni sačuvani fajlovi: es840,pt-BR1017,de777,it755 od3038jedinstvenih tekstova. Sve4pilotske memorije potpune(60tekstova pojeziku,6zapisa/5kategorija+film/series), pilot compile24draft prevoda PASS. Italijanski1960s predstavljeni riječima su semantički ispravni, ali usklađeni na broj1960radi stroge provjere brojčanog zapisa. Radnici nastavljaju atomske zapise bez ponavljanja postojećih prevoda.

Root implementacija: ContentLocale za prihvaćene podatke odvojen od aktivnog Locale(en/bs). pt-BR/it su dodani shared schema-listi bez aktiviranja UI jezika. Bounded draft adapter veže ID/version/canonical protected source+English fingerprint, čuva postojeće serverske prevode i odbija nepotpune/numerički promijenjene/dodatne fieldove/duplikate. Generic artwork alt za4jezika više ne pada u BHS; EN/BS ponašanje sačuvano. Source/checksum servera ostaje originalan, projekcija ima zaseban hash.

TDD: adapter4RED→GREEN, field injection/duplicate guardRED→GREEN, generic-altRED→GREEN. Full suite364/52PASS, root/client TypeScriptPASS na checkpointu. Compile pilot6records/24translationsPASS; memories se još dopunjavaju i full coverage nije završena. Consumer wiring/offline/full preview i konačni audit tek slijede. Nikakva D1/public snapshot/store/native publikacija nije izvršena.

## Završena memorija i kompajliranje

Sva4locale workera završila3038/3038 ključeva. Pojačani završni validator daje0missing/0errors za svaki jezik; pregled neprevedene višerječne proze daje0 (invariantni proper source names se čuvaju). Full compile467records/1868translations, offline100/400, overlay4102248bytes. Jezičke vrijednosti ostaju reviewed:false.

Ruling:40cold reserve BOOK/WATCH kopija razlikuje se od online samo u version/updatedAt/accessLinks; English/protected safety payload je isti. Ne mijenjati backup metadata radi podudaranja. Pinned alternateSources dozvoljavaju samo te tačne stare fingerprintove/verzije, a ne verzijski raspon. Ovo je dokazano source-parity testom i kompletnim400offline draft testom.

Svježi read-only review gpt-6.2-astra našao bitne gateove: stvarni source projectionhash nije bio ponovo izračunat; sorted numeric tokens su dopuštali zamjenu razlomaka; US marker nije dokaz dimenzije; review share/nav nije svuda bio blokiran. Ispravljeno i pokriveno testovima: source hash/version/count/uniqueIDs; ordered composite fractions/ranges/decimal precision i temperatureC/F/predznak;40-unit kontrolisani glossary; sva3share modula stubovana i HTTP anchor/window.open blokirani u reviewu. Null entries/alternate baselines se sigurno ignorišu. Full browser testovi uključuju provider click i keyboardEnter bez popup-a. Source/cache objekti ostaju nepromijenjeni.

Izmjeren cold projection467rekorda≈232ms desktopNode, ponovljeno134–145ms; uveden WeakMap za identičan immutable items array. Novi urednički array ponovo se validira, izvori se ne mutiraju. Nema tvrdnje o native performansama bez fizičkog testa.

Važna pub ograničenja su dokumentovana u docs/CONTENT_TRANSLATION_HANDOFF.md: legacy client strict enum odbija pt-BR/it; D1 version increment bez canonical17recipe wording usklađivanja može ugasiti stari bounded patch. Nema D1 upisa/produkcijskog deploya/novog native builda. Konačni source/checks/ZIP su ispod.

Konačni provjereni obim:467×4=1868record translations;100×4=400cold/offline dodataka; sve3038×4memorijske vrijednosti kompletne. Full suite376/58PASS; TypeScriptPASS; normalni previewPASS. Browser četiri nova jezika×5kategorija: title/summary/steps/ingredients, original-title identity, artworkblob i bez pageerrorsPASS; review profile/menu/cache-clear/production-storage sentinelsPASS. Providerlink click i Enter ne otvaraju popup. ENG/BHS Spin again/cycle/Home/detail i menu/profile/auto regresijePASS.

Memoized projection desktopNode: prvi poziv189.93ms, dva ponovljena0.00ms; novsource array ponovo provjerava baseline. Ovaj broj nije fizički nativeQA. Default/public locale gating i backend feed su nepromijenjeni.

## Konačna predaja

- Application/catalogue source **b8fa083ea010468a0cb42b67b540dc2516fa42d3**; review builder/source **20bc5d9657cb767c7bbf9b5004a755deb47e7f83**. Pilot fixture osvježen d46e45ca52304175adc60555e03fa12f6b8a993f. Docs/artifact commit ne mijenja app data/code.
- Final376/376tests,58files; TypeScript i normalni previewPASS. Pinned full review20bc5:4locale×5category content/details/ingredients/photos/providerlink mouse+keyboardPASS;4locale setup/profile/menu/cache-clear/sentinel isolationPASS; postojeći EN/BHS auto/profile/menu/SpinAgain/Home/detailPASS. Mac file:// i fizički nativeQA nisu potvrđeni.
- Novi ZIP **review-previews/LifeSpinner-Catalogue-Preview.zip**,19544842bytes; SHA256**6617ca249406e9be6974ccc3dd83927842c3d7b4a1f27ff438b75df8466877c7**. HTML bytes identični pinned browser-testiranom artefaktu, testzipPASS. Novi naziv HTML-a LifeSpinner-Catalogue-Preview.html i jasno467record badge sprječavaju zamjenu sa starim UI-only paketom. Stari UI-only ZIP uklonjen je samo iz ove grane; ostaje u historiji i originalnoj preview grani.
- [Download/upute](../../review-previews/README.md), [source/data/operator](../../docs/CONTENT_TRANSLATION_HANDOFF.md). Memorije i compiledpatch dostupni na istoj GitHub grani. Nema automatske obavijesti Ahmedovom accountu.
- D1 nije objavljen, produkcijski locale gating/native supportedLocales ostajeen/bs; nema novog builda/deploya/mergea/store slanja. Prije bilo kakve objave obavezno legacyclient kompatibilnost i17recipe wording/version koordinacija opisani u handoffu. Odobrenje ovog zadatka pokriva prijevod/source/preview pripremu, ne produkcijski rollout.
