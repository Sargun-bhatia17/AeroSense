export const analyzeRoute = (origin, destination, persona) => {
  // In a real scenario, this would use a mapping service and pollution data
  // to calculate the safest route.
  // For now, we'll return a mock response.

  const riskLevel = ['Low', 'Moderate', 'High'];
  const routes = [
    {
      name: 'Route via Aundh-Baner Link Road',
      distance: '12 km',
      duration: '25 mins',
      aqi: 110,
      exposureRisk: riskLevel[Math.floor(Math.random() * 3)],
      isRecommended: false,
    },
    {
      name: 'Route via University Road',
      distance: '15 km',
      duration: '35 mins',
      aqi: 140,
      exposureRisk: riskLevel[Math.floor(Math.random() * 3)],
      isRecommended: false,
    },
    {
      name: 'Route via Pashan-Sus Road',
      distance: '14 km',
      duration: '30 mins',
      aqi: 90,
      exposureRisk: 'Low',
      isRecommended: true,
    },
  ];

  // Make a random route recommended
  routes.forEach(r => r.isRecommended = false);
  const recommendedIndex = Math.floor(Math.random() * routes.length);
  routes[recommendedIndex].isRecommended = true;


  return {
    origin,
    destination,
    persona,
    routes,
    analysis: `For a ${persona}, the recommended route from ${origin} to ${destination} is via Pashan-Sus Road due to lower pollution exposure.`,
  };
};
