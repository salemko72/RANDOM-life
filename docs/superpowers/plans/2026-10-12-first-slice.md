# RANDOM first slice Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** A local, tested EAT/BOOK publication-to-SPIN workflow with an Expo Go compatible client and manual ChatGPT Content Studio.

**Architecture:** npm workspaces: apps/client (Expo), apps/studio (Vite React), packages/shared (validation and recommendation selection), services/api (Workers + D1). Content records are separate from ephemeral recommendation results. Initial anonymous/local profile is a development assumption, not a final auth decision; admin routes fail closed without a server secret. Images are staged locally and exported as static assets; no paid storage or remote deploy.

**Tech Stack:** TypeScript, Expo SDK 57 (stable npm sdk-57/latest 57.0.28), React Native, React web, Zod, Vitest, Wrangler local D1.

**Spec:** docs/handoff/READ_FIRST_LATEST_DECISIONS.md and documents 00–06; latest direct user request authorizes development.

## Global Constraints
- Existing salemko72/RANDOM-life only; existing isolated checkout, no new worktree.
- $0 additional costs; no paid services, OpenAI API, R2 or Queue activation, EAS paid builds or remote deployment.
- Existing D1 random-test-content, d47c89e2-e2ab-42fd-be29-dce5ba809b6d, CONTENT_DB; migrations execute locally only here.
- Minimum 50+50 approved valid published records is the external test release gate, not something fabricated through demo data.
- Expo Android/iOS, web preview and Expo Go; native physical-device validation must be reported separately.
- Manual ChatGPT prompt → JSON/image import → review → approve/publish/unpublish.

## Review Focus
- Unknown allergens and missing bibliographic verification must block publication.
- Empty catalog or exhausted exclusion set must return an explicit fallback.
- Unauthorized admin requests and missing secret must never expose drafts.
- Editing approved content must remove approval and public visibility.
- Local image staging must not be misrepresented as cloud upload or cross-device availability.

### Task 1: Validated content and recommendation contract
Files: packages/shared/src/content.ts, engine.ts, demo.ts, tests/content.test.ts.
Interfaces: ContentInput discriminated by EAT/BOOK; validatePublication(item), selectRecommendation(items, context, random) return one eligible record or null.
- [x] Tests first: invalid recipes/books rejected; draft/allergen/language filters; exclusion exhaustion; repeated sampling terminates.
- [x] Observe failing tests, implement types/validation and deterministic injectable RNG.
- [x] Run complete suite and record result.

### Task 2: D1 editorial API
Files: services/api/src/index.ts, migrations/0001_content.sql, wrangler.jsonc, tests/api.test.ts.
Interfaces: public GET /health, GET /catalog, POST /spin; protected GET/POST /admin/content, PUT /admin/content/:id, POST /admin/content/:id/publish or /unpublish. Shared content validation; D1 rows store JSON plus editorial fields; each state change and revision atomically batched.
- [x] Tests first with local Worker/D1: fail closed, valid import → review/publish → catalog/SPIN → edit/unpublish; invalid JSON and blocked publication; duplicate import is idempotent.
- [x] Implement and apply local migrations; never --remote in this task.
- [x] Run integration suite against local D1 and verify database configuration ID.

### Task 3: Expo app and manual Studio
Files: apps/client/App.tsx, src/api.ts, apps/studio/src/App.tsx, styles.css, prompt.ts, tests/prompt.test.ts.
- [x] Scaffold Expo pinned stable SDK; install SDK-matched React/native/web dependencies.
- [x] Client: category, preferences, one SPIN, details and Spin Again, loading/error/empty states; demo mode clearly identified until API supplied.
- [x] Studio: local token input in memory, standardized ChatGPT prompt, JSON import, image staging/optimization/download, source/rights review, draft/review/publish/unpublish, counts and failure preservation.
- [x] Typecheck, web build and Expo dependency compatibility checks.

### Task 4: Reusable development and verification
Files: README.md, docs/DEVELOPMENT.md, .github/workflows/ci.yml, scripts/smoke.mjs, docs/PROGRESS.md.
- [x] Start local API and Studio; functional publication and selection requests; build Expo web bundle.
- [x] Provide frozen npm install, local database migration, secret setup without embedded keys, Windows PowerShell and Expo Go LAN instructions.
- [x] Record passed checks and explicit limits: no remote migration/deploy, no phone test in cloud, no 50+50 catalog yet, final auth pending.

## Execution decisions
User explicitly requested beginning development; execute inline without a new approval round. Local API token is a development-only guard, not final production RBAC. No URL fetching in the manual import slice; sources are reviewed inputs, so no crawler or SSRF surface is introduced. Preserve the source ZIP outside tracked files; copied documents exclude founder CSV.
