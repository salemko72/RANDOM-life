# Pregled prijevoda — 18.11.2026.

Task I18N-PREVIEW-003, grana codex/salem-language-preview, baseaa0f1d3, aplikacijski UI source2c0ce132f6dcfca7967143f880e0a949e40dae59.

Korisnik traži gdje može vidjeti nove prijevode. Napraviti pregledni samostalni HTML/ZIP na GitHub grani, bez produkcijskog deploya ili proširenja produkcijske ready liste. Build-only transform izlaže6jezika samo u artefaktu. Remote transporti/Studio/share su blokirani u previewu; katalog ostaje postojeća rezerva s English fallbackom za4nova jezika. Nema korisničkih podataka ili tajni u datoteci.

## Rezultat

- Review builder/source96983f36f4387034e7907a41266f19400fc072fb; UI app source2c0ce132f6dcfca7967143f880e0a949e40dae59.
- Preview-only build transform izlaže en/bs/es/pt-BR/de/it i kratke kodove. Standardni ui-language.tsx/native generated/preview-dist nisu izmijenjeni. Jedan samostalan HTML sa svim lokalnim fontovima/slikama; nema serverske publikacije.
- Review je našao dijeljeni IndexedDB/sessionStorage rizik: reprodukovano cache clear brisanjem production sentinel snapshot-a u starom artefaktu (RED), zatim memory-only katalog i namespace za oba Storage interfejsa. GREEN sva4jezika, snapshot/localStorage/sessionStorage sentinel ostaju nakon clear-a. API fetch je503bez zahtjeva; CSP blokira remote connection/frame resurse, Studio import stub/hash i app/item share su onemogućeni. Screenshot putanja sada prati testirani artefakt.
- Početni RED: produkcijski HTML nema ESP dugme; novi bundle ga ima. Finalni smoke4/4PASS: setup, dietary labels, save/menu/clear, izolacija stanja, Studio unavailable, bez pageerrors. Full suite358/50PASS; skripte node --check i git diff --check PASS. Stvarni Mac file-open nije provjeren: cloud Chromium policy blokira file://, pa su isti finalni HTML bytes testirani preko127.0.0.1. Ne tvrditi fizički/file://QA.
- ZIP review-previews/LifeSpinner-Languages-Preview.zip:9382104bytes, SHA25636234301856a14cdfbd88cc5e2a4c1c1fcc40fd00a30b7b0a3e583cd6bd8b289. testzip PASS i HTML bytes identični finalnom testiranom artefaktu. Uključuje START-HERE i German screenshot, bez korisničkih podataka/tajni.
- [Preuzimanje/upute](../../review-previews/README.md). Novi jezici nisu produkcijski aktivirani; katalog za njih fallbackEnglish, UMP/store/native/vanjske stranice nisu završene. Nema produkcijskog deploya, backend upisa, native/EAS builda, store slanja ili troška.
- PR API ranije403; [compare prema UI grani](https://github.com/salemko72/RANDOM-life/compare/codex/salem-ui-translations...codex/salem-language-preview?expand=1). Compare nije otvoren PR. GitHub artefakt nije javni web deploy.
