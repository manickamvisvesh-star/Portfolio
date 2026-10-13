'use strict';
document.documentElement.classList.add('js');

/* ════════════════════════════════════════════════════
   1. PAGE LOADER
════════════════════════════════════════════════════ */
const loader  = document.getElementById('loader');
const loaderP = document.getElementById('loaderPct');
let progress = 0;

function dismissLoader() {
  if (!loader) return;
  loader.classList.add('out');
  setTimeout(() => {
    loader.style.display = 'none';
    loader.remove();
  }, 500);
}

const loaderTimer = setInterval(() => {
  progress += Math.random() * 25 + 15;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loaderTimer);
    if (loaderP) loaderP.textContent = '100%';
    setTimeout(dismissLoader, 200);
  } else {
    if (loaderP) loaderP.textContent = Math.floor(progress) + '%';
  }
}, 80);

// Fallback safety timeout in case interval is delayed
setTimeout(dismissLoader, 1500);


/* ════════════════════════════════════════════════════
   2. SCROLL PROGRESS BAR
════════════════════════════════════════════════════ */
const scrollBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  if (!scrollBar) return;
  const total = document.body.scrollHeight - window.innerHeight;
  scrollBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });


/* ════════════════════════════════════════════════════
   3. CUSTOM CURSOR
════════════════════════════════════════════════════ */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
});
(function animRing() {
  rx += (mx - rx) * .13;
  ry += (my - ry) * .13;
  ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a,button,.flt,.proj-card,.clink,.soc-btn,.btt,.hscroll-arrow,.marquee-inner span').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('big'));
  el.addEventListener('mouseleave', () => ring.classList.remove('big'));
});


/* ════════════════════════════════════════════════════
   4. MATRIX RAIN — Hero background
════════════════════════════════════════════════════ */
function initMatrix(canvasId, alpha) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const CHARS = '01アイウエオカキクケコサシスセソ#$%&@<>/{}[]';
  const FS = 13;
  let cols, drops;

  function resize() {
    canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
    canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
    cols  = Math.floor(canvas.width / FS);
    drops = new Array(cols).fill(1);
  }
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement || canvas);

  setInterval(() => {
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FS}px "JetBrains Mono", monospace`;
    drops.forEach((y, i) => {
      const c = CHARS[Math.floor(Math.random() * CHARS.length)];
      if (Math.random() > .97) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#39ff14';
      } else {
        ctx.fillStyle = `rgba(57,255,20,${Math.random() * .6 + .3})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#39ff14';
      }
      ctx.fillText(c, i * FS, y * FS);
      if (y * FS > canvas.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    });
  }, 55);
}
initMatrix('matrixCanvas', 0.05);
initMatrix('screenCanvas', 0.12);


/* ════════════════════════════════════════════════════
   5. TYPEWRITER
════════════════════════════════════════════════════ */
const typedEl = document.getElementById('typedEl');
const roles   = [
  'Frontend Developer',
  'UI/UX Enthusiast',
  'React Specialist',
  'Creative Coder',
  'Open Source Lover',
];
let ri = 0, ci = 0, del = false;

function type() {
  const cur = roles[ri];
  if (typedEl) typedEl.textContent = del ? cur.slice(0, ci--) : cur.slice(0, ci++);
  let speed = del ? 45 : 85;
  if (!del && ci > cur.length) { setTimeout(() => { del = true; type(); }, 1800); return; }
  if (del && ci < 0)  { del = false; ci = 0; ri = (ri + 1) % roles.length; setTimeout(type, 300); return; }
  setTimeout(type, speed);
}
setTimeout(type, 1800);


/* ════════════════════════════════════════════════════
   6. NAVBAR
════════════════════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navAnchors = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navAnchors.forEach(a => a.addEventListener('click', () => {
  hamburger?.classList.remove('open');
  navLinks?.classList.remove('open');
}));

// Active link
const sections = document.querySelectorAll('section[id]');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      document.querySelector(`.nav-link[href="#${e.target.id}"]`)?.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => io.observe(s));


/* ════════════════════════════════════════════════════
   7. SCROLL REVEAL
════════════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('[data-reveal]');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.revealDelay || 0;
      setTimeout(() => e.target.classList.add('visible'), parseInt(delay));
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revObs.observe(el));


/* ════════════════════════════════════════════════════
   8. COUNTER ANIMATION
════════════════════════════════════════════════════ */
document.querySelectorAll('.hstat-n[data-count]').forEach(el => {
  const countObs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    const target = +el.dataset.count;
    let cur = 0;
    const step = target / (2000 / 16);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur);
      if (cur >= target) clearInterval(t);
    }, 16);
    countObs.unobserve(el);
  }, { threshold: 0.5 });
  countObs.observe(el);
});


/* ════════════════════════════════════════════════════
   9. SKILL BARS
════════════════════════════════════════════════════ */
document.querySelectorAll('.skill-fill').forEach(bar => {
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      bar.classList.add('filled');
      obs.unobserve(bar);
    }
  }, { threshold: 0.3 });
  obs.observe(bar);
});


/* ════════════════════════════════════════════════════
   10. HORIZONTAL SCROLL — Projects
════════════════════════════════════════════════════ */
const track  = document.getElementById('hTrack');
const hLeft  = document.getElementById('hLeft');
const hRight = document.getElementById('hRight');
const dotsWrap = document.getElementById('hDots');
const cards  = [...document.querySelectorAll('.proj-card')];
const CARD_W = 300 + 24; // card width + gap

// Build dots
const TOTAL_DOTS = Math.ceil(cards.length / 1);
for (let i = 0; i < cards.length; i++) {
  const d = document.createElement('button');
  d.className = 'hdot' + (i === 0 ? ' active' : '');
  d.dataset.idx = i;
  d.addEventListener('click', () => track.scrollTo({ left: i * CARD_W, behavior: 'smooth' }));
  dotsWrap?.appendChild(d);
}

function updateDots() {
  const idx = Math.round(track.scrollLeft / CARD_W);
  document.querySelectorAll('.hdot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}
track?.addEventListener('scroll', updateDots, { passive: true });
hLeft?.addEventListener('click',  () => track.scrollBy({ left: -CARD_W * 2, behavior: 'smooth' }));
hRight?.addEventListener('click', () => track.scrollBy({ left:  CARD_W * 2, behavior: 'smooth' }));

// Drag to scroll
let isDragging = false, startX, scrollL;
track?.addEventListener('mousedown', e => {
  isDragging = true; startX = e.pageX; scrollL = track.scrollLeft;
  track.style.cursor = 'grabbing';
});
track?.addEventListener('mousemove', e => {
  if (!isDragging) return;
  track.scrollLeft = scrollL - (e.pageX - startX);
});
['mouseup','mouseleave'].forEach(ev => track?.addEventListener(ev, () => {
  isDragging = false; track.style.cursor = '';
}));


/* ════════════════════════════════════════════════════
   11. PROJECT FILTER
════════════════════════════════════════════════════ */
document.querySelectorAll('.flt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.flt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('.proj-card').forEach(card => {
      const show = f === 'all' || (card.dataset.tags || '').includes(f);
      card.classList.toggle('f-hidden', !show);
    });
    updateDots();
  });
});


/* ════════════════════════════════════════════════════
   12. CARD TILT (front face only)
════════════════════════════════════════════════════ */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    card.querySelector('.flip-inner').style.transform =
      `perspective(700px) rotateX(${-dy*6}deg) rotateY(${dx*6}deg) rotateY(${card.matches(':hover') ? 0 : 0}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.flip-inner').style.transform = '';
  });
});


/* ════════════════════════════════════════════════════
   13. CONTACT FORM
════════════════════════════════════════════════════ */
const form    = document.getElementById('contactForm');
const formBtn = document.getElementById('formBtn');
const formOk  = document.getElementById('formOk');

form?.addEventListener('submit', e => {
  e.preventDefault();
  formBtn.textContent = 'Sending…';
  formBtn.disabled = true;
  setTimeout(() => {
    formBtn.textContent = 'Send Message ↗';
    formBtn.disabled = false;
    form.reset();
    formOk.style.display = 'block';
    setTimeout(() => formOk.style.display = 'none', 5000);
  }, 1800);
});


/* ════════════════════════════════════════════════════
   14. BACK TO TOP
════════════════════════════════════════════════════ */
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => btt?.classList.toggle('show', window.scrollY > 500), { passive: true });
btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ════════════════════════════════════════════════════
   15. SMOOTH ANCHOR SCROLL
════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});


/* ════════════════════════════════════════════════════
   16. MOUSE PARALLAX — Hero orbs
════════════════════════════════════════════════════ */
const heroLeft  = document.querySelector('.hero-left');
const monitorWr = document.querySelector('.monitor-wrap');
document.addEventListener('mousemove', e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  if (heroLeft)  heroLeft.style.transform  = `translate(${dx * 6}px, ${dy * 6}px)`;
  if (monitorWr) monitorWr.style.transform = `translateY(${-16 + dy * 10}px) rotateY(${dx * 3}deg)`;
}, { passive: true });


/* ════════════════════════════════════════════════════
   17. CONSOLE EASTER EGG
════════════════════════════════════════════════════ */
console.log(
  '%c ██╗   ██╗███╗   ███╗\n ██║   ██║████╗ ████║\n ██║   ██║██╔████╔██║\n ╚██╗ ██╔╝██║╚██╔╝██║\n  ╚████╔╝ ██║ ╚═╝ ██║\n   ╚═══╝  ╚═╝     ╚═╝\n\n  Visvesh Manickam — Frontend Dev\n  👀 Found the Easter egg!\n  📧 visvesh@example.com',
  'color:#39ff14;font-family:monospace;font-size:11px;'
);
