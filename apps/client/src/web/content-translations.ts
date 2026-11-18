import{createContentDraftTranslator,type ContentDraftEntry}from'@random/shared';
// Local draft projection; server/cache payloads and production locale gating stay unchanged.
import bundle from'../../../../content/i18n-2026-11-18/draft-overlay.json';
export const applyContentTranslations=createContentDraftTranslator(bundle.items as unknown as ContentDraftEntry[]);
