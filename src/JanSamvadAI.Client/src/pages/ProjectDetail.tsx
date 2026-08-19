import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import AccountabilityChain from '../components/AccountabilityChain'
import CivicMap from '../components/CivicMap'
import {
  Building2,
  ArrowLeft,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  PlusCircle,
  Star,
  ShieldAlert,
  MessageSquareCheck,
  TrendingUp,
  MapPin,
  Sparkles,
  FileText,
  Users,
  ThumbsUp
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const {
    currentDistrict,
    currentUser,
    currentDistrictId,
    rateProject,
    addProjectLiveUpdate,
    supportQuestion
  } = useJanSamvad()

  const project = currentDistrict.projects.find(p => p.id === id)

  // Local state for officer adding update
  const [updateText, setUpdateText] = useState('')
  const [newProgress, setNewProgress] = useState<number | ''>('')
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  // Local state for citizen rating
  const [citizenRating, setCitizenRating] = useState<number>(5)
  const [citizenComment, setCitizenComment] = useState('')
  const [hasRated, setHasRated] = useState(false)

  if (!project) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-3xl text-sm">
          Project record not found in {currentDistrict.name} district data.
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to District Projects
        </Link>
      </div>
    )
  }

  // Related grievances on this project
  const relatedGrievances = currentDistrict.grievances.filter(g => g.projectId === project.id)
  const pendingGrievances = relatedGrievances.filter(g => g.status === 'Open').length
  const inProgressGrievances = relatedGrievances.filter(g => g.status === 'InProgress').length
  const resolvedGrievances = relatedGrievances.filter(g => g.status === 'Resolved').length

  // Related opposition questions
  const relatedQuestions = currentDistrict.oppositionQuestions.filter(q => q.projectId === project.id)

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!updateText.trim()) return

    addProjectLiveUpdate(project.id, {
      description: updateText.trim(),
      progressPercentage: newProgress !== '' ? Number(newProgress) : undefined
    })

    setUpdateText('')
    setNewProgress('')
    setShowUpdateForm(false)
  }

  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!citizenComment.trim()) return

    rateProject(project.id, citizenRating, citizenComment.trim())
    setCitizenComment('')
    setHasRated(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Completed
          </span>
        )
      case 'Delayed':
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Delayed (Under Scrutiny)
          </span>
        )
      case 'Planned':
        return (
          <span className="bg-purple-100 text-purple-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Planned (Tendering Stage)
          </span>
        )
      default:
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Ongoing Execution
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto">
      
      {/* Top Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {currentDistrict.name} Projects</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">
          Project ID: {project.id}
        </span>
      </div>

      {/* 1. Main Project Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {project.sector}, {currentDistrict.name}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl">
                <Building2 className="w-3.5 h-3.5" />
                {project.department}
              </span>
              {getStatusBadge(project.status)}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {project.name}
            </h1>

            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl pt-1">
              {project.whyExists}
            </p>
          </div>

          {/* Progress & Rating KPI Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-md min-w-[240px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black text-blue-300 tracking-wider">
                Overall Progress
              </span>
              <span className="text-xl font-black text-white">
                {project.progressPercentage}%
              </span>
            </div>
            
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-400 h-full rounded-full transition-all"
                style={{ width: `${project.progressPercentage}%` }}
              />
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300">Citizen Rating</span>
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {project.averageRating > 0 ? `${project.averageRating} / 5.0` : 'Unrated'}
              </span>
            </div>
          </div>
        </div>

        {/* Financial & Timeline Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-blue-600" /> Sanctioned Budget
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">₹{project.budgetCr} Crore</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" /> Current Expenditure
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">₹{project.currentExpenditureCr} Crore</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-purple-600" /> Start Date
            </div>
            <div className="text-sm font-bold text-slate-800 mt-1.5">{project.startDate}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" /> Target Completion
            </div>
            <div className="text-sm font-bold text-slate-800 mt-1.5">{project.expectedCompletion}</div>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Live Updates, History Chart, Grievances, Feedback */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* A. Live Project Updates Stream */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Latest Project Progress Updates
                </h3>
              </div>

              {/* Officer trigger to add update */}
              {(currentUser?.role === 'officer' || currentUser?.role === 'admin') && (
                <button
                  onClick={() => setShowUpdateForm(!showUpdateForm)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{showUpdateForm ? 'Cancel' : 'Post Progress Update'}</span>
                </button>
              )}
            </div>

            {/* Officer Post Update Form */}
            {showUpdateForm && (
              <form onSubmit={handlePostUpdate} className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                <div className="font-bold text-xs text-blue-900">
                  Officer Field Update & Milestone Entry
                </div>
                <textarea
                  required
                  rows={3}
                  value={updateText}
                  onChange={e => setUpdateText(e.target.value)}
                  placeholder="Describe technical work completed, quality inspection results, or phase handover..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-blue-300 text-xs focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-700">Update Progress %:</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newProgress}
                      onChange={e => setNewProgress(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder={String(project.progressPercentage)}
                      className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    Publish to Feed
                  </button>
                </div>
              </form>
            )}

            {/* Updates list */}
            {project.liveUpdates.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 italic">
                No official milestone updates recorded yet for this project.
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-200 ml-3 pl-4 space-y-4 py-1">
                {project.liveUpdates.map(u => (
                  <div key={u.id} className="relative group">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-2xs" />
                    <div className="text-xs text-slate-400 font-semibold">{u.date}</div>
                    <p className="text-xs md:text-sm text-slate-800 font-medium mt-0.5 leading-relaxed">
                      {u.description}
                    </p>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span className="font-semibold text-slate-700">{u.author}</span>
                      {u.progressPercentage !== undefined && (
                        <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.2 rounded">
                          Progress: {u.progressPercentage}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* B. Progress History Recharts Chart */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Physical Progress Trend
              </h3>
              <span className="text-xs text-slate-500 font-medium">Monthly Milestones</span>
            </div>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={project.progressHistory}>
                  <defs>
                    <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    formatter={(val: number) => [`${val}%`, 'Progress']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="progressPercentage"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#progressGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* C. Related Citizen Grievances */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquareCheck className="w-5 h-5 text-sky-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Citizen Issues on this Project ({relatedGrievances.length})
                </h3>
              </div>

              <Link
                to={`/complaints/new?projectId=${project.id}&sector=${encodeURIComponent(
                  project.sector
                )}&title=${encodeURIComponent(`Issue regarding ${project.name}`)}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>File Grievance on this</span>
              </Link>
            </div>

            {/* Grievance Summary Counters */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Total</div>
                <div className="font-black text-slate-900 text-base">{relatedGrievances.length}</div>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                <div className="text-rose-500 text-[10px] uppercase font-bold">Pending</div>
                <div className="font-black text-rose-700 text-base">{pendingGrievances}</div>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
                <div className="text-amber-600 text-[10px] uppercase font-bold">In Progress</div>
                <div className="font-black text-amber-700 text-base">{inProgressGrievances}</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-emerald-600 text-[10px] uppercase font-bold">Resolved</div>
                <div className="font-black text-emerald-700 text-base">{resolvedGrievances}</div>
              </div>
            </div>

            {/* List of related complaints */}
            {relatedGrievances.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 italic">
                No citizen grievances reported on this project yet.
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                {relatedGrievances.map(g => (
                  <Link
                    key={g.id}
                    to={`/complaints/${g.id}`}
                    className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-slate-50 transition flex items-center justify-between gap-3 text-xs block"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{g.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{g.complaintNumber}</span>
                        <span>&bull;</span>
                        <span>Filed: {g.createdAt}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                        g.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : g.status === 'InProgress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {g.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* D. Opposition Scrutiny Questions */}
          {relatedQuestions.length > 0 && (
            <div className="bg-amber-50/70 rounded-3xl border border-amber-200 p-6 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-amber-900">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-base">
                  Opposition Scrutiny Inquiries ({relatedQuestions.length})
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                {relatedQuestions.map(q => (
                  <div key={q.id} className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{q.questionText}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {q.raisedBy} &bull; {q.raisedDate}
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        {q.claimCategory}
                      </span>
                    </div>

                    {q.govResponseText ? (
                      <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                        <div className="text-[10px] font-extrabold uppercase text-emerald-700">
                          Official Department Response ({q.responseOfficerName})
                        </div>
                        <p className="text-xs leading-relaxed">{q.govResponseText}</p>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-[11px]">
                        Pending official government response.
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <button
                        onClick={() => supportQuestion(q.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950"
                      >
                        <ThumbsUp className="w-3 h-3 text-amber-600" />
                        <span>{q.citizenSupports} Citizens Support This Inquiry</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E. Citizen Feedback & Rating */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Citizen Ratings & Reviews ({project.ratings.length})
                </h3>
              </div>
              <div className="font-black text-slate-900 text-base">
                {project.averageRating > 0 ? `${project.averageRating} / 5.0` : 'New'}
              </div>
            </div>

            {/* Citizen rate form */}
            {!hasRated ? (
              <form onSubmit={handleRateSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800">
                  Rate this public project in your area:
                </div>
                
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCitizenRating(star)}
                      className="p-1 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= citizenRating
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {citizenRating} of 5 Stars
                  </span>
                </div>

                <textarea
                  required
                  rows={2}
                  value={citizenComment}
                  onChange={e => setCitizenComment(e.target.value)}
                  placeholder="Share your experience regarding work speed, quality, or local neighborhood impact..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:border-blue-600 outline-none resize-none"
                />

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Submit Citizen Review
                </button>
              </form>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Thank you! Your feedback has been recorded in the public accountability ledger.
              </div>
            )}

            {/* List of existing ratings */}
            <div className="space-y-2.5 pt-2">
              {project.ratings.map(r => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {r.citizenName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{r.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{r.comment}</p>
                  <div className="text-[10px] text-slate-400">{r.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Accountability Chain & Geospatial Pin */}
        <div className="space-y-6">
          
          {/* Full Accountability Chain */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
            <AccountabilityChain accountability={project.accountability} />
          </div>

          {/* Project Location Geospatial Map */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                Geospatial Pinpoint
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                {project.coordinates.join(', ')}
              </span>
            </div>

            <CivicMap
              projects={[project]}
              districtId={currentDistrictId}
              height="220px"
              selectedProjectId={project.id}
              center={project.coordinates}
              zoom={14}
              interactive={true}
            />

            <div className="text-[11px] text-slate-500 font-medium">
              📍 Exact municipal site coordinates in {project.sector}, {currentDistrict.name}.
            </div>
          </div>

          {/* Expected Outcome */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-3xl border border-blue-200 p-6 shadow-2xs space-y-2">
            <div className="text-[10px] uppercase font-black tracking-wider text-blue-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Expected Civic Outcome
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {project.expectedOutcome}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
