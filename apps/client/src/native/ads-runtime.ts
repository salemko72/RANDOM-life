import type {AdMessage} from './ads-policy';
export type AdsRuntime={receive(message:AdMessage):void;active(value:boolean):void;resetDocument():void;dispose():void};
// Metro selects ads-runtime.android.ts on Android. iOS and web never import GMA.
export function createAdsRuntime():AdsRuntime{return{receive(){},active(){},resetDocument(){},dispose(){}};}
