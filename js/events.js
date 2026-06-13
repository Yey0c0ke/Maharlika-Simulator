import { clampValue } from './ui.js';

const REGIONS = ['Luzon', 'Visayas', 'Mindanao', 'Maharlika'];

const EVENT_TEMPLATES = [
  {
    title: 'Harvest Prosperity',
    summary: 'A record harvest boosts grain stores and trade.',
    impact: { treasury: 10, approval: 4, economy: 7, food: 8, employment: 6, gdp: 8 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Port Expansion',
    summary: 'New docks attract merchants and cargo routes.',
    impact: { treasury: 9, income: 4, economy: 6, infrastructure: 5, tourism: 4 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Tech Symposium',
    summary: 'Scholars unveil innovations that energize growth.',
    impact: { technology: 8, gdp: 7, approval: 3, research: 6 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Energy Grid Upgrade',
    summary: 'A major power upgrade improves stability and supply.',
    impact: { energy: 9, infrastructure: 4, gdp: 5, security: 2 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Education Initiative',
    summary: 'A summer academy raises skill levels across the realm.',
    impact: { education: 8, approval: 4, economy: 3, research: 5 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Healthcare Drive',
    summary: 'A health campaign strengthens clinics and communities.',
    impact: { healthcare: 8, approval: 3, employment: 3, population: 12000 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Cultural Showcase',
    summary: 'Festivals draw visitors and raise morale across districts.',
    impact: { tourism: 7, approval: 4, economy: 4, income: 3 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Border Patrol Drill',
    summary: 'Troops and security forces rehearse an important exercise.',
    impact: { security: 7, military: 6, approval: 1, expenses: 3 },
    category: 'neutral',
    importance: 'common'
  },
  {
    title: 'Fiscal Audit',
    summary: 'A royal audit restores confidence in public finances.',
    impact: { treasury: 6, reserve: 5, approval: -1, economy: 2 },
    category: 'neutral',
    importance: 'common'
  },
  {
    title: 'Debt Consolidation',
    summary: 'A clever refinance improves treasury stability.',
    impact: { debt: -10, reserve: 4, approval: 2, treasury: 2 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Inflation Surge',
    summary: 'Bread prices rise and households feel the strain.',
    impact: { inflation: 1, economy: -4, approval: -2, expenses: 5 },
    category: 'warning',
    importance: 'common'
  },
  {
    title: 'Drought Advisory',
    summary: 'A dry spell stretches supply lines and crops.',
    impact: { food: -6, economy: -3, approval: -2, infrastructure: -2 },
    category: 'warning',
    importance: 'common'
  },
  {
    title: 'Market Rally',
    summary: 'Domestic trade booms with strong demand.',
    impact: { income: 5, gdp: 8, treasury: 6, economy: 4 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'National Festival',
    summary: 'A celebration draws citizens and sparks spending.',
    impact: { approval: 6, tourism: 6, income: 2, expenses: 4 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Military Parade',
    summary: 'A grand display reassures allies and deters rivals.',
    impact: { military: 7, security: 5, approval: 3, expenses: 5 },
    category: 'neutral',
    importance: 'common'
  },
  {
    title: 'Research Breakthrough',
    summary: 'A breakthrough fuels long-term technology goals.',
    impact: { research: 9, technology: 8, gdp: 4, education: 3 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Energy Surplus',
    summary: 'Renewables exceed demand and cut costs.',
    impact: { energy: 6, expenses: -4, treasury: 4, economy: 3 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Trade Delegation',
    summary: 'A foreign delegation seals a lucrative trade pact.',
    impact: { gdp: 6, income: 5, tourism: 3, approval: 2 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Port Blockade',
    summary: 'A temporary blockade slows goods and stress supply chains.',
    impact: { economy: -5, income: -4, security: 3, expenses: 2 },
    category: 'warning',
    importance: 'rare'
  },
  {
    title: 'Mine Collapse',
    summary: 'A mining accident costs lives and disrupts resources.',
    impact: { treasury: -8, employment: -5, healthcare: -4, security: -2 },
    category: 'danger',
    importance: 'rare'
  },
  {
    title: 'Epidemic Contained',
    summary: 'A dangerous outbreak is held in check by swift action.',
    impact: { healthcare: 5, approval: 4, expenses: 3, economy: -2 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Governor Summit',
    summary: 'Rulers convene to align priorities and policy.',
    impact: { approval: 3, economy: 2, research: 2, security: 1 },
    category: 'neutral',
    importance: 'common'
  },
  {
    title: 'Festival Backlash',
    summary: 'A celebration overspends the treasury and divides opinion.',
    impact: { tourism: 5, approval: -1, expenses: 6, gdp: 1 },
    category: 'warning',
    importance: 'common'
  },
  {
    title: 'Cyber Theft',
    summary: 'A digital breach steals funds and shakes confidence.',
    impact: { treasury: -12, economy: -4, security: -6, technology: -5 },
    category: 'danger',
    importance: 'rare'
  },
  {
    title: 'Conservation Plan',
    summary: 'A green initiative promotes resilience and stability.',
    impact: { energy: 3, infrastructure: 3, approval: 2, gdp: 1 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Sovereign Gift',
    summary: 'A generous donation to the crown improves reserves.',
    impact: { treasury: 14, approval: 5, economy: 4, reserve: 6 },
    category: 'positive',
    importance: 'common'
  },
  {
    title: 'Typhoon Warning',
    summary: 'A raging storm threatens coastal harvests and trade.',
    impact: { food: -7, economy: -5, infrastructure: -4, population: -20000 },
    category: 'danger',
    importance: 'rare'
  },
  {
    title: 'Volcanic Ashfall',
    summary: 'A distant eruption forces supply reroutes and raises costs.',
    impact: { economy: -4, health: -3, approval: -2, infrastructure: -3 },
    category: 'warning',
    importance: 'rare'
  },
  {
    title: 'Earthquake Tremor',
    summary: 'Shaking ground damages facilities and alarms citizens.',
    impact: { security: -4, infrastructure: -5, approval: -3, expenses: 6 },
    category: 'danger',
    importance: 'rare'
  },
  {
    title: 'Political Scandal',
    summary: 'A governor’s secret deals weaken public trust.',
    impact: { approval: -6, corruption: 5, loyalty: -4, security: -2 },
    category: 'danger',
    importance: 'rare'
  },
  {
    title: 'Economic Crisis',
    summary: 'Markets wobble under pressure from external debt.',
    impact: { treasury: -10, gdp: -6, inflation: 2, approval: -4 },
    category: 'danger',
    importance: 'rare'
  }
];

const EVENT_LIBRARY = buildEventLibrary();

function buildEventLibrary() {
  return EVENT_TEMPLATES.flatMap(template => {
    return REGIONS.map(region => ({
      ...template,
      region,
      title: region === 'Maharlika' ? template.title : `${region} ${template.title}`,
      summary: `${template.summary} This event affects ${region} directly.`
    }));
  });
}

export function createEvent(state) {
  const chance = Math.random();
  const pool = chance < 0.18 ? EVENT_LIBRARY.filter(evt => evt.importance === 'rare') : EVENT_LIBRARY;
  const event = pool[Math.floor(Math.random() * pool.length)];
  return {
    ...event,
    realizedAt: new Date().toISOString()
  };
}

const DECISION_TEMPLATES = [
  {
    title: 'Increase tax collection?',
    prompt: 'The finance council asks to raise tax rates to close the budget gap.',
    yes: {
      summary: 'Treasury gains at the cost of public mood.',
      impact: { treasury: 40, approval: -4, income: 8 }
    },
    no: {
      summary: 'Citizens celebrate, but revenue is limited.',
      impact: { approval: 2, treasury: -15, economy: -2 }
    }
  },
  {
    title: 'Fund military exercises?',
    prompt: 'The generals request extra funding for readiness drills.',
    yes: {
      summary: 'Army readiness improves while costs rise.',
      impact: { military: 6, security: 4, expenses: 5, approval: 1 }
    },
    no: {
      summary: 'The army stays lean but morale dips.',
      impact: { approval: -2, security: -3 }
    }
  },
  {
    title: 'Approve a public health drive?',
    prompt: 'The royal physicians ask to expand regional clinics.',
    yes: {
      summary: 'Healthcare gets stronger and citizens feel safer.',
      impact: { healthcare: 7, approval: 3, expenses: 4 }
    },
    no: {
      summary: 'The clinics remain as they are, and unrest grows.',
      impact: { healthcare: -3, approval: -2 }
    }
  },
  {
    title: 'Launch an education fund?',
    prompt: 'Scholars recommend investing in training tomorrow’s talent.',
    yes: {
      summary: 'Learning improves, fueling future growth.',
      impact: { education: 6, research: 4, approval: 2, treasury: -12 }
    },
    no: {
      summary: 'The scholars are disappointed, but the budget holds.',
      impact: { approval: -1, technology: 1 }
    }
  }
];

export function createDecision(state, event) {
  const decision = DECISION_TEMPLATES[Math.floor(Math.random() * DECISION_TEMPLATES.length)];
  return {
    ...decision,
    id: `decision-${Date.now()}`,
    relatedEvent: event.title
  };
}

export function generateNewsStory(state, event) {
  return {
    id: `news-${Date.now()}`,
    day: state.day,
    date: state.date,
    headline: `${event.title} in ${event.region}`,
    summary: `${event.summary} The palace prepares a response on the next decision.`,
    eventCategory: event.category,
    eventRegion: event.region
  };
}

export function applyDecision(state, decision, choice) {
  const updated = { ...state };
  if (!decision || !decision[choice]) {
    return updated;
  }

  const result = decision[choice];
  Object.entries(result.impact).forEach(([key, delta]) => {
    if (Number.isFinite(updated[key])) {
      updated[key] = clampValue(updated[key] + delta, 0, maxForStat(key));
    }
  });

  updated.decisionHistory = [
    {
      id: decision.id,
      title: decision.title,
      choice,
      result: result.summary,
      date: updated.date
    },
    ...(updated.decisionHistory || [])
  ].slice(0, 8);

  updated.status = deriveStatus(updated);
  return updated;
}

export function populateNewsPage(state) {
  const dateNode = document.querySelector('#news-date');
  const dayNode = document.querySelector('#news-day');
  const headlineNode = document.querySelector('#news-headline');
  const summaryNode = document.querySelector('#news-summary');

  if (dateNode) dateNode.textContent = state.date;
  if (dayNode) dayNode.textContent = `Day ${state.day}`;
  if (headlineNode) headlineNode.textContent = state.todayNews?.headline || state.currentEvent?.title || 'Royal dispatch pending';
  if (summaryNode) summaryNode.textContent = state.todayNews?.summary || state.currentEvent?.summary || 'Awaiting the next update from the palace.';
}

export function renderNewsArchive(state) {
  const container = document.querySelector('#news-archive');
  if (!container) return;
  container.innerHTML = (state.newsArchive || []).slice(0, 8).map(entry => `
    <article class="news-item">
      <div>
        <p class="eyebrow">${entry.date}</p>
        <h4>${entry.headline}</h4>
      </div>
      <p>${entry.summary}</p>
    </article>
  `).join('') || '<p class="muted-text">No prior dispatches available yet.</p>';
}

export function populateDecisionModal(decision) {
  const title = document.querySelector('#decision-title');
  const prompt = document.querySelector('#decision-prompt');
  const yesImpact = document.querySelector('#decision-impact-yes');
  const noImpact = document.querySelector('#decision-impact-no');

  if (!decision) return;
  if (title) title.textContent = decision.title;
  if (prompt) prompt.textContent = decision.prompt;
  if (yesImpact) yesImpact.textContent = formatDecisionImpact(decision.yes.impact);
  if (noImpact) noImpact.textContent = formatDecisionImpact(decision.no.impact);
}

function formatDecisionImpact(impact) {
  const labels = {
    treasury: 'Treasury',
    approval: 'Approval',
    economy: 'Economy',
    security: 'Security',
    income: 'Income',
    expenses: 'Expenses',
    gdp: 'GDP',
    inflation: 'Inflation',
    reserve: 'Reserve',
    debt: 'Debt',
    taxRate: 'Tax',
    population: 'Population',
    food: 'Food',
    education: 'Education',
    technology: 'Technology',
    military: 'Military',
    infrastructure: 'Infrastructure',
    tourism: 'Tourism',
    healthcare: 'Healthcare',
    employment: 'Employment',
    energy: 'Energy',
    research: 'Research'
  };

  return Object.entries(impact).reduce((acc, [key, value]) => {
    if (!value) return acc;
    const symbol = value > 0 ? '+' : '';
    const suffix = key === 'treasury' ? 'M' : key === 'inflation' || key === 'approval' || key === 'taxRate' ? '%' : '';
    const label = labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    acc.push(`${symbol}${value}${suffix} ${label}`);
    return acc;
  }, []).join(' • ');
}

function maxForStat(key) {
  if (key === 'treasury') return 2000;
  if (key === 'gdp') return 20000;
  if (key === 'population') return 20000000;
  if (key === 'debt') return 2000;
  if (key === 'income' || key === 'expenses' || key === 'reserve') return 1000;
  if (key === 'taxRate') return 100;
  if (key === 'inflation') return 20;
  return 100;
}

export function applyEvent(state, event) {
  const updated = { ...state };
  Object.entries(event.impact).forEach(([key, delta]) => {
    if (Number.isFinite(updated[key])) {
      updated[key] = clampValue(updated[key] + delta, 0, maxForStat(key));
    }
  });

  updated.status = deriveStatus(updated);
  updated.currentEvent = event;
  updated.recentEvents = [event, ...(updated.recentEvents || [])].slice(0, 8);
  return updated;
}

export function renderEventPanel(state) {
  const titleNode = document.querySelector('#event-title');
  const summaryNode = document.querySelector('#event-summary');
  const impactNode = document.querySelector('#event-impact');
  const categoryNode = document.querySelector('#event-category');
  const regionNode = document.querySelector('#event-region');

  if (!state.currentEvent) return;

  titleNode.textContent = state.currentEvent.title;
  summaryNode.textContent = state.currentEvent.summary;
  impactNode.textContent = formatImpact(state.currentEvent.impact);
  categoryNode.textContent = state.currentEvent.category || 'Neutral';
  categoryNode.className = `tag ${state.currentEvent.category || 'neutral'}`;
  regionNode.textContent = state.currentEvent.region;
}

export function populateEventModal(event) {
  const title = document.querySelector('#modal-title');
  const description = document.querySelector('#modal-description');
  const impact = document.querySelector('#modal-impact');
  const region = document.querySelector('#modal-region');

  title.textContent = event.title;
  description.textContent = event.summary;
  impact.textContent = formatImpact(event.impact);
  region.textContent = event.region;
}

export function populateRecentEvents(state) {
  const container = document.querySelector('#recent-events');
  if (!container) return;
  container.innerHTML = (state.recentEvents || []).map(event => `
    <article class="event-card glass">
      <div>
        <p>${event.title}</p>
        <span>${event.summary}</span>
      </div>
      <span class="tag ${event.category || 'neutral'}">${event.importance || 'Common'}</span>
    </article>
  `).join('');
}

function formatImpact(impact) {
  const labels = {
    treasury: 'Treasury',
    approval: 'Approval',
    economy: 'Economy',
    security: 'Security',
    income: 'Income',
    expenses: 'Expenses',
    gdp: 'GDP',
    inflation: 'Inflation',
    reserve: 'Reserve',
    debt: 'Debt',
    taxRate: 'Tax',
    population: 'Population',
    food: 'Food',
    education: 'Education',
    technology: 'Technology',
    military: 'Military',
    infrastructure: 'Infrastructure',
    tourism: 'Tourism',
    healthcare: 'Healthcare',
    employment: 'Employment',
    energy: 'Energy',
    research: 'Research'
  };

  return Object.entries(impact).reduce((acc, [key, value]) => {
    if (!value) return acc;
    const symbol = value > 0 ? '+' : '';
    const suffix = key === 'treasury' ? 'M' : key === 'inflation' || key === 'approval' || key === 'taxRate' ? '%' : '';
    const label = labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    acc.push(`${symbol}${value}${suffix} ${label}`);
    return acc;
  }, []).join(' • ');
}

function deriveStatus(state) {
  if (state.approval >= 90 && state.economy >= 90 && state.security >= 90) {
    return 'Prosperous';
  }
  if (state.approval <= 45 || state.security <= 40 || state.infrastructure <= 45) {
    return 'Tense';
  }
  if (state.treasury < 150 || state.reserve < 60 || state.income < 20) {
    return 'Frugal';
  }
  return 'Peaceful';
}
