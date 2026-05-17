## Tech Stack Decisions

### Node.js + Express
Chosen for rapid iteration and familiarity during limited assignment time.

### MongoDB
 Chosing MongoDB over a SQL database because the claims system contains flexible and deeply nested data structures such as policies, claim line items, and adjudication results. MongoDB’s document model maps naturally to this structure, enabling faster iteration, simpler backend development, and easier evolution of coverage rules without complex schema migrations or multi-table joins.

### React + Vite
Chosen for lightweight frontend setup and quick UI iteration.

### Modular Monolith
Prioritized simplicity and readability over distributed architecture.

## Embedded Claim Line Items

Embedded line items inside the Claim document instead of using a separate collection.

Reasoning:
- line items are tightly coupled to claim lifecycle
- adjudication occurs at claim level
- line items are almost always retrieved together
- MongoDB supports nested document modeling naturally
- reduced query complexity for assignment scope

Tradeoff:
- reduced normalization in favor of simpler adjudication workflow and faster implementation

## Product Decision: Audit Trails for Invalid States

The Scenario: Handling fundamentally invalid policies (e.g., isActive: false).

Standard Approach: Throwing a 400/500 error, which leaves the claim permanently stuck in "SUBMITTED" or loses the payload entirely.

Our Decision: Intercept the invalid state, mark all items as REJECTED with a clear reason, and save the final state to the database.

Business Value: Creates a mathematically complete ledger and a perfect audit trail so Customer Support is never blind when a provider calls about a failed claim.

## UI/UX Strategy: The Internal Enterprise Dashboard

Rather than building a consumer-facing "Patient Portal", I deliberately designed the frontend as an Internal Insurance Operations Dashboard (Claims Adjuster Persona). 

**Reasoning:**
1. **Data Security & Scope:** The backend APIs intentionally expose system-wide ledger data (`GET /api/claims`) and aggregated financial KPIs (`GET /api/claims/metrics/summary`). Exposing this in a consumer app would be a massive data leak. This data strictly belongs in an internal admin tool.
2. **The "Manual Entry" Workflow:** In reality, most claims arrive via automated EDI feeds. However, ops teams still require a manual entry UI for paper claims and edge cases. I built the "Submit Claim" form to serve this operational need (which also serves as a perfect UI simulator to test the rules engine).