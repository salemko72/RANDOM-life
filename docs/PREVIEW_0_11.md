# Preview 0.11

Website/inspiration input and ChatGPT prompt creation are visible again: the prompt builder opens by default, while ZIP remains the only new-content intake.

Base browser & editor is accessible from the sidebar and the main mode toolbar. First choose EAT, READ, WATCH, MOVE or GO. Only saved records in that category appear, in a three-column desktop card grid (two columns on narrower screens, one on mobile). Each card has its image at the top, title, summary, editorial status, language availability and version. Search stays within the selected category. Drafts, review items and published records are all included; built-in app examples are not silently copied into the local editorial database.

Opening a card loads the existing record into the editor with its ID/version retained for updates. Category selection in the browser does not reset the editor or library. ZIP and existing library access continue to work. Imported image Blob URLs are loaded from the existing IndexedDB media store and released on unmount. Missing media shows an explicit placeholder.

The preview library remains local to the browser and address; no remote database writes or paid services are enabled.
