# Preview 0.12: review before saving and visible library sources

Order: (1) URL/source, (2) copy ChatGPT prompt, (3) import ZIP, (4) bilingual content and image preview + human review, (5) explicit Save draft, then send for review and publish. Import validates and optimizes the image and populates the work-in-progress form; it does NOT create or overwrite a content-library record. The optimized media and WIP form are retained locally so a reload does not lose the preview. Human verification remains required for publishing, not for saving unfinished work as a draft.

The preview shows the real optimized or stored image, title, summary, source, author/movie metadata, recipe quantities, ingredients, allergens and steps, with ENG/BHS language selection. Existing records also show stored media when reopened.

The same IndexedDB database `random-editorial-preview`, version1, and stores remain in use. No migration/drop/delete is introduced. Empty-state explanations distinguish the local saved library from the built-in app demonstration catalog. Base browser provides separate Saved content and Demo content selectors; demo cards open as unsaved editable copies and never update nonexistent IDs or silently populate the library.

A recovery picker accepts RANDOM-content-backup-v1 JSON. It validates the complete backup before writing and restores missing IDs as unreviewed drafts. Existing IDs and duplicate content are skipped; no existing records or images are overwritten. Restoration is one transaction. Backup image paths do not contain the images; media still present in this origin can be reused. Images unavailable on a different browser/origin must be supplied again. A reload-library button reads the existing store.

The user's actual browser storage is not accessible from this cloud workspace, so absence/destruction of user records has not been established. Different browsers, private sessions or site origins may have separate local libraries. No claim of complete recovery is made without importing and inspecting the relevant backup.
