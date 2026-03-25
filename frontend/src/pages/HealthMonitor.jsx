import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Activity, Wind, Baby, Shield, AlertTriangle, Thermometer } from 'lucide-react';
import useAerisStore from '../store/aerisStore';

const personas = [
  { id: 'general', label: 'General Public', icon: Activity, desc: 'Healthy adults with no underlying conditions.' },
  { id: 'asthmatic', label: 'Asthmatic', icon: Wind, desc: 'Individuals with asthma or respiratory issues.' },
  { id: 'runner', label: 'Active / Runner', icon: HeartPulse, desc: 'High outdoor exertion and heavy breathing.' },
  { id: 'parents', label: 'Parents / Children', icon: Baby, desc: 'Children under 12 with developing lungs.' },
  { id: 'elderly', label: 'Elderly', icon: Shield, desc: 'Adults over 65, potentially with weaker immunity.' },
];

export default function HealthMonitor() {
  const { persona, setPersona, recommendation, fetchRecommendation, loading, errors, data } = useAerisStore();
  
  // Real-time context
  const currentAqi = data?.derived?.aqi || 50;
  const dominant = data?.derived?.dominant || 'PM2.5';

  useEffect(() => {
    fetchRecommendation(persona);
  }, [persona, fetchRecommendation]);

  // Calculate dynamic data for UI based on persona and real-time AQI
  const getRiskLevel = (p) => {
    let multiplier = 1;
    if (p === 'asthmatic') multiplier = 1.8;
    if (p === 'elderly' || p === 'parents') multiplier = 1.4;
    if (p === 'runner') multiplier = 1.2;
    
    const riskScore = currentAqi * multiplier;
    if (riskScore < 50) return { level: 'Low', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (riskScore < 100) return { level: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    if (riskScore < 150) return { level: 'High', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { level: 'Severe', color: 'text-red-500', bg: 'bg-red-500/10' };
  };

  const risk = getRiskLevel(persona);

  return (
    <section className="p-6 lg:p-10 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-(--color-text-primary) tracking-tight mb-2">Personalized Health Monitor</h1>
        <p className="text-sm text-(--color-text-secondary)">AI-driven exposure guidelines based on your demographic and live environmental data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Selection & Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-4">Select Persona</h2>
            <div className="flex flex-col gap-3">
              {personas.map((p) => {
                const isSelected = persona === p.id || (persona === 'general' && p.id === 'general');
                return (
                  <button
                    key={p.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all border text-left ${
                      isSelected 
                        ? 'bg-rose-500/10 border-rose-500/50 shadow-sm' 
                        : 'border-(--color-card-border) subtle-surface hover:bg-slate-50 hover:border-slate-300 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => setPersona(p.id)}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-rose-500/20 text-rose-600' : 'bg-slate-200/50 dark:bg-slate-700 text-slate-500'}`}>
                      <p.icon size={20} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${isSelected ? 'text-rose-700 dark:text-rose-400' : 'text-(--color-text-primary)'}`}>{p.label}</h3>
                      <p className="text-xs text-(--color-text-secondary) mt-0.5">{p.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Current Live Context Card */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-4">Live Environment Context</h2>
            <div className="flex items-center justify-between p-4 rounded-xl subtle-surface border border-(--color-card-border) mb-4">
               <div>
                 <p className="text-xs text-(--color-text-secondary) font-medium">Base AQI</p>
                 <p className="text-2xl font-black text-(--color-text-primary)">{currentAqi}</p>
               </div>
               <div className="text-right">
                 <p className="text-xs text-(--color-text-secondary) font-medium">Target Pollutant</p>
                 <p className="text-lg font-bold text-rose-500">{dominant}</p>
               </div>
            </div>
            
            <div className={`p-4 rounded-xl border flex items-center justify-between ${risk.bg} border-current/20`}>
              <span className={`font-bold text-sm ${risk.color}`}>Calculated Risk Level</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/50 dark:bg-black/20 ${risk.color}`}>{risk.level}</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis */}
        <div className="lg:col-span-8 space-y-6">
          
          {loading.recommendation ? (
            <div className="glass-card rounded-2xl p-8 min-h-[300px] flex flex-col gap-6 animate-pulse">
              <div className="h-10 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 rounded w-full"></div>
                <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 rounded w-full"></div>
                <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 rounded w-5/6"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                 <div className="h-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl"></div>
                 <div className="h-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl"></div>
              </div>
            </div>
          ) : recommendation ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 border-t-4 border-t-rose-500 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-(--color-text-primary)">{recommendation.headline || recommendation.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-bold border border-rose-200 dark:border-rose-500/20 capitalize`}>
                      Severity: {recommendation.severity || 'Moderate'}
                    </span>
                    <span className="text-xs text-(--color-text-secondary) font-medium flex items-center gap-1"><Thermometer size={12}/> Analysis based on local telemetry</span>
                  </div>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none text-(--color-text-secondary) leading-relaxed mb-8">
                <p className="text-lg">{recommendation.summary || recommendation.recommendation}</p>
              </div>

              {/* Actionable Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 <div className="p-5 rounded-xl bg-sky-50/50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800/30">
                   <div className="flex items-center gap-2 mb-2 text-sky-600 dark:text-sky-400">
                     <Wind size={18} />
                     <h4 className="font-bold text-sm">Outdoor Exposure</h4>
                   </div>
                   <p className="text-sm text-slate-600 dark:text-slate-400">
                     {risk.level === 'Severe' || risk.level === 'High' ? 'Avoid prolonged outdoor exertion. Move activities indoors if possible.' : 'Acceptable for short durations. Monitor breathing patterns.'}
                   </p>
                 </div>
                 
                 <div className="p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                   <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                     <Shield size={18} />
                     <h4 className="font-bold text-sm">Protection Measures</h4>
                   </div>
                   <p className="text-sm text-slate-600 dark:text-slate-400">
                     {risk.level === 'Severe' || risk.level === 'High' ? 'Wear an N95 respirator if you must go outside. Keep windows closed.' : 'Standard precautions apply. Stay hydrated.'}
                   </p>
                 </div>
              </div>

              {/* Preventative Warning if needed */}
              {(risk.level === 'Severe' || risk.level === 'High' || persona === 'asthmatic' || persona === 'elderly') && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
                  <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-1">Watch for Symptoms</h4>
                    <p className="text-xs text-rose-600/80 dark:text-rose-300/80 leading-relaxed">
                      If you experience coughing, shortness of breath, or chest tightness, stop physical activity immediately and seek medical advice if symptoms persist.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 flex flex-col items-center justify-center min-h-[300px]">
              <AlertTriangle size={48} className="mb-4 opacity-50" />
              <p className="font-bold">Unable to load recommendation.</p>
              <p className="text-sm mt-2 opacity-80">{errors.recommendation}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
