import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import {
  MessageSquareCheck,
  Search,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  MapPin,
  Building2,
  FolderKanban,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react'

interface DuplicateReviewCardProps {
  relationship: any;
  grievances: any[];
  onVerify: (isDuplicate: boolean, remarks: string) => void;
}

const DuplicateReviewCard: React.FC<DuplicateReviewCardProps> = ({ relationship, grievances, onVerify }) => {
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const c1 = grievances.find(x => x.id === relationship.complaintId1 || x.complaintNumber === relationship.complaintNumber1);
  const c2 = grievances.find(x => x.id === relationship.complaintId2 || x.complaintNumber === relationship.complaintNumber2);

  const handleAction = (isDuplicate: boolean) => {
    setLoading(true);
    onVerify(isDuplicate, remarks);
    setLoading(false);
  };

  return (
    <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-200">
        <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          ⚠️ AI Flagged Anomaly: {Math.round(relationship.similarityScore * 100)}% Semantic Match
        </span>
        <span className="text-[10px] text-slate-400 font-bold font-mono">ID: {relationship.id}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[9px] uppercase font-extrabold text-slate-400">Original Complaint ({relationship.complaintNumber1})</span>
          <h4 className="font-extrabold text-slate-900 text-sm">{relationship.title1}</h4>
          <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">{c1?.description || 'Double water piping damage and leakage reported.'}</p>
        </div>

        {/* Flagged Duplicate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[9px] uppercase font-extrabold text-slate-400">Flagged Duplicate ({relationship.complaintNumber2})</span>
          <h4 className="font-extrabold text-slate-900 text-sm">{relationship.title2}</h4>
          <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">{c2?.description || 'Low pressure or pipe damage reported.'}</p>
        </div>
      </div>

      {/* Action Input */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <input
          type="text"
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          placeholder="Optional remarks (e.g. Rejecting as duplicate of JS-2026-0001)..."
          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:border-blue-600 outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleAction(false)}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
          >
            Mark as Independent
          </button>
          <button
            onClick={() => handleAction(true)}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            Confirm Duplicate
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Complaints() {
  const { currentDistrict, currentUser, verifyDuplicateRelationship, getRegionalInsightsLocal } = useJanSamvad()

  const [activeTab, setActiveTab] = useState<'grievances' | 'insights' | 'duplicates'>('grievances')
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedSector, setSelectedSector] = useState('')

  const grievances = currentDistrict.grievances

  const departments = Array.from(new Set(grievances.map(g => g.department)))
  const sectors = Array.from(new Set(grievances.map(g => g.sector)))

  const filteredGrievances = grievances.filter(g => {
    if (search) {
      const q = search.toLowerCase()
      const matches =
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.complaintNumber.toLowerCase().includes(q) ||
        g.sector.toLowerCase().includes(q)
      if (!matches) return false
    }
    if (selectedStatus && g.status !== selectedStatus) return false
    if (selectedDept && g.department !== selectedDept) return false
    if (selectedSector && g.sector !== selectedSector) return false
    return true
  })

  // Counters
  const total = grievances.length
  const openCount = grievances.filter(g => g.status === 'Open').length
  const inProgressCount = grievances.filter(g => g.status === 'InProgress').length
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length

  const isOfficerOrAdmin = currentUser?.role === 'officer' || currentUser?.role === 'admin'

  // Retrieve unverified potential duplicates from local state
  const getPotentialDuplicatesLocal = () => {
    const list: any[] = [];
    const seen = new Set<string>();
    
    grievances.forEach(g => {
      g.potentialDuplicates?.forEach((rel: any) => {
        if (!rel.verifiedById) {
          const pairKey = [rel.complaintId1, rel.complaintId2].sort().join('-');
          if (!seen.has(pairKey)) {
            seen.add(pairKey);
            list.push(rel);
          }
        }
      });
    });
    
    return list;
  };

  const potentialDuplicates = getPotentialDuplicatesLocal();

  const regionalInsights = getRegionalInsightsLocal();

  const resetFilters = () => {
    setSearch('')
    setSelectedStatus('')
    setSelectedDept('')
    setSelectedSector('')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        )
      case 'InProgress':
        return (
          <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        )
      case 'Rejected':
        return (
          <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Rejected (Duplicate)
          </span>
        )
      default:
        return (
          <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Open
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md">
              📍 {currentDistrict.name} Municipal Grievances
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2.5">
            <MessageSquareCheck className="w-7 h-7 text-blue-600" />
            Civic Grievance Redressal Portal
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">
            Report civic defects, link issues to government projects, and track departmental resolution
          </p>
        </div>

        <Link
          to="/complaints/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>File New Grievance</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">Total Registered</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-rose-500">Open Grievances</div>
          <div className="text-2xl font-black text-rose-700 mt-1">{openCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-amber-500">In Progress</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{inProgressCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-bold uppercase text-emerald-600">Resolved</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</div>
        </div>
      </div>

      {/* AI Intelligence & Review Tab Selector */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('grievances')}
          className={`py-3 px-4 text-xs md:text-sm font-extrabold border-b-2 transition cursor-pointer ${
            activeTab === 'grievances'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Active Grievances
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`py-3 px-4 text-xs md:text-sm font-extrabold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'insights'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          AI Regional Intelligence
        </button>
        {isOfficerOrAdmin && (
          <button
            onClick={() => setActiveTab('duplicates')}
            className={`py-3 px-4 text-xs md:text-sm font-extrabold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'duplicates'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Duplicate Review ({potentialDuplicates.length})
          </button>
        )}
      </div>

      {activeTab === 'grievances' && (
        <>
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search title, ID, or sector..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected (Duplicate)</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 outline-none"
                >
                  <option value="">All Departments</option>
                  {departments.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedSector}
                  onChange={e => setSelectedSector(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 outline-none"
                >
                  <option value="">All Sectors</option>
                  {sectors.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(search || selectedStatus || selectedDept || selectedSector) && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">
                  Showing <strong>{filteredGrievances.length}</strong> of {total} grievances
                </span>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-bold transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Grievances List */}
          <div className="space-y-3">
            {filteredGrievances.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <MessageSquareCheck className="w-10 h-10 mx-auto text-slate-300" />
                <h3 className="font-extrabold text-slate-800 text-base">No grievances found</h3>
                <p className="text-xs text-slate-500">
                  Try adjusting your filter settings or search query.
                </p>
              </div>
            ) : (
              filteredGrievances.map(g => (
                <div
                  key={g.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {g.complaintNumber}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {g.sector}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                        <Building2 className="w-3 h-3" />
                        {g.department}
                      </span>
                    </div>
                    {getStatusBadge(g.status)}
                  </div>

                  <div>
                    <Link
                      to={`/complaints/${g.id}`}
                      className="font-extrabold text-slate-900 text-base hover:text-blue-600 transition"
                    >
                      {g.title}
                    </Link>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {g.description}
                    </p>
                  </div>

                  {/* Linked Project & AI Classification */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                      {g.projectId && (
                        <Link
                          to={`/projects/${g.projectId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md hover:underline"
                        >
                          <FolderKanban className="w-3 h-3" />
                          {g.projectName || 'Linked Project'}
                        </Link>
                      )}
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                        AI Routing: {g.aiDepartmentConfidence}% Confidence
                      </span>
                      {g.feedbackRating && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-amber-400" />
                          Citizen Rating: {g.feedbackRating}.0 / 5
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span>Filed by {g.citizenName} &bull; {g.createdAt}</span>
                      <Link
                        to={`/complaints/${g.id}`}
                        className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                      >
                        View Status & Action <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'insights' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-black text-slate-900">Regional Intelligence Trend Analysis</h2>
              <p className="text-xs text-slate-500">Temporal anomaly checks and high-volume category warnings in {currentDistrict.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 text-center">
              <div className="text-[10px] font-bold text-indigo-700 uppercase">Analyzed Grievances</div>
              <div className="text-3xl font-black text-indigo-950 mt-1">{regionalInsights.totalAnalyzed}</div>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-center">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">Primary Region Load</div>
              <div className="text-3xl font-black text-emerald-950 mt-1">{regionalInsights.topSectors[0]?.sector || 'N/A'}</div>
            </div>
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 text-center">
              <div className="text-[10px] font-bold text-rose-700 uppercase">Active Anomalies</div>
              <div className="text-3xl font-black text-rose-950 mt-1">{regionalInsights.insights.length}</div>
            </div>
          </div>

          {/* AI Insights list */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Trend & Spike Observations</h3>
            {regionalInsights.insights.length === 0 ? (
              <div className="text-slate-400 text-xs py-4 text-center">No abnormal spikes or extreme volumes detected. Standard SLA performance active.</div>
            ) : (
              regionalInsights.insights.map((ins, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs">
                    {ins.type === 'SPIKE' ? '📈' : '🚨'}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {ins.type} DETECTED
                      </span>
                      <span className="text-xs font-bold text-slate-800">📍 {ins.sector} &bull; {ins.category.replace('_', ' ')}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{ins.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'duplicates' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <div>
              <h2 className="text-xl font-black text-slate-900">Potential Duplicates Review</h2>
              <p className="text-xs text-slate-500">AI similarity checks that flag duplicate grievances. Review and reject/verify to clean up municipal routing.</p>
            </div>
          </div>

          {potentialDuplicates.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
              <div className="text-sm font-bold text-slate-700">All duplicate checks completed</div>
              <p className="text-xs">No pending potential duplicate complaints need verification.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {potentialDuplicates.map(rel => (
                <DuplicateReviewCard
                  key={rel.id}
                  relationship={rel}
                  grievances={grievances}
                  onVerify={(isDup, rem) => verifyDuplicateRelationship(rel.id, isDup, rem)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
