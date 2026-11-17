import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = 'apps/client/preview-site/';
assert.equal((await readFile(root+'app-ads.txt','utf8')).trim(),'google.com, pub-8395430021391101, DIRECT, f08c47fec0942fa0');
assert.match(await readFile(root+'_headers','utf8'),/\/app-ads\.txt\r?\n  Content-Type: text\/plain; charset=utf-8/);
assert(!(JSON.parse(await readFile(root+'_routes.json','utf8')).include.includes('/*')));
for(const page of ['support.html','privacy.html']) assert((await readFile(root+page,'utf8')).includes('cerimovic.ahmed@gmail.com'));
console.log('PASS staged publisher statement, text/plain header, static routing and support/privacy contact');
for(const platform of ['android','ios']) {
  const dir = `.native-check/export-test-js/_expo/static/js/${platform}/`;
  const filename = (await readdir(dir)).find(name => name.endsWith('.js'));
  const text = await readFile(dir+filename,'utf8');
  assert(/mode:["']test["']/.test(text), platform+' test mode must be substituted in release JS');
  assert(!text.includes('process.env.EXPO_PUBLIC_LIFESPINNER_ADS_MODE'));
  assert(text.includes('requestNonPersonalizedAdsOnly'));
  console.log('PASS '+platform+' minified release JS: literal test mode, NPA request path');
}
const webDir = '.native-check/export-test-js/_expo/static/js/web/';
const web = await readFile(webDir+(await readdir(webDir)).find(name=>name.endsWith('.js')),'utf8');
assert(!web.includes('RNGoogleMobileAdsModule'));
console.log('PASS web release JS does not include native Google Mobile Ads module');
