import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import { CitizenRecord } from '../types'
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Landmark,
  UserCheck,
  Building2,
  ShieldAlert,
  Shield,
  Sparkles
} from 'lucide-react'

export default function Login() {
  const { loginWithGovId, loginAsRole } = useJanSamvad()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'citizen' | 'officials'>('citizen')

  // Citizen form state
  const [govId, setGovId] = useState('GOV-HR-FBD-10021')
  const [pinCode, setPinCode] = useState('121001')
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean
    user?: CitizenRecord
    error?: string
  } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  // Sample Pseudo Citizen IDs from requirements
  const sampleCitizens = [
    {
      name: 'Rahul Sharma',
      govId: 'GOV-HR-FBD-10021',
      pin: '121001',
      district: 'Faridabad',
      rep: 'Aarav Sharma'
    },
    {
      name: 'Aisha Khan',
      govId: 'GOV-HR-FBD-10022',
      pin: '121003',
      district: 'Faridabad',
      rep: 'Aarav Sharma'
    },
    {
      name: 'Arjun Verma',
      govId: 'GOV-HR-FBD-10023',
      pin: '121006',
      district: 'Faridabad',
      rep: 'Aarav Sharma'
    },
    {
      name: 'Priya Singh',
      govId: 'GOV-HR-GGM-20021',
      pin: '122001',
      district: 'Gurugram',
      rep: 'Meera Kapoor'
    },
    {
      name: 'Rohan Mehta',
      govId: 'GOV-HR-GGM-20022',
      pin: '122002',
      district: 'Gurugram',
      rep: 'Meera Kapoor'
    },
    {
      name: 'Sana Kapoor',
      govId: 'GOV-HR-GGM-20023',
      pin: '122018',
      district: 'Gurugram',
      rep: 'Meera Kapoor'
    }
  ]

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setVerificationResult(null)

    setTimeout(() => {
      const res = loginWithGovId(govId, pinCode)
      if (res.success && res.user) {
        setVerificationResult({ verified: true, user: res.user })
      } else {
        setVerificationResult({ verified: false, error: res.error })
      }
      setIsVerifying(false)
    }, 400)
  }

  const handleProceed = () => {
    navigate('/')
  }

  return (
    <div className="max-w-xl mx-auto my-6 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3.5 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
          <Landmark className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          JanSamvad <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500 font-medium">
          Democratic District Accountability & Civic Verification Platform
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex rounded-2xl bg-slate-200/80 p-1 text-xs font-bold shadow-inner">
        <button
          type="button"
          onClick={() => {
            setActiveTab('citizen')
            setVerificationResult(null)
          }}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'citizen'
              ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Citizen ID Verification</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('officials')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'officials'
              ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span>Representatives & Officers</span>
        </button>
      </div>

      {/* Tab 1: Citizen Simulated Gov ID Login */}
      {activeTab === 'citizen' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8 space-y-6">
          
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Citizen Identity Verification
            </h2>
            <p className="text-xs text-slate-500">
              Enter your simulated government ID and postal PIN to determine your district & representative.
            </p>
          </div>

          {/* Sample IDs Quick Fill */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Sample Demo Identities (1-Click Select):
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sampleCitizens.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setGovId(c.govId)
                    setPinCode(c.pin)
                    setVerificationResult(null)
                  }}
                  className={`p-2 text-left rounded-xl border text-xs font-semibold transition ${
                    govId === c.govId
                      ? 'bg-blue-50 border-blue-400 text-blue-900 ring-1 ring-blue-400 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="truncate text-slate-900">{c.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{c.govId}</div>
                  <div className="text-[10px] text-blue-600 font-bold">📍 {c.district}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCitizenSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Government ID
              </label>
              <input
                type="text"
                required
                value={govId}
                onChange={e => {
                  setGovId(e.target.value)
                  setVerificationResult(null)
                }}
                placeholder="e.g. GOV-HR-FBD-10021"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Postal PIN Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={pinCode}
                onChange={e => {
                  setPinCode(e.target.value)
                  setVerificationResult(null)
                }}
                placeholder="e.g. 121001"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isVerifying ? (
                <span>Verifying Identity...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Identity</span>
                </>
              )}
            </button>
          </form>

          {/* Verification Feedback Result */}
          {verificationResult && (
            <div className="animate-in fade-in zoom-in-95 duration-150">
              {verificationResult.verified && verificationResult.user ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
                  <div className="space-y-1 text-xs text-emerald-950 font-bold">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>✓ Identity Verified ({verificationResult.user.name})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>✓ PIN Verified ({verificationResult.user.pinCode})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-sm pt-1">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span>District Assigned: {verificationResult.user.districtName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 text-xs">
                      <Landmark className="w-3.5 h-3.5 text-blue-600" />
                      <span>Assigned Representative: <strong>{verificationResult.user.representativeName}</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleProceed}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Continue to JanSamvad Feed</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{verificationResult.error || 'Government ID or PIN could not be verified.'}</span>
                </div>
              )}
            </div>
          )}

          {/* Prototype Notice Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-700">Prototype Environment: </span>
            Government ID verification is simulated using sample data. No real government identity database (Aadhaar, ECI) is connected.
          </div>
        </div>
      )}

      {/* Tab 2: Officials & Role Login */}
      {activeTab === 'officials' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              Democratic Role & Official Logins
            </h2>
            <p className="text-xs text-slate-500">
              Select an elected representative, opposition scrutinizer, or department officer to test specialized permissions:
            </p>
          </div>

          <div className="space-y-3">
            {/* Faridabad Group */}
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Faridabad District Roles
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('representative', 'faridabad')
                    navigate('/')
                  }}
                  className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition"
                >
                  <div className="font-extrabold text-blue-950 text-xs">Aarav Sharma</div>
                  <div className="text-[10px] text-blue-700 font-semibold">District Representative (FBD)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('opposition', 'faridabad')
                    navigate('/scrutiny')
                  }}
                  className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition"
                >
                  <div className="font-extrabold text-amber-950 text-xs">Rohan Mehta</div>
                  <div className="text-[10px] text-amber-700 font-semibold">Opposition Representative (FBD)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('officer', 'faridabad', 'off-fbd-01')
                    navigate('/projects')
                  }}
                  className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition"
                >
                  <div className="font-extrabold text-purple-950 text-xs">Anita Sharma</div>
                  <div className="text-[10px] text-purple-700 font-semibold">Assistant Engineer (Water Supply)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('officer', 'faridabad', 'off-fbd-02')
                    navigate('/projects')
                  }}
                  className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition"
                >
                  <div className="font-extrabold text-purple-950 text-xs">Rajiv Mehta</div>
                  <div className="text-[10px] text-purple-700 font-semibold">Executive Engineer (Water Supply)</div>
                </button>
              </div>
            </div>

            {/* Gurugram Group */}
            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Gurugram District Roles
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('representative', 'gurugram')
                    navigate('/')
                  }}
                  className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition"
                >
                  <div className="font-extrabold text-blue-950 text-xs">Meera Kapoor</div>
                  <div className="text-[10px] text-blue-700 font-semibold">District Representative (GGM)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('opposition', 'gurugram')
                    navigate('/scrutiny')
                  }}
                  className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition"
                >
                  <div className="font-extrabold text-amber-950 text-xs">Sana Khan</div>
                  <div className="text-[10px] text-amber-700 font-semibold">Opposition Representative (GGM)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('officer', 'gurugram', 'off-ggm-01')
                    navigate('/projects')
                  }}
                  className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition"
                >
                  <div className="font-extrabold text-purple-950 text-xs">Deepak Malhotra</div>
                  <div className="text-[10px] text-purple-700 font-semibold">Executive Engineer (PWD)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('admin', 'gurugram')
                    navigate('/accountability')
                  }}
                  className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-left transition"
                >
                  <div className="font-extrabold text-rose-950 text-xs">Municipal Administrator</div>
                  <div className="text-[10px] text-rose-700 font-semibold">Full System Oversight</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
