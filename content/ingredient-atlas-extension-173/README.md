# Ingredient atlas extension — 173

Seven original AI-generated editorial illustration sheets, each 1250 × 1250 pixels on a 5 × 5 grid (250 × 250 pixels per cell). Exact supplied BHS order: entries 1–173; page 07 cells (row 4, column 3) and (row 4, column 4) are intentionally blank. Coordinates in the manifest are zero-based.

New identifiers: `extension-173-001` through `extension-173-173`. Owning atlas keys: `extension-173-01` through `extension-173-07`. The previous 350 definitions, coordinates and known alias resolutions are preserved; the baseline and regression test enforce that invariant. Existing explicit tags remain authoritative.

The source PNG sheets live in `apps/client/src/web/assets/ingredient-atlas-extension-173-*.png`. The downloadable package contains efficient WebP exports plus the manifest and ordered bilingual source list. App and Studio use the same sprite registry with `gridSize: 5` and existing build-time WebP optimization.

Visual review checked all 173 positions against the list. Two regenerated sheets correct the peeled banana and remove measuring-cup inscriptions. No labels, numbering or branded packaging appear on the sheets. Repeated ingredients and preparation variants remain distinct ordered entries.

Clarifications:
- Entry 50 preserves the supplied BHS name `Korijander`, while the icon is fresh leaves. All four matching live recipes (Mexican Red Rice, Black Bean and Avocado Tostadas, Guacamole with Tortilla Chips, Huevos Rancheros) translate that ingredient as cilantro and use it as a fresh addition. Seeds and powder are not aliases for this entry.
- Entry 133 is ground sweet paprika, confirmed by the user.
- Brand-specific foods are depicted without trademarks or packaging text.
- An illustration cannot certify no phosphate additives, an allergen formulation, raw-fish suitability, professional freezing, safe refrigerated storage, vegetarian rennet, or whether shellfish are alive. Those qualifiers remain in the ingredient names and recipe metadata. Artwork mapping changes no dietary claims, allergens, quantities or instructions.

No D1 writes and no APK/AAB builds are performed for this atlas integration. Existing installed Android packages require a later new build to include the additional local sprites; the web preview and Studio receive the deployed update.
