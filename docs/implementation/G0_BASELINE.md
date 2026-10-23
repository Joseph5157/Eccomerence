# G0 — Reproducible Baseline Checklist

**Status: NOT STARTED.** These are commands and intended checks, **not claims that they have run or passed**.

## Inputs to freeze

- Repository: `Joseph5157/Eccomerence`; starting audit SHA `3b88e45f11e2c45495c78a96ab0d29e8b54d04fd`.
- Frontend: Next.js 15 / React / TypeScript / Tailwind, app router.
- Backend: Medusa v2 / PostgreSQL / Redis; Docker Compose for local services.
- Previous incident: `POSTMORTEM.md` documents a Medusa start failure when an ancestor path contained the substring `dist`. Use a safe local directory such as `medi-store` and record whether the behavior still reproduces.

## Work plan (execute only after P0 approval and G0 authorization)

1. Verify clean git checkout and versions (`node --version`, `npm --version`, Docker status). Record OS, Node and path. Never use real secrets in evidence.
2. Start development dependencies using `cd backend && docker compose up -d`; copy non-secret sample environment to local ignored file and replace example secrets with local random values.
3. Run `npm ci`, `npm run db:migrate`, `npm run seed`, and `npm run dev` in backend. Verify actual database products and admin/API connectivity; capture redacted output.
4. In frontend, configure local Medusa backend URL and publishable key, then run `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run dev`. Confirm products come from Medusa, not `fb-` fallback IDs.
5. Run the backend production build and the existing test scripts. Investigate whether Jest fails on the missing `integration-tests/setup.js` path; **fix only with evidence**, and add minimally useful tests.
6. Establish CI checks for frontend lint/typecheck/build, backend build/tests and appropriate integration smoke. Require a clean, repeatable result before proposing protection requirements.
7. Review dev vs production behavior so fake payment confirmation cannot be reachable for real commerce.
8. Produce sanitized command logs, known-issues list, reproducibility instructions, explicit skip reasons and the G0 PR. Update `CURRENT_STATE.md`, `TEST_MATRIX.md` and `GATE_LEDGER.md`.

## Gate exit checklist

- [ ] A second clean checkout follows the instructions successfully.
- [ ] Frontend build, type check and lint recorded PASS with evidence.
- [ ] Backend build and at least one meaningful smoke/integration test recorded PASS.
- [ ] Catalog returns genuine Medusa product IDs; fallback limitations documented.
- [ ] Missing Jest setup and other test infrastructure gaps either fixed or explicitly blocked.
- [ ] GitHub CI and proposed required branch checks demonstrably work.
- [ ] Secret handling is safe; credentials excluded from logs/commits.
- [ ] G0 PR reviewed with reviewer/owner approval.
- [ ] Gate closure appended to ledger; next gate remains NOT STARTED.

## Explicit exclusions

Do not build real payment, cart, shipping, catalog redesign or extra pages in G0. Do not alter customer production data. Any newly identified urgent security risk must be surfaced and separately scoped/approved.

## Execution evidence template

```text
Date/time:
Commit and environment:
Command:
Result/exit status:
Expected vs observed:
Evidence link / redacted log:
Reproduction steps:
Disposition (fixed/blocker/deferred):
```

**G0 is not approved or underway until the owner authorizes it.**
