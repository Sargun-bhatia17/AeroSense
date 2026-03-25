import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000
});

const unwrap = async (request) => {
  const response = await request;
  return response.data;
};

export const pollutionApi = {
  getCurrent(params) {
    return unwrap(api.get('/pollution/current', { params }));
  },
  getForecast(params) {
    return unwrap(api.get('/pollution/forecast', { params }));
  },
  getHeatmap(params) {
    return unwrap(api.get('/pollution/heatmap', { params }));
  },
  getHotspots(params) {
    return unwrap(api.get('/pollution/hotspots', { params }));
  }
};

export const healthApi = {
  getAlerts(params) {
    return unwrap(api.get('/health/alerts', { params }));
  },
  getRecommendation(payload) {
    return unwrap(api.post('/health/recommendation', payload));
  }
};

export const aiApi = {
  getBestTime(payload) {
    return unwrap(api.post('/ai/best-time', payload));
  }
};

export const routeApi = {
  analyze(payload) {
    return unwrap(api.post('/route/analyze', payload));
  }
};

export default api;