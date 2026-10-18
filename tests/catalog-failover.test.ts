import {it,expect,vi} from 'vitest';
import {CatalogFailover} from '../apps/client/src/web/catalog-failover';
import type {ContentRecord} from '@random/shared';
const rows=[{id:'published-reserve',status:'published'}] as ContentRecord[];
it('activates bundled content after a failed public read and avoids repeated spin requests',async()=>{
 const fetcher=vi.fn().mockRejectedValue(Error('CATALOG_HTTP_503'));const catalog=new CatalogFailover(rows,fetcher);
 expect(await catalog.load()).toEqual(rows);expect(catalog.status.source).toBe('backup');expect(await catalog.load()).toEqual(rows);expect(fetcher).toHaveBeenCalledTimes(1);
});
it('uses D1 exclusively when it returns a valid empty catalog',async()=>{
 const catalog=new CatalogFailover(rows,async()=>[]);expect(await catalog.load()).toEqual([]);expect(catalog.status.source).toBe('online');
});
it('recovers to D1 without mutating the reserve or item identities',async()=>{
 const online=[{id:'published-online'}] as ContentRecord[],fetcher=vi.fn().mockRejectedValueOnce(Error('offline')).mockResolvedValueOnce(online);const catalog=new CatalogFailover(rows,fetcher);
 await catalog.load();expect(await catalog.load(true)).toEqual(online);expect(catalog.status.source).toBe('online');expect(rows[0].id).toBe('published-reserve');
});
it('deduplicates simultaneous public requests',async()=>{
 let resolve!:(value:ContentRecord[])=>void;const fetcher=vi.fn(()=>new Promise<ContentRecord[]>(r=>{resolve=r}));const catalog=new CatalogFailover(rows,fetcher);
 const a=catalog.load(),b=catalog.load();resolve([]);await Promise.all([a,b]);expect(fetcher).toHaveBeenCalledTimes(1);
});
it('rechecks D1 after the backoff expires',async()=>{
 let now=0;const fetcher=vi.fn().mockRejectedValueOnce(Error('offline')).mockResolvedValueOnce([]);const catalog=new CatalogFailover(rows,fetcher,()=>now);
 await catalog.load();now=30001;expect(await catalog.load()).toEqual([]);expect(catalog.status.source).toBe('online');
});
