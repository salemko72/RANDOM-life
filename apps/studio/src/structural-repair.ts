import { supportedLocales } from '@random/shared';
import { readContentPackage } from './content-package';

type RecordValue = Record<string, unknown>;
const object = (value: unknown): value is RecordValue => !!value && typeof value === 'object' && !Array.isArray(value);
const translationKeys = new Set(['title','summary','imageAlt','sourceLabel','rightsNote','reviewed','steps','ingredientNames','ingredientUnits','genres','recommendationReason','equipment','durationLabel','authors']);
const arrayKeys = ['tags','steps','allergens','dietaryTags','genres','authors','equipment','ingredientNames','ingredientUnits','suggestedAllergens'];
const locale = (value: string) => ({eng:'en',bhs:'bs','en-us':'en','bs-ba':'bs'}[value.toLowerCase()] ?? (['en','bs'].includes(value.toLowerCase()) ? value.toLowerCase() : value));

/** Repairs representation only; schema and bilingual validation remain authoritative. */
export function repairStructure(raw: RecordValue): { corrections: string[]; reviewFlags: string[] } {
  const corrections: string[] = [], reviewFlags: string[] = [];
  const change = (target: RecordValue, key: string, value: unknown, path: string) => {
    if (target[key] !== value) { target[key] = value; corrections.push(`${path}: representation repaired`); }
  };
  const arrays = (target: RecordValue, path: string) => {
    for (const key of arrayKeys) if (typeof target[key] === 'string') change(target,key,[target[key]],`${path}${key}`);
  };
  const number = (target: RecordValue, key: string, path: string) => {
    const value = target[key];
    if (typeof value === 'string' && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim()) && Number.isFinite(Number(value))) change(target,key,Number(value),path);
  };
  const enumCase = (target: RecordValue, key: string, values: string[], path: string) => {
    if (typeof target[key] !== 'string') return;
    const match = values.find(value => value.toLowerCase() === (target[key] as string).trim().toLowerCase());
    if (match) change(target,key,match,path);
  };
  const duration = (target: RecordValue, path: string) => {
    const original = target.durationLabel;
    if (typeof original !== 'string' || original.trim().length <= 60) return;
    // Preserve the complete supplied statement before extracting an explicitly stated duration.
    const destination = ['summary','recommendationReason'].find(key => typeof target[key] === 'string' && `${target[key]}\n${original}`.length <= 2000);
    const declared = original.match(/\b\d+(?:\s*[–-]\s*\d+)?\s*(?:minutes?|mins?|min|hours?|hrs?|sati|sat|minuta)(?:\s*(?:\/|per\s+|po\s+)(?:episode|epizoda|epizodi))?\b/i)?.[0];
    if (!destination || !declared || declared.length > 60) return;
    change(target,destination,`${target[destination]}\n${original}`,`${path}${destination}`);
    change(target,'durationLabel',declared,`${path}durationLabel`);
    reviewFlags.push(`${path}durationLabel: review the extracted duration; full original label preserved in ${destination}.`);
  };
  enumCase(raw,'category',['EAT','BOOK','READ','WATCH','MOVE','GO'],'category');
  if (raw.category === 'READ') change(raw,'category','BOOK','category');
  if (typeof raw.language === 'string') change(raw,'language',locale(raw.language),'language');
  arrays(raw,'');
  for (const key of ['servings','totalMinutes','durationMinutes','year','pageCount']) number(raw,key,key);
  change(raw,'factsVerified',false,'factsVerified');
  if (raw.category === 'EAT') change(raw,'allergensVerified',false,'allergensVerified');
  if (object(raw.image)) change(raw.image,'rightsConfirmed',false,'image.rightsConfirmed');
  enumCase(raw,'format',['Film','Serija'],'format');
  enumCase(raw,'intensity',['low','medium','high'],'intensity');
  enumCase(raw,'company',['solo','pair','friends'],'company');
  if (Array.isArray(raw.allergens)) raw.allergens = raw.allergens.map(value => typeof value === 'string' ? value.trim().toLowerCase() : value);
  if (Array.isArray(raw.ingredients)) raw.ingredients.forEach((ingredient,index) => { if (object(ingredient)) number(ingredient,'quantity',`ingredients.${index}.quantity`); });
  if (object(raw.phosphateAssessment)) { number(raw.phosphateAssessment,'phosphorusMgPerServing','phosphateAssessment.phosphorusMgPerServing'); change(raw.phosphateAssessment,'reviewed',false,'phosphateAssessment.reviewed'); }
  if (object(raw.translations)) {
    const translations = raw.translations;
    for (const key of Object.keys(translations)) {
      const canonical = locale(key);
      if (canonical !== key && translations[canonical] === undefined) { translations[canonical] = translations[key]; delete translations[key]; corrections.push(`translations.${key}: renamed to ${canonical}`); }
      else if (!(supportedLocales as readonly string[]).includes(key)) { delete translations[key]; corrections.push(`translations.${key}: unsupported locale removed; original retained in originalJson`); }
    }
    for (const [code,translation] of Object.entries(translations)) {
      if (!object(translation)) continue;
      for (const key of Object.keys(translation)) if (!translationKeys.has(key)) { delete translation[key]; corrections.push(`translations.${code}.${key}: unknown field removed; original retained in originalJson`); }
      arrays(translation,`translations.${code}.`);
      change(translation,'reviewed',false,`translations.${code}.reviewed`);
      for (const [key,sourceKey] of [['sourceLabel','label'],['rightsNote','rightsNote']] as const) {
        if (translation[key] === undefined && object(raw.source) && typeof raw.source[sourceKey] === 'string') {
          change(translation,key,raw.source[sourceKey],`translations.${code}.${key}`);
          reviewFlags.push(`translations.${code}.${key}: copied source metadata requires translation review.`);
        }
      }
      duration(translation,`translations.${code}.`);
    }
  }
  duration(raw,'');
  return { corrections, reviewFlags };
}

export function repairContentPackage(bytes: Uint8Array) {
  return readContentPackage(bytes, { repair: true });
}
