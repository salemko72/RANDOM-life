import { describe, expect, it, vi } from 'vitest';
import { formatIngredientAmount, formatRecipeText, recipeMeasurementRegion, resolveUnitSystem } from '../packages/shared/src/measurement';

describe('regional measurement resolution', () => {
  it('respects manual preference ahead of native regional settings', () => {
    expect(resolveUnitSystem('metric', { measurementSystem: 'us', regionCode: 'US' }, ['en-US'])).toBe('metric');
    expect(resolveUnitSystem('us', { measurementSystem: 'metric' }, ['de-DE'])).toBe('us');
  });
  it('uses native measurement system, then explicit region, never language alone', () => {
    expect(resolveUnitSystem('auto', { measurementSystem: 'uk', regionCode: 'US' }, [])).toBe('metric');
    expect(resolveUnitSystem('auto', { measurementSystem: 'us', regionCode: 'DE' }, [])).toBe('us');
    expect(resolveUnitSystem('auto', { regionCode: 'US' }, ['es-ES'])).toBe('us');
    expect(resolveUnitSystem('auto', null, ['es-US'])).toBe('us');
    expect(resolveUnitSystem('auto', {}, ['en-GB'])).toBe('metric');
    expect(resolveUnitSystem('auto', 'bad', ['en'])).toBe('metric');
    expect(resolveUnitSystem('auto', {}, ['en-Latn-US'])).toBe('us');
  });
});

describe('ingredient display amounts', () => {
  const amount = (quantity: number | null, unit: string, system: 'metric' | 'us', localizedUnit = unit, locale = 'en') =>
    formatIngredientAmount({ quantity, unit }, localizedUnit, system, locale);
  it('converts canonical mass even when its translated label differs', () => {
    expect(amount(100, 'g', 'us', 'Gramm')).toBe('≈ 3.53 oz');
    expect(amount(1, 'lb', 'metric')).toBe('≈ 453.59 g');
    expect(amount(1, 'kg', 'us')).toBe('≈ 2.2 lb');
    expect(amount(1000, 'g', 'metric')).toBe('1000 g');
  });
  it('keeps mass separate from volume and uses explicit US / UK standards', () => {
    expect(amount(1, 'US cup', 'metric')).toBe('≈ 236.59 ml');
    expect(amount(1, 'šolja (US)', 'metric')).toBe('≈ 236.59 ml');
    expect(amount(1, 'UK tbsp', 'metric')).toBe('≈ 15 ml');
    expect(amount(1, 'US tbsp', 'metric')).toBe('≈ 14.79 ml');
    expect(amount(1, 'US tsp', 'metric')).toBe('≈ 4.93 ml');
    expect(amount(1, 'cup', 'metric')).toBe('1 cup');
    expect(amount(1, 'UK cup', 'metric')).toBe('1 UK cup');
    expect(amount(1, 'kašika', 'metric')).toBe('1 kašika');
    expect(amount(250, 'ml', 'us')).toBe('≈ 1.06 US cups');
    expect(amount(30, 'ml', 'us')).toBe('≈ 1.01 US fl oz');
  });
  it('preserves counts, null, unknown units, precision and original data', () => {
    expect(amount(null, 'po ukusu', 'us', 'to taste')).toBe('to taste');
    expect(amount(2, 'kom', 'us', 'pieces')).toBe('2 pieces');
    expect(amount(0.125, 'cup', 'metric')).toBe('0.125 cup');
    expect(amount(0.01, 'g', 'us')).toBe('≈ 0.000353 oz');
    expect(amount(1.5, 'cup', 'metric', 'Tassen', 'de')).toBe('1,5 Tassen');
    const source = Object.freeze({ quantity: 14.5, unit: 'oz' });
    expect(formatIngredientAmount(source, 'oz', 'metric', 'de')).toBe('≈ 411,07 g');
    expect(source).toEqual({ quantity: 14.5, unit: 'oz' });
  });
  it('converts an embedded package size without converting the package count', () => {
    expect(amount(1, 'konzerva od 14.5 oz', 'metric', 'lata de 14.5 oz', 'es')).toBe('1 lata de ≈ 411,07 g');
    expect(amount(2, 'konzerva od 14.5 oz', 'metric', '14.5-oz-Dose', 'de')).toBe('2 ≈ 411,07 g-Dose');
    expect(amount(1, 'konzerva od 14.5 oz', 'metric', 'lata de 99 oz', 'es')).toBe('1 lata de ≈ 411,07 g');
  });
});

describe('recipe text display', () => {
  it('loads on runtimes without regex lookbehind or Unicode property escapes', async () => {
    const NativeRegExp = RegExp;
    const constructor = vi.spyOn(globalThis, 'RegExp').mockImplementation(function (pattern: string | RegExp, flags?: string) {
      if (typeof pattern === 'string' && (/\(\?<[:=!]?/.test(pattern) || pattern.includes('\\p{'))) {
        throw new SyntaxError('Unsupported native regex syntax');
      }
      return new NativeRegExp(pattern, flags);
    } as typeof RegExp);
    try {
      vi.resetModules();
      const compatible = await import('../packages/shared/src/measurement');
      expect(compatible.formatRecipeText('1 oz and 2 oz', 'metric', 'en')).toBe('≈ 28.35 g and ≈ 56.7 g');
    } finally {
      constructor.mockRestore();
    }
  });
  it('preserves leading boundaries and protects accented identifiers and malformed numeric suffixes', () => {
    expect(formatRecipeText('(1 oz);2 oz and 3 oz!', 'metric', 'en')).toBe('(≈ 28.35 g);≈ 56.7 g and ≈ 85.05 g!');
    const protectedText = 'Vitamin B12g, é12g, č12oz, 1.2.3 oz, 1/2/3 oz, 1 ozônio, é350F.';
    expect(formatRecipeText(protectedText, 'metric', 'en')).toBe(protectedText);
    expect(formatRecipeText('(350F);180C.', 'metric', 'en')).toBe('(≈ 177°C);180C.');
  });
  it('can preserve nutrient mass while still converting serving volumes and temperatures', () => {
    const text = '20 g protein, serving 1 US cup at 350F';
    expect(formatRecipeText(text, 'us', 'en', undefined, { mass: false })).toBe(text);
    expect(formatRecipeText(text, 'metric', 'en', undefined, { mass: false }))
      .toBe('20 g protein, serving ≈ 236.59 ml at ≈ 177°C');
    expect(formatRecipeText(text, 'us', 'en')).toBe('≈ 0.71 oz protein, serving 1 US cup at 350F');
    expect(formatRecipeText('1 oz protein, serving 250 ml at 180C', 'us', 'en', undefined, { mass: false }))
      .toBe('1 oz protein, serving ≈ 1.06 US cups at ≈ 356°F');
  });
  it('converts temperatures, mass and explicit volumes while retaining time/count/nutrients', () => {
    expect(formatRecipeText('Bake 2 eggs at 350°F for 20 minutes; add 8 oz flour and 1 US cup milk. Sodium 100 mg.', 'metric', 'en'))
      .toBe('Bake 2 eggs at ≈ 177°C for 20 minutes; add ≈ 226.8 g flour and ≈ 236.59 ml milk. Sodium 100 mg.');
    expect(formatRecipeText('Bake at 180 °C; use 500 g and 30 ml.', 'us', 'en'))
      .toBe('Bake at ≈ 356°F; use ≈ 1.1 lb and ≈ 1.01 US fl oz.');
  });
  it('handles fractions, ranges and locale decimals', () => {
    expect(formatRecipeText('Add 1 1/2 US cups and ½ US tsp; use 1–2 oz.', 'metric', 'de'))
      .toBe('Add ≈ 354,88 ml and ≈ 2,46 ml; use ≈ 28,35–56,7 g.');
    expect(formatRecipeText('Add 1,5 L.', 'us', 'de')).toBe('Add ≈ 6,34 Tassen (US).');
  });
  it('only resolves unlabeled cups from known US origin and leaves UK cups ambiguous', () => {
    expect(formatRecipeText('Use 1 cup and 1 tbsp.', 'metric', 'en')).toBe('Use 1 cup and 1 tbsp.');
    expect(formatRecipeText('Use 1 cup and 1 tbsp.', 'metric', 'en', 'us')).toBe('Use ≈ 236.59 ml and ≈ 14.79 ml.');
    expect(formatRecipeText('Use 1 cup and 1 tbsp.', 'metric', 'en', 'uk')).toBe('Use 1 cup and ≈ 15 ml.');
  });
  it('recognizes translated explicit US cup and spoon labels', () => {
    for (const unit of ['taza (US)', 'xícara (US)', 'Tasse (US)', 'tazza (US)', 'šolja (US)']) {
      expect(formatRecipeText(`1 ${unit}`, 'metric', 'en')).toBe('≈ 236.59 ml');
    }
    expect(formatRecipeText('1 colher de sopa (US)', 'metric', 'en')).toBe('≈ 14.79 ml');
  });
  it('supports explicit named and signed temperatures without changing signed mass', () => {
    expect(formatRecipeText('Chill to -4°F then bake at 350 Fahrenheit or 180 C.', 'metric', 'en'))
      .toBe('Chill to ≈ -20°C then bake at ≈ 177°C or 180 C.');
    expect(formatRecipeText('Below -5 g is invalid; use 100 mg.', 'us', 'en')).toBe('Below -5 g is invalid; use 100 mg.');
  });
  it('preserves unsupported UK volumes rather than matching a suffix as US volume', () => {
    expect(formatRecipeText('Use 1 UK cup or 2 UK fl oz.', 'metric', 'en')).toBe('Use 1 UK cup or 2 UK fl oz.');
  });
  it('does not relabel existing metric volumes when context comes from UK spoons', () => {
    expect(formatRecipeText('Add 100 ml and 1 liter.', 'metric', 'en', 'uk')).toBe('Add 100 ml and 1 liter.');
  });
  it('converts whole Unicode fractions and temperature ranges without touching number suffixes', () => {
    expect(formatRecipeText('Use 1½ US cups; heat to 325–350°F. Batch A100g.', 'metric', 'en'))
      .toBe('Use ≈ 354.88 ml; heat to ≈ 163–177°C. Batch A100g.');
  });
});
it('localizes converted US cup labels for enabled application languages',()=>{
 expect(formatIngredientAmount({quantity:500,unit:'ml'},'ml','us','es')).toContain('tazas (US)');
 expect(formatIngredientAmount({quantity:500,unit:'ml'},'ml','us','de')).toContain('Tassen (US)');
 expect(formatIngredientAmount({quantity:500,unit:'ml'},'ml','us','bs')).toContain('šolje (US)');
});

it('preserves explicit unsupported suffixes and does not infer mixed recipe standards',()=>{
 expect(formatRecipeText('1 cup (UK); 2 fl oz (UK)', 'metric','en','us')).toBe('1 cup (UK); 2 fl oz (UK)');
 expect(recipeMeasurementRegion([{unit:'tbsp (US)'},{unit:'tsp (UK)'}])).toBeUndefined();
 expect(recipeMeasurementRegion([{unit:'tbsp (US)'},{unit:'g'}])).toBe('us');
 expect(recipeMeasurementRegion([{unit:'tsp (UK)'}])).toBe('uk');
});

it('converts bare fluid ounces only with unambiguous US context',()=>{
 expect(formatRecipeText('Pour into 2 servings of 8 fl oz each.','metric','en','us')).toBe('Pour into 2 servings of ≈ 236.59 ml each.');
 expect(formatRecipeText('8 fl oz','metric','en')).toBe('8 fl oz');
 expect(formatRecipeText('8 fl oz','metric','en','uk')).toBe('8 fl oz');
});
