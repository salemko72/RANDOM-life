# Zajednički zadaci

## UI-ONBOARD-001 — Jasnija tri dugmeta za izbor personalizacije

- **Odgovorni/grana:** salem-ui; codex/salem-onboarding-buttons; korisnikov screenshot i nalog17.11.2026.
- **Status:** in_review — korisnik je otvorio [PR #2](https://github.com/salemko72/RANDOM-life/pull/2) prema Ahmedovoj grani. CSS i mobilni ENG/BHS QA PASS; code commit850fce3fdaa2a12760c8508bf50c077dee624d21. Vlastiti task premješten na početak da ne kolidira s Ahmedovim paralelnim dodatkom na kraju TASKS. Nema native builda/deploya ili PR mergea.
- **Scope:** samo apps/client/src/web/experience.css, ovaj task i vlastita collaboration/sessions/2026-11-17-salem-ui-01.md. Bez Onboarding.tsx/SDK/config ili tuđih aktivnih fajlova. Base je Ahmedov najnoviji40f1bc4 s iOS dokumentacijskim claimom; taj zadatak ne mijenja ovaj stylesheet.
- **Opis:** veći tekst Personalize my suggestions; dvije sekundarne radnje kao puna, svjetlija zaobljena dugmad. ENG/BHS i male iPhone širine bez clippinga. Postojeći click handleri ostaju.
- **Kriteriji:** scoped stil za consent-actions pobjeđuje globalni button reset/mobile font; čitljiv glavni tekst; dvije svjetlije pune tipke; mobilni screenshot i stvarni tokovi tri izbora prolaze. Bez native builda/deploya ili store slanja.
- **Zavisnosti:** zajednički source za iOS/Android; stari instalirani build neće dobiti stil dok se ne napravi/distribuira novi kandidat. Pregledati claims prije izmjena; nema automatske chat obavijesti.

- **RIGHTS-001 dopuna17.11. (otvoreno, nije audit):** korisnik je pitao za recepte s kidney-health/udruga web stranica u low-phosphorus filteru. Po stavci provjeriti licencu i komercijalnu upotrebu tekstova/fotografija, porijeklo sadržaja, nutritivne dokaze i zdravstvene tvrdnje. Atribucija/preformulisanje/disclaimer nisu automatsko pravno rješenje. Nema utvrđenja povrede niti potvrde zakonitosti za konkretne izvore u ovoj UI sesiji. Ne mijenjati hard filtere ili produkcijske recepte bez zasebnog opsega.

## IOS-ADMOB-HANDOFF-001 — Ahmedova dokumentovana predaja Salemu

- **Odgovorni / grana:** ahmed-admob / `codex/ahmed-admob-finish`; korisnikov nalog 17.11.2026.; postojeći draft PR #1.
- **Status:** claimed; claim commit/push prije audit dokumentacije. Base `44576897c06f50e807dff1c34ba94974dd47a582`; aplikacijski/build source `1d334308483d9064fb853aa106ec3a9e49b8046e`.
- **Datoteke:** novi `docs/IOS_ADMOB_HANDOFF.md`, vlastita `collaboration/sessions/2026-11-17-ahmed-admob-10.md`, kratke dopune ovog TASKS i STATUS. Bez uređivanja Salemovih release fajlova ili aplikacijskog koda.
- **Kriteriji:** read-only iOS AdMob ID/UMP/regional/IDFA/store/readiness/app-ads provjera s potvrđeno/otvoreno dokazima; poznati SDK podaci i ATT pitanja; konačni Android10 hash/signer/manifest/live nalaz; RIGHTS-001 preostali izvori; commit/push i PR/compare predaja.
- **Saradnja:** fetch i otvoreni PR #1 provjereni 17.11.; Salemove remote grane ANDROID-LIVE-002 i RELEASE-002 pročitane, njihovi scopeovi ostaju netaknuti. Ovo je nastavak vlastitog ADS-001 rada na istoj grani, nije novi native release.
- **Granice:** bez builda, mode/config/UMP izmjena, mergea, deploya, store slanja ili troška. Novi iOS test/live izbor nije potvrđen. Salemov Codex preuzima native/privacy audit, broj, kvotu, signing i pripremu builda; Salem ASC i fizički iPhone video. RIGHTS-001 ostaje open.

## ANDROID-LIVE-001 — Novi AAB s pravim oglasnim jedinicama

- **BUILD ZAVRŠEN — ne praviti duplikat:** EAS `ff9cee28-f381-454b-9954-ec0bb63b1546`, FINISHED, ads-live, Android STORE0.23.0/code10, source1d334308483d9064fb853aa106ec3a9e49b8046e. Stvarni AAB preuzet, SHA25626b5d59e387987392f1574520af473a310ec98fdac4fbec5a145e8e342e5cd47; manifest/bundletool/signature/cert/SDK provjere PASS. Salemov ANDROID-LIVE-002 claim nije automatski označen done; za oba operatora koristi se ovaj jedan rezultat. [Rezultat](../docs/ANDROID_LIVE_AAB_RESULT.md), [sesija09](sessions/2026-11-16-ahmed-admob-09.md). Nema Play uploada/slanja/objave.

- **16.11. ponovo preuzima Ahmedov Codex:** korisnik je nakon prihvatanja Expo invitationa izričito zatražio da ovaj Codex napravi AAB. Pristup ahmochera/Developer sada potvrđen. Free kvota5/30 ukupno, Android2/15, overage0; EAS inventar nema live/code10 ili aktivan Android build, a Play4/4 i dalje9/7/6/5. Salemov zasebni ANDROID-LIVE-002 claim na8b3db30 je primijećen; nije mijenjan niti proglašen završenim. Ovaj najnoviji korisnički nalog vraća izvršavanje ovdje; neposredno prije kreiranja ponovo provjeriti EAS i koristiti postojeći odgovarajući build ako se pojavi. Pin1d334308483d9064fb853aa106ec3a9e49b8046e ostaje, aplikacijski fajlovi se ne mijenjaju. Vlastiti rezultat/session09, bez Play objave.

- **16.11. predaja za izvršavanje:** Expo login uspješan kao ahmochera, ali project READ odbijen. Korisnik izričito bira da **Salem pokrene build**; [kompletne upute](../docs/SALEM_ANDROID_LIVE_BUILD.md), [sesija08](sessions/2026-11-16-ahmed-admob-08.md). Build source pin ostaje1d334308483d9064fb853aa106ec3a9e49b8046e; nijedan novi build nije pokrenut. Ahmed zadržava aplikacijske fajlove, Salem preuzima samo build izvršavanje i vlastiti dokumentacioni claim nakon čitanja uputa.

- **Odgovorni/grana/PR:** ahmed-admob; codex/ahmed-admob-finish; postojeći draft PR1,13.11.2026.
- **Status:** done za build-only cilj; AAB10 završen/preuzet/provjeren uz besplatnu kvotu i postojeći signer. Store i opći ADS-001/QA/RIGHTS uslovi ostaju otvoreni. Historijska priprema u [sesiji07](sessions/2026-11-13-ahmed-admob-07.md); stvarni rezultat u sesiji09.
- **Scope:** apps/client/app.json (novi slobodan Android versionCode), postojeći eksplicitni ads-live EAS profil i potrebne release provjere/dokumentacija; vlastita sesija07 i kratki status/handoff. Bez nepotrebnih SDK/runtime promjena, iOS builda, web deploya ili novog signera.
- **Kriteriji:** potvrditi postojeću Expo autorizaciju i besplatnu EAS kvotu prije builda; provjeriti EAS/Play brojeve, zamrznuti čist source SHA, provjeriti live mode/NPA i tačne Android ID-ove, napraviti samo Android AAB bez auto-submit. Preuzeti postojeći rezultat, provjeriti finalni manifest/potpis/SHA256 i predati artefakt+GitHub dokaz. Ako pristup ili kvota nedostaju, ne izmišljati build i ne pokretati naplativu zamjenu.
- **Korisničke potvrde:** screenshot AdMob Android AppID odgovara sourceu, ad-unit ID podudaran po korisniku, Published European regulations/Android/policy/choices korisnički potvrđeni. Manualno dodavanje testnog uređaja korisnik odgodio; novi AAB nije time fizički QA ili AdMob Ready potvrđen. RIGHTS-001 i druge store release obaveze ostaju otvorene.

## PRIVACY-REL-001 — Objaviti ads privacy i dovršiti Play Data safety

- **Završeno13.11.:** uz izričito odobren preview→production, privacy/support/app-ads javno objavljeni na deployu75f058a1-a191-4edd-a416-868c6e39332b. Preview i production HTTP/hash/backend provjere PASS,56downloadova/235neizmijenjenih assets i binding fingerprint očuvani. Data safety dovršen/sačuvan, nije poslan Googleu. [Release dokaz](../docs/reviews/privacy-web-release-2026-11-13.json), [sesija06](sessions/2026-11-13-ahmed-admob-06.md). Ovim je razriješena ranija approval/access blokada.

- **13.11. nastavak:** logout/login je razriješio pristup Salemovom projektu; canonical manifest236/236assets sačuvan i hashiran, uključujući56downloadova. Kompletan kandidat spreman,235postojećih fajlova identično i samo privacy izmijenjen. Preview pokušaj odbijen automatskom approval provjerom prije izvršenja; čeka izričito odobrenje preview/production web objave. Nema deploya. Vidi [nastavak audita](../docs/PRIVACY_DATA_SAFETY_RELEASE.md) i [sesiju05](sessions/2026-11-13-ahmed-admob-05.md); ranija access blokada ispod je historijska.

- **Odgovorni/grana/PR:** ahmed-admob; codex/ahmed-admob-finish; postojeći draft PR1.
- **Status:** done za ovaj odobreni scope; javna politika/support/app-ads i dovršen neposlani Data safety potvrđeni. Source PR ostaje draft, opći ADS-001/native-release uslovi nisu ovim zatvoreni. [Detalji](../docs/PRIVACY_DATA_SAFETY_RELEASE.md).
- **Scope:** apps/client/public/legal/privacy.html i povezane legal/support/app-ads statičke putanje; vlastiti release audit/sesija04 i kratki TASKS/STATUS/RELEASE_HANDOFF. Samo potrebni deployment pomoćni alati; nema izmjena native aplikacije, novog builda, DB migracije ili Play rollouta.
- **Kriteriji:** pregledati stvarne SDK/server podatke i Google kategorije; sačuvati kompletan aktuelni javni download inventar i Pages bindinge prije konkretnog odobrenog web deploya; provjeriti live privacy sadržaj i dovršeni neposlani Data safety obrazac. Ne tvrditi da je izjava objavljena na Playu bez submission/review dokaza. Korisnikov nalog odobrava ovu web objavu; ne odobrava automatski objavu aplikacije ili slanje svih drugih store promjena.
- **Zavisnosti:** ovlašten pristup postojećem random-life-preview Pages projektu; bez širenja account ovlasti ili troška. Salemovi RELEASE-002 dokumenti ostaju izvan ovog scopea.

## ANDROID-REL-001 — Ahmedov APK audit i Google Play priprema

- **AD_ID blokada razriješena:** nakon korisnikovog pauziranja starih testnih trackova, direktno osvježeni Preview prikazuje samo1deobfuscation warning i omogućeno Save and publish. Nema objave; preostale privacy/web/QA/rights obaveze ostaju otvorene. Raniji zapisi AD_ID errora ispod su historijski.

- **Nastavak dostavljenog AAB-a:** lokalni AAB provjeren i prihvaćen u Playu; interno izdanje0.23.0(9) sačuvano kao draft, nije objavljeno. Novi scope uključuje AAB audit i `collaboration/sessions/2026-11-12-ahmed-admob-03.md`. Ranija download blokada ispod je razriješena. Otvoreni su AD_ID release error aktivnog artefakta (code9 ima dozvolu), finalne izjave/web/QA/prava. Nema promjene aplikacijskog sourcea ili novog builda.

- **Odgovorni:** `ahmed-admob`, nastavak po korisnikovom nalogu da se pripremi Google Play izdanje.
- **Grana / PR:** `codex/ahmed-admob-finish`, postojeći PR #1.
- **Status:** `in_review` za audit/pripremu; [APK i Play nalazi](../docs/ANDROID_PLAY_READINESS.md) su pripremljeni. AAB download i upload-certificate match još čekaju ovlašten pristup/lokalni fajl; fizički QA nije potpun. Ovo je nastavak ADS-001, ne preuzimanje Salemovih RELEASE-002 fajlova.
- **Scope:** vlastiti `docs/ANDROID_PLAY_READINESS.md`, `collaboration/sessions/2026-11-12-ahmed-admob-02.md`, kratke dopune TASKS/STATUS/RELEASE_HANDOFF; read-only lokalni APK/manifest/potpis i Play inventar, priprema Play deklaracija kao neposlanih promjena/nacrta. Bez promjene aplikacijskog sourcea.
- **Kriteriji:** zabilježiti APK hash/potpis/verziju/dozvole, stvarne Play brojeve, razlikovati korisnikov izvještaj s telefona od kompletne fizičke QA matrice, sačuvati tačne nacrte i blokade AAB/credentials/potpisa/weba. Ništa ne poslati Googleu niti objaviti produkcijski release bez konkretnog odobrenja.
- **Zavisnosti:** postojeći EAS build source `bfc71733de64d8f7f30fb3831b6b19af64bfc1a7`; AAB treba ovlašteno preuzeti, konačni potpis usporediti s Play upload certifikatom. Postojeći ADS-001 aplikacijski file scope ostaje isti; RIGHTS-001 ostaje otvoren.

Zapis je dogovor o radu, **nije automatsko zaključavanje**. Prije preuzimanja provjeri najnovije udaljene grane, claim commitove i otvorene PR-ove. Ne preuzimaj tuđi aktivni zadatak bez dogovora. Vidi [postupak](README.md).

## COLLAB-001 — Postaviti saradnju između Codex accounta

- **Odgovorni:** Codex uz Salemov account (`salem-collab`); identitet je oznaka sesije, ne GitHub korisnički račun.
- **Grana:** `codex/salem-collaboration-setup`
- **Status:** `blocked_pr` — dokumenti su commitovani/pushani; API otvaranje PR-a vraća 403.
- **Opis:** Uspostaviti zajednička pravila, status, backlog, odluke, zasebne sesijske zapise i release handoff.
- **Datoteke:** `AGENTS.md`, `collaboration/README.md`, `collaboration/STATUS.md`, `collaboration/TASKS.md`, `collaboration/DECISIONS.md`, `collaboration/sessions/2026-11-11-salem-collab-01.md`, `docs/RELEASE_HANDOFF.md`, `docs/SECOND_CODEX_START_HERE.md`.
- **Kriteriji prihvatanja:** postojeća pravila ostaju netaknuta; svih deset korisničkih pravila je pokriveno; trenutno stanje razlikuje source/build/deploy; drugi account može nastaviti bez chata; početni PR ima konkretan diff i provjere.
- **Zavisnosti:** potvrđene remote grane; pristup GitHubu; izuzeti postojeći lokalni AdMob rad iz PR-a.
- **Predaja:** claim `800c93f7e6aa33784ea50cc3b352fca7cf514925`, dokumenti `d9c8073aab1b580a46417306fc3f0d4d54c9341d`; PR nije potvrđen. Nema odobrenja za merge/deploy.

## COLLAB-002 — Dogovoriti zajedničku integration/default granu

- **Odgovorni:** korisnik je potvrdio odluku; izvršenje koordinira `salem-collab`.
- **Grana:** nije kreirana; koristiti `codex/<ime>-integration-base` nakon dogovora.
- **Status:** `in_progress` — nova main je objavljena; promjena GitHub defaulta još čeka browser potvrdu.
- **Opis:** Korisnik je odabrao novu main iz aktuelnog sourcea, bez spajanja stare Android historije.
- **Datoteke:** nakon dogovora `collaboration/STATUS.md`, `collaboration/README.md`, vlastiti sesijski zapis; eventualne GitHub postavke samo uz zasebno odobrenje.
- **Kriteriji prihvatanja:** dokumentovana base grana i source SHA, očuvane stare grane, saradnici mogu otvoriti PR s razumljivim diffom; nikakav neodobren force push.
- **Zavisnosti:** `COLLAB-003`; GitHub API 403 blokira promjenu defaulta iz ovog okruženja. Korisnik je sada odobrio novu osnovu/uklanjanje starih Android grana.

## RIGHTS-001 — Provjera porijekla tekstova/podataka nakon zamjene slika

- **Odgovorni:** nije preuzeto; drugi Codex može predložiti claim za read-only audit.
- **Grana:** npr. `codex/ahmed-content-provenance` (primjer, nije postojeći claim).
- **Status:** `open`.
- **Opis:** Utvrditi koje činjenice/opisi zavise od TMDB-a i drugih izvora; razdvojiti Open Library CC0 katalog od prava na omote. Ne zaključiti da je zamjena slika riješila sve licence.
- **Datoteke:** vlastiti audit u `docs/reviews/`, `collaboration/DECISIONS.md`, vlastita sesija. Pristup produkciji najprije read-only i uz postojeće ovlaštenje; bez objavljivanja backupâ.
- **Kriteriji prihvatanja:** dokaz po izvoru i kategoriji; odvojeno potvrđeno/nepoznato; konkretan plan bez plaćenih licenci/API-ja; nema automatskog brisanja ili izmišljenih dozvola.
- **Zavisnosti:** D-003, D-004; pristup izvorima/bazi nije isti na svim accountima. Uređivanje sadržaja traži zaseban dogovor o opsegu.

## IOS-001 — iPhone-only konfiguracija i fizička provjera

- **Odgovorni:** nije preuzeto.
- **Grana:** npr. `codex/salem-iphone-scope` nakon claima.
- **Status:** `open`.
- **Opis:** U narednom iOS sourceu ukloniti deklarisanu iPad podršku i provjeriti stvarni iPhone portrait UI, zoom/tastaturu i lokalni offline katalog.
- **Datoteke:** `apps/client/app.json`, potrebni native config/testovi, `docs/RELEASE_HANDOFF.md`, vlastita sesija.
- **Kriteriji prihvatanja:** `supportsTablet: false`, provjerena generisana targeted-device-family konfiguracija, realni test na podržanom iPhoneu; bez tvrdnje da iPhone kompatibilni prikaz nikad nije dostupan na iPadu.
- **Zavisnosti:** dogovor s `ANDROID-001` zbog zajedničkog app.json; source osnova sa generičkim slikama. Novi build/deploy/store submission posebno odobrava korisnik.

## PREF-001 — "Profil" opisati kao lokalne preference

- **Odgovorni:** nije preuzeto.
- **Grana:** npr. `codex/<ime>-local-preferences` nakon claima.
- **Status:** `open`.
- **Opis:** ENG/BHS tekstovi jasno govore da nema serverskog računa, registracije ili javnog profila. Preference se mogu naknadno mijenjati; lokalno učenje ostaje.
- **Datoteke:** `apps/client/src/web/WebExperience.tsx`, `Onboarding.tsx`, jezičke mape i relevantni testovi; vlastita sesija. Konačan file scope navesti pri claimu.
- **Kriteriji prihvatanja:** očuvani favoriti, historija, uređivanje, lokalno brisanje i svi prehrambeni hard filteri; ažurirani Apple Notes bez izmišljene prijave.
- **Zavisnosti:** dogovor s `ANDROID-001` zbog WebExperience.tsx; D-002.

## ANDROID-001 — Predaja i dovršavanje postojećeg AdMob WIP-a

- **Odgovorni:** `salem-android-wip` (postojeći lokalni rad, nije nova GitHub predaja).
- **Grana:** `codex/salem-admob-handoff`, code SHA `d4d0a6a150baa71591a2c427223aea69e8bcf17d`; **nije u mainu**.
- **Status:** `blocked_pr` — WIP code push je potvrđen; scope nastavka sada je ADS-001 za obje platforme.
- **Opis:** Postojeći AdMob rad sada je objavljen na zasebnoj grani; završiti pregled kroz PR i nastaviti prema ADS-001. Ahmed je potvrdio objavljene UMP poruke; to nije dokaz ponašanja SDK-a na telefonu.
- **Datoteke:** rezervisani AdMob fajlovi iz STATUS; `package-lock.json`; `tests/ads-*.test.ts`; poseban release handoff i sesija.
- **Kriteriji prihvatanja:** source/PR dostupni drugom Codexu, testne jedinice u testnim profilima, consent prije oglasa, korisničke preference se ne šalju SDK-u, prirodna pauza/frekvencijski limiti, fizički Android QA, stvarni AAB i tačan source SHA. Build/objava nisu izvršeni samo zato što kod postoji.
- **Zavisnosti:** `RIGHTS-001`, potvrđena publika/Privacy/Data safety/Contains ads/app-ads.txt; zasebno odobrenje za release. Preklapanje s IOS-001 i PREF-001 dogovoriti prije rada.

## RELEASE-001 — Novo native izdanje i Apple odgovor

- **Odgovorni:** nije preuzeto; jedan release koordinator nakon dogovora.
- **Grana:** kreirati nakon prihvaćenih prethodnih PR-ova, npr. `codex/<ime>-native-release`.
- **Status:** `blocked`.
- **Opis:** Pinovati zajednički source SHA, napraviti posebno evidentirane Android/iOS artefakte i pripremiti Apple Guideline 2.1 odgovor.
- **Datoteke:** `docs/RELEASE_HANDOFF.md`, release config/scripts samo po dogovoru, vlastiti sesijski zapis; store konzole odvojeno.
- **Kriteriji prihvatanja:** čist source, odgovarajući verzija/build brojevi bez kolizije, generičke slike u instaliranom offline paketu, fizički QA, video s fizičkog iPhonea i tražene informacije, stvarno dostupna podrška/privatnost, navedeno šta nije testirano.
- **Zavisnosti:** IOS-001, PREF-001, RIGHTS-001; ANDROID-001 samo ako izdanje sadrži oglase. Nema automatskog submit/deploy odobrenja.


## COLLAB-003 — Nova main osnova, arhiva starih Android grana i kompletna AdMob predaja

- **Odgovorni:** `salem-collab`, korisnikov izričit nalog 11.11.2026.
- **Grana:** `codex/salem-collaboration-setup` za koordinaciju; nova `main` kao zajednička stabilna osnova; `codex/salem-admob-handoff` isključivo za postojeći WIP.
- **Status:** `in_progress` — claim prije promjene remote refova i predaje WIP-a.
- **Opis:** Sačuvati posljednji source bez miješanja AdMob-a, arhivirati/ukloniti samo stare Android radne grane, pripremiti kompletne upute u Markdown/Word formatu za drugi account i Ahmeda.
- **Datoteke:** postojeći saradnički dokumenti; `docs/ADMOB_AND_COLLABORATION_HANDOFF.md`, `.docx`, početni linkovi u `README.md`; poseban sesijski zapis za WIP. AdMob kod se ne stavlja u main/docs commit.
- **Kriteriji prihvatanja:** nova main dostupna na GitHubu; stari Android vrhovi sačuvani tagovima prije brisanja; default-brancha blokada iskreno navedena; WIP dostupna na zasebnoj grani sa tačnim SHA; kompletan vodič uključuje Android i iOS, test/prod razliku, vlasnike, saglasnosti, store obaveze i fizički QA.
- **Zavisnosti:** GitHub default trenutno blokira brisanje android-expo-windows; API 403 može zahtijevati vlasnikov browser korak. Korisnik je odobrio kreiranje nove osnove i brisanje starih Android grana, ne produkcijski deploy ili store submission.

## ADS-001 — Dovršiti AdMob za Android i iOS (zamjenjuje Android-only opseg ANDROID-001)

- **Odgovorni:** `ahmed-admob`, Codex uz Ahmeda, preuzimanje 12.11.2026. prema korisnikovom nalogu za izvršenje handoffa.
- **Grana:** `codex/ahmed-admob-finish`, iz `origin/main` na `2c98dea77951048e00649e8f72cb7e0a848c1bf2`; nakon objavljenog claima prenijeti samo WIP `d4d0a6a150baa71591a2c427223aea69e8bcf17d`.
- **Status:** `in_review` — [draft PR #1](https://github.com/salemko72/RANDOM-life/pull/1) prema mainu, potvrđen kroz GitHub API. Claim `25e817e36cce4014256d055d49d78e2b02825203` objavljen prije cherry-picka/koda; implementacija `e1228ed725d63a56e280e00d3c840ab5890311b6`. Signed buildovi i fizički SDK QA nisu urađeni; task nije done. [Pregled i release blokade](../docs/ADS_001_REVIEW.md).
- **Opis:** Zajednički AdMob source za obje native aplikacije. Postojeći WIP je Android-first, ne gotova iOS integracija. Ne mijenjati već poslani build 2.
- **Datoteke:** App.tsx, app.json, eas.json, native ads moduli/plugin/autolink, ads bridge, WebExperience.tsx, dependencies/lock, ads testovi, privacy/support/app-ads hosting i release handoff prema dogovoru.
- **Dodatni scope provjera:** scripts/check-ads-native-config.mjs, check-ads-release-output.mjs, smoke-ads-bridge.mjs i postojeće dvije smoke skripte za Windows putanju preglednika; stage-preview.mjs i vlastita dokumentacija. IOS-001 source konfiguracija je dio istog app.json scopea; fizički dio IOS-001 ostaje otvoren. PREF-001 i RIGHTS-001 nisu preuzeti niti proglašeni završenim.
- **Potvrde Ahmeda 12.11.:** ciljna publika 16+; publisher red `google.com, pub-8395430021391101, DIRECT, f08c47fec0942fa0`. Nisu potvrde live crawla, stvarne dobi korisnika, native QA ili store izjava.
- **Kriteriji prihvatanja:** završena iOS i Android integracija; testni oglasi podrazumijevani; pravilno mapirani javni ID-ovi; UMP i kasnija promjena izbora; ATT odluka prema stvarnom trackingu; bez slanja zdravstvenih preferencija; rijetki oglasi na prirodnoj pauzi; fizički QA za obje platforme; isti zaključani source SHA i zasebni artefakti/testovi. Implementirano nije isto što i buildano ili objavljeno.
- **Zavisnosti:** zasebna WIP predaja, RIGHTS-001, IOS-001 i PREF-001; svi ovi taskovi sada se usklađuju s istim release koordinatorom. Osnovni SDK/AdMob ne zahtijevaju kupovinu licence; kvote EAS-a i hosting limiti provjeriti bez paid upgradea. Posebno odobrenje prije produkcijske objave ili slanja trgovinama.
