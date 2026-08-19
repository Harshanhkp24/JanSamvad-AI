import React, { useState } from 'react'
import { useJanSamvad } from '../context/JanSamvadContext'
import { FeedPost } from '../types'
import { X, ShieldCheck, Send } from 'lucide-react'

interface GovResponseModalProps {
  post: FeedPost | null
  isOpen: boolean
  onClose: () => void
}

export default function GovResponseModal({ post, isOpen, onClose }: GovResponseModalProps) {
  const { addGovResponse, currentUser, currentDistrict } = useJanSamvad()

  const [content, setContent] = useState(post?.govResponse?.content || '')

  if (!isOpen || !post) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    addGovResponse(post.id, content.trim())
    onClose()
  }

  const officer =
    currentUser && currentUser.role === 'officer'
      ? currentUser
      : currentDistrict.officers[0]

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-emerald-200 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Official Department Clarification</h3>
              <p className="text-xs text-slate-500">
                Responding as {officer.name} ({'designation' in officer ? officer.designation : 'Municipal Officer'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target opposition claim preview */}
        {post.oppositionResponse && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
            <span className="font-bold text-amber-900">Addressing Opposition Concern: </span>
            <span className="italic">"{post.oppositionResponse.content}"</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Official Department Statement & Data Explanation
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Provide technical clarification, milestone schedule, timeline adjustments, or ground measurement details..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs md:text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Official Response</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
