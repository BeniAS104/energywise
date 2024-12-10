export const energyCosts = {
  // North America
  'US': { cost: 0.14, currency: 'USD', region: 'North America' },
  'CA': { cost: 0.13, currency: 'USD', region: 'North America' },
  'MX': { cost: 0.09, currency: 'USD', region: 'North America' },

  // Western Europe
  'UK': { cost: 0.26, currency: 'USD', region: 'Western Europe' },
  'DE': { cost: 0.37, currency: 'USD', region: 'Western Europe' },
  'FR': { cost: 0.23, currency: 'USD', region: 'Western Europe' },
  'IT': { cost: 0.31, currency: 'USD', region: 'Western Europe' },
  'ES': { cost: 0.29, currency: 'USD', region: 'Western Europe' },
  'PT': { cost: 0.26, currency: 'USD', region: 'Western Europe' },
  'NL': { cost: 0.33, currency: 'USD', region: 'Western Europe' },
  'BE': { cost: 0.32, currency: 'USD', region: 'Western Europe' },
  'CH': { cost: 0.21, currency: 'USD', region: 'Western Europe' },
  'AT': { cost: 0.28, currency: 'USD', region: 'Western Europe' },
  'IE': { cost: 0.29, currency: 'USD', region: 'Western Europe' },

  // Northern Europe
  'DK': { cost: 0.38, currency: 'USD', region: 'Northern Europe' },
  'SE': { cost: 0.21, currency: 'USD', region: 'Northern Europe' },
  'NO': { cost: 0.19, currency: 'USD', region: 'Northern Europe' },
  'FI': { cost: 0.25, currency: 'USD', region: 'Northern Europe' },
  'IS': { cost: 0.12, currency: 'USD', region: 'Northern Europe' },

  // Eastern Europe
  'PL': { cost: 0.19, currency: 'USD', region: 'Eastern Europe' },
  'CZ': { cost: 0.24, currency: 'USD', region: 'Eastern Europe' },
  'SK': { cost: 0.21, currency: 'USD', region: 'Eastern Europe' },
  'HU': { cost: 0.13, currency: 'USD', region: 'Eastern Europe' },
  'RO': { cost: 0.16, currency: 'USD', region: 'Eastern Europe' },
  'BG': { cost: 0.14, currency: 'USD', region: 'Eastern Europe' },

  // Asia
  'JP': { cost: 0.22, currency: 'USD', region: 'Asia' },
  'KR': { cost: 0.11, currency: 'USD', region: 'Asia' },
  'CN': { cost: 0.08, currency: 'USD', region: 'Asia' },
  'IN': { cost: 0.09, currency: 'USD', region: 'Asia' },
  'SG': { cost: 0.19, currency: 'USD', region: 'Asia' },
  'MY': { cost: 0.07, currency: 'USD', region: 'Asia' },
  'TH': { cost: 0.12, currency: 'USD', region: 'Asia' },
  'VN': { cost: 0.08, currency: 'USD', region: 'Asia' },
  'ID': { cost: 0.10, currency: 'USD', region: 'Asia' },
  'PH': { cost: 0.18, currency: 'USD', region: 'Asia' },

  // Oceania
  'AU': { cost: 0.25, currency: 'USD', region: 'Oceania' },
  'NZ': { cost: 0.17, currency: 'USD', region: 'Oceania' },

  // Middle East
  'AE': { cost: 0.07, currency: 'USD', region: 'Middle East' },
  'SA': { cost: 0.05, currency: 'USD', region: 'Middle East' },
  'IL': { cost: 0.16, currency: 'USD', region: 'Middle East' },
  'TR': { cost: 0.09, currency: 'USD', region: 'Middle East' },

  // South America
  'BR': { cost: 0.13, currency: 'USD', region: 'South America' },
  'AR': { cost: 0.09, currency: 'USD', region: 'South America' },
  'CL': { cost: 0.15, currency: 'USD', region: 'South America' },
  'CO': { cost: 0.14, currency: 'USD', region: 'South America' },
  'PE': { cost: 0.16, currency: 'USD', region: 'South America' },

  // Africa
  'ZA': { cost: 0.11, currency: 'USD', region: 'Africa' },
  'EG': { cost: 0.06, currency: 'USD', region: 'Africa' },
  'MA': { cost: 0.12, currency: 'USD', region: 'Africa' },
  'NG': { cost: 0.09, currency: 'USD', region: 'Africa' },
  'KE': { cost: 0.15, currency: 'USD', region: 'Africa' }
};

// Helper function to get energy cost for a country
export const getEnergyCostForCountry = (countryCode) => {
  return energyCosts[countryCode] || { 
    cost: 0.15, 
    currency: 'USD', 
    region: 'Default' 
  };
};

// Helper function to get countries by region
export const getCountriesByRegion = (region) => {
  return Object.entries(energyCosts)
    .filter(([, data]) => data.region === region)
    .map(([code, data]) => ({
      code,
      ...data
    }));
};

// Get all regions
export const getAllRegions = () => {
  return [...new Set(Object.values(energyCosts).map(data => data.region))];
}; 