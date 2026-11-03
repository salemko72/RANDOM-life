/** Pure release planning: accept only our integer build scheme; never guess on malformed metadata. */
export function nextIosBuild(localBuild,builds){
 if(!/^\d+$/.test(String(localBuild)))throw Error('Local iOS buildNumber must be an integer');
 if(!Array.isArray(builds))throw Error('EAS build list was not an array');
 const numbers=[Number(localBuild)];
 for(const b of builds){if(b.platform!=='IOS')continue;const v=b.appBuildVersion;if(!/^\d+$/.test(String(v)))throw Error('EAS returned an unsupported iOS build number');numbers.push(Number(v));}
 const next=Math.max(...numbers)+1;if(!Number.isSafeInteger(next)||next<1)throw Error('Invalid next iOS build number');return String(next);
}
