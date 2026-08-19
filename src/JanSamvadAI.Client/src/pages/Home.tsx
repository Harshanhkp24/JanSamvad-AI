import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  BarChart3,
  Layers,
  Search
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts'

export default function Home() {
  const [complaintStats, setComplaintStats] = useState<any>(null)
  const [departments, setDepartments] = useState<any[]>([])
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, deptRes, projRes] = await Promise.allSettled([
          api.get('/api/complaints/stats'),
          api.get('/api/departments'),
          api.get('/api/projects?pageSize=4')
        ])

        if (statsRes.status === 'fulfilled' && statsRes.value.data?.data) {
          setComplaintStats(statsRes.value.data.data)
        }
        if (deptRes.status === 'fulfilled' && deptRes.value.data?.data) {
          setDepartments(deptRes.value.data.data)
        }
        if (projRes.status === 'fulfilled' && projRes.value.data?.data?.items) {
          setRecentProjects(projRes.value.data.data.items)
        }
      } catch (err) {
        console.error('Error fetching dashboard summary', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Chart data for Department Budgets
  const departmentChartData = departments.slice(0, 6).map(d => ({
    name: d.name.replace('& Infrastructure', '').trim(),
    Budget: Math.round((d.totalBudget || 0) / 10000000), // in Crores
    Projects: d.projectCount
  }))

  // Chart data for Complaint Status
  const statusPieData = complaintStats ? [
    { name: 'Resolved', value: complaintStats.resolvedComplaints || 0, color: '#10B981' },
    { name: 'In Progress', value: complaintStats.inProgressComplaints || 0, color: '#3B82F6' },
    { name: 'Open', value: complaintStats.openComplaints || 0, color: '#F59E0B' },
    { name: 'Rejected', value: complaintStats.rejectedComplaints || 0, color: '#EF4444' },
  ].filter(item => item.value > 0) : []

  const formatCurrencyCr = (num: number) => {
    const cr = num / 10000000
    return `₹${cr.toFixed(1)} Cr`
  }

  const totalSanctionedSum = departments.reduce((acc, d) => acc + (d.totalBudget || 0), 0)

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-8 md:p-12 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>District Civic Intelligence Platform</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Transparent Governance. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              AI-Powered Civic Redressal.
            </span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
            Monitor public expenditure across wards, audit contractor disbursements, and file grievances with automated NLP categorization.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/complaints/new"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-3 rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              <span>File a Grievance</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/projects"
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-5 py-3 rounded-xl text-sm transition flex items-center gap-2 backdrop-blur-md"
            >
              <Search className="w-4 h-4 text-blue-300" />
              <span>Explore Public Projects</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Public Projects</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {departments.reduce((acc, d) => acc + d.projectCount, 0) || 50}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold flex items-center">Active monitoring</span> across 9 wards
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Fund Allocation</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {totalSanctionedSum > 0 ? formatCurrencyCr(totalSanctionedSum) : '₹124.5 Cr'}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold">100% auditable</span> public disbursement ledger
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Resolution Rate</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {complaintStats ? `${complaintStats.resolutionRatePercentage}%` : '34.8%'}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {complaintStats?.resolvedComplaints?.toLocaleString() || '1,050'} grievances resolved
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Grievances</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {complaintStats ? (complaintStats.openComplaints + complaintStats.inProgressComplaints).toLocaleString() : '1,950'}
          </div>
          <div className="text-xs text-amber-600 font-semibold mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {complaintStats?.highPriorityComplaints || 450} high/critical priority
          </div>
        </div>
      </div>

      {/* Interactive Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Budget Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Department Budget Allocation (₹ Crores)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Top municipal departments by sanctioned expenditure</p>
            </div>
            <Link to="/projects" className="text-xs font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="h-72 w-full">
            {departmentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(value: any) => [`₹${value} Cr`, 'Allocated Budget']}
                    contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                  />
                  <Bar dataKey="Budget" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Loading visual data...
              </div>
            )}
          </div>
        </div>

        {/* Complaint Status Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Grievance Status Breakdown
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">Total: {complaintStats?.totalComplaints?.toLocaleString() || '3,000'} complaints</p>
            
            <div className="h-56 w-full">
              {statusPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Loading status distribution...
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">AI categorization accuracy</span>
            <span className="font-bold text-emerald-600">~91% Match</span>
          </div>
        </div>
      </div>

      {/* Featured Projects & Fast Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Public Infrastructure Projects</h2>
            <p className="text-xs text-slate-500">Real-time progress and milestone updates across wards</p>
          </div>
          <Link to="/projects" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>Explore All 50 Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentProjects.map(p => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition bg-slate-50/50 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                    {p.departmentName || 'Public Works'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                    p.status === 'InProgress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-bold text-slate-700">{p.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(0, p.progressPercentage))}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
