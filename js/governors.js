import { clampValue } from './ui.js';

const governorSelectors = {
  luzon: {
    name: '#luzon-governor',
    approval: '#luzon-approval',
    popularity: '#gov-luzon-popularity',
    competence: '#gov-luzon-competence',
    loyalty: '#gov-luzon-loyalty',
    corruption: '#gov-luzon-corruption',
    ambition: '#gov-luzon-ambition',
    relationship: '#gov-luzon-relationship',
    status: '#luzon-status',
    card: '[data-region="Luzon"]'
  },
  visayas: {
    name: '#visayas-governor',
    approval: '#visayas-approval',
    popularity: '#gov-visayas-popularity',
    competence: '#gov-visayas-competence',
    loyalty: '#gov-visayas-loyalty',
    corruption: '#gov-visayas-corruption',
    ambition: '#gov-visayas-ambition',
    relationship: '#gov-visayas-relationship',
    status: '#visayas-status',
    card: '[data-region="Visayas"]'
  },
  mindanao: {
    name: '#mindanao-governor',
    approval: '#mindanao-approval',
    popularity: '#gov-mindanao-popularity',
    competence: '#gov-mindanao-competence',
    loyalty: '#gov-mindanao-loyalty',
    corruption: '#gov-mindanao-corruption',
    ambition: '#gov-mindanao-ambition',
    relationship: '#gov-mindanao-relationship',
    status: '#mindanao-status',
    card: '[data-region="Mindanao"]'
  }
};

export function updateGovernors(state) {
  Object.entries(state.governors).forEach(([region, payload]) => {
    const key = region.toLowerCase();
    const selectors = governorSelectors[key];
    if (!selectors) return;

    document.querySelector(selectors.name).textContent = payload.name;
    document.querySelector(selectors.approval).textContent = `${payload.approval}%`;
    document.querySelector(selectors.popularity).textContent = payload.popularity;
    document.querySelector(selectors.competence).textContent = payload.competence;
    document.querySelector(selectors.loyalty).textContent = payload.loyalty;
    document.querySelector(selectors.corruption).textContent = payload.corruption;
    document.querySelector(selectors.ambition).textContent = payload.ambition;
    document.querySelector(selectors.relationship).textContent = payload.relationship;
    document.querySelector(selectors.status).textContent = payload.status;

    const card = document.querySelector(selectors.card);
    if (card) {
      card.style.borderColor = payload.approval > 85 ? 'rgba(242, 201, 76, 0.45)' : 'rgba(255,255,255,0.1)';
    }
  });
}

export function performGovernorAction(state, region, action) {
  const regionKey = region;
  const record = state.governors[regionKey];
  if (!record) return state.governors;

  const updatedGovernor = { ...record };
  switch (action) {
    case 'reward':
      updatedGovernor.approval = clampValue(updatedGovernor.approval + 4, 0, 100);
      updatedGovernor.loyalty = clampValue(updatedGovernor.loyalty + 5, 0, 100);
      updatedGovernor.corruption = clampValue(updatedGovernor.corruption - 2, 0, 100);
      updatedGovernor.popularity = clampValue((updatedGovernor.popularity || 0) + 3, 0, 100);
      updatedGovernor.relationship = 'Grateful';
      break;
    case 'investigate':
      updatedGovernor.corruption = clampValue(updatedGovernor.corruption - 3, 0, 100);
      updatedGovernor.loyalty = clampValue(updatedGovernor.loyalty - 1, 0, 100);
      updatedGovernor.approval = clampValue(updatedGovernor.approval + 1, 0, 100);
      updatedGovernor.relationship = 'Under scrutiny';
      break;
    case 'promote':
      updatedGovernor.popularity = clampValue((updatedGovernor.popularity || 0) + 4, 0, 100);
      updatedGovernor.approval = clampValue(updatedGovernor.approval + 3, 0, 100);
      updatedGovernor.loyalty = clampValue(updatedGovernor.loyalty + 2, 0, 100);
      updatedGovernor.relationship = 'Empowered';
      break;
    case 'remove':
    case 'replace':
      updatedGovernor.approval = clampValue(updatedGovernor.approval - 5, 0, 100);
      updatedGovernor.loyalty = clampValue(updatedGovernor.loyalty - 8, 0, 100);
      updatedGovernor.relationship = 'Distrustful';
      break;
    case 'arrest':
      updatedGovernor.approval = clampValue(updatedGovernor.approval - 3, 0, 100);
      updatedGovernor.corruption = clampValue(updatedGovernor.corruption - 5, 0, 100);
      updatedGovernor.relationship = 'Feared';
      break;
    default:
      break;
  }

  updatedGovernor.status = pickGovernorStatus(updatedGovernor.approval);
  return {
    ...state.governors,
    [regionKey]: updatedGovernor
  };
}

export function refreshPoliticalScene(state, event) {
  const regions = Object.keys(state.governors);
  return regions.reduce((result, name) => {
    const record = state.governors[name];
    let shift = Math.floor(Math.random() * 3) - 1;
    if (event && event.region === name) {
      if (event.category === 'positive') shift += 2;
      if (event.category === 'warning') shift -= 1;
      if (event.category === 'danger') shift -= 2;
    }

    const nextApproval = clampValue(record.approval + shift, 40, 100);
    result[name] = {
      ...record,
      approval: nextApproval,
      status: pickGovernorStatus(nextApproval)
    };
    return result;
  }, {});
}

function pickGovernorStatus(value) {
  if (value >= 92) return 'Influential';
  if (value >= 80) return 'Stable';
  if (value >= 68) return 'Watchful';
  if (value >= 55) return 'Mending';
  return 'Fragile';
}
