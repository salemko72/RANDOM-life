# Razvoj i ručni Content Studio

## Struktura

| Lokacija | Namjena |
|---|---|
| apps/client | Expo SDK 57, React Native 0.86.3, React 19.2.3, Expo Go i web |
| apps/studio | Privatni lokalni web editor; ručni ChatGPT JSON/slike workflow |
| packages/shared | Content ugovor, publication validacija, prompt i safe selection |
| services/api | Workers API, CONTENT_DB binding, migracije i static media |
| tests | Domain pravila i HTTP tokovi protiv stvarnog lokalnog D1 runtimea |

Razvojni `ContentInput` je katalog. Rezultat preporuke ima poseban recommendationId i referencu na objavljenu stavku. Nema generičkog univerzalnog modela odluke; ovaj adapter ne zaključuje sve buduće product odluke.

## Windows PowerShell

Koristi postojeći lokalni checkout RANDOM-life. Ako još ne postoji, kloniraj postojeći repozitorij, ne kreiraj novi na GitHubu. Kod ove cloud sesije mora prethodno biti prenesen u lokalni checkout; ne pretpostavljaj da su nepushovane cloud izmjene već na GitHubu.

```powershell
npm.cmd ci
npm.cmd run setup:local
npm.cmd run db:local
```

`setup:local` generiše lokalni secret jednom (postojeći fajl se ne prepisuje). Alternativna ista naredba iz korijena:

```powershell
node -e "const f=require('fs');const p='services/api/.dev.vars';if(!f.existsSync(p))f.writeFileSync(p,'ADMIN_TOKEN='+require('crypto').randomBytes(32).toString('hex')+'\n',{mode:384})"
```

Otvori taj lokalni fajl svojim editorom i unesi vrijednost u password polje Studija. Token ostaje lokalni i nije Cloudflare/OpenAI API ključ. Po zatvaranju taba ponovo ga unesi. Za servere koristi zasebne terminale:

```powershell
npm.cmd run dev:api
npm.cmd run dev:studio
npm.cmd run dev:client
```

Studio: lokalni browser port 5173. API: port 8787. Klijent: Expo port 8081. Ne dijeli javni URL Studija; trenutni auth je razvojni adapter.

## Ručni ChatGPT → objava

1. Poveži Studio s lokalnim API-jem i lokalnim admin tokenom.
2. Izaberi EAT ili BOOK i unesi izvor/tekst ili naslov+autor i bibliografski izvor. Klikni kopiranje prompta.
3. Ručno koristi svoju postojeću ChatGPT pretplatu. Kopiraj rezultat kao JSON bez markdowna; sliku preuzmi zasebno. Ne postoji API integracija ni automatizacija web interfejsa.
4. Zalijepi JSON u Studio. Provjeri stvarni URL izvora, datum, prava, sastojke/alergene ili bibliografske činjenice. Nepoznato ne pretvaraj u provjereno.
5. Dodaj sliku: browser lokalno pravi WebP do 1440px, čuva original za zasebno preuzimanje. AVIF pipeline i fokusni crop još nisu dio ove verzije. Kopiju originala sačuvaj van javnih asseta i Gita.
6. Preuzmi optimiziranu sliku u `services/api/public/media` pod tačnim imenom koje Studio upiše u JSON. Wrangler lokalno osvježava assets; ako ne vidi novi asset, restartuj API. Browser upload sam ne upisuje server filesystem.
7. Sačuvaj nacrt, označi ljudske provjere, sačuvaj izmjene, pošalji na pregled i odobri/objavi. API provjerava JSON, potrebne potvrde i dostupnost static asseta.
8. Svaka izmjena objavljenog sadržaja vraća ga u draft i briše approval. Povlačenje ga uklanja iz javnog kataloga. Revizije i publication događaji se čuvaju u lokalnom D1.

Demo nacrti moraju se ručno pregledati; placeholder izvor nije provjera stvarnog recepta. Ne ubrajaj ih u urednički tester cilj. Brojači su pomoć, ne zamjena za uredničku kontrolu kvaliteta.

## Expo Go na telefonu ($0 dodatnih troškova)

Potrebna je trenutno podržana Expo Go verzija za SDK 57. `expo install --check` uspoređuje zavisnosti s SDK-om; fizički telefon mora zasebno potvrditi runtime. Nema EAS builda niti simulator usluge.

1. Instaliraj Expo Go na Android/iPhone. Ako Expo Go traži prijavu, koristi isti Expo račun kao lokalni Expo CLI, prema aktuelnim Expo uputama.
2. Telefon i računar neka budu na istoj pouzdanoj Wi-Fi mreži. `npm run dev:client` daje LAN QR. Za browser pritisni `w`; browser preview nije native emulator.
3. Bez API varijable radi offline demo. Za sadržaj iz lokalne baze kreiraj `apps/client/.env` s `EXPO_PUBLIC_API_URL=http://<LAN-IP-RAČUNARA>:8787`.
4. API treba slušati LAN: iz `services/api` pokreni `npx.cmd wrangler dev --ip 0.0.0.0`. Lokalni admin u browseru i dalje koristi 127.0.0.1. Firewall pristup dozvoli samo pouzdanoj privatnoj mreži; ne izlaži dev server internetu.
5. Ako klijent web preview otvaraš preko LAN adrese, dodaj tačan web origin (npr. http://192.168.x.x:8081) u ALLOWED_ORIGINS lokalne konfiguracije. Native zahtjevi obično nemaju Origin. Nikada ne stavljaj serverski secret u EXPO_PUBLIC_*.
6. Restartuj Expo poslije promjene .env, po potrebi uz `npm run start -w @random/client -- --clear`. Za novi web export poslije promjene URL-a koristi `npm run build:web -w @random/client -- --clear`, jer Metro može zadržati stari inlined URL. Skeniraj QR u Expo Go / iPhone kameri. Provjeri EAT/BOOK, SPIN, details, Spin Again, no-match i network failure.

Tunnel nije automatski konfiguriran: ne može se pretpostaviti da Expo tunnel izlaže i lokalni API. U ovoj cloud sesiji nisu testirani fizički Android ili iPhone; native bundle provjera nije zamjena za to.

## Cloud host s read-only home direktorijem

Standardni lokalni računari ne trebaju ove varijable. Za ovu cloud mašinu testirani su shell-only overrides; ne zapisuj ih u product .env:

```sh
XDG_CONFIG_HOME=/workspace/.config WRANGLER_LOG_PATH=/workspace/.wrangler-logs npm run db:local
CI=1 EXPO_NO_TELEMETRY=1 __UNSAFE_EXPO_HOME_DIRECTORY=/workspace/.expo-cli npm run build:client
CI=1 EXPO_NO_TELEMETRY=1 EXPO_OFFLINE=1 __UNSAFE_EXPO_HOME_DIRECTORY=/workspace/.expo-cli npm run check:expo
```

Expo override koristi prazan lokalni config direktorij radi read-only home ograničenja; ne prenosi autentifikaciju. Offline dependency check daje slabiju potvrdu od aktuelnog Expo server checka. Ne mijenjaj HOME/CODEX_HOME i ne isključuj TLS/provjere integriteta.

## Udaljena D1 i troškovi

Konfiguracija cilja `random-test-content`, ID `d47c89e2-e2ab-42fd-be29-dce5ba809b6d`, binding CONTENT_DB. Cloud sesija nije imala Cloudflare MCP niti credential binding. Zato su ovdje izvršene samo lokalne migracije i provjere.

Prije remote migracije/deploymenta lokalni agent mora pročitati postojeću bazu, potvrditi plan/kvote i auth rješenje, pregledati SQL i imati izričitu autorizaciju za te vanjske promjene. Ako besplatni plan/kvote nisu potvrđeni, ostani lokalno. Ne dodaj --remote niti pokreći deploy zato što build prolazi. Ne aktiviraj R2, Queues, plaćeni plan ili OpenAI API.

CI workflow je ručno pokretanje, ne automatsko trošenje GitHub Actions kvota pri pushu. Provjeri vlastite uključene kvote prije korištenja. Lokalne provjere ne zahtijevaju taj servis.
