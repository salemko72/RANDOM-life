# LifeSpinner — analiza testiranja i prijedlog monetizacije

Datum: 5. novembar 2026. Status: prijedlog za dogovor; nije nalog za implementaciju. U ovom pregledu nisu mijenjani aplikacija, SDK-ovi, produkcija, računi ni trgovinske izjave.

## Izvori i granice zaključka

Pročitani su `com.salemko.randomlife_feedback.pdf` (9 PDF stranica, štampane stranice 1–8 uz naslovnicu) i `com.salemko.randomlife_production.pdf` (5 PDF stranica, naslovnica + 1–4). Provjeren je i trenutni izvorni kod nakon iOS 0.23.0 (2), na osnovi commita 7530b5e. To nije potvrda šta je provider tačno testirao: PDF-ovi ne navode versionCode/verziju, datume, popis uređaja/OS-a, testne scenarije, sesije, reprodukcije ni logove.

Feedback tvrdi da nema kritičnih problema, a zatim daje šest glavnih i pet dodatnih prijedloga. To nije dokaz da nema grešaka. Izvještaj upućuje na Google Play; ne dokazuje testiranje iOS-a. Štampana stranica 7 je praktično prazna, bez dodatnih rezultata. Nema osnove da iz samih dokumenata zaključimo prevaru ili da potvrdimo detaljno testiranje na svim uređajima.

Production PDF je predložak odgovora za Googleov obrazac. Njegove tvrdnje o provedenim poboljšanjima, regrutaciji dodatnih ciljnih korisnika, anketama i angažmanu nisu samim dokumentom dokazane. Ne prepisivati ih kao činjenice. Uslove pristupa produkciji treba provjeriti u Ahmedovoj Play Console; trajanje/liste testera nisu zamjena za dokaz upotrebe.

## Potpuni pregled preporuka

| ID | Izvor / tema | Stanje i odluka | Prioritet / prihvatni kriterij |
|---|---|---|---|
| F1 | Feedback, štampana str. 2–3: ASO opis | Korisno za trgovinsku stranicu, nije kvar enginea. Revidirati aktuelni ENG opis, vrijednost pet rubrika i tačne tvrdnje; bez gomilanja ključnih riječi. Google opis i Apple keyword/subtitle polja tretirati odvojeno. Aktuelnu konzolnu verziju opisa treba pribaviti prije tvrdnje da je loša. | P1 uz izdavanje. Nema obećanja ugrađenog streaminga filmova/knjiga ili LISTEN-a; EN/BS prema stvarnim lokalizacijama. |
| F2 | Str. 3: screenshotovi | Prihvatiti. Stvarni ekran + kratka poruka: wheel, recept, knjiga/film, preferencije, favoriti. Napraviti odvojene iPhone/iPad/Android izvoze; buduće oglase ne prikrivati netačnim prikazom mogućnosti. | P1. Tačan interfejs i aktuelna verzija, bez izmišljenih funkcija. |
| F3 | Str. 4: dinamički walkthrough | Već postoji onboarding za profil. Koristan je kratak opcionalni vodič za korištenje, ne još jedan dugi obavezni upitnik. Najviše 2–3 kratka objašnjenja: zavrti/izaberi rubriku, srce–share–pregledano, postavke. | P2. Preskoči + kasnije otvori iz menija; bez usporavanja prvog spina, bez forsiranja profiliranja. |
| F4 | Str. 4–5: ocijeni aplikaciju | Prihvatiti diskretnu stavku u meniju. Native in-app review može biti sistemski ograničen i ne garantuje prikaz; TestFlight/closed-test nije javno ocjenjivanje. Automatske promptove odgoditi. | P1/P2. Samo stvarno dostupna store stranica; bez nagrada, uslovljavanja ili pitanja koje preusmjerava samo pozitivne korisnike na javne ocjene. |
| F5 | Str. 5–6: podijeli aplikaciju | Prihvatiti, odvojeno od već postojećeg dijeljenja recepta/knjige. Jedna stavka u meniju, native share sheet, kratak lokalizovan tekst. | P1. Linkovi rade za primaoca; dok aplikacija nije javna, ne slati običnom korisniku nepostojeći javni store listing ili privatni testerski poziv. Po potrebi koristiti javnu landing stranicu. |
| F6 | Str. 6: potvrda za Back | Djelimično prihvatiti. U native App.tsx nema Android BackHandler integracije s internim scenama. Treba provjeriti i urediti redoslijed: zatvori sliku/panel → detalji → rezultat → wheel. Pitati samo ako se stvarno gube nespremljeni odgovori; ne pri svakom povratku. | P0/P1. Android Back ne izbacuje iz aplikacije sa svakog ekrana, ne pokreće dupli spin i ne gubi unos. Na iOS-u nema hardverskog Back-a ni potrebe za dijalogom „izađi iz aplikacije”. |
| F7 | Str. 8: feedback kanal | Prihvatiti. „Prijavi problem” u meniju, verzija/build/platforma automatski, opis i dobrovoljan prilog/log. Dijagnostički share već postoji, ali nije isto što i jednostavan feedback tok. | P1. Nikad automatski ne priložiti ime, alergije/prehrambene odgovore, tokene ili cijelu lokalnu pohranu. Bez obavezne prijave. |
| F8 | Str. 8: redovan sadržaj | Prihvatiti kao urednički proces. Postoje verzionisani katalog i keš; ne uvoditi duplu infrastrukturu ili update binarnog paketa za svaki novi recept. | P1, kontinuirano. Odobrenje, izvori, prevodi, prava na slike i provjera tagova prije objave. |
| F9 | Str. 8: društvene mreže | Odgoditi SDK integracije. Native share pojedinačnog sadržaja već postoji; dijeljenje aplikacije pokriva većinu koristi. | P3. Ne uvoditi Facebook/Instagram login/SDK bez konkretne koristi. |
| F10 | Str. 8: offline | Već postoji lokalni tekstualni katalog/keš i reserve. Prvo provjeriti stvarno ponašanje prije nove implementacije. Vanjski servisi ne postaju offline samo zbog naše aplikacije; nisu sve udaljene slike nužno preuzete. | P0 provjera, P2 eventualni prikaz stanja/slika. Testirati prvi start bez mreže, ponovni start s kešom, pad servisa i povratak mreže. Hard prehrambeni filteri moraju važiti i u reserve režimu. |
| F11 | Str. 8: lokalne GO preporuke | Ideja za kasnije. Trenutni GO nije potvrđena usluga traženja obližnjih restorana. GPS/Places/radno vrijeme/globalna pokrivenost i troškovi su novi proizvodni zahvat. | P3. Ako se kasnije radi, prvo razmotriti dobrovoljan izbor grada; ne tražiti GPS samo radi ovog generičkog prijedloga. |

P0 = prije narednog šireg izdanja; P1 = naredni paket; P2 = nakon osnovnog paketa ili mali dodatak ako ne usporava; P3 = odgođeno.

## Dodatni prioriteti iz stvarnog stanja aplikacije

1. **Potvrditi iOS zoom popravku na telefonu.** Build 0.23.0 (2) napravljen i poslan u TestFlight; provjere CSS/viewporta su prošle. Unos i zatvaranje tastature na stvarnom iPhoneu još treba potvrditi. Android binarni paket ne pretpostavljati ažuriranim zato što je iOS build nov.
2. **Osnovna matrica obje platforme.** iPhone/iPad i barem sporiji Android: prvi start, pet rubrika, dugo ime/naslov, skrolanje, povratak, share, čuvanje profila, suspend/resume i offline. Izvještaj „sve radi” nije zamjena.
3. **Prehrambena ograničenja.** Posebno mliječna alergija naspram laktoze, gluten naspram pšenice, jaja, soja, orašasti plodovi, vegansko/vegetarijansko i potvrđeni low-phosphate tagovi. Provjeriti aktuelni sadržaj i reserve, ne samo algoritamske testove. Nikad tiho ne popuštati hard filter da bi spin dao rezultat. Ako nema odgovarajuće stavke, jasno objasniti stanje.
4. **Privatnost uskladiti s iOS-om.** Trenutni uvod politike navodi web i Android testnu aplikaciju, ne iOS. Prije oglasa proširiti obuhvat, opisati stvarni tok podataka i razdvojiti mobilne funkcije od starog web Spotify prototipa. Trenutna rečenica „nema oglasa/vanjskog praćenja” mora biti izmijenjena kada se oglasi zaista uvedu.
5. **Mjerenje upotrebe.** Postojeći performance logovi su lokalni. Ako uvodimo centralne metrike radi ads eksperimenata, najprije definisati minimalne agregirane događaje, rok čuvanja i objave privatnosti. AdMob broji oglase, ne svaki spin i povratak korisnika. Ne predstavljati mrežne zahtjeve kao broj aktivnih testera.

## Production PDF — kako koristiti deset odgovora

| Pitanje | Procjena / šta stvarno napisati |
|---|---|
| 1. Regrutacija | Navesti plaćeni testing provider ako je korišten. Dodatne „avid readers and food enthusiasts” navesti samo ako su stvarno učestvovali. Ne skrivati plaćeno testiranje. |
| 2. Lakoća regrutacije | Vaša stvarna procjena; „Easy” nije nalaz iz mjerenja. |
| 3. Engagement | Tražiti dnevnu aktivnost, broj stvarnih sesija/testera i konkretne aktivnosti. PDF sam ne dokazuje povećano zadovoljstvo ili angažman nakon dorada. |
| 4. Sažetak feedbacka | Šest glavnih tema iz ovog izvještaja. Način prikupljanja navesti onako kako je dokumentovan; trenutno imamo zbirni PDF, ne dokaz pojedinačnih anketa. |
| 5. Ciljna publika | Ljudi koji žele olakšati izbor jela, knjige, filma/serije, aktivnosti ili izlaska. Ne tvrditi da app pruža medicinski plan ishrane. Dobne skupine uskladiti sa stvarnim sadržajem i store izjavama. |
| 6. Vrijednost | Pet kategorija, otkrivanje ideja i dobrovoljne preferencije; jasni limiti sadržaja i vanjskih servisa. |
| 7. Instalacije | 10k–100k je pretpostavka providera, ne prognoza zasnovana na dokazima. Odaberite vlastitu realnu procjenu. |
| 8. Promjene poslije testa | Ne tvrditi da su tour/rate/share/ASO već završeni. Popuniti tek nakon stvarne implementacije i ponovnog testa Android builda koji šaljete. Ranija iOS-only dorada nije automatski dokaz Android isporuke. |
| 9. Spremnost za produkciju | Potkrijepiti konkretnom verzijom, scenarijima, uređajima i riješenim problemima. Bez tvrdnje da su svi rizici ili svi uređaji pokriveni. |
| 10. Šta je drugačije ovaj put | Odgovor zavisi od konteksta tog pitanja i prethodne prijave. Ne izmišljati raniju odbijenicu ili širu grupu testera. |

Od providera zatražiti: period testa, APK versionName/versionCode, stvarni broj testera i aktivnosti po danima, modele/OS, koje funkcije su isprobali, scenarije i pojedinačne primjere feedbacka. Ako nemaju mjerenja, to jasno odvojiti od općih preporuka.

## Monetizacija — opcije i preporuka

| Pristup | Korist i cijena | Preporuka |
|---|---|---|
| A. Rijetki native interstitial oglasi | Čist ekran dok se koristi sadržaj; prihod zavisi od aktivnih korisnika, dostupnosti oglasa i tržišta. Prekidi traže pažljivo ograničenje i test brzine. | Početna varijanta za dogovor. Jedan AdMob račun, posebne aplikacije/ID-ovi za Android i iOS. |
| B. Interstitial + kupovina „bez reklama” | Korisnik može platiti da ukloni oglase; dodatni billing, restore i provjere prava. | Sljedeća faza ako postoji potražnja. Digitalno uklanjanje oglasa raditi odgovarajućim Apple/Google billingom. |
| C. Stalni banner | Jednostavniji položaj, ali stalno zauzima prostor u već zbijenom layoutu. | Ne preporučujem za prvi paket. |

Ne treba preuzimati web AdSense kod i lijepiti ga preko WebViewa. Koristiti native mobile ads SDK u Expo/React Native omotaču. Kandidat je `react-native-google-mobile-ads` s Expo pluginom; prije usvajanja provjeriti aktuelnu kompatibilnost s Expo 57/RN 0.86 i obje arhitekture. To zahtijeva nove native buildove na obje platforme; nije samo katalog/web/OTA dorada.

### Predloženi početni režim — podesiv nakon mjerenja

- Brojati samo uspješno završene spinove koji daju važeći prijedlog; ne klikove, duple tapove, greške ili samo otvaranje aplikacije.
- Nakon **6 uspješnih spinova** oglas može postati dospio. Broj je početni eksperiment, ne tvrdnja da donosi optimalan prihod.
- Prvi oglas ne prije završenog onboardinga i **2 minute aktivnog korištenja**. Najmanje **3 minute između prikaza**, najviše **3 prikaza u 30 minuta**. Brojače sačuvati lokalno tako da ponovno otvaranje aplikacije ne zaobilazi ograničenja.
- Dospijeće nije automatski prikaz: prikazati na prirodnom završetku pregleda sadržaja/povratku na wheel. Ne prekidati vrtnju, ne odvajati spin od očekivanog rezultata, ne prekrivati recept dok se čita ili profil dok se unosi. Samo dodavanje brojača ne čini položaj oglasa prihvatljivim po store pravilima.
- Ako nema učitanog oglasa, mreže ili odgovarajuće saglasnosti, nastaviti odmah. Ne prikazivati loader za reklamu, ne ponavljati zahtjev u petlji i ne ubacivati zakašnjeli oglas kad se veza vrati usred čitanja.
- Učitavati najviše jedan oglas unaprijed, nakon osnovnog UI-ja i dozvoljenog consent toka. Mjeriti hladni start, memoriju i spin s oglasima i bez njih na slabijem Androidu i iPhoneu; SDK ne smije nekontrolisano završiti na kritičnoj putanji starta.
- Zatvaranje oglasa vraća istu stranicu/stanje; ne gubi prijedlog, ne pokreće dupli spin, ne resetuje profil i ne otvara slučajno vanjski link. Poštovati oglasni/native close mehanizam, prekide i background/resume.
- Reklame ne smiju zavisiti od prijavljivanja, pozitivne ocjene, klika na oglas ili otkrivanja zdravstvenih podataka. Ime, alergije, intolerancije i low-phosphate odgovore **ne slati oglasnim mrežama kao targeting/signale**.
- Consent (npr. UMP i regionalne poruke) i Apple ATT su odvojeni zahtjevi. Ne tražiti ATT automatski samo zato što postoje oglasi: potreban je odgovarajući postupak prije trackinga ako ga izabrana integracija zaista radi. Odbijanje trackinga ne blokira app. Ni „nepersonalizovani” oglasi nisu automatski bez prikupljanja podataka.
- U testnim APK/AAB/TestFlight izdanjima koristiti testne oglase/test uređaje. Plaćene testere izričito ne motivisati da klikaju stvarne oglase. Ne koristiti testiranje kao izvor oglasnog prihoda.

Prihod se ne može pošteno procijeniti iz ova dva PDF-a: približno je prikazi/1000 × ostvareni eCPM, nakon stvarne isporuke. Potrebni su aktivni korisnici, kvalifikovani prikazi, fill rate i tržišta. Između dvije učestalosti izabrati onu koja čuva korištenje, a ne samo veći broj prikaza.

## Šta treba uraditi vlasnik računa

### Zajedničko / AdMob

1. Dogovoriti ko je vlasnik oglasnog prihoda i poreski/isplatni subjekt — Salem ili Ahmed, odnosno stvarni pravni subjekt. Uskladiti operatora politike privatnosti i uloge; postojeći Play račun je Ahmedov, Apple Individual tim Salemov. To ne zahtijeva dva AdMob računa za dvije platforme.
2. Otvoriti/provjeriti Google AdMob račun na odgovarajućem Google računu. Ako već postoji AdSense/AdMob, prvo provjeriti postojeću vezu; ne praviti duplikate napamet. Zemlju, ime i podatke unijeti stvarno. Dovršiti provjere identiteta, isplate/poreza/adrese koje servis traži; neke dolaze naknadno.
3. Dodati dvije AdMob aplikacije: Android `com.salemko.randomlife`, iOS `com.salemko.randomlife`. Povezati odgovarajuće store zapise kada su dostupni servisu; TestFlight/closed-test nisu isto što i javna objava. Dovršiti app-readiness provjere i računati da isporuka oglasa može biti ograničena dok odobrenja nisu gotova.
4. Za svaku aplikaciju kreirati po jednu **Interstitial** jedinicu. Pošalji četiri javna identifikatora: Android App ID, Android Interstitial Ad Unit ID, iOS App ID, iOS Interstitial Ad Unit ID. App ID obično sadrži `~`, oglasna jedinica `/`; nisu zamjenjivi. Privatne ključeve, lozinke i bankovne podatke ne slati u chat.
5. Izabrati kontrolisanu javnu developer web adresu. Na korijen postaviti `/app-ads.txt` s tačnim redom iz AdMoba (ne izmišljati publisher ID), povezati developer website u Google Play i odgovarajući website/Marketing URL u App Store listingu. Provjeriti da je fajl javno čitljiv i da ga AdMob verifikuje. Postojeći Cloudflare Pages domen može biti kandidat ako ga koristimo kao javnu developer adresu.
6. U Privacy & messaging pripremiti potrebne regionalne consent poruke, uključujući evropski i relevantne američke režime. SDK/UMP i poruke provjeriti po aktuelnim zahtjevima mreže. Omogućiti kasniju izmjenu privacy izbora unutar aplikacije gdje je potrebna.
7. Odrediti ciljnu dob/publiku i dozvoljene kategorije/ocjenu oglasa. Ne označavati aplikaciju za djecu ili „nije za djecu” radi zaobilaženja pravila; uskladiti sadržaj, store izjave i SDK postavke sa stvarnim proizvodom.

### Google Play / Ahmed

8. Postojeći developer račun i package zadržati; ne treba nova developer registracija. Prije izdavanja s oglasima promijeniti **Contains ads** u Yes, revidirati Data safety, Privacy Policy, target audience/content rating i eventualnu Advertising ID izjavu prema stvarnim manifestima i ponašanju SDK-a.
9. Koristiti stvarne podatke SDK-a i konfiguracije pri Data safety deklaraciji; ne kopirati univerzalno „Data not collected”. Ako SDK koristi Advertising ID, provjeriti dozvolu/deklaraciju. Ne tražiti lokaciju samo za oglase.
10. Android testni APK/AAB s testnim oglasima poslati u postojeći kanal; po potrebi proći proizvodni pristup s istinitim odgovorima. Za automatski upload u Google Play eventualno treba zasebno ovlaštenje/service account u EAS-u — to nije uslov same AdMob registracije niti ključ za slanje u chat.

### Apple / Salem

11. Postojeći Individual tim `MNQY6SH96C`, bundle ID i ASC aplikaciju `6830084481` zadržati. Ne treba novo Apple članstvo ni posebna „Apple AdMob” registracija; iOS aplikaciju monetizuje izabrana mreža, npr. Google AdMob. Apple Search Ads/Apple Ads je alat za kupovinu promocije, nije registracija za zaradu od oglasa u našoj app.
12. Ažurirati **App Privacy**, Privacy Policy/URL i pitanja o oglasima/dobnoj ocjeni gdje se pojavljuju. Ako integracija radi tracking, uskladiti ATT tok, NSUserTrackingUsageDescription i odgovore; ne prikazivati prompt bez potrebe. SKAdNetwork/SDK privacy manifest konfiguraciju provjeriti prema aktuelnoj dokumentaciji.
13. Novi SDK ide u novi potpisani iOS build; TestFlight QA s testnim oglasima, zatim App Review odgovarajućeg produkcijskog builda. Ne obećavati odobrenje niti da testni build automatski postaje javno dostupan.

## Predloženi redoslijed dorade

1. Dogovoriti backlog i početni ad režim; pribaviti trenutno testirane verzije/screenshotove i detaljnije podatke providera.
2. Zatvoriti P0 provjere: iOS zoom, Android Back, prehrambeni filteri/offline, politika privatnosti za obje platforme.
3. Mali UX paket: feedback, Share App, opcionalni kratki vodič; rate stavka tek s ispravnim store ponašanjem. Urednički i store opis/screenshotovi paralelno.
4. Vlasnik priprema AdMob i ID-ove. Mi biramo/provjeravamo SDK, consent i native tok, pravimo testnu integraciju i mjerimo regresije.
5. Novi Android i iOS testni buildovi istog funkcionalnog obima. Testirati učestalost, mrežu/offline, zatvaranje, Back/background i cold start. Ne pustiti žive oglase za plaćene QA klikove.
6. Nakon prihvaćenih rezultata uskladiti store deklaracije i objaviti kontrolisano. Pratiti crash/ANR, korištenje i prihod bez slanja zdravstvenog profila.

## Potrebni dogovori prije implementacije

- Da li prihvatamo opciju A, početno 6 spinova + vremenska ograničenja i prirodni prelaz, a kupovinu „bez reklama” ostavljamo za kasnije?
- Ko je vlasnik AdMob/isplatnog računa i koju developer web adresu koristimo?
- Koje zemlje/dobne skupine stvarno ciljamo i kakve oglase želimo isključiti?
- Koji minimalni agregirani događaji su nam potrebni za procjenu učinka i ko ih čuva?

## Službene reference za završnu provjeru prije integracije

- AdMob interstitial položaji: https://support.google.com/admob/answer/6201362
- Google Play pravila o oglasima: https://support.google.com/googleplay/android-developer/answer/9857753
- AdMob iOS privacy/UMP: https://developers.google.com/admob/ios/privacy
- app-ads.txt: https://support.google.com/admob/answer/9363762
- Apple App Review Guidelines, Advertising: https://developer.apple.com/app-store/review/guidelines/#advertising
- Kandidat za React Native SDK: https://docs.page/invertase/react-native-google-mobile-ads

Pristup ovim živim dokumentacijskim stranicama je u ovom okruženju vraćao mrežni 403, pa njihova najnovija formulacija nije potvrđena ovom analizom. Konačne dozvole, SDK postavke, regionalne poruke i store obrasce provjeriti u aktuelnoj dokumentaciji/konzolama prije implementacije i objave. To nije dokaz da je AdMob/Apple odbio našu aplikaciju.
