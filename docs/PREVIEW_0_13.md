# Preview 0.13

UI shadow strength increases by 50% through dark shadow alpha, leaving white inset highlights, layout geometry and background colors intact. This covers app box/drop shadows and Studio box shadows.

BHS category display labels: HRANA, KNJIGE, GLEDAJ, POKRENI SE, IZAĐI. Canonical identifiers and stored category values remain EAT/BOOK/WATCH/MOVE/GO.

Opening a READ/WATCH/MOVE/GO recommendation displays details without an automatic complementary drawer. Its bottom action opens author titles/similar titles/activity suggestions/outgoing checklist explicitly; MOVE uses Za ovu aktivnost / For this activity. EAT retains the requested ingredients drawer.

Result titles and summaries no longer use line clamping. They scroll within their white surface. Details use a separately scrolling content area; bottom detail controls stay outside that scroll area and above the floating bottom navigation. Vertical touch panning, momentum support and overscroll containment apply to content surfaces and floating panels.

Validation: TypeScript, 96 unit/integration tests, existing browser and all 25 bilingual-demo checks; new mobile browser test injects long rendered text across all 5 categories and sends actual touchStart/touchMove/touchEnd gestures, confirms scrolling, controls/nav separation, explicit drawers and BHS rail labels. No data migration or paid service activation.
