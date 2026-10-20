# Test and Acceptance Matrix

**Baseline:** source audit of `main` at `3b88e45`. Tests here are **planned**, not executed or passed. Each gate PR updates specific row status, test location, command, environment, result, commit and evidence link.

Status vocabulary: `NOT RUN`, `PASS`, `FAIL`, `BLOCKED`, `N/A (reason)`. This matrix is not a substitute for raw test output.

| ID | Gate | Scenario / expected behavior | Verification type | Status |
| --- | --- | --- | --- | --- |
| T00-01 | G0 | Clean clone: database, Redis, migrations, seed, Medusa and Next.js boot using documented commands | manual + integration | NOT RUN |
| T00-02 | G0 | Frontend production build, TypeScript and lint exit successfully | CI automated | NOT RUN |
| T00-03 | G0 | Backend build, test runner and smoke suite work without missing setup files | CI automated | NOT RUN |
| T00-04 | G0 | Auth login/registration and catalog smoke hit real Medusa (not fallback) | integration | NOT RUN |
| T00-05 | G0 | Test/demo modes cannot report real payment success in production | automated + manual review | NOT RUN |
| T01-01 | G1 | Every enabled SKU has documented sellability/classification decision | business review | NOT RUN |
| T01-02 | G1 | Shipping, tax, returns, policies and special product restrictions signed off | business review | NOT RUN |
| T02-01 | G2 | Backend outage/invalid API key does not silently display demo stock in production | integration | NOT RUN |
| T02-02 | G2 | Missing calculated price never becomes purchasable ₹0 | integration | NOT RUN |
| T02-03 | G2 | Admin updates image, visibility, price or stock; storefront reflects change | integration + manual | NOT RUN |
| T02-04 | G2 | Seed can be repeated safely or is blocked outside resettable dev DB | integration | NOT RUN |
| T03-01 | G3 | Register/login/logout/refresh/profile work and unauthorized profile reads are denied | integration | NOT RUN |
| T03-02 | G3 | Duplicate/partial registration, weak password, expired token and backend outage behave safely | integration | NOT RUN |
| T03-03 | G3 | Password recovery, abuse protection, session and CSRF controls verified | security + integration | NOT RUN |
| T04-01 | G4 | Cart persists across refresh with actual Medusa line items and totals | integration + E2E | NOT RUN |
| T04-02 | G4 | Updated price/out of stock/expired cart/multi-tab are handled safely | integration | NOT RUN |
| T04-03 | G4 | Other customers cannot access or mutate a cart they do not own | security + integration | NOT RUN |
| T05-01 | G5 | Cart totals match approved shipping/tax logic including ₹499 threshold decision | integration | NOT RUN |
| T05-02 | G5 | Invalid/unserviceable address or unavailable shipping blocks checkout | integration | NOT RUN |
| T05-03 | G5 | Double submit or stale checkout never creates a false confirmed order | integration + E2E | NOT RUN |
| T06-01 | G6 | Correct test gateway payment yields one verified paid order | sandbox integration | NOT RUN |
| T06-02 | G6 | Failed/cancelled/browser-close/timeout never yield false paid success | sandbox integration | NOT RUN |
| T06-03 | G6 | Forged or repeated webhook/amount mismatch/out-of-order event handled idempotently | security integration | NOT RUN |
| T07-01 | G7 | Customer sees only their own order details and events | integration | NOT RUN |
| T07-02 | G7 | Paid → fulfill → track → refund/cancel as permitted, with audit trail | integration + E2E | NOT RUN |
| T08-01 | G8 | Desktop/mobile checkout keyboard, focus, accessibility and functional E2E | browser E2E | NOT RUN |
| T08-02 | G8 | Database backup restore and rollback rehearsal complete | manual operations | NOT RUN |
| T08-03 | G8 | Security, policy, monitoring and release sign-offs recorded | owner/reviewer | NOT RUN |

## Per-test evidence record

```text
Test ID:
Gate/PR/commit:
Automated file or manual procedure:
Command:
Environment / services:
Result: PASS | FAIL | BLOCKED | N/A
Evidence: CI URL or redacted log
Follow-up issue:
```

**Rules:** Test failures block affected gate closure. When a test is not relevant, write the reason and reviewer approval, rather than marking it passed. Do not store credentials, personal addresses or unredacted gateway traces.
