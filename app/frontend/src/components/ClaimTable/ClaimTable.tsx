import { useState } from 'react'
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  AlertCircle,
} from 'lucide-react'
import { useClaimsList } from '../../hooks/useClaims'
import type { ClaimStatus, ClaimSummary } from '../../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

// function formatDate(iso: string) {
//   return new Intl.DateTimeFormat('en-US', {
//     month: 'short',
//     day: '2-digit',
//     year: 'numeric',
//   }).format(new Date(iso))
// }
export function formatDate(iso?: string | null) {
  if (!iso) return 'Not available'; // This stops the 1970 bug!

  const date = new Date(iso);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(date);
}
// ─── Status Pill ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ClaimStatus,
  { label: string; className: string; dot: string }
> = {
  APPROVED: {
    label: 'Approved',
    className: 'bg-status-approved-bg text-status-approved border-status-approved/20',
    dot: 'bg-status-approved',
  },
  PARTIAL: {
    label: 'Partial',
    className: 'bg-status-partial-bg text-status-partial border-status-partial/20',
    dot: 'bg-status-partial',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-status-rejected-bg text-status-rejected border-status-rejected/20',
    dot: 'bg-status-rejected',
  },
}

function StatusPill({ status }: { status: ClaimStatus }) {
  const { label, className, dot } = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

// ─── Skeleton Rows ────────────────────────────────────────────────────────────

function TableRowSkeleton() {
  return (
    <tr className="border-b border-surface-border">
      {[120, 100, 140, 120, 80].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className={`skeleton h-3 rounded`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  )
}

// ─── Sort State ───────────────────────────────────────────────────────────────

type SortKey = keyof Pick<ClaimSummary, 'submittedAt' | 'totalBilled' | 'status'>
type SortDir = 'asc' | 'desc'

function SortIcon({ col, active, dir }: { col: string; active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown size={12} className="text-slate-600" />
  return dir === 'asc'
    ? <ChevronUp size={12} className="text-accent" />
    : <ChevronDown size={12} className="text-accent" />
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ClaimTableProps {
  onSelectClaim: (id: string) => void
}

export function ClaimTable({ onSelectClaim }: ClaimTableProps) {
  const { data: claims, isLoading, isError, error } = useClaimsList()

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('submittedAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | 'ALL'>('ALL')

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }
  console.log(claims)
  // ── Derived data ────────────────────────────────────────────────────
  const filtered = (claims ?? [])
    .filter((c) => {
      const matchSearch =
        !search ||
        c.policyId.toLowerCase().includes(search.toLowerCase()) ||
        c._id.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      let cmp = 0
      if (sortKey === 'submittedAt') {
        cmp = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
      } else if (sortKey === 'totalBilled') {
        cmp = a.totalBilled - b.totalBilled
      } else if (sortKey === 'status') {
        cmp = a.status.localeCompare(b.status)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-surface-border bg-surface overflow-hidden">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-surface-border px-4 py-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search policy ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glow w-full rounded-lg border border-surface-border bg-surface-overlay pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 transition-all"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5">
          {(['ALL', 'APPROVED', 'PARTIAL', 'REJECTED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${statusFilter === s
                ? s === 'ALL'
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : s === 'APPROVED'
                    ? 'bg-status-approved-bg text-status-approved border border-status-approved/20'
                    : s === 'PARTIAL'
                      ? 'bg-status-partial-bg text-status-partial border border-status-partial/20'
                      : 'bg-status-rejected-bg text-status-rejected border border-status-rejected/20'
                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-surface-border'
                }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Row count */}
        <span className="ml-auto font-mono text-[10px] text-slate-600">
          {isLoading ? '—' : `${filtered.length} record${filtered.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Error state */}
      {isError && (
        <div className="flex items-center gap-2 px-4 py-6 text-sm text-status-rejected">
          <AlertCircle size={16} />
          <span>{(error as Error).message ?? 'Failed to load claims.'}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-overlay/50">
              {[
                { key: 'submittedAt' as SortKey, label: 'Submitted' },
                { key: null, label: 'Claim ID' },
                { key: null, label: 'Policy ID' },
                { key: 'totalBilled' as SortKey, label: 'Total Billed' },
                { key: null, label: 'Approved' },
                { key: 'status' as SortKey, label: 'Status' },
              ].map(({ key, label }) => (
                <th
                  key={label}
                  onClick={key ? () => toggleSort(key) : undefined}
                  className={`px-4 py-2.5 font-display text-[10px] font-semibold uppercase tracking-widest text-slate-500 whitespace-nowrap ${key ? 'cursor-pointer select-none hover:text-slate-300 transition-colors' : ''
                    }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {key && (
                      <SortIcon col={key} active={sortKey === key} dir={sortDir} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} />)
              : filtered.map((claim) => (
                <ClaimRow
                  key={claim._id}
                  claim={claim}
                  onSelect={() => onSelectClaim(claim._id)}
                />
              ))}

            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-600">
                  No claims match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Table Row ────────────────────────────────────────────────────────────────

function ClaimRow({
  claim,
  onSelect,
}: {
  claim: ClaimSummary
  onSelect: () => void
}) {
  return (
    <tr
      onClick={onSelect}
      className="claim-row cursor-pointer border-b border-surface-border/60 bg-transparent hover:bg-surface-overlay transition-colors"
    >
      <td className="px-4 py-3.5 font-mono text-xs text-slate-400 whitespace-nowrap">
        {formatDate(claim.submittedAt)}
      </td>
      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
        {claim._id.slice(-8).toUpperCase()}
      </td>
      <td className="px-4 py-3.5">
        <span className="rounded-md bg-surface-overlay border border-surface-border px-2 py-0.5 font-mono text-xs text-accent">
          {claim.policyId}
        </span>
      </td>
      <td className="px-4 py-3.5 font-mono text-sm font-medium text-slate-200 tabular-nums">
        {formatUSD(claim.totalBilled)}
      </td>
      <td className="px-4 py-3.5 font-mono text-sm text-slate-400 tabular-nums">
        {formatUSD(claim.totalApproved)}
      </td>
      <td className="px-4 py-3.5">
        <StatusPill status={claim.status} />
      </td>
    </tr>
  )
}
