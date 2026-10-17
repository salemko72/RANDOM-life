/** Remove device profile data without touching the editorial library or credentials. */
export function deleteDeviceProfile(storage: Pick<Storage, 'length' | 'key' | 'removeItem'>): void {
 const keys: string[] = [];
 for (let index = 0; index < storage.length; index++) {
  const key = storage.key(index);
  if (key === 'random-life.local-profile.v1' || key?.startsWith('random-life.experience.')) keys.push(key);
 }
 for (const key of keys) storage.removeItem(key);
}
