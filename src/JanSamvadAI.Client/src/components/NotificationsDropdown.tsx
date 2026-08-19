import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import {
  Bell,
  CheckCircle2,
  FolderKanban,
  MessageSquareCheck,
  ShieldAlert,
  ShieldCheck,
  Radio
} from 'lucide-react'

export default function NotificationsDropdown() {
  const { currentDistrict, currentUser, markNotificationRead } = useJanSamvad()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter notifications for active user role
  const userRole = currentUser?.role || 'citizen'
  const relevantNotifs = currentDistrict.notifications.filter(n => {
    if (n.targetRole === 'all') return true
    if (n.targetRole === userRole) return true
    return false
  })

  const unreadCount = relevantNotifs.filter(n => !n.read).length

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderKanban className="w-4 h-4 text-blue-600" />
      case 'grievance':
        return <MessageSquareCheck className="w-4 h-4 text-emerald-600" />
      case 'opposition':
        return <ShieldAlert className="w-4 h-4 text-amber-600" />
      case 'gov_response':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />
      default:
        return <Radio className="w-4 h-4 text-purple-600" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Notifications
              </div>
              <div className="text-[10px] text-slate-400">
                {currentDistrict.name} District Feed
              </div>
            </div>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {relevantNotifs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 italic">
                No recent notifications
              </div>
            ) : (
              relevantNotifs.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                    !n.read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex-shrink-0 mt-0.5">
                    {getNotifIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-bold text-slate-900 text-xs truncate">
                        {n.title}
                      </h5>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug line-clamp-2">
                      {n.message}
                    </p>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-block mt-1 text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        View details &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
