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
  const backdrop = document.querySelector('#sheet-backdrop');

  pages.forEach(page => {
    if (page.dataset.page === 'dashboard') {
      page.classList.add('active');
      return;
    }
    if (targetPage === 'dashboard') {
      page.classList.remove('active');
    } else {
      page.classList.toggle('active', page.dataset.page === targetPage);
    }
  });

  if (backdrop) {
    backdrop.classList.toggle('hidden', targetPage === 'dashboard');
  }
}

export function closeSheets() {
  togglePage('dashboard');
  setActiveNav('dashboard');
}

export function bindSheetBackdrop(onClose) {
  const backdrop = document.querySelector('#sheet-backdrop');
  if (!backdrop) return;
  backdrop.addEventListener('click', () => {
    onClose();
    closeSheets();
  });
}

export function bindSheetGestures() {
  let startY = 0;
  let activeSheet = null;

  document.addEventListener('touchstart', event => {
    activeSheet = event.target.closest('.sheet-page.active');
    if (!activeSheet) return;
    startY = event.touches[0].clientY;
  });

  document.addEventListener('touchmove', event => {
    if (!activeSheet) return;
    const currentY = event.touches[0].clientY;
    const delta = currentY - startY;
    if (delta > 0) {
      activeSheet.style.transform = `translateY(${delta}px)`;
    }
  });

  document.addEventListener('touchend', event => {
    if (!activeSheet) return;
    const endY = event.changedTouches[0].clientY;
    const delta = endY - startY;
    activeSheet.style.transform = '';
    if (delta > 110) {
      closeSheets();
    }
    activeSheet = null;
  });
}

export function bindSheetCloseButtons() {
  document.querySelectorAll('.sheet-page').forEach(page => {
    let closeButton = page.querySelector('.sheet-close');
    if (!closeButton) {
      const header = page.querySelector('.page-header');
      if (!header) return;
      closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.className = 'sheet-close';
      closeButton.textContent = '✕';
      header.appendChild(closeButton);
      closeButton.addEventListener('click', closeSheets);
    }
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

export function bindNewsContinue(onContinue) {
  DOM.newsContinueButton?.addEventListener('click', onContinue);
}

export function bindDecisionControls(onChoice) {
  DOM.decisionYes?.addEventListener('click', () => onChoice('yes'));
  DOM.decisionNo?.addEventListener('click', () => onChoice('no'));
  DOM.decisionClose?.addEventListener('click', () => DOM.decisionModal?.classList.add('hidden'));
  DOM.decisionModal?.addEventListener('click', event => {
    if (event.target === event.currentTarget) {
      DOM.decisionModal?.classList.add('hidden');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !DOM.decisionModal?.classList.contains('hidden')) {
      DOM.decisionModal?.classList.add('hidden');
    }
  });
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

