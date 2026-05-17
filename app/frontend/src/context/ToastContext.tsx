import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import type { Toast, ToastType } from '../types'

// ─── Context ──────────────────────────────────────────────────────────────────

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = `toast-${++counterRef.current}`
      setToasts((prev) => [...prev, { id, type, title, message }])
      // Auto-dismiss after 4.5 s
      setTimeout(() => dismiss(id), 4500)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Portal-style toast stack */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 w-80"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ─── Individual Toast Item ────────────────────────────────────────────────────

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const config: Record<ToastType, { icon: ReactNode; border: string; iconColor: string }> = {
    success: {
      icon: <CheckCircle2 size={16} />,
      border: 'border-status-approved/40',
      iconColor: 'text-status-approved',
    },
    error: {
      icon: <XCircle size={16} />,
      border: 'border-status-rejected/40',
      iconColor: 'text-status-rejected',
    },
    info: {
      icon: <Info size={16} />,
      border: 'border-accent/40',
      iconColor: 'text-accent',
    },
  }

  const { icon, border, iconColor } = config[t.type]

  return (
    <div
      className={`
        animate-toast-in flex items-start gap-3 rounded-lg border bg-surface-raised
        px-4 py-3 shadow-2xl ${border}
      `}
    >
      <span className={`mt-0.5 shrink-0 ${iconColor}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-100">{t.title}</p>
        {t.message && <p className="mt-0.5 text-xs text-slate-400">{t.message}</p>}
      </div>
      <button
        onClick={() => onDismiss(t.id)}
        className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}
