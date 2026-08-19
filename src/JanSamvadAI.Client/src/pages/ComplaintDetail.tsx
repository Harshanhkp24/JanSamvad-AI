import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { 
  MessageSquareCheck, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  MapPin, 
  Star, 
  Send,
  Building,
  History,
  ShieldAlert,
  ChevronRight
} from 'lucide-react'

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()

  const [complaint, setComplaint] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Status update modal state
  const [newStatus, setNewStatus] = useState('')
  const [statusRemarks, setStatusRemarks] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Citizen feedback state
  const [rating, setRating] = useState<number>(5)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)

  const fetchComplaint = async () => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const res = await api.get(`/api/complaints/${id}`)
      if (res.data?.data) {
        setComplaint(res.data.data)
        setNewStatus(res.data.data.status)
      } else {
        throw new Error('Grievance not found')
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch grievance details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaint()
  }, [id])

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !newStatus) return

    setUpdatingStatus(true)
    try {
      await api.patch(`/api/complaints/${id}/status`, {
        newStatus,
        remarks: statusRemarks
      })
      setStatusRemarks('')
      await fetchComplaint()
      alert('Status updated successfully.')
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update grievance status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setSubmittingFeedback(true)
    setFeedbackSuccess(false)

    try {
      await api.post(`/api/complaints/${id}/feedback`, {
        rating,
        comment: feedbackComment
      })
      setFeedbackComment('')
      setFeedbackSuccess(true)
      await fetchComplaint()
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to record feedback')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium">Loading grievance dossier...</p>
      </div>
    )
  }

  if (error || !complaint) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-4">
        <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 text-sm">
          {error || 'Grievance record not found.'}
        </div>
        <Link to="/complaints" className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Grievances
        </Link>
      </div>
    )
  }

  const aiClassification = complaint.aiClassifications && complaint.aiClassifications.length > 0 ? complaint.aiClassifications[0] : null

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link to="/complaints" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grievances</span>
        </Link>
        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/60">
          {complaint.complaintNumber}
        </span>
      </div>

      {/* Main Grievance Dossier Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg uppercase">
                {complaint.categoryName || 'GENERAL'}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                complaint.status === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                complaint.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {complaint.status}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                complaint.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                complaint.priority === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
              }`}>
                Priority: {complaint.priority}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {complaint.title}
            </h1>
          </div>
        </div>

        {/* Description Body */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Grievance Description
          </div>
          <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
            {complaint.description}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Department Assigned</span>
            <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              {complaint.departmentName || 'Public Works'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Ward Locality</span>
            <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {complaint.wardName || `Ward #${complaint.wardId}`}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Citizen Reporter</span>
            <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-purple-600" />
              {complaint.citizenName}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Date Filed</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* AI Intelligence Classification Badge */}
      {aiClassification && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/70 p-5 rounded-2xl border border-blue-200/80 shadow-xs flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                AI Automated Redressal Routing
              </span>
              <span className="bg-white/80 border border-blue-200 text-blue-700 font-mono px-2 py-0.5 rounded font-bold">
                {Math.round(aiClassification.confidenceScore * 100)}% Confidence
              </span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              Analyzed using <strong>{aiClassification.modelVersion}</strong> NLP engine. Routed automatically to <strong>{aiClassification.recommendedDepartmentName || 'Assigned Department'}</strong> with <strong>{aiClassification.recommendedPriority}</strong> priority recommendation.
            </p>
          </div>
        </div>
      )}

      {/* Officer Action Card (Change Status) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          Administrative Status Transition
        </h3>
        <form onSubmit={handleStatusUpdate} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:w-48">
            <label className="block text-xs font-bold text-slate-600 mb-1">Status</label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 outline-none bg-white"
            >
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-600 mb-1">Audit Remarks</label>
            <input
              type="text"
              value={statusRemarks}
              onChange={e => setStatusRemarks(e.target.value)}
              placeholder="e.g. Field team dispatched, repair completed..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-blue-600 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={updatingStatus}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            {updatingStatus ? 'Updating...' : 'Apply Status'}
          </button>
        </form>
      </div>

      {/* Redressal History Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          Resolution Audit Timeline
        </h3>

        {complaint.history.length === 0 ? (
          <div className="text-xs text-slate-400">No status transitions logged yet.</div>
        ) : (
          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {complaint.history.map((h: any, idx: number) => (
              <div key={h.id || idx} className="flex items-start gap-4 relative pl-1">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold z-10 flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex-1 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Status: <span className="text-blue-700">{h.newStatus}</span>
                      {h.oldStatus && <span className="text-slate-400 font-normal"> (from {h.oldStatus})</span>}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(h.changedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600">{h.remarks || 'Status modified'}</p>
                  <span className="text-[10px] text-slate-400 block font-medium">Logged by: {h.changedByName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Citizen Feedback Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          Citizen Satisfaction & Feedback
        </h3>

        {/* Feedback form */}
        <form onSubmit={handleFeedbackSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs font-bold text-slate-700">Rate the Resolution Quality</div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setRating(st)}
                className="p-1 cursor-pointer transition transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${st <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5 Stars</span>
          </div>

          <textarea
            rows={2}
            value={feedbackComment}
            onChange={e => setFeedbackComment(e.target.value)}
            placeholder="Provide comments regarding resolution speed or officer conduct..."
            className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:border-blue-600 outline-none"
          />

          <button
            type="submit"
            disabled={submittingFeedback}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submittingFeedback ? 'Submitting...' : 'Submit Citizen Rating'}</span>
          </button>

          {feedbackSuccess && (
            <div className="text-xs text-emerald-600 font-semibold">Thank you! Your feedback has been recorded.</div>
          )}
        </form>

        {/* Existing feedback list */}
        {complaint.feedback && complaint.feedback.length > 0 && (
          <div className="divide-y divide-slate-100 pt-2 space-y-3">
            {complaint.feedback.map((f: any) => (
              <div key={f.id} className="pt-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{f.citizenName}</span>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: f.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-500" />
                    ))}
                  </div>
                </div>
                {f.comment && <p className="text-slate-600">{f.comment}</p>}
                <span className="text-[10px] text-slate-400">{new Date(f.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
