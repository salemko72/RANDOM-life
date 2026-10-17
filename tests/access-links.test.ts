import {describe,it,expect} from 'vitest';
import {zipSync,strToU8} from 'fflate';
import {contentSchema,demoItems,createChatGPTPrompt} from '@random/shared';
import * as shared from '@random/shared';
import {readContentPackage} from '../apps/studio/src/content-package';
import {repairContentPackage} from '../apps/studio/src/structural-repair';

const book=()=>structuredClone(demoItems.find(i=>i.category==='BOOK')!);
const link={provider:'Local bookshop',url:'https://books.example/title',purpose:'buy',kind:'direct',region:'BA',checkedAt:'2026-10-17',verified:true};
describe('content access links',()=>{
 it('retains optional links while accepting every legacy item',()=>{
  for(const item of demoItems)expect(contentSchema.safeParse(item).success).toBe(true);
  expect(contentSchema.parse({...book(),accessLinks:[link]})).toHaveProperty('accessLinks',[link]);
 });
 it.each(['javascript:alert(1)','http://books.example/title','https://user:password@books.example/title','https://localhost/title','https://127.0.0.1/title'])('rejects unsafe external URL %s',url=>{
  expect(contentSchema.safeParse({...book(),accessLinks:[{...link,url}]}).success).toBe(false);
 });
 it('requires a date for a verified direct link, without making absent links a publication issue',()=>{
  expect(contentSchema.safeParse({...book(),accessLinks:[{...link,checkedAt:undefined}]}).success).toBe(false);
  expect(shared.publicationIssues(book())).toEqual([]);
 });
 it('resets imported link approvals while retaining link identity and evidence date',()=>{
  const input=book();input.image.path='/media/awaiting-artwork.png';
  const pack=readContentPackage(zipSync({'content.json':strToU8(JSON.stringify({...input,accessLinks:[link]}))}));
  expect(pack.input).toHaveProperty('accessLinks',[{...link,verified:false}]);
 });
 it('uses English titles or ISBN for safe search fallbacks, never an artwork URL as a watch link',()=>{
  const input=book();input.title='Lokalizovani naslov';input.translations!.en!.title='The Original English Title';
  const make=(shared as any).defaultAccessLinks;
  expect(make,'shared search-link builder').toBeTypeOf('function');
  const links=make(input);
  expect(links.every((l:any)=>l.kind==='search'&&l.verified===false)).toBe(true);
  expect(new URL(links[0].url).searchParams.get('k')).toContain('The Original English Title');
  expect(new URL(make({...input,isbn:'9780140449136'})[0].url).searchParams.get('k')).toBe('9780140449136');
 });
 it('shows only reviewed direct links, with search fallbacks for legacy or unverified links',()=>{
  const visible=(shared as any).visibleAccessLinks;
  expect(visible,'public link selector').toBeTypeOf('function');
  expect(visible({...book(),accessLinks:[link]})).toEqual([link]);
  expect(visible({...book(),accessLinks:[{...link,verified:false}]}).every((l:any)=>l.kind==='search')).toBe(true);
 });
 it('teaches both content creators the same versioned, optional access-link contract',()=>{
  for(const category of ['BOOK','WATCH'] as const){
   const prompt=createChatGPTPrompt(category,'A title');
   expect(prompt).toContain('accessLinks');expect(prompt).toContain('verified:false');
   expect(prompt).toContain('/api/content-contract');
  }
 });
 it('repairs bad optional URLs without rejecting the book or inventing a replacement URL',()=>{
  const input=book();
  const pack=repairContentPackage(zipSync({'content.json':strToU8(JSON.stringify({...input,accessLinks:[{...link,url:'javascript:alert(1)'}]}))}));
  expect(pack.input.title).toBe(input.title);expect(pack.input.accessLinks).toEqual([]);
  expect(pack.originalJson).toContain('javascript:alert(1)');expect(pack.corrections?.join(' ')).toContain('accessLinks.0');
 });
});
