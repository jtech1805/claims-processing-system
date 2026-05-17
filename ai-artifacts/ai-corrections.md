# AI Corrections

## Project Initialization
AI-generated setup initially missed `.gitignore`.

Added `.gitignore` to avoid committing:
- node_modules
- .env
- dist
- coverage

## Missing Incident Date

Initial AI-generated claim model omitted `incidentDate`.

This field was later added because:
- policy period validation depends on it
- filing window checks require incident timing
- adjudication workflow references incident validation

# AI Pair-Programming: Corrections & Overrides

While AI was utilized to accelerate boilerplate generation, I actively intercepted and rewrote several of its outputs regarding architecture, testing, and business logic to ensure production readiness.

## 1. Architectural Overrides
* **Scrapped OOP Bloat for a Functional Pipeline:** The AI initially suggested a heavy, class-based rules engine with a shared mutable context. I rejected this. Mutating shared state across a financial pipeline makes debugging impossible. I implemented a strict functional pipeline using pure functions to ensure deterministic outputs.
* **Corrected the Testing Strategy:** The AI attempted to write unit tests that hit a live MongoDB instance via Mongoose. I deleted this and enforced a strict boundary: pure in-memory JS objects for testing the `RulesEngine` (Unit), and an isolated `mongodb-memory-server` for the `AdjudicationService` (Integration).
* **Enforced Idempotency:** The AI originally drafted a basic `createClaim` function that blindly inserted records. I added a strict uniqueness constraint checking `[policyId, incidentDate]` to prevent network retries from double-billing the annual ledger.

## 2. Critical Logic & Database Fixes
* **Caught the Rs.0 Approval Bug:** The AI's math correctly applied the deductible, but if the deductible consumed the entire claim, it allowed the pipeline to finish and mark the item as "APPROVED" with a Rs.0 payout. I added a fail-fast guard clause to immediately mark these as `REJECTED: Applied to Deductible`.
* **Caught the Mongoose `.map()` Trap:** During policy validation, the AI used `.map()` to overwrite the `claim.lineItems` array. Overwriting Mongoose subdocuments like this destroys their internal `_id` tracking and breaks `.save()`. I intercepted this and swapped it to `.forEach()` for safe, in-memory mutation.