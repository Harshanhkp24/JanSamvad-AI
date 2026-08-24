import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ProjectRecord, DistrictId } from '../types'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Building2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

interface CivicMapProps {
  projects: ProjectRecord[]
  districtId: DistrictId
  height?: string
  selectedProjectId?: string
  zoom?: number
  center?: [number, number]
  className?: string
  interactive?: boolean
}

// Center coordinates for districts
const DISTRICT_CENTERS: Record<DistrictId, [number, number]> = {
  faridabad: [28.4089, 77.3178],
  gurugram: [28.4595, 77.0266]
}

// Helper to create color-coded SVG markers
const createCustomMarkerIcon = (status: ProjectRecord['status'], isSelected: boolean = false) => {
  let color = '#3b82f6' // Blue for Ongoing
  if (status === 'Completed') color = '#10b981' // Green
  else if (status === 'Delayed') color = '#f59e0b' // Amber
  else if (status === 'Planned') color = '#8b5cf6' // Purple

  const size = isSelected ? 38 : 30
  const ring = isSelected ? 'filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.9));' : 'filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));'

  const svgHtml = `
    <div style="width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center; ${ring}">
      <svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" stroke="#ffffff" stroke-width="1.5"/>
      </svg>
    </div>
  `

  return L.divIcon({
    html: svgHtml,
    className: 'custom-civic-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  })
}

// Component to dynamically re-center when district or selection changes
function RecenterOnCoord({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom, { animate: true })
  }, [center, zoom, map])
  return null
}

export default function CivicMap({
  projects,
  districtId,
  height = '360px',
  selectedProjectId,
  zoom = 12,
  center,
  className = '',
  interactive = true
}: CivicMapProps) {
  const mapCenter = center || DISTRICT_CENTERS[districtId] || DISTRICT_CENTERS.faridabad

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner z-10 ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        style={{ width: '100%', height: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterOnCoord center={mapCenter} zoom={zoom} />

        {projects.map(proj => {
          if (!proj.coordinates || proj.coordinates.length < 2) return null
          const isSelected = proj.id === selectedProjectId
          const icon = createCustomMarkerIcon(proj.status, isSelected)

          return (
            <Marker key={proj.id} position={proj.coordinates} icon={icon}>
              <Popup className="civic-map-popup">
                <div className="p-1 min-w-[210px] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      {proj.sector}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        proj.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : proj.status === 'Delayed'
                          ? 'bg-amber-100 text-amber-800'
                          : proj.status === 'Planned'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-2 leading-tight">
                      {proj.name}
                    </h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3" />
                      {proj.department}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                      <span>Progress</span>
                      <span>{proj.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-500'
                            : proj.status === 'Delayed'
                            ? 'bg-amber-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${proj.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700">
                      ₹{proj.budgetCr} Cr
                    </span>
                    <Link
                      to={`/projects/${proj.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View Project <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Map Legend overlay */}
      <div className="absolute bottom-2 right-2 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-[10px] flex items-center gap-3 shadow-md font-semibold text-slate-700 pointer-events-none">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span> Ongoing
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Delayed
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-600"></span> Planned
        </span>
      </div>
    </div>
  )
}
