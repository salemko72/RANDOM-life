# UI translations — 18.11.2026.

Base f4ae7e299a8a241220d05eee368fee3007f96c86; task I18N-UI-002; branch codex/salem-ui-translations.
Spec docs/LANGUAGE_EXPANSION_PLAN.md; plan docs/superpowers/plans/2026-11-18-ui-translations.md.

User explicitly requested translations; continue implementation without another planning approval loop. Four independent dictionary files may be delegated, shared integration remains root-owned. No native release or production operation authorized by this task. Active runtime remains en/bs until content phase is ready; this phase delivers translated UI assets and wiring, not four complete app versions.

## Implementacija i provjere

- Claim9640677 objavljen prije implementacije; izolovan postojeći worktree, nova vlastita grana. Pregledane remote grane/claimovi; nema novog preklapanja s Ahmedovim završenim Android11 build-only radom.
- Četiri nezavisna dictionary workera su mijenjala samo es/pt-BR/de/it.json. Root je pregledao poruke, code diff, key/placeholder/whitespace parity i ciljano low-phosphate/allergen/deletion/privacy tekstove.363ključax4=1452draft vrijednosti. ENG/BHS opcijske oznake ostaju doslovne; Home reset je mali red u domu, Dance je aktivnost(Ples), ne muzički žanr.
- Dictionary RED:4missing-file assertion failure prije pisanja; GREEN4dictionary testa. Helper RED3behavior failures prije implementacije; GREEN format/translation/en-bs kompatibilnost. Dodatni static-call inventory test pokriva sve trenutne t/text/uiText/formatUi ključeve.
- uiText/formatUi i postojeći translate/category/value helperi podržavaju draftove. Migrirane aktivne literalne bilingual poruke i dinamičke image/category/catalog oznake; formati datuma ne idu kroz lingvistički dictionary. UI draft tip je odvojen od aktivnog Locale, koji ostaje en/bs.
- Full suite355tests/50files PASS; TypeScript/preview PASS; browser auto/manual/reload/legacy/storage failure/draft, create/edit profile320/390, menu footer320x568/320/390/430 i svih5kategorija Spin again/Home/detail ENG+BHS PASS. Nema potvrde layouta četiri nova jezika u stvarnoj aktiviranoj aplikaciji, fizičkog/native QA ili ljudske lekture.
- Preview i testovi ne objavljuju sadržaj. Online D1, offline100-item reserve, nutrition/allergens/IDs/filteri i postojeći recipe-wording patch nisu mijenjani.

## Namjerne granice i nastavak

Ready locale list, native en/bs declarations i content Locale union ostaju nepromijenjeni. SpotifyAccount callback i share locale parsers ostaju en/bs dok je LISTEN arhiviran i dok se budući ugovor za jezike ne proširi; ništa nije reaktivirano. Native boot errors/UMP/legal/store/share-server površine treba uključiti u budući activation audit. Katalog nije preveden ovim UI radom. Naredni korak je stvarni5-category pilot sa svim4jezika, pa467online/100offline/contract i jezički QA prije aktivacije. Nema mergea/native builda/deploya/D1/store slanja ili dodatnog troška.

## Završni review

Fresh-context reviewer gpt-6.2-astra pregledao diff i sve4rječnike (ciljano alergene/renal warning/privacy/deletion). Nema preostalih critical/important nalaza. Ispravljene review stavke: raw backup banner sada ide kroz uiText (legacyENG/BHS tekst isti); auto badge ima izričitu mapu6kodova; streaming accessibility koristi named placeholder. Backup JSX regression RED→GREEN, badge/streaming RED→GREEN. Parent je našao prototype registry edge case (nepodržani locale constructor vraćao Object za key name), dodao RED→GREEN test i own-key guard. Konačni inventory365ključeva,1460draft vrijednosti. Nezavisni reviewer nije pokretao build/QA; rezultati ispod pripadaju root provjerama.

## Konačni source i predaja

- Aplikacijski source **2c0ce132f6dcfca7967143f880e0a949e40dae59**, basef4ae7e299a8a241220d05eee368fee3007f96c86, claim9640677. Naknadni docs commit ne mijenja aplikacijski source.
- Konačno358/358tests,50fajlova; root/client TypeScript, preview i inventory362current/365stable PASS. Nakon review popravki ponovljeni auto/profile/footer/category browser checkovi; rezultati potvrđeni prije finalne predaje.
- [Predaja za sljedeći Codex](../../docs/UI_TRANSLATION_HANDOFF.md); [compare prema foundation grani](https://github.com/salemko72/RANDOM-life/compare/codex/salem-i18n-foundation...codex/salem-ui-translations?expand=1). Git push nije PR ili merge. PR kreiranje provjeriti; API je ranije403.
- Novi native build nije pokrenut, no cost, bez produkcijske publikacije i store slanja. Četiri kompletne jezičke verzije aplikacije nisu završene: ovo su UI draftovi/infrastruktura. Nastaviti content pilot, zatim katalog/offline i activation audit.

Git push potvrđen: aplikacijski2c0ce13 i docs217b1ca dostupni na origin/codex/salem-ui-translations. Pokušaj draft PR-a prema codex/salem-i18n-foundation vraća GraphQL Forbidden(403); PR nije kreiran. Koristiti compare link iznad za ručno otvaranje. Nema preostalih lokalnih aplikacijskih izmjena.
