# Agent Protocol — Controlled Gate Delivery

**Status:** Proposed in documentation PR P0. Applies to all coding agents and human contributors once accepted.

## Startup checklist for every work session

1. Read `docs/implementation/CURRENT_STATE.md` first.
2. Read the latest entry in `docs/implementation/GATE_LEDGER.md`, relevant `ROADMAP.md` gate, `TEST_MATRIX.md`, and ADRs.
3. Inspect actual repo status and latest `main` and work-branch SHAs. Never guess current progress from conversation history.
4. State gate objective, allowed files/behaviour, stop conditions and verification plan **before editing**.
5. Ensure the active gate is authorized. If not, stop with a proposed plan instead of coding.

## Execution rules

- **One prompt → one bounded gate/task.** Do not silently implement adjacent gates.
- Use a short-lived branch `gate/gN-short-name`; draft PRs are acceptable for early review.
- No force pushes to `main`, no merges without explicit owner acceptance; keep `main` protected with checks when infrastructure allows.
- Tests are expected for code behavior. Include positive, negative, integration and regression cases proportionate to the change.
- Provide evidence: command, exit status, key result, environment and known caveats; never claim unrun tests passed.
- Record relevant design choices in ADRs; business rules remain **pending** until approved by product owner.
- Keep logs and PRs free of passwords, tokens, real customer details, payment secrets and shipping PII.
- No production payments, database writes, or environment changes without separate explicit authorization.
- Prefer native Medusa workflows and existing visual components; avoid framework swaps and speculative redesigns.

## Gate closure report template

```text
Gate / branch / commit:
Scope completed:
Files changed:
Tests run (commands, pass/fail, env):
Manual evidence:
Known blockers / risks:
Test matrix rows updated:
Decision records updated:
PR URL:
Requested owner action: Review / accept / reject
Next gate: NOT STARTED
```

## No silent progression

The agent may propose the next gate after submitting evidence, but **must stop** until the owner explicitly approves the completed gate and authorizes the next one. A PR existing or tests being green does not itself close a gate.

## Scope change

If a requirement crosses a gate boundary or introduces new compliance risk, document it and request approval/re-estimation before implementation.
