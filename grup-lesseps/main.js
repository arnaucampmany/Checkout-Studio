// ─── NAV SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── HAMBURGER ───
const hamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // stagger siblings
  const siblings = el.parentElement.querySelectorAll('.reveal');
  const idx = Array.from(siblings).indexOf(el);
  el.dataset.delay = idx * 120;
  revealObserver.observe(el);
});

// ─── TOAST ───
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ─── FORM HANDLERS ───
function handleTestDriveForm(e) {
  e.preventDefault();
  showToast('¡Prueba reservada! Te llamaremos para confirmar la cita.');
  e.target.reset();
}

function handleContactForm(e) {
  e.preventDefault();
  showToast('¡Mensaje enviado! Te contactaremos en menos de 2 horas.');
  e.target.reset();
}

// ─── SMOOTH ANCHOR OFFSET (compensate fixed nav) ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── HERO PARALLAX (subtle) ───
window.addEventListener('scroll', () => {
  const heroBg = document.querySelector('.hero-bg-car');
  if (!heroBg) return;
  const y = window.scrollY * 0.3;
  heroBg.style.transform = `translateY(${y}px)`;
}, { passive: true });

// ─── MODEL CARD IMAGE PLACEHOLDER LABELS ───
// Give each car visual a subtle text tag
const carVisualLabels = {
  '.seat-ibiza-bg::before': 'SEAT Ibiza',
  '.seat-leon-bg': 'SEAT León',
  '.seat-arona-bg': 'SEAT Arona',
  '.seat-ateca-bg': 'SEAT Ateca',
};
