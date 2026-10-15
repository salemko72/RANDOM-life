# Optional profiling and gentle recommendations

Updated 15 October 2026.

## Entry and consent

Name → explicit choice. Continue without profiling enters the app immediately. Personalize opens optional interests/context, then dietary settings. Dietary filters only skips taste questions. All three routes remember the choice locally. Behavioral learning starts off even after choosing personalization; its separate checkbox must be enabled. Profile allows changing both settings later. Declining profiling clears inferred events and taste settings, while retaining explicit dietary restrictions. Legacy profiles without the new consent field are treated as not consenting; their dietary restrictions are preserved.

Local profile data is not an authenticated account and is not uploaded to D1. Saved favorites, explicit completed items and recent-item cycling remain ordinary local app functionality, independent of taste profiling. Profiling off gives all eligible items equal taste scores and stops recording preference events.

## Hard rules

Only published content can be suggested. Explicit completed items stay excluded until unmarked. Allergies/intolerances remain hard filters. Vegan requires an explicit vegan tag; vegetarian accepts vegetarian or vegan. Low-phosphate requires a low-phosphate tag AND a human-reviewed assessment whose suitability is low. Unknown phosphate suitability is excluded for that selected regime. None of these rules are relaxed when the eligible pool is empty, during exploration, or when profiling is off. These metadata filters are not clinical guarantees.

## Soft influence

Interests, genre/topics, energy, company and preferred duration affect weights only. Preferred cooking time no longer excludes a longer meal. ENG/BHS topic names are normalized to the same concepts. Learning has a small capped effect. Final scores are bounded between 0.8 and 1.8; selection combines 70% weighted probability with 30% uniform probability within the same safe eligible pool. This is a probability mixture, not an exact quota in every ten spins.

The previous category gets a slight penalty, not an exclusion. Exposure avoidance resets independently per category, so exhausting READ never hides it while other categories still have unseen content. Explicit completed items do not reset automatically.

## Verification

Preference tests cover consent/migration, no event collection without opt-in, vegan/phosphate rules, safe exploration, mild weighting, bilingual topics and per-category cycling. `node scripts/smoke-profile-consent.mjs` exercises guest, dietary-only and personalized mobile onboarding, separate learning choice, and returning without repeated registration.
