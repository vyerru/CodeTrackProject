import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  DollarSign, Users, BookOpen, GraduationCap, HeartPulse,
  TrendingUp, TrendingDown, RefreshCw, Target, ArrowRight, MapPin,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts'
import { useAsync } from '@/shared/hooks/useAsync'
import { repos } from '@/core/domain/di'
import { formatRupiahShort, getStatusColor } from '@/shared/utils'
import type { AdminDashboardData, AdminKpiCard } from '@/shared/types'
import ErrorState from '@/shared/components/common/ErrorState'
import EmptyState from '@/shared/components/common/EmptyState'
import Skeleton from '@/shared/components/ui/Skeleton'
import RevenueChartWithRange from '../components/RevenueChartWithRange'
import TopCoursesTable from '../components/TopCoursesTable'
import QuickActions from '../components/QuickActions'
import EnhancedActivityFeed from '../components/EnhancedActivityFeed'
import DismissibleAlerts from '../components/DismissibleAlerts'

const kpiConfig: (Omit<AdminKpiCard, 'value' | 'trend'> & {
  icon: typeof DollarSign
  gradient: string
  iconBg: string
  iconColor: string
})[] = [
  { label: 'Revenue', icon: DollarSign, gradient: 'from-white to-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { label: 'Total Users', icon: Users, gradient: 'from-white to-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { label: 'Active Courses', icon: BookOpen, gradient: 'from-white to-indigo-50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { label: 'Students', icon: GraduationCap, gradient: 'from-white to-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { label: 'Health', icon: HeartPulse, gradient: 'from-white to-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
]

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-black/10 p-7 shadow-md">
          <div className="flex items-start justify-between mb-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
          <Skeleton className="h-7 w-24 mb-2 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-black/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-40 rounded" />
        <Skeleton className="h-6 w-28 rounded" />
      </div>
      <Skeleton className="h-[240px] w-full rounded-lg" />
    </div>
  )
}

function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-black/10 p-5 space-y-3">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch } = useAsync<AdminDashboardData>(
    () => repos.adminDashboard.getAdminDashboardData()
  )
  const [period, setPeriod] = useState('Month')
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 rounded" />
            <Skeleton className="h-4 w-64 rounded" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 rounded-lg" />
            <Skeleton className="h-9 w-16 rounded-lg" />
            <Skeleton className="h-9 w-16 rounded-lg" />
            <Skeleton className="h-9 w-16 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
        <KpiSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
          <ChartSkeleton />
          <CardSkeleton />
        </div>
      </div>
    )
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (!data) return <EmptyState title="Dashboard kosong" description="Belum ada data dashboard yang tersedia." action={{ label: 'Muat Ulang', onClick: refetch }} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {['Today', 'Week', 'Month', 'Year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none ${
                period === p ? 'bg-indigo-600 text-white' : 'bg-white text-muted-foreground border border-black/10 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={refetch}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-black/10 rounded-lg text-sm text-muted-foreground hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {data.kpiCards.map((kpi, i) => {
          const cfg = kpiConfig[i]
          return (
            <div key={kpi.label} className={`bg-gradient-to-br ${cfg.gradient} rounded-2xl border border-black/10 p-7 shadow-md`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${cfg.iconBg}`}>
                  <cfg.icon className={`w-5 h-5 ${cfg.iconColor}`} />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${kpi.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {kpi.trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {Math.abs(kpi.trend)}%
                </div>
              </div>
              <div className="text-5xl font-bold text-foreground mb-1">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.label}</div>
            </div>
          )
        })}
      </div>

      {/* Main Content 65/35 */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
        <RevenueChartWithRange data={data.revenueData} />
        <div className="space-y-4">
          <EnhancedActivityFeed data={data.recentActivity} />
          {/* Pending Reviews */}
          <div className="bg-white rounded-xl border border-black/10 p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Pending Reviews</h2>
            <div className="space-y-3">
              {data.pendingReviews.map((r) => (
                <div key={r.course} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{r.course}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{r.count}</span>
                    <span className="text-xs text-amber-900 bg-amber-50 rounded px-1.5 py-0.5">{r.pending} pending</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/admin/courses')}
              className="mt-3 text-xs text-indigo-600 font-medium hover:text-indigo-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              View All Courses →
            </button>
          </div>

          {/* Today Goals */}
          <div className="bg-white rounded-xl border border-black/10 p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              Today's Goals
            </h2>
            <div className="space-y-3">
              {data.todayGoals.map((g) => (
                <div key={g.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{g.label}</span>
                    <span className="text-foreground font-medium">{g.current}/{g.target}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${(g.current / g.target) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {data.secondaryMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-black/10 p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
            <div className="text-lg font-bold text-foreground">{m.value}</div>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              <span className={`text-xs font-medium ${m.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                {m.change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Latest Transactions + Newest Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-black/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Latest Transactions</h2>
            <button
              onClick={() => navigate('/admin/transactions')}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-0.5 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {data.latestTransactions.map((tx) => (
              <div key={tx.invoice} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs text-muted-foreground">{tx.invoice}</div>
                  <div className="text-sm text-gray-700 truncate">{tx.customer} — {tx.course}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-sm font-semibold text-foreground">{formatRupiahShort(tx.amount)}</div>
                  <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full mt-0.5 ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Newest Users</h2>
            <button
              onClick={() => navigate('/admin/users')}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-0.5 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {data.newestUsers.map((u) => (
              <div key={u.email} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center">
                  {u.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
                <span className="text-xs text-muted-foreground">{u.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Courses */}
      <TopCoursesTable data={data.topCourses} />

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-black/10 p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Traffic Sources</h2>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.trafficSources} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value" strokeWidth={0}>
                    {data.trafficSources.map((_, i) => (
                      <Cell key={i} fill={data.trafficSources[i].color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {data.trafficSources.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="font-medium text-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl border border-black/10 p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">User Devices</h2>
          <div className="space-y-4">
            {data.deviceData.map((d) => (
              <div key={d.device}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{d.device}</span>
                  <span className="font-medium text-foreground">{d.count}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.count}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white rounded-xl border border-black/10 p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Top Locations</h2>
          <div className="space-y-4">
            {data.topLocations.map((loc) => (
              <div key={loc.city}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-400" />{loc.city}</span>
                  <span className="font-medium text-foreground">{loc.count}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${loc.count}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dismissible Alerts */}
      <DismissibleAlerts data={data.alerts} />
    </div>
  )
}
