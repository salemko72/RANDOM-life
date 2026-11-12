# Ahmedov Codex — preostali AdMob i release zadaci

Datum: 12.11.2026. Prvo pročitaj AGENTS, STATUS, TASKS, ADS_001_REVIEW i [Salemov release nalaz](ADS_002_RELEASE_CHECK.md). Ovaj dokument je u repozitoriju; drugi account ne dobija automatsku chat obavijest.

## Vlasništvo i grane

- Tvoj ADS-001 claim i PR #1 ostaju aktivni. Salemova grana `codex/salem-ads-release-check` dodaje release dokaze i ove upute; ne mijenja App.tsx, app.json/eas.json, SDK adaptere ili tvoje web datoteke.
- Zajednički testni source je **bfc71733de64d8f7f30fb3831b6b19af64bfc1a7**: PR head `5a603da71b1716143887fcdb3a8dec3614a1a016` plus dokumentacijski claim/plan. Aplikacijski sadržaj je jednak implementaciji `e1228ed725d63a56e280e00d3c840ab5890311b6`.
- Fetch svih grana i provjera najnovijih claimova prije nastavka. Ne prepisivati TASKS iz druge grane u cijelosti. Ako popravka mijenja aplikacijski kod, novi kandidat dobija novi čist SHA i nove odgovarajuće build dokaze. Ne predstavljati stari build kao provjeru novog koda.
- Bez automatskog mergea, force pusha, dodatnog troška, produkcijskog deploya, DB izmjene ili store submissiona. Ne pokretati `npm run update:ios`: taj helper automatski šalje build.

## 1. Build dokazi i brojevi — Ahmed + Salem

**Sva tri builda su FINISHED; nemoj ih ponovo praviti samo radi preuzimanja.** Download ovdje blokira restricted proxy za `wf-artifacts.eascdn.net`. Otvori postojeće EAS stranice iz nalaza, preuzmi artefakte kroz ovlašteni account, izračunaj SHA256 i provjeri finalne manifeste/potpise. Ako tvoj Expo account nije ovlašten, Salem može preuzeti u svom browseru ili dodijeliti odgovarajući pristup; ne dijelite tokene. Mrežni allowlist u ovom okruženju i GitHub API403 ne znače da tvoj lokalni pristup ne radi.

Salem je read-only sačuvao56 poznatih downloads fajlova i config hash; backup je lokalni i prije deploya treba provjeriti novododane putanje. Nema odobrenja za deploy.

- [ ] Pročitaj završni/pending status svakog EAS ID-a iz ADS_002_RELEASE_CHECK prije novog builda; nemoj praviti duplikate dok postojeći rade.
- [ ] Ahmed provjerava najviši versionCode u svim Play trackovima, draftovima i App Bundle Exploreru, ne samo productionu. Salem provjerava App Store Connect/TestFlight inventar za isti bundle/verziju. EAS posljednji raniji brojevi bili su Android7/iOS2; testni kandidati9/3 nisu potvrda slobodnih brojeva u trgovinama.
- [ ] Uporediti Android upload certificate fingerprint s postojećim Play upload ključem. Keystore se ne smije zamijeniti bez potrebe; ne dijeliti privatne ključeve.
- [ ] Za završene artefakte upisati EAS ID, source SHA, profile, build broj, SHA256 i QA status. Ne commitovati APK/AAB/IPA, tajne ili potpisane download URL-ove. App Store IPA se ne može proizvoljno instalirati direktno na iPhone; TestFlight upload traži posebno odobrenje.

## 2. Stvarni native audit — poseban blokator prije live izdanja

- [ ] iOS: iz završenog EAS/Mac builda provjeriti Podfile.lock, potpis, Info.plist/device family i ugrađene privacy manifeste. EAS logovi već potvrđuju GMA13.10.0, UMP3.1.0 i uspješno Xcode arhiviranje; finalni IPA pregled ostaje. Lokalno generisani Xcode projekt ima family1 i portrait, ali to samo nije dokaz završene arhive.
- [ ] GMA13.10.0 službeni manifest navodi DeviceID za tracking; NPA sam ne dokazuje odsustvo trackinga. Provjeriti stvarne AdMob iOS poruke i da IDFA/ATT explainer tok nije uključen za ovaj kandidat bez ATT poziva/opisa. Ako se traži tracking, prvo dogovoriti i testirati pravi ATT tok. Ne uključivati ga samo radi uklanjanja upozorenja.
- [ ] Ne oslanjati se na publisherPrivacyPersonalizationState/first-party-ID setter kao aktivne kontrole u 17.4.0; postojeća predaja dokumentuje njihove limite.
- [ ] Android: provjeriti konačni merged manifest i permissions iz AAB/APK, uključujući AD_ID, SDK dependencies i stvarni NPA request put. App-level prebuild manifest nije konačni manifest.

## 3. Fizički QA — Ahmed Android, Salem iPhone

Za svaki red evidentirati model, OS, EAS ID/build, regiju/debug postavku, datum i PASS/FAIL sa dokazom. Testirati Google testnim jedinicama. Debug regiju/test-device ID-eve držati lokalno, ne u live releaseu.

| Scenarij | Android | iPhone | Očekivanje |
|---|---|---|---|
| Prvi launch / consent accept | nije fizički testirano | nije fizički testirano | forma gdje je potrebna; zahtjevi tek nakon canRequestAds |
| Consent reject / promjena izbora | nije fizički testirano | nije fizički testirano | katalog radi; stari preload odbačen; dozvoljeni oglasi prema novom izboru |
| Offline / greška / no-fill | nije fizički testirano | nije fizički testirano | nema blokiranja/spinner petlje ni odgođenog iznenadnog oglasa |
| Učestalost / restart | nije fizički testirano | nije fizički testirano | 6 završenih spinova + 2 aktivne minute; potom 3 min razmaka, najviše3/30min; čuvanje limita |
| Background/resume/povratak iz oglasa | nije fizički testirano | nije fizički testirano | nema duplog prikaza, zamrznutog interfejsa ili prikaza iz load callbacka |
| Navigacija / share / tastatura | nije fizički testirano | nije fizički testirano | Back, paneli, lokalno uređivanje i povratak ispravni; iPhone bez zoom problema |
| Slike i filteri online/offline | nije fizički testirano | nije fizički testirano | generičke BOOK/WATCH slike; alergeni i hard dietary filteri ostaju strogi |

## 4. AdMob i Play Console — Ahmed

- [ ] Oba platform app ID-a povezana s odgovarajućom aplikacijom; iOS i Android interstitial jedinice nisu zamijenjene. Provjeriti app readiness i ograničenja posluživanja.
- [ ] UMP poruke objavljene i vezane za oba app ID-a i potrebne regije; potvrditi stvarno prikazivanje i kasniju promjenu izbora. Ranija potvrda objave poruka nije fizički QA.
- [ ] Publika je16+; Play dobne grupe i IARC pitanja popuniti prema stvarnom sadržaju. Ne uključivati djecu ispod16 i ne izvoditi pojedinačni under-age consent status samo iz store ocjene.
- [ ] Contains ads, Data safety, advertising identifier upotreba i privacy URL usklađeni s konačnim manifestom/SDK podacima. Nepersonalizovani oglasi nisu Data not collected.
- [ ] app-ads.txt crawler mora vidjeti tačan red na domenu developer/marketing web stranice koji je vezan uz store listing. Testni buildovi ostaju na testnim jedinicama.

## 5. Web — pripremljeno u sourceu, deploy čeka konkretno odobrenje

- [ ] Sačuvati kompletan aktuelni /downloads inventar i postojeće CONTENT_DB/CONTENT_BUCKET bindinge prije staginga. Salemov lokalni backup nije automatski dostupan tvom accountu; ne objavljivati privatne backupe niti tražiti Studio lozinku u chatu.
- [ ] `stage-preview.mjs` briše staging. Ne deployati direktno svježi staging preko produkcije bez vraćanja i hash provjere svih postojećih downloads.
- [ ] Predati konkretan staged diff/safe backup rezultat Salemu i tražiti odobrenje za taj deploy. Nalog da se završe lokalne provjere nije produkcijsko odobrenje.
- [ ] Poslije odobrenog deploya provjeriti stvarni text/plain publisher red, korisnu podršku i novu politiku; HTTP200 fallback nije uspjeh. Ponovo provjeriti stare downloads i bindinge, zatim AdMob crawl/store website URL-ove.

## 6. Apple — Salem

- [ ] Popuniti App Privacy prema stvarnom SDK nalazu, dobni upitnik i kontakt; potvrditi bez consumer sign-ina.
- [ ] Fizički iPhone video od pokretanja aplikacije i QA na najnovijem javnom iOS-u.
- [ ] Popuniti i provjeriti [engleski Apple Notes nacrt](APPLE_REVIEW_RESPONSE_DRAFT.md), posebno regionalne razlike i sadržajna prava. Bez automatskog slanja.

## 7. Sadržaj i opis lokalnih preferencija

- [ ] RIGHTS-001: provjeriti porijeklo tekstova/prijevoda/podataka. Read-only javni katalog12.11. ima55 WATCH zapisa s TMDB source URL-om i5 BOOK zapisa bez source hosta. To ne dokazuje da je svih55 tekstova kopirano niti da drugih prava nema.
- [ ] Za svaku spornu stavku dokumentovati stvarni izvor, šta je preuzeto, licencu/osnov korištenja i uredničku provjeru. Historijske napomene o posterima/omotima nisu dozvola za tekst. Ne mijenjati source label radi prikrivanja porijekla.
- [ ] Ako nema odgovarajuće besplatne osnove, predložiti nezavisno provjerene činjenice/originalni urednički tekst ili uklanjanje stavke; produkcijsku izmjenu tek nakon odobrenog opsega. Ne uvoditi plaćenu licencu/API.
- [ ] PREF-001 nije završen: lokalne preference su promjenjive; nema pravog server profila. Prije izmjena UI-a claimati tačne fajlove i uskladiti s ADS-001.

## Završna predaja

Commit + push + PR, vlastita sesija, tačan SHA, build ID-evi i testni dokazi. Odvojiti implementirano, lokalno testirano, native buildano, fizički testirano, uploadano i objavljeno. Ne označiti ADS-001 done dok preostali native/fizički/release uslovi nisu stvarno ispunjeni.
