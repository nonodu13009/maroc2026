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

// Audio Player
function initPlayer() {
  const tracks = [
    { title: 'Moroccan Travel Vlog', file: 'musique/02-moroccan-travel-vlog.mp3' },
    { title: 'Bahia Rai Afrobeat', file: 'musique/01-bahia-rai-afrobeat.mp3' },
    { title: 'Desert Groove', file: 'musique/03-desert-groove.mp3' },
    { title: 'Moroccan Style', file: 'musique/04-moroccan-style.mp3' },
    { title: 'Medina Melodies', file: 'musique/05-medina-melodies.mp3' }
  ];

  let currentTrack = 0;
  let isPlaying = false;
  const audio = new Audio();

  const player = document.getElementById('player');
  const toggle = document.getElementById('playerToggle');
  const trackName = document.getElementById('playerTrack');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const barFill = document.getElementById('playerBarFill');
  const bar = document.getElementById('playerBar');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  const volumeSlider = document.getElementById('volumeSlider');

  if (!player) return;

  function loadTrack(i) {
    currentTrack = i;
    audio.src = tracks[i].file;
    trackName.textContent = tracks[i].title;
    barFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    totalTimeEl.textContent = '0:00';
  }

  function formatTime(s) {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return min + ':' + (sec < 10 ? '0' : '') + sec;
  }

  // Toggle panel
  toggle.addEventListener('click', () => {
    player.classList.toggle('collapsed');
  });

  // Play / Pause
  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playPauseBtn.innerHTML = '\u25B6';
      isPlaying = false;
    } else {
      audio.play();
      playPauseBtn.innerHTML = '\u23F8';
      isPlaying = true;
      if (player.classList.contains('collapsed')) {
        player.classList.remove('collapsed');
      }
    }
  });

  // Prev / Next
  prevBtn.addEventListener('click', () => {
    loadTrack((currentTrack - 1 + tracks.length) % tracks.length);
    if (isPlaying) audio.play();
  });

  nextBtn.addEventListener('click', () => {
    loadTrack((currentTrack + 1) % tracks.length);
    if (isPlaying) audio.play();
  });

  // Progress update
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      barFill.style.width = pct + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  // Click on progress bar to seek
  bar.addEventListener('click', (e) => {
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  // Auto next track
  audio.addEventListener('ended', () => {
    loadTrack((currentTrack + 1) % tracks.length);
    audio.play();
  });

  // Volume
  audio.volume = 0.7;
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      audio.volume = volumeSlider.value / 100;
    });
  }

  // Start playing (called externally from door open)
  function startPlaying() {
    audio.play();
    playPauseBtn.innerHTML = '\u23F8';
    isPlaying = true;
    player.classList.remove('collapsed');
  }

  // Load first track
  loadTrack(0);

  // Expose for door trigger
  window.playerStart = startPlaying;
}

// Splash screen
function initSplash() {
  const splash = document.getElementById('splash');
  const cta = document.getElementById('splashCta');
  if (!splash || !cta) return;

  if (sessionStorage.getItem('maroc2026-entered')) {
    splash.classList.add('hidden');
    return;
  }

  cta.addEventListener('click', () => {
    splash.classList.add('leaving');
    sessionStorage.setItem('maroc2026-entered', 'true');
    if (window.playerStart) window.playerStart();
    setTimeout(() => {
      splash.classList.add('hidden');
    }, 900);
  });
}

// Init all
document.addEventListener('DOMContentLoaded', () => {
  initPlayer();
  initSplash();
  updateCountdown();
  setInterval(updateCountdown, 60000);
  initDarkMode();
  initChecklist();
  initScrollAnimations();
  initSmoothScroll();
  initPrint();
});
