import {describe, expect, it, vi} from 'vitest';
import {createGoogleAdsAdapter, LIVE_INTERSTITIAL_UNITS} from '../apps/client/src/native/google-ads-adapter';

type GoogleAds = typeof import('react-native-google-mobile-ads');
function fixture(platform: 'android' | 'ios', mode?: string) {
  const calls: string[] = [];
  const instance = {setRequestConfiguration: vi.fn(async () => { calls.push('config'); }), initialize: vi.fn(async () => { calls.push('init'); })};
  const ad = {load: vi.fn(), show: vi.fn(async () => {}), destroy: vi.fn(), addAdEventListener: vi.fn()};
  const sdk = {
    default: () => instance,
    AdsConsent: {
      gatherConsent: vi.fn(async () => { calls.push('consent'); return {canRequestAds: true}; }),
      requestInfoUpdate: vi.fn(async () => ({privacyOptionsRequirementStatus: 'REQUIRED'})),
      showPrivacyOptionsForm: vi.fn(async () => ({canRequestAds: false})),
      loadAndShowConsentFormIfRequired: vi.fn(async () => ({canRequestAds: true})),
    },
    AdsConsentPrivacyOptionsRequirementStatus: {REQUIRED: 'REQUIRED'},
    TestIds: {INTERSTITIAL: platform === 'ios' ? 'ca-app-pub-3940256099942544/4411468910' : 'ca-app-pub-3940256099942544/1033173712'},
    MaxAdContentRating: {T: 'T'},
    InterstitialAd: {createForAdRequest: vi.fn(() => ad)},
    AdEventType: {LOADED: 'loaded', CLOSED: 'closed', ERROR: 'error'},
  };
  const privacyUnavailable = vi.fn();
  const adapter = createGoogleAdsAdapter({platform, mode, library: async () => sdk as unknown as GoogleAds, privacyUnavailable});
  return {adapter, sdk, instance, ad, calls, privacyUnavailable};
}
const events = () => ({loaded: vi.fn(), closed: vi.fn(), failed: vi.fn()});

describe.each(['android', 'ios'] as const)('%s Google ads adapter', platform => {
  it.each([undefined, 'test', '', 'LIVE', 'production'])('uses only Google test units for mode %s, including release-style configuration', async mode => {
    const f = fixture(platform, mode);
    await f.adapter.consent(); await f.adapter.initialize(); const handle = f.adapter.preload(events());
    expect(f.calls).toEqual(['consent', 'config', 'init']);
    expect(f.sdk.InterstitialAd.createForAdRequest).toHaveBeenCalledWith(f.sdk.TestIds.INTERSTITIAL, {requestNonPersonalizedAdsOnly: true});
    expect(f.instance.setRequestConfiguration).toHaveBeenCalledWith({maxAdContentRating: 'T', tagForChildDirectedTreatment: false});
    expect(f.ad.load).toHaveBeenCalledTimes(1); await handle.show(); handle.dispose();
    expect(f.ad.destroy).toHaveBeenCalledTimes(1);
  });
  it('selects the correct platform live unit only with an explicit live mode', async () => {
    const f = fixture(platform, 'live'); await f.adapter.consent(); await f.adapter.initialize(); f.adapter.preload(events());
    expect(f.sdk.InterstitialAd.createForAdRequest).toHaveBeenCalledWith(LIVE_INTERSTITIAL_UNITS[platform], {requestNonPersonalizedAdsOnly: true});
  });
  it('refreshes privacy info and returns the new permission after the required form', async () => {
    const f = fixture(platform); expect(await f.adapter.privacy()).toBe(false);
    expect(f.sdk.AdsConsent.requestInfoUpdate).toHaveBeenCalledTimes(1);
    expect(f.sdk.AdsConsent.showPrivacyOptionsForm).toHaveBeenCalledTimes(1);
    expect(f.privacyUnavailable).not.toHaveBeenCalled();
  });
  it('handles regions without privacy options without resetting consent', async () => {
    const f = fixture(platform); f.sdk.AdsConsent.requestInfoUpdate.mockResolvedValue({privacyOptionsRequirementStatus: 'NOT_REQUIRED'});
    expect(await f.adapter.privacy()).toBe(true);
    expect(f.sdk.AdsConsent.loadAndShowConsentFormIfRequired).toHaveBeenCalledTimes(1);
    expect(f.sdk.AdsConsent.showPrivacyOptionsForm).not.toHaveBeenCalled(); expect(f.privacyUnavailable).toHaveBeenCalledTimes(1);
  });
});
