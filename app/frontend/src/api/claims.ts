import api from './axios'
import type { Claim, ClaimMetrics, ClaimSummary, NewClaimPayload } from '../types'

// export const claimsApi = {
//   /** GET /api/claims/metrics/summary */
//   getMetrics: (): Promise<ClaimMetrics> =>
//     api.get<ClaimMetrics>('/api/claims/metrics/summary').then((r) => r.data),

//   /** GET /api/claims — returns lightweight summary list */
//   list: (): Promise<ClaimSummary[]> =>
//     api.get<ClaimSummary[]>('/api/claims/ledger').then((r) => r.data),

//   /** GET /api/claims/:id — returns full claim with line items */
//   getById: (id: string): Promise<Claim> =>
//     api.get<Claim>(`/api/claims/${id}`).then((r) => r.data),

//   /** POST /api/claims */
//   create: (payload: NewClaimPayload): Promise<Claim> =>
//     api.post<Claim>('/api/claims', payload).then((r) => r.data),
// }
export const claimsApi = {
  /** GET /api/claims/metrics/summary */
  getMetrics: (): Promise<ClaimMetrics> =>
    // Assuming this also has a { success, data: {...} } wrapper!
    api.get('/api/claims/metrics/summary').then((r) => r.data.data),

  /** GET /api/claims — returns lightweight summary list */
  list: (): Promise<ClaimSummary[]> =>
    // Drill down into r.data.data to return the actual array
    api.get('/api/claims/ledger').then((r) => r.data.data),

  /** GET /api/claims/:id — returns full claim with line items */
  getById: (id: string): Promise<Claim> =>
    api.get(`/api/claims/${id}`).then((r) => r.data.data),

  /** POST /api/claims */
  create: (payload: NewClaimPayload): Promise<Claim> =>
    api.post('/api/claims', payload).then((r) => r.data.data),
}