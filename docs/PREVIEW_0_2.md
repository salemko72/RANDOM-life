# RANDOM demo 0.2

The user approved continuing the reference design with five EAT and five LEARN demos, restoring embedded photos, an independent Studio entry, and Expo Go preview at no additional service cost.

Browser files: `npm run build:preview` produces self-contained `RANDOM_INTERACTIVE_PREVIEW.html` and `RANDOM_CONTENT_STUDIO.html`, plus a static site (`index.html`, `studio.html`, JS/CSS, assets). Refreshing downloaded HTML does not fetch a new application version. Hosting the static folder at a stable URL allows ordinary refresh to load each new deployment. Deployment is not completed: this cloud session has no Cloudflare deployment identity and GitHub API requests are network-denied. No paid services were activated.

Missing photos were caused by replacing `assets/...` while retaining `./` before a Blob URL. The browser parsed `./blob:...` as a relative HTTP path. Tests now decode images, rather than merely checking for CSS background URLs. CSS now uses direct asset URLs so Expo Metro can also build the web target.

EAT: Mercimek soup, potato salad, Swedish meatballs, Menemen, Greek moussaka. LEARN: Sapiens, Doctor Faustus (Thomas Mann), Demons (Dostoevsky), Dvori od oraha (Jergović), Bašta, pepeo (Kiš). All are explicitly provisional demo material and original generated illustrations; BOOK photographs are not real covers. First category choices start with soup/Sapiens, subsequent choices sample remaining eligible records at random. Previously seen records are excluded; restrictions still apply after resetting history.

Studio uses manual JSON/image upload and local IndexedDB for this preview. Uploaded, approved records augment demo fixtures. Drafts do not appear in the public preview. Selection rereads the local catalog so same-origin Studio tabs can publish or withdraw without requiring a demo reload. Built-in photos resolve by image path, not editor-assigned record UUID. Separate offline HTML files may have independent local storage depending on browser; the hosted `studio.html` redirects to the main application's `#studio` and shares its origin. Data do not sync between phone and browser or between devices.

Expo owner `salemko` and project ID `04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a` are preserved. `App.tsx` is a temporary local WebView bridge embedding the browser demo, supported by the Expo-pinned react-native-webview version. It is not the final native UI. There is no EAS build/update/deployment or cloud Expo login here. Remote Expo project ownership and a physical-device session remain unverified.

On Windows, unpack the source ZIP and double-click `POKRENI_EXPO_GO.cmd`. The helper installs locked dependencies, builds the embedded preview, checks the user's local Expo login, starts Metro in LAN mode, and opens a QR page. Phone and PC must share Wi-Fi and the installed Expo Go must support the configured SDK. Leave the terminal running. A cloud-machine LAN address cannot be scanned from the user's home Wi-Fi.

Setup: root `npm ci --cache /workspace/.npm-cache` builds the embedded preview through postinstall. Root `npm run typecheck`, `npm test`, `npm run smoke:browser`, `npm run smoke:demo`. Export checks: `npm run build:client`; in apps/client `npx expo export --platform android --platform ios --output-dir dist-native`. No D1 remote changes or production auth are involved.
