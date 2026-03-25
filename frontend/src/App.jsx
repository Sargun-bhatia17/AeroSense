import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Activity, BrainCircuit, Map, Route as RouteIcon, ShieldPlus, Wind, UserCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import HealthMonitor from './pages/HealthMonitor';
import Pollutants from './pages/Pollutants';
import AIAssistant from './pages/AIAssistant';
import RouteAI from './pages/RouteAI';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import logo from './assets/Aerosense_Logo_with_Wing_and_Signal_Icon-removebg-preview.png';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: Activity, description: 'Live AQI pulse' },
  { to: '/map', label: 'Map', icon: Map, description: 'Hotspots & heatmap' },
  { to: '/health', label: 'Health Monitor', icon: ShieldPlus, description: 'Persona advice' },
  { to: '/pollutants', label: 'Pollutants', icon: Wind, description: 'Source intelligence' },
  { to: '/ai-assistant', label: 'AI Assistant', icon: BrainCircuit, description: 'Best time planner' },
  { to: '/route-ai', label: 'Route AI', icon: RouteIcon, description: 'Safer route choices' },
  { to: '/profile', label: 'Profile', icon: UserCircle, description: 'Personal health data' }
];

const routeTitles = {
  '/dashboard': {
    title: 'Urban Air Intelligence',
    subtitle: 'Track AQI, forecast changes, and citywide risk signals in one workspace.'
  },
  '/map': {
    title: 'Pollution Heatmap',
    subtitle: 'Scan locality intensity, identify hotspots, and compare exposure clusters.'
  },
  '/health': {
    title: 'Health Monitor',
    subtitle: 'Personalized alerts and exposure guidance for sensitive groups and daily routines.'
  },
  '/pollutants': {
    title: 'Pollutant Breakdown',
    subtitle: 'Understand pollutant composition, severity bands, and trend movement.'
  },
  '/ai-assistant': {
    title: 'AI Assistant',
    subtitle: 'Discover the best times for outdoor activity with confidence-backed guidance.'
  },
  '/route-ai': {
    title: 'Route AI',
    subtitle: 'Balance commute time and pollution exposure with route-by-route analysis.'
  },
  '/profile': {
    title: 'User Profile',
    subtitle: 'Manage your personal health data and dashboard preferences.'
  }
};

function AppShell() {
  const location = useLocation();
  const pageCopy = routeTitles[location.pathname] || routeTitles['/dashboard'];

  return (
    <div className="flex min-h-screen bg-(--color-bg-main) text-(--color-text-primary) selection:bg-(--color-primary) selection:text-white font-sans">
      {/* Navigation Sidebar */}
      <aside className="w-72 hidden lg:flex flex-col border-r border-(--color-card-border) bg-white/70 backdrop-blur-2xl p-6 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4 mb-10">
          <img src={logo} alt="Aerosense Logo" className="w-12 h-12 object-contain drop-shadow-md hover:scale-105 transition-transform" />
          <div>
            <h1 className="font-bold text-lg tracking-wide text-(--color-text-primary) leading-tight">Aerosense</h1>
            <p className="text-xs text-sky-600 font-medium">Pune AQI Command</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-sky-50 shadow-sm border border-sky-100/50' : 'hover:bg-slate-100/50 text-(--color-text-secondary)'}`}
              >
                {({ isActive }) => (
                  <>
                    <span className={`flex items-center justify-center transition-colors ${isActive ? 'text-sky-600' : 'group-hover:text-(--color-text-primary)'}`}>
                      <Icon size={20} />
                    </span>
                    <span>
                      <strong className={`block text-sm font-semibold tracking-wide ${isActive ? 'text-sky-900' : 'text-(--color-text-primary)'}`}>{item.label}</strong>
                      <small className="block text-xs opacity-70 mt-0.5">{item.description}</small>
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 shadow-sm">
          <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold uppercase tracking-wider mb-3">Live Environment</span>
          <h3 className="text-sm font-bold text-slate-800 mb-1">Backend Target</h3>
          <p className="text-xs text-(--color-text-secondary) leading-relaxed flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_#10b981]" /> Connected to live API telemetry.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-transparent">
        <header className="p-6 lg:px-10 lg:py-8 flex items-start justify-between border-b border-(--color-card-border) bg-white/70 backdrop-blur-xl sticky top-0 z-50">
          <div>
            <p className="text-[11px] font-bold text-sky-600 uppercase tracking-widest mb-1.5">Aerospace Environmental Intelligence</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-(--color-text-primary) mb-1 tracking-tight">{pageCopy.title}</h2>
            <span className="text-sm font-medium text-(--color-text-secondary)">{pageCopy.subtitle}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              Deterministic Data
            </div>
          </div>
        </header>

        <div className="flex-1 relative z-10">
          <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/health" element={<HealthMonitor />} />
          <Route path="/pollutants" element={<Pollutants />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/route-ai" element={<RouteAI />} />
          <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/*" element={<AppShell />} />
    </Routes>
  );
}