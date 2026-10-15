# Audit of the next 31 ingredient artwork requests

Only illustration lookup changes. All recipe names, quantities, preparation notes, human approvals and dietary assessments remain intact. Existing atlas IDs, images and cell coordinates remain unchanged.

## Reuse existing artwork: 16 requests

| Incoming wording | Existing artwork tag | Note |
| --- | --- | --- |
| Biber za kuhanje | black-pepper | Same pepper, different use |
| Biber za salatu | black-pepper | Same pepper, different use |
| Brašno za paniranje | wheat-flour | Flour, not breadcrumbs |
| Čili | red-chili | Generic chili illustration; do not infer a specific cultivar |
| Kozice, sačuvati ljuske | shrimp | Retain the instruction to keep shells |
| Krupna dimljena morska so | salt | Generic salt icon; retain smoked/coarse qualifiers in recipe |
| Limun za čišćenje artičoka | lemon | Use does not require separate artwork |
| Masline | extension-50-016 | Reuse the olive illustration; do not assert Gaeta origin/variety |
| Mlijeko za paniranje | milk | Same milk, different use |
| Mlijeko za smjesu | milk | Same milk, different use |
| Morska so | salt | Generic salt icon |
| Morska so u listićima | salt | Generic salt icon; preserve flake texture in recipe text |
| Narandža za sok | orange | Same fruit, different use |
| Suho bijelo vino | extension-50-001 | Generic white-wine illustration; preserve dry qualification |
| Tuna u ulju, ocijeđena | tuna | Generic tuna icon; keep oil/draining instruction |
| Velike zrele rajčice | tomato | Generic tomato icon; keep size/ripeness in recipe |

## New illustration candidates: 14

1. Artičoke
2. Cherry rajčice
3. Ciabatta ili rustikalni hljeb
4. Crveno vinsko sirće
5. Jakobove kapice
6. Ljutika
7. Očišćena hobotnica
8. Očišćena sipa
9. Padrón papričice
10. Riblji temeljac
11. Rukola
12. Šeri sirće
13. Shishito papričice
14. Soda bikarbona

## Clarify from recipe: 1

**Slatka paprika**: fresh sweet pepper or ground sweet paprika spice? No automatic assignment. If ground, use existing `paprika-spice`; if fresh, use `bell-pepper`. Existing explicit aliases such as “slatka mljevena paprika” already resolve correctly.

## Lookup behavior

Known stored tags and exact aliases retain precedence. BHS and ENG cooking-purpose suffixes (for cooking/coating/salad/mixture/marinade/serving, etc.) can be removed only when the remaining full name exactly matches an existing ingredient alias. No fuzzy matching or removal of dietary/cultivar qualifiers. For example, almond flour is never mapped to wheat flour, fish stock is never mapped to meat stock, and baking soda is never mapped to baking powder.

The cumulative missing-ingredient history stays intact; resolved entries disappear from its displayed/copyable request list after reload. Prompt generation also independently removes resolved entries. No new artwork was generated in this optimization pass.

The 14 new illustration candidates above are now covered by the subsequent `ingredient-atlas-extension-126` batch. The ambiguous unqualified “Slatka paprika” remains a manual choice. Do not regenerate those 14 solely from this historical audit.
