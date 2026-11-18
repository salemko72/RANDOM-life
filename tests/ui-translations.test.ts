import{expect,test}from'vitest';
import{readFileSync,existsSync}from'node:fs';
const root='apps/client/src/web/i18n/';
const source=JSON.parse(readFileSync(root+'source.json','utf8'))as Record<string,string>;
const placeholders=(text:string)=>[...text.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map(match=>match[1]).sort();
for(const locale of ['es','pt-BR','de','it'])test(`${locale} covers every UI source and preserves interpolation parameters`,()=>{
 expect(existsSync(root+locale+'.json'),'dictionary must exist').toBe(true);
 const dictionary=JSON.parse(readFileSync(root+locale+'.json','utf8'))as Record<string,string>;
 expect(Object.keys(dictionary).sort()).toEqual(Object.keys(source).sort());
 for(const[key,value]of Object.entries(dictionary)){
  expect(typeof value,key).toBe('string');expect(value.trim().length,key).toBeGreaterThan(0);
  expect(placeholders(value),key).toEqual(placeholders(key));
  if(key.startsWith(' '))expect(value.startsWith(' '),key).toBe(true);
  if(key.endsWith(' '))expect(value.endsWith(' '),key).toBe(true);
 }
});
