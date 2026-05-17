import { useState } from 'react'
import { Plus, Activity, RefreshCw } from 'lucide-react'
import { KPICards } from './KPICards'
import { ClaimTable } from '../ClaimTable/ClaimTable'
import { ClaimDetailPanel } from '../ClaimTable/ClaimDetailPanel'
import { SubmitClaimModal } from '../SubmitClaimModal/SubmitClaimModal'
import { useClaimsList, useClaimsMetrics } from '../../hooks/useClaims'

export function Dashboard() {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { refetch: refetchList, isFetching: isListFetching } = useClaimsList()
  const { refetch: refetchMetrics } = useClaimsMetrics()

  function handleRefreshAll() {
    void refetchList()
    void refetchMetrics()
  }

  return (
    <div className="min-h-screen bg-surface-base font-sans">
      {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-surface-border bg-surface-base/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
              <Activity size={16} className="text-accent" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-display text-sm font-700 tracking-tight text-slate-100">
                Claims Adjudication Engine
              </h1>
              <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">
                Internal — Adjusters Only
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshAll}
              disabled={isListFetching}
              className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh data"
            >
              <RefreshCw size={12} className={isListFetching ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-1.5 text-xs font-semibold text-slate-900 hover:bg-accent/90 active:scale-95 transition-all shadow-lg shadow-accent/20"
            >
              <Plus size={14} strokeWidth={2.5} />
              New Claim
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="mx-auto max-w-screen-2xl px-6 py-6 space-y-6">

        {/* Section label */}
        <div className="flex items-center gap-3">
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Period Overview
          </span>
          <div className="flex-1 h-px bg-surface-border" />
        </div>

        {/* KPI Metrics */}
        <KPICards />

        {/* Section label */}
        <div className="flex items-center gap-3 pt-2">
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Claims Ledger
          </span>
          <div className="flex-1 h-px bg-surface-border" />
        </div>

        {/* Claims table */}
        <ClaimTable onSelectClaim={(id) => setSelectedClaimId(id)} />
      </main>

      {/* ── Slide-out Detail Panel ────────────────────────────────────── */}
      <ClaimDetailPanel
        claimId={selectedClaimId}
        onClose={() => setSelectedClaimId(null)}
      />

      {/* ── New Claim Modal ───────────────────────────────────────────── */}
      {isModalOpen && (
        <SubmitClaimModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
