# Insurance Claims Adjudication System

A simplified insurance claims processing backend and internal dashboard built as a take-home assignment.

---

# Tech Stack

## Backend

- Node.js
- TypeScript
- Express
- MongoDB
- Mongoose
- Zod
- Jest

## Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Lucide React

---

# Project Structure

```txt
app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validations/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── types/
    │   ├── App.tsx
    │   └── main.tsx
    │
    ├── package.json
    └── vite.config.ts
```

---

# Core Features

## Policy Management

- stores policy coverage configuration
- tracks deductible balance
- tracks annual usage limits
- defines exclusions
- validates policy active period

---

## Claim Submission

- submit claims against a policy
- supports multiple line items
- validates request payloads using Zod
- prevents duplicate claims

---

## Claims Adjudication Engine

Functional rule-based adjudication pipeline.

Rules implemented:

1. Exclusion validation
2. Coverage validation
3. Deductible application
4. Annual limit validation

Possible outcomes:

- APPROVED
- PARTIAL_APPROVED
- REJECTED

---

## Claims Ledger Dashboard

Frontend dashboard for adjusters.

Features:

- KPI summary cards
- claims ledger table
- claim status visualization
- policy limit visibility

---

# API Endpoints

## Claims

### Create Claim

```http
POST /api/claims
```

---

### Fetch Claims Ledger

```http
GET /api/claims/ledger
```

---

### Fetch Single Claim

```http
GET /api/claims/:id
```

---

### Fetch Metrics Summary

```http
GET /api/claims/metrics/summary
```

Returns:

- totalClaims
- totalPaidOut
- totalSavedByDeductibles

---

## Policies

### Search Policy Limits

```http
GET /api/policies/limits?search=POL
```

Returns:

- policy details
- deductible remaining
- annual usage
- remaining annual limits

---

# Testing

Implemented using Jest.

## Unit Tests

Covered scenarios:

- policy inactive
- incident outside coverage
- excluded service
- uncovered service
- deductible fully consumes claim
- partial approval due to annual limit
- mixed line item outcomes
- deductible + annual limit edge case
- duplicate claim
- final claim status derivation

---

## Integration Tests

Covers:

- API request lifecycle
- database persistence
- end-to-end adjudication flow

---

# Running the Project

## Backend

```bash
cd backend
npm install
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

## Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/claims-system
```

---

## Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8080
```


Out of assignment scope but realistic:

- authentication
- role-based access
- pagination
- claim attachments
- manual review queues
- asynchronous adjudication
- audit logs
- appeal workflows
- payment integration
- policyholder portal

---

# Assignment Scope Philosophy

The system intentionally prioritizes:

- domain correctness
- readability
- explainability
- practical workflows
- manageable implementation scope

instead of enterprise-scale architecture.

