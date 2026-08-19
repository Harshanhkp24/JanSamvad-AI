import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import { ClaimCategory, OppositionQuestion } from '../types'
import {
  ShieldAlert,
  HelpCircle,
  PlusCircle,
  ThumbsUp,
  Building2,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react'

const CLAIM_CATEGORIES: ClaimCategory[] = [
  'Progress Discrepancy',
  'Budget Concern',
  'Delay',
  'Quality Concern',
  'Transparency Concern',
  'Citizen Impact',
  'Missing Information',
  'Contractor Concern',
  'Public Safety',
  'Environmental Concern'
]

export default function Scrutiny() {
  const {
    currentDistrict,
    currentUser,
    currentDistrictId,
    createOppositionQuestion,
    answerOppositionQuestion,
    supportQuestion
  } = useJanSamvad()

  const opp = currentDistrict.opposition
  const questions = currentDistrict.oppositionQuestions

  // New question form state
  const [showNewQModal, setShowNewQModal] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(currentDistrict.projects[0]?.id || '')
  const [selectedCategory, setSelectedCategory] = useState<ClaimCategory>('Delay')
  const [questionText, setQuestionText] = useState('')

  // Answer modal state
  const [answeringQ, setAnsweringQ] = useState<OppositionQuestion | null>(null)
  const [govResponseText, setGovResponseText] = useState('')

  // Filter
  const [filterCategory, setFilterCategory] = useState<string>('')

  const filteredQuestions = questions.filter(q => {
    if (filterCategory && q.claimCategory !== filterCategory) return false
    return true
  })

  // Counters
  const projectsUnderReview = currentDistrict.projects.filter(p => p.status === 'Delayed' || p.status === 'Ongoing').length
  const answeredCount = questions.filter(q => q.status === 'Answered').length
  const pendingCount = questions.filter(q => q.status === 'Pending Response' || q.status === 'Under Review').length

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionText.trim()) return

    const matchedProject = currentDistrict.projects.find(p => p.id === selectedProjectId)

    createOppositionQuestion({
      projectId: selectedProjectId || undefined,
      projectName: matchedProject ? `${matchedProject.name} (${matchedProject.sector})` : 'General District Administration',
      department: matchedProject ? matchedProject.department : 'Municipal Administration',
      questionText: questionText.trim(),
      claimCategory: selectedCategory
    })

    setQuestionText('')
    setShowNewQModal(false)
  }

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answeringQ || !govResponseText.trim()) return

    answerOppositionQuestion(answeringQ.id, govResponseText.trim())
    setGovResponseText('')
    setAnsweringQ(null)
  }

  const isOppositionOrAdmin = currentUser?.role === 'opposition' || currentUser?.role === 'admin'
  const isOfficerOrAdmin = currentUser?.role === 'officer' || currentUser?.role === 'admin'

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">
              📍 {currentDistrict.name} Democratic Scrutiny
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-amber-600" />
            Public Scrutiny & Opposition Inquiry Portal
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">
            Independent institutional questioning of budget overruns, execution delays, and civic contractor performance
          </p>
        </div>

        {/* Create Scrutiny Question Button */}
        {isOppositionOrAdmin && (
          <button
            onClick={() => setShowNewQModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition self-start md:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise Public Scrutiny Inquiry</span>
          </button>
        )}
      </div>

      {/* Opposition Representative Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-md border border-amber-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-400/50 overflow-hidden flex-shrink-0">
              <img
                src={opp.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
                alt={opp.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                Official Opposition Representative &bull; {currentDistrict.name}
              </div>
              <h2 className="text-2xl font-black text-white">{opp.name}</h2>
              <div className="text-xs text-slate-300">{opp.partyName}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
            <div className="p-2">
              <div className="text-lg font-black text-white">{projectsUnderReview}</div>
              <div className="text-[10px] text-amber-300 uppercase font-bold">Under Review</div>
            </div>
            <div className="p-2">
              <div className="text-lg font-black text-amber-400">{questions.length}</div>
              <div className="text-[10px] text-slate-300 uppercase font-bold">Questions Logged</div>
            </div>
            <div className="p-2">
              <div className="text-lg font-black text-emerald-400">{answeredCount}</div>
              <div className="text-[10px] text-slate-300 uppercase font-bold">Clarified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterCategory('')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            filterCategory === ''
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Scrutiny Categories ({questions.length})
        </button>
        {CLAIM_CATEGORIES.map(cat => {
          const count = questions.filter(q => q.claimCategory === cat).length
          if (count === 0 && filterCategory !== cat) return null
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                filterCategory === cat
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* Questions Stream */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="font-extrabold text-slate-800 text-base">No scrutiny inquiries found</h3>
            <p className="text-xs text-slate-500">
              No opposition questions match this category in {currentDistrict.name}.
            </p>
          </div>
        ) : (
          filteredQuestions.map(q => (
            <div
              key={q.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    {q.questionId}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {q.projectName}
                  </span>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {q.department}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {q.claimCategory}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      q.status === 'Answered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
              </div>

              {/* Inquiry Question Text */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase">
                  Institutional Inquiry by {q.raisedBy} ({q.raisedDate})
                </div>
                <p className="text-slate-900 text-sm md:text-base font-semibold leading-relaxed">
                  "{q.questionText}"
                </p>
              </div>

              {/* Official Government Clarification / Response */}
              {q.govResponseText ? (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Official Government Response ({q.responseOfficerName} — {q.responseOfficerDesignation})
                    </span>
                    <span className="text-[10px] text-emerald-700">{q.responseDate}</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed font-medium">
                    {q.govResponseText}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <span className="italic flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Awaiting official response from {q.department}...
                  </span>

                  {/* Officer Action to Answer */}
                  {isOfficerOrAdmin && (
                    <button
                      onClick={() => setAnsweringQ(q)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-2xs"
                    >
                      Answer Inquiry
                    </button>
                  )}
                </div>
              )}

              {/* Citizen Support Bar & Project Link */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => supportQuestion(q.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                    q.supportedByUser
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>{q.citizenSupports} Citizens Support This Concern</span>
                </button>

                {q.projectId && (
                  <Link
                    to={`/projects/${q.projectId}`}
                    className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline text-xs"
                  >
                    View Connected Project Data <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 1. Modal for Raising New Question */}
      {showNewQModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-amber-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Raise Scrutiny Inquiry</h3>
                  <p className="text-xs text-slate-500">
                    Logged under {opp.name} ({currentDistrict.name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewQModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Municipal Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={e => setSelectedProjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-amber-600 outline-none"
                >
                  <option value="">-- General District Municipal Administration --</option>
                  {currentDistrict.projects.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.sector}] {p.name} ({p.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Claim & Inquiry Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value as ClaimCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-amber-600 outline-none"
                >
                  {CLAIM_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Formal Institutional Question Text
                </label>
                <textarea
                  required
                  rows={4}
                  value={questionText}
                  onChange={e => setQuestionText(e.target.value)}
                  placeholder="e.g. Why has the Sector 43 drainage project exceeded its completion date while ₹2.5 Cr expenditure is reported? Please clarify reasons for delay..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs md:text-sm focus:border-amber-600 outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewQModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal for Officer Answering Question */}
      {answeringQ && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-emerald-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Official Department Answer</h3>
                  <p className="text-xs text-slate-500">
                    Responding to Question {answeringQ.questionId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAnsweringQ(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 my-4">
              <span className="font-bold">Inquiry: </span>"{answeringQ.questionText}"
            </div>

            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Technical / Financial Response
                </label>
                <textarea
                  required
                  rows={4}
                  value={govResponseText}
                  onChange={e => setGovResponseText(e.target.value)}
                  placeholder="Provide technical justifications, survey details, revised milestones, or penalty clauses..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs md:text-sm focus:border-emerald-600 outline-none resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAnsweringQ(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Official Answer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
