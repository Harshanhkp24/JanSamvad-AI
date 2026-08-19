import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import {
  MessageSquareCheck,
  Search,
  PlusCircle,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  MapPin,
  Building2,
  FolderKanban,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export default function Complaints() {
  const { currentDistrict, currentDistrictId } = useJanSamvad()

  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedSector, setSelectedSector] = useState('')

  const grievances = currentDistrict.grievances

  const departments = Array.from(new Set(grievances.map(g => g.department)))
  const sectors = Array.from(new Set(grievances.map(g => g.sector)))

  const filteredGrievances = grievances.filter(g => {
    if (search) {
      const q = search.toLowerCase()
      const matches =
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.complaintNumber.toLowerCase().includes(q) ||
        g.sector.toLowerCase().includes(q)
      if (!matches) return false
    }
    if (selectedStatus && g.status !== selectedStatus) return false
    if (selectedDept && g.department !== selectedDept) return false
    if (selectedSector && g.sector !== selectedSector) return false
    return true
  })

  // Counters
  const total = grievances.length
  const openCount = grievances.filter(g => g.status === 'Open').length
  const inProgressCount = grievances.filter(g => g.status === 'InProgress').length
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length

  const resetFilters = () => {
    setSearch('')
    setSelectedStatus('')
    setSelectedDept('')
    setSelectedSector('')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        )
      case 'InProgress':
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        )
      default:
        return (
          <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Open
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md">
              📍 {currentDistrict.name} Municipal Grievances
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2.5">
            <MessageSquareCheck className="w-7 h-7 text-blue-600" />
            Civic Grievance Redressal Portal
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">
            Report civic defects, link issues to government projects, and track departmental resolution
          </p>
        </div>

        <Link
          to="/complaints/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>File New Grievance</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">Total Registered</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-rose-500">Open Grievances</div>
          <div className="text-2xl font-black text-rose-700 mt-1">{openCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-amber-500">In Progress</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{inProgressCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-emerald-600">Resolved</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search title, ID, or sector..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 outline-none"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 outline-none"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 outline-none"
            >
              <option value="">All Sectors</option>
              {sectors.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(search || selectedStatus || selectedDept || selectedSector) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong>{filteredGrievances.length}</strong> of {total} grievances
            </span>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-bold transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Grievances List */}
      <div className="space-y-3">
        {filteredGrievances.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <MessageSquareCheck className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="font-extrabold text-slate-800 text-base">No grievances found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your filter settings or search query.
            </p>
          </div>
        ) : (
          filteredGrievances.map(g => (
            <div
              key={g.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {g.complaintNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {g.sector}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    <Building2 className="w-3 h-3" />
                    {g.department}
                  </span>
                </div>
                {getStatusBadge(g.status)}
              </div>

              <div>
                <Link
                  to={`/complaints/${g.id}`}
                  className="font-extrabold text-slate-900 text-base hover:text-blue-600 transition"
                >
                  {g.title}
                </Link>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {g.description}
                </p>
              </div>

              {/* Linked Project & AI Classification */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  {g.projectId && (
                    <Link
                      to={`/projects/${g.projectId}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md hover:underline"
                    >
                      <FolderKanban className="w-3 h-3" />
                      {g.projectName || 'Linked Project'}
                    </Link>
                  )}
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                    AI Routing: {g.aiDepartmentConfidence}% Confidence
                  </span>
                  {g.feedbackRating && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-amber-400" />
                      Citizen Rating: {g.feedbackRating}.0 / 5
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>Filed by {g.citizenName} &bull; {g.createdAt}</span>
                  <Link
                    to={`/complaints/${g.id}`}
                    className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                  >
                    View Status & Action <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
