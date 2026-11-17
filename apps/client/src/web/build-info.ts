export type InstalledBuildInfo={version:string;build:string;platform:'ios'|'android'};
export function formatInstalledBuild(value:unknown):string|null{
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const v=value as Record<string,unknown>;
 if(v.platform!=='ios'&&v.platform!=='android')return null;
 if(typeof v.version!=='string'||v.version.length>48||!/^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(v.version))return null;
 if(typeof v.build!=='string'||!/^\d{1,12}$/.test(v.build))return null;
 return `v${v.version} · build ${v.build}`;
}
