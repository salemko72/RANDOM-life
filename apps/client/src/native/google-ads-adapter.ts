import type {AdsAdapter} from './ads-controller';

type GoogleAds = typeof import('react-native-google-mobile-ads');
export const LIVE_INTERSTITIAL_UNITS = {
  android: 'ca-app-pub-8395430021391101/6024046858',
  ios: 'ca-app-pub-8395430021391101/6733447119',
} as const;

// Consumer profiles, targeting, location, keywords and custom signals never cross this boundary.
export function createGoogleAdsAdapter(options: {
  platform: 'android' | 'ios';
  mode?: string;
  library(): Promise<GoogleAds>;
  privacyUnavailable(): void;
}): AdsAdapter {
  let sdk: GoogleAds;
  const library = async () => sdk ?? (sdk = await options.library());
  return {
    async consent() {
      const s = await library();
      return (await s.AdsConsent.gatherConsent()).canRequestAds;
    },
    async privacy() {
      const s = await library();
      const info = await s.AdsConsent.requestInfoUpdate();
      if (info.privacyOptionsRequirementStatus === s.AdsConsentPrivacyOptionsRequirementStatus.REQUIRED) {
        return (await s.AdsConsent.showPrivacyOptionsForm()).canRequestAds;
      }
      const current = await s.AdsConsent.loadAndShowConsentFormIfRequired();
      options.privacyUnavailable();
      return current.canRequestAds;
    },
    async initialize() {
      const s = await library();
      await s.default().setRequestConfiguration({
        maxAdContentRating: s.MaxAdContentRating.T,
        // Owner confirmed an intended 16+ audience; this is not a child-directed app.
        tagForChildDirectedTreatment: false,
        // 17.4.0 drops publisherPrivacyPersonalizationState in its validator.
        // Enforce NPA on each actual request below instead of claiming that flag works.
        // Do not infer an individual user's under-age consent status from that audience.
      });
      await s.default().initialize();
    },
    preload(events) {
      const unit = options.mode === 'live'
        ? LIVE_INTERSTITIAL_UNITS[options.platform]
        : sdk.TestIds.INTERSTITIAL;
      const ad = sdk.InterstitialAd.createForAdRequest(unit, {requestNonPersonalizedAdsOnly: true});
      ad.addAdEventListener(sdk.AdEventType.LOADED, events.loaded);
      ad.addAdEventListener(sdk.AdEventType.CLOSED, events.closed);
      ad.addAdEventListener(sdk.AdEventType.ERROR, events.failed);
      ad.load();
      return {show: () => ad.show(), dispose: () => ad.destroy()};
    },
  };
}
