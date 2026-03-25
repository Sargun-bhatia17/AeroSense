import { create } from 'zustand';
import { aiApi, healthApi, pollutionApi, routeApi } from '../services/apiClient';

const defaultLocation = {
  city: 'Pune',
  locality: 'Baner',
  lat: 18.559,
  lng: 73.786
};

const defaultPersona = 'asthmatic';
const defaultActivity = 'running';

const parseError = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export const useAerisStore = create((set, get) => ({
  location: defaultLocation,
  data: {
    sensors: { pm25: 42, co: 0.8, o3: 35, nox: 25, voc_index: 80, temperature: 26, humidity: 55 },
    derived: { aqi: 118, rri: 65, dominant: 'PM2.5', air_quality_text: 'Moderate conditions. Monitor exposure.', risk_color: '#f59e0b' },
    environment: { temperature: 26, humidity: 55, pressure: 1012, rain: false, oxygen: 20.9 },
    sectors: [
      { id: 'sec-1', name: 'Baner HQ', aqi: 118, rri: 65, lat: 18.559, lng: 73.786, status: 'active' },
      { id: 'sec-2', name: 'Hinjewadi Node', aqi: 145, rri: 82, lat: 18.591, lng: 73.738, status: 'active' }
    ],
    alerts: [{ message: 'Elevated PM2.5 detected in local nodes.' }],
    nodes: [{ id: 'ESP32-01', status: 'active', location_name: 'Baner HQ', lastPing: new Date().toISOString() }],
    perNode: {
      'ESP32-01': { latest: { aqi: 118, rri: 65, pm25: 42, co: 0.8, o3: 35, temperature: 26 } }
    },
    meta: { location: 'Pune City' },
    history: Array.from({ length: 30 }).map((_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 3600000).toISOString(),
      aqi: 90 + Math.random() * 40,
      rri: 50 + Math.random() * 30,
      pm25: 30 + Math.random() * 20,
      co: 0.5 + Math.random() * 0.5,
      o3: 20 + Math.random() * 20
    }))
  },
  persona: defaultPersona,
  activity: defaultActivity,
  pollutant: 'pm25',
  timeframe: '24h',
  currentAQI: null,
  forecast: [],
  heatmap: [],
  heatmapMeta: null,
  hotspots: [],
  alerts: [],
  recommendation: null,
  bestTime: null,
  routeAnalysis: null,
  loading: {
    currentAQI: false,
    forecast: false,
    heatmap: false,
    hotspots: false,
    alerts: false,
    recommendation: false,
    bestTime: false,
    routeAnalysis: false
  },
  errors: {},

  setLocation: (location) => set({ location: { ...get().location, ...location } }),
  setPersona: (persona) => set({ persona }),
  setActivity: (activity) => set({ activity }),
  setPollutant: (pollutant) => set({ pollutant }),
  setTimeframe: (timeframe) => set({ timeframe }),

  fetchCurrentAQI: async () => {
    const { location } = get();
    set((state) => ({
      loading: { ...state.loading, currentAQI: true },
      errors: { ...state.errors, currentAQI: null }
    }));

    try {
      const response = await pollutionApi.getCurrent(location);
      set((state) => ({
        currentAQI: response.data,
        loading: { ...state.loading, currentAQI: false }
      }));
      return response.data;
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, currentAQI: false },
        errors: { ...state.errors, currentAQI: parseError(error, 'Failed to load AQI snapshot.') }
      }));
      return null;
    }
  },

  fetchForecast: async (hours = 24) => {
    const { location } = get();
    set((state) => ({
      loading: { ...state.loading, forecast: true },
      errors: { ...state.errors, forecast: null }
    }));

    try {
      const response = await pollutionApi.getForecast({
        lat: location.lat,
        lng: location.lng,
        hours
      });
      set((state) => ({
        forecast: Array.isArray(response.data) ? response.data : [],
        loading: { ...state.loading, forecast: false }
      }));
      return response.data;
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, forecast: false },
        errors: { ...state.errors, forecast: parseError(error, 'Failed to load forecast.') }
      }));
      return [];
    }
  },

  fetchHeatmap: async () => {
    const { location, pollutant, timeframe } = get();
    set((state) => ({
      loading: { ...state.loading, heatmap: true },
      errors: { ...state.errors, heatmap: null }
    }));

    try {
      const response = await pollutionApi.getHeatmap({
        city: location.city,
        pollutant,
        timeframe
      });
      set((state) => ({
        heatmap: Array.isArray(response.data) ? response.data : [],
        heatmapMeta: response.meta || null,
        loading: { ...state.loading, heatmap: false }
      }));
      return response.data;
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, heatmap: false },
        errors: { ...state.errors, heatmap: parseError(error, 'Failed to load heatmap.') }
      }));
      return [];
    }
  },

  fetchHotspots: async () => {
    const { location } = get();
    set((state) => ({
      loading: { ...state.loading, hotspots: true },
      errors: { ...state.errors, hotspots: null }
    }));

    try {
      const response = await pollutionApi.getHotspots({ city: location.city });
      set((state) => ({
        hotspots: Array.isArray(response.data) ? response.data : [],
        loading: { ...state.loading, hotspots: false }
      }));
      return response.data;
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, hotspots: false },
        errors: { ...state.errors, hotspots: parseError(error, 'Failed to load hotspots.') }
      }));
      return [];
    }
  },

  fetchAlerts: async () => {
    const { location, persona } = get();
    set((state) => ({
      loading: { ...state.loading, alerts: true },
      errors: { ...state.errors, alerts: null }
    }));

    try {
      const response = await healthApi.getAlerts({ city: location.city, persona });
      set((state) => ({
        alerts: Array.isArray(response.data) ? response.data : [],
        loading: { ...state.loading, alerts: false }
      }));
      return response.data;
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, alerts: false },
        errors: { ...state.errors, alerts: parseError(error, 'Failed to load alerts.') }
      }));
      return [];
    }
  },

  fetchRecommendation: async (activityOverride) => {
    const { location, persona, activity } = get();
    set((state) => ({
      loading: { ...state.loading, recommendation: true },
      errors: { ...state.errors, recommendation: null }
    }));

    try {
      const response = await healthApi.getRecommendation({
        persona,
        activity: activityOverride || activity,
        city: location.city,
        locality: location.locality
      });
      set((state) => ({
        recommendation: response.data,
        loading: { ...state.loading, recommendation: false }
      }));
      return response.data;
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, recommendation: false },
        errors: {
          ...state.errors,
          recommendation: parseError(error, 'Failed to load health recommendation.')
        }
      }));
      return null;
    }
  },

  fetchBestTime: async (activityOverride) => {
    const { location, persona, activity } = get();
    set((state) => ({
      loading: { ...state.loading, bestTime: true },
      errors: { ...state.errors, bestTime: null }
    }));

    try {
      const response = await aiApi.getBestTime({
        persona,
        city: location.city,
        locality: location.locality,
        activity: activityOverride || activity
      });
      set((state) => ({
        bestTime: response.data,
        loading: { ...state.loading, bestTime: false }
      }));
      return response.data;
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, bestTime: false },
        errors: { ...state.errors, bestTime: parseError(error, 'Failed to load best time insight.') }
      }));
      return null;
    }
  },

  fetchRouteAnalysis: async ({ origin = 'Aundh', destination = 'Hinjewadi Phase 1', persona } = {}) => {
    const activePersona = persona || get().persona || 'commuter';

    set((state) => ({
      loading: { ...state.loading, routeAnalysis: true },
      errors: { ...state.errors, routeAnalysis: null }
    }));

    try {
      const response = await routeApi.analyze({
        origin,
        destination,
        persona: activePersona
      });
      set((state) => ({
        routeAnalysis: response.data,
        loading: { ...state.loading, routeAnalysis: false }
      }));
      return response.data;
    } catch (error) {
      set((state) => ({
        loading: { ...state.loading, routeAnalysis: false },
        errors: { ...state.errors, routeAnalysis: parseError(error, 'Failed to analyze routes.') }
      }));
      return null;
    }
  },

  initializeDashboard: async () => {
    await Promise.all([
      get().fetchCurrentAQI(),
      get().fetchForecast(),
      get().fetchHeatmap(),
      get().fetchHotspots(),
      get().fetchAlerts(),
      get().fetchRecommendation(),
      get().fetchBestTime(),
      get().fetchRouteAnalysis()
    ]);
  }
}));

export default useAerisStore;