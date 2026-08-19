import React, { useState } from 'react'
import { useJanSamvad } from '../context/JanSamvadContext'
import { PostType } from '../types'
import { X, Send, Landmark, Image, Building2, MapPin, Sparkles } from 'lucide-react'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { currentDistrict, createPost } = useJanSamvad()

  const [postType, setPostType] = useState<PostType>('Project Update')
  const [sector, setSector] = useState(currentDistrict.projects[0]?.sector || 'Sector 15')
  const [projectId, setProjectId] = useState(currentDistrict.projects[0]?.id || '')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    createPost({
      content: content.trim(),
      sector,
      postType,
      attachedProjectId: projectId || undefined,
      imageUrl: imageUrl.trim() || undefined
    })

    setContent('')
    setImageUrl('')
    onClose()
  }

  // Pre-fill sample images
  const sampleImages = [
    { label: 'Construction / Infra', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80' },
    { label: 'Community Park', url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80' },
    { label: 'Clean Highway', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Create District Update</h3>
              <p className="text-xs text-slate-500">
                Publish an official communication to all {currentDistrict.name} citizens
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          
          {/* Post Type & Sector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Post Category
              </label>
              <select
                value={postType}
                onChange={e => setPostType(e.target.value as PostType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="Project Update">Project Update</option>
                <option value="Development Milestone">Development Milestone</option>
                <option value="Public Announcement">Public Announcement</option>
                <option value="Emergency/Public Notice">Emergency/Public Notice</option>
                <option value="General Update">General Update</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Area / Sector
              </label>
              <input
                type="text"
                value={sector}
                onChange={e => setSector(e.target.value)}
                placeholder="e.g. Sector 15"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          {/* Link to Existing Project */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Link Government Project (Optional)</span>
              <span className="text-[10px] text-blue-600 font-normal">Connects post to audit trail</span>
            </label>
            <select
              value={projectId}
              onChange={e => {
                setProjectId(e.target.value)
                const matched = currentDistrict.projects.find(p => p.id === e.target.value)
                if (matched) setSector(matched.sector)
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              <option value="">-- No project linked (General district notice) --</option>
              {currentDistrict.projects.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.sector}] {p.name} ({p.status} - {p.progressPercentage}%)
                </option>
              ))}
            </select>
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Official Communication Content
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Detail the milestone, pipeline progress, budget status, or public advisory..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs md:text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
            />
          </div>

          {/* Media attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Attach Image (URL or Quick Select)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none mb-2"
            />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Samples:</span>
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(s.url)}
                  className="text-[10px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-lg border border-slate-200 transition"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Official Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
