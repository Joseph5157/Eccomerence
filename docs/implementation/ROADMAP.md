# Medistore — Gap Closure Roadmap

**Repository:** Joseph5157/Eccomerence  
**Audit baseline:** `main` @ `3b88e45f11e2c45495c78a96ab0d29e8b54d04fd` (2026-10-19)  
**Plan date:** 2026-10-20  
**Status:** Proposed; planning documents only, implementation not started.

## Goal and release boundary

Convert the existing Next.js 15 + Medusa v2 demonstration store into a reliable, maintainable India/INR single-store commerce application. **Keep the existing stack and visual language.** Prioritize verified commerce operations over additional features. This roadmap is based on source inspection, not a runtime, security, payment or regulatory certification.

**Hard no-go:** No real customer payments or production order intake until authenticated checkout, server-authoritative totals, payment reconciliation, product sale eligibility, operational recovery and launch acceptance are complete.

## Confirmed starting gaps

- Checkout uses a simulated Razorpay function and generates a fake order reference, with no verified Medusa order.
- Cart stores item prices/quantities in browser localStorage rather than a Medusa cart.
- Catalog may silently fall back to demo products on Medusa errors; absent calculated variant prices are mapped to zero.
- Product pages say shipping is free above ₹499, but checkout always adds ₹40; backend seed has ₹40/₹90 methods.
- Customer auth proxy and account pages exist, but recovery, edge cases, rate limits and integration tests have not been established.
- Seed creates demo stock and store resources; repeat-safety needs verification.
- No application tests or GitHub Actions workflow were found; the backend Jest configuration references a missing setup file.
- The `main` branch was found unprotected at audit time.

## Non-negotiable working agreement

1. Documentation first, then **one gate at a time**.
2. Each gate is implemented on its own branch and reviewed via pull request; no direct implementation pushes to `main`.
3. Every gate includes automated tests or explicit documented reasons a test is manual, plus negative-path checks.
4. Update `CURRENT_STATE.md`, `GATE_LEDGER.md`, `TEST_MATRIX.md` and relevant ADRs within the same PR.
5. No gate is accepted merely because code is written; recorded evidence and **explicit owner approval** are required.
6. The implementation agent stops at the gate boundary; it must not start the next gate automatically.
7. Avoid visual redesign, marketplace, loyalty, subscriptions, PWA and other scope expansion unless separately approved.

See `AGENT_PROTOCOL.md` for the execution contract.

## Dependency path

`P0 Documentation → G0 Baseline & CI → G1 Operating Rules & Sale Eligibility → G2 Catalog → G3 Identity → G4 Cart → G5 Checkout → G6 Payments → G7 Order Operations → G8 Release`

G1 business review may be researched alongside G0, but changes to sellable products cannot bypass G1 approval. Gate estimates are effort, **not** fixed deadlines.

| Gate | Objective | Effort (engineering days) | Exit criterion |
| --- | --- | ---: | --- |
| **P0** | Adopt versioned gate/decision/test controls | planning only | Owner reviews and accepts documentation PR |
| **G0** | Reproduce baseline and establish build, tests, CI | 3–5 | Fresh clone works; reproducible commands; checks pass in CI; blockers documented |
| **G1** | Approve sale eligibility and operating rules | 3–6 | SKU classification and shipping/tax/returns rules approved; restricted SKUs gated |
| **G2** | Make Medusa authoritative for catalog, prices, media, inventory | 5–8 | Admin edits appear correctly; no fake production catalog/₹0 unpriced items |
| **G3** | Verify and harden customer identity | 4–6 | Secure register/login/logout/recovery; auth negative paths tested |
| **G4** | Implement server-backed cart | 5–8 | Cart survives refresh and uses Medusa variants/prices/stock |
| **G5** | Implement server-authoritative checkout | 6–10 | Shipping, taxes, addresses and totals validated; payment-ready, not fake success |
| **G6** | Integrate and reconcile real Razorpay | 7–12 | Verified amount/signature/webhook, retries and idempotent paid-order result |
| **G7** | Complete order and fulfilment lifecycle | 6–10 | Customer history/tracking, admin processing, refunds and exception paths tested |
| **G8** | Harden, stage, test and approve release | 8–12 | No critical/high launch blockers; restoration/rollback and sign-offs evidenced |

**Engineering estimate:** 47–77 days (roughly 10–16 working weeks for one experienced full-stack engineer). Excludes external approval and licensing delays. Re-estimate after G0 and policy decisions.

## Gate deliverables

### G0 — Evidence-based baseline
- Record versions, environment variable contracts and reproducible boot commands.
- On clean safe-path checkout, run Postgres/Redis, migrations, seed, Medusa, Next.js, lint, type checks and production builds.
- Investigate historical `dist` substring boot crash documented in `POSTMORTEM.md`; do not assume it is resolved on every platform.
- Fix missing Jest setup; add meaningful smoke/auth/catalog tests; install CI and review protections.
- Distinguish explicit demo/test modes from production; prevent false production order/payment success.
- **Evidence:** `G0_BASELINE.md`, sanitized command outputs and CI links. **No payment or UI redesign in G0.**

### G1 — Product and operating policy
- Produce SKU classification and approval matrix; qualified business/regulatory review for India (drugs versus supplements, claims, prescriptions, licences and labels as applicable).
- Approve eligible catalog, serviceable regions, shipping fees/free threshold, tax rules, cancellations, returns, refunds and customer policies.
- **Evidence:** approved matrix and owner decisions. **Stop if legally sensitive catalog scope changes.**

### G2 — Catalog and inventory
- Typed Medusa client and explicit error states; remove silent fallback in production.
- Region-specific calculated prices, real media mapping, stock availability and variant IDs; not-for-sale state for missing price.
- Safe dev seed and tests for outage, missing price, price updates, image updates and no-stock cases.
- **Evidence:** admin-to-storefront integration tests and API contract.

### G3 — Authentication
- Integration tests for registration/login/logout/profile; duplicate accounts and partial-registration recovery.
- Rate limiting, validation, token expiry/invalidity, session cookie/CSRF review and password reset/email verification decision.
- **Evidence:** auth test suite and security review; no cross-customer profile access.

### G4 — Real cart
- Medusa cart lifecycle, region, line items and server-calculated totals; keep only safe cart reference client-side.
- Guest/signed-in cart decision, expired carts, price/stock drift, multi-tab and logout behavior.
- **Evidence:** cart integration tests on refresh, changes, failures and cross-customer access.

### G5 — Checkout
- Validated Indian shipping addresses and serviceability; approved shipping options and tax rules.
- Server-authoritative totals; eliminate ₹499/₹40 discrepancy using the **approved** policy.
- Explicit payment-pending/error states, retry behavior and duplicate-submission tests.
- **Evidence:** end-to-end payment-ready checkout against Medusa with matching totals.

### G6 — Razorpay
- ADR comparing maintained Medusa v2 payment providers versus a custom adapter.
- Server-side payment initiation, signature and webhook verification, amount/currency/order binding, idempotency and reconciliation.
- Test success, failure, cancellation, timeout, webhook replay, out-of-order notification and gateway outage.
- **Evidence:** redacted sandbox transaction IDs, runbook, tests. No live keys before readiness approval.

### G7 — Operations
- Customer order list/detail/status, authorized access, stock commits, admin fulfilment/tracking and support exceptions.
- Notifications, cancellation/returns/refunds, invoices and auditability per approved policy.
- **Evidence:** full order lifecycle tests; support/fulfilment procedures.

### G8 — Release readiness
- Full regression and browser E2E across desktop/mobile, accessibility, dependency/secrets and permission review.
- Monitoring, safe logging, backup/restore rehearsal, staging deployment, rollback rehearsal and operations runbooks.
- Business/product/regulatory sign-off, launch checklist, no unresolved critical/high release blockers.
- **Evidence:** `G8_GO_LIVE_CHECKLIST.md`, CI/staging logs, owner go/no-go decision.

## Definition of done per gate

- Acceptance criteria are met with evidence (test command, result, environment, date/commit).
- Relevant negative paths covered; risks/deviations and remaining blockers disclosed.
- Docs and tests updated within PR; reviewer checks changes.
- Owner explicitly approves gate closure and merge; `GATE_LEDGER.md` records acceptance afterward.
- Next gate begins **only** upon separate authorization.

## Risk notes

- Product classification and health claims require qualified review before sale.
- Exact Medusa/Razorpay provider compatibility must be verified during G6 design.
- Re-running seed may duplicate or mutate store data; isolate dev fixtures.
- Repeated frontend/back-end divergence threatens customer prices and inventory.
- External dependencies and operational requirements may revise estimates.

**Next allowed action after P0 approval:** start **G0 only** on `gate/g0-baseline` and measure the real local/build/test baseline.
