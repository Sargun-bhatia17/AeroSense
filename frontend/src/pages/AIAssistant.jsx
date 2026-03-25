import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, Footprints, Bike, Target, Clock, BrainCircuit, Info, Thermometer, Send, User } from 'lucide-react';
import useAerisStore from '../store/aerisStore';

const activities = [
  { id: 'any', label: 'General Outdoor', icon: Sparkles, desc: 'Casual outdoor presence and errands.' },
  { id: 'running', label: 'Running', icon: Activity, desc: 'High-intensity cardiovascular exertion.' },
  { id: 'walking', label: 'Walking', icon: Footprints, desc: 'Light-intensity continuous movement.' },
  { id: 'cycling', label: 'Cycling', icon: Bike, desc: 'Moderate sustained aerobic exertion.' },
  { id: 'playing', label: 'Playing / Sports', icon: Target, desc: 'Variable intensity team or solo sports.' }
];

export default function AIAssistant() {
  const { bestTime, fetchBestTime, loading, errors, data } = useAerisStore();
  const [selectedActivity, setSelectedActivity] = useState('any');
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your Aerosense AI. I can analyze telemetry and give you specific environmental advice. What would you like to know?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const currentAqi = data?.derived?.aqi || 50;

  useEffect(() => {
    fetchBestTime(selectedActivity);
  }, [selectedActivity, fetchBestTime]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = { role: 'user', content: inputMessage };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: 'ai',
        content: `Based on the current Base AQI of ${currentAqi}, I recommend monitoring your exertion. I am currently simulating responses, but soon I'll provide live intelligence.`
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section className="p-6 lg:p-10 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-(--color-text-primary) tracking-tight mb-2">Predictive AI Assistant</h1>
        <p className="text-sm text-(--color-text-secondary)">Discover the safest times for your specific outdoor activities based on forecast modeling.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Configurations */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-4">Planned Activity</h2>
            <div className="flex flex-col gap-3">
              {activities.map((act) => {
                const isSelected = selectedActivity === act.id;
                return (
                  <button
                    key={act.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all border text-left ${
                      isSelected 
                        ? 'bg-sky-500/10 border-sky-500/50 shadow-sm' 
                        : 'border-(--color-card-border) subtle-surface hover:bg-slate-50 hover:border-slate-300 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => setSelectedActivity(act.id)}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-500/20 text-sky-600' : 'bg-slate-200/50 dark:bg-slate-700 text-slate-500'}`}>
                      <act.icon size={20} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${isSelected ? 'text-sky-700 dark:text-sky-400' : 'text-(--color-text-primary)'}`}>{act.label}</h3>
                      <p className="text-xs text-(--color-text-secondary) mt-0.5">{act.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Context Card */}
          <div className="glass-card rounded-2xl p-6">
             <div className="flex items-center gap-2 mb-4">
               <Thermometer size={16} className="text-(--color-text-secondary)" />
               <h2 className="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wide">Current Context</h2>
             </div>
             <div className="p-4 rounded-xl subtle-surface border border-(--color-card-border) flex items-center justify-between">
                <div>
                  <p className="text-xs text-(--color-text-secondary) font-medium mb-0.5">Live Base AQI</p>
                  <p className="text-2xl font-black text-(--color-text-primary)">{currentAqi}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-(--color-text-secondary) font-medium mb-0.5">Local Time</p>
                  <p className="text-sm font-bold text-(--color-text-primary)">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Output */}
        <div className="lg:col-span-8 space-y-6">
          {loading.bestTime ? (
            <div className="glass-card rounded-2xl p-8 min-h-[300px] flex flex-col gap-6 animate-pulse">
              <div className="h-10 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 rounded w-full"></div>
                <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 rounded w-full"></div>
                <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 rounded w-5/6"></div>
              </div>
              <div className="h-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl w-full mt-4"></div>
            </div>
          ) : bestTime ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 border-t-4 border-t-sky-500 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 shrink-0">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-1">Analysis Complete</p>
                  <h3 className="text-xl sm:text-2xl font-black text-(--color-text-primary)">
                    Optimal window: <span className="text-sky-500">{bestTime.bestWindow || bestTime.bestTime}</span>
                  </h3>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none text-(--color-text-secondary) leading-relaxed mb-8">
                <p className="text-lg">{bestTime.reason || bestTime.narrative}</p>
              </div>

              {/* Confidence Metrics */}
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-(--color-text-secondary)" />
                    <span className="text-sm font-semibold text-(--color-text-primary)">Prediction Confidence</span>
                  </div>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {Math.round((bestTime.confidence || 0) * 100)}%
                  </span>
                </div>
                
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((bestTime.confidence || 0) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
                
                <div className="flex items-start gap-2 text-xs text-(--color-text-secondary) mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <p>Based on projected meteorological shifts, historical pollution dispersion rates, and the selected exertion level.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 flex flex-col items-center justify-center min-h-[300px]">
              <BrainCircuit size={48} className="mb-4 opacity-50" />
              <p className="font-bold">Unable to process recommendation.</p>
              <p className="text-sm mt-2 opacity-80">{errors.bestTime}</p>
            </div>
          )}

          {/* Interactive Chat Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl flex flex-col h-[450px] overflow-hidden shadow-lg"
          >
            <div className="p-4 border-b border-(--color-card-border) bg-white/5 dark:bg-black/10">
              <h3 className="text-sm font-semibold text-(--color-text-primary) flex items-center gap-2">
                <BrainCircuit size={18} className="text-sky-500" />
                Continuous Dialogue
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-5 glass-scrollbar flex flex-col">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-sky-500 text-white shadow-md' : 'bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400'}`}>
                    {msg.role === 'user' ? <User size={14} /> : <BrainCircuit size={14} />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-sky-500 text-white rounded-tr-none shadow-md' : 'subtle-surface text-(--color-text-primary) rounded-tl-none border border-(--color-card-border)'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                      <BrainCircuit size={14} />
                   </div>
                   <div className="px-4 py-4 rounded-2xl subtle-surface rounded-tl-none border border-(--color-card-border) flex gap-1.5 items-center">
                     <span className="w-1.5 h-1.5 rounded-full bg-sky-500/60 animate-bounce"></span>
                     <span className="w-1.5 h-1.5 rounded-full bg-sky-500/60 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                     <span className="w-1.5 h-1.5 rounded-full bg-sky-500/60 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-(--color-card-border) bg-white/5 dark:bg-black/10">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question about the environment..."
                  className="flex-1 bg-white/50 dark:bg-black/20 border border-(--color-card-border) rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/10 text-(--color-text-primary) transition-all"
                />
                <button type="submit" disabled={!inputMessage.trim() || isTyping} className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center disabled:opacity-50 disabled:hover:bg-sky-500 hover:bg-sky-600 transition-colors shrink-0 shadow-md">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
