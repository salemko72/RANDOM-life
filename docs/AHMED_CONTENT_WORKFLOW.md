# RANDOM life — uputstvo za Ahmeda i njegov Codex

**Aktuelni ugovor: v2, 17. 10. 2026. — za oba ChatGPT/Codex toka.**
Prije novog batcha provjeri https://random-life-preview.pages.dev/api/content-contract
i preuzmi novi paket ako je tvoj stariji. Novo opciono polje `accessLinks` čuva
servise, knjižare i biblioteke odvojeno od izvora opisa/postera.
Detalji: https://random-life-preview.pages.dev/downloads/RANDOM-content-format-v2.md
U oba ChatGPT projekta postavi `CHATGPT-INSTRUCTIONS.txt` iz paketa i koristi
prompt iz aktuelnog Studija. Stari razgovori ne dobijaju nova pravila automatski.
Stari ZIP-ovi nastavljaju raditi.

Radimo u jednoj zajedničkoj Cloudflare D1 bazi `random-test-content`.
Studio: https://random-life-preview.pages.dev/#studio
Nove stavke nikada ne snimaj u browser IndexedDB ili lokalnu bazu kao konačno odredište.

## Najlakše, bez instalacije
Salem ti privatno daje uredničku lozinku. Otvori Studio i prijavi se.
Unesi URL ili ideju → kopiraj prompt → ChatGPT napravi ZIP → uvezi ZIP.
Snimi stavku. Nepotvrđene stavke ostaju na pregledu u zajedničkom D1;
Salem ih vidi sa svog uređaja i odobrava. Plavi LOCAL unosi su samo stare kopije.
Ne treba ti Cloudflare API ključ, TMDB ključ ni OpenAI API ključ za ovaj postupak.
Trenutna urednička lozinka daje puni urednički pristup, uključujući izmjene i brisanje;
nije zaseban ograničeni Ahmedov nalog. Dijeli je samo s pouzdanim urednikom.

## Automatizovano snimanje ZIP-ova iz Codexa
Preuzmi https://random-life-preview.pages.dev/downloads/RANDOM-Ahmed-content-kit.zip
Raspakuj u svoju radnu mapu. Potreban je Node.js 22+.
Pokreni `npm install` u toj mapi (na Windows PowerShellu `npm.cmd install`).
Pokreni `node ahmed-content-import.mjs --check`; očekivano `contractVersion:2`.
Pri ažuriranju zamijeni skriptu i `random-content-contract.mjs` zajedno i sačuvaj
svoje ZIP-ove. Skripta prije novog batcha provjerava verziju servera.
Postavi RANDOM_STUDIO_PASSWORD u privatno procesno okruženje. Ne upisuj vrijednost u
chat, ZIP, Git, skriptu ili komandnu liniju. U Codex cloud okruženju koristi sigurnu
konfiguraciju kredencijala za random-life-preview.pages.dev; provjeri da runtime
može koristiti tu vrijednost u prijavi. Nemoj zamijeniti Cloudflare token lozinkom.

Na lokalnom Windows računaru možeš unijeti lozinku skriveno:

```powershell
$randomPassword = Read-Host 'Studio password' -AsSecureString
$randomPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($randomPassword)
try { $env:RANDOM_STUDIO_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($randomPtr) }
finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($randomPtr) }
node .\ahmed-content-import.mjs .\RANDOM-item.zip
Remove-Item Env:RANDOM_STUDIO_PASSWORD
```

Više ZIP-ova u jednom prolazu: `node ahmed-content-import.mjs first.zip second.zip`.
Skripta provjerava isti ugovor kao Studio, radi strukturne popravke, optimizuje
sliku u WebP (max 1440 px, bez povećanja, kvalitet 84%, do 1 MB), prijavljuje se,
uploaduje sliku u D1 i šalje sadržaj na pregled. Ne briše niti automatski ažurira
postojeće stavke. Duplikat se prijavljuje, ne prepisuje. Greška ostavlja originalni
ZIP sačuvan; svaki rezultat ispisuje ID/status. Ponovi nakon ispravke greške.
Ako slika nedostaje za knjigu/film, ostaje za dopunu u Studiju (Find cover/poster).
Ova skripta još ne preuzima naslovnice sama. Ne izmišljaj ljudska odobrenja.

## Tekst koji predaješ Ahmedovom Codexu

> Radi kao saradnik na RANDOM life sadržaju. Koristi priloženi content kit i isti
> generator prompta/validator kao Studio. Za svaki URL ili ideju odaberi konačnu
> kategoriju EAT, BOOK (u UI READ), WATCH, MOVE ili GO. Generiši kompletan ENG i
> BHS sadržaj u `content.json`, sa kratkim oznakama i provjerljivim činjenicama.
> Ne izmišljaj bibliografske prevode naslova, alergene ili medicinska odobrenja.
> Low-phosphate procjena je sugestija za ljudski pregled, ne potvrda sigurnosti.
> EAT/MOVE/GO trebaju originalnu ilustraciju; WATCH/BOOK koristi naslovnicu iz
> Studija ako nije dostupna u ZIP-u. ZIP ime neka sadrži naziv stavke, svi fajlovi
> u korijenu ZIP-a. Ne postavljaj factsVerified, rightsConfirmed, reviewed ili
> allergensVerified na true. Pokreni skriptu za unos ZIP-a u postojeći D1, bez
> Cloudflare infrastrukturnih izmjena i bez lokalnog fallbacka. Vrati listu ID-jeva,
> statusa, duplikata i stvarnih grešaka. Salem odobrava u browseru.

Generator za tačan ugovor i ograničenja:
`node ahmed-content-import.mjs --prompt BOOK "Atomic Habits by James Clear"`
Piše RANDOM-prompt.txt koji se predaje ChatGPT-u/Codexu. Source može biti URL ili ideja.

Skripta automatizuje unos već pripremljenih ZIP-ova. Ne pokreće OpenAI API ni AI
image generator; mogućnost generisanja slika zavisi od alata dostupnih Ahmedu.
ChatGPT/Codex pretplata nije API ključ. Ne treba kupovati API pristup za ovaj test.
