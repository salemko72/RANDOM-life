# Postojeći Expo projekt

Korisnik je dostavio Project ID `04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a` uz Expo račun `salemko`.

`apps/client/app.json` sada sadrži `owner: salemko` i `extra.eas.projectId` s tim ID-jem. Expo config resolver je provjeren. Nije kreirana druga aplikacija, nije aktiviran build, update ili plaćeni plan.

Udaljena autentifikacija i stvarni project slug nisu potvrđeni u ovoj cloud sesiji. Lokalni slug je ostao `random-life`. Ako EAS prijavi razliku sluga, provjeri stvarni naziv postojećeg projekta pod dostavljenim ID-jem prije usklađivanja. Ne kreiraj drugi EAS projekt da zaobiđeš razliku.

Za potvrdu kroz prijavljeni lokalni CLI, iz `apps/client` koristi `npx.cmd --yes eas-cli@latest project:info`. Za eventualnu inicijalizaciju istog projekta koristi `npx.cmd --yes eas-cli@latest init --id 04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a`. Ovo nisu naredbe za build/deploy. Nema potrebe za `create-expo-app random` jer kod već postoji.

Demo pokretanje: `POKRENI_EXPO_GO.cmd`, zatim skeniranje QR koda na istoj Wi-Fi mreži. Fizički Expo Go test nije izvršen u cloud sesiji.

## Ispravka Expo Go launchera

Korisnik je prijavio nedostupnu root ikonu i `Offline and no cached development certificate found`. Potvrđeno je da je launcher prisilno postavljao EXPO_OFFLINE=1; za povezani projekt to blokira dohvat razvojnog certifikata. Expo Go sada koristi online režim i provjeru lokalne CLI prijave; browser demo ostaje offline. Potpisivanje nije isključeno niti zamijenjeno lažnim certifikatom.

Root `apps/client/icon.png` je isti trusted template asset kao original u assets; app.json sada eksplicitno koristi tu putanju. Stvarni `/assets/icon.png` zahtjev je prije vraćao 404, a nakon ispravke vraća 200 s identičnim PNG sadržajem. Signing certifikat se može potvrditi tek na prijavljenoj korisnikovoj lokalnoj mašini; cloud sesija nema njegovu Expo autentifikaciju.

Za stari raspakovani paket: stavi `ISPRAVI_EXPO_GO.cmd` u postojeći RANDOM-life folder, zatvori prethodni Expo terminal i pokreni ga dvoklikom. Script pravi backup izmijenjenih konfiguracijskih fajlova, ciljano mijenja poznatu offline postavku, dodaje nedostajuću ikonu, čuva owner/project ID i traži Expo prijavu samo kroz lokalni CLI. Ne mijenja .env ili druge korisničke podatke.
