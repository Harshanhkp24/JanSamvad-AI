import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useJanSamvad } from '../context/JanSamvadContext'
import NotificationsDropdown from './NotificationsDropdown'
import DemoSwitcherModal from './DemoSwitcherModal'
import CitizenProfileModal from './CitizenProfileModal'
import {
  Landmark,
  FolderKanban,
  MessageSquareCheck,
  ShieldCheck,
  ShieldAlert,
  PlusCircle,
  LogIn,
  LogOut,
  UserCheck,
  MapPin,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Lock
} from 'lucide-react'

export default function NavBar() {
  const { currentUser, currentDistrict, currentDistrictId, setDistrict, logout } = useJanSamvad()
  const location = useLocation()

  const [isDemoSwitcherOpen, setIsDemoSwitcherOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const navLinks = [
    { label: 'JanSamvad Feed', path: '/', icon: Landmark },
    { label: 'Projects & Funds', path: '/projects', icon: FolderKanban },
    { label: 'Grievances', path: '/complaints', icon: MessageSquareCheck },
    { label: 'Accountability', path: '/accountability', icon: ShieldCheck },
    { label: 'Opposition Scrutiny', path: '/scrutiny', icon: ShieldAlert },
  ]

  const isCitizen = currentUser?.role === 'citizen'

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
          
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="font-black text-slate-900 leading-tight text-lg tracking-tight flex items-center gap-1.5">
                  JanSamvad <span className="text-blue-600 font-extrabold text-xs uppercase px-1.5 py-0.2 rounded bg-blue-50 border border-blue-200">AI</span>
                </div>
                <div className="text-[10px] font-semibold text-slate-400 leading-none truncate">
                  Your District &bull; Your Representative &bull; Your Voice
                </div>
              </div>
            </Link>

            {/* Active District Selector / Indicator */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => !isCitizen && setDistrict('faridabad')}
                disabled={isCitizen && currentDistrictId !== 'faridabad'}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] flex items-center gap-1 ${
                  currentDistrictId === 'faridabad'
                    ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                } ${isCitizen && currentDistrictId !== 'faridabad' ? 'opacity-40 cursor-not-allowed' : ''}`}
                title={isCitizen ? 'Citizen district is assigned by Gov ID' : 'Switch district'}
              >
                <MapPin className="w-3 h-3 text-rose-500" />
                <span>Faridabad</span>
              </button>

              <button
                onClick={() => !isCitizen && setDistrict('gurugram')}
                disabled={isCitizen && currentDistrictId !== 'gurugram'}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] flex items-center gap-1 ${
                  currentDistrictId === 'gurugram'
                    ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                } ${isCitizen && currentDistrictId !== 'gurugram' ? 'opacity-40 cursor-not-allowed' : ''}`}
                title={isCitizen ? 'Citizen district is assigned by Gov ID' : 'Switch district'}
              >
                <MapPin className="w-3 h-3 text-rose-500" />
                <span>Gurugram</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-700 font-extrabold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Action Tools & Auth */}
          <div className="flex items-center gap-2">
            
            {/* Quick 1-Click Role Switcher */}
            <button
              onClick={() => setIsDemoSwitcherOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition shadow-2xs cursor-pointer"
              title="Test all 5 roles & both districts"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Role Switcher</span>
            </button>

            {/* Notifications Dropdown */}
            <NotificationsDropdown />

            {/* File Grievance CTA */}
            <Link
              to="/complaints/new"
              className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>File Grievance</span>
            </Link>

            {/* User Profile Pill or Login */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition text-left cursor-pointer"
                  title="View Verified Profile"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden xl:block">
                    <div className="text-xs font-extrabold text-slate-800 leading-none truncate max-w-[120px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                      <span>{currentUser.role}</span>
                      {currentUser.role === 'citizen' && (
                        <span className="text-slate-400 font-mono text-[9px]">
                          {(currentUser as any).maskedGovId || '***021'}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Verify ID</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around border-t border-slate-100 py-2 px-2 bg-slate-50 text-xs font-bold overflow-x-auto">
          {navLinks.map(link => {
            const Icon = link.icon
            const active = isActive(link.path)
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${
                  active ? 'text-blue-600 font-black' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] whitespace-nowrap">{link.label.split(' ')[0]}</span>
              </Link>
            )
          })}
        </div>
      </header>

      {/* Modals */}
      <DemoSwitcherModal
        isOpen={isDemoSwitcherOpen}
        onClose={() => setIsDemoSwitcherOpen(false)}
      />
      <CitizenProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  )
}
