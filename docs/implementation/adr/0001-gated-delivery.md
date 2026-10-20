# ADR-0001 — Gate-based development and evidence-first delivery

- **Date:** 2026-10-20
- **Status:** Proposed (owner has agreed to the workflow in chat; repository acceptance pending P0 review)
- **Context:** The demonstration storefront has authentic-looking UI but does not yet implement a real paid order lifecycle. Implementing multiple domains at once would make failures hard to isolate.

## Decision

Retain Next.js and Medusa. Divide production hardening into gates P0 and G0–G8, each with a named scope, branch, test evidence, PR review and explicit owner approval. Maintain living documents: `ROADMAP.md`, `CURRENT_STATE.md`, `GATE_LEDGER.md`, `TEST_MATRIX.md` and ADRs. An implementation agent must not advance to the next gate without authorization.

## Alternatives rejected

- **Big-bang rebuild:** unnecessary change of stack and unbounded regression risk.
- **Implement payment first:** unsafe because pricing, cart, shipping and product eligibility are not yet authoritative.
- **No formal gates:** makes incomplete business rules and untested merges hard to detect.

## Consequences

- More review checkpoints and documentation work.
- Clear isolation of failures, reproducible progress and explicit ownership of acceptance.
- Schedules are estimates and will be refined from measured G0 evidence.

## Revision policy

Material changes need a subsequent ADR and owner approval; do not silently rewrite accepted decisions.
