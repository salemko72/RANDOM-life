const {withAndroidManifest,withGradleProperties,AndroidConfig}=require('@expo/config-plugins');
module.exports=function(config){
 config=withGradleProperties(config,mod=>{mod.modResults=mod.modResults.filter(p=>p.key!=='RNGMA_ANDROID_BACKEND');mod.modResults.push({type:'property',key:'RNGMA_ANDROID_BACKEND',value:'classic'});return mod;});
 return withAndroidManifest(config,mod=>{
  const app=AndroidConfig.Manifest.getMainApplicationOrThrow(mod.modResults);
  const entries={'com.google.android.gms.ads.APPLICATION_ID':'ca-app-pub-8395430021391101~6926064985','com.google.android.gms.ads.DELAY_APP_MEASUREMENT_INIT':'true','com.google.android.gms.ads.flag.OPTIMIZE_INITIALIZATION':'true','com.google.android.gms.ads.flag.OPTIMIZE_AD_LOADING':'true'};
  app['meta-data']=(app['meta-data']||[]).filter(m=>!Object.hasOwn(entries,m.$['android:name']));
  for(const [name,value]of Object.entries(entries))app['meta-data'].push({$:{'android:name':name,'android:value':value}});
  return mod;
 });
};
