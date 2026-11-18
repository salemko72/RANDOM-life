import{expect,test}from'vitest';import{readFileSync}from'node:fs';
import{contentDraftFingerprint}from'../packages/shared/src/content-draft-translations';
import{withGenericArtwork}from'../packages/shared/src/generic-artwork';
import{applyRecipeWording}from'../apps/client/src/web/recipe-wording';
const source=JSON.parse(readFileSync('content/i18n-2026-11-18/source-catalog.json','utf8'));
const reserve=JSON.parse(readFileSync('apps/client/src/web/backup/catalog.json','utf8'));
test('all100 reserve records preserve translation/safety source; known migration differences are only links and revision metadata',()=>{
 expect(reserve.items).toHaveLength(100);const mismatches=[];
 for(const record of reserve.items){const frozen=source.items.find((item:any)=>item.id===record.id),projected=withGenericArtwork(applyRecipeWording(record));const a=JSON.parse(contentDraftFingerprint(projected)),b=JSON.parse(contentDraftFingerprint(frozen));for(const key of ['version','updatedAt','accessLinks']){delete a[key];delete b[key];}if(JSON.stringify(a)!==JSON.stringify(b))mismatches.push(record.id);}
 expect(mismatches).toEqual([]);
});
