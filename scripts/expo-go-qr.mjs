import { networkInterfaces } from 'node:os';
import { createServer } from 'node:http';
import QRCode from 'qrcode';

export function lanAddress() {
  const candidates = Object.entries(networkInterfaces()).flatMap(([name, entries]) =>
    (entries ?? []).filter(entry => entry.family === 'IPv4' && !entry.internal).map(entry => ({ name, address: entry.address }))
  );
  const usable = candidates.filter(entry => !/docker|vethernet|vmware|virtualbox|tailscale|vpn|wsl/i.test(entry.name));
  return (usable.find(entry => /wi-?fi|wireless|wlan/i.test(entry.name)) ?? usable[0] ?? candidates[0])?.address;
}

export async function showExpoGoQR(address, port) {
  const link = `exp://${address}:${port}`;
  const qr = await QRCode.toDataURL(link, { width: 320, margin: 2, errorCorrectionLevel: 'M' });
  const html = `<!doctype html><html lang="bs"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RANDOM — otvori na telefonu</title><style>body{margin:0;background:#f6f3fa;color:#252644;font:16px system-ui;text-align:center}main{max-width:500px;margin:48px auto;padding:24px}h1{letter-spacing:5px;font-size:25px}h2{font-size:24px}img{width:min(100%,320px);border-radius:20px}a{color:#7760d4}p{line-height:1.7}.note{font-size:13px;color:#74728a}ol{text-align:left;line-height:1.9;padding-left:25px}</style><main><h1>RANDOM</h1><h2>Skeniraj. Isprobaj. ✦</h2><img src="${qr}" alt="QR kod za RANDOM u Expo Go"><ol><li>Telefon i računar spoji na isti Wi-Fi.</li><li>Android: otvori Expo Go i skeniraj QR.<br>iPhone: skeniraj kamerom i otvori u Expo Go.</li><li>Isprobaj EAT ili BOOK i klikni SPIN.</li></ol><p><a href="${link}">Otvori RANDOM u Expo Go</a></p><p class="note">Ako Expo Go nije instaliran, instaliraj najnoviju verziju iz App Storea ili Google Playa. Ako Windows pita za mrežni pristup, dozvoli privatnu mrežu.</p><p class="note">Ostavi terminal otvoren. Demo ima dva primjera; nema baze ni AI API troškova. Prvo učitavanje može potrajati.</p><p class="note">Ako QR ne radi, provjeri Wi-Fi i VPN. Adresa: ${address}:${port}</p></main></html>`;
  const server = createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(html);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return { server, url: `http://127.0.0.1:${server.address().port}`, link };
}
