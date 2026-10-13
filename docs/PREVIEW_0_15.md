# Preview 0.15

Scroll indicators for detail content, result copy and floating panels use a thin warm translucent thumb, transparent track and no native arrow buttons. Touch panning and existing vertical scrolling remain unchanged.

Base browser mode uses the full viewport width, hides the editorial sidebar and counters, and compacts its header. Category selection still comes first. Desktop widths1200px+ use6 columns; narrower layouts use4/3/2/1 columns. Card images are106px high on desktop and90px on mobile, while review images and original stored media remain unchanged. Cards retain the warm light surface; built-in atlas scenes keep their proportions and hidden accessibility descriptions do not overlay photographs.

Verified: TypeScript and build; browser test confirms full-width1440px layout,6 columns,106px images,390px mobile2-column grid without horizontal overflow and opening a card in the regular editor. Existing all5-category touch-scroll/drawer/language browser check also passes. No data migration or paid service changes.
