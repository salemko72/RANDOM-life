import {test,expect} from 'vitest';
import {previewCatalog} from '../apps/client/src/web/catalog';
import {watchCatalog} from '../apps/client/src/web/watch';
import {activityCatalog} from '../apps/client/src/web/activities';
import {companionItems} from '../apps/client/src/web/companions';

test('book companions are other real works by the selected author, without file navigation',()=>{
 const expected:Record<string,string[]>={
  'Yuval Noah Harari':['Homo Deus','21 Lessons for the 21st Century'],
  'Thomas Mann':['Buddenbrooks','Der Zauberberg','Der Tod in Venedig'],
  'Fjodor Dostojevski':['Zločin i kazna','Braća Karamazovi','Idiot'],
  'Miljenko Jergović':['Sarajevo Marlboro','Rod','Inšallah, Madona, inšallah'],
  'Danilo Kiš':['Grobnica za Borisa Davidoviča','Enciklopedija mrtvih','Rani jadi']
 };
 for(const item of previewCatalog){if(item.category!=='BOOK')continue;
  const companions=companionItems(item);
  expect(companions.map(c=>c.title)).toEqual(expected[item.authors[0]]);
  expect(companions.every(c=>c.subtitle.includes(item.authors[0])&&c.category==='BOOK'&&!c.targetId&&c.id!==item.id)).toBe(true);
 }
 expect(companionItems({category:'BOOK',id:'unknown',authors:['Unknown']})).toEqual([]);
});
test('watch companions overlap genres and navigate existing titles excluding self',()=>{
 for(const item of watchCatalog){const companions=companionItems(item);
  const expected=watchCatalog.filter(other=>other.id!==item.id&&other.genres.some(g=>item.genres.includes(g)));
  expect(companions.filter(c=>c.targetId).map(c=>c.targetId)).toEqual(expected.map(c=>c.id));
  expect(companions.every(c=>c.category==='WATCH'&&c.id!==item.id)).toBe(true);
 }
});
test('MOVE offers two beginner routines per subtype and companions keep that subtype',()=>{
 const move=activityCatalog.filter(c=>c.category==='MOVE');expect(move).toHaveLength(6);
 for(const subtype of ['gym','trim','yoga'])expect(move.filter(c=>c.subtype===subtype)).toHaveLength(2);
 for(const item of move){expect(item.durationMinutes).toBeGreaterThanOrEqual(10);expect(item.durationMinutes).toBeLessThanOrEqual(30);expect(item.steps).toHaveLength(3);
  const companions=companionItems(item);expect(companions).toHaveLength(1);
  expect(companions[0].targetId).toBe(move.find(c=>c.id!==item.id&&c.subtype===item.subtype)?.id);
 }
});
test('GO contains four generic outing types and suggests the other existing options',()=>{
 const go=activityCatalog.filter(c=>c.category==='GO');expect(go.map(c=>c.id)).toEqual(['go-cinema','go-theater','go-disco','go-cafe']);
 for(const item of go){expect(item.steps).toHaveLength(3);expect(companionItems(item).map(c=>c.targetId)).toEqual(go.filter(c=>c.id!==item.id).map(c=>c.id));}
 expect(companionItems({category:'EAT',id:'preview-soup'})).toEqual([]);
});
test('activities remain explicit illustrated preview fixtures with provisional sources',()=>{
 for(const item of activityCatalog){expect(item.approvedBy).toBe('preview-fixture');expect(item.image.path).toBe(`/media/${item.id}.png`);expect(item.image.generated).toBe(true);expect(item.source.label).toContain('Provizorni');expect(item.factsVerified).toBe(false);}
});
test('every WATCH has thematic companions, with metadata-only dramas when no catalog match exists',()=>{
 for(const item of watchCatalog)expect(companionItems(item).length).toBeGreaterThan(0);
 const queens=watchCatalog.find(item=>item.id==='watch-queens')!;
 const companions=companionItems(queens);
 expect(companions.map(item=>item.title)).toEqual(['The Crown','Unorthodox']);
 expect(companions.every(item=>item.category==='WATCH'&&item.subtitle.includes('Drama')&&!item.targetId)).toBe(true);
 expect(companionItems({category:'WATCH',id:'unknown',genres:[]})).toEqual([]);
});
