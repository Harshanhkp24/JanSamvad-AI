import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import {
  ShieldCheck,
  Building,
  TrendingUp,
  MessageSquareCheck,
  ShieldAlert,
  Star,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  MapPin,
  UserCheck,
  HardHat,
  Landmark
} from 'lucide-react'

export default function Accountability() {
  const { currentDistrict } = useJanSamvad()

  const [selectedDept, setSelectedDept] = useState('')

  const departments = Array.from(new Set(currentDistrict.projects.map(p => p.department)))

  const projects = currentDistrict.projects.filter(p => {
    if (selectedDept && p.department !== selectedDept) return false
    return true
  })

  // District-wide summary calculations
  const totalBudget = currentDistrict.projects
    .reduce((acc, p) => acc + p.budgetCr, 0)
    .toFixed(1)
  const totalExp = currentDistrict.projects
    .reduce((acc, p) => acc + p.currentExpenditureCr, 0)
    .toFixed(1)
  const totalGrievances = currentDistrict.grievances.length
  const resolvedGrievances = currentDistrict.grievances.filter(g => g.status === 'Resolved').length
  const resolutionRate =
    totalGrievances > 0 ? Math.round((resolvedGrievances / totalGrievances) * 100) : 0

  const ratedProjects = currentDistrict.projects.filter(p => p.ratings.length > 0)
  const avgDistrictSatisfaction =
    ratedProjects.length > 0
      ? (
          ratedProjects.reduce((acc, p) => acc + p.averageRating, 0) /
          ratedProjects.length
        ).toFixed(1)
      : '4.1'

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md">
              📍 {currentDistrict.name} Public Transparency Ledger
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            District Public Accountability Matrix
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">
            100% auditable cross-reference connecting elected representatives, department officers, contractor payouts, and citizen ratings
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Sanctioned Public Funds</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{totalBudget} Cr</div>
          <div className="text-xs text-slate-500 mt-1">
            Expenditure: <strong className="text-slate-800">₹{totalExp} Cr</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Citizen Satisfaction</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{avgDistrictSatisfaction} / 5.0</div>
          <div className="text-xs text-slate-500 mt-1">
            Across {currentDistrict.projects.length} municipal projects
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Grievance Resolution</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{resolutionRate}%</div>
          <div className="text-xs text-slate-500 mt-1">
            {resolvedGrievances} of {totalGrievances} resolved
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Active Opposition Inquiries</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currentDistrict.oppositionQuestions.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Public scrutiny questions logged
          </div>
        </div>
      </div>

      {/* Filter by Department */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDept('')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            selectedDept === ''
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Departments ({currentDistrict.projects.length})
        </button>
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedDept === dept
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Detailed Accountability Grid */}
      <div className="space-y-4">
        {projects.map(proj => {
          const grievancesOnProj = currentDistrict.grievances.filter(g => g.projectId === proj.id)
          const questionsOnProj = currentDistrict.oppositionQuestions.filter(q => q.projectId === proj.id)
          const latestUpdate = proj.liveUpdates[0]

          return (
            <div
              key={proj.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-6 space-y-4"
            >
              {/* Row 1: Title, Department, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      📍 {proj.sector}
                    </span>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {proj.department}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {proj.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-800">
                      {proj.status} — {proj.progressPercentage}%
                    </span>
                    <div className="w-28 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-500'
                            : proj.status === 'Delayed'
                            ? 'bg-amber-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${proj.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    to={`/projects/${proj.id}`}
                    className="p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition shadow-2xs"
                    title="Audit Project"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Row 2: 4-Way Accountability Cross Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                
                {/* 1. Accountable Officer */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Responsible Officer
                  </div>
                  <div className="font-bold text-slate-900 text-xs">
                    {proj.accountability.projectOfficer.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {proj.accountability.projectOfficer.designation}
                  </div>
                </div>

                {/* 2. Executing Contractor */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                    <HardHat className="w-3.5 h-3.5 text-slate-700" />
                    Contractor Entity
                  </div>
                  <div className="font-bold text-slate-900 text-xs truncate">
                    {proj.accountability.contractor.companyName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate font-mono">
                    {proj.accountability.contractor.registrationNumber}
                  </div>
                </div>

                {/* 3. Funds & Expenditure */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    Sanction vs Spent
                  </div>
                  <div className="font-bold text-slate-900 text-xs">
                    ₹{proj.budgetCr} Cr Sanctioned
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Spent: <strong>₹{proj.currentExpenditureCr} Cr</strong>
                  </div>
                </div>

                {/* 4. Citizen Score & Inquiries */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    Citizen Score & Redressal
                  </div>
                  <div className="font-bold text-slate-900 text-xs">
                    {proj.averageRating > 0 ? `${proj.averageRating} / 5.0 Rating` : 'Unrated Project'}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{grievancesOnProj.length} Grievances</span>
                    <span>&bull;</span>
                    <span className="text-amber-700 font-semibold">{questionsOnProj.length} Scrutiny Questions</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Latest Live Milestone Entry */}
              {latestUpdate && (
                <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-extrabold uppercase bg-blue-600 text-white px-2 py-0.2 rounded">
                      Latest Field Update
                    </span>
                    <span className="text-slate-800 font-medium truncate">{latestUpdate.description}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{latestUpdate.date}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
