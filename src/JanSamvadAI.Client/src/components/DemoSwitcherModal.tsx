import React from 'react'
import { useJanSamvad } from '../context/JanSamvadContext'
import { UserRole, DistrictId } from '../types'
import { X, UserCheck, ShieldCheck, Landmark, ShieldAlert, Building2, Shield, RotateCcw } from 'lucide-react'

interface DemoSwitcherModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DemoSwitcherModal({ isOpen, onClose }: DemoSwitcherModalProps) {
  const { loginAsRole, resetDemoData, currentDistrictId, currentUser } = useJanSamvad()

  if (!isOpen) return null

  const handleSelectRole = (role: UserRole, districtId: DistrictId) => {
    loginAsRole(role, districtId)
    onClose()
  }

  const roleOptions: {
    title: string
    district: 'Faridabad' | 'Gurugram'
    districtId: DistrictId
    role: UserRole
    name: string
    description: string
    icon: any
    color: string
  }[] = [
    {
      title: 'Citizen — Faridabad',
      district: 'Faridabad',
      districtId: 'faridabad',
      role: 'citizen',
      name: 'Rahul Sharma',
      description: 'GOV-HR-FBD-10021 (PIN: 121001)',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
    },
    {
      title: 'Citizen — Gurugram',
      district: 'Gurugram',
      districtId: 'gurugram',
      role: 'citizen',
      name: 'Priya Singh',
      description: 'GOV-HR-GGM-20021 (PIN: 122001)',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
    },
    {
      title: 'Representative — Faridabad',
      district: 'Faridabad',
      districtId: 'faridabad',
      role: 'representative',
      name: 'Aarav Sharma',
      description: "People's Development Front",
      icon: Landmark,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'Representative — Gurugram',
      district: 'Gurugram',
      districtId: 'gurugram',
      role: 'representative',
      name: 'Meera Kapoor',
      description: 'Civic Progress Alliance',
      icon: Landmark,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'Opposition — Faridabad',
      district: 'Faridabad',
      districtId: 'faridabad',
      role: 'opposition',
      name: 'Rohan Mehta',
      description: 'Democratic Accountability Forum',
      icon: ShieldAlert,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
    },
    {
      title: 'Opposition — Gurugram',
      district: 'Gurugram',
      districtId: 'gurugram',
      role: 'opposition',
      name: 'Sana Khan',
      description: 'Citizens United Party',
      icon: ShieldAlert,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
    },
    {
      title: 'Department Officer — Faridabad',
      district: 'Faridabad',
      districtId: 'faridabad',
      role: 'officer',
      name: 'Anita Sharma',
      description: 'Assistant Engineer (Water Supply)',
      icon: Building2,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
    },
    {
      title: 'Department Officer — Gurugram',
      district: 'Gurugram',
      districtId: 'gurugram',
      role: 'officer',
      name: 'Deepak Malhotra',
      description: 'Executive Engineer (PWD)',
      icon: Building2,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
    },
    {
      title: 'Municipal Administrator',
      district: 'Faridabad',
      districtId: 'faridabad',
      role: 'admin',
      name: 'Admin Panel User',
      description: 'Full System Oversight & Audit',
      icon: Shield,
      color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                1-Click Democratic Role Switcher
              </h3>
              <p className="text-xs text-slate-500">
                Instantly switch roles to test distinct views & permissions for both districts
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

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-5 max-h-96 overflow-y-auto pr-1">
          {roleOptions.map((opt, idx) => {
            const Icon = opt.icon
            const isCurrent =
              currentUser?.role === opt.role &&
              currentUser?.name.includes(opt.name.split(' ')[0])

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectRole(opt.role, opt.districtId)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  opt.color
                } ${isCurrent ? 'ring-2 ring-blue-600 shadow-md font-bold' : 'shadow-2xs'}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 bg-white/70 rounded">
                      {opt.district}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 mt-2">{opt.name}</div>
                  <div className="text-[11px] font-semibold text-slate-700">{opt.title}</div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 truncate font-mono">
                  {opt.description}
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo state back to default initial dataset?')) {
                resetDemoData()
                onClose()
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-bold px-3 py-1.5 rounded-xl hover:bg-rose-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Dataset</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
