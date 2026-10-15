# RANDOM life — Android APK build package

Windows: download this branch as ZIP, extract the whole folder and double-click **POKRENI-APK.cmd**.
Requires Node.js 24 LTS (https://nodejs.org/). See PROCITAJ.txt.

Source code and checksummed image packs are included. No Expo token or Cloudflare credentials are included.
The launcher extracts the bundled image packs, installs dependencies, builds the current UI and starts an internal Expo EAS APK build for salemko/random.
Sign in locally when prompted. Use the free build allowance; cancel if Expo asks for payment.

Validation: clean npm ci and Android Expo export succeeded on Linux; Windows launcher itself needs a first Windows run.
The APK will be produced by Expo after the launcher runs; this ZIP is the build package, not a finished APK.
