import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lanAddress, showExpoGoQR } from './expo-go-qr.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(resolve(root, 'apps/client/package.json'));
const cli = resolve(dirname(require.resolve('expo/package.json')), 'bin/cli');
const noOpen = process.argv.includes('--no-open');
const expoGo = process.argv.includes('--go');
const address = expoGo ? lanAddress() : undefined;
if (expoGo && !address) throw new Error('Nema LAN mreze. Spoji racunar i telefon na isti Wi-Fi i pokusaj ponovo.');
let qrPage;

async function available(port) {
  return new Promise(resolve => {
    const probe = createServer();
    probe.once('error', () => resolve(false));
    probe.listen(port, 'localhost', () => probe.close(() => resolve(true)));
  });
}
let port = 8081;
while (port < 8091 && !(await available(port))) port++;
if (port === 8091) throw new Error('Preview portovi su zauzeti. Zatvori prethodni RANDOM preview i pokusaj ponovo.');
const url = `http://localhost:${port}`;
const child = spawn(process.execPath, [cli, 'start', ...(expoGo ? ['--go', '--lan'] : ['--web', '--localhost']), '--port', String(port), '--clear'], {
  cwd: resolve(root, 'apps/client'), stdio: 'inherit',
  env: { ...process.env, EXPO_NO_DOTENV: '1', EXPO_PUBLIC_API_URL: '', EXPO_NO_TELEMETRY: '1', EXPO_OFFLINE: '1', BROWSER: 'none', ...(address ? { REACT_NATIVE_PACKAGER_HOSTNAME: address } : {}) },
});
let stopped = false;
child.on('error', error => { console.error(error.message); stopped = true; process.exitCode = 1; });
child.on('exit', code => { stopped = true; qrPage?.server.close(); process.exitCode = code ?? 0; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { child.kill(signal); });

for (let attempt = 0; attempt < 180 && !stopped; attempt++) {
  try {
    const response = await fetch(expoGo ? `${url}/status` : url, { signal: AbortSignal.timeout(1000) });
    if (response.ok) {
      if (expoGo) qrPage = await showExpoGoQR(address, port);
      const browserUrl = qrPage?.url ?? url;
      console.log(`\nRANDOM ${expoGo ? 'Expo Go QR' : 'preview'} je spreman: ${browserUrl}\n${qrPage ? `Expo Go: ${qrPage.link}\n` : ''}Demo mod je aktivan; nema cloud ili AI API poziva.\n`);
      if (!noOpen) {
        const command = process.platform === 'win32'
          ? ['powershell.exe', ['-NoLogo', '-NoProfile', '-Command', `Start-Process '${browserUrl}'`]]
          : process.platform === 'darwin' ? ['open', [browserUrl]] : ['xdg-open', [browserUrl]];
        const opening = spawn(command[0], command[1], { stdio: 'ignore' });
        opening.on('error', () => console.log('Preglednik otvori rucno na gore navedenoj adresi.'));
      }
      break;
    }
  } catch { /* Metro starts asynchronously. */ }
  await new Promise(resolve => setTimeout(resolve, 500));
  if (attempt === 179) {
    console.error('Pokretanje traje predugo. Provjeri Expo poruku iznad.');
    child.kill(); process.exitCode = 1;
  }
}
