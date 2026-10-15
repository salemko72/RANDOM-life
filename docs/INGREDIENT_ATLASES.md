# Ingredient atlas contracts

There are 350 registered ingredients: the original 100-cell atlas, the 74-cell extension, the separate 50-cell extension, and the 126-cell extension on eight 4×4 pages. Original IDs and coordinates are unchanged. Each extension definition explicitly names its atlas. The new 126-cell definitions explicitly set gridSize to 4; older definitions default to 10. The 74-cell extension has 26 blank cells; the 50-cell extension has 50 blank cells.

`apps/client/src/web/ingredient-atlas.ts` is the shared renderer. Both the public recipe panel and Studio's ingredient selector/full gallery call `ingredientSpriteStyle`. It binds the owning image, grid scale and cell coordinates in one inline style. CSS must not independently select an atlas. Standalone/Expo previews resolve the same imported images through the embedded asset registry.

Regression checks:

- `node scripts/smoke-studio-atlases.mjs`: verifies the actual image hash and coordinates for all 350 gallery entries, plus representative selectors from the reported Studio failure and the new extension.
- `node scripts/smoke-atlas-extension.mjs`: verifies pita, mint, sumac, tahini, mackerel, wasabi and egg yolk in the app, including absence of the extension CSS rule.
- `npm run typecheck` and `npm test`: schema, ingredient aliases, unchanged original IDs and missing-illustration filtering.

These checks verify image binding and coordinates. Human review of generated artwork remains necessary when adding or replacing illustrations. Icons do not establish nutrition, allergens or suitability for a medical diet.

The 126-cell extension preserves user source order across pages 01–08; its last two cells are blank. Its manifest and semantic illustration review are in `content/ingredient-atlas-extension-126/`. Ambiguous “Slatka paprika” stays manual until clarified.
