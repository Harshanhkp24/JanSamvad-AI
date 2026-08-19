import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { 
  PlusCircle, 
  ArrowLeft, 
  Sparkles, 
  Send, 
  Building, 
  MapPin, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

export default function NewComplaint() {
  const nav = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [wardId, setWardId] = useState<number>(1)
  const [location, setLocation] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Live AI Prediction state
  const [aiPreview, setAiPreview] = useState<{
    department: string
    category: string
    confidence: number
  } | null>(null)

  // Dynamic client-side heuristic preview as user types
  useEffect(() => {
    const combined = `${title} ${description}`.toLowerCase().trim()
    if (combined.length < 5) {
      setAiPreview(null)
      return
    }

    if (combined.includes('pothole') || combined.includes('road') || combined.includes('tar') || combined.includes('flyover') || combined.includes('footpath')) {
      setAiPreview({ department: 'Roads & Infrastructure', category: 'ROAD_DAMAGE', confidence: 91 })
    } else if (combined.includes('water') || combined.includes('pipe') || combined.includes('drinking') || combined.includes('leak')) {
      setAiPreview({ department: 'Water Supply', category: 'WATER_SUPPLY', confidence: 94 })
    } else if (combined.includes('light') || combined.includes('power') || combined.includes('electric') || combined.includes('transformer')) {
      setAiPreview({ department: 'Electricity', category: 'STREET_LIGHT', confidence: 89 })
    } else if (combined.includes('drain') || combined.includes('sewer') || combined.includes('gutter') || combined.includes('overflow')) {
      setAiPreview({ department: 'Drainage', category: 'DRAINAGE', confidence: 92 })
    } else if (combined.includes('garbage') || combined.includes('waste') || combined.includes('trash') || combined.includes('clean')) {
      setAiPreview({ department: 'Sanitation', category: 'SANITATION', confidence: 88 })
    } else if (combined.includes('hospital') || combined.includes('clinic') || combined.includes('doctor') || combined.includes('medicine')) {
      setAiPreview({ department: 'Healthcare', category: 'HEALTHCARE', confidence: 87 })
    } else if (combined.includes('school') || combined.includes('teacher') || combined.includes('student') || combined.includes('desk')) {
      setAiPreview({ department: 'Education', category: 'EDUCATION', confidence: 86 })
    } else {
      setAiPreview({ department: 'Public Works', category: 'OTHER', confidence: 60 })
    }
  }, [title, description])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload = {
        wardId: Number(wardId),
        title,
        description,
        location,
        priority
      }

      const res = await api.post('/api/complaints', payload)
      if (res.data?.success && res.data?.data?.id) {
        nav(`/complaints/${res.data.data.id}`)
      } else {
        nav('/complaints')
      }
    } catch (ex: any) {
      setLoading(false)
      const resp = ex?.response?.data
      if (resp?.errors) setError(Array.isArray(resp.errors) ? resp.errors.join('; ') : String(resp.errors))
      else if (resp?.message) setError(resp.message)
      else setError(ex?.message || 'Failed to submit grievance')
    }
  }

  const sampleComplaints = [
    { label: 'Pothole on Main Road', title: 'Severe crater and pothole near market intersection', desc: 'Large crater opened up after recent rainfall creating dangerous hazard for two-wheelers.' },
    { label: 'Water Pipeline Leakage', title: 'Drinking water pipeline ruptured in locality', desc: 'Clean drinking water is overflowing on the street since morning with zero pressure in residential taps.' },
    { label: 'Broken Street Light', title: 'Street light pole non-functional for 5 days', desc: 'Sodium street light has blown fuse leaving the residential alley completely dark at night.' },
    { label: 'Overflowing Sewage Drain', title: 'Manhole overflow and clogged drainage line', desc: 'Sewage drain is backed up with stinking water entering ground floor entrances.' }
  ]

  const autofillSample = (sample: typeof sampleComplaints[0]) => {
    setTitle(sample.title)
    setDescription(sample.desc)
    setLocation('Near Market Square')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <Link to="/complaints" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Grievances</span>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <PlusCircle className="w-7 h-7 text-blue-600" />
          File a Public Civic Grievance
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Our automated NLP model will classify your complaint and route it immediately to the responsible district department.
        </p>
      </div>

      {/* Quick Autofill Sample Templates */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Try a Demo Issue Template:
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleComplaints.map(s => (
            <button
              key={s.label}
              type="button"
              onClick={() => autofillSample(s)}
              className="text-xs bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 font-medium px-3 py-1.5 rounded-xl border border-slate-200 transition shadow-2xs cursor-pointer"
            >
              + {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Grievance Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Brief summary of the issue (e.g. Water pipeline leak near City Hospital)"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Administrative Ward *
            </label>
            <select
              value={wardId}
              onChange={e => setWardId(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-blue-600 outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(w => (
                <option key={w} value={w}>Ward #{w} (Locality {Math.ceil(w/3)}-{((w-1)%3)+1})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Severity / Priority
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-blue-600 outline-none"
            >
              <option value="Low">Low (General Inquiry / Minor)</option>
              <option value="Medium">Medium (Routine Maintenance)</option>
              <option value="High">High (Public Inconvenience)</option>
              <option value="Critical">Critical (Hazard / Emergency)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Specific Landmark / Locality
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Cross road 4, opposite Government School gate"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Detailed Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Explain the problem in detail. Mention when it started, safety risks, or impact on traffic/residents..."
            className="w-full p-4 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
          />
        </div>

        {/* Real-time AI Routing Preview */}
        {aiPreview && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Live AI Department Prediction
              </span>
              <span className="text-[11px] font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                {aiPreview.confidence}% Match
              </span>
            </div>
            <div className="text-xs text-blue-800 flex items-center gap-2">
              <span>Target Department: <strong>{aiPreview.department}</strong></span>
              <span>&bull;</span>
              <span>Category Code: <strong className="font-mono">{aiPreview.category}</strong></span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <span>Submitting to Department...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Civic Grievance</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
