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