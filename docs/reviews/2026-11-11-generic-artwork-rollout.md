# Generic artwork rollout — 11 November 2026

Completed: fifteen original generic editorial images (five per film/series/book family), optimized to 1024-square WebP, combined 1,696,950 bytes. No readable book titles/author names or title-specific scenes. Generated source PNGs retained; reproducible mapping recorded in generic-artwork-v1-sources.json.

Production verification:
- All273 BOOK/WATCH records use the new images; all467 public records remain published.
- The other194 records are byte-for-byte unchanged in the public response.
- Titles, authors, summaries, sources, tags, dietary metadata, access links and all other editorial content compare equal after excluding image metadata and normal write revision timestamps.
- All15 production image hashes match the optimized originals.
- Web JS/CSS match the tested staged build; shared-page OG images also use generic artwork.
- Production configuration/bindings hash unchanged. Existing56 download files preserved in staging.
- Deployed Pages ID: 7f9ee8fc-8f34-4330-bc3b-46783ecc4bbe.

Implementation:
- Stable per-session randomized consumer selection, with vintage compatibility pools; no re-selection while opening details/favorites.
- Native offline reserve replaced40 old BOOK/WATCH artwork references; no old cover/poster imports remain in reserve image map. Fifteen generic images included locally.
- Cached catalogs are normalized before display. Generic paths load from bundled images without old-media requests.
- Shared pages and metadata use the generic family; Studio automatic lookup now selects owned generic artwork, with no automatic TMDB/OpenLibrary fetch.
- New editorial BOOK/WATCH writes normalize to the owned artwork bank.
- Existing editor authentication protects a bounded five-row migration endpoint. Optimistic revisions and audit events preserved. Dry-run and retry/reconciliation supported.

Validation:300 Vitest tests; root/client TypeScript checks; offline generic-image browser smoke for film/series/book, no old cover network fetches; EN/BS Back/profile/share regression smoke; static artifact hashes.

Migration:initial serial editor writes stopped on transient503 after84 confirmed responses; subsequent reconciliation found86 committed rows. Bounded migration completed the remaining187. Private before/after snapshots and progress are retained under /workspace/shared/generic-artwork-v1, not uploaded publicly. No passwords or session cookies written to artifacts. Historical media and revisions were not deleted.

Limits:existing APK/IPA installations still carry their prior offline bundle until a new native build is distributed. No new APK/AAB/IPA or public store submission was created by this artwork rollout. Artwork replacement does not resolve separate provenance/licensing questions for text or metadata. Pending Android AdMob implementation is separate, uncommitted work; no live ads added to web/iOS.
