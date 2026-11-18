# Android1.0.1/code11 — završeni AAB s pravim oglasima

**18.11.2026.: build FINISHED, AAB preuzet i provjeren. Nije uploadan na Google Play ovom sesijom.**

| Stavka | Rezultat |
|---|---|
| Source | `4a567c339a7efeff625ccecf1024887c7e9c9cd4`, čist detached checkout |
| EAS | [23da768d-7126-4408-9597-1ce81bb58f99](https://expo.dev/accounts/salemko/projects/random/builds/23da768d-7126-4408-9597-1ce81bb58f99) |
| Profil/platforma/distribution | ads-live / Android / STORE app-bundle |
| Verzija / versionCode | **1.0.1 /11** |
| Fajl | **LifeSpinner-1.0.1-11-live.aab** |
| Veličina | **65,907,033bytes** |
| SHA256 | **`925422a1fb79d10b6d963717e717658aa7fe4510197989ae141bfd9aed596b86`** |
| Potpis | jarsigner verified; isti upload signer kao code10/code9 |
| Certifikat SHA256 | `67768f6f56b3d542ab700b91e3e2dce6f0682c4798fa908927d53593cde6ed6e` |
| Manifest | com.salemko.randomlife / min24 / target36 / portrait |
| SDK | GMA25.5.0 / UMP4.0.0 |

Lokalni fajl je u workspace `output/android-live-release-2026-11-18/` pored repozitorija, uz SHA256.txt, RELEASE.txt i provjere. Nije u Git-u ili javnom downloads. Ovlašteni EAS download dostupan je preko build stranice. [Strukturirani dokaz](reviews/android11-live-aab-2026-11-18.json), [sesija13](../collaboration/sessions/2026-11-18-ahmed-admob-13.md), [draft PR4](https://github.com/salemko72/RANDOM-life/pull/4).

Source iz najnovijeg BUILD5_SHARED_HANDOFF zamjenjuje stari build4/ded4bf6 paket i isti je kao iOS5. Sadrži onboarding dugmad, kategorijski ponovni spin i bounded recipe tekstualne korekcije za offline rezervu/stari online/cache. Kasniji Home/build-label/menu WIP nije tiho uključen; zajednički pin ostaje4a567c3. Online D1 sadržaj nije mijenjan.

Pravi Android AppID u finalnom manifestu: `ca-app-pub-8395430021391101~6926064985`; AD_ID i DELAY_APP_MEASUREMENT_INIT=true potvrđeni. Ads-live profil postavlja literal live, Android interstitial `ca-app-pub-8395430021391101/6024046858`, NPA ostaje. EAS potvrđuje env iz profila bez production overridea; finalni source/profile metadata i live release JS export su povezani. Finalni Hermes je parsiran i sadrži runtime/adapter/jedinicu/NPA, ali samo prisustvo live/test ID stringova nije dokaz aktivnog režima.

Bundletool validate, finalni manifest, jarsigner i fingerprint match PASS. Ugrađeni HTML je **byte-identičan testiranom previewu**,13,596,838bytes/SHA256 `b63cbe13ad09094fd0052d0f4dc1b41c5f97793d3ac079a06f1a205238a62cc5`. Na tačnom sourceu333/333testa u44fajla, root/client TypeScript, preview, live export i ENG/BHS spin + old-online→offline-cache browser regression PASS. Postojeće dependencies korištene kroz junction, nije novi hermetički npm ci.

Prije kreiranja potvrđen Play inventar5/5kodova10/9/7/6/5 i nema unpublished changes; EAS bez11/aktivnog Android builda. Korišten postojeći default signer uz --freeze-credentials, bez privatnog ključa/lozinke u predaji. Pokrenut jedan build. Free kvota prije8/30/Android3/15, poslije9/30/Android4/15, overage/cost/estimated0.

Ovo završava build-only nalog. Nema Play upload/submission/rollouta, iOS builda, mergea, deploya ili novog troška. Fizički Android consent/reject/reopen/no-fill/background/resume QA, AdMob readiness i prava na sadržaj ostaju zasebni release uslovi. Stvarne ad-unit postavke ne garantuju isporuku oglasa prije AdMob readiness provjere.
