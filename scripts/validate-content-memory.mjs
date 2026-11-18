import{contentNumericSignature}from'../packages/shared/src/content-numeric.ts';
import{readFile}from'node:fs/promises';
const root='content/i18n-2026-11-18',args=process.argv.slice(2),partial=args.includes('--partial'),locales=args.filter(arg=>!arg.startsWith('--'));
const source=JSON.parse(await readFile(root+'/source-strings.json','utf8')),byKey=new Map(source.map(row=>[row.key,row]));
const digits=contentNumericSignature;
const urls=text=>(text.match(/https?:\/\/[^\s]+/g)??[]).map(value=>value.replace(/[.,;:)]*$/,'')).sort();
const limits={title:160,imageAlt:300,sourceLabel:200,rightsNote:2000,summary:2000,steps:2000,ingredientNames:160,ingredientUnits:40,genres:60,recommendationReason:2000,equipment:160,durationLabel:60};
let failed=false;
for(const locale of locales.length?locales:['es','pt-BR','de','it']){
 let memory;try{memory=JSON.parse(await readFile(root+'/memory/'+locale+'.json','utf8'));}catch(error){console.error(locale,'missing or malformed memory');failed=true;continue;}
 const errors=[];for(const[key,text]of Object.entries(memory)){
  const row=byKey.get(key);if(!row){errors.push(key+' unknown key');continue;}
  if(typeof text!=='string'||!text.trim()){errors.push(key+' empty/nonstring');continue;}
  if(JSON.stringify(digits(row.en))!==JSON.stringify(digits(text)))errors.push(key+' numbers/fractions changed');
  if(JSON.stringify(urls(row.en))!==JSON.stringify(urls(text)))errors.push(key+' URL changed');
  const max=Math.min(...row.fields.map(field=>limits[field]??2000));if(text.trim().length>max)errors.push(key+' exceeds '+max+' chars');
  if(/\bUS\b/.test(row.en)&&row.fields.includes('ingredientUnits')&&!/(?:\b(?:US|USA|EUA)\b|EE\.?\s*UU\.?)/.test(text))errors.push(key+' missing explicit US unit qualifier');
 }
 const missing=source.filter(row=>!Object.hasOwn(memory,row.key)),pilotMissing=source.filter(row=>row.pilot&&!Object.hasOwn(memory,row.key));
 if(!partial&&missing.length)errors.push('missing '+missing.length+' keys');
 if(pilotMissing.length)errors.push('missing '+pilotMissing.length+' pilot keys');
 console.log(JSON.stringify({locale,translated:Object.keys(memory).length,total:source.length,missing:missing.length,pilotMissing:pilotMissing.length,errors:errors.length}));
 if(errors.length){failed=true;console.error(errors.slice(0,40).join('\n'));}
}
if(failed)process.exitCode=1;
