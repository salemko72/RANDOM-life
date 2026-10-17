import {z} from 'zod';
import type {ContentInput} from './content';

export const CONTENT_CONTRACT_VERSION=2;
export const CONTENT_KIT_URL='https://random-life-preview.pages.dev/downloads/RANDOM-Ahmed-content-kit.zip';
export const CONTENT_CONTRACT_URL='https://random-life-preview.pages.dev/api/content-contract';

/** Outbound browser links only. These URLs are never fetched by the server. */
export function safeAccessUrl(value:string):boolean {
 try {
  const url=new URL(value),host=url.hostname.toLowerCase();
  return url.protocol==='https:'&&!url.username&&!url.password&&(!url.port||url.port==='443')&&
   host.includes('.')&&!host.startsWith('[')&&!/^\d+(?:\.\d+)*$/.test(host)&&
   !/(?:^|\.)(?:localhost|local|internal|test|invalid)$/.test(host);
 }catch{return false;}
}
export const accessLinkSchema=z.object({
 provider:z.string().trim().min(1).max(80),
 url:z.string().trim().max(2048).refine(safeAccessUrl,'Use a public HTTPS URL without credentials.'),
 purpose:z.enum(['watch','buy','borrow','read']),
 kind:z.enum(['direct','search']),
 region:z.string().regex(/^[A-Z]{2}$/,'Use a two-letter country code, or omit region.').optional(),
 checkedAt:z.iso.date().optional(),
 verified:z.boolean().default(false),
}).refine(link=>!link.verified||!!link.checkedAt,{path:['checkedAt'],message:'A reviewed link requires its check date.'});
export type AccessLink=z.infer<typeof accessLinkSchema>;

/** Search destinations are useful without claiming a matching edition or regional availability. */
export function defaultAccessLinks(item:ContentInput):AccessLink[] {
 if(item.category!=='BOOK'&&item.category!=='WATCH')return [];
 const title=item.translations?.en?.title?.trim()||item.title;
 const search=(provider:string,url:string,purpose:AccessLink['purpose']):AccessLink=>({provider,url,purpose,kind:'search',verified:false});
 if(item.category==='BOOK'){
  const authors=item.translations?.en?.authors??item.authors;
  const query=item.isbn||[title,...authors].join(' ');
  return [search('Amazon',`https://www.amazon.com/s?k=${encodeURIComponent(query)}`,'buy'),
   search('Open Library',`https://openlibrary.org/search?q=${encodeURIComponent(query)}`,'borrow')];
 }
 const links:AccessLink[]=[];
 if(/\bnetflix\b/i.test(item.platform))links.push(search('Netflix',`https://www.netflix.com/search?q=${encodeURIComponent(title)}`,'watch'));
 links.push(search('JustWatch',`https://www.justwatch.com/search?q=${encodeURIComponent(title)}`,'watch'));
 return links;
}
export function visibleAccessLinks(item:ContentInput):AccessLink[] {
 if(item.category!=='BOOK'&&item.category!=='WATCH')return [];
 const links=(item.accessLinks??[]).flatMap(raw=>{
  const parsed=accessLinkSchema.safeParse(raw);
  return parsed.success&&(parsed.data.kind==='search'||parsed.data.verified)?[parsed.data]:[];
 });
 return links.length?links:defaultAccessLinks(item);
}
export function resetAccessLinkReviews<T extends ContentInput>(item:T):T {
 if(item.accessLinks)item.accessLinks=item.accessLinks.map(link=>({...link,verified:false}));
 return item;
}
export const contentContract={
 contractVersion:CONTENT_CONTRACT_VERSION,
 packageFormat:'RANDOM-content-package-v1',catalogFormat:'RANDOM-catalog-v2',
 kitUrl:CONTENT_KIT_URL,instructionsUrl:'https://random-life-preview.pages.dev/downloads/RANDOM-content-workflow.md',
 backwardCompatible:true,
 accessLinks:{optional:true,categories:['BOOK','WATCH'],maxItems:12,schema:z.toJSONSchema(accessLinkSchema,{unrepresentable:'any'}),
  rules:['Use verified:false in generated ZIPs. Only a human editor confirms a direct link.',
   'Search links do not prove availability. Do not invent direct URLs, editions or regional availability.',
   'Use translations.en.title and English author names or ISBN for searches. Keep URLs outside translations.',
   'Missing accessLinks never blocks publication. Old ZIPs remain supported.']},
};
