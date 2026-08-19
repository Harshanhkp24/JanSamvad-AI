import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { JanSamvadProvider } from './context/JanSamvadContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Complaints from './pages/Complaints'
import ComplaintDetail from './pages/ComplaintDetail'
import NewComplaint from './pages/NewComplaint'
import Accountability from './pages/Accountability'
import Scrutiny from './pages/Scrutiny'
import NavBar from './components/NavBar'
import { ShieldCheck, Heart, Landmark } from 'lucide-react'

export default function App() {
  return (
    <JanSamvadProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white">
        <NavBar />
        <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/complaints/new" element={<NewComplaint />} />
            <Route path="/complaints/:id" element={<ComplaintDetail />} />
            <Route path="/accountability" element={<Accountability />} />
            <Route path="/scrutiny" element={<Scrutiny />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-slate-200 py-6">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                <Landmark className="w-3 h-3" />
              </div>
              <span className="font-bold text-slate-700">
                JanSamvad AI &bull; Democratic District Accountability Platform
              </span>
            </div>
            <div className="text-slate-400 text-center sm:text-right">
              Faridabad &bull; Gurugram &bull; Simulated Civic Transparency Prototype
            </div>
          </div>
        </footer>
      </div>
    </JanSamvadProvider>
  )
}
