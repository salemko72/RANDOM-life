# Salem — meni i priprema jezika — 18.11.2026.

Grana `codex/salem-menu-language-prep`, claim3e46d66 objavljen prije koda. **Kod/procjena53d50fdce0a7d722e48f35fec05bd73939efb7dc**. Nasljeđuje build-label28e67a9 i Home-repeat1cdfb42 kandidat, ne mijenja već uploadani TestFlight1.0.1(5)/4a567c3.

Korisnik mijenja prethodnu poziciju oznake: Share diagnostic log sada je u footeru popup menija, ispod glavnih stavki/napomene; sitna dinamička verzija/build je ispod njega, posljednja. Ranija header oznaka je uklonjena. Native bootstrap i formatter ostaju bez promjene, pa se iOS/Android broj uzima iz ugrađenog paketa, bez D1 čitanja ili hardkodiranja.

## Provjere

- Browser regression prije izmjene očekivano pao: header label count1 vs expected0. Nakon premještanja ENG390×844, BHS320×844, ENG430×844 i BHS320×568: footer order,10px label, reachability scroll i platform-specific vrijednosti PASS. Browser bez native metapodataka ne izmišlja build. Screenshot `/workspace/shared/build-label-menu-en-390.png` vizuelno pregledan, testni screenshot nije fizički native QA.
- `npm test`:337/337,45/45files PASS; TypeScript/preview PASS; git diff --check PASS.
- Poseban browser provjerava postojeći LanguageChooser: stvaranje lokalnih preferencija na BHS→ponovno otvaranje→uređivanje→ENG→ponovno otvaranje.320/390 PASS, ručni izbor zapamćen. Taj izbor je već postojao u Onboarding svim koracima, nije predstavljen kao nova implementacija profila.

## Jezici — obim i otvorene odluke

[LANGUAGE_EXPANSION_PLAN](../../docs/LANGUAGE_EXPANSION_PLAN.md) sadrži procjenu, ne završenu višejezičnu implementaciju. Svježi javni API18.11.:467stavki, bez prevoda izvan ENG/BHS; četiri nova jezika=1868novih content varijanti. English map209ključeva,22BHS overridea,53inline locale==en provjere; oko63908ENG riječi sa ponavljanjima u svim content translation poljima. Nisu commitovani privatni/raw API snapshotovi.

Aktivni Locale i UI chooser ostaju en/bs; de/es enum u schema nije gotova app podrška. PT/IT i svih4 content batch-eva nisu aktivirani. Korisniku preporučen device preferred-language prvi izbor, English fallback i zapamćeni ručni override u setupu/uređivanju/meniju. Zemlja downloada nije implementirana kao jezik; korisnik treba prihvatiti precizan pristup prije buduće implementacije. Pitanje pt-BR/pt-PT poslano asinhrono, još nema odgovora; preporuka pt-BR nije odluka korisnika. Za kvalitet potrebni pilot/glossary/content review, naročito recepti/alergeni/nutritivne napomene, online/cache/reserve zajedno i jezička konzolna/store priprema.0novih troškova, bez plaćenog API-ja.

## Predaja i release granice

Source i plan pushani. GitHub API/PR ranije blokiran; PR nije otvoren. [Compare prema build-label grani](https://github.com/salemko72/RANDOM-life/compare/codex/salem-build-label...codex/salem-menu-language-prep?expand=1). Prije novog izdanja izabrati jedan zajednički čist source i provjeriti slobodne nove iOS/Android brojeve/kvotu/signing; broj5 u sadašnjem configu nije novi build. Ne koristiti stare ZIP-ove za ovaj kandidat bez usklađenja novog sourcea.

Nema native builda/ZIP-a, D1 izmjena, masovnog prevođenja, mergea, deploya, store slanja ili troška. Build5 u TestFlightu ne dobija ovaj footer retroaktivno. Ahmedove grane/fajlovi i tuđi lokalni untracked rad su sačuvani.
