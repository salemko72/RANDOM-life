# Ingredient atlas contracts

There are 224 registered ingredients: the original 100-cell atlas, the 74-cell extension and the separate 50-cell extension. Original IDs and coordinates are unchanged. Each extension definition explicitly names its atlas. The 74-cell extension has 26 blank cells; the 50-cell extension has 50 blank cells.

`apps/client/src/web/ingredient-atlas.ts` is the shared renderer. Both the public recipe panel and Studio's ingredient selector/full gallery call `ingredientSpriteStyle`. It binds the owning image, grid scale and cell coordinates in one inline style. CSS must not independently select an atlas. Standalone/Expo previews resolve the same imported images through the embedded asset registry.

Regression checks:

- `node scripts/smoke-studio-atlases.mjs`: verifies the actual image hash and coordinates for all 224 gallery entries, plus representative selectors from the reported Studio failure and the new extension.
- `node scripts/smoke-atlas-extension.mjs`: verifies pita, mint, sumac, tahini, mackerel, wasabi and egg yolk in the app, including absence of the extension CSS rule.
- `npm run typecheck` and `npm test`: schema, ingredient aliases, unchanged original IDs and missing-illustration filtering.

These checks verify image binding and coordinates. Human review of generated artwork remains necessary when adding or replacing illustrations. Icons do not establish nutrition, allergens or suitability for a medical diet.
