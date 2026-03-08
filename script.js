// ── AGE GATE ──────────────────────────────────────────────
(function () {
  var gate = document.getElementById('age-gate');
  if (!gate) return; // already hidden by .age-verified class

  function dismiss() {
    localStorage.setItem('ageVerified', '1');
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

// ── FORM AJAX SUBMISSION (Formspree) ─────────────────────
(function () {
  var form = document.getElementById('order-form');
  if (!form) return;

  var successEl = document.getElementById('form-success');
  var errorEl   = document.getElementById('form-error');
  var submitBtn = form.querySelector('.order-submit');
  var originalBtnHTML = submitBtn.innerHTML;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Disable & show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending\u2026';
    errorEl.hidden = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) {
      if (res.ok) {
        // Hide all form fields, show success block
        Array.from(form.children).forEach(function (el) {
          if (el.id !== 'form-success' && el.id !== 'form-error') {
            el.hidden = true;
          }
        });
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        return res.json().then(function (data) { throw data; });
      }
    })
    .catch(function () {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
      errorEl.hidden = false;
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
})();
