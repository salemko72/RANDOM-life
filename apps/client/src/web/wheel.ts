export const WHEEL_CATEGORIES = [
  { id: 'EAT', name: 'Eat', label: 'Nešto fino', enabled: true, icon: 'food' },
  { id: 'MOVE', name: 'Move', label: 'Pokreni se', enabled: false, icon: 'move' },
  { id: 'WATCH', name: 'Watch', label: 'Film ili serija', enabled: true, icon: 'watch' },
  { id: 'GO', name: 'Go', label: 'Negdje novo', enabled: false, icon: 'pin' },
  { id: 'DO', name: 'Do', label: 'Mali trenutak', enabled: false, icon: 'idea' },
  { id: 'LEARN', name: 'Learn', label: 'Knjige i čitanje', enabled: true, icon: 'book' },
] as const;
export type WheelCategory = typeof WHEEL_CATEGORIES[number]['id'];
export function sectorAtRotation(degrees: number) { return ((-Math.round(degrees / 60) % 6) + 6) % 6; }
export function landingRotation(previous: number, index: number, turns = 6) {
  return Math.ceil(previous / 360) * 360 + turns * 360 + ((360 - index * 60) % 360);
}
export type ActiveCategory = 'EAT' | 'WATCH' | 'LEARN';
export function chooseEnabledCategory(random = Math.random(), previous?:ActiveCategory, available:readonly ActiveCategory[]=['EAT','WATCH','LEARN']): ActiveCategory {
 const active=WHEEL_CATEGORIES.filter(c=>c.enabled&&available.includes(c.id as ActiveCategory));
 const alternatives=active.filter(c=>c.id!==previous);
 const candidates=alternatives.length?alternatives:active;
 if(!candidates.length)throw new Error('Nema dostupne kategorije.');
 const sample=Number.isFinite(random)?Math.min(.999999999,Math.max(0,random)):0;
 return candidates[Math.floor(sample*candidates.length)].id as ActiveCategory;
}
export function coast(t: number) {
  // Continuous acceleration, then progressively slower coast; exact final angle.
  const s = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - s * s, 4);
}
