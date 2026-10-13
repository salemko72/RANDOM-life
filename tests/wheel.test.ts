import { expect, it } from 'vitest';
import { sectorAtRotation, landingRotation, chooseEnabledCategory, WHEEL_CATEGORIES } from '../apps/client/src/web/wheel';

it('wheel pointer agrees with the landing category through multiple turns', () => {
  for (const target of [0, 5]) for (const previous of [0, 47, 1953, 4080]) {
    const landing = landingRotation(previous, target, 6);
    expect(landing).toBeGreaterThan(previous + 360 * 4);
    expect(sectorAtRotation(landing)).toBe(target);
  }
});
it('disabled categories can pass the pointer but never become final selections', () => {
  expect(WHEEL_CATEGORIES).toHaveLength(6);
  expect(WHEEL_CATEGORIES.filter(c => c.enabled).map(c => c.id)).toEqual(['EAT', 'LEARN']);
  for (let i = 0; i <= 100; i++) expect(['EAT','LEARN']).toContain(chooseEnabledCategory(i / 100));
  expect(sectorAtRotation(300)).toBe(1);
});
