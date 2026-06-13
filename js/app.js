import { loadState, saveState, resetState } from './storage.js';
import { updateDashboard } from './dashboard.js';
import { createEvent, applyEvent, renderEventPanel, populateEventModal, populateRecentEvents } from './events.js';
import { updateGovernors, refreshPoliticalScene } from './governors.js';
import { updateHero, bindNavigation, animateEntrance, bindModalControls, bindResetButton, animateButtonInteraction, setActiveNav, togglePage, showProgress, hideProgress } from './ui.js';

const state = loadState();

function initialize() {
  updateHero(state);
  updateDashboard(state);
  updateGovernors(state);
  renderEventPanel(state);
  populateRecentEvents(state);
  bindNavigation();
  bindModalControls(() => populateEventModal(state.currentEvent), () => {});
  bindResetButton(handleReset);
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
    { text: 'Updating Treasury...', progress: 14, duration: 360 },
    { text: 'Updating Economy...', progress: 28, duration: 360 },
    { text: 'Updating Population...', progress: 42, duration: 360 },
    { text: 'Updating Governors...', progress: 56, duration: 360 },
    { text: 'Checking Events...', progress: 72, duration: 360 },
    { text: 'Saving Kingdom...', progress: 88, duration: 360 },
    { text: 'Next Day Complete', progress: 100, duration: 460 }
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
        setTimeout(() => {
          hideProgress();
          button.disabled = false;
        }, 280);
      }
    }, step.duration);
  }

  nextStep();
}

function applyDayTransition() {
  state.day += 1;
  state.date = nextDate(state.date);
  const currentEvent = createEvent(state);
  state.governors = refreshPoliticalScene(state, currentEvent);
  Object.assign(state, applyEvent(state, currentEvent));
  state.currentEvent = currentEvent;
  saveState(state);
  refreshUI();
}

function refreshUI() {
  updateHero(state);
  updateDashboard(state);
  updateGovernors(state);
  renderEventPanel(state);
  populateRecentEvents(state);
}

function handleReset() {
  const newState = resetState();
  Object.assign(state, newState);
  saveState(state);
  hideProgress();
  refreshUI();
}

function nextDate(dateString) {
  const iso = new Date(dateString).toISOString();
  const next = new Date(iso);
  next.setDate(next.getDate() + 1);
  return next.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

initialize();
