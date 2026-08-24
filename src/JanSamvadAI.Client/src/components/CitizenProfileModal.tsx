import React from 'react'
import { useJanSamvad } from '../context/JanSamvadContext'
import { X, ShieldCheck, UserCheck, MapPin, Landmark, Award, Lock } from 'lucide-react'

interface CitizenProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CitizenProfileModal({ isOpen, onClose }: CitizenProfileModalProps) {
  const { currentUser, currentDistrict } = useJanSamvad()

  if (!isOpen || !currentUser) return null

  const isCitizen = currentUser.role === 'citizen'
  const citizen = isCitizen ? (currentUser as any) : null

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Civic Identity Card</h3>
              <p className="text-xs text-slate-500">Verified District Profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="mt-5 space-y-4">
          
          {/* Identity Badge */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-white font-black text-lg">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300">
                  {currentUser.role.toUpperCase()} PROFILE
                </div>
                <div className="text-lg font-black text-white">{currentUser.name}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">District</div>
                <div className="font-bold text-white flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  {currentDistrict.name}, {currentDistrict.state}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Postal PIN Code</div>
                <div className="font-bold text-white mt-0.5 font-mono">
                  {citizen?.pinCode || (currentDistrict.id === 'faridabad' ? '121001' : '122001')}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Masked Gov ID
                </div>
                <div className="font-bold text-emerald-400 mt-0.5 font-mono">
                  {citizen?.maskedGovId || '********021'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Representative</div>
                <div className="font-bold text-blue-200 mt-0.5 truncate">
                  {currentDistrict.representative.name}
                </div>
              </div>
            </div>
          </div>

          {/* Prototype Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-700">Prototype Environment Notice: </span>
            Government ID verification is simulated using sample data. No real government identity database (Aadhaar/ECI) is connected.
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Close Identity Card
          </button>
        </div>
      </div>
    </div>
  )
}
