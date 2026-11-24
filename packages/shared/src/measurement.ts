import{translatedContentUnit}from'./content-unit-glossary';
/** Display-only conversions: source records and nutritional values are never changed. */
export type UnitSystem = 'metric' | 'us';
export type UnitPreference = UnitSystem | 'auto';

export function resolveUnitSystem(preference: UnitPreference, regional: unknown, tags: readonly string[]): UnitSystem {
  if (preference === 'metric' || preference === 'us') return preference;
  const native = regional && typeof regional === 'object' ? regional as Record<string, unknown> : {};
  if (native.measurementSystem === 'us') return 'us';
  if (native.measurementSystem === 'metric' || native.measurementSystem === 'uk') return 'metric';
  if (typeof native.regionCode === 'string' && /^[a-z]{2}$/i.test(native.regionCode)) return native.regionCode.toUpperCase() === 'US' ? 'us' : 'metric';
  for (const tag of tags) {
    try {
      const region = new Intl.Locale(tag).region;
      if (region) return region === 'US' ? 'us' : 'metric';
    } catch { /* Malformed device tags do not prevent safe metric fallback. */ }
  }
  return 'metric';
}

/** Infer context only when the recipe identifies exactly one measuring standard. */
export function recipeMeasurementRegion(ingredients:readonly {unit:string}[]): 'us'|'uk'|undefined {
 const us=ingredients.some(i=>/\bUS\b/i.test(i.unit));
 const uk=ingredients.some(i=>/\bUK\b/i.test(i.unit));
 return us===uk?undefined:us?'us':'uk';
}

const CUP_ML = 236.5882365;
const OZ_G = 28.349523125;
const FL_OZ_ML = 29.5735295625;
type Measure = { kind: 'mass' | 'volume'; factor: number; system: UnitSystem };
const aliases: Record<string, Measure> = {};
function register(names: string[], kind: Measure['kind'], factor: number, system: UnitSystem): void {
  for (const name of names) aliases[name] = { kind, factor, system };
}
register(['g', 'gram', 'grams', 'grama'], 'mass', 1, 'metric');
register(['kg', 'kilogram', 'kilograms'], 'mass', 1000, 'metric');
register(['oz', 'ounce', 'ounces'], 'mass', OZ_G, 'us');
register(['lb', 'lbs', 'pound', 'pounds'], 'mass', OZ_G * 16, 'us');
register(['ml', 'milliliter', 'milliliters', 'millilitre', 'millilitres'], 'volume', 1, 'metric');
register(['l', 'liter', 'liters', 'litre', 'litres', 'litar'], 'volume', 1000, 'metric');
register(['us fl oz', 'fl oz (us)', 'us fluid ounce', 'us fluid ounces'], 'volume', FL_OZ_ML, 'us');
const cups = ['cup', 'cups', 'šolja', 'šolje', 'šalica', 'šalice', 'taza', 'tazas', 'xícara', 'xícaras', 'tasse', 'tassen', 'tazza', 'tazze'];
const tablespoons = ['tbsp', 'tablespoon', 'tablespoons', 'kašika', 'kašike', 'supena kašika', 'cucharada', 'cucharadas', 'colher de sopa', 'colheres de sopa', 'el', 'cucchiaio', 'cucchiai'];
const teaspoons = ['tsp', 'teaspoon', 'teaspoons', 'kašičica', 'kašičice', 'čajna kašičica', 'cucharadita', 'cucharaditas', 'colher de chá', 'colheres de chá', 'tl', 'cucchiaino', 'cucchiaini'];
for (const [names, us, uk] of [[cups, CUP_ML, null], [tablespoons, 14.78676478, 15], [teaspoons, 4.92892159, 5]] as const) {
  for (const name of names) {
    register([`us ${name}`, `${name} (us)`], 'volume', us, 'us');
    if (uk !== null) register([`uk ${name}`, `${name} (uk)`], 'volume', uk, 'metric');
  }
}
function measure(unit: string, sourceRegion?: 'us' | 'uk'): Measure | undefined {
  const key = unit.toLowerCase().trim().replace(/\s+/g, ' ');
  return Object.hasOwn(aliases, key) ? aliases[key] : sourceRegion ? aliases[`${sourceRegion} ${key}`] : undefined;
}
function number(value: number, locale: string, converted = false): string {
  // Two decimal places for ordinary cooking amounts; retain significant digits for tiny amounts.
  const options: Intl.NumberFormatOptions = converted
    ? Math.abs(value) > 0 && Math.abs(value) < 0.01 ? { maximumSignificantDigits: 3 } : { maximumFractionDigits: 2 }
    : { maximumSignificantDigits: 15 };
  try { return new Intl.NumberFormat(locale, { ...options, useGrouping: false }).format(value); }
  catch { return new Intl.NumberFormat('en', { ...options, useGrouping: false }).format(value); }
}
function target(value: number, kind: Measure['kind'], system: UnitSystem): { divisor: number; unit: string } {
  if (kind === 'mass') return system === 'metric' ? { divisor: 1, unit: 'g' } : value >= OZ_G * 16 ? { divisor: OZ_G * 16, unit: 'lb' } : { divisor: OZ_G, unit: 'oz' };
  return system === 'metric' ? { divisor: 1, unit: 'ml' } : value >= CUP_ML ? { divisor: CUP_ML, unit: 'US cups' } : { divisor: FL_OZ_ML, unit: 'US fl oz' };
}
function convert(values: number[], unit: string, system: UnitSystem, locale: string, sourceRegion?: 'us' | 'uk'): string | undefined {
  const source = measure(unit, sourceRegion);
  // Explicit UK spoons are normalised to millilitres even for metric cooking.
  const key = unit.toLowerCase().trim().replace(/\s+/g, ' ');
  const ukSpoon = /\buk\b/i.test(key) && source?.kind === 'volume'
    || sourceRegion === 'uk' && (tablespoons.includes(key) || teaspoons.includes(key));
  if (!source || source.system === system && !ukSpoon) return undefined;
  const amounts = values.map(value => value * source.factor);
  if (amounts.some(value => !Number.isFinite(value) || value <= 0)) return undefined;
  const output = target(Math.max(...amounts), source.kind, system);
  return `≈ ${amounts.map(value => number(value / output.divisor, locale, true)).join('–')} ${output.unit==='US cups'?(locale==='bs'?'šolje (US)':translatedContentUnit(output.unit,locale)??output.unit):output.unit}`;
}
export function formatIngredientAmount(ingredient: { quantity: number | null; unit: string }, localizedUnit: string, system: UnitSystem, locale: string): string {
  const { quantity, unit } = ingredient;
  if (quantity === null) return localizedUnit;
  const converted = Number.isFinite(quantity) && quantity > 0 ? convert([quantity], unit, system, locale) : undefined;
  if (converted) return converted;
  // Pack size is an independent physical amount; preserve the count and localized pack wording.
  const pack = !measure(unit) ? unit.match(/(\d+(?:[.,]\d+)?)\s*oz\b/i) : null;
  const packAmount = pack ? convert([Number(pack[1].replace(',', '.'))], 'oz', system, locale) : undefined;
  const label = packAmount ? localizedUnit.replace(/\d+(?:[.,]\d+)?[\s-]*oz\b/i, packAmount) : localizedUnit;
  return `${number(quantity, locale)}${label ? ` ${label}` : ''}`;
}

const fractions: Record<string, number> = { '¼': .25, '½': .5, '¾': .75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': .125, '⅜': .375, '⅝': .625, '⅞': .875 };
const numeric = '(?:\\d+\\s+\\d+/\\d+|\\d+/\\d+|\\d+(?:[.,]\\d+)?[¼½¾⅓⅔⅛⅜⅝⅞]?|[¼½¾⅓⅔⅛⅜⅝⅞])';
function parseAmount(raw: string): number {
  const fraction = fractions[raw.slice(-1)];
  if (fraction !== undefined) return (Number(raw.slice(0, -1)) || 0) + fraction;
  if (raw.includes('/')) {
    const [whole, numerator, denominator] = raw.trim().split(/[ /]+/).map(Number);
    return denominator === undefined ? whole / numerator : whole + numerator / denominator;
  }
  return Number(raw.replace(',', '.'));
}
const escape = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const contextualVolumes = [...cups, ...tablespoons, ...teaspoons, 'fl oz', 'fluid ounce', 'fluid ounces'];
// Consume explicit unsupported standards in full, so a contextual bare prefix cannot convert them.
const explicitVolumes = contextualVolumes.flatMap(name => [`${name} (uk)`, `${name} (us)`, `uk ${name}`, `us ${name}`]);
const unitPattern = [...Object.keys(aliases), ...explicitVolumes, ...contextualVolumes].sort((a, b) => b.length - a.length).map(escape).join('|');
const amountsPattern = `(${numeric})(?:\\s*[–−-]\\s*(${numeric}))?`;
// Captured prefixes work on Hermes and older WKWebView engines without lookbehind
// or Unicode property escapes. Include Latin accents and combining marks used by
// all six supported locales so identifiers cannot be mistaken for recipe amounts.
const latinLetters = 'A-Za-z\\u00C0-\\u02AF\\u0300-\\u036F';
const numberCharacters = '0-9¼½¾⅓⅔⅛⅜⅝⅞';
const measuresPattern = new RegExp(`(^|[^${latinLetters}${numberCharacters}/.,−-])${amountsPattern}\\s*(${unitPattern})(?![${latinLetters}${numberCharacters}])`, 'gi');
const temperaturesPattern = new RegExp(`(^|[^${latinLetters}${numberCharacters}/.,])([+-]?${numeric})(?:\\s*[–−-]\\s*([+-]?${numeric}))?\\s*(?:°\\s*)?(?:degrees?\\s+)?(fahrenheit|celsius|f|c)(?![${latinLetters}])`, 'gi');

export function formatRecipeText(text: string, system: UnitSystem, locale: string, sourceRegion?: 'us' | 'uk', options?: { mass?: boolean }): string {
  const temperatures = text.replace(temperaturesPattern, (match: string, prefix: string, first: string, second: string | undefined, symbol: string) => {
    const from = symbol[0].toLowerCase();
    if (from === (system === 'metric' ? 'c' : 'f')) return match;
    const values = [first, ...(second ? [second] : [])].map(parseAmount).map(value => from === 'f' ? (value - 32) * 5 / 9 : value * 9 / 5 + 32);
    return `${prefix}≈ ${values.map(value => number(Math.round(value), locale)).join('–')}°${system === 'metric' ? 'C' : 'F'}`;
  });
  return temperatures.replace(measuresPattern, (match: string, prefix: string, first: string, second: string | undefined, unit: string) => {
    if (options?.mass === false && measure(unit, sourceRegion)?.kind === 'mass') return match;
    const converted = convert([first, ...(second ? [second] : [])].map(parseAmount), unit, system, locale, sourceRegion);
    return converted ? prefix + converted : match;
  });
}
