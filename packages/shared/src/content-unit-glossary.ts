/** Controlled display units. No quantity/volume conversions; regional US/UK measures remain explicit. */
const units:Record<string,readonly[string,string,string,string]>={
 'US cup':['taza (US)','xícara (US)','Tasse (US)','tazza (US)'],
 'US cups':['tazas (US)','xícaras (US)','Tassen (US)','tazze (US)'],
 'US tsp':['cucharadita (US)','colher de chá (US)','TL (US)','cucchiaino (US)'],
 'US tbsp':['cucharada (US)','colher de sopa (US)','EL (US)','cucchiaio (US)'],
 'UK tsp':['cucharadita (UK)','colher de chá (UK)','TL (UK)','cucchiaino (UK)'],
 'UK tbsp':['cucharada (UK)','colher de sopa (UK)','EL (UK)','cucchiaio (UK)'],
 tbsp:['cucharada','colher de sopa','EL','cucchiaio'],tsp:['cucharadita','colher de chá','TL','cucchiaino'],
 cup:['taza','xícara','Tasse','tazza'],cups:['tazas','xícaras','Tassen','tazze'],
 liter:['litro','litro','Liter','litro'],glass:['vaso','copo','Glas','bicchiere'],
 piece:['unidad','unidade','Stück','pezzo'],pieces:['unidades','unidades','Stück','pezzi'],pc:['unidad','unidade','Stück','pezzo'],pcs:['unidades','unidades','Stück','pezzi'],
 'pieces (3–6 to taste)':['unidades (3–6 al gusto)','unidades (3–6 a gosto)','Stück (3–6 nach Geschmack)','pezzi (3–6 a piacere)'],
 'konzerva od 14.5 oz':['lata de 14.5 oz','lata de 14.5 oz','14.5-oz-Dose','lattina da 14.5 oz'],
 'konzerva od 29 oz':['lata de 29 oz','lata de 29 oz','29-oz-Dose','lattina da 29 oz'],
 whole:['entero','inteiro','ganz','intero'],ml:['ml','ml','ml','ml'],g:['g','g','g','g'],oz:['oz','oz','oz','oz'],lb:['lb','lb','lb','lb'],
 stalks:['tallos','talos','Stängel','gambi'],leaf:['hoja','folha','Blatt','foglia'],leaves:['hojas','folhas','Blätter','foglie'],
 'as needed':['según sea necesario','conforme necessário','nach Bedarf','quanto basta'],
 'to taste':['al gusto','a gosto','nach Geschmack','a piacere'],
 handful:['puñado','punhado','Handvoll','manciata'],
 'thin slices':['rodajas finas','fatias finas','dünne Scheiben','fette sottili'],
 'large slices':['rebanadas grandes','fatias grandes','große Scheiben','fette grandi'],
 clove:['diente','dente','Zehe','spicchio'],cloves:['dientes','dentes','Zehen','spicchi'],
 sprig:['ramita','raminho','Zweig','rametto'],sprigs:['ramitas','raminhos','Zweige','rametti'],
 bunch:['manojo','maço','Bund','mazzetto'],large:['grande','grande','groß','grande'],
 loaf:['hogaza','pão inteiro','Laib','pagnotta'],slices:['rebanadas','fatias','Scheiben','fette']
};
const indices:Record<string,number>={es:0,'pt-BR':1,de:2,it:3};
export function translatedContentUnit(unit:string,locale:string):string|undefined{return Object.hasOwn(units,unit)&&Object.hasOwn(indices,locale)?units[unit][indices[locale]]:undefined;}
