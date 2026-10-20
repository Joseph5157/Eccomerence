# Pending Product and Architecture Decisions

This is a **decision register**, not an assertion that choices have been approved. Resolve each item at the indicated gate and capture major technical decisions as an ADR.

| ID | Gate / owner | Decision required | Status |
| --- | --- | --- | --- |
| D-01 | G1 / product owner + qualified compliance reviewer | Which demo SKUs can legally be offered for sale in India, with what restrictions/claims? | PENDING |
| D-02 | G1 / product owner | Exact shipping threshold (currently claimed free over ₹499), standard/express fees, service area and returns policy | PENDING |
| D-03 | G1 / product owner | Guest checkout vs account required; invoice, tax/GST and contact/policy details | PENDING |
| D-04 | G2 / engineering | Medusa media storage and missing-image fallback strategy | PENDING |
| D-05 | G2 / engineering | Seed fixtures: idempotent developer seed or prohibited repeat seeding of non-dev data | PENDING |
| D-06 | G3–G4 / product + engineering | Guest cart identity, post-login merge and session expiry behavior | PENDING |
| D-07 | G6 / engineering | Supported Medusa v2 Razorpay provider vs custom adapter; webhook/reconciliation approach | PENDING |
| D-08 | G7 / operations | Carrier tracking, email provider, refunds and manual escalation procedures | PENDING |
| D-09 | G8 / operations | Production hosting, alerting, restore objective and launch sign-off owners | PENDING |

### Decision discipline

For each decision, record a date, alternatives, rationale, owner, risk/side effects and related PR. **Do not infer approval from a mock screen or current hardcoded behavior.** Any product/legal decision must be signed off by the responsible qualified reviewer.
