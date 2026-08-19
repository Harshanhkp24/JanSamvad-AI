import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import PostCard from '../components/PostCard'
import CivicMap from '../components/CivicMap'
import CreatePostModal from '../components/CreatePostModal'
import ChallengeModal from '../components/ChallengeModal'
import GovResponseModal from '../components/GovResponseModal'
import { FeedPost } from '../types'
import {
  Radio,
  Sparkles,
  Landmark,
  PlusCircle,
  FolderKanban,
  MessageSquareCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Building,
  CheckCircle2,
  Users,
  MapPin,
  Filter,
  ShieldCheck,
  Send,
  Lock
} from 'lucide-react'

export default function Home() {
  const { currentUser, currentDistrict, currentDistrictId } = useJanSamvad()

  const [activeFilter, setActiveFilter] = useState<
    'All' | 'Project Update' | 'Development Milestone' | 'Emergency/Public Notice' | 'Public Announcement'
  >('All')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [challengingPost, setChallengingPost] = useState<FeedPost | null>(null)
  const [clarifyingPost, setClarifyingPost] = useState<FeedPost | null>(null)

  const rep = currentDistrict.representative
  const opp = currentDistrict.opposition
  const posts = currentDistrict.posts.filter(p => {
    if (activeFilter === 'All') return true
    return p.postType === activeFilter
  })

  const totalSanctioned = currentDistrict.projects
    .reduce((acc, p) => acc + p.budgetCr, 0)
    .toFixed(1)
  const activeProjectsCount = currentDistrict.projects.filter(p => p.status === 'Ongoing').length

  const isCitizen = currentUser?.role === 'citizen'
  const citizen = isCitizen ? (currentUser as any) : null

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. District Representative Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-blue-400/50 shadow-md flex-shrink-0 bg-slate-800">
              <img
                src={rep.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={rep.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-extrabold uppercase tracking-wider">
                <Landmark className="w-3.5 h-3.5" />
                <span>{currentDistrict.name} District Representative</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {rep.name}
              </h1>
              <div className="text-xs text-blue-200 font-medium">
                {rep.partyName} &bull; 📍 {currentDistrict.name}, {currentDistrict.state}
              </div>
              <p className="text-xs text-slate-300 max-w-xl line-clamp-2 pt-0.5">
                {rep.bio}
              </p>
            </div>
          </div>

          {/* Quick District Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
            <div className="p-2 rounded-xl bg-white/5">
              <div className="text-lg font-black text-white">{activeProjectsCount}</div>
              <div className="text-[10px] text-blue-300 uppercase tracking-wider font-bold">Active Projects</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <div className="text-lg font-black text-emerald-400">₹{totalSanctioned} Cr</div>
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Sanctioned Funds</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 col-span-2 sm:col-span-1">
              <div className="text-lg font-black text-sky-400">{currentDistrict.grievances.length}</div>
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">Grievances</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Feed Stream */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Representative Post Trigger (When logged in as Representative or Admin) */}
          {(currentUser?.role === 'representative' || currentUser?.role === 'admin') && (
            <div className="bg-white p-4 rounded-3xl border border-blue-200 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Publish District Communication</div>
                  <div className="text-[11px] text-slate-500">Post development progress or official notice to {currentDistrict.name}</div>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Update</span>
              </button>
            </div>
          )}

          {/* Filter Pills Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filters:
              </span>
              {(['All', 'Project Update', 'Development Milestone', 'Emergency/Public Notice', 'Public Announcement'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeFilter === tab
                      ? 'bg-blue-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-medium pr-2 hidden sm:inline">
              {posts.length} Updates
            </span>
          </div>

          {/* Feed Post List */}
          {posts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 space-y-2">
              <Radio className="w-8 h-8 mx-auto text-slate-300" />
              <div className="text-sm font-bold text-slate-700">No updates matching this filter</div>
              <div className="text-xs">Select "All" to view all representative communications.</div>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onChallengeClick={p => setChallengingPost(p)}
                onGovResponseClick={p => setClarifyingPost(p)}
              />
            ))
          )}
        </div>

        {/* Right 1 Column: District Intelligence Sidebar */}
        <div className="space-y-5">
          
          {/* A. Verified Citizen Profile Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Verified Civic Session
              </span>
              <span className="text-[10px] text-slate-400 font-bold">Simulated Gov ID</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
                {currentUser?.name.charAt(0) || 'C'}
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-slate-900 text-sm truncate">
                  {currentUser?.name || 'Rahul Sharma'}
                </div>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  {citizen?.maskedGovId || '********021'} &bull; PIN: {citizen?.pinCode || (currentDistrict.id === 'faridabad' ? '121001' : '122001')}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned District:</span>
                <strong className="text-slate-800">{currentDistrict.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Rep:</span>
                <strong className="text-blue-700">{currentDistrict.representative.name}</strong>
              </div>
            </div>
          </div>

          {/* B. Mini Civic Map */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {currentDistrict.name} Project Map
                </h3>
              </div>
              <Link
                to="/projects"
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
              >
                Full Map &rarr;
              </Link>
            </div>
            
            <CivicMap
              projects={currentDistrict.projects}
              districtId={currentDistrictId}
              height="200px"
              zoom={11}
              interactive={true}
            />

            <div className="text-[11px] text-slate-500 text-center font-medium">
              Click any pin to inspect budget, department officer, and progress.
            </div>
          </div>

          {/* C. Opposition Scrutiny Callout */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-3xl border border-amber-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Opposition Scrutiny</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                {currentDistrict.oppositionQuestions.length} Questions
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden">
                <img
                  src={opp.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
                  alt={opp.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-xs">
                  {opp.name}
                </div>
                <div className="text-[11px] text-amber-800 font-semibold">
                  {opp.title} &bull; {opp.partyName}
                </div>
              </div>
            </div>

            <p className="text-xs text-amber-950 leading-relaxed">
              Auditing project timelines, budget variances, and resident grievances across {currentDistrict.name}.
            </p>

            <Link
              to="/scrutiny"
              className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
            >
              <span>View Public Scrutiny Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* D. Quick Grievance CTA */}
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 text-white p-5 rounded-3xl shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquareCheck className="w-5 h-5" />
              <h3 className="font-bold text-sm">Have an unresolved civic issue?</h3>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              Submit a geo-tagged grievance linked to a project or local ward for automated departmental escalation.
            </p>
            <Link
              to="/complaints/new"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-800 text-xs font-extrabold shadow-sm transition"
            >
              Report District Grievance &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <ChallengeModal
        post={challengingPost}
        isOpen={!!challengingPost}
        onClose={() => setChallengingPost(null)}
      />
      <GovResponseModal
        post={clarifyingPost}
        isOpen={!!clarifyingPost}
        onClose={() => setClarifyingPost(null)}
      />
    </div>
  )
}
