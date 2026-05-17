import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { claimsApi } from '../api/claims'
import type { NewClaimPayload } from '../types'

// ─── Query Key Factory ────────────────────────────────────────────────────────
export const claimKeys = {
  all: ['claims'] as const,
  metrics: () => [...claimKeys.all, 'metrics'] as const,
  lists: () => [...claimKeys.all, 'list'] as const,
  detail: (id: string) => [...claimKeys.all, 'detail', id] as const,
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Fetches aggregate KPI metrics for the dashboard header */
export function useClaimsMetrics() {
  return useQuery({
    queryKey: claimKeys.metrics(),
    queryFn: claimsApi.getMetrics,
    staleTime: 30_000,
  })
}

/** Fetches the full claims list for the ledger table */
export function useClaimsList() {
  return useQuery({
    queryKey: claimKeys.lists(),
    queryFn: claimsApi.list,
    staleTime: 15_000,
  })
}

/** Fetches a single claim's full detail (with line items) — only fires when id is set */
export function useClaimDetail(id: string | null) {
  return useQuery({
    queryKey: claimKeys.detail(id!),
    queryFn: () => claimsApi.getById(id!),
    enabled: !!id,
    staleTime: 60_000,
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Submits a new claim and invalidates the list + metrics on success */
export function useSubmitClaim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: NewClaimPayload) => claimsApi.create(payload),
    onSuccess: async () => {
      // Invalidate both the list and the metrics so the dashboard reflects the new claim
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: claimKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: claimKeys.metrics() }),
      ])
    },
  })
}
