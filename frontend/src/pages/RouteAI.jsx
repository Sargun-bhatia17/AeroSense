import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet';
import { MapPin, Navigation, Clock, Wind, Activity, ShieldAlert, CheckCircle2, Route as RouteIcon } from 'lucide-react';
import useAerisStore from '../store/aerisStore';
import 'leaflet/dist/leaflet.css';

// Mock geographic paths for standard Aundh to Hinjewadi routes to simulate routing data
const mockPaths = {
  'route-a': [[18.562, 73.808], [18.568, 73.785], [18.575, 73.768], [18.585, 73.750], [18.591, 73.738]], // Faster, more direct
  'route-b': [[18.562, 73.808], [18.555, 73.795], [18.545, 73.775], [18.560, 73.745], [18.591, 73.738]], // Greener, avoiding traffic
};

export default function RouteAI() {
  const { routeAnalysis, fetchRouteAnalysis, loading, errors, persona } = useAerisStore();
  const [origin, setOrigin] = useState('Aundh');
  const [destination, setDestination] = useState('Hinjewadi Phase 1');
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleAnalysis = () => {
    fetchRouteAnalysis({ origin, destination, persona });
  };

  useEffect(() => {
    handleAnalysis();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (routeAnalysis?.recommendedRouteId) {
      setSelectedRoute(routeAnalysis.recommendedRouteId);
    } else if (routeAnalysis?.routes?.length > 0) {
      setSelectedRoute(routeAnalysis.routes[0].id);
    }
  }, [routeAnalysis]);

  return (
    <section className="p-6 lg:p-10 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-(--color-text-primary) tracking-tight mb-2">Intelligent Routing</h1>
        <p className="text-sm text-(--color-text-secondary)">Balance commute time and pollution exposure with route-by-route geospatial analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs & Route Cards */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-sky-500" /> Navigational Waypoints
            </h2>
            <div className="flex flex-col gap-3 mb-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_#0ea5e9]" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Origin Location"
                  className="w-full bg-white/50 dark:bg-black/20 border border-(--color-card-border) rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 text-(--color-text-primary) transition-all"
                />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destination Location"
                  className="w-full bg-white/50 dark:bg-black/20 border border-(--color-card-border) rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 text-(--color-text-primary) transition-all"
                />
              </div>
              <button onClick={handleAnalysis} className="w-full mt-2 px-6 py-3.5 bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-md shadow-sky-500/20 transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2">
                <Navigation size={16} /> Analyze Routes
              </button>
            </div>
          </div>

          {loading.routeAnalysis ? (
            <div className="glass-card rounded-2xl p-6 min-h-[300px] flex flex-col gap-4 animate-pulse flex-1">
              <div className="h-6 bg-slate-200/50 dark:bg-slate-700/50 rounded w-1/3 mb-4"></div>
              <div className="h-32 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl w-full"></div>
              <div className="h-32 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl w-full"></div>
            </div>
          ) : routeAnalysis ? (
            <div className="flex flex-col gap-4 flex-1">
              {routeAnalysis.routes?.map((route) => {
                const isSelected = route.id === selectedRoute;
                const isRec = route.id === routeAnalysis.recommendedRouteId || route.isRecommended;
                const riskColor = route.riskLevel === 'high' ? 'text-rose-500' : route.riskLevel === 'moderate' ? 'text-amber-500' : 'text-emerald-500';
                const riskBadge = route.riskLevel === 'high' ? 'bg-rose-50 dark:bg-rose-500/10' : route.riskLevel === 'moderate' ? 'bg-amber-50 dark:bg-amber-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10';

                return (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={route.id} 
                    onClick={() => setSelectedRoute(route.id)}
                    className={`w-full text-left glass-card rounded-2xl p-5 border-2 transition-all duration-300 relative overflow-hidden group ${isSelected ? `border-sky-500 shadow-lg shadow-sky-500/10` : 'border-transparent hover:border-(--color-card-border)'}`}
                  >
                    {isSelected && <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500" />}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-(--color-text-primary)">{route.label || route.name}</h4>
                        {isRec && <span className="bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1"><CheckCircle2 size={12}/> Recommended</span>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-(--color-text-secondary) mb-4">
                      <div className="flex items-center gap-2"><Clock size={16} className="text-slate-400"/> <span className="font-semibold text-(--color-text-primary)">{route.durationMinutes || route.duration} min</span></div>
                      <div className="flex items-center gap-2"><Activity size={16} className="text-slate-400"/> <span className="font-semibold text-(--color-text-primary)">{route.distanceKm || route.distance} km</span></div>
                      <div className="flex items-center gap-2"><Wind size={16} className="text-slate-400"/> <span className="font-semibold text-orange-500">AQI {route.avgAqi || route.aqi}</span></div>
                      <div className="flex items-center gap-2"><ShieldAlert size={16} className="text-slate-400"/> <span className={`font-semibold capitalize ${riskColor}`}>{route.riskLevel || route.exposureRisk}</span></div>
                    </div>
                    
                    {route.summary && <p className={`text-xs p-3 rounded-xl ${isSelected ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-800 dark:text-sky-200' : 'subtle-surface text-(--color-text-secondary)'}`}>{route.summary}</p>}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200 flex flex-col items-center justify-center flex-1">
              <ShieldAlert size={48} className="mb-4 opacity-50" />
              <p className="font-bold">Unable to load route analysis.</p>
              <p className="text-sm mt-2 opacity-80">{errors.routeAnalysis}</p>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Map Component */}
        <div className="lg:col-span-7 relative min-h-[400px] lg:min-h-full glass-card rounded-3xl overflow-hidden border border-(--color-card-border) shadow-inner flex flex-col">
          <div className="absolute top-4 right-4 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-xs space-y-2">
             <div className="font-bold text-(--color-text-primary) border-b border-slate-200 dark:border-slate-700 pb-1.5 mb-1.5 uppercase tracking-wide flex items-center gap-1.5"><RouteIcon size={14}/> Legend</div>
             <div className="flex items-center gap-2"><span className="w-4 h-1.5 bg-emerald-500 rounded-full"></span> Low Exposure</div>
             <div className="flex items-center gap-2"><span className="w-4 h-1.5 bg-amber-500 rounded-full"></span> Moderate Exposure</div>
             <div className="flex items-center gap-2"><span className="w-4 h-1.5 bg-rose-500 rounded-full"></span> High Exposure</div>
             <div className="flex items-center gap-2"><span className="w-4 h-1.5 bg-slate-400 rounded-full opacity-50 border border-dashed border-slate-600"></span> Unselected</div>
          </div>

          <MapContainer center={[18.568, 73.773]} zoom={13} style={{ flex: 1, minHeight: '500px', width: '100%', background: 'var(--color-bg-main)' }} zoomControl={false}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            {/* Render unselected routes behind first */}
            {routeAnalysis?.routes?.map(route => {
              if (selectedRoute === route.id) return null;
              const path = mockPaths[route.id] || mockPaths['route-a'];
              return (
                <Polyline 
                  key={route.id} 
                  positions={path} 
                  pathOptions={{ color: '#64748b', weight: 4, opacity: 0.6, dashArray: '6, 8' }} 
                  eventHandlers={{ click: () => setSelectedRoute(route.id) }}
                />
              );
            })}

            {/* Render selected route clearly on top */}
            {routeAnalysis?.routes?.map(route => {
              if (selectedRoute !== route.id) return null;
              const path = mockPaths[route.id] || mockPaths['route-a'];
              const routeColor = route.riskLevel === 'high' ? '#ef4444' : route.riskLevel === 'moderate' ? '#f59e0b' : '#10b981';
              return (
                <Polyline 
                  key={`${route.id}-selected`} 
                  positions={path} 
                  pathOptions={{ color: routeColor, weight: 6, opacity: 0.9 }} 
                />
              );
            })}

            <CircleMarker center={[18.562, 73.808]} radius={6} pathOptions={{ fillColor: '#0ea5e9', color: '#fff', weight: 2, fillOpacity: 1 }}>
              <Popup><strong>Origin:</strong> {origin}</Popup>
            </CircleMarker>
            <CircleMarker center={[18.591, 73.738]} radius={6} pathOptions={{ fillColor: '#6366f1', color: '#fff', weight: 2, fillOpacity: 1 }}>
              <Popup><strong>Destination:</strong> {destination}</Popup>
            </CircleMarker>
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
