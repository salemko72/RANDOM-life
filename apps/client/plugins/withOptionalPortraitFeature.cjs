const {withAndroidManifest} = require('@expo/config-plugins');

const PORTRAIT_FEATURE = 'android.hardware.screen.portrait';

function setOptionalPortraitFeature(androidManifest) {
  const features = androidManifest.manifest['uses-feature'] ?? [];
  const existing = features.find(feature => feature.$?.['android:name'] === PORTRAIT_FEATURE);
  // Keep the activity's portrait presentation without an installation filter.
  androidManifest.manifest['uses-feature'] = [
    ...features.filter(feature => feature.$?.['android:name'] !== PORTRAIT_FEATURE),
    {$: {...existing?.$, 'android:name': PORTRAIT_FEATURE, 'android:required': 'false'}},
  ];
  return androidManifest;
}

module.exports = function withOptionalPortraitFeature(config) {
  return withAndroidManifest(config, config => {
    config.modResults = setOptionalPortraitFeature(config.modResults);
    return config;
  });
};
module.exports.setOptionalPortraitFeature = setOptionalPortraitFeature;
