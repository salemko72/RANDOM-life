# RANDOM preview 0.9

Content Studio supports one-item ChatGPT ZIP packages. The prompt requests `content.json` plus exactly one PNG/JPEG/WebP/AVIF image, at ZIP root. Optional `manifest.json`: `{"format":"RANDOM-content-package-v1","content":"content.json","image":"image.png"}`. ENG and BHS translations are mandatory. The requested category is a hint; ChatGPT chooses the canonical category (READ stores BOOK) and explains its classification.

Upload ZIP: validate archive and bilingual data, decode and resize proportionally to max1440px, encode WebP84%, then atomically save media and a new local draft. Duplicate imports never overwrite another recipe. No existing editor changes on rejected packages. Limits: archive25MB, image15MB, image40MP, JSON128KB, at most5 entries. No traversal, ambiguous images, encrypted archives or executables.

AI proposes allergens, gluten/lactose presence and uncertainty. Human fact/allergen/image/translation reviews always reset. Neither classification confidence nor an AI proposal grants publication approval. Conflicting free-from tags prevent publication. This is an editorial suggestion, not allergy safety certification.

Provided translation batch files can be uploaded in the existing EAT batch panel. They merge translations by ID and version, preserving images/quantities/source and returning records to reviewable drafts. An image path in a backup is not an image backup.

Future Codex ingestion can prepare these ZIPs from supplied sources now. Writing directly to the browser's IndexedDB requires an authorized bridge; durable automatic ingestion needs a protected server import endpoint, deduplication and review queue. No such external bridge, paid service or automatic publishing was enabled here. ChatGPT must have image and file-generation capabilities to return an actual ZIP; the prompt instructs it to report unavailable tools honestly.

Wheel selection logic is unchanged; spinning category rings are brighter.
