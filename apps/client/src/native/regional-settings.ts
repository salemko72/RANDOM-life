export type RegionalSettings={regionCode?:string;measurementSystem?:'metric'|'us'|'uk';temperatureUnit?:'celsius'|'fahrenheit'};
/** Only presentation settings cross the bridge, never a full OS locale object. */
export function normalizeRegionalSettings(input:unknown):RegionalSettings{
 if(!input||typeof input!=='object'||Array.isArray(input))return{};
 const x=input as Record<string,unknown>,result:RegionalSettings={};
 if(typeof x.regionCode==='string'&&/^[a-z]{2}$/i.test(x.regionCode))result.regionCode=x.regionCode.toUpperCase();
 if(x.measurementSystem==='metric'||x.measurementSystem==='us'||x.measurementSystem==='uk')result.measurementSystem=x.measurementSystem;
 if(x.temperatureUnit==='celsius'||x.temperatureUnit==='fahrenheit')result.temperatureUnit=x.temperatureUnit;
 return result;
}
export function regionalSettingsScript(input:unknown,notify=false):string{
 return 'window.__lifespinnerRegionalSettings='+JSON.stringify(normalizeRegionalSettings(input))+';'+(notify?"window.dispatchEvent(new Event('lifespinner.regionchange'));":'')+'true;';
}
