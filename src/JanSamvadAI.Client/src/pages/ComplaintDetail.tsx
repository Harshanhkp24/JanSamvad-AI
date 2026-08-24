import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import {
  MessageSquareCheck,
  ArrowLeft,
  MapPin,
  Building2,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Star,
  Send,
  UserCheck,
  ShieldCheck,
  RotateCcw
} from 'lucide-react'

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>()
  const {
    currentDistrict,
    currentUser,
    updateGrievanceStatus,
    submitGrievanceFeedback
  } = useJanSamvad()

  const grievance = currentDistrict.grievances.find(g => g.id === id)

  // Local state for officer resolution remarks
  const [officerRemarks, setOfficerRemarks] = useState('')
  const [targetStatus, setTargetStatus] = useState<'Open' | 'InProgress' | 'Resolved' | 'Rejected'>('Resolved')

  // Local state for citizen rating on resolution
  const [starRating, setStarRating] = useState(5)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  if (!grievance) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-4">
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-3xl text-sm">
          Grievance record not found in {currentDistrict.name} district dataset.
        </div>
        <Link
          to="/complaints"
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to District Grievances
        </Link>
      </div>
    )
  }

  const isOfficerOrAdmin = currentUser?.role === 'officer' || currentUser?.role === 'admin'

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    updateGrievanceStatus(grievance.id, targetStatus, officerRemarks)
    setOfficerRemarks('')
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackComment.trim()) return
    submitGrievanceFeedback(grievance.id, starRating, feedbackComment.trim())
    setFeedbackSubmitted(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Resolved
          </span>
        )
      case 'InProgress':
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> In Progress
          </span>
        )
      default:
        return (
          <span className="bg-rose-100 text-rose-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Open
          </span>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <Link
          to="/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grievances</span>
        </Link>
        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          {grievance.complaintNumber}
        </span>
      </div>

      {/* Main Grievance Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {grievance.sector}, {currentDistrict.name}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                <Building2 className="w-3.5 h-3.5" />
                {grievance.department}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {grievance.title}
            </h1>
          </div>

          <div className="flex-shrink-0">
            {getStatusBadge(grievance.status)}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Complainant</div>
            <div className="font-extrabold text-slate-900 mt-1">{grievance.citizenName}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Filing Date</div>
            <div className="font-extrabold text-slate-900 mt-1">{grievance.createdAt}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Priority</div>
            <div className="font-extrabold text-blue-700 mt-1">{grievance.priority} Priority</div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Detailed Issue Report
          </h3>
          <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-2xl border border-slate-100 font-medium">
            {grievance.description}
          </p>
        </div>

        {/* Location & Linked Project */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Exact Location / Landmark</div>
            <div className="font-semibold text-slate-800">{grievance.locationDetails}</div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
            <div className="text-[10px] font-bold text-blue-700 uppercase">Connected Government Project</div>
            {grievance.projectId ? (
              <Link
                to={`/projects/${grievance.projectId}`}
                className="font-bold text-blue-900 hover:underline flex items-center gap-1 mt-0.5"
              >
                <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
                <span>{grievance.projectName || 'View Connected Project'} &rarr;</span>
              </Link>
            ) : (
              <div className="text-slate-500 italic">No specific project linked (General municipal defect)</div>
            )}
          </div>
        </div>

        {/* Resolution Remarks if any */}
        {grievance.resolutionRemarks && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs">
            <div className="font-extrabold text-emerald-900 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Department Officer Resolution Remarks
            </div>
            <p className="text-emerald-950 leading-relaxed font-medium">
              {grievance.resolutionRemarks}
            </p>
            {grievance.resolvedAt && (
              <div className="text-[10px] text-emerald-700 mt-1">Resolved on {grievance.resolvedAt}</div>
            )}
          </div>
        )}

        {/* Officer Status Management (When logged in as Officer/Admin) */}
        {isOfficerOrAdmin && (
          <form onSubmit={handleStatusUpdate} className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                Department Action Panel (Officer Oversight)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                  Change Status
                </label>
                <select
                  value={targetStatus}
                  onChange={e => setTargetStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white outline-none"
                >
                  <option value="InProgress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Open">Open</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                  Official Action / Resolution Remarks
                </label>
                <input
                  type="text"
                  value={officerRemarks}
                  onChange={e => setOfficerRemarks(e.target.value)}
                  placeholder="e.g. Field inspection complete; pipeline pressure valve calibrated."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
            >
              Update Grievance Status
            </button>
          </form>
        )}

        {/* Citizen Feedback Section (When Grievance is Resolved) */}
        {grievance.status === 'Resolved' && (
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                Citizen Redressal Verification & Feedback
              </h3>
            </div>

            {grievance.feedbackRating ? (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">
                    Complainant Verification Rating:
                  </span>
                  <div className="flex items-center gap-1 font-extrabold text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{grievance.feedbackRating}.0 / 5.0</span>
                  </div>
                </div>
                <p className="text-amber-900 leading-relaxed font-medium">
                  "{grievance.feedbackComment}"
                </p>
              </div>
            ) : !feedbackSubmitted ? (
              <form onSubmit={handleFeedbackSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800">
                  Was your issue resolved satisfactorily by the department?
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className="p-1 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= starRating
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {starRating} Stars
                  </span>
                </div>

                <textarea
                  required
                  rows={2}
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                  placeholder="Share feedback on resolution quality (e.g., 'Water supply has improved, pressure is consistent')..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:border-blue-600 outline-none resize-none"
                />

                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Submit Redressal Feedback
                </button>
              </form>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Thank you! Your citizen satisfaction rating has been recorded in the public ledger.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
