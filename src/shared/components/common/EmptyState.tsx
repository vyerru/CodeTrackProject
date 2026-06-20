import { Inbox } from 'lucide-react'

interface Props {
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({
  title = 'Tidak ada data',
  description = 'Belum ada konten yang tersedia saat ini.',
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
