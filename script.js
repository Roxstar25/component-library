/* ============================================
   1. MODAL
   ============================================ */
document.querySelectorAll('[data-modal-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById(btn.dataset.modalOpen);
    modal.setAttribute('aria-hidden', 'false');
  });
});

document.querySelectorAll('[data-modal-close]').forEach(el => {
  el.addEventListener('click', () => {
    const modal = el.closest('.modal');
    modal.setAttribute('aria-hidden', 'true');
  });
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal[aria-hidden="false"]').forEach(m => {
      m.setAttribute('aria-hidden', 'true');
    });
  }
});

/* ============================================
   2. TABS — with sliding pill + panel slide
   ============================================ */
document.querySelectorAll('.tabs').forEach(tabs => {
  const tabButtons = tabs.querySelectorAll('.tabs__tab');
  const panels = tabs.querySelectorAll('.tabs__panel');
  const list = tabs.querySelector('.tabs__list');
  const activeTab = tabs.querySelector('.tabs__tab.is-active');
  
  // Create sliding pill
  const pill = document.createElement('div');
  pill.className = 'tabs__pill';
  pill.style.cssText = `
    position: absolute;
    top: 4px;
    bottom: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
    pointer-events: none;
  `;
  list.style.position = 'relative';
  list.appendChild(pill);
  
  // Position pill on active tab
  function movePillTo(tab) {
    pill.style.left = tab.offsetLeft + 'px';
    pill.style.width = tab.offsetWidth + 'px';
  }
  
  // Initial position
  if (activeTab) movePillTo(activeTab);
  
  // Update on window resize
  window.addEventListener('resize', () => {
    const current = tabs.querySelector('.tabs__tab.is-active');
    if (current) movePillTo(current);
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPanel = tabs.querySelector('#' + btn.dataset.tab);
      const currentPanel = tabs.querySelector('.tabs__panel.is-active');
      
      // Don't re-click active
      if (btn.classList.contains('is-active')) return;
      
      // Move pill
      movePillTo(btn);
      
      // Update tabs
      tabButtons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      
      // Slide panels
      if (currentPanel) {
        currentPanel.classList.add('is-exiting');
        currentPanel.classList.remove('is-active');
        setTimeout(() => currentPanel.classList.remove('is-exiting'), 300);
      }
      
      targetPanel.classList.add('is-active');
    });
  });
});


/* ============================================
   3. ACCORDION
   ============================================ */
document.querySelectorAll('.accordion__trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion__item');
    const isOpen = item.classList.contains('is-open');

    // Close all others (optional — remove this loop for multi-open)
    document.querySelectorAll('.accordion__item.is-open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle current
    item.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', !isOpen);
  });
});

/* ============================================
   4. CAROUSEL
   ============================================ */
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.carousel__track');
  const slides = carousel.querySelectorAll('.carousel__slide');
  const prevBtn = carousel.querySelector('.carousel__btn--prev');
  const nextBtn = carousel.querySelector('.carousel__btn--next');
  const dotsContainer = carousel.querySelector('.carousel__dots');
  let current = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = carousel.querySelectorAll('.carousel__dot');

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  }

  prevBtn.addEventListener('click', () => {
    goTo(current === 0 ? slides.length - 1 : current - 1);
  });

  nextBtn.addEventListener('click', () => {
    goTo(current === slides.length - 1 ? 0 : current + 1);
  });

  // Auto-play every 4 seconds
  setInterval(() => {
    goTo(current === slides.length - 1 ? 0 : current + 1);
  }, 4000);
});

/* ============================================
   5. TOAST NOTIFICATIONS
   ============================================ */
const toastContainer = document.querySelector('.toast-container');

document.querySelectorAll('[data-toast]').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.toast;
    const messages = {
      success: '✅ Changes saved successfully!',
      error: '❌ Something went wrong. Try again.',
      info: 'ℹ️ New update available.'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = messages[type];
    toastContainer.appendChild(toast);

    // Remove from DOM after animation
    setTimeout(() => toast.remove(), 3000);
  });
});

/* ============================================
   6. DROPDOWN
   ============================================ */
document.querySelectorAll('.dropdown').forEach(dropdown => {
  const toggle = dropdown.querySelector('.dropdown__toggle');

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('is-open');
    // Close all other dropdowns
    document.querySelectorAll('.dropdown.is-open').forEach(d => {
      if (d !== dropdown) d.classList.remove('is-open');
    });
    dropdown.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', !isOpen);
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown.is-open').forEach(d => {
    d.classList.remove('is-open');
    d.querySelector('.dropdown__toggle').setAttribute('aria-expanded', 'false');
  });
});
