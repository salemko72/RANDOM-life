# RANDOM demo 0.4

User request: move result badges (time/difficulty/servings or book/watch metadata) into a vertical column to the right of the title, as marked in the supplied screenshot.

Result title and metadata now share a normal-flow two-column grid. Summary and author follow below the entire row. Badge positioning no longer overlaps the description; the copy panel adjusts its top position to available card height. Titles are no longer truncated to three lines. EAT, LEARN and WATCH use the same result layout. Detailed recipe panels and selection rules are unchanged.

Validation: typecheck passed. The browser geometry smoke checked all fifteen demo results at 390x844, 390x740, 751x892 and 1280x1080: badges sit right of title, badges are vertically stacked, copy does not overlap actions, and there is no horizontal page overflow. Musaka screenshots were inspected against the user's annotation. Updates deploy to the existing static Pages project random-life-preview on the same canonical URL.
