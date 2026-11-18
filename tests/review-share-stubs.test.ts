import{expect,test}from'vitest';import{build}from'esbuild';import{createRequire}from'node:module';
const{reviewShareStubs}=createRequire(import.meta.url)('../scripts/lib/review-share-stubs.mjs');
test('all three review share entry points cancel without browser/native/clipboard access',async()=>{
 const built=await build({stdin:{contents:"export{shareListen}from'./apps/client/src/web/listen-share';export{shareApp}from'./apps/client/src/web/app-share';export{shareItem}from'./apps/client/src/web/item-share';",resolveDir:process.cwd()},plugins:[reviewShareStubs],bundle:true,platform:'node',format:'esm',write:false});
 const module=await import('data:text/javascript;base64,'+Buffer.from(built.outputFiles[0].contents).toString('base64'));
 await expect(module.shareListen('Test','0123456789012345678901')).resolves.toBe('cancelled');await expect(module.shareApp('de')).resolves.toBe('cancelled');await expect(module.shareItem('Title','https://random-life-preview.pages.dev/item/test?lang=de')).resolves.toBe('cancelled');
});
