/** Preserve numeric order and composite fractions/ranges; only typography/decimal separator may vary. */
export function contentNumericSignature(text:string):string{
 const normalized=text.replace(/(\d)\s*(?:to|a|bis|até|hasta)\s*(?=\d)/gi,'$1-');
 const tokens=normalized.match(/\d+(?:[.,]\d+)?(?:\s*[/⁄–—-]\s*\d+(?:[.,]\d+)?)?|[¼½¾⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g)??[];
 const temperatures=[...normalized.matchAll(/([−-]?\d+(?:[.,]\d+)?)\s*°?\s*([CF])\b|\b(Celsius|Fahrenheit)\b/g)].map(match=>match[3]?match[3][0]:(match[1].replace('−','-').replace(',','.')+match[2]));
 return tokens.map(token=>token.replace(/\s/g,'').replace(/,/g,'.').replace(/[–—]/g,'-').replace(/⁄/g,'/')).join('|')+'#'+temperatures.join('|');
}
