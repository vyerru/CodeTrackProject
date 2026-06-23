import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import type { AdminRevenueDataPoint } from '@/shared/types'

type RangeKey = '7D' | '30D' | '3M' | '1Y'

const ranges: { key: RangeKey; label: string }[] = [
  { key: '7D', label: '7H' },
  { key: '30D', label: '30H' },
  { key: '3M', label: '3B' },
  { key: '1Y', label: '1T' },
]

function formatRevenue(value: number): string {
  if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}Jt`
  if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}rb`
  return `Rp ${value}`
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { payload: AdminRevenueDataPoint }[]
  label?: string
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-black/10 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-gray-500 mb-1">{d.label}</p>
      <p className="font-semibold text-indigo-600">{formatRevenue(d.revenue)}</p>
      <p className="text-gray-500 text-xs">{d.users} users</p>
    </div>
  )
}

interface Props {
  data: Record<RangeKey, AdminRevenueDataPoint[]>
}

export default function RevenueChartWithRange({ data }: Props) {
  const [range, setRange] = useState<RangeKey>('7D')
  const chartData = data[range]

  return (
    <div className="bg-white rounded-xl border border-black/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Revenue Overview</h2>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                range === r.key
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} key={range}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatRevenue(v)} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#revGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
