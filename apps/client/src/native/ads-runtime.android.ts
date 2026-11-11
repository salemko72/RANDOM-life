import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {createAdController,type AdsAdapter} from './ads-controller';
import type {AdsRuntime} from './ads-runtime';
const LIVE_UNIT='ca-app-pub-8395430021391101/6024046858';
export function createAdsRuntime():AdsRuntime{
 let sdk:typeof import('react-native-google-mobile-ads');
 const library=async()=>sdk??(sdk=await import('react-native-google-mobile-ads'));
 const adapter:AdsAdapter={
  async consent(){const s=await library();return(await s.AdsConsent.gatherConsent()).canRequestAds;},
  async privacy(){const s=await library();const info=await s.AdsConsent.requestInfoUpdate();if(info.privacyOptionsRequirementStatus===s.AdsConsentPrivacyOptionsRequirementStatus.REQUIRED)return(await s.AdsConsent.showPrivacyOptionsForm()).canRequestAds;Alert.alert('Ad privacy / Privatnost oglasa','No additional privacy form is available for your region. / Za tvoju regiju trenutno nema dodatnog obrasca za oglase.');return(await s.AdsConsent.loadAndShowConsentFormIfRequired()).canRequestAds;},
  async initialize(){await sdk.default().setRequestConfiguration({maxAdContentRating:sdk.MaxAdContentRating.T,publisherPrivacyPersonalizationState:'disabled'});await sdk.default().initialize();},
  preload(events){
   const unit=process.env.EXPO_PUBLIC_LIFESPINNER_ADS_MODE==='live'?LIVE_UNIT:sdk.TestIds.INTERSTITIAL;
   const ad=sdk.InterstitialAd.createForAdRequest(unit,{requestNonPersonalizedAdsOnly:true});
   ad.addAdEventListener(sdk.AdEventType.LOADED,events.loaded);ad.addAdEventListener(sdk.AdEventType.CLOSED,events.closed);ad.addAdEventListener(sdk.AdEventType.ERROR,events.failed);
   ad.load();return{show:()=>ad.show(),dispose:()=>ad.destroy()};
  },
 };
 return createAdController({sdk:adapter,read:()=>AsyncStorage.getItem('lifespinner.ads.limits.v1'),write:raw=>AsyncStorage.setItem('lifespinner.ads.limits.v1',raw),now:Date.now});
}
