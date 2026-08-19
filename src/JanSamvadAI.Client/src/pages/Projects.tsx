import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import CivicMap from '../components/CivicMap'
import {
  FolderKanban,
  Search,
  Filter,
  MapPin,
  Building2,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  LayoutGrid,
  Map,
  Sparkles,
  UserCheck,
  Star
} from 'lucide-react'

export default function Projects() {
  const { currentDistrict, currentDistrictId } = useJanSamvad()

  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [search, setSearch] = useState('')
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Extract unique sectors and departments for current district
  const sectors = Array.from(new Set(currentDistrict.projects.map(p => p.sector)))
  const departments = Array.from(new Set(currentDistrict.projects.map(p => p.department)))

  const filteredProjects = currentDistrict.projects.filter(p => {
    if (search) {
      const q = search.toLowerCase()
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.whyExists.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q)
      if (!matches) return false
    }
    if (selectedSector && p.sector !== selectedSector) return false
    if (selectedDept && p.department !== selectedDept) return false
    if (selectedStatus && p.status !== selectedStatus) return false
    return true
  })

  const ongoingProjects = filteredProjects.filter(p => p.status === 'Ongoing')
  const delayedProjects = filteredProjects.filter(p => p.status === 'Delayed')
  const completedProjects = filteredProjects.filter(p => p.status === 'Completed')
  const plannedProjects = filteredProjects.filter(p => p.status === 'Planned')

  const resetFilters = () => {
    setSearch('')
    setSelectedSector('')
    setSelectedDept('')
    setSelectedStatus('')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        )
      case 'Delayed':
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Delayed
          </span>
        )
      case 'Planned':
        return (
          <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" /> Planned
          </span>
        )
      default:
        return (
          <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Ongoing
          </span>
        )
    }
  }

  const renderProjectCard = (project: (typeof currentDistrict.projects)[0]) => {
    return (
      <div
        key={project.id}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
      >
        <div className="space-y-3">
          
          {/* Header Row: Sector & Status */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {project.sector}
            </span>
            {getStatusBadge(project.status)}
          </div>

          {/* Project Title & Department */}
          <div>
            <Link
              to={`/projects/${project.id}`}
              className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition block"
            >
              {project.name}
            </Link>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {project.department}
            </div>
          </div>

          {/* Objective Summary */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {project.whyExists}
          </p>

          {/* Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Execution Progress</span>
              <span>{project.progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  project.status === 'Completed'
                    ? 'bg-emerald-500'
                    : project.status === 'Delayed'
                    ? 'bg-amber-500'
                    : project.status === 'Planned'
                    ? 'bg-purple-500'
                    : 'bg-blue-600'
                }`}
                style={{ width: `${project.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Budget</span>
              <div className="font-extrabold text-slate-900">₹{project.budgetCr} Cr</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Spent</span>
              <div className="font-extrabold text-slate-700">₹{project.currentExpenditureCr} Cr</div>
            </div>
          </div>

          {/* Accountable Officer & Citizen Satisfaction */}
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-600" /> Lead Officer:
              </span>
              <strong className="text-slate-800 truncate max-w-[140px]">
                {project.accountability.projectOfficer.name}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-400" /> Satisfaction:
              </span>
              <strong className="text-slate-800">
                {project.averageRating > 0 ? `${project.averageRating} / 5.0` : 'New Project'}
              </strong>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-medium">
            Target: {project.expectedCompletion}
          </span>
          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
          >
            Audit & Live Updates <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md">
              📍 {currentDistrict.name} District
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2.5">
            <FolderKanban className="w-7 h-7 text-blue-600" />
            District Development & Public Works
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">
            Track sanctioned civic works, assigned officers, timelines, and live progress across {currentDistrict.name}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'grid'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid Cards</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'map'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search project name, sector, or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          {/* Sector */}
          <div>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option value="">All Sectors / Areas</option>
              {sectors.map(sec => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Planned">Planned</option>
            </select>
          </div>
        </div>

        {(search || selectedSector || selectedDept || selectedStatus) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong>{filteredProjects.length}</strong> of {currentDistrict.projects.length} projects
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

      {/* Main View Mode */}
      {viewMode === 'map' ? (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                {currentDistrict.name} Municipal Project Geospatial Matrix
              </h3>
              <span className="text-xs text-slate-500">
                {filteredProjects.length} Pinpoints Displayed
              </span>
            </div>
            <CivicMap
              projects={filteredProjects}
              districtId={currentDistrictId}
              height="550px"
              zoom={12}
              interactive={true}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Active / Ongoing Projects */}
          {ongoingProjects.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  Ongoing Development Projects ({ongoingProjects.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ongoingProjects.map(renderProjectCard)}
              </div>
            </div>
          )}

          {/* Delayed Projects */}
          {delayedProjects.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Delayed Projects Requiring Scrutiny ({delayedProjects.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {delayedProjects.map(renderProjectCard)}
              </div>
            </div>
          )}

          {/* Completed Projects */}
          {completedProjects.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Completed Public Works ({completedProjects.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {completedProjects.map(renderProjectCard)}
              </div>
            </div>
          )}

          {/* Dedicated Planned Projects Section */}
          {plannedProjects.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-purple-950 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Upcoming & Planned Projects ({plannedProjects.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sanctioned civic schemes in tendering or administrative review stage
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {plannedProjects.map(renderProjectCard)}
              </div>
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <FolderKanban className="w-10 h-10 mx-auto text-slate-300" />
              <h3 className="font-extrabold text-slate-800 text-base">No matching projects found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No development projects match your search or filter criteria in {currentDistrict.name}.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
