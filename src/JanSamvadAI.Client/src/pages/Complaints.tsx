import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { 
  MessageSquareCheck, 
  Search, 
  PlusCircle, 
  ArrowUpRight, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw,
  MapPin
} from 'lucide-react'

export default function Complaints() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedPriority, setSelectedPriority] = useState<string>('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // Fetch summary stats
  useEffect(() => {
    api.get('/api/complaints/stats')
      .then(res => {
        if (res.data?.data) setStats(res.data.data)
      })
      .catch(err => console.warn('Failed to load complaint stats', err))
  }, [])

  // Fetch complaints
  const fetchComplaints = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.append('page', String(page))
      params.append('pageSize', '15')
      if (search) params.append('search', search)
      if (selectedStatus) params.append('status', selectedStatus)
      if (selectedPriority) params.append('priority', selectedPriority)

      const res = await api.get(`/api/complaints?${params.toString()}`)
      const data = res.data?.data
      if (data) {
        setComplaints(data.items || [])
        setTotalPages(data.totalPages || 1)
        setTotalItems(data.totalItems || 0)
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Failed to load complaints')
      setComplaints([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [page, selectedStatus, selectedPriority])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchComplaints()
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedStatus('')
    setSelectedPriority('')
    setPage(1)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded">Critical</span>
      case 'high':
        return <span className="bg-orange-100 text-orange-800 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded">High</span>
      case 'medium':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded">Medium</span>
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Low</span>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Resolved</span>
      case 'inprogress':
        return <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> In Progress</span>
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">Rejected</span>
      default:
        return <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Open</span>
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <MessageSquareCheck className="w-7 h-7 text-blue-600" />
            Civic Grievance Redressal Tracker
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tracking {totalItems.toLocaleString()} citizen grievances with AI department routing & resolution audit
          </p>
        </div>
        <Link
          to="/complaints/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>File New Grievance</span>
        </Link>
      </div>

      {/* Mini Stat Pills */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Grievances</span>
            <span className="text-base font-extrabold text-slate-900">{stats.totalComplaints?.toLocaleString()}</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Open / Pending</span>
            <span className="text-base font-extrabold text-amber-600">{stats.openComplaints?.toLocaleString()}</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">In Progress</span>
            <span className="text-base font-extrabold text-blue-600">{stats.inProgressComplaints?.toLocaleString()}</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Resolved</span>
            <span className="text-base font-extrabold text-emerald-600">{stats.resolvedComplaints?.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Complaint # (e.g. JS-2026-000001), keyword, or location..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
          />
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
            {['', 'Open', 'InProgress', 'Resolved', 'Rejected'].map(st => (
              <button
                key={st}
                onClick={() => { setSelectedStatus(st); setPage(1) }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === '' ? 'All' : st}
              </button>
            ))}
          </div>

          {/* Priority Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Priority:</span>
            {['', 'Critical', 'High', 'Medium', 'Low'].map(pr => (
              <button
                key={pr}
                onClick={() => { setSelectedPriority(pr); setPage(1) }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedPriority === pr
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {pr === '' ? 'All' : pr}
              </button>
            ))}

            {(search || selectedStatus || selectedPriority) && (
              <button
                onClick={resetFilters}
                className="ml-2 text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Complaints List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-medium">Fetching grievances...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <MessageSquareCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No grievances found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No matching records found. Try modifying your search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4">Complaint #</th>
                  <th className="py-3.5 px-4">Grievance Title</th>
                  <th className="py-3.5 px-4">Department & Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date Filed</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 text-xs font-mono font-bold text-blue-600">
                      {c.complaintNumber}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 text-xs truncate">{c.title}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{c.description}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-semibold text-slate-800">{c.departmentName || 'Public Works'}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">{c.categoryName || 'GENERAL'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getPriorityBadge(c.priority)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(c.status)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/complaints/${c.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
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
