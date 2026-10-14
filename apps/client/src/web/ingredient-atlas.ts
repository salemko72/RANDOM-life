/// <reference path="./image-assets.d.ts" />
import originalAtlas from './assets/ingredient-atlas.png';
import extensionAtlas from './assets/ingredient-atlas-extension-74.png';
import type {IngredientDefinition} from '@random/shared';
import type {CSSProperties} from 'react';
const images:Record<string,string>={original:originalAtlas,'extension-74':extensionAtlas};
/** Both Studio and the app must bind coordinates and their owning image together. */
export function ingredientSpriteStyle(definition:IngredientDefinition):CSSProperties{
 const key=definition.atlas??'original',path=images[key];
 if(!path)throw Error(`Ingredient atlas is not registered: ${key}`);
 const image=(globalThis as typeof globalThis & {__randomAssetUrls?:Record<string,string>}).__randomAssetUrls?.[path]??path;
 return {backgroundImage:`url("${image}")`,backgroundSize:'1000% 1000%',backgroundPosition:`${definition.column*100/9}% ${definition.row*100/9}%`};
}
