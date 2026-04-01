// ============================================================
// Entretien Extérieur Élite — main.js
// ============================================================

// --- Services Dropdown ---
(function () {
  const dropdown = document.getElementById('navServicesDropdown');
  if (!dropdown) return;
  const toggle = dropdown.querySelector('.nav-dropdown-toggle');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// --- Mobile Services Sub-menu ---
(function () {
  const btn = document.getElementById('mobileServicesToggle');
  const menu = document.getElementById('mobileServicesMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
  });
})();

// --- Sticky Header ---
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// --- Mobile Menu Toggle ---
const menuToggle = document.getElementById('menu-toggle');
const mobileNav  = document.getElementById('mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on click outside
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// --- Pre-select service tile from URL param (e.g. soumission.html?service=vitres) ---
const urlParams = new URLSearchParams(window.location.search);
const serviceParam = urlParams.get('service');
if (serviceParam) {
  const serviceMap = {
    'vitres-ext': 'Nettoyage de vitres extérieur',
    'vitres-int': 'Nettoyage de vitres intérieur',
    'doux':       'Lavage de maison',
    'gouttieres': 'Nettoyage de gouttières',
  };
  const mapped = serviceMap[serviceParam];
  if (mapped) {
    const tiles = document.querySelectorAll('.service-select-tile');
    tiles.forEach(tile => {
      if (tile.dataset.service === mapped) {
        tile.classList.add('selected');
        updateServiceField();
      }
    });
  }
}

// --- Multi-Step Form ---
(function () {
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  if (!step1 || !step2 || !step3) return;

  function showStep(stepEl) {
    [step1, step2, step3].forEach(s => s.classList.remove('active'));
    stepEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Step 1 → 2
  document.getElementById('nextStep1').addEventListener('click', () => {
    const nom = document.getElementById('nom');
    const courriel = document.getElementById('courriel');
    const telephone = document.getElementById('telephone');
    if (!nom.value.trim() || !courriel.checkValidity() || !telephone.value.trim()) {
      if (!nom.value.trim()) nom.reportValidity();
      else if (!courriel.checkValidity()) courriel.reportValidity();
      else telephone.reportValidity();
      return;
    }
    showStep(step2);
  });

  // Step 2 ← 1
  document.getElementById('prevStep2').addEventListener('click', () => showStep(step1));

  // Step 2 → 3
  document.getElementById('nextStep2').addEventListener('click', () => showStep(step3));

  // Step 3 ← 2
  document.getElementById('prevStep3').addEventListener('click', () => showStep(step2));

  // Service tile selection
  const tiles = document.querySelectorAll('.service-select-tile');
  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      tile.classList.toggle('selected');
      updateServiceField();
    });
  });
})();

function updateServiceField() {
  const selected = Array.from(document.querySelectorAll('.service-select-tile.selected'))
    .map(t => t.dataset.service);
  const field = document.getElementById('serviceField');
  if (field) field.value = selected.join(', ') || '';
}

// --- Review Modal ---
(function () {
  const modal = document.getElementById('reviewModal');
  const modalClose = document.getElementById('reviewModalClose');
  if (!modal) return;

  const reviews = document.querySelectorAll('.review-read-more');
  reviews.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.review-card');
      const name = card.querySelector('.review-name').textContent;
      const avatarHTML = card.querySelector('.review-avatar').innerHTML;
      const fullText = card.querySelector('.review-text-full').textContent;

      document.getElementById('modalName').textContent = name;
      document.getElementById('modalAvatar').innerHTML = avatarHTML;
      document.getElementById('modalText').textContent = fullText;

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();

// --- Process Carousel ---
(function () {
  const slides = document.querySelectorAll('.process-slide');
  const dots   = document.querySelectorAll('.process-dot');
  const prev   = document.querySelector('.process-prev');
  const next   = document.querySelector('.process-next');
  if (!slides.length) return;

  let current = 0;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = ((index % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
})();

// --- Testimonials Carousel ---
(function () {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const dots   = document.querySelectorAll('.carousel-dot');
  const prev   = document.getElementById('carouselPrev');
  const next   = document.getElementById('carouselNext');
  let current  = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = ((index % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6000);
  }

  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  resetTimer();
})();

// --- Fade-in sections on scroll (subtle entrance animation) ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.service-card, .step, .why-item, .before-after-pair, .value-card, .technique-card, .review-card, .service-tile, .service-select-tile, .promise-item'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Inject fade-in styles
const style = document.createElement('style');
style.textContent = `
  .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);
