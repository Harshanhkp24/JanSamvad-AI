import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FeedPost } from '../types'
import { useJanSamvad } from '../context/JanSamvadContext'
import {
  Heart,
  MessageSquare,
  Share2,
  MapPin,
  Building2,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Send,
  AlertCircle,
  ThumbsUp,
  Landmark,
  PlusCircle,
  Sparkles,
  ExternalLink,
  Flame
} from 'lucide-react'

interface PostCardProps {
  post: FeedPost
  onChallengeClick: (post: FeedPost) => void
  onGovResponseClick: (post: FeedPost) => void
}

export default function PostCard({
  post,
  onChallengeClick,
  onGovResponseClick
}: PostCardProps) {
  const { currentUser, supportPost, addComment, supportOppositionClaim } = useJanSamvad()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    addComment(post.id, commentText.trim())
    setCommentText('')
    setShowComments(true)
  }

  const getPostTypeBadge = (type: string) => {
    switch (type) {
      case 'Development Milestone':
        return (
          <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Milestone
          </span>
        )
      case 'Project Update':
        return (
          <span className="bg-blue-500/10 text-blue-700 border border-blue-500/20 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Building2 className="w-3 h-3 text-blue-600" /> Project Update
          </span>
        )
      case 'Emergency/Public Notice':
        return (
          <span className="bg-rose-500/10 text-rose-700 border border-rose-500/20 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-600" /> Public Notice
          </span>
        )
      case 'Public Announcement':
        return (
          <span className="bg-purple-500/10 text-purple-700 border border-purple-500/20 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Landmark className="w-3 h-3 text-purple-600" /> Announcement
          </span>
        )
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
            Update
          </span>
        )
    }
  }

  return (
    <article className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden">
      
      {/* 1. Official Representative Header */}
      <div className="p-5 md:p-6 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 overflow-hidden border-2 border-blue-100 shadow-xs flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt={post.authorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                  {post.authorName}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  <Landmark className="w-3 h-3" /> Representative
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-700">{post.partyName}</span>
                <span>&bull;</span>
                <span className="text-slate-400">{post.relativeTime}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {getPostTypeBadge(post.postType)}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <MapPin className="w-3 h-3 text-rose-500" />
              {post.sector}
            </span>
          </div>
        </div>

        {/* Post Text Content */}
        <p className="text-slate-800 text-sm md:text-base leading-relaxed mt-4 whitespace-pre-wrap font-normal">
          {post.content}
        </p>

        {/* Optional Image */}
        {post.imageUrl && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-slate-100 max-h-80 bg-slate-100">
            <img
              src={post.imageUrl}
              alt="Update media"
              className="w-full h-full object-cover max-h-80 hover:scale-101 transition-transform"
            />
          </div>
        )}

        {/* 2. Connected Project Card Widget */}
        {post.attachedProject && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/40 border border-blue-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-md">
                    Linked Project
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {post.attachedProject.department}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {post.attachedProject.name}
                </h4>
                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span>📍 {post.attachedProject.sector}</span>
                  <span>&bull;</span>
                  <span>Budget: <strong>₹{post.attachedProject.budgetCr} Cr</strong></span>
                </div>
              </div>

              {/* Progress & Link */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-blue-200/50">
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-900">
                    {post.attachedProject.progressPercentage}% Complete
                  </span>
                  <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${post.attachedProject.progressPercentage}%` }}
                    />
                  </div>
                </div>
                <Link
                  to={`/projects/${post.attachedProject.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700 bg-white hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-xl border border-blue-300 shadow-xs transition-all"
                >
                  View Project <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Action Engagement Bar */}
      <div className="px-5 md:px-6 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50/50">
        <div className="flex items-center gap-4">
          {/* Support / Like */}
          <button
            onClick={() => supportPost(post.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
              post.likedByUser
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'hover:bg-slate-100 text-slate-600 border border-transparent'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${post.likedByUser ? 'fill-rose-600 text-rose-600' : ''}`}
            />
            <span>{post.supportsCount || post.likes} Supports</span>
          </button>

          {/* Comments Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition text-slate-600 cursor-pointer font-semibold"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>{post.commentsCount || post.comments.length} Comments</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Shortcut to file a related grievance */}
          <Link
            to={`/complaints/new?projectId=${post.attachedProjectId || ''}&sector=${encodeURIComponent(
              post.sector
            )}&title=${encodeURIComponent(`Issue related to ${post.sector} update`)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-[11px] font-bold transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Report Grievance on this</span>
          </Link>

          {/* Opposition Challenge trigger */}
          {(currentUser?.role === 'opposition' || currentUser?.role === 'admin' || !post.oppositionResponse) && (
            <button
              onClick={() => onChallengeClick(post)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-extrabold transition cursor-pointer"
              title="Opposition scrutiny to challenge government claim"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>{post.oppositionResponse ? 'Update Challenge' : 'Challenge Update'}</span>
            </button>
          )}

          {/* Department Officer Clarify trigger */}
          {post.oppositionResponse && (currentUser?.role === 'officer' || currentUser?.role === 'admin' || !post.govResponse) && (
            <button
              onClick={() => onGovResponseClick(post)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold transition cursor-pointer"
              title="Department Officer official clarification"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{post.govResponse ? 'Update Clarification' : 'Clarify Concern'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Opposition Scrutiny Challenge Box */}
      {post.oppositionResponse && (
        <div className="mx-4 md:mx-6 my-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-amber-950 text-xs md:text-sm">
                    {post.oppositionResponse.authorName}
                  </h4>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.2 rounded-md">
                    Opposition Scrutiny
                  </span>
                </div>
                <div className="text-[11px] text-amber-700 font-medium">
                  {post.oppositionResponse.authorRole} &bull; {post.oppositionResponse.timestamp}
                </div>
              </div>
            </div>

            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              {post.oppositionResponse.claimCategory}
            </span>
          </div>

          <p className="text-amber-950 text-xs md:text-sm leading-relaxed pl-1">
            {post.oppositionResponse.content}
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-xs">
            <button
              onClick={() => supportOppositionClaim(post.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-[11px] transition ${
                post.oppositionResponse.supportedByUser
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-white/80 hover:bg-white text-amber-800 border border-amber-300'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5 text-amber-700" />
              <span>{post.oppositionResponse.citizenSupports} Citizens Support This Concern</span>
            </button>

            {post.attachedProjectId && (
              <Link
                to={`/projects/${post.attachedProjectId}`}
                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-800 hover:text-amber-950 hover:underline"
              >
                View Supporting Project Data <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 5. Official Government / Department Clarification */}
      {post.govResponse && (
        <div className="mx-4 md:mx-6 my-3 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-emerald-950 text-xs md:text-sm">
                    {post.govResponse.officerName}
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.2 rounded-md">
                    Official Clarification
                  </span>
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  {post.govResponse.officerDesignation}, {post.govResponse.department} &bull; {post.govResponse.timestamp}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Department Response
            </span>
          </div>

          <p className="text-emerald-950 text-xs md:text-sm leading-relaxed pl-1">
            {post.govResponse.content}
          </p>
        </div>
      )}

      {/* 6. Citizen Comments Stream */}
      {showComments && (
        <div className="p-5 md:p-6 pt-2 bg-slate-50/70 border-t border-slate-100 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Citizen Discussion ({post.comments.length})
          </div>

          {post.comments.length === 0 ? (
            <div className="text-xs text-slate-400 italic py-2">
              No citizen comments yet. Be the first to share your feedback or ask a question.
            </div>
          ) : (
            <div className="space-y-2.5">
              {post.comments.map(c => (
                <div
                  key={c.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200/70 text-xs space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {c.citizenName}
                    </span>
                    <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                  </div>
                  <p className="text-slate-700 leading-normal">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a citizen comment or question..."
              className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition cursor-pointer flex-shrink-0"
              title="Post Comment"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </article>
  )
}
