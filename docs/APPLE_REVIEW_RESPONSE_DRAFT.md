# Apple Guideline 2.1 — nacrt odgovora

Datum: 12.11.2026. **Nije poslano Appleu.** Ovo je predložak za novog AdMob kandidata, ne opis starog builda 2. Prije slanja zamijeniti polja u uglastim zagradama i provjeriti svaku tvrdnju na stvarnom fizičkom iPhoneu. Ne predstavljati inventar izvora kao dozvolu za korištenje sadržaja.

## Preduvjeti za Salemov App Store Connect

- Potvrditi build broj u App Store Connectu prije eventualnog uploada. Testni kandidat je 0.23.0 (3); EAS historija sama nije inventar ASC-a.
- App Review Information: stvarni kontakt vlasnika; Sign-in required isključiti samo zato što consumer aplikacija nema serverski račun. Ne izmišljati demo credentials.
- App Privacy popuniti prema konačnom SDK/build/UMP nalazu; ne koristiti Data not collected za ads izdanje. Namjeravana publika 16+ ne zamjenjuje odgovore na Apple dobni upitnik.
- Testirati instalirani kandidat na podržanom fizičkom iPhoneu s najnovijim javnim iOS-om i navesti model, OS, verziju/build i datum.
- Snimak počinje pokretanjem aplikacije. Prikazati: izbor ENG/BHS, uvod/lokalne preference, spin i rezultat, detalje/vanjski link, favorite, uređivanje i brisanje lokalnih preferencija, offline katalog te oglasnu privatnost. Testni oglas pokazati na prirodnoj pauzi ako se pojavi; ne prisiljavati live klikove.
- Video postaviti na reviewer-accessible HTTPS URL bez prijave i provjeriti u privatnom prozoru. URL ne smije isticati tokom reviewa. Nije napravljen video u ovoj sesiji.
- Objavljene support/privacy putanje i App Privacy trebaju odgovarati kandidatu. Web deploy i upload trgovini nisu odobreni ovim dokumentom.
- Završiti RIGHTS-001: stvarno dokumentovati porijeklo tekstova/podataka; ako su potrebne dozvole, priložiti stvarne dokumente ili ukloniti/zamijeniti sporni materijal uz odobrenje.

## Predloženi Notes tekst na engleskom

**1. Physical-device demonstration**
Video: [INSERT ACCESSIBLE VIDEO URL]. Recorded on [IPHONE MODEL], iOS [VERSION], LifeSpinner [VERSION / BUILD], on [DATE]. The recording begins with launching the installed app and demonstrates the normal recommendation flow and local preferences. [DESCRIBE ACTUAL CONSENT/TEST-AD SEGMENT, IF RECORDED.]

**2. Purpose and audience**
LifeSpinner is a lifestyle recommendation app intended for people aged 16 and older who want help choosing what to cook, read, watch or do next. Users select interests and optional preferences, spin the wheel and receive an editorial recommendation. The app reduces everyday choice overload. The current categories are EAT, READ, WATCH, MOVE and GO. It does not provide medical diagnosis or treatment; dietary options are recommendation filters and ingredient suitability must be checked by the user.

**3. Access and main features**
No registration, login, subscription or paid unlock is required. The consumer app has editable local preferences, rather than a server account or public profile. Launch the app, choose English or Bosnian, complete or skip optional preference questions, and select a wheel category. Spin to open a recommendation, inspect its details, save it to favorites, or open an external information/provider link. Local preferences can be changed later; deleting them removes the app's local preference/favorite/history data on that installation. Separate ad-frequency counters remain. There is no in-app user-generated-content feed, messaging service or paid content unlock. Sharing uses the operating-system share sheet. [VERIFY THESE STEPS AGAINST THE SUBMITTED BUILD.]

**4. External services and tools**
Cloudflare Pages/Workers deliver the application content API and image assets. Cloudflare D1 stores editorial catalogue records; R2 supports editorial content storage. Consumer preferences are stored locally on the device and are not sent to the advertising SDK as targeting data. Native ads editions use Google Mobile Ads and Google UMP for advertising and privacy choices. This review candidate uses Google's test ads. The app opens some external book, streaming or information links; any purchase or availability on those destinations is outside LifeSpinner. There are no AI API calls during a user's spin. Expo/EAS is used for building the app, rather than as a recommendation data provider. [ADD A VERIFIED DESCRIPTION OF EDITORIAL DATA SOURCES AFTER RIGHTS-001; DO NOT OMIT RELEVANT THIRD-PARTY SOURCES.]

**5. Regional behavior**
The core recommendation interface is designed to work consistently across regions. Advertising eligibility, privacy messages and ad availability can vary by region and consent. Availability and language of externally linked services may also vary. [CONFIRM THE ACTUAL REGIONAL CONFIGURATION AND ANY ADDITIONAL CONTENT DIFFERENCES BEFORE SUBMISSION; ALL-REGION QA HAS NOT BEEN COMPLETED.]

**6. Regulated services and protected material**
LifeSpinner does not operate a regulated medical or financial service. The BOOK/WATCH illustrations in this candidate are 15 original generic illustrations, rather than official film posters or book covers. [INSERT VERIFIED TEXT/DATA PROVENANCE AND ANY ACTUAL AUTHORIZATION DOCUMENTS AFTER RIGHTS-001. REPLACING IMAGES ALONE DOES NOT ESTABLISH RIGHTS TO TEXT/DATA.]

## Šta ovaj nacrt ne potvrđuje

Nema Apple odobrenja, stvarnog fizičkog videa, provjerenih svih regija, završene ATT odluke ili potvrđenih prava na sve katalog tekstove. Ne kopirati nepopunjeni predložak kao gotov odgovor.
