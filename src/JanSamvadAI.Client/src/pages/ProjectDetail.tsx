import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { 
  Building2, 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  FileText, 
  Send,
  CreditCard,
  Briefcase,
  Layers,
  MapPin
} from 'lucide-react'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()

  const [project, setProject] = useState<any>(null)
  const [financials, setFinancials] = useState<any>(null)
  const [contractors, setContractors] = useState<any[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [delays, setDelays] = useState<any[]>([])
  const [updates, setUpdates] = useState<any[]>([])

  const [activeTab, setActiveTab] = useState<'financials' | 'milestones' | 'contractors'>('financials')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // New update form
  const [updateDesc, setUpdateDesc] = useState('')
  const [updateProgress, setUpdateProgress] = useState<number | ''>('')
  const [postingUpdate, setPostingUpdate] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const fetchAllDetails = async () => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const [projRes, finRes, contRes, mlsRes, txRes, delRes, updRes] = await Promise.allSettled([
        api.get(`/api/projects/${id}`),
        api.get(`/api/projects/${id}/financial-summary`),
        api.get(`/api/projects/${id}/contractors`),
        api.get(`/api/projects/${id}/milestones`),
        api.get(`/api/projects/${id}/transactions`),
        api.get(`/api/projects/${id}/delays`),
        api.get(`/api/projects/${id}/updates`)
      ])

      if (projRes.status === 'fulfilled' && projRes.value.data?.data) {
        setProject(projRes.value.data.data)
      } else {
        throw new Error('Project not found')
      }

      if (finRes.status === 'fulfilled') setFinancials(finRes.value.data?.data)
      if (contRes.status === 'fulfilled') setContractors(contRes.value.data?.data || [])
      if (mlsRes.status === 'fulfilled') setMilestones(mlsRes.value.data?.data || [])
      if (txRes.status === 'fulfilled') setTransactions(txRes.value.data?.data || [])
      if (delRes.status === 'fulfilled') setDelays(delRes.value.data?.data || [])
      if (updRes.status === 'fulfilled') setUpdates(updRes.value.data?.data || [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load project details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllDetails()
  }, [id])

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !updateDesc.trim()) return

    setPostingUpdate(true)
    setUpdateSuccess(false)

    try {
      await api.post(`/api/projects/${id}/updates`, {
        description: updateDesc,
        progressPercentage: updateProgress !== '' ? Number(updateProgress) : undefined
      })
      setUpdateDesc('')
      setUpdateProgress('')
      setUpdateSuccess(true)
      // refresh updates
      const res = await api.get(`/api/projects/${id}/updates`)
      if (res.data?.data) setUpdates(res.data.data)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to post update')
    } finally {
      setPostingUpdate(false)
    }
  }

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return '₹0'
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium">Loading project intelligence...</p>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-4">
        <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 text-sm">
          {error || 'Project not found.'}
        </div>
        <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to all projects
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Public Audit ID: #{project.id}
        </span>
      </div>

      {/* Main Project Header Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-lg">
                {project.departmentName || 'Public Works'}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                project.status === 'InProgress' ? 'bg-blue-100 text-blue-800' :
                project.status === 'OnHold' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {project.status}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {project.name}
            </h1>
            <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Progress Widget */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 min-w-[200px] text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Physical Progress
            </div>
            <div className="text-3xl font-black text-slate-900">
              {project.progressPercentage}%
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, project.progressPercentage))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Project Meta Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Ward Locality</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> Ward #{project.wardId}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Created Date</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Data Integrity</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {project.dataSource} (Verified)
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Total Transactions</span>
            <span className="font-bold text-blue-600 mt-0.5 block">
              {transactions.length} Disbursements
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('financials')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'financials'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Financial Transparency & Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'milestones'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Milestones & Delays</span>
        </button>

        <button
          onClick={() => setActiveTab('contractors')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'contractors'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Contractors & Field Updates</span>
        </button>
      </div>

      {/* Tab 1: Financial Transparency */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          {/* Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sanctioned Amount</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatCurrency(financials?.sanctionedAmount)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Government approved ceiling</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Contract Amount</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatCurrency(financials?.contractAmount)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Awarded tender value</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Disbursed (Spent)</span>
              <div className="text-2xl font-extrabold text-blue-600 mt-1">
                {formatCurrency(financials?.totalDisbursedAmount)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                {financials?.utilizationPercentage}% fund utilization
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Remaining Balance</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatCurrency(financials?.remainingAmount)}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Pending milestones release</span>
            </div>
          </div>

          {/* Transactions Ledger Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Financial Disbursement Ledger</h3>
                <p className="text-xs text-slate-500">Every verified milestone payout and contractor invoice</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                {transactions.length} Records
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No transactions recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Reference #</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-right">Disbursed Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 text-xs font-medium text-slate-600">{tx.transactionDate}</td>
                        <td className="py-3 px-4 text-xs font-mono text-blue-600 font-bold">{tx.referenceNumber || `TX-${tx.id}`}</td>
                        <td className="py-3 px-4 text-xs">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                            {tx.transactionType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">{tx.description}</td>
                        <td className="py-3 px-4 text-xs font-bold text-slate-900 text-right">
                          {formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Milestones & Delays */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          {/* Milestones List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">Project Milestones Timeline</h3>
            <div className="space-y-4">
              {milestones.length === 0 ? (
                <div className="text-xs text-slate-400">No milestones configured.</div>
              ) : (
                milestones.map((m, idx) => (
                  <div key={m.id || idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {m.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 pl-8">
                        Planned Date: {m.plannedDate || 'N/A'} {m.actualDate && `• Actual Date: ${m.actualDate}`}
                      </div>
                    </div>

                    <div className="sm:w-48 pl-8 sm:pl-0">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-500">Progress</span>
                        <span className="text-slate-800">{m.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, m.completionPercentage))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Delay Records */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Official Delay Logs & Obstructions
            </h3>
            {delays.length === 0 ? (
              <p className="text-xs text-slate-500">No formal delays recorded for this project.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {delays.map(d => (
                  <div key={d.id} className="py-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>Reason: {d.reason}</span>
                      <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        +{d.delayDays} days delay
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1">{d.description}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Reported by: {d.reportedByName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Contractors & Updates */}
      {activeTab === 'contractors' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contractors Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Assigned Contractors
            </h3>
            {contractors.length === 0 ? (
              <p className="text-xs text-slate-500">No contractor details assigned.</p>
            ) : (
              contractors.map(c => (
                <div key={c.contractorId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{c.companyName}</h4>
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {c.contractorRole}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Reg #: <span className="font-mono text-slate-800 font-semibold">{c.registrationNumber}</span></div>
                    <div>Contact: <span className="text-slate-800">{c.contactInformation || 'N/A'}</span></div>
                    <div>Address: <span className="text-slate-800">{c.address || 'District Registered'}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Project Updates Feed & Post update form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Official Field Reports & Updates
            </h3>

            {/* Post update form if authenticated */}
            {user && (
              <form onSubmit={handlePostUpdate} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700">Submit Project Progress Report</div>
                <textarea
                  required
                  rows={2}
                  value={updateDesc}
                  onChange={e => setUpdateDesc(e.target.value)}
                  placeholder="Enter milestone completion notes, inspection findings..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:border-blue-600 outline-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={updateProgress}
                    onChange={e => setUpdateProgress(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="New progress % (e.g. 75)"
                    className="p-2 rounded-lg border border-slate-300 text-xs w-36"
                  />
                  <button
                    type="submit"
                    disabled={postingUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{postingUpdate ? 'Posting...' : 'Post Update'}</span>
                  </button>
                </div>
                {updateSuccess && (
                  <div className="text-xs text-emerald-600 font-semibold">Report published successfully!</div>
                )}
              </form>
            )}

            <div className="space-y-3 divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
              {updates.length === 0 ? (
                <p className="text-xs text-slate-500">No field updates posted yet.</p>
              ) : (
                updates.map(u => (
                  <div key={u.id} className="pt-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{u.authorName}</span>
                      <span className="text-[10px] text-slate-400">{new Date(u.updateDate || u.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600">{u.description}</p>
                    {u.progressPercentage !== null && (
                      <span className="inline-block bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                        Progress: {u.progressPercentage}%
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
