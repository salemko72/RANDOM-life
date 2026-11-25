# Book display titles and HRV — 25 November 2026

Application source `6ea2e7efb93359befc9c94196972d77c0e347e64`. The chooser displays HRV. The stored locale remains `bs` so an existing selection survives the update.

The translation overlay deliberately copied English book titles into the four additional languages. A number of English records themselves copied a non-English title. Book display now chooses an edition title separately from the prose. The same resolver is used on the wheel, results, details, saved picks, related books and share text. A missing local cell uses the English display title. The lookup uses the record ID and the source title to avoid applying old title data to an unrelated record.

The title table covers the 172 books in the captured public catalog, including all 20 bundled offline books. The last available local live snapshot also contained those same 172 IDs and source titles. The table has 172 English entries and distinct title entries for HRV (89), ES (51), PT-BR (35), DE (50) and IT (47). Those counts include titles retained in their original language. The app supplies English renderings for 93 source titles where the captured catalog did not contain a usable English title. These are display text and should be reviewed against published English editions.

Publisher, library and bookseller endpoints such as WorldCat, Open Library, Google Books, Apple Books, and Yale University Press returned HTTP 403 from this session. A new request to the app's live catalog also returned 403. The title table combines captured catalog data with known edition titles and editorial English renderings. The external edition audit is incomplete. Do not represent these renderings or the new local candidates as verified publisher metadata.

435 tests, TypeScript and preview generation passed. The catalog tests assert every local and fallback cell in the captured and reserve catalogs. Chromium independently displayed the expected Atomic Habits title on the result card and detail view in all six languages. The release browser smoke also passed all six locales using a simulated online catalog, saved offline cache and cold reserve.

Pushed to `codex/salem-book-edition-titles`. GitHub returned HTTP 403 for draft PR creation. [Compare the source changes](https://github.com/salemko72/RANDOM-life/compare/codex/salem-personalize-remove-books...codex/salem-book-edition-titles?expand=1). A new build is needed to test the change on iPhone.
