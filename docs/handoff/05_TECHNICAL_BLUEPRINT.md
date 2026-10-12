# Technical Blueprint — prijedlog, NIJE zaključena tehnologija

## A. Logička arhitektura
```
User app (mobile-first; PWA vs native OPEN)
          │
          ▼
Authenticated/anonymous public API ─► Decision Engine ─► Published Catalog + Profile + History
          │
          └─────────────────────────────────────────────────┐
                                                            │
Content Studio (private admin web) ─► Admin API ─► Content DB / Media storage
                                           │
                                           ├─► Source ingestion / metadata lookups
                                           ├─► OpenAI structured data + image generation
                                           └─► Image transforms + moderation/review jobs
```

## B. Tehnologije koje treba procijeniti
- GitHub: jedan repozitorij/monorepo (npr. `apps/client`, `apps/studio`, `packages/shared`, `services/api`, `docs`), PR-ovi, history, issues. Ne praviti bez naloga.
- Cloudflare račun postoji. Predloženi hosting: Pages ili Workers + API Workers; R2 za slike, D1 za relacione sadržajne podatke. Procijeniti ima li smisla za auth, redove poslova, ugrađenu analitiku i migracije. Supabase je alternativa; odluka OPEN.
- OpenAI API: ekstrakcija, normalizacija, urednički tekst, klasifikacija, generisanje slika; server-side key.
- Klijentska platforma: PWA je razuman **prijedlog** za testere, ali osnivači nisu izabrali PWA/native.

## C. Predloženi bounded contexts / entiteti
`users`, `profiles`, `profile_preferences`, `profile_constraints`, `content_items`, `recipe_details`, `book_details`, `content_sources`, `taxonomy_tags`, `item_tags`, `media_assets`, `editorial_revisions`, `publication_events`, `spin_events`, `recommendation_exposures`, `feedback_events`, `favorites`.

Decision vs content razdvajanje je OPEN. Ako se uvede `decision_templates` ili `recommendations`, neka jasna veza na content item bude eksplicitna. Schema evolucija / migracije i seed test podaci obavezni.

## D. Endpoints (SUGGESTED)
Public: `GET /catalog/{category}` (ako zaista potreban), `POST /spin`, `POST /feedback`, `POST /favorites`, `GET /history`, `GET/PATCH /profile`, `GET /content/{id}`.
Admin: `POST /imports/recipe`, `POST /imports/book`, `GET/POST/PATCH /admin/content`, `POST /admin/content/{id}/generate-image`, `POST /admin/content/{id}/publish`, `POST /admin/content/{id}/unpublish`, `GET /admin/jobs/{id}`.

**Ne implementirati sve nabrojano po automatizmu**; to je kandidat za API plan nakon product flow odluka.

## E. Decision engine pseudocode
```
require request.context and optional profile
candidate_set = all PUBLISHED items in chosen permitted category/categories
eligible = hard_filter(candidate_set, safety_constraints, confirmed_user_constraints)
ranked = score(eligible, profile, context, item_quality, recency, diversity, fatigue)
selected = controlled_sample(top_relevant(ranked), randomness_policy)
record exposure (with consent and retention policy)
return ONE actionable recommendation + explanation + actions
```
Funkcija se testira deterministički sa seeded RNG: zabranjena hrana nikada ne prolazi, nema neobjavljenih itema, nema beskonačne petlje poslije mnogo Spin Again, hladni start radi, nema previše ponavljanja.

## F. Sigurnost i kvalitet
- Admin API svaka metoda server-side RBAC; ne oslanjati se na skriveno UI dugme.
- API rate limiting; input sanitization; zabrana SSRF pri preuzimanju web URL-ova, blok privatnih IP i nevalidnih redirecta.
- Browser CORS samo gdje treba; session/CSRF zaštita zavisno od auth rješenja; secrets odvojeni dev/staging/prod.
- Ugraditi testove parsiranja i idempotentnih importa, backend validation, migration testove, end-to-end publish i spin, UI accessibility i responsive QA.
- GDPR/privacy plan: minimalni podaci, disclosure, retention, deletion/export, minors policy, location consent; nemoj inventovati pravno odobrenje.
- AI quota, moderation, trošak po generisanju, storage/CDN bandwith i monitoring error rate.

## G. Verzije i razvojni proces
Isplanirati repo, dev/staging/prod env, Github branches/PR, migracije DB, seed dummy content, lint/test/typecheck, CI, deploy, rollback i basic monitoring. Dokumentovati setup da Salem i Ahmed mogu pratiti promjene. Ne automatski deployati na stvarnu produkciju.
