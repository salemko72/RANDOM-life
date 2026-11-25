import { localizeContent, type ContentLocale, type ContentRecord } from '@random/shared';
import bookEditionTitles from './book-edition-titles.json';

type EditionTitles = { sourceTitle: string; en: string } & Partial<Record<ContentLocale, string>>;
const editions: Readonly<Record<string, EditionTitles>> = bookEditionTitles;

/** Resolve book titles independently of the translation used for the rest of the card. */
export function localizeDisplayContent<T extends ContentRecord>(item: T, locale: ContentLocale): T {
  const display = localizeContent(item, locale);
  if (item.category !== 'BOOK' || !Object.hasOwn(editions, item.id)) return display;

  const edition = editions[item.id];
  if (edition.sourceTitle !== item.title && item.translations?.bs?.title !== edition.sourceTitle) return display;

  const title = edition[locale] ?? edition.en;
  return title === display.title ? display : { ...display, title };
}
