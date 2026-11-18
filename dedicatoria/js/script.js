// ==================== AJUSTES ====================
// Fecha de la cuenta regresiva: 8 de diciembre de 2026, 3:00 p.m. hora de Lima (UTC-5)
const FECHA_ESPERA = new Date('2026-12-08T15:00:00-05:00');

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const musica = $('#musica');
const btnPlay = $('#btn-play');

// ==================== ABRIR EL SOBRE ====================
$('#btn-abrir').addEventListener('click', () => {
  $('#btn-abrir').classList.add('abierto');
  reproducir();
  setTimeout(() => {
    $('#portada').classList.add('desaparece');
    $('#contenido').classList.remove('oculto');
    $('#reproductor').classList.remove('oculto');
    animarAlBajar();
    escribir($('#titulo'));
    setInterval(crearFlotante, 900);
    setTimeout(() => $('#portada').remove(), 900);
  }, 1100);
});

// ==================== MÚSICA ====================
function reproducir() {
  musica.play()
    .then(() => { btnPlay.textContent = '❚❚'; btnPlay.classList.add('sonando'); })
    .catch(() => { $('.nombre-cancion').textContent = 'Agrega audio/cancion.mp3'; });
}
btnPlay.addEventListener('click', () => {
  if (musica.paused) reproducir();
  else { musica.pause(); btnPlay.textContent = '▶'; btnPlay.classList.remove('sonando'); }
});
musica.addEventListener('timeupdate', () => {
  if (musica.duration) $('#progreso').style.width = (musica.currentTime / musica.duration) * 100 + '%';
});
$('.barra').addEventListener('click', (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  if (musica.duration) musica.currentTime = ((e.clientX - r.left) / r.width) * musica.duration;
});

// ==================== TÍTULO QUE SE ESCRIBE SOLO ====================
async function escribir(el) {
  const texto = el.dataset.texto;
  for (let i = 0; i <= texto.length; i++) {
    el.textContent = texto.slice(0, i);
    await new Promise((r) => setTimeout(r, 55));
  }
}

// ==================== APARECER AL BAJAR ====================
function animarAlBajar() {
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      if (e.target.querySelector('#disco-lleno')) llenarDisco();
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  $$('.contenido > *').forEach((el) => { el.classList.add('aparece'); obs.observe(el); });
}

// ==================== LLUVIA DE ESTRELLAS ====================
const cielo = $('#cielo');
const ctx = cielo.getContext('2d');
let estrellas = [], fugaces = [];
function ajustarCielo() {
  cielo.width = innerWidth * devicePixelRatio;
  cielo.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  estrellas = Array.from({ length: Math.round(innerWidth / 9) }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: Math.random() * 1.8 + .5, f: Math.random() * Math.PI * 2, v: Math.random() * .03 + .01,
  }));
}
function nuevaFugaz(x, y) {
  fugaces.push({
    x: x ?? Math.random() * innerWidth * 1.2, y: y ?? -20,
    vx: -(3 + Math.random() * 3), vy: 4 + Math.random() * 3, vida: 1,
  });
}
function dibujarEstrella(x, y, r, alfa) {
  ctx.save();
  ctx.globalAlpha = alfa;
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#ff6fa0'; ctx.shadowBlur = 8;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {          // estrellita de 4 puntas
    const a = (i * Math.PI) / 2;
    ctx.lineTo(x + Math.cos(a) * r * 2.4, y + Math.sin(a) * r * 2.4);
    ctx.lineTo(x + Math.cos(a + Math.PI / 4) * r * .7, y + Math.sin(a + Math.PI / 4) * r * .7);
  }
  ctx.fill();
  ctx.restore();
}
function animarCielo() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const e of estrellas) {
    e.f += e.v;
    dibujarEstrella(e.x, e.y, e.r, .35 + Math.sin(e.f) * .35 + .3);
  }
  if (Math.random() < 0.025) nuevaFugaz();
  fugaces = fugaces.filter((f) => f.vida > 0 && f.y < innerHeight + 50);
  for (const f of fugaces) {
    f.x += f.vx; f.y += f.vy; f.vida -= 0.006;
    const g = ctx.createLinearGradient(f.x, f.y, f.x - f.vx * 14, f.y - f.vy * 14);
    g.addColorStop(0, `rgba(255,255,255,${f.vida})`);
    g.addColorStop(1, 'rgba(255,180,210,0)');
    ctx.strokeStyle = g; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x - f.vx * 14, f.y - f.vy * 14); ctx.stroke();
    dibujarEstrella(f.x, f.y, 2, f.vida);
  }
  requestAnimationFrame(animarCielo);
}
addEventListener('resize', ajustarCielo);
ajustarCielo();
animarCielo();

// ==================== CARTITAS Y CORAZONES FLOTANDO ====================
const FLOTANTES = ['💌', '💗', '✉️', '💕', '🌸', '⭐', 'img:corazon-pixel.png', 'img:sobre-pixel.png', 'img:corazones-rosa.png'];
function crearFlotante() {
  const tipo = FLOTANTES[Math.floor(Math.random() * FLOTANTES.length)];
  let el;
  if (tipo.startsWith('img:')) {
    el = document.createElement('img');
    el.src = 'img/stickers/' + tipo.slice(4);
    el.style.width = 26 + Math.random() * 22 + 'px';
  } else {
    el = document.createElement('span');
    el.textContent = tipo;
    el.style.fontSize = 16 + Math.random() * 18 + 'px';
  }
  el.className = 'flotante';
  el.style.left = Math.random() * 100 + 'vw';
  el.style.animationDuration = 9 + Math.random() * 7 + 's';
  $('#flotantes').appendChild(el);
  setTimeout(() => el.remove(), 17000);
}

// ==================== CHISPITAS AL TOCAR ====================
function chispas(x, y, cantidad = 8, simbolos = ['💗', '✨', '💕']) {
  for (let i = 0; i < cantidad; i++) {
    const c = document.createElement('span');
    c.className = 'chispa';
    c.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
    const ang = Math.random() * Math.PI * 2, dist = 40 + Math.random() * 70;
    c.style.left = x + 'px'; c.style.top = y + 'px';
    c.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    c.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 900);
  }
}
document.addEventListener('click', (e) => {
  if (!$('#portada')) chispas(e.clientX, e.clientY, 5, ['💗', '✨']);
});

// ==================== REGALITOS ====================
$$('.regalo').forEach((b) => b.addEventListener('click', (e) => {
  if (b.classList.contains('abierto')) return;
  b.classList.add('abierto');
  b.textContent = b.dataset.msg;
  chispas(e.clientX, e.clientY, 12, ['🎀', '✨', '💗']);
}));

// ==================== EVIDENCIAS ====================
$$('.evidencia').forEach((b) => b.addEventListener('click', () => b.classList.toggle('girada')));

// ==================== ANTOJITOS (se guardan en este navegador) ====================
const antojos = $$('#lista-antojos button');
let hechos = [];
try { hechos = JSON.parse(localStorage.getItem('antojitos') || '[]'); } catch (_) {}
antojos.forEach((b, i) => {
  if (hechos.includes(i)) b.classList.add('hecho');
  b.addEventListener('click', (e) => {
    b.classList.toggle('hecho');
    if (b.classList.contains('hecho')) chispas(e.clientX, e.clientY, 10, ['✅', '😋', '💗']);
    hechos = [...antojos].map((x, j) => (x.classList.contains('hecho') ? j : -1)).filter((j) => j >= 0);
    try { localStorage.setItem('antojitos', JSON.stringify(hechos)); } catch (_) {}
  });
});

// ==================== BOTÓN PARA MOLESTAR ====================
const molestias = [
  'Te dije que no lo tocaras 😒',
  '¿Ves? Así se siente que te molesten 😂',
  'Ok, ya, última vez…',
  'Mentira, puedes seguir 😜',
  'Esto es amor, aunque no lo parezca 💗',
  'Vivo para joderte, ya lo sabes 😌',
];
let nMolestia = 0;
$('#btn-molestar').addEventListener('click', (e) => {
  $('#molestar-msg').textContent = molestias[nMolestia++ % molestias.length];
  e.currentTarget.style.transform = `translate(${(Math.random() - .5) * 120}px, ${(Math.random() - .5) * 30}px)`;
});

// ==================== DISCO DE 2 TB ====================
function llenarDisco() {
  setTimeout(() => {
    $('#disco-lleno').style.width = '0.6%';
    let gb = 0;
    const t = setInterval(() => {
      gb += 0.4;
      $('#disco-texto').textContent = gb.toFixed(1) + ' GB de 2 TB… falta muchísimo 😤';
      if (gb >= 12) clearInterval(t);
    }, 70);
  }, 400);
}

// ==================== VISOR DE FOTOS ====================
$$('.fotito img, .galeria-mini img').forEach((img) => img.addEventListener('click', (e) => {
  e.stopPropagation();
  $('#visor-img').src = img.src;
  $('#visor').classList.remove('oculto');
}));
$('#visor').addEventListener('click', () => $('#visor').classList.add('oculto'));

// ==================== PREGUNTA FINAL ====================
const btnNo = $('#btn-no');
const frasesNo = ['¿Segura? 🥺', 'Piénsalo bien…', 'Ese botón está roto', 'No se puede 😌', 'Intenta con el otro 👉'];
let nNo = 0;
function escaparNo() {
  btnNo.style.transform = `translate(${(Math.random() - .5) * 220}px, ${(Math.random() - .5) * 90}px)`;
  btnNo.textContent = frasesNo[nNo++ % frasesNo.length];
}
btnNo.addEventListener('mouseenter', escaparNo);
btnNo.addEventListener('click', (e) => { e.preventDefault(); escaparNo(); });

$('#btn-si').addEventListener('click', (e) => {
  $('#respuesta').textContent = 'Sabía que dirías que sí 💗 Apenas estamos comenzando.';
  btnNo.style.display = 'none';
  const r = e.currentTarget.getBoundingClientRect();
  for (let i = 0; i < 4; i++) setTimeout(() => chispas(r.left + r.width / 2, r.top, 18, ['💗', '💖', '✨', '🌸', '💌']), i * 250);
  for (let i = 0; i < 12; i++) setTimeout(() => nuevaFugaz(), i * 120);
});

$('#btn-deseo').addEventListener('click', () => {
  for (let i = 0; i < 25; i++) setTimeout(() => nuevaFugaz(Math.random() * innerWidth * 1.3, -20 - Math.random() * 100), i * 80);
  $('#respuesta').textContent = 'Cierra los ojos y pide tu deseo 🌠';
});

// ==================== CUENTA REGRESIVA ====================
const celdas = {};
$$('#cuenta-regresiva strong').forEach((s) => (celdas[s.dataset.u] = s));
function actualizarCuenta() {
  let s = Math.floor((FECHA_ESPERA - Date.now()) / 1000);
  if (s <= 0) {
    $('#cuenta-regresiva').innerHTML = '<p class="frase-grande" style="color:#fff">¡Llegó el día! 💗</p>';
    clearInterval(intervaloCuenta);
    return;
  }
  const valores = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
  for (const u in valores) {
    const txt = String(valores[u]).padStart(u === 'd' ? 1 : 2, '0');
    if (celdas[u].textContent !== txt) {
      celdas[u].textContent = txt;
      celdas[u].classList.remove('tic'); void celdas[u].offsetWidth; celdas[u].classList.add('tic');
    }
  }
}
const intervaloCuenta = setInterval(actualizarCuenta, 1000);
actualizarCuenta();
