import React from 'react';

// Normalized curves keep the editorial silhouettes consistent at every size.
const contours={
 eat:'M .26 .12 C .47 .12 .55 .01 .88 .01 C .97 .01 1 .07 1 .16 L 1 1 L .20 1 L .20 .60 L .17 .36 C .12 .22 .14 .15 .26 .12 Z',
 read:'M .24 .12 C .42 .05 .70 .02 .90 .015 C .97 .015 1 .05 1 .13 L 1 1 L .12 1 L .12 .36 C .12 .22 .14 .16 .24 .12 Z',
 watch:'M .18 .18 C .36 .06 .61 .09 .83 .02 C .94 -.01 1 .03 1 .16 L 1 1 L .18 1 C .18 .79 .22 .61 .15 .47 C .06 .30 .07 .25 .18 .18 Z',
 move:'M .27 .20 C .43 .15 .62 .02 .88 0 C .97 0 1 .08 1 .18 L 1 1 L .20 1 C .20 .67 .26 .49 .16 .38 C .09 .30 .15 .24 .27 .20 Z',
 go:'M .16 .26 C .22 .07 .48 .02 .73 .02 C .93 .02 1 .09 1 .26 L 1 .98 C .83 .83 .68 .91 .43 .84 C .26 .80 .12 .73 .17 .57 C .21 .44 .10 .41 .16 .26 Z',
};
export default function ArtworkMasks(){return <svg className="artwork-mask-definitions" width="0" height="0" aria-hidden="true" focusable="false"><defs>{Object.entries(contours).map(([category,path])=><clipPath key={category} id={`item-artwork-${category}`} clipPathUnits="objectBoundingBox"><path d={path}/></clipPath>)}</defs></svg>;}
