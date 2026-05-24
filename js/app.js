/* ==========================================
   MAROC 2026 — JavaScript
   ========================================== */

// Countdown J-X
function updateCountdown() {
  const departure = new Date('2026-10-31T00:00:00');
  const now = new Date();
  const diff = departure - now;

  const el = document.getElementById('countdown');
  if (!el) return;

  if (diff <= 0) {
    el.innerHTML = 'Bon voyage !';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  el.innerHTML = `Depart dans <strong>J-${days}</strong> jours et ${hours}h`;
}

// Dark mode toggle
function initDarkMode() {
  const btn = document.getElementById('darkModeToggle');
  if (!btn) return;

  const saved = localStorage.getItem('maroc2026-theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    btn.textContent = '\u2600';
  }

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      btn.textContent = '\u263D';
      localStorage.setItem('maroc2026-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      btn.textContent = '\u2600';
      localStorage.setItem('maroc2026-theme', 'dark');
    }
  });
}

// Checklist with localStorage
function initChecklist() {
  const items = document.querySelectorAll('.todo-list li');
  const saved = JSON.parse(localStorage.getItem('maroc2026-checklist') || '{}');

  items.forEach((li, i) => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    if (saved[i]) {
      checkbox.checked = true;
      li.classList.add('checked');
    }

    checkbox.addEventListener('change', () => {
      li.classList.toggle('checked', checkbox.checked);
      const state = JSON.parse(localStorage.getItem('maroc2026-checklist') || '{}');
      state[i] = checkbox.checked;
      localStorage.setItem('maroc2026-checklist', JSON.stringify(state));
    });
  });
}

// Scroll animations (fade-in)
function initScrollAnimations() {
  const elements = document.querySelectorAll('.etape, .fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));

  // Fallback: reveal all after 2s in case observer doesn't fire
  setTimeout(() => {
    elements.forEach(el => el.classList.add('visible'));
  }, 2000);
}

// Smooth scroll for nav links
function initSmoothScroll() {
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Print button
function initPrint() {
  const btn = document.getElementById('printBtn');
  if (btn) {
    btn.addEventListener('click', () => window.print());
  }
}

// Init all
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  setInterval(updateCountdown, 60000);
  initDarkMode();
  initChecklist();
  initScrollAnimations();
  initSmoothScroll();
  initPrint();
});
