import { useQuery } from '@tanstack/react-query'
import { policiesApi } from '../api/policies'

export const policyKeys = {
  all: ['policies'] as const,
  detail: (id: string) => [...policyKeys.all, id] as const,
}

/**
 * Fetches a policy by policyId string.
 * Only fires when policyId is a non-empty string of at least 3 chars
 * to avoid firing on every keystroke.
 */
export function usePolicy(policyId: string) {
  return useQuery({
    queryKey: policyKeys.detail(policyId),
    queryFn: () => policiesApi.getById(policyId),
    enabled: policyId.trim().length >= 3,
    staleTime: 5 * 60_000, // Policy data is relatively stable
    retry: false,           // Don't retry 404s — just show "not found"
  })
}
