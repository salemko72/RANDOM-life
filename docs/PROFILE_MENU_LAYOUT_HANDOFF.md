# Profile and settings popup layout —25 November2026

Branch `codex/salem-profile-action-buttons`, based on completed/uploaded1.1.1(9) branch9e5e13a. User requests clearer profile action buttons, primary menu navigation first, and category divider lines throughout both popups.

## Result

- Main menu order: LifeSpinner/title → My profile → Saved picks → Language → Measurement units → Sound effects → existing supporting text → diagnostic/build footer. Settings categories have consistent20px padding and22px separation with one thin divider. Existing overlapping bottom borders are removed where a section divider replaces them.
- Profile grouped into introduction, topics/diet restrictions, personalization/learning, statistics/Edit Answers, secondary actions, catalogue/connection, and legal links. Dividers and consistent spacing distinguish each group. Statistics use three equal columns; long names and labels wrap.
- Clear learned preferences / Delete profile & data / Ad privacy choices / Share LifeSpinner are smaller transparent black-text outline buttons in a2×2 grid, separated from Edit Answers. Native privacy remains conditional; web's three-button layout gives Share the final full-width row.
- Catalogue cache action also has a clear transparent outline button; connection rows have readable text and subtle separators. All six languages use existing translated labels. No external policy or catalogue data changed.
- All original handlers preserved: deletion confirmation, clear learned events, native privacy action and native app share. No new destructive action or preference mutation on opening a popup.

## Validation and delivery

`smoke-profile-action-layout.mjs` runs the real preview with isolated browser fixtures: six locales ×390/320px, menu DOM order, profile section lines,2×2 geometry, transparent/black styles, wrapping/no horizontal overflow, Edit spacing, clear events/delete-cancel/privacy/share handlers; native and web3-control cases. Screenshots under `/workspace/shared/profile-buttons/` are test fixtures, not real user data. Final full suite **431tests/65files PASS**, TypeScript PASS, preview PASS; all twelve native-mode browser cases and web fallback PASS. Screenshots visually reviewed; browser API is intentionally offline in fixtures, so catalogue failure indicators in test images are expected and not evidence of a production outage.

No new native build, EAS upload, TestFlight submission, DB/web deploy or merge is requested by this UI task. These changes are **not inside the already uploaded1.1.1(9)**; include the new application source in a subsequent explicitly requested build. Preserve all six languages, regional units, top detail fade, Spin-ad policy and native recovery fixes from9. Android and iOS share these web UI components.

Claims0930755/9f92d58/3395800 were pushed before each scope's implementation. GitHub PR API returned403 in previous tasks; use the compare link below if creation remains blocked, and never claim that an uncreated PR exists.
