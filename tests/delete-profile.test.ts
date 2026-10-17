import {expect,it} from 'vitest';
import {deleteDeviceProfile} from '../apps/client/src/web/delete-profile';
import {applyStorageMessage} from '../apps/client/src/native/profile-bridge';
it('deletes all device profiles and experience data, preserving editorial data',()=>{
 const data=new Map([['random-life.local-profile.v1','private'],['random-life.experience.old','favorites'],['random-life.experience.current','history'],['studio-library','keep'],['random-life.locale.v1','bs']]);
 let native=Object.fromEntries(data);
 deleteDeviceProfile({get length(){return data.size;},key:i=>[...data.keys()][i]??null,removeItem:key=>{data.delete(key);native=applyStorageMessage(native,JSON.stringify({type:'random-life.local-state.v1',operation:'remove',key}))??native;}});
 expect([...data.keys()]).toEqual(['studio-library','random-life.locale.v1']);
 expect(native).toEqual(Object.fromEntries(data));
});
