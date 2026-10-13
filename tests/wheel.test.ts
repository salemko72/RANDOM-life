import { expect, it } from 'vitest';
import { sectorAtRotation, landingRotation, chooseEnabledCategory, WHEEL_CATEGORIES, itemWheelChoices } from '../apps/client/src/web/wheel';

it('wheel pointer agrees with the landing category through multiple turns', () => {
  for (const target of [0,1,2,3,4]) for (const previous of [0, 47, 1953, 4080]) {
    const landing = landingRotation(previous, target, 6);
    expect(landing).toBeGreaterThan(previous + 360 * 4);
    expect(sectorAtRotation(landing)).toBe(target);
  }
});
it('wheel contains exactly the five supported categories', () => {
  expect(WHEEL_CATEGORIES).toHaveLength(5);
  expect(WHEEL_CATEGORIES.filter(c => c.enabled).map(c => c.id)).toEqual(['EAT','READ','WATCH','MOVE','GO']);
  for (let i = 0; i <= 100; i++) expect(['EAT','READ','WATCH','MOVE','GO']).toContain(chooseEnabledCategory(i / 100));
  expect(sectorAtRotation(288)).toBe(1);
});

it('automatic spins can land in every active category from the first spin',()=>{expect(chooseEnabledCategory(0)).toBe('EAT');expect(chooseEnabledCategory(.5)).toBe('WATCH');expect(chooseEnabledCategory(.99)).toBe('GO');});
it('automatic spins avoid the previous category',()=>{for(const previous of ['EAT','READ','WATCH','MOVE','GO'] as const)for(let i=0;i<100;i++)expect(chooseEnabledCategory(i/100,previous)).not.toBe(previous);});
it('item wheels support one to six visible choices and land on the displayed item',()=>{
 for(const count of [1,2,3,4,5,6])for(let target=0;target<count;target++){
  const angle=landingRotation(777,target,6,count);expect(sectorAtRotation(angle,count)).toBe(target);
 }
});

it('large catalogs show at most six unique examples including the winning item',()=>{const all=Array.from({length:100},(_,i)=>({id:String(i)}));const shown=itemWheelChoices(all,all[70],6,()=>.3);expect(shown).toHaveLength(6);expect(new Set(shown.map(c=>c.id)).size).toBe(6);expect(shown.some(c=>c.id==='70')).toBe(true);expect(itemWheelChoices([all[0]],all[0])).toEqual([all[0]]);});
