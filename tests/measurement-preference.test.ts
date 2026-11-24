import{expect,it}from'vitest';
import{readUnitPreference,UNIT_PREFERENCE_KEY}from'../apps/client/src/web/measurement-preference';
it('remembers explicit units independently of language and uses an older bridge-compatible key',()=>{
 expect(UNIT_PREFERENCE_KEY).toBe('random-life.experience.units.v1');for(const value of ['auto','metric','us']as const)expect(readUnitPreference({getItem:key=>key===UNIT_PREFERENCE_KEY?value:null})).toBe(value);
 for(const value of [null,'en','bs','de','US','<script>',''])expect(readUnitPreference({getItem:()=>value})).toBe('auto');expect(readUnitPreference({getItem:()=>{throw Error('blocked')}})).toBe('auto');
});
