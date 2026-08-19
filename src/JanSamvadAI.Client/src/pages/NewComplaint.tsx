import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import {
  MessageSquareCheck,
  Sparkles,
  MapPin,
  Building2,
  FolderKanban,
  Send,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function NewComplaint() {
  const { currentDistrict, currentUser, createGrievance } = useJanSamvad()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const prefillProjectId = searchParams.get('projectId') || ''
  const prefillSector = searchParams.get('sector') || currentDistrict.projects[0]?.sector || 'Sector 15'
  const prefillTitle = searchParams.get('title') || ''

  const [title, setTitle] = useState(prefillTitle)
  const [description, setDescription] = useState('')
  const [sector, setSector] = useState(prefillSector)
  const [projectId, setProjectId] = useState(prefillProjectId)
  const [locationDetails, setLocationDetails] = useState('')
  const [priority, setPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('Medium')

  // Simulated AI auto-classification state
  const [aiDepartment, setAiDepartment] = useState('Water Supply Department')
  const [aiConfidence, setAiConfidence] = useState(94)

  useEffect(() => {
    const text = (title + ' ' + description).toLowerCase()
    if (text.includes('water') || text.includes('pipeline') || text.includes('tap') || text.includes('pressure')) {
      setAiDepartment('Water Supply Department')
      setAiConfidence(96)
    } else if (text.includes('road') || text.includes('pothole') || text.includes('asphalt') || text.includes('footpath')) {
      setAiDepartment('Public Works Department')
      setAiConfidence(95)
    } else if (text.includes('drain') || text.includes('waterlog') || text.includes('sewage') || text.includes('clog')) {
      setAiDepartment('Drainage Department')
      setAiConfidence(93)
    } else if (text.includes('light') || text.includes('pole') || text.includes('dark') || text.includes('lamp') || text.includes('wire')) {
      setAiDepartment('Electrical Department')
      setAiConfidence(94)
    } else if (text.includes('park') || text.includes('tree') || text.includes('grass') || text.includes('swing') || text.includes('bench')) {
      setAiDepartment('Parks & Recreation Department')
      setAiConfidence(92)
    }
  }, [title, description])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    const matchedProject = currentDistrict.projects.find(p => p.id === projectId)

    const newId = createGrievance({
      title: title.trim(),
      description: description.trim(),
      sector,
      category: 'CIVIC_DEFECT',
      department: aiDepartment,
      priority,
      projectId: projectId || undefined,
      projectName: matchedProject?.name || undefined,
      locationDetails: locationDetails.trim() || `${sector}, near Main Avenue`,
      aiDepartmentConfidence: aiConfidence
    })

    navigate(`/complaints/${newId}`)
  }

  // Pre-fill quick samples
  const quickSamples = [
    {
      title: 'Low Water Pressure in Residential Area — Sector 15',
      desc: 'Severe drop in water supply pressure since the municipal pipeline construction began.',
      sector: 'Sector 15',
      loc: 'Block B, Lane 2, Sector 15'
    },
    {
      title: 'Damaged Road Surface with Deep Potholes — Sector 7',
      desc: 'Large potholes formed after rainfall causing traffic disruption near market entry.',
      sector: 'Sector 7',
      loc: 'Main Market Entry Road, Sector 7'
    },
    {
      title: 'Street Lights Non-Functional After 7 PM — Sector 12',
      desc: 'Four street lights on Main Street have been dark for 4 consecutive nights.',
      sector: 'Sector 12',
      loc: 'Opposite Community Hall, Sector 12'
    }
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <Link
          to="/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grievances</span>
        </Link>
        <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-md">
          📍 {currentDistrict.name} Municipal Portal
        </span>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        
        {/* Title */}
        <div className="space-y-1 pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider">
            <MessageSquareCheck className="w-3.5 h-3.5" />
            <span>Public Redressal</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Submit Civic Issue & Grievance
          </h1>
          <p className="text-xs text-slate-500">
            Automated AI departmental routing with auditable timeline escalation in {currentDistrict.name}
          </p>
        </div>

        {/* Quick Samples Autofill */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            1-Click Sample Issues (Quick Fill):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {quickSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTitle(sample.title)
                  setDescription(sample.desc)
                  setSector(sample.sector)
                  setLocationDetails(sample.loc)
                }}
                className="p-2 text-left rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-700 shadow-2xs transition"
              >
                <div className="truncate font-bold">{sample.title.split('—')[0]}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">📍 {sample.sector}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Issue Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Grievance Subject / Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Low Water Pressure in Residential Area — Sector 15"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          {/* Area & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sector / Locality
              </label>
              <input
                type="text"
                required
                value={sector}
                onChange={e => setSector(e.target.value)}
                placeholder="e.g. Sector 15"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Severity / Priority Level
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 outline-none"
              >
                <option value="Medium">Medium Priority (Standard SLA)</option>
                <option value="High">High Priority (Within 48 hours)</option>
                <option value="Critical">Critical (Immediate Public Hazard)</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Optional Project Connection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Link Related Government Project (Optional)</span>
              <span className="text-[10px] text-blue-600 font-semibold">Connects directly to project accountability</span>
            </label>
            <select
              value={projectId}
              onChange={e => {
                setProjectId(e.target.value)
                const matched = currentDistrict.projects.find(p => p.id === e.target.value)
                if (matched) setSector(matched.sector)
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 outline-none"
            >
              <option value="">-- Standalone Civic Issue (No specific project linked) --</option>
              {currentDistrict.projects.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.sector}] {p.name} ({p.department})
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issue Description & Impact
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide exact details regarding duration of issue, affected blocks, hazard level, or previous complaints..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs md:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
            />
          </div>

          {/* Landmark / Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Exact Landmark / Address Details
            </label>
            <input
              type="text"
              value={locationDetails}
              onChange={e => setLocationDetails(e.target.value)}
              placeholder="e.g. House No. 142, Block B, opposite Community Center"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-blue-600 outline-none"
            />
          </div>

          {/* AI Auto-Classification Feedback Box */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-indigo-700">
                  AI Department Auto-Routing Analysis
                </div>
                <div className="text-xs font-extrabold text-indigo-950">
                  Assigned: {aiDepartment}
                </div>
              </div>
            </div>
            <span className="text-xs font-extrabold text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-200 shadow-2xs">
              {aiConfidence}% Match
            </span>
          </div>

          {/* Action */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              to="/complaints"
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit & Log Grievance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
