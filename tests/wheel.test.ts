import { expect, it } from 'vitest';
import { sectorAtRotation, landingRotation, chooseEnabledCategory, WHEEL_CATEGORIES } from '../apps/client/src/web/wheel';

it('wheel pointer agrees with the landing category through multiple turns', () => {
  for (const target of [0, 2, 5]) for (const previous of [0, 47, 1953, 4080]) {
    const landing = landingRotation(previous, target, 6);
    expect(landing).toBeGreaterThan(previous + 360 * 4);
    expect(sectorAtRotation(landing)).toBe(target);
  }
});
it('disabled categories can pass the pointer but never become final selections', () => {
  expect(WHEEL_CATEGORIES).toHaveLength(6);
  expect(WHEEL_CATEGORIES.filter(c => c.enabled).map(c => c.id)).toEqual(['EAT', 'WATCH', 'LEARN']);
  for (let i = 0; i <= 100; i++) expect(['EAT','WATCH','LEARN']).toContain(chooseEnabledCategory(i / 100));
  expect(sectorAtRotation(300)).toBe(1);
});

it('automatic spins can land in every active category from the first spin',()=>{expect(chooseEnabledCategory(0)).toBe('EAT');expect(chooseEnabledCategory(.5)).toBe('WATCH');expect(chooseEnabledCategory(.99)).toBe('LEARN');});
it('automatic spins avoid the previous category',()=>{for(const previous of ['EAT','WATCH','LEARN'] as const)for(let i=0;i<100;i++)expect(chooseEnabledCategory(i/100,previous)).not.toBe(previous);});
