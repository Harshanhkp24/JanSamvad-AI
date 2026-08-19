import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Landmark, FolderKanban, MessageSquareCheck, PlusCircle, LogIn, LogOut, User } from 'lucide-react'

export default function NavBar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const navLinks = [
    { label: 'Dashboard', path: '/', icon: Landmark },
    { label: 'Projects & Funds', path: '/projects', icon: FolderKanban },
    { label: 'Grievances', path: '/complaints', icon: MessageSquareCheck },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 leading-tight text-lg tracking-tight flex items-center gap-1.5">
              JanSamvad <span className="text-blue-600">AI</span>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Civic Intelligence
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const Icon = link.icon
            const active = isActive(link.path)
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Action & Auth */}
        <div className="flex items-center gap-3">
          <Link
            to="/complaints/new"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition-all hover:shadow cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File Grievance</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[130px]">
                  {user.fullName || user.email}
                </div>
                <div className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider mt-0.5">
                  {user.roles && user.roles.length > 0 ? user.roles[0] : 'Citizen'}
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
