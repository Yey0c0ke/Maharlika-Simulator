import { formatCurrency, formatCount, clampValue, animateValue } from './ui.js';

const statSelectors = {
  treasury: '#treasury-value',
  approval: '#approval-value',
  population: '#population-value',
  economy: '#economy-value',
  security: '#security-value',
  status: '#status-value',
  income: '#income-value',
  expenses: '#expenses-value',
  gdp: '#gdp-value',
  inflation: '#inflation-value',
  reserve: '#reserve-value',
  debt: '#debt-value',
  tax: '#tax-value',
  food: '#food-value',
  education: '#education-value',
  technology: '#technology-value',
  military: '#military-value',
  infrastructure: '#infrastructure-value',
  tourism: '#tourism-value',
  healthcare: '#healthcare-value',
  employment: '#employment-value',
  energy: '#energy-value',
  research: '#research-value'
};

const statElements = Object.fromEntries(
  Object.entries(statSelectors).map(([key, selector]) => [key, document.querySelector(selector)])
);

export function updateDashboard(state) {
  animateValue(statElements.treasury, state.treasury, value => `₱ ${formatCurrency(value)}M`);
  animateValue(statElements.approval, state.approval, value => `${clampValue(value, 0, 100)}%`);
  animateValue(statElements.population, state.population / 1000000, value => `${formatCount(value, 1)}M`);
  animateValue(statElements.economy, state.economy, value => `${clampValue(value, 0, 100)}`);
  animateValue(statElements.security, state.security, value => `${clampValue(value, 0, 100)}`);
  animateValue(statElements.income, state.income, value => `₱ ${formatCurrency(value)}M`);
  animateValue(statElements.expenses, state.expenses, value => `₱ ${formatCurrency(value)}M`);
  animateValue(statElements.gdp, state.gdp / 1000, value => `₱ ${formatCount(value, 2)}B`);
  animateValue(statElements.inflation, state.inflation, value => `${value.toFixed(1)}%`);
  animateValue(statElements.reserve, state.reserve, value => `₱ ${formatCurrency(value)}M`);
  animateValue(statElements.debt, state.debt, value => `₱ ${formatCurrency(value)}M`);
  animateValue(statElements.tax, state.taxRate, value => `${clampValue(value, 0, 100)}%`);
  animateValue(statElements.food, state.food, value => `${clampValue(value, 0, 100)}`);
  animateValue(statElements.education, state.education, value => `${clampValue(value, 0, 100)}`);
  animateValue(statElements.technology, state.technology, value => `${clampValue(value, 0, 100)}`);
  animateValue(statElements.military, state.military, value => `${clampValue(value, 0, 100)}`);
  animateValue(statElements.infrastructure, state.infrastructure, value => `${clampValue(value, 0, 100)}`);
  animateValue(statElements.tourism, state.tourism, value => `${clampValue(value, 0, 100)}`);
  animateValue(statElements.healthcare, state.healthcare, value => `${clampValue(value, 0, 100)}`);
  animateValue(statElements.employment, state.employment, value => `${clampValue(value, 0, 100)}`);
  animateValue(statElements.energy, state.energy, value => `${clampValue(value, 0, 100)}`);
  animateValue(statElements.research, state.research, value => `${clampValue(value, 0, 100)}`);
  if (statElements.status) statElements.status.textContent = state.status;
}
