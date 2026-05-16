# Domain Model

## Policy

Represents insurance coverage configuration.

Responsibilities:
- defines covered service types
- stores deductible information
- enforces annual coverage limits
- defines exclusions
- determines policy validity period

Relationships:
- one policy can have many claims

---

## Claim

Represents a submitted insurance reimbursement request.

Responsibilities:
- groups line items
- tracks adjudication lifecycle
- stores total claimed and approved amounts
- maintains final claim decision

Lifecycle:
DRAFT → SUBMITTED → PROCESSING → APPROVED / PARTIAL_APPROVED / REJECTED

Relationships:
- belongs to one policy
- contains embedded line items

---

## Claim Line Item

Represents an individual medical/service expense under a claim.

Responsibilities:
- stores service type and claimed amount
- tracks approval decision
- stores adjudication explanation

Relationships:
- embedded within claim
- evaluated independently during adjudication

---

## Adjudication Engine

Responsible for claim decisioning.

Responsibilities:
- validates coverage eligibility
- checks exclusions
- applies deductible
- validates annual limits
- generates approval/rejection explanations
- determines final claim status