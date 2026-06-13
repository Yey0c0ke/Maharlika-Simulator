const STORAGE_KEY = 'kingdomSimulatorState';

export const DEFAULT_STATE = {
  day: 1,
  date: 'June 13, 2026',
  realmScore: 852,
  treasury: 960,
  income: 48,
  expenses: 36,
  reserve: 240,
  debt: 68,
  taxRate: 22,
  gdp: 1140,
  inflation: 3.4,
  approval: 82,
  population: 4225000,
  economy: 91,
  security: 88,
  food: 86,
  education: 78,
  technology: 82,
  military: 75,
  infrastructure: 84,
  tourism: 64,
  healthcare: 81,
  employment: 91,
  energy: 79,
  research: 72,
  status: 'Peaceful',
  governors: {
    Luzon: {
      name: 'Andres',
      approval: 88,
      popularity: 76,
      competence: 84,
      loyalty: 82,
      corruption: 12,
      ambition: 58,
      faction: 'Coastal Circle',
      personality: 'Strategic',
      relationship: 'Trusted',
      region: 'Luzon'
    },
    Visayas: {
      name: 'Mara',
      approval: 86,
      popularity: 72,
      competence: 79,
      loyalty: 80,
      corruption: 14,
      ambition: 64,
      faction: 'Trade Alliance',
      personality: 'Diplomatic',
      relationship: 'Reliable',
      region: 'Visayas'
    },
    Mindanao: {
      name: 'Rey',
      approval: 84,
      popularity: 70,
      competence: 76,
      loyalty: 78,
      corruption: 18,
      ambition: 69,
      faction: 'Frontier Guard',
      personality: 'Resolute',
      relationship: 'Steady',
      region: 'Mindanao'
    }
  },
  regions: {
    Luzon: {
      population: 1760000,
      economy: 92,
      loyalty: 82,
      corruption: 14,
      competence: 84,
      militarySupport: 78,
      development: 88,
      infrastructure: 90,
      specialization: 'Trade & Port Logistics',
      riskLevel: 'Moderate'
    },
    Visayas: {
      population: 1480000,
      economy: 88,
      loyalty: 80,
      corruption: 16,
      competence: 79,
      militarySupport: 74,
      development: 82,
      infrastructure: 84,
      specialization: 'Culture & Tourism',
      riskLevel: 'Stable'
    },
    Mindanao: {
      population: 980000,
      economy: 84,
      loyalty: 78,
      corruption: 18,
      competence: 76,
      militarySupport: 82,
      development: 80,
      infrastructure: 78,
      specialization: 'Agriculture & Security',
      riskLevel: 'High'
    }
  },
  newsArchive: [],
  decisionHistory: [],
  projects: [
    {
      key: 'airport',
      name: 'Airport',
      cost: 120,
      duration: 4,
      progress: 0,
      status: 'ready',
      effects: { economy: 5, infrastructure: 6, tourism: 3 }
    },
    {
      key: 'railway',
      name: 'Railway',
      cost: 100,
      duration: 5,
      progress: 0,
      status: 'ready',
      effects: { economy: 4, infrastructure: 7, employment: 3 }
    },
    {
      key: 'hospital',
      name: 'Hospital',
      cost: 95,
      duration: 4,
      progress: 0,
      status: 'ready',
      effects: { healthcare: 8, approval: 3, employment: 2 }
    },
    {
      key: 'university',
      name: 'University',
      cost: 110,
      duration: 6,
      progress: 0,
      status: 'ready',
      effects: { education: 7, research: 6, technology: 4 }
    }
  ],
  laws: [
    {
      key: 'tax-reform',
      name: 'Tax Reform',
      description: 'Adjust tax policy to increase revenue.',
      enacted: false,
      effects: { treasury: 15, approval: -3, economy: 2 }
    },
    {
      key: 'education-reform',
      name: 'Education Reform',
      description: 'Invest in schools and training programs.',
      enacted: false,
      effects: { education: 6, approval: 2, treasury: -8 }
    },
    {
      key: 'healthcare-reform',
      name: 'Healthcare Reform',
      description: 'Expand clinics and public health outreach.',
      enacted: false,
      effects: { healthcare: 7, approval: 3, expenses: 5 }
    },
    {
      key: 'military-expansion',
      name: 'Military Expansion',
      description: 'Grow forces and fortify defenses.',
      enacted: false,
      effects: { military: 6, security: 4, approval: 1, expenses: 6 }
    },
    {
      key: 'environmental-law',
      name: 'Environmental Law',
      description: 'Protect nature while supporting industry.',
      enacted: false,
      effects: { infrastructure: 3, approval: 2, economy: -2 }
    },
    {
      key: 'industrialization',
      name: 'Industrialization',
      description: 'Boost manufacturing and export capacity.',
      enacted: false,
      effects: { gdp: 6, employment: 4, environment: -1 }
    }
  ],
  technologies: [
    {
      key: 'industrialization',
      name: 'Industrialization',
      status: 'available',
      daysRequired: 4,
      progress: 0,
      effects: { economy: 4, gdp: 5 }
    },
    {
      key: 'digital-government',
      name: 'Digital Government',
      status: 'locked',
      daysRequired: 5,
      progress: 0,
      effects: { efficiency: 5, approval: 2 }
    },
    {
      key: 'renewable-energy',
      name: 'Renewable Energy',
      status: 'locked',
      daysRequired: 5,
      progress: 0,
      effects: { energy: 7, expenses: -3 }
    },
    {
      key: 'cyber-security',
      name: 'Cyber Security',
      status: 'locked',
      daysRequired: 4,
      progress: 0,
      effects: { security: 6, technology: 3 }
    }
  ],
  diplomacy: {
    usa: { name: 'USA', relations: 72, status: 'Partner', trade: 12 },
    china: { name: 'China', relations: 65, status: 'Competitor', trade: 10 },
    japan: { name: 'Japan', relations: 68, status: 'Ally', trade: 9 },
    skorea: { name: 'South Korea', relations: 70, status: 'Partner', trade: 8 },
    asean: { name: 'ASEAN', relations: 80, status: 'Friendly', trade: 14 },
    eu: { name: 'EU', relations: 60, status: 'Observer', trade: 7 }
  },
  military: {
    army: 72,
    navy: 64,
    airforce: 68,
    readiness: 75,
    budget: 68
  },
  palace: {
    level: 1,
    title: 'Royal Residence',
    bonus: 'Palace bonus +0%',
    nextCost: 80
  },
  currentDecision: null,
  todayNews: null,
  currentEvent: {
    title: 'Festival of Lights',
    summary: 'A ceremonial festival boosts morale and commerce across the kingdom.',
    impact: {
      treasury: 12,
      approval: 3,
      economy: 8,
      security: 2,
      food: 4,
      tourism: 6,
      healthcare: 2
    },
    region: 'Maharlika',
    category: 'positive',
    importance: 'common'
  },
  recentEvents: []
};

function mergeDeep(base, incoming) {
  if (!incoming || typeof incoming !== 'object') {
    return base;
  }

  const result = Array.isArray(base) ? [...base] : { ...base };

  Object.keys(incoming).forEach(key => {
    const baseValue = base[key];
    const incomingValue = incoming[key];

    if (incomingValue && typeof incomingValue === 'object' && !Array.isArray(incomingValue)) {
      result[key] = mergeDeep(baseValue ?? {}, incomingValue);
    } else {
      result[key] = incomingValue;
    }
  });

  return result;
}

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
    const parsed = JSON.parse(saved);
    return mergeDeep(DEFAULT_STATE, parsed);
  } catch (error) {
    console.warn('Unable to restore state:', error);
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

export function saveState(state) {
  try {
    const snapshot = JSON.parse(JSON.stringify(state));
    snapshot.lastSaved = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    console.warn('Unable to save state:', error);
  }
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
