# Book-cover placeholder in Studio

A missing or undecodable book image shows an explicit placeholder option at the
bottom of the editor, immediately before Publish. Existing readable covers are
not replaced automatically. The normal image upload/optimization path is reused.

The default fallback is the app's existing generic books illustration. Editors
can choose their own standard image in the same panel. That image is optimized
and stored through the authenticated media endpoint at
`/media/book-placeholder-template.webp`; subsequent missing-book forms retrieve
it from D1. No new database fields or generator formats are needed.

The chosen template is copied to an individual image path for each book, so
changing the standard template does not change already reviewed book images.
The current item ID/version are retained and no new duplicate title is created.
Image provenance is removed; alt descriptions clearly identify a generic
illustration instead of an actual cover. Image rights and both translation
review flags are reset for human verification. Facts, title, authors and
bibliographic source are retained. Only the normal Publish operation changes
an existing content record; preparing a placeholder uploads media but does not
publish that book.

The photo sent through chat was visible as an image but its binary file was not
available in the cloud workspace. To use that exact photo, select
`placeholder.png` once in the editor's standard-placeholder file picker. Other
editors on the same D1 service can then reuse it without another upload.

Checks: `tests/book-placeholder.test.ts` and the placeholder scenarios in
`scripts/smoke-access-links.mjs` (missing image, original ID, explicit review,
published image, and a custom template surviving the next missing-book form).
