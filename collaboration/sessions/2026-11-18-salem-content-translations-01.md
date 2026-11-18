# Content translations — 18.11.2026.

Task I18N-CONTENT-004, branch codex/salem-content-translations, base2b0ef74527b9f953c3f61aa05cab1d1f759fa042. User authorizes catalogue/offline translation after seeing UI-only preview.

Plan docs/superpowers/plans/2026-11-18-content-translations.md, spec docs/LANGUAGE_EXPANSION_PLAN.md. Pilot then full catalogue/offline preparation; no production write, human review claim, paid resource or native/store release. Public API read confirms467items, server manifest59a712e7856e411d0d1b11e7c7c681cdb0e4e769522ccdbcd84a502df53eebf8, BOOK172/WATCH101/EAT147/MOVE27/GO20. All100reserve IDs exist;8English differences are existing recipe-wording projections, to preserve before translation. Generic-art helper currently maps every non-en alt to BHS; must fix for additional translations.

## Nastavak nakon prekida okruženja/kvote

18.11.15:56CET ponovo potvrđeni sačuvani fajlovi: es840,pt-BR1017,de777,it755 od3038jedinstvenih tekstova. Sve4pilotske memorije potpune(60tekstova pojeziku,6zapisa/5kategorija+film/series), pilot compile24draft prevoda PASS. Italijanski1960s predstavljeni riječima su semantički ispravni, ali usklađeni na broj1960radi stroge provjere brojčanog zapisa. Radnici nastavljaju atomske zapise bez ponavljanja postojećih prevoda.

Root implementacija: ContentLocale za prihvaćene podatke odvojen od aktivnog Locale(en/bs). pt-BR/it su dodani shared schema-listi bez aktiviranja UI jezika. Bounded draft adapter veže ID/version/canonical protected source+English fingerprint, čuva postojeće serverske prevode i odbija nepotpune/numerički promijenjene/dodatne fieldove/duplikate. Generic artwork alt za4jezika više ne pada u BHS; EN/BS ponašanje sačuvano. Source/checksum servera ostaje originalan, projekcija ima zaseban hash.

TDD: adapter4RED→GREEN, field injection/duplicate guardRED→GREEN, generic-altRED→GREEN. Full suite364/52PASS, root/client TypeScriptPASS na checkpointu. Compile pilot6records/24translationsPASS; memories se još dopunjavaju i full coverage nije završena. Consumer wiring/offline/full preview i konačni audit tek slijede. Nikakva D1/public snapshot/store/native publikacija nije izvršena.
