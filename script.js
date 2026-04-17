// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => observer.observe(section));

// Theme Customizer

const THEMES = {
  minimal:   { '--bg': '#ffffff', '--surface': '#f5f5f5', '--border': '#e5e5e5', '--text': '#111111', '--muted': '#666666', '--nav-bg': 'rgba(255,255,255,0.85)' },
  barcelona: { '--bg': '#1a0f0a', '--surface': '#2a1a12', '--border': '#3d2b1f', '--text': '#f0e8d8', '--muted': '#a08060', '--nav-bg': 'rgba(26,15,10,0.85)' },
  darkroom:  { '--bg': '#0f0a0a', '--surface': '#1a1010', '--border': '#2a1a1a', '--text': '#e8d8d8', '--muted': '#887070', '--nav-bg': 'rgba(15,10,10,0.85)' },
  gravel:    { '--bg': '#1c1c1e', '--surface': '#2c2c2e', '--border': '#3a3a3c', '--text': '#ebebf5', '--muted': '#8e8e93', '--nav-bg': 'rgba(28,28,30,0.85)' },
};

const ACCENTS = ['#7c6af7', '#f06292', '#f59e0b', '#14b8a6', '#38bdf8', '#84cc16'];

const FONTS = {
  sans:  "'Inter', system-ui, -apple-system, sans-serif",
  serif: "'Merriweather', Georgia, serif",
  mono:  "'JetBrains Mono', 'Fira Code', monospace",
};

const DENSITIES = [
  { '--section-gap': '3rem',  '--card-gap': '0.75rem', '--card-padding': '1rem'    },
  { '--section-gap': '6rem',  '--card-gap': '1.25rem', '--card-padding': '1.5rem'  },
  { '--section-gap': '9rem',  '--card-gap': '2rem',    '--card-padding': '2.25rem' },
];

const PREFS_KEY = 'tc-prefs';

function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; }
  catch { return {}; }
}

function savePrefs(update) {
  localStorage.setItem(PREFS_KEY, JSON.stringify({ ...loadPrefs(), ...update }));
}

function applyVars(obj) {
  Object.entries(obj).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
}

// Build accent swatches
const accentsEl = document.getElementById('tc-accents');
ACCENTS.forEach((color) => {
  const btn = document.createElement('button');
  btn.className = 'tc-swatch';
  btn.style.background = color;
  btn.dataset.accent = color;
  btn.setAttribute('aria-label', `Accent colour ${color}`);
  accentsEl.appendChild(btn);
});

function syncActiveStates(prefs) {
  document.querySelectorAll('.tc-presets button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.theme === prefs.theme);
  });
  document.querySelectorAll('.tc-swatch').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.accent === prefs.accent);
  });
  document.querySelectorAll('.tc-fonts button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.font === prefs.font);
  });
  if (prefs.density != null) {
    document.getElementById('tc-density').value = prefs.density;
  }
}

// Preset buttons
document.querySelectorAll('.tc-presets button').forEach((btn) => {
  btn.addEventListener('click', () => {
    applyVars(THEMES[btn.dataset.theme]);
    savePrefs({ theme: btn.dataset.theme });
    syncActiveStates(loadPrefs());
  });
});

// Accent swatches
accentsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.tc-swatch');
  if (!btn) return;
  document.documentElement.style.setProperty('--accent', btn.dataset.accent);
  savePrefs({ accent: btn.dataset.accent });
  syncActiveStates(loadPrefs());
});

// Font buttons
document.querySelectorAll('.tc-fonts button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.documentElement.style.setProperty('--font', FONTS[btn.dataset.font]);
    savePrefs({ font: btn.dataset.font });
    syncActiveStates(loadPrefs());
  });
});

// Density slider
document.getElementById('tc-density').addEventListener('input', (e) => {
  const density = parseInt(e.target.value, 10);
  applyVars(DENSITIES[density]);
  savePrefs({ density });
});

// Toggle panel open/closed
const tcToggle = document.getElementById('tc-toggle');
const tcPanel = document.getElementById('tc-panel');

tcToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  tcPanel.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!document.getElementById('tc-wrap').contains(e.target)) {
    tcPanel.classList.remove('open');
  }
});

// Restore saved state into UI controls
syncActiveStates(loadPrefs());
