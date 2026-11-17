# Salem — oznaka instalirane verzije/builda — 17.11.2026.

Grana `codex/salem-build-label`; claim0595ed3 objavljen prije implementacije. Kod **28e67a92b8016de3a87790f326d5c37193597ddb**. Sitna10px oznaka `v1.0.1 · build 5` u gornjoj traci i vrhu menija; vrijednosti nisu hardkodirane. Native App.tsx koristi već postojeći platformski nativeBuild iz ugrađenog appConfiga i šalje verziju/broj/platformu u native-state.js. UI formatira validne iOS/Android metapodatke. Web bez native metapodataka ne izmišlja build.

Bez dodatnih SDK dependencyja, mrežnih zahtjeva ili D1 čitanja za oznaku. Native bootstrap se osvježava pri svakom pokretanju; profili/cache/ads zastavica ostaju u postojećem toku. Label format odbija neispravne/preduge/injection vrijednosti; React tekstualni prikaz.

## Provjere

TDD: formatter i native→WebView bridge test prvo2FAIL/6PASS zbog nepostojeće oznake/metadata, zatim8/8PASS. npm test337/337,45/45files; TypeScript i preview PASS. Browser:390ENG/iOS5,320BHS/Android11,430ENG/iOS123 sa različitom verzijom i web bez metapodataka PASS. Header staje u viewport,10px font; isti podatak u meniju. Screenshot `/workspace/shared/build-label-menu-en-390.png` vizuelno pregledan (testni bootstrap, nije fotografija fizičkog iPhonea). git diff --check PASS.

## Prijava Spin again i odvojeni Home put

Korisnik je prijavio FOOD→MOVE, ali potom potvrdio da je tada bio instaliran build3 i tek nakon toga5. Ne tvrditi da je dokazao grešku direktnog rezultata u5.

Nezavisno je testom potvrđena rupa5 u putu FOOD→Home→rail Spin again: stari handler je na Home gubio target. Claim19c0a3e i zasebni kod **1cdfb4287e4fb9107953b9e8bdd24a9504244a4c** na codex/salem-spin-again-home. Handler sada koristi kategoriju zadnjeg itema i poslije Home; centralni hub ostaje opći. Browser ENG/BHS svih5kategorija, ponavljanje/seen wrap, Home i recipe detail→Home→repeat PASS, red prije korekcije očekivano pao. Ova grana nasljeđuje taj kandidat; to nije razlog za retroaktivno označavanje trenutnog TestFlight5 pokvarenim.

## Predaja / granice

Kod pushan; GitHub API/PR otvaranje ranije blokirano, PR nije otvoren. [Compare prema već objavljenom build5 source/dokumentaciji](https://github.com/salemko72/RANDOM-life/compare/codex/salem-offline-build5...codex/salem-build-label?expand=1). Uključuje oba odvojena mala code commita i njihove claimove.

Nema novog native builda, promjene verzije/broja, ZIP-a, mergea, deploya, store slanja ili troška. Već uploadani **1.0.1(5), source4a567c3** nije promijenjen; oznaka ide u naredni zajednički source/build nakon ostalih korisničkih testova. Android/iOS pri tom koristiti isti novi pin i odvojene provjere/brojeve. Ahmedove grane/fajlovi i tuđi untracked rad sačuvani.
