import { useCallback, useEffect, useId, useState } from 'react'
import {
  X,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import { usePolicy } from '../../hooks/usePolicy'
import { useSubmitClaim } from '../../hooks/useClaims'
import { useToast } from '../../context/ToastContext'
import type { NewLineItemForm } from '../../types'

// ─── Types & Consts ───────────────────────────────────────────────────────────

type Step = 1 | 2 | 3

const SERVICE_TYPES = [
  'Office Visit',
  'Emergency Room',
  'Hospitalization',
  'Surgery',
  'Prescription Medication',
  'Lab Work',
  'Imaging / Radiology',
  'Physical Therapy',
  'Mental Health Services',
  'Specialist Consultation',
  'Preventive Care',
  'Durable Medical Equipment',
]

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { n: 1 as Step, label: 'Context' },
    { n: 2 as Step, label: 'Details' },
    { n: 3 as Step, label: 'Submit' },
  ]

  return (
    <div className="flex items-center gap-0">
      {steps.map(({ n, label }, idx) => {
        const isDone = current > n
        const isActive = current === n

        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-all ${isDone
                  ? 'border-accent bg-accent text-slate-900'
                  : isActive
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-surface-border bg-surface-overlay text-slate-600'
                  }`}
              >
                {isDone ? <CheckCircle2 size={13} strokeWidth={2.5} /> : n}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${isActive ? 'text-accent' : isDone ? 'text-slate-400' : 'text-slate-600'
                  }`}
              >
                {label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`mx-1.5 mb-4 h-px w-10 transition-all ${current > n ? 'bg-accent' : 'bg-surface-border'
                  }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Policy Context ───────────────────────────────────────────────────

function Step1PolicyContext({
  policyId,
  onChange,
}: {
  policyId: string
  onChange: (v: string) => void
}) {
  const { data: policy, isLoading, isError } = usePolicy(policyId)

  const usedPct = policy
    ? Math.min(100, Math.round((policy.usedAnnualLimit / policy.annualLimit) * 100))
    : 0

  const deductiblePct = policy
    ? Math.min(
      100,
      Math.round(
        ((policy.deductible - policy.remainingDeductible) / policy.deductible) * 100,
      ),
    )
    : 0

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Policy ID <span className="text-status-rejected">*</span>
        </label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={policyId}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            placeholder="e.g. 6a088b92be7ba8d63dc129ae"
            className="input-glow w-full rounded-lg border border-surface-border bg-surface-overlay pl-9 pr-3 py-2.5 font-mono text-sm text-slate-200 placeholder:text-slate-600 transition-all"
          />
          {isLoading && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent animate-spin" />
          )}
        </div>
        {isError && policyId.length >= 3 && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-status-rejected">
            <AlertCircle size={12} />
            Policy not found. Verify the ID and try again.
          </p>
        )}
      </div>

      {/* Policy card — appears when loaded */}
      {policy && (
        <div className="rounded-xl border border-accent/20 bg-accent-glow p-4 flex flex-col gap-4 animate-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">Holder</p>
              <p className="text-base font-semibold text-slate-100">{policy.holderName}</p>
              <p className="font-mono text-xs text-accent mt-0.5">{policy.policyId}</p>
            </div>
            <div className="rounded-lg border border-accent/20 bg-accent/10 px-2.5 py-1">
              <p className="text-[10px] text-accent font-medium">{policy.planType}</p>
            </div>
          </div>

          {/* Annual limit progress */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Annual Limit Used</span>
              <span className="font-mono">
                {formatUSD(policy.usedAnnualLimit)} / {formatUSD(policy.annualLimit)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-surface-base overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${usedPct > 80 ? 'bg-status-rejected' : usedPct > 50 ? 'bg-status-partial' : 'bg-accent'
                  }`}
                style={{ width: `${usedPct}%` }}
              />
            </div>
            <p className="mt-1 text-right text-[10px] font-mono text-slate-600">
              {formatUSD(policy.annualLimit - policy.usedAnnualLimit)} remaining
            </p>
          </div>

          {/* Deductible */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span className="flex items-center gap-1">
                <ShieldCheck size={11} />
                Deductible Met
              </span>
              <span className="font-mono">
                {formatUSD(policy.deductible - policy.remainingDeductible)} / {formatUSD(policy.deductible)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-surface-base overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{ width: `${deductiblePct}%` }}
              />
            </div>
            <p className="mt-1 text-right text-[10px] font-mono text-slate-600">
              {formatUSD(policy.remainingDeductible)} deductible remaining
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Step 2: Claim Details ────────────────────────────────────────────────────

function Step2ClaimDetails({
  incidentDate,
  onDateChange,
  lineItems,
  onLineItemsChange,
}: {
  incidentDate: string
  onDateChange: (v: string) => void
  lineItems: NewLineItemForm[]
  onLineItemsChange: (items: NewLineItemForm[]) => void
}) {
  function addRow() {
    onLineItemsChange([
      ...lineItems,
      { id: generateId(), serviceType: SERVICE_TYPES[0], claimedAmount: '' },
    ])
  }

  function removeRow(id: string) {
    onLineItemsChange(lineItems.filter((r) => r.id !== id))
  }

  function updateRow(id: string, field: keyof Omit<NewLineItemForm, 'id'>, value: string) {
    onLineItemsChange(
      lineItems.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    )
  }

  const total = lineItems.reduce(
    (sum, r) => sum + (parseFloat(r.claimedAmount) || 0),
    0,
  )

  return (
    <div className="flex flex-col gap-5">
      {/* Incident Date */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Incident Date <span className="text-status-rejected">*</span>
        </label>
        <input
          type="date"
          value={incidentDate}
          onChange={(e) => onDateChange(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="input-glow w-full rounded-lg border border-surface-border bg-surface-overlay px-3 py-2.5 font-mono text-sm text-slate-200 transition-all [color-scheme:dark]"
        />
      </div>

      {/* Line Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-slate-400">
            Line Items <span className="text-status-rejected">*</span>
          </label>
          <span className="font-mono text-[10px] text-slate-600">
            {lineItems.length} item{lineItems.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {lineItems.map((row, idx) => (
            <div
              key={row.id}
              className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-overlay p-2"
            >
              <span className="shrink-0 font-mono text-[10px] text-slate-600 w-4">
                {idx + 1}
              </span>
              <select
                value={row.serviceType}
                onChange={(e) => updateRow(row.id, 'serviceType', e.target.value)}
                className="input-glow flex-1 min-w-0 rounded-md border border-surface-border bg-surface-base px-2 py-1.5 text-xs text-slate-200 transition-all"
              >
                {SERVICE_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="relative w-28 shrink-0">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={row.claimedAmount}
                  onChange={(e) => updateRow(row.id, 'claimedAmount', e.target.value)}
                  className="input-glow w-full rounded-md border border-surface-border bg-surface-base pl-6 pr-2 py-1.5 font-mono text-xs text-right text-slate-200 transition-all"
                />
              </div>
              <button
                onClick={() => removeRow(row.id)}
                disabled={lineItems.length === 1}
                className="shrink-0 rounded-md p-1 text-slate-600 hover:text-status-rejected hover:bg-status-rejected-bg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addRow}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-surface-border py-2 text-xs text-slate-500 hover:text-accent hover:border-accent/30 hover:bg-accent-glow transition-all"
        >
          <Plus size={13} />
          Add Line Item
        </button>
      </div>

      {/* Total */}
      {total > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-overlay px-4 py-2.5">
          <span className="text-xs text-slate-500">Total Claimed</span>
          <span className="font-mono text-sm font-semibold text-slate-100">
            {formatUSD(total)}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Step 3: Review & Submit ──────────────────────────────────────────────────

function Step3Review({
  policyId,
  incidentDate,
  lineItems,
}: {
  policyId: string
  incidentDate: string
  lineItems: NewLineItemForm[]
}) {
  const total = lineItems.reduce((s, r) => s + (parseFloat(r.claimedAmount) || 0), 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-surface-border bg-surface-overlay divide-y divide-surface-border overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-xs text-slate-500">Policy ID</span>
          <span className="font-mono text-sm text-accent">{policyId}</span>
        </div>
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-xs text-slate-500">Incident Date</span>
          <span className="font-mono text-sm text-slate-300">
            {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
              new Date(incidentDate),
            )}
          </span>
        </div>
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-xs text-slate-500">Line Items</span>
          <span className="font-mono text-sm text-slate-300">{lineItems.length}</span>
        </div>
        <div className="flex justify-between items-center px-4 py-3 bg-surface-base/50">
          <span className="text-xs font-semibold text-slate-400">Total Billed</span>
          <span className="font-mono text-base font-semibold text-slate-100">
            {formatUSD(total)}
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3">
        <p className="text-xs text-amber-200/70 leading-relaxed">
          By submitting, this claim will be queued for automated adjudication.
          Results are typically available within 2–5 minutes.
        </p>
      </div>
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface SubmitClaimModalProps {
  onClose: () => void
}

export function SubmitClaimModal({ onClose }: SubmitClaimModalProps) {
  const { toast } = useToast()
  const { mutateAsync: submitClaim, isPending } = useSubmitClaim()

  const [step, setStep] = useState<Step>(1)
  const [policyId, setPolicyId] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [lineItems, setLineItems] = useState<NewLineItemForm[]>([
    { id: generateId(), serviceType: SERVICE_TYPES[0], claimedAmount: '' },
  ])

  const { data: policy } = usePolicy(policyId)

  // Derive step validation
  const step1Valid = !!policy
  const step2Valid =
    !!incidentDate &&
    lineItems.length > 0 &&
    lineItems.every((r) => r.serviceType && parseFloat(r.claimedAmount) > 0)

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit() {
    if (!step2Valid) return
    try {
      await submitClaim({
        policyId,
        incidentDate,
        lineItems: lineItems.map((r) => ({
          serviceType: r.serviceType,
          claimedAmount: parseFloat(r.claimedAmount),
        })),
      })
      toast(
        'success',
        'Claim Submitted',
        `Claim for policy ${policyId} has been queued for adjudication.`,
      )
      onClose()
    } catch (err) {
      toast('error', 'Submission Failed', (err as Error).message)
    }
  }

  const STEP_TITLES: Record<Step, string> = {
    1: 'Policy Context',
    2: 'Claim Details',
    3: 'Review & Submit',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="panel-backdrop fixed inset-0 z-40 bg-surface-base/70 animate-fade-in"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Submit New Claim"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-lg rounded-2xl border border-surface-border bg-surface shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">

          {/* Modal header */}
          <div className="flex items-center justify-between border-b border-surface-border px-6 py-4 shrink-0">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-display text-base font-semibold text-slate-100">
                New Claim
              </h2>
              <p className="text-xs text-slate-500">{STEP_TITLES[step]}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:text-slate-200 hover:bg-surface-overlay transition-all"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex justify-center border-b border-surface-border px-6 py-4 shrink-0">
            <StepIndicator current={step} />
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {step === 1 && (
              <Step1PolicyContext policyId={policyId} onChange={setPolicyId} />
            )}
            {step === 2 && (
              <Step2ClaimDetails
                incidentDate={incidentDate}
                onDateChange={setIncidentDate}
                lineItems={lineItems}
                onLineItemsChange={setLineItems}
              />
            )}
            {step === 3 && (
              <Step3Review
                policyId={policyId}
                incidentDate={incidentDate}
                lineItems={lineItems}
              />
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between border-t border-surface-border px-6 py-4 shrink-0 gap-3">
            <button
              onClick={step === 1 ? onClose : () => setStep((s) => (s - 1) as Step)}
              className="rounded-lg border border-surface-border px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => (s + 1) as Step)}
                disabled={step === 1 ? !step1Valid : !step2Valid}
                className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-accent/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-accent/20"
              >
                Continue
                <ChevronRight size={15} strokeWidth={2.5} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-accent/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-accent/20"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} strokeWidth={2.5} />
                    Submit Claim
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
