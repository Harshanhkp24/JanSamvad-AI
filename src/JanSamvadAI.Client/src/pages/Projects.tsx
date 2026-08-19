import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { 
  Building2, 
  Search, 
  Filter, 
  ChevronRight, 
  MapPin, 
  ArrowUpRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react'

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch departments for filter
  useEffect(() => {
    api.get('/api/departments')
      .then(res => {
        if (res.data?.data) setDepartments(res.data.data)
      })
      .catch(err => console.warn('Could not fetch departments for filter', err))
  }, [])

  // Fetch filtered projects
  const fetchProjects = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.append('page', String(page))
      params.append('pageSize', '12')
      if (search) params.append('search', search)
      if (selectedDept) params.append('departmentId', selectedDept)
      if (selectedStatus) params.append('status', selectedStatus)

      const res = await api.get(`/api/projects?${params.toString()}`)
      const data = res.data?.data
      if (data) {
        setProjects(data.items || [])
        setTotalPages(data.totalPages || 1)
        setTotalItems(data.totalItems || 0)
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Failed to load projects')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [page, selectedDept, selectedStatus])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchProjects()
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedDept('')
    setSelectedStatus('')
    setPage(1)
  }

  const statuses = ['InProgress', 'Planned', 'OnHold', 'Completed']

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-blue-600" />
            Public Infrastructure Projects
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tracking {totalItems} civic projects with verified financial allocations and milestone schedules
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by project name, description or locality..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDept}
              onChange={e => { setSelectedDept(e.target.value); setPage(1) }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-blue-600 outline-none font-medium text-slate-700"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {(search || selectedDept || selectedStatus) && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Status:</span>
          <button
            onClick={() => { setSelectedStatus(''); setPage(1) }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              selectedStatus === ''
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => { setSelectedStatus(s); setPage(1) }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedStatus === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse h-56">
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, department, or status filters.
          </p>
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(p => (
            <div
              key={p.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded">
                    {p.departmentName || 'Public Infrastructure'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                    p.status === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                    p.status === 'OnHold' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  {p.description}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ward #{p.wardId}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Physical Progress</span>
                    <span className="font-bold text-slate-800">{p.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        p.progressPercentage >= 100 ? 'bg-emerald-500' :
                        p.progressPercentage >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, p.progressPercentage))}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/projects/${p.id}`}
                  className="w-full py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 hover:border-blue-200 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>View Financials & Milestones</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs font-medium text-slate-500 px-3">
            Page <strong className="text-slate-800">{page}</strong> of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
