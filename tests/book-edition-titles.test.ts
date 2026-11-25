import { expect, it } from 'vitest';
import { appLocales } from '@random/shared';
import { localizeDisplayContent } from '../apps/client/src/web/localize-display-content';
import { validateCatalogItems } from '../apps/client/src/web/consumer-catalog-cache';
import editionTitles from '../apps/client/src/web/book-edition-titles.json';
import source from '../content/i18n-2026-11-18/source-catalog.json';
import reserve from '../apps/client/src/web/backup/catalog.json';

const books = source.items.filter(item => item.category === 'BOOK');
const reserveBooks = reserve.items.filter(item => item.category === 'BOOK');

it('covers every captured and reserve book in each selectable app locale', () => {
  expect(Object.keys(editionTitles).sort()).toEqual(books.map(book => book.id).sort());
  for (const book of validateCatalogItems(books).concat(validateCatalogItems(reserveBooks))) {
    const titles = editionTitles[book.id as keyof typeof editionTitles] as Record<string, string>;
    expect(titles?.sourceTitle, book.id).toBe(book.title);

    for (const locale of appLocales) {
      const displayed = localizeDisplayContent(book, locale);
      expect(displayed.title, `${book.id} ${locale}`).toBe(titles[locale] ?? titles.en);
      expect(displayed.title.length).toBeGreaterThan(0);
      expect(displayed.title.length).toBeLessThanOrEqual(160);
      expect(displayed.id).toBe(book.id);
    }
  }
});

it('uses edition titles even if the prose has only English and Croatian translations', () => {
  const [book] = validateCatalogItems(books.filter(book => book.title === 'Atomske navike'));
  expect(localizeDisplayContent(book, 'en').title).toBe('Atomic Habits');
  expect(localizeDisplayContent(book, 'bs').title).toBe('Atomske navike');
  expect(localizeDisplayContent(book, 'pt-BR').title).toBe('Hábitos atômicos');

  const [originalOnly] = validateCatalogItems(books.filter(book => book.title === 'Psi na jezeru'));
  expect(localizeDisplayContent(originalOnly, 'en').title).toBe('Dogs on the Lake');
  expect(localizeDisplayContent(originalOnly, 'pt-BR').title).toBe('Dogs on the Lake');
});
