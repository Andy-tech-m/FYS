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

document.getElementById('sendBtn')?.addEventListener('click', () => {
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


// ─── Project Modal Data ───────────────────────────────────────────
const projData = {
  unacem1: {
    img: "https://fysmetales.com/wp-content/uploads/2023/07/23ad8310-b0cc-4364-8405-ee1dc33278e1-e1690902568537.jpeg",
    cat: "Minería · Concentradora",
    title: "Proyecto Unacem — Planta Concentradora",
    tags: ["Montaje Industrial","Equipos Rotativos","Estructuras Acero","12,000 TN"],
    stats: [["12,000 TN","Acero montado"],["6 meses","Duración"],["Condorcocha","Ubicación"]],
    desc: "Proyecto integral de montaje electromecánico para la planta concentradora de Unacem, incluyendo instalación de equipos pesados y sistemas de fajas transportadoras.",
    works: [
      "Montaje e instalación de molinos de bolas y SAG de alta capacidad",
      "Fabricación y montaje de estructura metálica principal (12,000 TN)",
      "Instalación de fajas transportadoras de minerales de largo recorrido",
      "Montaje de ciclones, espesadores y tanques de proceso",
      "Instalación de sistema eléctrico y automatización SCADA",
      "Pruebas de puesta en marcha y comisionado de planta completa"
    ]
  },
  unacem2: {
    img: "https://grupojjc.com.pe/wp-content/uploads/2022/09/JJC-proyecto-industria-planta-molino-8-embolsado-5-galeria-01-1128x690.jpg",
    cat: "Cobre · Estructura Cementera",
    title: "Las Unacem — Estructura Cementera",
    tags: ["Acero Alta Resistencia","Estructura Metálica","Condorcocha","Soldadura ISO 3834"],
    stats: [["ASTM A36","Norma acero"],["ISO 3834","Soldadura"],["Condorcocha","Ubicación"]],
    desc: "Diseño, fabricación y montaje de estructura metálica de alta resistencia para las instalaciones cementeras de Unacem, con estricto cumplimiento de normas internacionales de soldadura.",
    works: [
      "Fabricación de vigas y columnas principales en acero ASTM A36/A572",
      "Soldadura certificada bajo norma ISO 3834 y AWS D1.1",
      "Montaje de estructura principal de nave industrial y silos",
      "Instalación de plataformas, escaleras y pasarelas de acceso",
      "Control dimensional y ensayos no destructivos (END) de soldaduras",
      "Pintura anticorrosiva y recubrimientos de protección industrial"
    ]
  },
  calcem: {
    img: "https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/473612963_1517703108893777_8730529687692774832_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=53a332&_nc_eui2=AeGy4SR-vG0jlXuQY_Vh4MYXECnC5hl3ZYcQKcLmGXdlhxL_WURfdWN4IViP8czon52Ev56V9AjZWLmigfcj92rA&_nc_ohc=QmUD4_ty-CEQ7kNvwGk_2MR&_nc_oc=AdrYKA7_sP-15-vSN1ydnD1KMSVHJGR1oMMAbYBns8VITyiFPXAYUewjHdT7_EqR_0E&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=XnPB7F0EanomZr-O1_DI4g&_nc_ss=7a3a8&oh=00_Af1eix-J3KDJyDVxzFEgVPPBOAMP9Yf1dgF6A2klBn_ZcA&oe=69D9F591",
    cat: "Descargas De Material",
    title: "Calcem — Sistema de Descargas",
    tags: ["Tuberías Críticas","Descarga Material","Mantenimiento","Alta Presión"],
    stats: [["360 MW","Capacidad planta"],["Tuberías","Especialidad"],["Alta presión","Sistema"]],
    desc: "Instalación y mantenimiento de sistemas de tuberías críticas y equipos de descarga de material para las operaciones de Calcem, asegurando continuidad operativa y seguridad.",
    works: [
      "Fabricación e instalación de tuberías críticas de alta presión y temperatura",
      "Montaje de equipos de descarga y transferencia de material granular",
      "Instalación de válvulas, compuertas y actuadores neumáticos",
      "Aislamiento térmico de tuberías y equipos de proceso",
      "Mantenimiento correctivo y preventivo de equipos rotativos",
      "Inspección y certificación de sistemas bajo normas ASME B31.3"
    ]
  },
  solar: {
    img: "https://fysmetales.com/wp-content/uploads/2023/08/94d22324-8c51-4036-9140-b0f23604dd53.jpg",
    cat: "Renovable",
    title: "Planta Unacem — Estructura Solar",
    tags: ["Acero Galvanizado","Energía Renovable","250 MWp","Carbono Neutro"],
    stats: [["250 MWp","Capacidad"],["Galvanizado","Tipo acero"],["Renovable","Energía"]],
    desc: "Fabricación y montaje de estructura metálica galvanizada para instalación de paneles solares fotovoltaicos, como parte del compromiso de Unacem con energía renovable.",
    works: [
      "Fabricación de estructuras de acero galvanizado para soporte de paneles solares",
      "Montaje de más de 5,000 marcos y soportes fotovoltaicos",
      "Instalación de sistema de canaletas y bandejas portacables",
      "Montaje de inversores, transformadores y tableros eléctricos",
      "Trabajos de grounding y sistema de puesta a tierra",
      "Comisionado y pruebas de generación del parque solar completo"
    ]
  }
};

window.openProjModal = function(id) {
  const d = projData[id];
  if (!d) return;
  document.getElementById('pm-img').src = d.img;
  document.getElementById('pm-cat').textContent = d.cat;
  document.getElementById('pm-title').textContent = d.title;
  document.getElementById('pm-desc').textContent = d.desc;
  document.getElementById('pm-tags').innerHTML = d.tags.map(t => `<span class="tag">${t}</span>`).join('');
  document.getElementById('pm-stats').innerHTML = d.stats.map(s => `<div class="pm-stat"><div class="pm-stat-num">${s[0]}</div><div class="pm-stat-lbl">${s[1]}</div></div>`).join('');
  document.getElementById('pm-works').innerHTML = d.works.map(w => `<div class="pmw-item"><div class="pmw-dot"></div><div class="pmw-text">${w}</div></div>`).join('');
  document.getElementById('projModalOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

window.closeProjModal = function() {
  document.getElementById('projModalOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

window.closeProjModalOutside = function(e) {
  if (e.target === document.getElementById('projModalOverlay')) window.closeProjModal();
}

