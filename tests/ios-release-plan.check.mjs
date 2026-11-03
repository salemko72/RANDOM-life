import{test}from'node:test';import assert from'node:assert/strict';import{nextIosBuild}from'../scripts/lib/ios-release-plan.mjs';
test('increments above both local and EAS versions, including failed/canceled uploads',()=>{assert.equal(nextIosBuild('2',[{platform:'IOS',appBuildVersion:'5',status:'ERRORED'}]),'6');assert.equal(nextIosBuild('8',[{platform:'IOS',appBuildVersion:'2'}]),'9');});
test('ignores Android build numbers',()=>assert.equal(nextIosBuild('2',[{platform:'ANDROID',appBuildVersion:'100'}]),'3'));
test('supports a new app with no previous builds',()=>assert.equal(nextIosBuild('1',[]),'2'));
test('stops on unexpected or unsafe metadata',()=>{for(const v of ['','1.2','x','9007199254740991'])assert.throws(()=>nextIosBuild(v,[]));assert.throws(()=>nextIosBuild('2',{}));assert.throws(()=>nextIosBuild('2',[{platform:'IOS',appBuildVersion:null}]));});
