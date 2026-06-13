export function formatCurrency(value) {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function formatCount(value, precision = 0) {
  return value.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision });
}

export function clampValue(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function animateValue(target, to, formatter) {
  if (!target) return;

  const startText = target.textContent || '0';
  const start = Number(startText.replace(/[^0-9.-]/g, '')) || 0;
  const end = Number(to);
  const duration = 700;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = start + (end - start) * easeOutCubic(progress);
    target.textContent = formatter(Math.round(currentValue));
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function togglePage(targetPage) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    const isActive = page.dataset.page === targetPage;
    page.classList.toggle('active', isActive);
  });
}

export function setActiveNav(target) {
  const buttons = document.querySelectorAll('.nav-button');
  buttons.forEach(button => {
    button.classList.toggle('active', button.dataset.target === target);
  });
}

const DOM = {
  heroDate: document.querySelector('#hero-date'),
  heroDay: document.querySelector('#hero-day'),
  realmScore: document.querySelector('#realm-score'),
  dailyIncome: document.querySelector('#daily-income'),
  progressOverlay: document.querySelector('#progress-overlay'),
  progressStep: document.querySelector('#progress-step'),
  progressFill: document.querySelector('#progress-fill'),
  modal: document.querySelector('#event-modal'),
  viewEventButton: document.querySelector('#view-event-button'),
  modalClose: document.querySelector('#modal-close'),
  newsContinueButton: document.querySelector('#continue-news-button'),
  decisionModal: document.querySelector('#decision-modal'),
  decisionYes: document.querySelector('#decision-yes'),
  decisionNo: document.querySelector('#decision-no'),
  decisionClose: document.querySelector('#decision-close')
};

export function animateEntrance() {
  const cards = document.querySelectorAll('.card-load');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.05}s`;
    card.classList.add('fade-in');
  });
}

export function updateHero(state) {
  if (DOM.heroDate) DOM.heroDate.textContent = state.date;
  if (DOM.heroDay) DOM.heroDay.textContent = `Day ${state.day}`;
  if (DOM.realmScore) DOM.realmScore.textContent = state.realmScore;
  if (DOM.dailyIncome) DOM.dailyIncome.textContent = `₱ ${formatCurrency(state.income)}M`;
}

export function openModal() {
  DOM.modal?.classList.remove('hidden');
}

export function closeModal() {
  DOM.modal?.classList.add('hidden');
}

export function bindNavigation() {
  const navButtons = document.querySelectorAll('.nav-button');
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      togglePage(target);
      setActiveNav(target);
    });
  });
}

export function bindModalControls(onOpen, onClose) {
  DOM.viewEventButton?.addEventListener('click', () => {
    onOpen();
    openModal();
  });
  DOM.modalClose?.addEventListener('click', () => {
    closeModal();
    onClose();
  });
  DOM.modal?.addEventListener('click', event => {
    if (event.target === event.currentTarget) {
      closeModal();
      onClose();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !DOM.modal?.classList.contains('hidden')) {
      closeModal();
      onClose();
    }
  });
}

export function bindResetButton(onReset) {
  document.querySelector('#reset-button')?.addEventListener('click', onReset);
}

export function animateButtonInteraction(button) {
  if (!button) return;
  button.classList.add('pop-in');
  setTimeout(() => button?.classList.remove('pop-in'), 250);
}

export function showProgress(stepText, progress) {
  if (!DOM.progressOverlay || !DOM.progressStep || !DOM.progressFill) return;
  DOM.progressOverlay.classList.remove('hidden');
  DOM.progressStep.textContent = stepText;
  DOM.progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

export function hideProgress() {
  DOM.progressOverlay?.classList.add('hidden');
}

