import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, ShieldCheck, UserCheck, ArrowRight, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const demoAccounts = [
    { role: 'Representative', email: 'representative@jansamvad.demo', color: 'border-blue-500 hover:bg-blue-50 text-blue-700' },
    { role: 'Citizen', email: 'citizen@jansamvad.demo', color: 'border-emerald-500 hover:bg-emerald-50 text-emerald-700' },
    { role: 'Officer', email: 'officer@jansamvad.demo', color: 'border-purple-500 hover:bg-purple-50 text-purple-700' },
    { role: 'Opposition', email: 'opposition@jansamvad.demo', color: 'border-amber-500 hover:bg-amber-50 text-amber-700' },
    { role: 'Admin', email: 'admin@jansamvad.demo', color: 'border-rose-500 hover:bg-rose-50 text-rose-700' },
  ]

  const selectDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('P@ssword1!')
    setError(null)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await api.post('/api/auth/login', { email, password })
      const token = res.data.data.token
      const userData = res.data.data.user

      // Fetch user profile to ensure roles are populated
      try {
        localStorage.setItem('token', token)
        const meRes = await api.get('/api/auth/me')
        if (meRes.data?.data) {
          userData.roles = meRes.data.data.roles || []
        }
      } catch (err) {
        console.warn('Could not fetch extra roles', err)
      }

      login(token, userData)
      setLoading(false)
      nav('/')
    } catch (ex: any) {
      setLoading(false)
      const resp = ex?.response?.data
      if (resp) {
        if (resp.errors) setError(Array.isArray(resp.errors) ? resp.errors.join('; ') : String(resp.errors))
        else if (resp.message) setError(resp.message)
        else setError(JSON.stringify(resp))
      } else {
        setError(ex?.message || 'Login failed. Please check your credentials or backend server.')
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto my-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-full bg-blue-100 text-blue-700 mb-3 shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">JanSamvad AI Portal</h1>
        <p className="text-slate-600 mt-2 text-sm">
          Civic Intelligence, Public Fund Auditing & Automated Grievance Redressal
        </p>
      </div>

      {/* Demo Account Quick Switcher */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Quick 1-Click Demo Login
          </div>
          <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
            Auto-fills `P@ssword1!`
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {demoAccounts.map(acc => (
            <button
              key={acc.email}
              type="button"
              onClick={() => selectDemoAccount(acc.email)}
              className={`p-2 text-left rounded-xl border transition-all text-xs font-semibold flex flex-col justify-between bg-white shadow-sm ${acc.color} ${email === acc.email ? 'ring-2 ring-blue-500 font-bold' : ''}`}
            >
              <span>{acc.role}</span>
              <span className="text-[10px] text-slate-400 font-normal truncate mt-0.5">{acc.email.split('@')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={submit} className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-md">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl mb-5 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="whitespace-pre-wrap">{error}</div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. representative@jansamvad.demo"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="text-center text-xs text-slate-400 mt-4">
          Synthetic Prototype &bull; Local Development Only
        </div>
      </form>
    </div>
  )
}
