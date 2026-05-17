// ─── Domain Models ────────────────────────────────────────────────────────────

export type ClaimStatus = 'APPROVED' | 'PARTIAL_APPROVED' | 'REJECTED';

/**
 * A single adjudicated line item within a claim (e.g. one medication or procedure).
 * Matches MongoDB document shape with string `_id`.
 */
export interface LineItem {
  _id: string;
  serviceType: string;
  claimedAmount: number;
  approvedAmount: number;
  adjudicationReason: string;
  status: ClaimStatus;
}

/**
 * Full claim record including resolved line items.
 * Returned by GET /api/claims/:id
 */
export interface Claim {
  _id: string;
  policyId: string;
  incidentDate: string; // ISO 8601
  submittedAt: string;  // ISO 8601
  totalClaimedAmount: number;
  totalApprovedAmount: number;
  status: ClaimStatus;
  lineItems: LineItem[];
}

/**
 * Lightweight claim summary for the ledger table.
 * Returned by GET /api/claims (list endpoint).
 */
export interface ClaimSummary {
  _id: string;
  policyId: string;
  incidentDate: string;
  submittedAt: string;
  totalBilled: number;
  totalApproved: number;
  status: ClaimStatus;
}

/**
 * Insurance policy holder record.
 * Returned by GET /api/policies/:id
 */
export interface Policy {
  _id: string;
  policyId: string;
  holderName: string;
  planType: string;
  annualLimit: number;
  usedAnnualLimit: number;
  deductible: number;
  remainingDeductible: number;
}

/**
 * Aggregate KPI metrics for the dashboard header.
 * Returned by GET /api/claims/metrics/summary
 */
export interface ClaimMetrics {
  totalClaims: number;
  totalPaidOut: number;
  totalSavedByDeductibles: number;
}

// ─── Form / Payload Types ─────────────────────────────────────────────────────

/** A line item row as it exists in the submission form (amount as string for input binding). */
export interface NewLineItemForm {
  id: string; // transient key for React list rendering
  serviceType: string;
  claimedAmount: string;
}

/** Validated payload for POST /api/claims */
export interface NewClaimPayload {
  policyId: string;
  incidentDate: string;
  lineItems: {
    serviceType: string;
    claimedAmount: number;
  }[];
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}
