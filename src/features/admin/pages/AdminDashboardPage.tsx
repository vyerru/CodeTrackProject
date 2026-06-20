import { useState } from 'react'
import {
  DollarSign, Users, BookOpen, GraduationCap, HeartPulse,
  TrendingUp, TrendingDown, RefreshCw, Target,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from 'recharts'
import { formatRupiahShort, getStatusColor } from '@/shared/utils'

// ── Mock Data ──────────────────────────────────────────
const kpiCards = [
  { label: 'Revenue', value: 'Rp 12.4M', icon: DollarSign, trend: 12.5, gradient: 'from-white to-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { label: 'Total Users', value: '2,847', icon: Users, trend: 8.2, gradient: 'from-white to-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { label: 'Active Courses', value: '24', icon: BookOpen, trend: 4.1, gradient: 'from-white to-indigo-50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { label: 'Students', value: '1,432', icon: GraduationCap, trend: 15.3, gradient: 'from-white to-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { label: 'Health', value: '98%', icon: HeartPulse, trend: 0.5, gradient: 'from-white to-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
]

const revenueData = [
  { month: 'Jan', revenue: 4200000, users: 240 },
  { month: 'Feb', revenue: 3800000, users: 220 },
  { month: 'Mar', revenue: 5100000, users: 290 },
  { month: 'Apr', revenue: 4600000, users: 260 },
  { month: 'Mei', revenue: 5900000, users: 310 },
  { month: 'Jun', revenue: 5400000, users: 280 },
  { month: 'Jul', revenue: 6800000, users: 350 },
]

const recentActivity = [
  { type: 'enrollment', user: 'Budi Santoso', action: 'mendaftar Web Dev Bootcamp', time: '2 menit lalu', avatar: 'BS' },
  { type: 'purchase', user: 'Siti Rahma', action: 'membeli UI/UX Design', time: '15 menit lalu', avatar: 'SR' },
  { type: 'registration', user: 'Ahmad Fauzi', action: 'mendaftar akun baru', time: '1 jam lalu', avatar: 'AF' },
  { type: 'completion', user: 'Dewi Lestari', action: 'menyelesaikan Python Dasar', time: '2 jam lalu', avatar: 'DL' },
  { type: 'review', user: 'Rizki Pratama', action: 'memberi rating 5⭐ pada Flutter', time: '3 jam lalu', avatar: 'RP' },
]

const pendingReviews = [
  { course: 'Node.js Backend', count: 3, pending: 2 },
  { course: 'React Native', count: 5, pending: 1 },
]

const todayGoals = [
  { label: 'Pendaftaran Baru', current: 18, target: 25 },
  { label: 'Course Terjual', current: 7, target: 12 },
  { label: 'Ulasan Ditulis', current: 4, target: 8 },
]

const secondaryMetrics = [
  { label: 'Conversion Rate', value: '3.2%', change: '+0.8%' },
  { label: 'Avg Transaction', value: 'Rp 459k', change: '+5.2%' },
  { label: 'Completion Rate', value: '68%', change: '+12%' },
  { label: 'Avg Rating', value: '4.7⭐', change: '+0.1' },
  { label: 'Open Tickets', value: '12', change: '-3' },
  { label: 'Refund Rate', value: '1.8%', change: '-0.4%' },
]

const latestTransactions = [
  { invoice: 'INV/20240715/0012', customer: 'Budi Santoso', course: 'Web Dev Bootcamp', amount: 299000, status: 'success' as const, date: '15 Jul 2024' },
  { invoice: 'INV/20240714/0011', customer: 'Siti Rahma', course: 'UI/UX Design', amount: 449000, status: 'success' as const, date: '14 Jul 2024' },
  { invoice: 'INV/20240714/0010', customer: 'Ahmad Fauzi', course: 'Node.js Backend', amount: 349000, status: 'pending' as const, date: '14 Jul 2024' },
]

const newestUsers = [
  { avatar: 'AF', name: 'Ahmad Fauzi', email: 'ahmad.f@email.com', role: 'student', time: '1 jam lalu' },
  { avatar: 'SW', name: 'Sari Wulandari', email: 'sari.w@email.com', role: 'student', time: '2 jam lalu' },
  { avatar: 'DP', name: 'Doni Pratama', email: 'doni.p@email.com', role: 'instructor', time: '3 jam lalu' },
]

const trafficSources = [
  { name: 'Direct', value: 45, color: '#6366F1' },
  { name: 'Google', value: 25, color: '#10B981' },
  { name: 'Social', value: 18, color: '#F59E0B' },
  { name: 'Referral', value: 12, color: '#3B82F6' },
]

const deviceData = [
  { device: 'Desktop', count: 58, color: 'bg-indigo-500' },
  { device: 'Mobile', count: 32, color: 'bg-green-500' },
  { device: 'Tablet', count: 10, color: 'bg-purple-500' },
]

const topLocations = [
  { city: 'Jakarta', count: 42, flag: '🇮🇩' },
  { city: 'Bandung', count: 18, flag: '🇮🇩' },
  { city: 'Surabaya', count: 12, flag: '🇮🇩' },
  { city: 'Yogyakarta', count: 8, flag: '🇮🇩' },
]

// ── Page ───────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [period, setPeriod] = useState('Month')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Today: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          {['Today', 'Week', 'Month', 'Year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-black/10 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-black/10 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className={`bg-gradient-to-br ${kpi.gradient} rounded-2xl border border-black/10 p-5 shadow-sm`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${kpi.iconBg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-medium ${kpi.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {kpi.trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {Math.abs(kpi.trend)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <div className="text-sm text-gray-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content 65/35 */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-black/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Revenue Overview</h2>
            <span className="text-xs text-gray-500">Last 7 months</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${(v / 1000000).toFixed(0)}M`} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-black/10 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.slice(0, 4).map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {a.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">{a.user}</span> {a.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-xl border border-black/10 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Pending Reviews</h2>
            <div className="space-y-3">
              {pendingReviews.map((r) => (
                <div key={r.course} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{r.course}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{r.count}</span>
                    <span className="text-xs text-amber-600 bg-amber-50 rounded px-1.5 py-0.5">{r.pending} pending</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-xs text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
              View All Reviews →
            </button>
          </div>

          {/* Today Goals */}
          <div className="bg-white rounded-xl border border-black/10 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              Today's Goals
            </h2>
            <div className="space-y-3">
              {todayGoals.map((g) => (
                <div key={g.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{g.label}</span>
                    <span className="text-gray-900 font-medium">{g.current}/{g.target}</span>
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
        {secondaryMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-black/10 p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">{m.label}</div>
            <div className="text-lg font-bold text-gray-900">{m.value}</div>
            <div className={`text-xs font-medium mt-1 ${m.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
              {m.change}
            </div>
          </div>
        ))}
      </div>

      {/* Latest Transactions + Newest Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-black/10 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Latest Transactions</h2>
          <div className="space-y-2">
            {latestTransactions.map((tx) => (
              <div key={tx.invoice} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-xs text-gray-400">{tx.invoice}</div>
                  <div className="text-sm text-gray-700 truncate">{tx.customer} — {tx.course}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-sm font-semibold text-gray-900">{formatRupiahShort(tx.amount)}</div>
                  <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full mt-0.5 ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/10 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Newest Users</h2>
          <div className="space-y-3">
            {newestUsers.map((u) => (
              <div key={u.email} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center">
                  {u.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">{u.name}</div>
                  <div className="text-xs text-gray-400">{u.email}</div>
                </div>
                <span className="text-xs text-gray-400">{u.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-black/10 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Traffic Sources</h2>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value" strokeWidth={0}>
                    {trafficSources.map((_, i) => (
                      <Cell key={i} fill={trafficSources[i].color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {trafficSources.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-600">{s.name}</span>
                  <span className="font-medium text-gray-900">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl border border-black/10 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">User Devices</h2>
          <div className="space-y-4">
            {deviceData.map((d) => (
              <div key={d.device}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{d.device}</span>
                  <span className="font-medium text-gray-900">{d.count}%</span>
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
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Top Locations</h2>
          <div className="space-y-4">
            {topLocations.map((loc) => (
              <div key={loc.city}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600"><span className="mr-1">{loc.flag}</span>{loc.city}</span>
                  <span className="font-medium text-gray-900">{loc.count}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${loc.count}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Bars */}
      <div className="space-y-2">
        <div className="bg-green-50 border-l-4 border-green-500 text-green-900 px-4 py-3 rounded-r-lg text-sm">
          ✅ Sistem berjalan normal — tidak ada masalah yang terdeteksi.
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-900 px-4 py-3 rounded-r-lg text-sm">
          ⚠️ 3 kursus memiliki rating di bawah 4.0 — perlu review konten.
        </div>
      </div>
    </div>
  )
}
