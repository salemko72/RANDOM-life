import {it,expect} from 'vitest';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
import {reserveItems,reserveMetadata} from '../apps/client/src/web/backup/catalog';
import {publicationIssues} from '@random/shared';
import {createProfile,eligibleForProfile} from '../apps/client/src/web/preferences';
it('ships 100 unique, publishable, bilingual items across every category',()=>{
 expect(reserveItems).toHaveLength(100);expect(new Set(reserveItems.map(r=>r.id)).size).toBe(100);
 for(const category of ['EAT','BOOK','WATCH','MOVE','GO'])expect(reserveItems.filter(r=>r.category===category)).toHaveLength(20);
 for(const row of reserveItems){expect(row.status).toBe('published');expect(publicationIssues(row)).toEqual([]);expect(row.translations?.en?.reviewed).toBe(true);expect(row.translations?.bs?.reviewed).toBe(true);}
});
it('includes verified dietary alternatives without weakening profile safety',()=>{
 const food=reserveItems.filter(r=>r.category==='EAT'),vegan=food.filter(r=>eligibleForProfile(r,{...createProfile(),vegan:true})),renal=food.filter(r=>eligibleForProfile(r,{...createProfile(),lowPhosphateDiet:true}));
 expect(vegan.length).toBeGreaterThanOrEqual(7);expect(renal.length).toBeGreaterThanOrEqual(7);
 for(const r of vegan)expect(r.dietaryTags).toContain('vegan');
 for(const r of renal)expect(r.phosphateAssessment).toMatchObject({reviewed:true,suitability:'low'});
});
it('has a real optimized local picture for every item and fits the 10 MiB budget',async()=>{
 const source=await readFile('apps/client/src/web/backup/images.ts','utf8'),files=[...source.matchAll(/from '\.\/images\/([^']+)'/g)].map(m=>m[1]);let bytes=0;
 expect(files).toHaveLength(100);
 for(const row of reserveItems)expect(source).toContain(JSON.stringify(row.image.path)+':');
 for(const file of new Set(files)){const b=await readFile('apps/client/src/web/backup/images/'+file),info=await sharp(b).metadata();bytes+=b.length;expect(info.format).toBe('webp');expect(info.width).toBeLessThanOrEqual(720);expect(info.height).toBeLessThanOrEqual(960);}
 expect(bytes).toBe(reserveMetadata.imageBytes);expect(bytes+Buffer.byteLength(await readFile('apps/client/src/web/backup/catalog.json'))).toBeLessThan(10*1024*1024);
});
