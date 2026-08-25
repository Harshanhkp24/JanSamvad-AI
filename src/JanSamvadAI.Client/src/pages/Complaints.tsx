import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import {
  Search,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  MapPin,
  Building2,
  FolderKanban,
  Star,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle
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
    <div className="border border-amber-200 bg-amber-50 p-5 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-amber-200">
        <span className="text-xs font-medium text-amber-800 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" />
          AI Flagged Anomaly &bull; {Math.round(relationship.similarityScore * 100)}% Semantic Match
        </span>
        <span className="text-[10px] text-zinc-400 font-mono">ID: {relationship.id}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="bg-white p-4 border border-zinc-200 space-y-2">
          <span className="text-[10px] uppercase font-medium text-zinc-400 tracking-wide">Original ({relationship.complaintNumber1})</span>
          <h4 className="font-medium text-zinc-900 text-sm">{relationship.title1}</h4>
          <p className="text-[11px] text-zinc-500 line-clamp-3 leading-relaxed">{c1?.description || 'Double water piping damage and leakage reported.'}</p>
        </div>

        {/* Flagged Duplicate */}
        <div className="bg-white p-4 border border-zinc-200 space-y-2">
          <span className="text-[10px] uppercase font-medium text-zinc-400 tracking-wide">Flagged Duplicate ({relationship.complaintNumber2})</span>
          <h4 className="font-medium text-zinc-900 text-sm">{relationship.title2}</h4>
          <p className="text-[11px] text-zinc-500 line-clamp-3 leading-relaxed">{c2?.description || 'Low pressure or pipe damage reported.'}</p>
        </div>
      </div>

      {/* Action Input */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <input
          type="text"
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          placeholder="Optional remarks (e.g. Rejecting as duplicate of JS-2026-0001)..."
          className="flex-1 px-3 py-2 border border-zinc-300 text-xs bg-white focus:border-blue-800 outline-none placeholder:text-zinc-300"
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleAction(false)}
            disabled={loading}
            className="px-3.5 py-2 border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 font-medium text-xs transition cursor-pointer"
          >
            Mark as Independent
          </button>
          <button
            onClick={() => handleAction(true)}
            disabled={loading}
            className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-medium text-xs transition cursor-pointer"
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

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <span className="w-1.5 h-1.5 bg-emerald-500" />
      case 'InProgress':
        return <span className="w-1.5 h-1.5 bg-amber-500" />
      case 'Rejected':
        return <span className="w-1.5 h-1.5 bg-zinc-300" />
      default:
        return <span className="w-1.5 h-1.5 bg-rose-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'InProgress':
        return 'In Progress'
      case 'Rejected':
        return 'Rejected (Duplicate)'
      default:
        return status
    }
  }

  return (
    <div className="space-y-8 pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl text-zinc-900 tracking-tight">
            Grievance Portal
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            Report civic issues and track departmental resolution across {currentDistrict.name}
          </p>
        </div>

        <Link
          to="/complaints/new"
          className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-medium text-xs px-4 py-2.5 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>File New Grievance</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-zinc-200 border border-zinc-200 bg-white shadow-card">
        <div className="p-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Total</div>
          <div className="text-xl tnum text-zinc-900 mt-1">{total}</div>
        </div>

        <div className="p-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Open</div>
          <div className="text-xl tnum text-rose-600 mt-1">{openCount}</div>
        </div>

        <div className="p-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">In Progress</div>
          <div className="text-xl tnum text-amber-600 mt-1">{inProgressCount}</div>
        </div>

        <div className="p-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Resolved</div>
          <div className="text-xl tnum text-emerald-600 mt-1">{resolvedCount}</div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-zinc-200 gap-6">
        <button
          onClick={() => setActiveTab('grievances')}
          className={`pb-2.5 text-xs font-medium relative transition cursor-pointer ${
            activeTab === 'grievances'
              ? 'text-blue-800'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          Active Grievances
          {activeTab === 'grievances' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`pb-2.5 text-xs font-medium relative transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'insights'
              ? 'text-blue-800'
              : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Regional Intelligence
          {activeTab === 'insights' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800" />
          )}
        </button>
        {isOfficerOrAdmin && (
          <button
            onClick={() => setActiveTab('duplicates')}
            className={`pb-2.5 text-xs font-medium relative transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'duplicates'
                ? 'text-blue-800'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Duplicate Review ({potentialDuplicates.length})
            {activeTab === 'duplicates' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800" />
            )}
          </button>
        )}
      </div>

      {activeTab === 'grievances' && (
        <>
          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-300 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search title, ID, or sector..."
                className="w-full pl-9 pr-4 py-2 border border-zinc-300 text-xs focus:border-blue-800 outline-none placeholder:text-zinc-300"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 text-xs focus:border-blue-800 outline-none text-zinc-600"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected (Duplicate)</option>
            </select>

            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 text-xs focus:border-blue-800 outline-none text-zinc-600"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 text-xs focus:border-blue-800 outline-none text-zinc-600"
            >
              <option value="">All Sectors</option>
              {sectors.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {(search || selectedStatus || selectedDept || selectedSector) && (
              <div className="col-span-full flex items-center justify-between text-xs pt-1">
                <span className="text-zinc-400">
                  Showing <strong>{filteredGrievances.length}</strong> of {total} grievances
                </span>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-zinc-500 hover:text-blue-800 font-medium transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
            )}
          </div>

          {/* Grievances List */}
          <div className="space-y-3">
            {filteredGrievances.length === 0 ? (
              <div className="py-16 border border-dashed border-zinc-300 text-center space-y-2">
                <Search className="w-6 h-6 mx-auto text-zinc-300" />
                <h3 className="font-medium text-zinc-800 text-sm">No grievances found</h3>
                <p className="text-xs text-zinc-400">
                  Try adjusting your filter settings or search query.
                </p>
              </div>
            ) : (
              filteredGrievances.map(g => (
                <div
                  key={g.id}
                  className="border border-zinc-200 bg-white shadow-card hover:shadow-lift transition-shadow p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400">
                      <span className="font-mono text-zinc-500">{g.complaintNumber}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {g.sector}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {g.department}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
                      {getStatusDot(g.status)}
                      {getStatusLabel(g.status)}
                    </span>
                  </div>

                  <div>
                    <Link
                      to={`/complaints/${g.id}`}
                      className="font-medium text-zinc-900 text-[15px] hover:text-blue-800 transition"
                    >
                      {g.title}
                    </Link>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                      {g.description}
                    </p>
                  </div>

                  {/* Linked Project & AI Classification */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-100 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                      {g.projectId && (
                        <Link
                          to={`/projects/${g.projectId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-800 hover:text-blue-900"
                        >
                          <FolderKanban className="w-3 h-3" />
                          {g.projectName || 'Linked Project'}
                        </Link>
                      )}
                      <span className="text-[10px] text-zinc-400">
                        AI Routing: {g.aiDepartmentConfidence}%
                      </span>
                      {g.feedbackRating && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {g.feedbackRating}.0 / 5
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
                      <span>Filed by {g.citizenName} &bull; {g.createdAt}</span>
                      <Link
                        to={`/complaints/${g.id}`}
                        className="inline-flex items-center gap-1 font-medium text-blue-800 hover:text-blue-900"
                      >
                        View Details <ArrowRight className="w-3 h-3" />
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
        <div className="space-y-6">
          <div>
            <h2 className="text-base text-zinc-900">Regional Intelligence Trend Analysis</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Temporal anomaly checks and high-volume category warnings in {currentDistrict.name}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 border border-zinc-200 bg-white shadow-card">
            <div className="p-5 text-center">
              <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Analyzed Grievances</div>
              <div className="text-2xl tnum text-blue-800 mt-1">{regionalInsights.totalAnalyzed}</div>
            </div>
            <div className="p-5 text-center">
              <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Primary Region Load</div>
              <div className="text-2xl text-zinc-900 mt-1">{regionalInsights.topSectors[0]?.sector || 'N/A'}</div>
            </div>
            <div className="p-5 text-center">
              <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Active Anomalies</div>
              <div className="text-2xl tnum text-rose-600 mt-1">{regionalInsights.insights.length}</div>
            </div>
          </div>

          {/* AI Insights list */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Trend & Spike Observations</h3>
            {regionalInsights.insights.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs border border-dashed border-zinc-300">
                No abnormal spikes or extreme volumes detected. Standard SLA performance active.
              </div>
            ) : (
              regionalInsights.insights.map((ins: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 bg-zinc-50 border border-zinc-200">
                  <div className="w-7 h-7 bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0">
                    {ins.type === 'SPIKE'
                      ? <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
                      : <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-blue-800 bg-blue-50 px-2 py-0.5">
                        {ins.type} Detected
                      </span>
                      <span className="text-xs font-medium text-zinc-800">{ins.sector} &bull; {ins.category.replace('_', ' ')}</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{ins.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'duplicates' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base text-zinc-900">Potential Duplicates Review</h2>
            <p className="text-xs text-zinc-400 mt-0.5">AI similarity checks that flag duplicate grievances. Review and verify to clean up municipal routing.</p>
          </div>

          {potentialDuplicates.length === 0 ? (
            <div className="py-12 text-center space-y-2 border border-dashed border-zinc-300">
              <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500" />
              <div className="text-sm font-medium text-zinc-700">All duplicate checks completed</div>
              <p className="text-xs text-zinc-400">No pending potential duplicate complaints need verification.</p>
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