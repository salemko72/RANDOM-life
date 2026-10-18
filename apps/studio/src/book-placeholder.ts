import type {ContentInput} from '@random/shared';

export function bookPlaceholderInput(input:ContentInput):ContentInput{
 if(input.category!=='BOOK')throw new Error('Placeholder is available for books only.');
 const next=structuredClone(input);
 const {provenance,...image}=next.image;
 next.image={...image,path:'/media/book-placeholder.webp',alt:'Zamjenska ilustracija knjiga; nije originalna naslovnica.',generated:true,rightsConfirmed:false};
 for(const locale of ['en','bs'] as const){const translation=next.translations?.[locale];if(translation){translation.imageAlt=locale==='en'?'Generic book illustration; not the original cover.':next.image.alt;translation.reviewed=false;}}
 return next;
}
export function isBookPlaceholder(input:ContentInput){return input.category==='BOOK'&&/^\/media\/book-placeholder(?:-[a-zA-Z0-9_-]+)?\.webp$/.test(input.image.path);}
