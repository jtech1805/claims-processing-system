# Tech Stack

## Backend

* Node.js
* TypeScript
* Express
* MongoDB
* Mongoose
* Zod
* Jest

## Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* Axios
* Lucide React

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

* totalClaims
* totalPaidOut
* totalSavedByDeductibles

---

## Policies

### Search Policy Limits

```http
GET /api/policies/limits?search=POL
```

Returns:

* policy details
* deductible remaining
* annual usage
* remaining annual limits

---

# Validation

Request validation implemented using Zod.

Validation includes:

* required fields
* invalid dates
* positive claim amounts
* non-empty line items
* structured validation responses

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
PORT=8080
MONGO_URI=mongodb://localhost:27017/claims-system
```
## Frontend `.env`
---
VITE_API_BASE_URL=http://localhost:8080
