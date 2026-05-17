import api from './axios'
import type { Policy } from '../types'

export const policiesApi = {
  /** GET /api/policies/:id */
  getById: (policyId: string): Promise<Policy> =>
    api.get<Policy>(`/api/policy/${policyId}`).then((r) => r.data),
}
