import {expect,it} from 'vitest';
import {demoCatalog} from '@random/shared';
import {bookPlaceholderInput,isBookPlaceholder} from '../apps/studio/src/book-placeholder';
it('prepares a clearly described placeholder without altering the book or approving it',()=>{
 const original=structuredClone(demoCatalog.find(item=>item.category==='BOOK')!);const before=structuredClone(original);
 const next=bookPlaceholderInput(original);
 expect(original).toEqual(before);expect(next.title).toBe(original.title);if(next.category==='BOOK'&&original.category==='BOOK')expect(next.authors).toEqual(original.authors);
 expect(next.image).toMatchObject({generated:true,rightsConfirmed:false});expect(next.image.provenance).toBeUndefined();expect(isBookPlaceholder(next)).toBe(true);
 expect(next.translations?.en?.reviewed).toBe(false);expect(next.translations?.bs?.reviewed).toBe(false);expect(next.translations?.en?.imageAlt).toContain('not the original cover');
 expect(()=>bookPlaceholderInput(demoCatalog.find(item=>item.category==='EAT')!)).toThrow('books only');
});
