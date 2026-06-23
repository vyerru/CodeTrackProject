import { TrendingUp, TrendingDown } from 'lucide-react'
import type { AdminTopCourse } from '@/shared/types'

interface Props {
  data: AdminTopCourse[]
}

export default function TopCoursesTable({ data }: Props) {
  if (data.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-black/10 p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Performing Courses</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-black/10">
              <th className="pb-2 pr-2 font-medium">#</th>
              <th className="pb-2 pr-2 font-medium">Course</th>
              <th className="pb-2 pr-2 font-medium hidden sm:table-cell">Kategori</th>
              <th className="pb-2 pr-2 font-medium text-right">Students</th>
              <th className="pb-2 pr-2 font-medium text-right">Revenue</th>
              <th className="pb-2 font-medium text-right">Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {data.map((c) => (
              <tr key={c.rank} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 pr-2 text-gray-400 font-mono text-xs">{c.rank}</td>
                <td className="py-3 pr-2 font-medium text-gray-900 truncate max-w-[160px]">{c.title}</td>
                <td className="py-3 pr-2 text-gray-500 hidden sm:table-cell">{c.category}</td>
                <td className="py-3 pr-2 text-right text-gray-700">{c.students.toLocaleString()}</td>
                <td className="py-3 pr-2 text-right font-medium text-gray-900">
                  Rp {(c.revenue / 1000000).toFixed(1)}M
                </td>
                <td className="py-3 text-right">
                  <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${c.growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {c.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(c.growth)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
