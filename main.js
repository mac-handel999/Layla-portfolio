/* =========================================================
   LAYLA PORTFOLIO — main.js
   1 Theme toggle · 2 Mobile menu · 3 Scroll progress
   4 Scroll reveal · 5 Testimonial arrows · 6 Contact form
   ========================================================= */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/* ===== 1. THEME TOGGLE ===== */
(function initTheme() {
  const root = document.documentElement;
  const btn = $('#themeToggle');
  if (!btn) return;

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem('theme', theme); } catch (e) {}
  };

  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  apply(saved || 'dark');

  btn.addEventListener('click', () => {
    apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();

/* ===== 2. MOBILE MENU ===== */
(function initMenu() {
  const toggle = $('#menuToggle');
  const panel = $('#mobilePanel');
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    toggle.classList.toggle('open', open);
    panel.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  $$('a', panel).forEach((link) => link.addEventListener('click', () => setOpen(false)));
})();

/* ===== 3. SCROLL PROGRESS LINE ===== */
(function initProgress() {
  const bar = $('#threadProgress');
  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.height = pct + '%';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ===== 4. SCROLL REVEAL ===== */
(function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((el) => observer.observe(el));
})();

/* ===== 5. TESTIMONIAL ARROWS =====
   Expects: <div class="testi-track"> and
   <div class="testi-nav"><button>prev</button><button>next</button></div> */
(function initTestimonials() {
  const track = $('.testi-track');
  const buttons = $$('.testi-nav button');
  if (!track || buttons.length < 2) return;

  const step = () => {
    const card = $('.testi-card', track);
    return card ? card.offsetWidth + 16 : 340;
  };

  buttons[0].addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  buttons[1].addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
})();

/* ===== 6. CONTACT FORM VALIDATION =====
   Expects a <form id="contactForm"> with .field wrappers,
   .field-err messages, and a .success-msg element. */
(function initForm() {
  const form = $('#contactForm');
  if (!form) return;

  const success = $('.success-msg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    $$('.field', form).forEach((field) => {
      const input = $('input, textarea, select', field);
      if (!input || !input.hasAttribute('required')) return;

      const ok = input.type === 'email'
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())
        : input.value.trim() !== '';

      field.classList.toggle('error', !ok);
      if (!ok) valid = false;
    });

    if (valid) {
      // TODO: send the form data to your backend or a form service here.
      if (success) success.classList.add('show');
      form.reset();
    }
  });
})();

/* ===== 7. TWEET EMBEDS IN WORK CARDS =====
   <div class="work-cover" data-tweet-id="1234567890"> becomes an embedded tweet.
   Empty data-tweet-id keeps the gradient cover. */
(function initTweetEmbeds() {
  $$('.work-cover[data-tweet-id]').forEach((cover) => {
    const id = cover.dataset.tweetId.trim();
    if (!id) return;

    const url = encodeURIComponent('https://x.com/i/status/' + id);
    const frame = document.createElement('iframe');
    frame.src = 'https://twitframe.com/show?url=' + url;
    frame.loading = 'lazy';
    frame.title = 'Embedded post';
    cover.setAttribute('data-embed', '');
    cover.prepend(frame);
  });
})();
