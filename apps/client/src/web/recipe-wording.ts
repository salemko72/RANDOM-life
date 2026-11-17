import type {ContentRecord} from '@random/shared';
import {recipeWordingCorrections} from './recipe-wording-data';
export {recipeWordingCorrections};
const corrections=new Map(recipeWordingCorrections.map(p=>[p.id,p]));
/** Local text projection; never alter the server snapshot/version/hash or safety fields.
 * Newer editorial revisions and mismatching text always win over this bounded patch. */
export function applyRecipeWording<T extends ContentRecord>(record:T):T{
 if(record.category!=='EAT')return record;
 const patch=corrections.get(record.id);
 if(!patch||record.version!==patch.expectedVersion)return record;
 const en=record.translations?.en,bs=record.translations?.bs;
 if(!en||!bs)return record;
 const current={summary:record.summary,steps:record.steps,translations:{en:{summary:en.summary,steps:en.steps},bs:{summary:bs.summary,steps:bs.steps}}};
 if(JSON.stringify(current)!==JSON.stringify(patch.before))return record;
 return {...record,summary:patch.after.summary,steps:[...patch.after.steps],translations:{...record.translations,en:{...en,summary:patch.after.translations.en.summary,steps:[...patch.after.translations.en.steps]},bs:{...bs,summary:patch.after.translations.bs.summary,steps:[...patch.after.translations.bs.steps]}}} as T;
}
