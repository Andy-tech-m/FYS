import './scene.js';
// NAV
window.addEventListener('scroll', () =>
  document.getElementById('mainNav').classList.toggle('scrolled', scrollY > 50)
);
document.getElementById('hamBtn').addEventListener('click', () =>
  document.getElementById('navLinks').classList.toggle('open')
);
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'))
);

// REVEAL
const ro = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('visible');
}), { threshold: .1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// COUNTERS
const co = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting && !e.target.dataset.done) {
    e.target.dataset.done = 1;
    const tg = parseInt(e.target.dataset.target), dur = 1800, st = performance.now();
    (function u(n) {
      const p = Math.min((n - st) / dur, 1), ez = 1 - Math.pow(1 - p, 3);
      e.target.textContent = Math.round(ez * tg);
      if (p < 1) requestAnimationFrame(u);
      else e.target.textContent = tg;
    })(st);
  }
}), { threshold: .5 });
document.querySelectorAll('.counter').forEach(c => co.observe(c));

// RING
const rEl = document.getElementById('mainRing');
if (rEl) {
  const r = 130, ci = 2 * Math.PI * r;
  rEl.style.strokeDasharray = ci;
  rEl.style.strokeDashoffset = ci;
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.a) {
      e.target.dataset.a = 1;
      setTimeout(() => {
        rEl.style.transition = 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)';
        rEl.style.strokeDashoffset = ci * (1 - .75);
      }, 200);
    }
  }), { threshold: .3 }).observe(rEl);
}

// WHATSAPP
const WA = '51966305742';
document.getElementById('waBtn').addEventListener('click', () => {
  const n = document.getElementById('fName').value.trim();
  const p = document.getElementById('fPhone').value.trim();
  const em = document.getElementById('fEmail').value.trim();
  const sv = document.getElementById('fService').value;
  const ms = document.getElementById('fMsg').value.trim();
  if (!n || !p) { alert('Completa nombre y teléfono.'); return; }
  let t = '*FYS MECÁNICA INDUSTRIAL — SOLICITUD*%0A%0A';
  t += 'Nombre: ' + encodeURIComponent(n) + '%0ATel: ' + encodeURIComponent(p) + '%0A';
  if (em) t += 'Email: ' + encodeURIComponent(em) + '%0A';
  if (sv) t += 'Servicio: ' + encodeURIComponent(sv) + '%0A';
  if (ms) t += '%0AMensaje: ' + encodeURIComponent(ms) + '%0A';
  window.open('https://wa.me/' + WA + '?text=' + t, '_blank');
});

document.getElementById('sendBtn').addEventListener('click', () => {
  const n = document.getElementById('fName').value.trim();
  const p = document.getElementById('fPhone').value.trim();
  if (!n || !p) { alert('Completa nombre y teléfono.'); return; }
  const btn = document.getElementById('sendBtn');
  btn.querySelector('span').textContent = 'SOLICITUD ENVIADA ✓';
  btn.style.background = '#00cc88';
  setTimeout(() => {
    btn.querySelector('span').textContent = 'ENVIAR SOLICITUD';
    btn.style.background = '';
  }, 3000);
});