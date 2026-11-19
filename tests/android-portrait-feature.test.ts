import {createRequire} from 'node:module';
import {describe, expect, it} from 'vitest';
const require = createRequire(import.meta.url);
const {setOptionalPortraitFeature} = require('../apps/client/plugins/withOptionalPortraitFeature.cjs');

describe('Android portrait availability', () => {
  it('overrides the implicit installation requirement while keeping the portrait activity', () => {
    const manifest = {manifest: {application: [{activity: [{$: {'android:name': '.MainActivity', 'android:screenOrientation': 'portrait'}}]}]}};
    const originalApplication = structuredClone(manifest.manifest.application);
    const result = setOptionalPortraitFeature(manifest);
    expect(result.manifest['uses-feature']).toEqual([{$: {'android:name': 'android.hardware.screen.portrait', 'android:required': 'false'}}]);
    expect(result.manifest.application).toEqual(originalApplication);
  });

  it('replaces required portrait declarations without weakening other device requirements', () => {
    const other = {$: {'android:name': 'android.hardware.camera', 'android:required': 'true'}};
    const manifest = {manifest: {'uses-feature': [other, {$: {'android:name': 'android.hardware.screen.portrait', 'android:required': 'true'}}, {$: {'android:name': 'android.hardware.screen.portrait'}}]}};
    const result = setOptionalPortraitFeature(manifest);
    expect(result.manifest['uses-feature']).toContainEqual(other);
    expect(result.manifest['uses-feature'].filter((f: {$: Record<string, string>}) => f.$['android:name'] === 'android.hardware.screen.portrait')).toEqual([{$: {'android:name': 'android.hardware.screen.portrait', 'android:required': 'false'}}]);
  });

  it('is stable when Expo reapplies the plugin to an existing native project', () => {
    const manifest = {manifest: {}};
    const once = structuredClone(setOptionalPortraitFeature(manifest));
    expect(setOptionalPortraitFeature(manifest)).toEqual(once);
  });
});
