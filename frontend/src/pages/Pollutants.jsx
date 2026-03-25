import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts';
import useAerisStore from '../store/aerisStore';

const pollutantInfo = {
  pm25: {
    name: 'PM2.5',
    description: 'Fine particulate matter smaller than 2.5 micrometers. Can penetrate deep into the lungs and enter the bloodstream.',
    sources: 'Combustion from vehicles, power plants, wood burning, and industrial processes.',
    color: '#ff6b6b'
  },
  pm10: {
    name: 'PM10',
    description: 'Particulate matter smaller than 10 micrometers. Can irritate the eyes, nose, and throat.',
    sources: 'Dust from roads, construction sites, and farms, as well as pollen and mold spores.',
    color: '#feca57'
  },
  no2: {
    name: 'NO₂',
    description: 'Nitrogen Dioxide. A reddish-brown gas that can cause respiratory problems.',
    sources: 'Burning of fuel from vehicles, power plants, and industrial boilers.',
    color: '#48dbfb'
  },
  o3: {
    name: 'O₃',
    description: 'Ozone. A major component of smog. Can cause shortness of breath and aggravate lung diseases.',
    sources: 'Created by chemical reactions between oxides of nitrogen (NOx) and volatile organic compounds (VOCs) in the presence of sunlight.',
    color: '#1dd1a1'
  }
};


export default function Pollutants() {
  const { forecast, pollutant, setPollutant } = useAerisStore();

  const chartData = useMemo(
    () =>
      forecast.map((item) => ({
        time: new Date(item.time).toLocaleTimeString([], { hour: 'numeric' }),
        pm25: item.pollutants?.pm25 || 0,
        pm10: item.pollutants?.pm10 || 0,
        no2: item.pollutants?.no2 || 0,
        o3: item.pollutants?.o3 || 0
      })),
    [forecast]
  );
  
  const selectedPollutantInfo = pollutantInfo[pollutant];

  return (
    <section className="p-6 lg:p-10 max-w-[1440px] mx-auto space-y-8">

      {/* Interactive Tabs */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wide mb-4">Focus Pollutant</h2>
        <div className="flex flex-wrap gap-3">
          {Object.keys(pollutantInfo).map((p) => (
            <button
              key={p}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                pollutant === p 
                  ? 'bg-sky-500/20 border-sky-500/50 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]' 
                  : 'border-(--color-card-border) text-(--color-text-secondary) subtle-surface hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => setPollutant(p)}
            >
              {pollutantInfo[p].name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Info Card */}
      {selectedPollutantInfo && (
        <div className="glass-card rounded-2xl p-6 border-l-4" style={{ borderLeftColor: selectedPollutantInfo.color }}>
          <h3 className="text-xl font-black mb-3" style={{ color: selectedPollutantInfo.color }}>{selectedPollutantInfo.name} Overview</h3>
          <p className="text-sm text-(--color-text-secondary) leading-relaxed mb-4"><strong className="text-(--color-text-primary)">Description:</strong> {selectedPollutantInfo.description}</p>
          <p className="text-sm text-(--color-text-secondary) leading-relaxed"><strong className="text-(--color-text-primary)">Sources:</strong> {selectedPollutantInfo.sources}</p>
        </div>
      )}

      {/* Graph Area */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[11px] font-bold text-sky-600 uppercase tracking-widest mb-1">Forecast Algorithm</p>
              <h3 className="text-lg font-semibold text-(--color-text-primary)">Next 24 Hours Trajectory</h3>
            </div>
        </div>
        <div className="h-96 w-full">
          {chartData.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-(--color-card-border) rounded-2xl bg-white/5">
              <div className="w-8 h-8 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3" />
              <span className="text-sm text-(--color-text-secondary) font-medium">Awaiting telemetry data...</span>
            </div>
          ) : (
          <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)',
                  color: '#0f172a'
              }}
            />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {Object.keys(pollutantInfo).map(p => (
              <Area
                key={p}
                type="monotone"
                dataKey={p}
                stroke={pollutantInfo[p].color}
                fill={pollutantInfo[p].color}
                fillOpacity={0.1}
                strokeWidth={2}
                name={pollutantInfo[p].name}
                  activeDot={{ r: 6, fill: pollutantInfo[p].color, strokeWidth: 0 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
