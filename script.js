// ── AGE GATE ──────────────────────────────────────────────
(function () {
  var gate = document.getElementById('age-gate');
  if (!gate) return; // already hidden by .age-verified class

  function dismiss() {
    sessionStorage.setItem('ageVerified', '1');
    gate.classList.add('age-gate-exit');
    setTimeout(function () {
      gate.style.display = 'none';
      document.body.style.overflow = '';
    }, 520);
  }

  // Prevent page scroll while gate is visible
  document.body.style.overflow = 'hidden';

  document.getElementById('age-yes').addEventListener('click', dismiss);

  document.getElementById('age-no').addEventListener('click', function () {
    window.location.href = 'https://www.google.com';
  });

  // Keyboard: Enter/Space on focused button is handled natively.
  // Also allow Escape to close (treat as "yes" — user can already see the page behind overlay)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') dismiss();
  }, { once: true });
})();

// ── Mobile nav
const hamburger = document.getElementById('hamburger-btn');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', function () {
  const isOpen = navLinks.classList.toggle('mobile-open');
  hamburger.classList.toggle('open', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
});

// Close nav when any link is clicked
navLinks.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('mobile-open');
    hamburger.classList.remove('open');
    document.body.classList.remove('nav-open');
  }
});

// Nav scroll effect
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── OPEN / CLOSED STATUS ──────────────────────────────────
(function () {
  var badge = document.getElementById('open-status');
  if (!badge) return;
  try {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Detroit',
      hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    var h = parseInt(parts.find(function (p) { return p.type === 'hour'; }).value);
    var m = parseInt(parts.find(function (p) { return p.type === 'minute'; }).value);
    var total = h * 60 + m;
    // Open 10:00 AM–10:00 PM (600–1320 minutes)
    var open = total >= 600 && total < 1320;
    badge.textContent = open ? 'Open Now' : 'Closed';
    badge.className = 'open-badge ' + (open ? 'open-badge-open' : 'open-badge-closed');
  } catch (e) { /* Intl not available — just leave badge hidden */ }
})();

// ── FORM SUCCESS BANNER ───────────────────────────────────
// FormSubmit.co redirects back with ?sent=1 after submission.
if (new URLSearchParams(window.location.search).get('sent') === '1') {
  const banner = document.createElement('div');
  banner.setAttribute('role', 'status');
  banner.style.cssText = [
    'position:fixed', 'bottom:1.5rem', 'left:50%', 'transform:translateX(-50%)',
    'background:#1548B3', 'color:#fff', 'padding:1rem 2rem', 'border-radius:8px',
    'font-family:DM Sans,sans-serif', 'font-size:0.92rem', 'font-weight:500',
    'box-shadow:0 8px 30px rgba(0,0,0,0.3)', 'z-index:9000',
    'max-width:90vw', 'text-align:center', 'animation:fadeUp 0.5s ease-out'
  ].join(';');
  banner.textContent = '✓ Request sent! We\'ll reach out soon to confirm your order.';
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 6000);
  // Clean URL so refreshing doesn't re-show banner
  history.replaceState({}, '', window.location.pathname);
}
