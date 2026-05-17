import { FileText, DollarSign, ShieldCheck } from 'lucide-react'
import { useClaimsMetrics } from '../../hooks/useClaims'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function KPICardSkeleton() {
  return (
    <div className="rounded-xl border border-surface-border bg-surface p-5 flex flex-col gap-3">
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-8 w-40 rounded" />
      <div className="skeleton h-2.5 w-16 rounded" />
    </div>
  )
}

// ─── Single KPI Card ──────────────────────────────────────────────────────────

interface KPICardProps {
  label: string
  value: string
  subtext: string
  icon: React.ReactNode
  accentClass: string
  bgClass: string
}

function KPICard({ label, value, subtext, icon, accentClass, bgClass }: KPICardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-surface-border bg-surface p-5 transition-all hover:border-surface-border/80 hover:bg-surface-raised">
      {/* Background accent glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${bgClass}`} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-widest text-slate-500 font-display">
            {label}
          </span>
          <span className={`font-mono text-3xl font-semibold tabular-nums ${accentClass}`}>
            {value}
          </span>
          <span className="text-xs text-slate-500 mt-1">{subtext}</span>
        </div>
        <div className={`shrink-0 rounded-lg p-2.5 ${bgClass} ${accentClass} border border-surface-border`}>
          {icon}
        </div>
      </div>

      {/* Bottom accent rule */}
      <div className={`absolute bottom-0 left-0 right-0 h-px ${accentClass.includes('teal') ? 'bg-gradient-to-r from-transparent via-accent/40 to-transparent' : accentClass.includes('green') ? 'bg-gradient-to-r from-transparent via-status-approved/40 to-transparent' : 'bg-gradient-to-r from-transparent via-amber-400/40 to-transparent'}`} />
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function KPICards() {
  const { data: metrics, isLoading, isError } = useClaimsMetrics()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
      </div>
    )
  }

  if (isError || !metrics) {
    return (
      <div className="rounded-xl border border-status-rejected/30 bg-status-rejected-bg px-4 py-3 text-sm text-status-rejected">
        Failed to load metrics — check API connectivity.
      </div>
    )
  }

  const cards: KPICardProps[] = [
    {
      label: 'Total Claims',
      value: metrics.totalClaims?.toString(),
      subtext: 'Adjudicated this period',
      icon: <FileText size={18} strokeWidth={1.5} />,
      accentClass: 'text-accent',
      bgClass: 'bg-accent-glow',
    },
    {
      label: 'Total Paid Out',
      value: formatUSD(metrics.totalPaidOut),
      subtext: 'Net approved disbursements',
      icon: <DollarSign size={18} strokeWidth={1.5} />,
      accentClass: 'text-status-approved',
      bgClass: 'bg-status-approved-bg',
    },
    {
      label: 'Saved by Deductibles',
      value: formatUSD(metrics.totalSavedByDeductibles),
      subtext: 'Deductible offset applied',
      icon: <ShieldCheck size={18} strokeWidth={1.5} />,
      accentClass: 'text-amber-400',
      bgClass: 'bg-amber-400/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} />
      ))}
    </div>
  )
}
