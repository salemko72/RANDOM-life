# Postojeći Expo projekt

Korisnik je dostavio Project ID `04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a` uz Expo račun `salemko`.

`apps/client/app.json` sada sadrži `owner: salemko` i `extra.eas.projectId` s tim ID-jem. Expo config resolver je provjeren. Nije kreirana druga aplikacija, nije aktiviran build, update ili plaćeni plan.

Udaljena autentifikacija i stvarni project slug nisu potvrđeni u ovoj cloud sesiji. Lokalni slug je ostao `random-life`. Ako EAS prijavi razliku sluga, provjeri stvarni naziv postojećeg projekta pod dostavljenim ID-jem prije usklađivanja. Ne kreiraj drugi EAS projekt da zaobiđeš razliku.

Za potvrdu kroz prijavljeni lokalni CLI, iz `apps/client` koristi `npx.cmd --yes eas-cli@latest project:info`. Za eventualnu inicijalizaciju istog projekta koristi `npx.cmd --yes eas-cli@latest init --id 04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a`. Ovo nisu naredbe za build/deploy. Nema potrebe za `create-expo-app random` jer kod već postoji.

Demo pokretanje: `POKRENI_EXPO_GO.cmd`, zatim skeniranje QR koda na istoj Wi-Fi mreži. Fizički Expo Go test nije izvršen u cloud sesiji.
