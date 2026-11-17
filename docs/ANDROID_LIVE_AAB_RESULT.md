# Android live AAB — stvarni rezultat16.11.2026.

**Build je FINISHED, AAB je preuzet i lokalno provjeren. Nije poslan na Google Play.**

| Stavka | Provjeren rezultat |
|---|---|
| EAS build | `ff9cee28-f381-454b-9954-ec0bb63b1546` |
| Javni build link | https://expo.dev/accounts/salemko/projects/random/builds/ff9cee28-f381-454b-9954-ec0bb63b1546 |
| Source | `1d334308483d9064fb853aa106ec3a9e49b8046e`, čist izdvojeni checkout |
| Profil/platforma/distribution | ads-live / Android / STORE app-bundle |
| Verzija / versionCode | **0.23.0 /10** |
| Predati fajl | `LifeSpinner-0.23.0-10-live.aab` |
| Veličina | **65.894.590 bajtova** |
| **AAB SHA256** | **`26b5d59e387987392f1574520af473a310ec98fdac4fbec5a145e8e342e5cd47`** |
| Bundletool validate | PASS, službeni prethodno hash-provjereni1.18.3 |
| JAR potpis | jarsigner verified; RSA; isti signer kao code9 koji je Play prihvatio |
| Signer cert SHA256 | `67768f6f56b3d542ab700b91e3e2dce6f0682c4798fa908927d53593cde6ed6e` |
| Paket / minSdk / targetSdk | com.salemko.randomlife /24 /36 |
| Native SDK metadata | GMA25.5.0, UMP4.0.0 |

Lokalna isporuka je u workspace `output/android-live-release-2026-11-16/` pored repozitorija: AAB, SHA256.txt, RELEASE.txt i tehnički dokazi. Nije dodat u Git, javni web downloads ili Play. Drugom accountu lokalni folder nije automatski dostupan; koristi ovlašten EAS download ili korisnikov prijenos stvarnog fajla. Privatni potpisani artifact URL-ovi i signing podaci nisu u ovoj predaji. [Mašinski čitljiv rezultat](reviews/android-live-aab-2026-11-16.json) sadrži samo sigurne tehničke nalaze.

## Source, oglasi i finalni manifest

Profil `ads-live` nasljeđuje production/store/app-bundle i postavlja `EXPO_PUBLIC_LIFESPINNER_ADS_MODE=live`. CLI je potvrdio da nema production EAS varijabli koje bi ga prepisale i da se env učitava iz tog profila. Finalni EAS build metadata potvrđuje isti frozen source1d33430, profil, verziju i code10.

Android AppID u **finalnom** manifestu je `ca-app-pub-8395430021391101~6926064985`; AD_ID dozvola i DELAY_APP_MEASUREMENT_INIT=true su prisutni. MainActivity je portrait (bundletool ispisuje enum vrijednost1). Čitač provjere je prvobitno očekivao string portrait i zaustavio se; ispravno je prihvaćena enum vrijednost1, bez promjene AAB-a ili sourcea.

Source i pregledani Metro live release export potvrđuju stvarnu Android jedinicu **`ca-app-pub-8395430021391101/6024046858`**, literal mode:live, NPA zahtjev i odsustvo runtime env lookupa. Taj export i328testova/TypeScript su rezultat istog aplikacijskog kandidata iz sesije07, ne nova tvrdnja o fizičkom telefonu. Finalni ugrađeni Hermes bundle je uspješno disasembliran; ima runtime/adapter, pravu jedinicu i NPA put. Hermes koristi constant-object buffer za runtime opcije, pa live/test status nije izveden samo iz prisustva stringova; dokaz je povezani source+profile/env+release export+finalni build metadata. Oba tipa ID stringova mogu legitimno ostati u SDK/adapter binarnom paketu.

Finalni JS/Hermes bundle:1.472.236bajta, SHA256 `75a15014d3a14e22ef868495fd3f2f5129ef4f0e879041b6e630ebd0f2e9c84a`. GMA i UMP verzije pročitane su iz stvarnog AAB ZIP metadata. Manifest sadrži iste postojeće storage(max32)/overlay/foreground i oglasne dozvole iz prethodnog SDK sourcea; nije dodavana precizna lokacija ili nova logika ciljanja.

Jarsigner upozorenja o self-signed certifikatu/no timestamp nisu neuspješan Android upload potpis. Certifikat važi do2.3.2054, a fingerprint se tačno poklapa s prethodnim APK/AAB signerom. Ovo nije tvrdnja da je novi AAB već prošao Play upload provjeru; novi fajl nije uploadan.

## Pristup, kvota i jedan build

Korisnik je nakon Expo invitationa izričito vratio build izvršavanje Ahmedovom Codexu. CLI potvrđuje ahmochera/Developer u salemko i pristup postojećem projektu. Novi claim je objavljen prije izvršavanja; Salemov zasebni claim8b3db30 je evidentiran, njegovi fajlovi nisu uređivani ni zadatak proglašen done. EAS je provjeren dva puta prije kreiranja: nema live/code10 ili aktivnog Android builda. Direktni Play inventar16.11. ima4/4 verzije9/7/6/5. Pokrenut je **samo jedan** build; njegov ID je odmah pushan u TASKS radi izbjegavanja duplikata.

Free kvota prije:5/30ukupno, Android2/15; poslije:6/30ukupno, Android3/15. Overage count0, cost0, estimated total0. Postojeći remote keystore korišten bez kreiranja ili rotiranja credentials. Nema iOS-a, novog projekta, web deploya, DB migracije ili dodatnog plaćenog resursa.

## Granice i sljedeće

Ovim je završen **build-only** cilj ANDROID-LIVE-001. APK9 korisnik je ranije fizički testirao, ali novi live AAB10 nije fizički instaliran/QA potvrđen. AdMob account Requires review/store link, crawler/readiness, puna regionalna consent/lifecycle QA, RIGHTS-001 i završni Play pregled ostaju odvojeni release uslovi. Nema tvrdnje da će produkcijski oglasi već biti isporučeni prije AdMob odobrenja. Manualni test-device unos je korisnik odgodio; za kasniji QA stvarnih ad-unitova treba koristiti dogovoreni testni režim.

Koristiti ovaj postojeći rezultat, ne praviti duplikat. Nakon vlasnikovog odobrenja može se pripremiti odgovarajući Play track/upload i pregled promjena; upload/submission/rollout nisu izvršeni ovim nalogom. Ako source mora biti promijenjen, dokumentovati novi SHA i odabrati sljedeći slobodan code prije novog builda.
