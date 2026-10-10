(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = [...document.querySelectorAll('.nav-link')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme preference: localStorage is optional; fall back gracefully if unavailable.
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('harsh-portfolio-theme'); } catch (_) {}
  if (savedTheme === 'light' || savedTheme === 'dark') root.setAttribute('data-theme', savedTheme);
  const updateThemeButton = () => {
    const isDark = root.getAttribute('data-theme') !== 'light';
    themeIcon.textContent = isDark ? '☼' : '☾';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDark ? '#0b1020' : '#f7f9fd');
  };
  updateThemeButton();
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('harsh-portfolio-theme', next); } catch (_) {}
    updateThemeButton();
  });

  // Accessible mobile navigation.
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };
  navAnchors.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Rotate through professional roles.
  const roles = ['Assistant Professor', 'Laravel Developer', 'Full-Stack Web Developer', 'AI & Machine Learning Enthusiast', 'Placement Coordinator'];
  const roleText = document.getElementById('roleText');
  if (!reducedMotion && roleText) {
    let roleIndex = 0;
    window.setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleText.animate([{opacity: 0, transform: 'translateY(4px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 300, easing: 'ease-out'});
      roleText.textContent = roles[roleIndex];
    }, 2600);
  }

  // Scroll reveal with a no-IntersectionObserver fallback.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Update active navigation link while scrolling.
  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, {rootMargin: '-25% 0px -60% 0px', threshold: 0});
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Project filters.
  const filterButtons = document.querySelectorAll('.filter-button');
  const projectCards = document.querySelectorAll('.project-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    projectCards.forEach(card => {
      const categories = (card.dataset.category || '').split(/\s+/);
      card.hidden = filter !== 'all' && !categories.includes(filter);
    });
  }));

  // Contact form validates locally and opens a prefilled email draft.
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const validators = {
    name: value => value.trim().length >= 2 ? '' : 'Please enter your name (at least 2 characters).',
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Please enter a valid email address.',
    subject: value => value.trim().length >= 3 ? '' : 'Please enter a subject (at least 3 characters).',
    message: value => value.trim().length >= 10 ? '' : 'Please write a message of at least 10 characters.'
  };
  Object.keys(validators).forEach(key => {
    const input = form.elements[key];
    input.addEventListener('input', () => {
      const error = validators[key](input.value);
      input.setAttribute('aria-invalid', String(Boolean(error)));
      document.getElementById(`${key}Error`).textContent = error;
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    let valid = true;
    Object.keys(validators).forEach(key => {
      const input = form.elements[key];
      const error = validators[key](input.value);
      input.setAttribute('aria-invalid', String(Boolean(error)));
      document.getElementById(`${key}Error`).textContent = error;
      if (error) valid = false;
    });
    if (!valid) {
      feedback.textContent = 'Please check the highlighted fields and try again.';
      feedback.style.color = '#ed6a83';
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    // No email address was provided; don't pretend the message has been sent.
    const recipient = ''; // Add a verified public email address here to enable mailto.
    if (!recipient) {
      feedback.textContent = 'The form is validated, but no public email address is configured yet. Add your preferred email in script.js to enable the email draft.';
      feedback.style.color = '';
      return;
    }
    const subject = encodeURIComponent(form.elements.subject.value.trim());
    const body = encodeURIComponent(`Name: ${form.elements.name.value.trim()}\nReply email: ${form.elements.email.value.trim()}\n\n${form.elements.message.value.trim()}`);
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    feedback.textContent = 'Your email application should open with the message draft. Review it and send when ready.';
    feedback.style.color = '';
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();