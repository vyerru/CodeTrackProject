import { useState } from 'react'
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AdminAlert } from '@/shared/types'

const alertStyles: Record<string, string> = {
  success: 'bg-green-50 border-l-4 border-green-500 text-green-900',
  warning: 'bg-amber-50 border-l-4 border-amber-500 text-amber-900',
  info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-900',
}

function AlertIcon({ type }: { type: string }) {
  const className = 'w-5 h-5 mt-0.5 flex-shrink-0'
  switch (type) {
    case 'success': return <CheckCircle2 className={className} />
    case 'warning': return <AlertTriangle className={className} />
    case 'info': return <Info className={className} />
    default: return null
  }
}

interface Props {
  data: AdminAlert[]
}

export default function DismissibleAlerts({ data }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visible = data.filter((a) => !dismissed.has(a.id))

  if (visible.length === 0) return null

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {visible.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start justify-between gap-3 px-4 py-3 rounded-r-lg text-sm ${alertStyles[alert.type]}`}
          >
            <span className="flex items-start gap-2">
              <AlertIcon type={alert.type} />
              <span>{alert.message}</span>
            </span>
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(alert.id))}
              className="p-0.5 rounded hover:bg-black/5 transition-colors flex-shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
              aria-label="Tutup pemberitahuan"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
