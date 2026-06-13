import { loadState, saveState, resetState } from './storage.js';
import { updateDashboard } from './dashboard.js';
import {
  createEvent,
  applyEvent,
  renderEventPanel,
  populateEventModal,
  createDecision,
  generateNewsStory,
  populateNewsPage,
  renderNewsArchive,
  populateDecisionModal,
  applyDecision
} from './events.js';
import { updateGovernors, refreshPoliticalScene, performGovernorAction } from './governors.js';
import {
  updateHero,
  bindNavigation,
  animateEntrance,
  bindModalControls,
  bindResetButton,
  animateButtonInteraction,
  setActiveNav,
  togglePage,
  showProgress,
  hideProgress,
  bindNewsContinue,
  bindDecisionControls
} from './ui.js';

const state = loadState();

function initialize() {
  updateHero(state);
  updateDashboard(state);
  updateGovernors(state);
  renderEventPanel(state);
  populateNewsPage(state);
  renderNewsArchive(state);
  renderProjects(state);
  renderLaws(state);
  renderTechnology(state);
  renderDiplomacy(state);
  renderMilitary(state);
  renderPalace(state);

  bindNavigation();
  bindModalControls(() => populateEventModal(state.currentEvent), () => {});
  bindNewsContinue(handleContinueNews);
  bindDecisionControls(handleDecisionChoice);
  bindResetButton(handleReset);
  bindGovernorActions();
  attachNextDay();
  animateEntrance();
  setActiveNav('dashboard');
  refreshPageSections();
}

function refreshPageSections() {
  const currentPage = document.querySelector('.page.active')?.dataset.page || 'dashboard';
  togglePage(currentPage);
}

function attachNextDay() {
  const button = document.querySelector('#next-day-button');
  button?.addEventListener('click', () => {
    if (!button || button.disabled) return;
    animateButtonInteraction(button);
    advanceDay(button);
  });
}

function advanceDay(button) {
  const steps = [
    { text: 'Updating Treasury...', progress: 14, duration: 320 },
    { text: 'Updating Economy...', progress: 28, duration: 320 },
    { text: 'Updating Population...', progress: 42, duration: 320 },
    { text: 'Updating Governors...', progress: 56, duration: 320 },
    { text: 'Checking Events...', progress: 72, duration: 320 },
    { text: 'Saving Kingdom...', progress: 88, duration: 320 },
    { text: 'Done.', progress: 100, duration: 420 }
  ];

  let index = 0;
  button.disabled = true;

  function nextStep() {
    const step = steps[index];
    showProgress(step.text, step.progress);

    setTimeout(() => {
      index += 1;
      if (index < steps.length) {
        nextStep();
      } else {
        applyDayTransition();
      }
    }, step.duration);
  }

  nextStep();
}

function applyDayTransition() {
  state.day += 1;
  state.date = nextDate(state.date);
  state.currentEvent = createEvent(state);
  state.currentDecision = createDecision(state, state.currentEvent);
  state.todayNews = generateNewsStory(state, state.currentEvent);
  state.newsArchive = [state.todayNews, ...(state.newsArchive || [])].slice(0, 12);
  state.governors = refreshPoliticalScene(state, state.currentEvent);
  saveState(state);
  refreshUI();
  hideProgress();
  setActiveNav('news');
  togglePage('news');
}

function handleContinueNews() {
  if (!state.currentDecision) return;
  populateDecisionModal(state.currentDecision);
  document.querySelector('#decision-modal')?.classList.remove('hidden');
}

function handleDecisionChoice(choice) {
  if (!state.currentDecision) return;
  Object.assign(state, applyDecision(state, state.currentDecision, choice));
  state.governors = refreshPoliticalScene(state, state.currentEvent);
  Object.assign(state, applyEvent(state, state.currentEvent));
  progressProjects();
  progressTechnology();
  saveState(state);
  refreshUI();
  document.querySelector('#decision-modal')?.classList.add('hidden');
  setActiveNav('dashboard');
  togglePage('dashboard');
  const button = document.querySelector('#next-day-button');
  if (button) button.disabled = false;
}

function handleReset() {
  const newState = resetState();
  Object.assign(state, newState);
  saveState(state);
  refreshUI();
  document.querySelector('#decision-modal')?.classList.add('hidden');
  const button = document.querySelector('#next-day-button');
  if (button) button.disabled = false;
}

function nextDate(dateString) {
  const iso = new Date(dateString).toISOString();
  const next = new Date(iso);
  next.setDate(next.getDate() + 1);
  return next.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function refreshUI() {
  updateHero(state);
  updateDashboard(state);
  updateGovernors(state);
  renderEventPanel(state);
  populateNewsPage(state);
  renderNewsArchive(state);
  renderProjects(state);
  renderLaws(state);
  renderTechnology(state);
  renderDiplomacy(state);
  renderMilitary(state);
  renderPalace(state);
}

function bindGovernorActions() {
  document.querySelectorAll('.governor-action').forEach(button => {
    button.addEventListener('click', () => {
      const region = button.dataset.region;
      const action = button.dataset.action;
      if (!region || !action) return;
      state.governors = performGovernorAction(state, region, action);
      saveState(state);
      refreshUI();
    });
  });
}

function progressProjects() {
  if (!Array.isArray(state.projects)) return;
  state.projects = state.projects.map(project => {
    if (project.status !== 'constructing') return project;
    const progress = Math.min(project.duration, project.progress + 1);
    const updatedProject = { ...project, progress };
    if (progress >= project.duration) {
      updatedProject.status = 'complete';
      applyProjectCompletion(updatedProject);
    }
    return updatedProject;
  });
}

function applyProjectCompletion(project) {
  Object.entries(project.effects || {}).forEach(([key, delta]) => {
    if (Number.isFinite(state[key])) {
      state[key] = state[key] + delta;
    }
  });
}

function progressTechnology() {
  if (!Array.isArray(state.technologies)) return;
  state.technologies = state.technologies.map(tech => {
    if (tech.status !== 'researching') return tech;
    const progress = Math.min(tech.daysRequired, tech.progress + 1);
    const updatedTech = { ...tech, progress };
    if (progress >= tech.daysRequired) {
      updatedTech.status = 'complete';
      applyTechnologyCompletion(updatedTech);
    }
    return updatedTech;
  });
}

function applyTechnologyCompletion(tech) {
  Object.entries(tech.effects || {}).forEach(([key, delta]) => {
    if (Number.isFinite(state[key])) {
      state[key] = state[key] + delta;
    }
  });
}

function renderProjects(currentState) {
  currentState.projects?.forEach(project => {
    const root = document.querySelector(`#project-${project.key}`);
    if (!root) return;
    root.querySelector('.project-status')?.textContent = project.status === 'complete' ? 'Complete' : project.status === 'constructing' ? `Building ${project.progress}/${project.duration}` : 'Ready to start';
    root.querySelector('.project-progress span')?.style.setProperty('width', `${project.status === 'complete' ? 100 : Math.round((project.progress / project.duration) * 100)}%`);
    const button = root.querySelector('.project-cta');
    if (button) {
      button.textContent = project.status === 'complete' ? 'Complete' : project.status === 'constructing' ? 'Continue' : 'Construct';
      button.disabled = project.status === 'complete' || currentState.treasury < project.cost;
      button.onclick = () => {
        if (project.status === 'ready' && currentState.treasury >= project.cost) {
          currentState.treasury -= project.cost;
          project.status = 'constructing';
          saveState(currentState);
          refreshUI();
        }
      };
    }
  });
}

function renderLaws(currentState) {
  currentState.laws?.forEach(law => {
    const root = document.querySelector(`#law-${law.key}`);
    if (!root) return;
    root.querySelector('.law-status')?.textContent = law.enacted ? 'Enacted' : 'Available';
    const button = root.querySelector('.law-cta');
    if (button) {
      button.textContent = law.enacted ? 'Enacted' : 'Enact';
      button.disabled = law.enacted;
      button.onclick = () => {
        if (law.enacted) return;
        law.enacted = true;
        Object.entries(law.effects || {}).forEach(([key, delta]) => {
          if (Number.isFinite(currentState[key])) {
            currentState[key] = currentState[key] + delta;
          }
        });
        saveState(currentState);
        refreshUI();
      };
    }
  });
}

function renderTechnology(currentState) {
  currentState.technologies?.forEach(tech => {
    const root = document.querySelector(`#tech-${tech.key}`);
    if (!root) return;
    root.querySelector('.tech-status')?.textContent = tech.status === 'complete' ? 'Researched' : tech.status === 'researching' ? `Researching ${tech.progress}/${tech.daysRequired}` : tech.status === 'available' ? 'Ready' : 'Locked';
    const button = root.querySelector('.tech-cta');
    if (button) {
      button.textContent = tech.status === 'complete' ? 'Researched' : tech.status === 'researching' ? 'Continue' : tech.status === 'available' ? 'Research' : 'Locked';
      button.disabled = tech.status === 'complete' || tech.status === 'researching' || tech.status === 'locked';
      button.onclick = () => {
        if (tech.status === 'available') {
          tech.status = 'researching';
          saveState(currentState);
          refreshUI();
        }
      };
    }
  });
}

function renderDiplomacy(currentState) {
  Object.entries(currentState.diplomacy || {}).forEach(([key, partner]) => {
    const root = document.querySelector(`#country-${key}`);
    if (!root) return;
    root.querySelector('.diplomacy-status')?.textContent = partner.status;
    root.querySelector('.diplomacy-relation')?.textContent = `${partner.relations}%`;
    root.querySelector('.diplomacy-trade')?.textContent = `Trade +${partner.trade}`;
    root.querySelectorAll('.diplomacy-action').forEach(button => {
      button.onclick = () => {
        const action = button.dataset.action;
        if (!action) return;
        if (action === 'trade') {
          partner.relations = Math.min(100, partner.relations + 3);
          currentState.treasury += 5;
        } else if (action === 'aid') {
          partner.relations = Math.min(100, partner.relations + 5);
          currentState.approval = Math.max(0, currentState.approval + 1);
          currentState.treasury -= 8;
        } else if (action === 'alliance') {
          partner.status = 'Alliance';
          partner.relations = Math.min(100, partner.relations + 10);
        }
        saveState(currentState);
        refreshUI();
      };
    });
  });
}

function renderMilitary(currentState) {
  const army = document.querySelector('#military-army');
  const navy = document.querySelector('#military-navy');
  const airforce = document.querySelector('#military-airforce');
  const readiness = document.querySelector('#military-readiness');
  const budget = document.querySelector('#military-budget');

  if (army) army.textContent = `${currentState.military.army}%`;
  if (navy) navy.textContent = `${currentState.military.navy}%`;
  if (airforce) airforce.textContent = `${currentState.military.airforce}%`;
  if (readiness) readiness.textContent = `${currentState.military.readiness}%`;
  if (budget) budget.textContent = `₱ ${currentState.military.budget}M`;

  document.querySelectorAll('.military-action').forEach(button => {
    button.onclick = () => {
      const action = button.dataset.action;
      if (!action) return;
      if (action === 'recruit') {
        currentState.military.army = Math.min(100, currentState.military.army + 4);
        currentState.military.budget = Math.max(0, currentState.military.budget - 6);
        currentState.approval = Math.min(100, currentState.approval + 1);
      } else if (action === 'exercise') {
        currentState.military.readiness = Math.min(100, currentState.military.readiness + 5);
        currentState.expenses = Math.min(1000, currentState.expenses + 3);
      }
      saveState(currentState);
      refreshUI();
    };
  });
}

function renderPalace(currentState) {
  const level = document.querySelector('#palace-level');
  const title = document.querySelector('#palace-title');
  const bonus = document.querySelector('#palace-bonus');
  const nextCost = document.querySelector('#palace-next-cost');
  const button = document.querySelector('#palace-upgrade');

  if (level) level.textContent = `Level ${currentState.palace.level}`;
  if (title) title.textContent = currentState.palace.title;
  if (bonus) bonus.textContent = currentState.palace.bonus;
  if (nextCost) nextCost.textContent = `Upgrade cost ₱ ${currentState.palace.nextCost}M`;

  if (button) {
    button.disabled = currentState.palace.level >= 4 || currentState.treasury < currentState.palace.nextCost;
    button.onclick = () => {
      if (currentState.palace.level >= 4 || currentState.treasury < currentState.palace.nextCost) return;
      currentState.treasury -= currentState.palace.nextCost;
      currentState.palace.level += 1;
      currentState.palace.bonus = `Palace bonus +${currentState.palace.level * 2}%`;
      currentState.approval = Math.min(100, currentState.approval + 3);
      currentState.palace.nextCost += 60;
      saveState(currentState);
      refreshUI();
    };
  }
}

initialize();
