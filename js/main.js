/* ═══════════════════════════════════════════════════════════
   MAIN JAVASCRIPT — Visvesh Manickam Portfolio
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────────────────
   1. PAGE LOADER
   ──────────────────────────────────────────────────────────── */
(function initLoader() {
  // Insert loader HTML
  const loader = document.createElement('div');
  loader.classList.add('page-loader');
  loader.innerHTML = `
    <div class="loader-logo">&lt;VM/&gt;</div>
    <div class="loader-bar"><div class="loader-fill"></div></div>
  `;
  document.body.prepend(loader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 700);
    }, 1300);
  });
})();


/* ────────────────────────────────────────────────────────────
   2. AOS INIT
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
    duration: 800,
  });
});


/* ────────────────────────────────────────────────────────────
   3. CUSTOM CURSOR
   ──────────────────────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .filter-btn, .project-card, .contact-link, .skill-pill');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();


/* ────────────────────────────────────────────────────────────
   4. MATRIX RAIN CANVAS
   ──────────────────────────────────────────────────────────── */
(function initMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const FONT_SIZE  = 14;
  const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン';

  let columns, drops;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    columns = Math.floor(canvas.width / FONT_SIZE);
    drops   = new Array(columns).fill(1);
  }
  resize();

  const resizeObs = new ResizeObserver(resize);
  resizeObs.observe(canvas);

  function drawMatrix() {
    // Fade trail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${FONT_SIZE}px "Courier New", monospace`;

    drops.forEach((y, i) => {
      // Random character
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];

      // Head glow
      if (Math.random() > 0.95) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur   = 12;
        ctx.shadowColor  = '#39ff14';
      } else {
        const brightness = Math.floor(Math.random() * 60 + 40);
        ctx.fillStyle = `rgba(57, 255, 20, ${brightness / 100})`;
        ctx.shadowBlur  = 4;
        ctx.shadowColor = '#39ff14';
      }

      ctx.fillText(char, i * FONT_SIZE, y * FONT_SIZE);

      // Reset drop
      if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  }

  setInterval(drawMatrix, 55);
})();


/* ────────────────────────────────────────────────────────────
   5. TYPEWRITER EFFECT
   ──────────────────────────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const roles = [
    'Frontend Developer',
    'UI/UX Enthusiast',
    'React Specialist',
    'Creative Coder',
    'Open Source Lover',
  ];

  let roleIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = roles[roleIdx];
    el.textContent = isDeleting
      ? current.slice(0, charIdx--)
      : current.slice(0, charIdx++);

    const speed = isDeleting ? 50 : 90;

    if (!isDeleting && charIdx > current.length) {
      setTimeout(() => { isDeleting = true; type(); }, 1800);
      return;
    }
    if (isDeleting && charIdx < 0) {
      isDeleting = false;
      charIdx = 0;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(type, 300);
      return;
    }

    setTimeout(type, speed);
  }

  // Start after initial animation
  setTimeout(type, 1600);
})();


/* ────────────────────────────────────────────────────────────
   6. NAVBAR — scroll & mobile toggle
   ──────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = document.querySelectorAll('.nav-link');

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // Mobile toggle
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        active?.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ────────────────────────────────────────────────────────────
   7. COUNTER ANIMATION
   ──────────────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 16);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();


/* ────────────────────────────────────────────────────────────
   8. SKILL BAR ANIMATION
   ──────────────────────────────────────────────────────────── */
(function initSkillBars() {
  const pills = document.querySelectorAll('.skill-pill');
  if (!pills.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  pills.forEach(p => obs.observe(p));
})();


/* ────────────────────────────────────────────────────────────
   9. PROJECT FILTER
   ──────────────────────────────────────────────────────────── */
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const tags = card.dataset.tags || '';
        const show = filter === 'all' || tags.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          card.style.animation = `fadeInUp 0.4s ease-out ${i * 0.06}s both`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


/* ────────────────────────────────────────────────────────────
   10. CONTACT FORM
   ──────────────────────────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const btnText = document.getElementById('btnText');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simulate sending
    btnText.textContent = 'Sending...';
    form.querySelector('.btn').disabled = true;

    setTimeout(() => {
      btnText.textContent = 'Send Message';
      form.querySelector('.btn').disabled = false;
      form.reset();
      success.style.display = 'block';
      setTimeout(() => success.style.display = 'none', 5000);
    }, 1800);
  });
})();


/* ────────────────────────────────────────────────────────────
   11. BACK TO TOP
   ──────────────────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ────────────────────────────────────────────────────────────
   12. PARALLAX — subtle on hero
   ──────────────────────────────────────────────────────────── */
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const orbs        = document.querySelectorAll('.orb');
  if (!heroContent) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    heroContent.style.transform = `translate(${dx * 8}px, ${dy * 8}px)`;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 12;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });
})();


/* ────────────────────────────────────────────────────────────
   13. TILT EFFECT ON PROJECT CARDS
   ──────────────────────────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  =  dy * 8;
      const tiltY  = -dx * 8;

      card.style.transform = `translateY(-8px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
})();


/* ────────────────────────────────────────────────────────────
   14. GLITCH EFFECT on hero name
   ──────────────────────────────────────────────────────────── */
(function initGlitch() {
  const accent = document.querySelector('.name-line.accent');
  if (!accent) return;
  accent.setAttribute('data-text', accent.textContent);
  accent.classList.add('glitch-text');
})();


/* ────────────────────────────────────────────────────────────
   15. SCROLL PROGRESS BAR
   ──────────────────────────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: linear-gradient(90deg, #1a8a00, #39ff14);
    box-shadow: 0 0 10px #39ff14;
    z-index: 9998;
    transition: width 0.1s linear;
    transform-origin: left;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total  = document.body.scrollHeight - window.innerHeight;
    const pct    = (window.scrollY / total) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();


/* ────────────────────────────────────────────────────────────
   16. LINK ANIMATIONS — add animations.css
   ──────────────────────────────────────────────────────────── */
(function loadAnimations() {
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = 'css/animations.css';
  document.head.appendChild(link);
})();


/* ────────────────────────────────────────────────────────────
   17. SMOOTH SECTION TRANSITIONS — add ripple on click
   ──────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ────────────────────────────────────────────────────────────
   18. CONSOLE EASTER EGG
   ──────────────────────────────────────────────────────────── */
console.log(
  `%c
 ██╗   ██╗███╗   ███╗
 ██║   ██║████╗ ████║
 ██║   ██║██╔████╔██║
 ╚██╗ ██╔╝██║╚██╔╝██║
  ╚████╔╝ ██║ ╚═╝ ██║
   ╚═══╝  ╚═╝     ╚═╝

  Visvesh Manickam — Frontend Developer
  🌐 Interested in working together?
  📧 visvesh@example.com
  `,
  'color: #39ff14; font-family: monospace; font-size: 12px;'
);
