export const energyCosts = {
  // North America
  'US': { cost: 0.14, currency: 'USD', region: 'North America', name: 'United States' },
  'CA': { cost: 0.13, currency: 'USD', region: 'North America', name: 'Canada' },
  'MX': { cost: 0.09, currency: 'USD', region: 'North America', name: 'Mexico' },

  // Western Europe
  'UK': { cost: 0.26, currency: 'USD', region: 'Western Europe', name: 'United Kingdom' },
  'DE': { cost: 0.37, currency: 'USD', region: 'Western Europe', name: 'Germany' },
  'FR': { cost: 0.23, currency: 'USD', region: 'Western Europe', name: 'France' },
  'IT': { cost: 0.31, currency: 'USD', region: 'Western Europe', name: 'Italy' },
  'ES': { cost: 0.29, currency: 'USD', region: 'Western Europe', name: 'Spain' },
  'PT': { cost: 0.26, currency: 'USD', region: 'Western Europe', name: 'Portugal' },
  'NL': { cost: 0.33, currency: 'USD', region: 'Western Europe', name: 'Netherlands' },
  'BE': { cost: 0.32, currency: 'USD', region: 'Western Europe', name: 'Belgium' },
  'CH': { cost: 0.21, currency: 'USD', region: 'Western Europe', name: 'Switzerland' },
  'AT': { cost: 0.28, currency: 'USD', region: 'Western Europe', name: 'Austria' },
  'IE': { cost: 0.29, currency: 'USD', region: 'Western Europe', name: 'Ireland' },

  // Northern Europe
  'DK': { cost: 0.38, currency: 'USD', region: 'Northern Europe', name: 'Denmark' },
  'SE': { cost: 0.21, currency: 'USD', region: 'Northern Europe', name: 'Sweden' },
  'NO': { cost: 0.19, currency: 'USD', region: 'Northern Europe', name: 'Norway' },
  'FI': { cost: 0.25, currency: 'USD', region: 'Northern Europe', name: 'Finland' },
  'IS': { cost: 0.12, currency: 'USD', region: 'Northern Europe', name: 'Iceland' },

  // Eastern Europe
  'PL': { cost: 0.19, currency: 'USD', region: 'Eastern Europe', name: 'Poland' },
  'CZ': { cost: 0.24, currency: 'USD', region: 'Eastern Europe', name: 'Czech Republic' },
  'SK': { cost: 0.21, currency: 'USD', region: 'Eastern Europe', name: 'Slovakia' },
  'HU': { cost: 0.13, currency: 'USD', region: 'Eastern Europe', name: 'Hungary' },
  'RO': { cost: 0.16, currency: 'USD', region: 'Eastern Europe', name: 'Romania' },
  'BG': { cost: 0.14, currency: 'USD', region: 'Eastern Europe', name: 'Bulgaria' },

  // Asia
  'JP': { cost: 0.22, currency: 'USD', region: 'Asia', name: 'Japan' },
  'KR': { cost: 0.11, currency: 'USD', region: 'Asia', name: 'South Korea' },
  'CN': { cost: 0.08, currency: 'USD', region: 'Asia', name: 'China' },
  'IN': { cost: 0.09, currency: 'USD', region: 'Asia', name: 'India' },
  'SG': { cost: 0.19, currency: 'USD', region: 'Asia', name: 'Singapore' },
  'MY': { cost: 0.07, currency: 'USD', region: 'Asia', name: 'Malaysia' },
  'TH': { cost: 0.12, currency: 'USD', region: 'Asia', name: 'Thailand' },
  'VN': { cost: 0.08, currency: 'USD', region: 'Asia', name: 'Vietnam' },
  'ID': { cost: 0.10, currency: 'USD', region: 'Asia', name: 'Indonesia' },
  'PH': { cost: 0.18, currency: 'USD', region: 'Asia', name: 'Philippines' },

  // Oceania
  'AU': { cost: 0.25, currency: 'USD', region: 'Oceania', name: 'Australia' },
  'NZ': { cost: 0.17, currency: 'USD', region: 'Oceania', name: 'New Zealand' },

  // Middle East
  'AE': { cost: 0.07, currency: 'USD', region: 'Middle East', name: 'United Arab Emirates' },
  'SA': { cost: 0.05, currency: 'USD', region: 'Middle East', name: 'Saudi Arabia' },
  'IL': { cost: 0.16, currency: 'USD', region: 'Middle East', name: 'Israel' },
  'TR': { cost: 0.09, currency: 'USD', region: 'Middle East', name: 'Turkey' },

  // South America
  'BR': { cost: 0.13, currency: 'USD', region: 'South America', name: 'Brazil' },
  'AR': { cost: 0.09, currency: 'USD', region: 'South America', name: 'Argentina' },
  'CL': { cost: 0.15, currency: 'USD', region: 'South America', name: 'Chile' },
  'CO': { cost: 0.14, currency: 'USD', region: 'South America', name: 'Colombia' },
  'PE': { cost: 0.16, currency: 'USD', region: 'South America', name: 'Peru' },

  // Africa
  'ZA': { cost: 0.11, currency: 'USD', region: 'Africa', name: 'South Africa' },
  'EG': { cost: 0.06, currency: 'USD', region: 'Africa', name: 'Egypt' },
  'MA': { cost: 0.12, currency: 'USD', region: 'Africa', name: 'Morocco' },
  'NG': { cost: 0.09, currency: 'USD', region: 'Africa', name: 'Nigeria' },
  'KE': { cost: 0.15, currency: 'USD', region: 'Africa', name: 'Kenya' }
};

export const getEnergyCostForCountry = (countryCode) => {
  return energyCosts[countryCode] || { 
    cost: 0.15, 
    currency: 'USD', 
    region: 'Default',
    name: 'Unknown'
  };
};

export const getCountriesByRegion = (region) => {
  return Object.entries(energyCosts)
    .filter(([, data]) => data.region === region)
    .map(([code, data]) => ({
      code,
      name: data.name,
      ...data
    }));
};

export const getAllRegions = () => {
  return [...new Set(Object.values(energyCosts).map(data => data.region))];
}; 