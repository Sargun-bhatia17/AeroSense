export const getCurrentAqi = () => {
  return {
    aqi: 120,
    category: 'Moderate',
    dominantPollutant: 'PM2.5',
    trend: 'rising',
    healthScore: 75,
    updatedAt: new Date().toISOString(),
    location: {
      locality: 'Baner',
      city: 'Pune',
      lat: 18.559,
      lng: 73.786
    }
  };
};

export const getForecast = () => {
  const forecast = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    forecast.push({
      time: time.toISOString(),
      aqi: Math.round(120 + Math.sin(i / 4) * 20 + Math.random() * 10),
      category: 'Moderate',
      dominantPollutant: 'PM2.5',
      confidence: 0.85,
      pollutants: {
        pm25: Math.round(50 + Math.sin(i / 4) * 10 + Math.random() * 5),
        pm10: Math.round(80 + Math.sin(i / 3) * 15 + Math.random() * 5),
        no2: Math.round(30 + Math.sin(i / 5) * 5 + Math.random() * 2),
        o3: Math.round(40 + Math.sin(i / 6) * 10 + Math.random() * 3),
        co: 0.8
      }
    });
  }
  return forecast;
};

export const getHeatmapData = () => {
  const heatmapData = [];
  const centerLat = 18.559;
  const centerLng = 73.786;
  const gridSize = 10;
  const step = 0.01;

  for (let i = -gridSize; i < gridSize; i++) {
    for (let j = -gridSize; j < gridSize; j++) {
      const lat = centerLat + i * step;
      const lng = centerLng + j * step;
      const aqi = Math.floor(Math.random() * 200);
      heatmapData.push([lat, lng, aqi]);
    }
  }
  return heatmapData;
};

export const getHotspots = () => {
  return [
    {
      id: 1,
      name: 'Swargate',
      category: 'Unhealthy',
      reason: 'High traffic congestion',
      lat: 18.5002,
      lng: 73.8633
    },
    {
      id: 2,
      name: 'Hinjewadi',
      category: 'Unhealthy for Sensitive Groups',
      reason: 'Construction dust and traffic',
      lat: 18.5912,
      lng: 73.7389
    },
    {
      id: 3,
      name: 'Koregaon Park',
      category: 'Moderate',
      reason: 'Increased evening traffic',
      lat: 18.5361,
      lng: 73.8939
    }
  ];
};
