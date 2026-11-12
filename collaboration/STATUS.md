# Trenutno stanje

**Ažurirano: 12.11.2026.** Prije rada fetch i provjeri stvarne headove/PR-ove. Vidi [kompletno uputstvo za AdMob i saradnju](../docs/ADMOB_AND_COLLABORATION_HANDOFF.md) i [Word kopiju](../docs/ADMOB_AND_COLLABORATION_HANDOFF.docx).

## Android Play nastavak nakon Salemovih buildova

[Najnoviji Android Play audit](../docs/ANDROID_PLAY_READINESS.md): lokalni APK0.23.0/code9 je hashiran, validanv2potpis i finalni manifest/SDKmetadata su pregledani. Korisnik potvrđuje normalan rad, pojavu oglasa i regionalnu poruku bez dodatnog privacy obrasca; kompletna fizička QA još nije provedena. Salemova zasebna grana dokumentuje završene APK/AAB/IPA buildove na `bfc71733de64d8f7f30fb3831b6b19af64bfc1a7`; to nadopunjuje raniji zapis ove grane bez native buildova.

Direktni Play pregled potvrđuje production access i bundle codes5/6/7; code9 nije u inventaru3/3. Publika16–17/18+ već je ispravna. Sačuvane su neposlane Ads=Yes i privacyURL=/privacy.html promjene, AdvertisingID=Yes te radni Data safety draft. Ništa nije poslano na review/rollout. AAB nije lokalno preuzet zbog nedostajućeg Expo pristupa kroz trenutni prikaz, a upload-key fingerprint match još nije potvrđen. Web privacy/app-ads/support deploy i prava na tekstove ostaju otvoreni. Prethodni odjeljci ispod čuvaju ranije stanje implementacije.

## ADS-001 nastavak 12.11.

Source i predaja su objavljeni u [draft PR #1 prema mainu](https://github.com/salemko72/RANDOM-life/pull/1). Status je in_review za source, s otvorenim release uslovima; nema mergea.

`ahmed-admob` je objavio claim i prenio samo WIP code commit na vlastitu `codex/ahmed-admob-finish` granu iz maina. Novi implementacijski source **`e1228ed725d63a56e280e00d3c840ab5890311b6`** uključuje zajednički Android/iOS runtime, iOS autolink/config, iPhone-only konfiguraciju, testne profile i staged app-ads/support/privacy ispravke. **328 testova/43 fajla PASS**, TypeScript, Expo compatibility, release exports i browser smoke PASS. Detalji i ograničenja su u [ADS-001 pregledu](../docs/ADS_001_REVIEW.md).

GitHub write/API pristup ove sesije je potvrđen; ranija API403 blokada ispod opisuje prethodni account/okruženje. Expo prijava nije dostupna, kvota/signing/remote brojevi nisu provjereni. Nema novih APK/AAB/IPA, fizičkog SDK QA, web deploya ili store submissiona. Publika 16+ i tačan publisher red potvrđeni su od Ahmeda. Javni /app-ads.txt i /support.html još vraćaju HTML fallback; pripremljeni source to popravlja tek nakon posebno odobrenog deploya s očuvanim downloads. ADS-001 nije završen; main je neizmijenjen. Preostali odjeljci bilježe osnovu i prethodnu predaju od 11.11.

## Zajednička osnova i predaja

| Grana/source | Namjena i stanje |
|---|---|
| **`main`** | Nova stabilna integracijska osnova koju je korisnik odobrio: generički artwork source i saradnički dokumenti. **Bez AdMob WIP-a.** Docs head nije zamrznuti release artefakt; fetch prije rada. |
| `codex/salem-collaboration-setup` | Dokumentacijska/koordinacijska grana. Claim `800c93f7e6aa33784ea50cc3b352fca7cf514925`, početni docs `d9c8073aab1b580a46417306fc3f0d4d54c9341d`, prošireni claim `557873d10c4c476b959ed7f7bdd0740569da15a3`. |
| **`codex/salem-admob-handoff`** | Predati Android-first WIP **`d4d0a6a150baa71591a2c427223aea69e8bcf17d`**. 300 testova/42 fajla i TypeScript prolaze. iOS runtime je no-op/autolink isključen; nema novog native artefakta potvrđenog na ovom SHA. |
| `codex/generic-artwork-v1` | Aplikacijska referenca **`d54e69f6a24a327b526f21936681818164c9d1e8`**; čist Git arhiv: preview build, 291 test/40 fajlova, root/client TypeScript prolaze. Dependencies ponovo korištene, nije hermetički npm ci. |
| `codex/ios-testflight` | Raniji source `7ddf52f3f35034123bad683ba8446eea72860fcb`; nema najnoviji artwork. Nije nova radna osnova. |
| `codex/r2-versioned-catalog` | `f7861c49185aa982b58e87186bc6905390f77e7d` u ancestryju aktuelnog sourcea; ne redeployati staru granu preko novije. |
| `codex/listen-playlists` | Arhiva `0a688c13083d468594fd6404bad9fb6537c38187`; ne vraćati LISTEN bez naloga. |

**Stare Android grane:** `android-play-test-ready` obrisan nakon arhiviranja; `android-expo-windows` čeka promjenu GitHub defaulta na main. Sačuvani tagovi: `archive/android-play-test-ready-2026-11-11` (`39167eb69c051d49a17c9a4991d274981f2ea99e`) i `archive/android-expo-windows-2026-11-11` (`a46c155a47c8bc6c1b526c447c6558914b438b2e`). Default i novi source su imali nepovezane historije; nisu spajane.

**PR blokada:** Git push/fetch radi; REST/GraphQL `api.github.com` vraća403. Stanje otvorenih PR-ova nije potvrđeno. Pokušaj dopune environment drafta nije sačuvan jer draft nije editabilan. Compare link nije PR: [početna docs provjera](https://github.com/salemko72/RANDOM-life/compare/codex/generic-artwork-v1...codex/salem-collaboration-setup?expand=1), [AdMob WIP prema mainu](https://github.com/salemko72/RANDOM-life/compare/main...codex/salem-admob-handoff?expand=1). Korisnik je naknadno odobrio kreiranje maina iz postojeće source osnove; nije izvršen PR merge niti deploy.

## Isporuka nije isto što i source

- Web/katalog, zadnja provjera11.11.: Pages `7f9ee8fc-8f34-4330-bc3b-46783ecc4bbe`; 467 javnih stavki, 273 generičke BOOK/WATCH slike, ostale194 neizmijenjene. Deployed dirty-tree provenance ograničenje je u [release handoffu](../docs/RELEASE_HANDOFF.md).
- iOS stvarni build0.23.0(2): source `1e6f8efc1d0e3ccfb0daf4df6e234f8761992683`, EAS `a73b11b1-93e0-4af5-b12c-70b77a6a185c`. Apple traži dodatne informacije/video; javna objava nije potvrđena. Nema oglasa ni novih offline slika.
- Stabilni source config je Android0.23.0/code8 i iOS build2; WIP code9 nije već napravljen ili objavljen build.
- AdMob ide u **naredne Android i iOS buildove**, iz zajedničkog zamrznutog sourcea, s odvojenim artefaktima/QA. Ovo nije odobrenje za automatsko slanje trgovinama.

## Sljedeće za Ahmeda i drugi Codex

1. Prihvatiti GitHub collaborator poziv i povezati svoj Codex account; pročitati AGENTS/STATUS/TASKS i kompletan vodič.
2. Objaviti claim **ADS-001** na svojoj `codex/ahmed-admob-finish` grani iz maina, provjeriti preklapanje, zatim prenijeti tačan WIP code commit ako već nije integrisan. Ne raditi na mainu ili starim Android granama.
3. Dovršiti iOS + Android SDK, consent/ATT, privatnost/app-ads.txt/store provjere, testne buildove i fizički QA. IOS-001, PREF-001 i RIGHTS-001 uskladiti s istim vlasnikom fajlova.
4. Pristup Cloudflare/Expo/Apple/AdMob je zaseban po accountu. Ne dijeliti tajne niti pretpostavljati credentials iz drugog chata. Nema dodatnih plaćenih usluga.
