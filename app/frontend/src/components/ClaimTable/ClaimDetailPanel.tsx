import { useEffect } from 'react'
import {
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Minus,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { useClaimDetail } from '../../hooks/useClaims'
import type { ClaimStatus, LineItem } from '../../types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n)
}

function formatDate(iso?: string | null) {
  // 1. If the backend returns null, undefined, or an empty string, return a fallback
  if (!iso) return 'Not available';

  const date = new Date(iso);

  // 2. If the backend returns a corrupted string (like "abc"), return a fallback
  if (isNaN(date.getTime())) return 'Invalid Date';

  // 3. If it's a perfect date, format it!
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_META: Record<
  ClaimStatus,
  { Icon: React.ElementType; color: string; label: string }
> = {
  APPROVED: { Icon: CheckCircle2, color: 'text-status-approved', label: 'Approved' },
  PARTIAL: { Icon: Minus, color: 'text-status-partial', label: 'Partially Approved' },
  REJECTED: { Icon: XCircle, color: 'text-status-rejected', label: 'Rejected' },
}

function StatusBadge({ status }: { status: ClaimStatus }) {
  const { Icon, color, label } = STATUS_META[status]
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${color}`}>
      <Icon size={15} strokeWidth={2} />
      {label}
    </span>
  )
}

// ─── Line Item Card ───────────────────────────────────────────────────────────

function LineItemCard({ item }: { item: LineItem }) {
  const { Icon, color } = STATUS_META[item.status]
  const coveredPct =
    item.claimedAmount > 0
      ? Math.round((item.approvedAmount / item.claimedAmount) * 100)
      : 0

  return (
    <div className="rounded-lg border border-surface-border bg-surface-overlay p-4 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-200">{item.serviceType}</p>
          {/* <p className="font-mono text-[10px] text-slate-600 mt-0.5">
            ID: {item._id.slice(-8).toUpperCase()}
          </p> */}
        </div>
        <span className={`shrink-0 ${color}`}>
          <Icon size={16} strokeWidth={2} />
        </span>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-surface-base px-3 py-2">
          <p className="text-[10px] text-slate-600 mb-0.5">Billed</p>
          <p className="font-mono text-sm font-medium text-slate-300">
            {formatUSD(item.claimedAmount)}
          </p>
        </div>
        <div className="rounded-md bg-surface-base px-3 py-2">
          <p className="text-[10px] text-slate-600 mb-0.5">Approved</p>
          <p className={`font-mono text-sm font-medium ${item.status === 'REJECTED' ? 'text-status-rejected' : 'text-status-approved'}`}>
            {formatUSD(item.approvedAmount)}
          </p>
        </div>
      </div>

      {/* Coverage bar */}
      <div>
        <div className="flex justify-between text-[10px] text-slate-600 mb-1">
          <span>Coverage</span>
          <span className="font-mono">{coveredPct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-base overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${item.status === 'APPROVED'
              ? 'bg-status-approved'
              : item.status === 'PARTIAL'
                ? 'bg-status-partial'
                : 'bg-status-rejected'
              }`}
            style={{ width: `${coveredPct}%` }}
          />
        </div>
      </div>

      {/* Adjudication Reason */}
      {item.adjudicationReason && (
        <div className="flex gap-2 rounded-md border border-amber-400/20 bg-amber-400/5 px-3 py-2">
          <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-400" strokeWidth={2} />
          <p className="text-xs text-amber-200/80 leading-relaxed">
            {item.adjudicationReason}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="skeleton h-4 w-32 rounded" />
      <div className="skeleton h-6 w-48 rounded" />
      <div className="skeleton h-3 w-24 rounded" />
      <div className="h-px bg-surface-border my-2" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-surface-border bg-surface-overlay p-4 flex flex-col gap-3">
          <div className="skeleton h-4 w-40 rounded" />
          <div className="flex gap-2">
            <div className="skeleton h-12 flex-1 rounded-md" />
            <div className="skeleton h-12 flex-1 rounded-md" />
          </div>
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ClaimDetailPanelProps {
  claimId: string | null
  onClose: () => void
}

export function ClaimDetailPanel({ claimId, onClose }: ClaimDetailPanelProps) {
  const { data: claim, isLoading, isError, error } = useClaimDetail(claimId)

  // Close panel on Escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (claimId) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [claimId, onClose])

  if (!claimId) return null

  const totalSavings = claim
    ? claim.totalClaimedAmount - claim.totalApprovedAmount
    : null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="panel-backdrop fixed inset-0 z-40 bg-surface-base/60 animate-fade-in"
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Claim Detail"
        className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-md flex-col border-l border-surface-border bg-surface-base shadow-2xl animate-slide-in-right"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-400">
              Claim Detail
            </h2>
            {claim && (
              <p className="font-mono text-xs text-slate-600 mt-0.5">
                #{claim._id.slice(-12).toUpperCase()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:text-slate-200 hover:bg-surface-overlay transition-all"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && <DetailSkeleton />}

          {isError && (
            <div className="p-6 flex items-center gap-2 text-sm text-status-rejected">
              <XCircle size={16} />
              <span>{(error as Error).message ?? 'Failed to load claim detail.'}</span>
            </div>
          )}

          {claim && (
            <div className="flex flex-col gap-0">
              {/* Claim summary header */}
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Policy ID</p>
                    <span className="rounded-md border border-surface-border bg-surface-overlay px-2.5 py-1 font-mono text-sm text-accent">
                      {claim.policyId}
                    </span>
                  </div>
                  <StatusBadge status={claim.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] text-slate-600 mb-1 uppercase tracking-wider">Incident Date</p>
                    <p className="font-mono text-xs text-slate-300">{formatDate(claim.incidentDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600 mb-1 uppercase tracking-wider">Submitted</p>
                    <p className="font-mono text-xs text-slate-300">{formatDate(claim.submittedAt)}</p>
                  </div>
                </div>

                {/* Financial summary */}
                <div className="rounded-xl border border-surface-border bg-surface-overlay p-4 grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-600 mb-1">Billed</p>
                    <p className="font-mono text-sm font-semibold text-slate-200">
                      {formatUSD(claim.totalClaimedAmount)}
                    </p>
                  </div>
                  <div className="text-center border-x border-surface-border">
                    <p className="text-[10px] text-slate-600 mb-1">Approved</p>
                    <p className="font-mono text-sm font-semibold text-status-approved">
                      {formatUSD(claim.totalApprovedAmount)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-600 mb-1">Saved</p>
                    <p className="font-mono text-sm font-semibold text-amber-400">
                      {formatUSD(totalSavings ?? 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Line items */}
              <div className="border-t border-surface-border px-6 py-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-display text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Line Items
                  </span>
                  <span className="rounded-full bg-surface-overlay border border-surface-border px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                    {claim.lineItems.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {claim.lineItems.length === 0 ? (
                    <p className="text-xs text-slate-600 text-center py-4">
                      No line items found.
                    </p>
                  ) : (
                    claim.lineItems.map((item) => (
                      <LineItemCard key={item._id} item={item} />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-surface-border px-6 py-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <Clock size={10} />
            Auto-refreshes on next navigation
          </span>
          {claim && (
            <button className="flex items-center gap-1 text-[11px] text-accent hover:text-accent/80 transition-colors">
              <ExternalLink size={11} />
              Export
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
