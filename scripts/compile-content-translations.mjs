import{build}from'esbuild';import{createHash}from'node:crypto';import{readFile,writeFile}from'node:fs/promises';import{execFileSync}from'node:child_process';
const root='content/i18n-2026-11-18',pilot=process.argv.includes('--pilot');
execFileSync(process.execPath,['scripts/validate-content-memory.mjs',...(pilot?['--partial']:[])],{stdio:'inherit'});
const manifest=JSON.parse(await readFile(root+'/source-manifest.json','utf8')),source=JSON.parse(await readFile(root+'/source-catalog.json','utf8'));
const result=await build({stdin:{contents:"export{contentDraftFingerprint,draftTranslationMatches,createContentDraftTranslator,contentDraftLocales}from'./packages/shared/src/content-draft-translations';export{withGenericArtwork}from'./packages/shared/src/generic-artwork';export{applyRecipeWording}from'./apps/client/src/web/recipe-wording';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const{contentDraftFingerprint,draftTranslationMatches,createContentDraftTranslator,contentDraftLocales,withGenericArtwork,applyRecipeWording}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].contents).toString('base64'));
const memories=Object.fromEntries(await Promise.all(contentDraftLocales.map(async locale=>[locale,JSON.parse(await readFile(root+'/memory/'+locale+'.json','utf8'))])));
const translate=(value,locale)=>{const key=createHash('sha256').update(value).digest('hex').slice(0,12),text=memories[locale][key];if(typeof text!=='string')throw Error('MISSING '+locale+' '+key);return text;};
const selected=source.items.filter(record=>!pilot||manifest.pilotIds.includes(record.id));
const entries=selected.map(record=>{
 const translations=Object.fromEntries(contentDraftLocales.map(locale=>{
  const translated=Object.fromEntries(Object.entries(record.translations.en).map(([field,value])=>[field,field==='reviewed'?false:field==='authors'||field==='title'&&['BOOK','WATCH'].includes(record.category)?value:Array.isArray(value)?value.map(text=>translate(text,locale)):translate(value,locale)]));
  if(!draftTranslationMatches(record,translated))throw Error('INVARIANT '+record.id+' '+locale);return[locale,translated];
 }));
 return{id:record.id,expectedVersion:record.version,sourceFingerprint:contentDraftFingerprint(record),translations};
});
const bundle={schema:1,serverSourceVersion:manifest.serverVersion,projectionSha256:manifest.projectionSha256,reviewStatus:'linguistic-draft-not-human-reviewed',items:entries};
const output=root+'/'+(pilot?'pilot-drafts.json':'draft-overlay.json');await writeFile(output,JSON.stringify(bundle));
if(!pilot){
 const apply=createContentDraftTranslator(entries),reserve=JSON.parse(await readFile('apps/client/src/web/backup/catalog.json','utf8')).items;
 const applied=reserve.map(record=>{const projected=withGenericArtwork(applyRecipeWording(record));const next=apply(projected);if(contentDraftLocales.some(locale=>!next.translations?.[locale]))throw Error('RESERVE_MISMATCH '+record.id);return next;});
 // An operator patch changes translations only; never import source-catalog as a replacement database.
 await writeFile(root+'/translation-patch.json',JSON.stringify({schema:1,serverSourceVersion:manifest.serverVersion,items:entries.map(({id,expectedVersion,sourceFingerprint,translations})=>({id,expectedVersion,sourceFingerprint,translations}))}));
 await writeFile(root+'/offline-drafts.json',JSON.stringify({schema:1,sourceVersion:manifest.serverVersion,items:applied.map(({id,version,translations})=>({id,expectedVersion:version,translations:Object.fromEntries(contentDraftLocales.map(locale=>[locale,translations[locale]]))}))}));
 console.log(JSON.stringify({compiled:entries.length,recordTranslations:entries.length*4,offline:applied.length,bytes:Buffer.byteLength(JSON.stringify(bundle)),path:output}));
}else console.log(JSON.stringify({pilotRecords:entries.length,pilotTranslations:entries.length*4,path:output}));
