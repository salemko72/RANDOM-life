# UI translation assets — phase1B

`source.json` is an English-keyed inventory. Each of `es`, `pt-BR`, `de`, `it` has the same365 keys; values are linguistic drafts. English/BHS runtime behavior remains in ui-language and explicit bilingual pairs. `ui-copy.ts` routes drafts by English key and formats named text placeholders. Render results as React text/attributes, never raw HTML.

These four locales are **not selectable yet**. `Locale`, device/manual ready list and native locale declarations remain en/bs until catalogue/offline content and language QA are ready. Do not broaden them merely because these files exist. Server share parsers, links, UMP/legal/store copy and native boot-error surfaces also need the future activation audit.

Terminology: Spin→Girar(es/pt-BR),Drehen(de),Gira(it); everyday neutral Spanish, Brazilian Portuguese, informal German du and Italian tu. Home reset means tidying the home. Keep ENG/BHS language-option codes literal. Proper names/brands are preserved. Existing medical-classification wording is translated without representing a new verification of the underlying data.

Verify with `npx vitest run tests/ui-translations.test.ts tests/ui-copy.test.ts tests/ui-copy-inventory.test.ts` and `node scripts/inventory-ui-copy.mjs --check`. Source updates use `--write`, which preserves historical keys. Add new keys and translations to all dictionaries together; placeholders and boundary whitespace must agree. Full tests/typecheck/preview/browser checks remain required for application changes.

The next phase translates representative real EAT/BOOK/WATCH/MOVE/GO records, with extra scrutiny for ingredients/steps/allergens/nutrition and source/rights notes, then the467-item online catalogue and100-item reserve. No content text or nutrition was changed in this UI phase. No human linguistic or clinical review is claimed.
