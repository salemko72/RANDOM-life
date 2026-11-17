import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Platform} from 'react-native';
import {createAdController} from './ads-controller';
import {createGoogleAdsAdapter} from './google-ads-adapter';
import type {AdsRuntime} from './ads-runtime';

export function createAdsRuntime(): AdsRuntime {
  const sdk = createGoogleAdsAdapter({
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
    // Metro substitutes this literal in release bundles too. Unknown/unset means test.
    mode: process.env.EXPO_PUBLIC_LIFESPINNER_ADS_MODE,
    library: () => import('react-native-google-mobile-ads'),
    privacyUnavailable: () => Alert.alert(
      'Ad privacy / Privatnost oglasa',
      'No additional privacy form is required in your region. / Za tvoju regiju nije potreban dodatni obrazac za oglase.',
    ),
  });
  return createAdController({
    sdk,
    read: () => AsyncStorage.getItem('lifespinner.ads.limits.v1'),
    write: raw => AsyncStorage.setItem('lifespinner.ads.limits.v1', raw),
    now: Date.now,
  });
}
