# AdMob Release Check Implementation Plan

**Goal:** Završiti dostupne provjere i testne native buildove te ostaviti dokaziv nastavak.
**Architecture:** Ahmedov PR source se ne mijenja; Salem piše odvojene release dokumente. Buildovi koriste isti čist commit u izdvojenom checkoutu.
**Tech Stack:** Expo/EAS, React Native, Google Mobile Ads/UMP, Git.
**Spec:** korisnikov nalog 12.11.2026. i `docs/ADS_001_REVIEW.md`.

## Global Constraints
- 0 dodatnih troškova; postojeći projekt/signing, testni oglasi.
- Bez mergea, produkcijskog deploya, DB izmjena, auto-submit ili store uploada.
- Bez uređivanja Ahmedovog aplikacijskog/file scopea.
- Bez tajni ili potpisanih URL-ova u predaji.

## Review Focus
- Lokalni export nije Xcode/Gradle build; evidentirati odvojeno.
- NPA ne dokazuje odsustvo trackinga; ATT zaključak čeka stvarni SDK/poruke.
- HTTP200 nije dokaz app-ads/support sadržaja; provjeriti tijelo i tip.
- EAS historija nije Play/ASC inventar brojeva.
- Browser smoke nije fizički QA.

## Koraci
- [x] Objaviti claim i ponovo provjeriti remote head.
- [x] Provjeriti kvotu, credentials metadata i EAS historiju; pinovati čist SHA.
- [x] Pokrenuti testne APK/AAB/iOS build-only pokušaje i pratiti ishod; bez slijepih retry petlji.
- [x] Provjeriti lokalni preview, native config i browser tokove; pregledati dostupne native build dokaze.
- [x] Napisati release nalaz, Apple odgovor i precizne zadatke za Ahmedov Codex.
- [x] Provjeriti dokumente, commit/push i pokušati PR; jasno navesti eventualni API403.

Izvršeno bez aplikacijskih izmjena.3 EAS builda FINISHED; lokalni download/package audit i otvaranje PR-a imaju konkretne mrežne blokade, opisane u ADS_002_RELEASE_CHECK. Nema deploya ili store submissiona.
