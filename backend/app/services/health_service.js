const recommendations = {
  asthmatic: {
    title: 'High-Risk Day for Asthmatics',
    recommendation: 'Avoid outdoor exertion. Carry a reliever inhaler. Keep windows closed.',
    severity: 'High'
  },
  runner: {
    title: 'Moderate AQI for Runners',
    recommendation: 'Prefer an outdoor run between 6–8 AM in low traffic zones. Consider a lighter workout.',
    severity: 'Moderate'
  },
  parents: {
    title: 'Caution for Children',
    recommendation: 'Limit children\'s outdoor playtime, especially in the afternoon. Avoid high-traffic areas.',
    severity: 'Moderate'
  },
  elderly: {
    title: 'Health Advisory for Elderly',
    recommendation: 'Stay indoors during peak pollution hours (1-5 PM). Keep necessary medications on hand.',
    severity: 'High'
  },
  general: {
    title: 'General Population Advisory',
    recommendation: 'AQI is moderate. No major restrictions, but be mindful of strenuous outdoor activities.',
    severity: 'Low'
  }
};

export const getRecommendation = (persona = 'general') => {
  return recommendations[persona.toLowerCase()] || recommendations.general;
};
