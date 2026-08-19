import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Complaints from './pages/Complaints'
import ComplaintDetail from './pages/ComplaintDetail'
import NewComplaint from './pages/NewComplaint'
import NavBar from './components/NavBar'
import { ShieldCheck, Heart } from 'lucide-react'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
        <NavBar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/complaints/new" element={<NewComplaint />} />
            <Route path="/complaints/:id" element={<ComplaintDetail />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-6">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>JanSamvad AI &bull; Civic Governance & Transparency Prototype</span>
            </div>
            <div className="text-slate-400">
              Synthetic demonstration dataset &bull; 100% auditable public funds
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}
