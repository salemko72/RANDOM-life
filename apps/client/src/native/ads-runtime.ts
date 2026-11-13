import type {AdMessage} from './ads-policy';
export type AdsRuntime={receive(message:AdMessage):void;active(value:boolean):void;resetDocument():void;dispose():void};
// Metro selects native platform adapters on Android/iOS; web has no ad SDK.
export function createAdsRuntime():AdsRuntime{return{receive(){},active(){},resetDocument(){},dispose(){}};}
