import {expect,it} from 'vitest';
import {contentSchema,localizeContent,publicationIssues,createChatGPTPrompt} from '@random/shared';
import {demoCatalog} from '../apps/client/src/web/bilingualCatalog';
it('all 25 demos have complete reviewed ENG/BHS versions with aligned recipe and activity arrays',()=>{
 expect(demoCatalog).toHaveLength(25);
 for(const item of demoCatalog){expect(contentSchema.safeParse(item).success,item.id).toBe(true);const issues=publicationIssues({...item,factsVerified:true});expect(issues,item.id).toEqual([]);}
});
it('switching content language preserves identity, allergens, quantities, images and machine tags',()=>{
 const recipe=demoCatalog.find(i=>i.id==='moussaka')!;const en=localizeContent(recipe,'en'),bs=localizeContent(recipe,'bs');expect(en.title).toBe('Greek moussaka');expect(bs.title).toBe('Grčka musaka');expect(en.id).toBe(bs.id);expect(en.image.path).toBe(bs.image.path);
 if(en.category!=='EAT'||bs.category!=='EAT')throw Error();
 expect(en.ingredients.map(i=>[i.quantity,i.tag])).toEqual(bs.ingredients.map(i=>[i.quantity,i.tag]));expect(en.allergens).toEqual(bs.allergens);expect(en.steps[0]).not.toBe(bs.steps[0]);
});
it('legacy drafts remain importable but cannot publish without both complete reviewed translations',()=>{
 const item=demoCatalog[0];expect(contentSchema.safeParse({...item,translations:undefined}).success).toBe(true);expect(publicationIssues({...item,translations:undefined}).join(' ')).toContain('Missing EN');
 const changed={...item,translations:{...item.translations,en:{...item.translations!.en!,reviewed:false}}};expect(publicationIssues(changed).join(' ')).toContain('human review');
 if(item.category==='EAT')expect(publicationIssues({...item,translations:{...item.translations,en:{...item.translations!.en!,steps:['Only one step']}}}).join(' ')).toContain('cooking steps');
});
it('every Studio prompt requests both languages, shared data and independent review',()=>{
 for(const category of ['EAT','BOOK','WATCH','MOVE','GO'] as const){const p=createChatGPTPrompt(category,'Source');expect(p).toContain('translations.en');expect(p).toContain('translations.bs');expect(p).toContain('reviewed:false');expect(p).toContain('količine');}
});
