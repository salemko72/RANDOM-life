# LifeSpinner1.0.1 iOS7 — TestFlight kandidat24.11.2026.

Application source **2a0503c249b11a3e2afad44266cc687644bfb417**, grana `codex/salem-ios-build7-cinema`. Osnova Ahmedov zajednički app pin2fa68549d444a309fb4e1dd32b953fe18476a037/docs15dad55fce4a82af3dad317e2f8879d19e593df3. Bez mergea; korisnik traži novi TestFlight build i precizira oglase.

## Ponašanje

- Brojati **5uspješno završenih vrtnji**, zatim provjeriti oglas samo pri narednom centralnom, kategorijskom ili repeat Spin pritisku. Stari6spins/2min/Home placement uklonjen. Menu/Home/favorites/profile/history/privacy/foreground nisu interstitial prilike.
- Spin čeka native odgovor: ako oglas postoji i smije se prikazati, vrtnja počinje tek nakon CLOSED; ako nije spreman/consent nije dozvolio/no-fill, nastavlja odmah. Kasni load callback nikad sam ne prikazuje oglas. Bez odgovora15s zahtjev se otkazuje i nudi ponovni Spin, umjesto beskonačnog čekanja.
- Postojeći **min3minute između oglasa / max3u30min** zadržani kao izričito saopštena podrazumijevana odluka dok korisnik nije odgovorio na dodatno pitanje. Ovo nije obećanje da će svaka šesta akcija prikazati oglas: consent, raspoloživost i capovi važe.
- Brojač/capovi ostaju native/durable; nisu resetovani oporavkom WebViewa. Privacy događaj tokom oglasa čeka CLOSED, bez uništavanja callbacka. Shared close barrier, native document token i App response epoch čuvaju recovery/same-view reload od starih responseova. Ne šalju se preference ili zdravstveni podaci SDK-u.
- Kino dvorana sada ima vintage counter5 na platnu. Zadržan generički lokalni URL; consumer za generic slike čita novi bundled asset prije mreže/IDB, uključujući online/cache/offline. Metadata imageBytes osvježena, nijedan record/nutrition/ingredient/translation tekst nije promijenjen.
- Sačuvani onboarding buttoni, Spin again kategorija nakon Home/detalja, menu footer/build, auto/manualni jezik, recipe korekcije100offline/17bounded consumer patch i iOS/Android renderer recovery. **ES/PT-BR/DE/IT source draftovi ostaju neaktivirani; produkcijski izboren/bs.** Nema D1 promjena.

## Native konfiguracija

- iOS1.0.1(7), `com.salemko.randomlife`, iPhone-only/portrait; Android12 ostaje kandidat za isti source, ne predstavlja novi APK/AAB.
- Profil **testflight** ostaje **test ads**, Store distribucija/TestFlight upload, bez javnog App Store releasea.
- Pin `macos-tahoe-26.6-xcode-27.2`, prema Expo infrastructure dokumentaciji9.11.2026. SDK57/Expo57.0.32 uz expo-build-properties57.0.24 i ios.enableSceneSupport:true. Generisani AppDelegate koristi ExpoReactNativeFactoryProvider, bez legacy startReactNative; Info.plist sadrži EXExpoAppSceneDelegate, multipleScenes:false. Native compile/Xcode/SDK dokaz tek nakon stvarnog EASbuilda.
- Generated prebuild je sačuvan izvan repo archive u `/workspace/shared/ios7-prebuild.v9mqly/ios`; iOSfolder je ignored i izuzet iz lokalnog projekta prije EASmanaged builda.
- Postojeći potpis samo read-only javnim poljima provjeren: certserialCC1209C468F7ABC54F45E3BFA7E67FB i active provisioning do3.11.2027. Bez čitanja/ispisa privatnog ključa/passworda u preflightu. Build mora koristiti --freeze-credentials.
- EAS24.11. prije builda: Free10/30, iOS6/15, overage/estimated0. Najveći EASiOS6 (89d27194-7318-4264-8af8-ef1ad8cedf6d, source4b09443), nema7u inventaru; ASC broj nije nezavisno potvrđen. [Odabrani preflight dokaz](reviews/ios7-preflight-20261124.json).

## Provjere na aplikacijskom sourceu

- `npm test -- --maxWorkers=2`: **403/403,61fajl PASS**. Prethodni full run otkrio metadata imageBytes mismatch i novi UI string bez4draft ključeva; popravljeni metadata i korišten postojeći Spin again ključ. Puni katalog test je timeoutao pri istovremenom Metro exportu; finalni kontrolisani puni run je prošao bez podizanja timeouta.
- TypeScript, preview PASS. Lokalni iOSHermes/Metro export915modula PASS, nije Xcode/Pod/IPA build.
- `smoke-spin-ads.mjs`: stvarni WebExperience + stvarni native AdController sa SDK boundary doubleom; centralni/kategorija/repeat —5rezultata, nav bez oglasa, naredni Spin pokaže jedan, vrtnja čeka CLOSED, šesti rezultat PASS.
- `smoke-native-resume.mjs`: iOS+Android App.tsx lifecycle, cache purge, latest preference/history/favorite/locale/build, catalogue clear race, stale native callbacks i same-view reload response guard PASS.
- `smoke-ads-bridge.mjs`: web/native capability/privacy/bounded messages/noHome placement PASS; `smoke-generic-artwork.mjs`: sve3porodice bez starih mrežnih slika/offline PASS.
- Prebuild config: scene manifest/provider, iPhone family1, portrait only(no landscape), bundle/version/image pin PASS. Prvi check je preusko očekivao samo upright portrait, umjesto postojećeg Expo portrait+upsideDown; provjera ispravljena, konfiguracija nije mijenjana zbog toga.
- Nezavisni read-only review: recovery close barrier i same-document epoch nalazi popravljeni uz RED->GREEN regresije; followup nema preostalih važnih nalaza. Dodatno potvrđen old-hydration event guard i privacy-during-open-ad ponašanje.

## Stanje isporuke

Source je implementiran/testiran; stvarni EASbuild/submission/Appleprocessing i fizički QA se evidentiraju naknadno u sesiji i release handoffu. Nema automatskog mergea, web/D1 deploya, Android builda, prod App Store releasea ili dodatnog troška.

Za Ahmeda: ovaj app commit je novi zajednički code pin za Android12/iOS7 (sa iOS-specifičnim scene/image configom). Ne buildati stari2fa ako želi iste oglase/sliku. Primijeniti vlastitu granu/predaju, svježe provjeriti Play broj/kvotu/signer; nema pretpostavke automatskog obavještavanja.

Fizički QA na iPhoneu i Androidu ostaje potreban:5vrtnji i naredniSpin svih3ulaza; menu/Home/profile/history bez oglasa; consent/refuse/no-fill/offline; povratak/close oglasa i dug background/resume; sačuvani podaci, low-phosphate/allergen hard filteri, ispravljeni sadržaj i nova kino slika. TestFlight služi za ove provjere, nije potvrda gotovog store reviewa.
