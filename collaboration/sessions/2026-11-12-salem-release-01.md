# 2026-11-12 — salem-release — sesija01

- **Task / grana:** RELEASE-002, `codex/salem-ads-release-check`; stacked documentation PR prema `codex/ahmed-admob-finish` nije otvoren zbog api.github.com403.
- **Base PR #1 SHA:** `5a603da71b1716143887fcdb3a8dec3614a1a016`.
- **Objavljeni claim i zajednički build source SHA:** `bfc71733de64d8f7f30fb3831b6b19af64bfc1a7`. Čist izdvojeni checkout; nema aplikacijskog diffa prema PR sourceu.
- **Opseg/vlasništvo:** vlastite release upute, Apple Notes nacrt, plan, vlastita sesija i dodatak TASKS; Ahmedovi App/config/SDK/web fajlovi nisu mijenjani. Tuđe lokalne untracked datoteke sačuvane.
- **Rezultati:** npm ci --ignore-scripts + preview build,328/43 testova, root/client TypeScript, Android/iOS prebuild i config/autolink, release JS test-mode/NPA/web checks te3 browser smoke provjere. Tačne granice u ADS_002_RELEASE_CHECK. Browser nije fizički native QA.
- **EAS:** APK `77706c67-6214-45f7-abd9-120d8603036b`, AAB `665b90e5-16f0-44aa-8115-823e57403b4f`, iOS `734be437-bd03-4453-a125-3d019062c03c`: svi FINISHED, source bfc71733de64d8f7f30fb3831b6b19af64bfc1a7, version0.23.0, Android9/iOS3. Android Gradle SUCCESSFUL; iOS GMA13.10.0/UMP3.1.0 + Archive Succeeded.
- **Trošak:** prije ukupno2/30, poslije5/30; Android2/15, iOS3/15, dodatni trošak0. Nema novih signing ključeva/certifikata.
- **ATT:** službeni GMA13.10.0 manifest navodi DeviceID tracking=true. To nije konačan dokaz runtime trackinga; bez stvarne UMP/SDK/network provjere nema live ATT odobrenja. Ugrađeni finalni manifesti nisu pregledani.
- **Web:** nije deployano. Read-only backup56 poznatih downloads (37.684.247 bytes), svi hashovi isti kao raniji inventar; binding imena i config hash očuvani, bez raw tajni. Novododane nepoznate putanje treba uskladiti prije bilo kojeg deploya.
- **Blokade:** artifact redirect wf-artifacts.eascdn.net403, pa nema lokalnog APK/AAB/IPA, checksuma ni package audita. GitHub PR API403. Mrežni draft update nije sačuvan: draft_not_editable. Prijedlog hostova sačuvan lokalno u /workspace/shared/ads-release-check-2026-11-12/NETWORK_ACCESS_REQUEST.md.
- **Nastavak:** docs/AHMED_CODEX_NEXT_STEPS.md; preuzeti postojeće buildove bez duplikata, uporediti potpise/brojeve u konzolama, finalni manifest/ATT i fizički QA, store izjave, prava na sadržaj i Apple fizički video. Notes nacrt ima eksplicitne nepopunjene stavke.
- **Ovlaštenje:** završiti dostupne provjere i testne buildove bez dodatnog troška; nema mergea, force pusha, produkcijskog deploya/DB izmjene, live oglasa, auto-submit ili store uploada.
