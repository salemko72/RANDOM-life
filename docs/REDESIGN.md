# Reference-driven interactive preview

Latest user instruction authorizes direct correction without another sketch/approval cycle. Focus is browser preview for now; Expo Go now embeds this same preview in a local WebView, and this iteration must not be presented as a completed native redesign.

Reference 1: large left-offset six-sector wheel, warm ivory/blush card, persistent right category rail. Reference 2: organic food photograph, serif action/title, muted sans body, floating detail/ingredient panel. Reference 3: reading recommendation, serif title and editorial image with same persistent rail.

- Categories: EAT, MOVE, WATCH, GO, DO, LEARN. Only EAT and LEARN can be selected as final results. User confirmed LEARN means books and reading; internal validated content category stays BOOK.
- Home shows wheel immediately. Spin accelerates then decelerates over about 4.8 seconds; pointer/category highlight tracks actual rotation. Ends on an enabled sector and transitions directly to content.
- First demo EAT is Mercimek čorbasi. Reading starts with Sapiens. No fabricated ratings, ISBN or claims about a real edition.
- Persistent category rail and Spin Again on results. Soft overlay panels and cross-fade/slide transitions; reduced-motion support.
- Fonts: DM Serif Display and Manrope; original reference palette, float/shadows, curved photography. Photos are newly generated preview assets, not copied book covers or extracted mockup screenshots.
- Preview sign-in is an explicitly labelled local guest profile, not a pretend authenticated account. Final production auth remains unimplemented.
- Content Studio linked from web preview. Full local D1 Studio remains intact; standalone preview adapter stores editorial drafts/media locally with human publish validation and no API fees.
- Deliver a real interactive self-contained HTML preview as well as the Expo browser code. No account, paid hosting, R2, OpenAI API or deployment activation.

Validation: wheel landing geometry/disabled sector tests, local Studio publication and edits, browser full flow incl. login/profile, first soup, Learn, Spin Again, detail panels, Studio return, narrow viewport and reduced motion. Existing API/domain suite remains mandatory.
