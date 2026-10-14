# Preview 0.16

Studio now uses one PUBLISH/save button. Verified records become public; records awaiting verification are saved in Studio and remain hidden from users. Safe ZIP formatting errors are repaired automatically, preserving the original JSON for recovery. Invalid archives, missing factual content and conflicting database updates still require attention; they are not silently accepted. Review details are collapsed instead of repeated as warnings.

Export database ZIP includes saved records and available image files; JSON export includes records and image metadata only. Import previews additions, updates and conflicts, preserves IDs and checks record versions. Changed records require fresh human verification. Unchanged records retain approval. Import is atomic and checks that the library has not changed since the preview. This is the local browser library, not cloud synchronization. Keep an exported ZIP backup before editing in another tool.

Result surfaces expose more of MOVE/GO photos where text length permits. Action prefixes use regular Libre Baskerville; item titles use bold. Shadows are stronger. Expo embeds this preview and extends its warm background, with safe-area offsets for controls. Android/iOS bundles are checked; device rendering must still be confirmed on a phone.

Validation: TypeScript, unit tests, one-action publication and automatic ZIP repair, image-inclusive exchange, version conflicts, bilingual UI and touch scrolling.
