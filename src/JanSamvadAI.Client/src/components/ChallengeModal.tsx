import React, { useState } from 'react'
import { useJanSamvad } from '../context/JanSamvadContext'
import { FeedPost, ClaimCategory } from '../types'
import { X, ShieldAlert, Send } from 'lucide-react'

interface ChallengeModalProps {
  post: FeedPost | null
  isOpen: boolean
  onClose: () => void
}

const CLAIM_CATEGORIES: ClaimCategory[] = [
  'Progress Discrepancy',
  'Budget Concern',
  'Delay',
  'Quality Concern',
  'Transparency Concern',
  'Citizen Impact',
  'Missing Information',
  'Contractor Concern',
  'Public Safety',
  'Environmental Concern'
]

export default function ChallengeModal({ post, isOpen, onClose }: ChallengeModalProps) {
  const { challengePost, currentDistrict } = useJanSamvad()

  const [category, setCategory] = useState<ClaimCategory>(
    post?.oppositionResponse?.claimCategory || 'Progress Discrepancy'
  )
  const [content, setContent] = useState(post?.oppositionResponse?.content || '')
  const [dataUrl, setDataUrl] = useState(post?.oppositionResponse?.supportingDataUrl || '')

  if (!isOpen || !post) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    challengePost(post.id, {
      claimCategory: category,
      content: content.trim(),
      supportingDataUrl: dataUrl.trim() || undefined
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-amber-200 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Raise Public Scrutiny Challenge</h3>
              <p className="text-xs text-slate-500">
                {currentDistrict.opposition.name} &bull; {currentDistrict.opposition.partyName}
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

        {/* Target post preview */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <span className="font-bold text-slate-900">Challenging Post: </span>
          <span className="italic line-clamp-2">"{post.content}"</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Scrutiny Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ClaimCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none"
            >
              {CLAIM_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Opposition Statement & Questions
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="State the observed discrepancy, budget variation, pending resident grievances, or quality concerns requiring executive clarification..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs md:text-sm focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Supporting Reference / Document Link (Optional)
            </label>
            <input
              type="text"
              value={dataUrl}
              onChange={e => setDataUrl(e.target.value)}
              placeholder="e.g. Audit report, RTI document, ground survey photos"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none"
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
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Attach Scrutiny Challenge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
