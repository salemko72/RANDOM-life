# RECIPE-TEXT-001 — paket novih tekstova

Status: **draft_not_applied**. Paket sadrži 17 postojećih low-phosphate recepata, s novim sažecima i uputama na ENG/BHS. Produkcijska baza nije promijenjena.

- [Čitljivi pregled](PREVIEW.md)
- [Precizni before/after patch](text-patch.json)

## Upute Ahmedovom Codexu / Studio operatoru

1. Preuzmi granu `codex/salem-recipe-wording`; prije rada pročitaj AGENTS, STATUS i TASKS. Ovaj paket je zaseban od zamrznutog aplikacijskog sourcea i ne zahtijeva native build.
2. Za svaki ID dohvati trenutni zapis u postojećem ovlaštenom Studio workflowu. Provjeri `expectedVersion` i `expectedRecordSha256` prije pripreme izmjene. Hash je SHA256 UTF-8 JSON-a s abecedno sortiranim ključevima, bez dodatnih razmaka i s Unicode znakovima bez ASCII escapinga. Izvor za hash je javni zapis; dodatne privatne Studio metapodatke ne uključivati u poređenje. Ako bilo koji zapis više ne odgovara snimku, zaustavi taj zapis i pripremi novi diff; ne prepisuj novije izmjene.
3. Prenesi isključivo šest navedenih tekstualnih putanja iz `after`: root summary/steps i translations.en/bs summary/steps. Ovo nije gotov Studio import format i ne treba ga slati kao puni zapis API-ju. Ne mijenjaj naslov, sastojke, količine, jedinice, porcije, alergene, nutritivne procjene, izvore, slike ili filtere. Root je BHS i mora odgovarati translations.bs.
4. Prije spremanja uporedi sva ostala polja s trenutnim zapisom; moraju biti identična. Sačuvaj normalnu historiju revizija i provjeru verzije. Ne koristi direktni SQL ili zaobilaženje Studio autentikacije. Ne dijeli lozinke ili tokene.
5. Pregledaj obje jezičke verzije u aplikaciji. Novi tekst zahtijeva urednički pregled; postojeći reviewed flag nije dokaz pregleda novog teksta. Ne pretvaraj stare flags u novo odobrenje. Objava ide tek kroz postojeći ovlašteni review/publish postupak i konkretno odobrenje.
6. U vlastitu sesiju upiši tačan commit paketa, obrađene ID-eve, nove verzije, izvršene provjere i da li je samo pripremljeno, spremljeno ili objavljeno. Ponovo provjeri snapshot/filtere nakon eventualne odobrene objave.

## Provjera i granice

17/17 spojenih zapisa prolazi postojeći contentSchema. Provjereni su ID-evi, verzije, hash snimka, ENG/BHS tekst i identičnost svih ostalih polja. Radnje, vremena, temperature i porcije ručno su upoređeni s postojećim uputama. Nema promjene medicinske procjene ili nove nutritivne validacije. Postojeća pogrešna BHS napomena o hljebu u procjeni smrznutog jogurta ostaje zasebna urednička korekcija; ovaj patch je ne mijenja.

Paket preformuliše funkcionalne opise i upute. Ne zatvara RIGHTS-001 niti potvrđuje licence za izvore, podatke ili raniji sadržaj. Nema deploya, builda, slanja trgovini ili troška.
