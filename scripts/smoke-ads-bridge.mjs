import {build} from 'esbuild';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';

const compiled = await build({stdin: {contents: "export {createProfile} from './apps/client/src/web/preferences';", resolveDir: process.cwd()}, bundle: true, platform: 'node', format: 'esm', write: false});
const {createProfile} = await import('data:text/javascript;base64,' + Buffer.from(compiled.outputFiles[0].contents).toString('base64'));
const html = await readFile('apps/client/preview-dist/RANDOM_INTERACTIVE_PREVIEW.html');
const server = createServer((req,res) => req.url.startsWith('/api/') ? res.writeHead(503).end() : res.writeHead(200, {'Content-Type': 'text/html'}).end(html));
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const browser = await chromium.launch({executablePath: process.env.LIFESPINNER_BROWSER_EXECUTABLE || '/usr/bin/chromium', args:['--no-sandbox']});
try {
  for (const native of [false,true]) {
    const page = await browser.newPage({viewport:{width:390,height:844}, reducedMotion:'reduce'});
    const profile = {...createProfile(), onboarded:true, name:'Private test name', allergens:['peanut']};
    await page.addInitScript(({profile,native}) => {
      localStorage.setItem('random-life.locale.v1','en');
      localStorage.setItem('random-life.local-profile.v1',JSON.stringify(profile));
      window.__lifespinnerAds = native;
      window.__messages = [];
      window.ReactNativeWebView = {postMessage: raw => {window.__messages.push(JSON.parse(raw));}};
      window.confirm = () => true;
    }, {profile,native});
    const ads = () => page.evaluate(() => window.__messages.filter(m => m.type === 'lifespinner.ads.v1'));
    await page.goto('http://127.0.0.1:'+server.address().port);
    await page.locator('.app-splash').waitFor({state:'detached'});
    await page.locator('.spin-hub').waitFor();
    if (native) assert.equal((await ads()).filter(m => m.event === 'ready').length,1);
    assert.equal((await ads()).filter(m => m.event === 'home' || m.event === 'spin').length,0);
    await page.locator('.rail-category').first().click();
    await page.locator('.result-item-title').waitFor();
    assert.equal((await ads()).filter(m => m.event === 'spin').length,native ? 1 : 0);
    assert.equal((await ads()).filter(m => m.event === 'home').length,0);
    await page.locator('.bottom-nav button').first().click();
    await page.locator('.home-scene.scene-visible').waitFor();
    assert.equal((await ads()).filter(m => m.event === 'home').length,native ? 1 : 0);
    await page.locator('.rail-category').first().click();
    await page.locator('.result-item-title').waitFor();
    await page.locator('.bottom-nav button').last().click();
    const privacy = page.getByRole('button',{name:'Ad privacy choices',exact:true});
    assert.equal(await privacy.count(),native ? 1 : 0);
    if (native) {await privacy.click(); assert.equal((await ads()).filter(m => m.event === 'privacy').length,1);}
    await page.getByRole('button',{name:'Delete profile & data',exact:true}).click();
    await page.locator('.onboarding-field input').first().waitFor();
    assert.equal((await ads()).filter(m => m.event === 'home').length,native ? 1 : 0,'Profile deletion is not an ad opportunity');
    const messages = await ads();
    assert(messages.every(m => Object.keys(m).sort().join(',') === 'event,seq,type'));
    assert(!JSON.stringify(messages).includes('Private test name'));
    assert(!JSON.stringify(messages).includes('peanut'));
    assert(messages.every((m,i) => i===0 || m.seq > messages[i-1].seq));
    console.log('PASS '+(native?'native capability: successful spin, natural break, privacy and bounded payloads':'web: no ads capability, messages or privacy control'));
    await page.close();
  }
} finally {await browser.close(); await new Promise(resolve => server.close(resolve));}
