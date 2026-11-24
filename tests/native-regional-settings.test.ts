import{expect,it}from'vitest';
import{runInNewContext}from'node:vm';
import{regionalSettingsScript,normalizeRegionalSettings}from'../apps/client/src/native/regional-settings';
import{applyStorageMessage,profileBootstrapScript,readSnapshot}from'../apps/client/src/native/profile-bridge';
const KEY='random-life.experience.units.v1';
it('exposes only bounded regional settings and not arbitrary locale/private fields',()=>{
 expect(normalizeRegionalSettings({regionCode:'us',measurementSystem:'us',temperatureUnit:'fahrenheit',private:'secret'})).toEqual({regionCode:'US',measurementSystem:'us',temperatureUnit:'fahrenheit'});
 expect(normalizeRegionalSettings({regionCode:'<script>',measurementSystem:'unknown',temperatureUnit:'bad'})).toEqual({});
});
it('seeds settings before application code and notifies foreground without reloading',()=>{
 const window:any={dispatchEvent:(e:any)=>events.push(e.type)},events:string[]=[];
 runInNewContext(regionalSettingsScript({regionCode:'DE',measurementSystem:'metric'},true),{window,Event:class{constructor(public type:string){}}});
 expect(JSON.parse(JSON.stringify(window.__lifespinnerRegionalSettings))).toEqual({regionCode:'DE',measurementSystem:'metric'});expect(events).toEqual(['lifespinner.regionchange']);
});
it('persists units using an already native-allowlisted experience key without invalidating old snapshots',()=>{
 const state={'random-life.local-profile.v1':'profile','random-life.experience.favorites':'favorites',[KEY]:'metric'};
 expect(readSnapshot(JSON.stringify(state))).toEqual(state);
 expect(applyStorageMessage(state,JSON.stringify({type:'random-life.local-state.v1',operation:'set',key:KEY,value:'us'}))?.[KEY]).toBe('us');
 const window:any={ReactNativeWebView:{postMessage(){}}};runInNewContext(profileBootstrapScript(state),{window});expect(window.localStorage.getItem(KEY)).toBe('metric');
});
