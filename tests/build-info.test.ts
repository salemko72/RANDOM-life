import {expect,test} from 'vitest';
import {formatInstalledBuild} from '../apps/client/src/web/build-info';
test('formats the installed iOS and Android build independently',()=>{
 expect(formatInstalledBuild({version:'1.0.1',build:'5',platform:'ios'})).toBe('v1.0.1 · build 5');
 expect(formatInstalledBuild({version:'1.0.1',build:'11',platform:'android'})).toBe('v1.0.1 · build 11');
});
test('does not invent a native build in a browser or from incomplete data',()=>{
 for(const data of [undefined,null,{},[],{version:'1.0.1',build:'5',platform:'web'},{version:'1.0.1',platform:'ios'}])expect(formatInstalledBuild(data)).toBeNull();
});
test('rejects unsafe or malformed version/build labels',()=>{
 for(const fields of [{version:'<script>',build:'5'},{version:'1.0.1',build:'-1'},{version:'1.0.1',build:'5<script>'},{version:'1.0.1',build:'1'.repeat(30)}])expect(formatInstalledBuild({...fields,platform:'ios'})).toBeNull();
});
