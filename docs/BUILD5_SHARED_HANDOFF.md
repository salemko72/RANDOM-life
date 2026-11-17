# Aktuelna zajednička predaja — 1.0.1 / iOS5 / Android kandidat11

**Source SHA: `4a567c339a7efeff625ccecf1024887c7e9c9cd4`**, grana `codex/salem-offline-build5`.

**Ovo zamjenjuje build4 ZIP i ded4bf6.** Ahmedova grana `codex/ahmed-build4-korekcije` smije zadržati historiju integracije, ali novi native build treba koristiti ovaj source. Ne prepisivati tuđu granu i ne raditi automatski merge.

## Novi ZIP

[LIFE-SPINNER-1.0.1-build5-ZAMJENA.zip](../downloads/LIFE-SPINNER-1.0.1-build5-ZAMJENA.zip),991329bytes, SHA256 `0c3b51e9cdb7efd1a1bb7a9285ec58d6cc3f9828f3e2117480243c637dbd031c`.

Sadrži16 source/test/content fajlova u izvornim putanjama, kompletan patch prema15bbcca i dodatni patch prema ded4bf6, PROCITAJ-AHMED i hash manifest. Nije kompletan clone niti AAB/IPA. Source je već na GitHubu: poželjno je napraviti čisti checkout tačnog pina, jer primjena patcha i novi commit imaju drugi SHA. Oba patcha provjereno se čisto primjenjuju na odgovarajuću osnovu i rezultiraju byte-identičnim source fajlovima. Ne primjenjivati oba patcha.

## Uključeno u aplikaciju

- Novi onboarding button stilovi i veći primarni tekst.
- Spin again na rezultatu zadržava njegovu kategoriju; Home spin je opći.
- iOS1.0.1(5), Android1.0.1/versionCode11 kandidat; iPhone-only/portrait.
- **Ugrađena rezerva ostaje100 stavki,20 po kategoriji. Osam od17 recipe korekcija prisutno je u toj selekciji i tih8 direktno ima nove ENG/BHS tekstove.** Ostalih9 nema u100-item rezervi; ne tvrditi da svih467 stavki radi pri prvom pokretanju bez mreže.
- **Svih17 korekcija uključeno je i na consumer ulazu** za tačno poznati ID+verziju+before tekst iz starog online ili persistent cache zapisa. Noviji urednički zapisi ili nepodudarni tekstovi se ne prepisuju. Rezervni već ispravljeni tekst je idempotentan.
- Sastojci, količine, porcije, alergeni, filteri, nutritivne procjene, slike, izvori i review metadata nisu promijenjeni. Identiteti itema i history/favorites ostaju isti.
- Server snapshot bytes/hash i lokalno pohranjeni originalni cache ostaju autentični. Ispravljeni tekst je consumer projekcija; ne lažira se server catalogVersion. Offline metadata odvojeno bilježi sourceCatalogVersion i wordingRevision.

## Šta nije urađeno u online bazi

**D1/Studio zapisi nisu izmijenjeni.** U ovom okruženju nema Studio autentikacije; password nije izvlačen iz Cloudflarea i nema direktnog SQL zaobilaženja. Ovlašteni Studio operator treba primijeniti17 before/after izmjena kroz [operator upute](../content/recipe-wording-2026-11-17/README.md) i version/CAS provjere. Objavljena DB verzija i fizički package status nisu ista stvar.

Novi build prikazuje poznate korekcije i uz staru bazu/cache. Stari instalirani buildovi i server-rendered share stranice ne dobiju tu projekciju samo preuzimanjem ZIP-a; za njih je potrebna normalna DB publikacija. RIGHTS-001 i konačni ATT/medicinski review nisu proglašeni zatvorenim. Generičke BOOK/WATCH slike ostaju uključene.

## Ahmedov Codex — Android

1. Pročitati AGENTS/STATUS/TASKS i ovu predaju, objaviti vlastiti nastavak claima. Stari BUILD4-KOREKCIJE-001 sada treba uskladiti s novim pinom, bez prepisivanja Salemovih datoteka/sesije.
2. Fetch `codex/salem-offline-build5`, čista build kopija sourcea **4a567c339a7efeff625ccecf1024887c7e9c9cd4**. Ne graditi iz ded4bf6, starog ZIP-a ili proizvoljnog merged HEAD-a bez dogovora o novom zajedničkom sourceu.
3. Prije builda potvrditi da je Android11 slobodan u EAS-u, Play App Bundle Exploreru i svim draftovima/trackovima; provjeriti besplatnu kvotu i postojeći upload signer. Bez novih ključeva ili plaćenog upgradea. Ako broj nije slobodan, dogovoriti novi zajednički pin, ne samo tihu Android promjenu.
4. Za AAB s pravim oglasima koristiti **ads-live**, za QA APK po potrebi **ads-test-apk**. Režim je platform/profile izbor uz isti source SHA. Provjeriti literal mode/ID u release exportu, finalni manifest/versionName/versionCode, signer i SDK.
5. QA: ENG/BHS onboarding i Spin again; online stari/matching i novi content, retained offline cache, cold100-item rezerva, hard dietary/allergen filteri; consent/reject/reopen/no-fill/background/resume. Novi tekstovi ne mijenjaju medicinske/filter oznake.
6. Predati AAB/APK po potrebi, stvarni SHA256/veličinu/EAS link/source/signature i rezultate. **Bez Play upload/submission/objave, web deploya ili PR/main mergea.** iOS5 radi Salem, ne pokretati duplikat.

## Izvršene provjere

- Novi regression prvo reproducirao stare reserve tekstove i izostalu consumer korekciju; nakon izmjene5 novih testova PASS.
- Svi333testa/44fajla PASS; focused26/3fajla PASS; TypeScript i preview PASS. Postojeća reserve provjera potvrđuje100/20, slike, budžet<10MiB i dietary coverage.
- ENG/BHS mobilni browser potvrđuje ispravan tekst pri starom online zapisu, zatim pri ponovnom otvaranju offline s istim pohranjenim starim cacheom. Provjereno da sačuvani server snapshot nije potajno izmijenjen.
- Za svih8 offline zapisa deep poređenje svih netekstualnih polja: identično. Publication schema/review flags očuvani. Svih17 bounded corrections, newer-version/mismatched-text preservation i idempotencija PASS.
- ZIP CRC/hash manifest i oba forward patcha prema pravim osnovama PASS; git diff --check PASS. Lokalni browser nije fizički SDK QA.

## iOS5

Korisnik izričito odobrio build5 i TestFlight bez daljeg čekanja. EAS iOS prije builda4/15, ukupni overage/estimated total0; postoji besplatna kvota. Signing cert/profil postojeći aktivni do3.11.2027.09:10:33UTC. Bez rotacije ili novih credentials. Testflight profil koristi **testne oglase**.

EAS build **f1644fa5-f626-4963-9eda-e8be438f6a4e**,1.0.1(5), source4a567c3, [build link](https://expo.dev/accounts/salemko/projects/random/builds/f1644fa5-f626-4963-9eda-e8be438f6a4e). **Native FINISHED**, EAS potvrđuje1.0.1(5) i tačan source4a567c3. Standardni besplatni TestFlight submission **795ff8f0-4f2c-4d09-a62d-4d75e410cf8c** zakazan, trenutno IN_QUEUE; nije još potvrđen Apple upload/processing. [Submission](https://expo.dev/accounts/salemko/projects/random/submissions/795ff8f0-4f2c-4d09-a62d-4d75e410cf8c). Nema --what-to-test/Enterprise parametra ili novog plana.

Build4 d42fa459 je FINISHED, ali prvi submit scheduling sa opcionalnim changelogom odbijen je kao Enterprise-only; nije kreiran Apple upload. Nema plaćenog upgradea. Za5 koristiti standardni submit profil testflight sa ascAppId6830084481, bez --what-to-test i drugih opcionalnih plaćenih dodataka. App Store review/javno izdanje nije dio ovog naloga. Konačni finalni IPA/ATT/fizički QA odvojeno evidentirati.

IPA download iz ovog okruženja vraćaHTTP403 na artifact putanji; nema lokalnog IPA SHA256/finalnog package audita. To ne blokira serverski EAS Submit, koji preuzima svoj gotov artefakt. Ne prijavljivati hash Metro/HTML/source ZIP-a kao IPA hash.

### Provjereno17.11.2026.17:23CET

Submission795ff8f0 je i dalje **IN_QUEUE** nakon više od15min; EAS nije prijavio grešku i posao ostaje zakazan serverski. Apple upload/processing/tester dostupnost još nisu potvrđeni. Ne praviti duplikat: prvo provjeriti ovaj submission ID. Native build5 je završen. Kvota poslije builda5/15, estimated overage0. [Strukturirani dokaz](reviews/build5-release-state-2026-11-17.json).
