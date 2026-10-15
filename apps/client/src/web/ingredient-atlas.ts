/// <reference path="./image-assets.d.ts" />
import originalAtlas from './assets/ingredient-atlas.png';
import extensionAtlas from './assets/ingredient-atlas-extension-74.png';
import extension50Atlas from './assets/ingredient-atlas-extension-50.png';
import atlas126Page1 from './assets/ingredient-atlas-extension-126-01.png';
import atlas126Page2 from './assets/ingredient-atlas-extension-126-02.png';
import atlas126Page3 from './assets/ingredient-atlas-extension-126-03.png';
import atlas126Page4 from './assets/ingredient-atlas-extension-126-04.png';
import atlas126Page5 from './assets/ingredient-atlas-extension-126-05.png';
import atlas126Page6 from './assets/ingredient-atlas-extension-126-06.png';
import atlas126Page7 from './assets/ingredient-atlas-extension-126-07.png';
import atlas126Page8 from './assets/ingredient-atlas-extension-126-08.png';
import type {IngredientDefinition} from '@random/shared';
import type {CSSProperties} from 'react';
const images:Record<string,string>={original:originalAtlas,'extension-74':extensionAtlas,'extension-50':extension50Atlas,'extension-126-01':atlas126Page1,'extension-126-02':atlas126Page2,'extension-126-03':atlas126Page3,'extension-126-04':atlas126Page4,'extension-126-05':atlas126Page5,'extension-126-06':atlas126Page6,'extension-126-07':atlas126Page7,'extension-126-08':atlas126Page8};
/** Both Studio and the app must bind coordinates and their owning image together. */
export function ingredientSpriteStyle(definition:IngredientDefinition):CSSProperties{
 const key=definition.atlas??'original',path=images[key];
 if(!path)throw Error(`Ingredient atlas is not registered: ${key}`);
 const image=(globalThis as typeof globalThis & {__randomAssetUrls?:Record<string,string>}).__randomAssetUrls?.[path]??path;
 const grid=definition.gridSize??10;
 return {backgroundImage:`url("${image}")`,backgroundSize:`${grid*100}% ${grid*100}%`,backgroundPosition:`${definition.column*100/(grid-1)}% ${definition.row*100/(grid-1)}%`};
}
