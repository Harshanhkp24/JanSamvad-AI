import React from 'react'
import { AccountabilityNode } from '../types'
import {
  Landmark,
  Building,
  UserCheck,
  Briefcase,
  HardHat,
  ArrowDown,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react'

interface AccountabilityChainProps {
  accountability: AccountabilityNode
}

export default function AccountabilityChain({ accountability }: AccountabilityChainProps) {
  const {
    representativeName,
    representativeParty,
    departmentName,
    departmentHead,
    projectOfficer,
    contractor
  } = accountability

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Public Responsibility & Accountability Chain
        </h3>
        <span className="text-[10px] uppercase font-bold text-slate-400">100% Auditable</span>
      </div>

      <div className="relative border-l-2 border-blue-200 ml-4 pl-6 space-y-6 py-2">
        
        {/* 1. Elected Representative */}
        <div className="relative group">
          <div className="absolute -left-[33px] top-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Landmark className="w-3.5 h-3.5" />
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs group-hover:border-blue-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Elected Representative
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{representativeParty}</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm mt-1">{representativeName}</div>
            <div className="text-xs text-slate-500">District Policy, Sanction & Civic Oversight</div>
          </div>
        </div>

        {/* 2. Department & Department Head */}
        <div className="relative group">
          <div className="absolute -left-[33px] top-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Building className="w-3.5 h-3.5" />
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs group-hover:border-indigo-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Executing Department & Head
              </span>
              <span className="text-[11px] text-slate-500 font-medium">{departmentName}</span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm mt-1">{departmentHead.name}</div>
            <div className="text-xs text-slate-600 font-semibold">{departmentHead.designation}</div>
          </div>
        </div>

        {/* 3. Project Officer (Field In-charge) */}
        <div className="relative group">
          <div className="absolute -left-[33px] top-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs group-hover:border-emerald-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Designated Project Officer
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Primary Accountable Officer
              </span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm mt-1">{projectOfficer.name}</div>
            <div className="text-xs text-slate-600 font-semibold">{projectOfficer.designation}</div>
            
            {(projectOfficer.contactPhone || projectOfficer.contactEmail) && (
              <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                {projectOfficer.contactPhone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {projectOfficer.contactPhone}
                  </span>
                )}
                {projectOfficer.contactEmail && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-emerald-600" />
                    {projectOfficer.contactEmail}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. Executing Contractor */}
        <div className="relative group">
          <div className="absolute -left-[33px] top-1 w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xs">
            <HardHat className="w-3.5 h-3.5" />
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs group-hover:border-slate-400 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                Awarded Contractor
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Reg: {contractor.registrationNumber}
              </span>
            </div>
            <div className="font-extrabold text-slate-900 text-sm mt-1">{contractor.companyName}</div>
            <div className="text-xs text-slate-500 flex items-center justify-between mt-0.5">
              <span>Role: {contractor.role}</span>
              {contractor.contactPerson && <span>Lead: {contractor.contactPerson}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
