/* =========================================================
   Page « Nous deux » — petit tableau de bord de stats.

   >>> REMPLIS TES VRAIES VALEURS ICI <<<
   Toutes les données du dashboard sont dans l'objet DATA ci-dessous.
   Les chiffres actuels sont des EXEMPLES : change-les librement.
   (Rien ici ne révèle la surprise finale.)
   ========================================================= */
const DATA = {
  // — Votre histoire —
  // Date de début de relation : new Date(année, mois-1, jour)  (mois : 0 = janvier)
  ensembleDepuis: new Date(2023, 5, 12),        // ex. 12 juin 2023  <-- À REMPLIR
  premierRdv: '12 juin 2023',                    // texte libre
  jeTaime: 4212,                                 // petit compteur pour le plaisir

  // — Voyages —
  voyages: {
    pays: 5,
    villes: 18,
    kilometres: 12400,
    prochaine: 'bientôt',                        // texte libre (garde-le mystérieux)
  },

  // — Cinéma & séries —
  cine: {
    films: 87,
    series: 14,
    soirees: 63,
    // Top genres (pour le petit donut) — nom + nombre
    genres: [
      { n: 'Comédie', v: 34 },
      { n: 'Aventure', v: 26 },
      { n: 'Drame', v: 18 },
      { n: 'Animation', v: 9 },
    ],
  },

  // — Quotidien & goûts —
  quotidien: {
    restaurants: 41,
    cafes: 320,
    chansons: 214,
    platPrefere: 'à compléter',                  // texte libre
  },
};

/* ---------- petites icônes ---------- */
const IC = {
  heart: '<path d="M12 21s-7.5-4.6-10-9.1C.4 8.9 2 5.5 5.2 5.5c2 0 3.2 1.2 3.8 2.2C9.6 6.7 10.8 5.5 12.8 5.5c3.2 0 4.8 3.4 3.2 6.4C19.5 16.4 12 21 12 21z"/>',
  spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
  cal: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  pin: '<path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/>',
  road: '<path d="M4 21l4-18M20 21l-4-18M12 6v2M12 12v2M12 18v2"/>',
  plane: '<path d="M10.2 3.3a1.7 1.7 0 0 1 3 0l.4 6 6.4 3.8v2.3l-6.4-2 -.5 4.4 2 1.5v1.7l-3.4-1-3.4 1v-1.7l2-1.5-.5-4.4-6.4 2v-2.3l6.4-3.8z"/>',
  film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4"/>',
  tv: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M9 6l3-3 3 3"/>',
  pop: '<path d="M5 8l1.5 12h11L19 8zM5 8l7-4 7 4M9 8v12M15 8v12"/>',
  fork: '<path d="M6 3v7a2 2 0 0 0 4 0V3M8 12v9M18 3c-2 0-3 2-3 5s1 4 3 4v9"/>',
  coffee: '<path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 9h2.5a2.5 2.5 0 0 1 0 5H17M7 3v2M11 3v2"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
};
function icon(name) {
  return '<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    (IC[name] || '') + '</svg>';
}
function nf(n) { return Number(n).toLocaleString('fr-FR'); }

function tile(opts) {
  const cls = 'stat-tile' + (opts.text ? ' text' : '') + (opts.span2 ? ' span2' : '');
  const val = '<div class="stat-value' + (opts.accent ? ' accent' : '') + '"' +
    (opts.data ? ' ' + opts.data : '') + '>' + opts.value + '</div>';
  return '<div class="' + cls + '">' + icon(opts.icon) + val +
    '<div class="stat-label">' + opts.label + '</div></div>';
}

function section(title, lede, tilesHtml) {
  return '<section class="dash-section"><h2><span class="sec-dot"></span>' + title + '</h2>' +
    (lede ? '<p class="sec-lede">' + lede + '</p>' : '') +
    '<div class="stat-grid">' + tilesHtml + '</div></section>';
}

/* ---------- donut top genres ---------- */
function donut(genres) {
  const colors = ['#2e8b62', '#e08a3c', '#7cc4a3', '#f2b471', '#1f5a41'];
  const total = genres.reduce((s, g) => s + g.v, 0) || 1;
  const R = 42, C = 2 * Math.PI * R;
  let off = 0, arcs = '';
  genres.forEach((g, i) => {
    const frac = g.v / total;
    const len = frac * C;
    arcs += '<circle cx="59" cy="59" r="' + R + '" fill="none" stroke="' + colors[i % colors.length] +
      '" stroke-width="16" stroke-dasharray="' + len.toFixed(2) + ' ' + (C - len).toFixed(2) +
      '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 59 59)"/>';
    off += len;
  });
  const legend = genres.map((g, i) =>
    '<li><span class="dot" style="background:' + colors[i % colors.length] + '"></span>' +
    '<span><b>' + g.n + '</b> · ' + Math.round((g.v / total) * 100) + '%</span></li>').join('');
  return '<div class="stat-tile donut-card">' +
    '<svg viewBox="0 0 118 118" aria-hidden="true">' + arcs +
    '<circle cx="59" cy="59" r="26" fill="var(--surface)"/></svg>' +
    '<ul class="donut-legend">' + legend + '</ul></div>';
}

/* ---------- rendu ---------- */
function daysBetween(a, b) { return Math.floor((b - a) / 86400000); }

function humanDuration(from, to) {
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) { m -= 1; d += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
  if (m < 0) { y -= 1; m += 12; }
  const parts = [];
  if (y > 0) parts.push(y + (y > 1 ? ' ans' : ' an'));
  if (m > 0) parts.push(m + ' mois');
  parts.push(d + (d > 1 ? ' jours' : ' jour'));
  return parts.join(', ');
}

function nextAnniversaryDays(from, now) {
  let next = new Date(now.getFullYear(), from.getMonth(), from.getDate());
  if (next < now) next = new Date(now.getFullYear() + 1, from.getMonth(), from.getDate());
  return daysBetween(now, next) + (now < next ? 1 : 0);
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.dash');
  if (!root) return;

  const now = new Date();
  const since = DATA.ensembleDepuis;

  // Hero : compteur en direct
  const hero = document.querySelector('.dash-hero');
  function tickHero() {
    const n = new Date();
    if (heroNum) heroNum.textContent = nf(daysBetween(since, n));
  }
  const heroNum = hero ? hero.querySelector('.dash-hero-num') : null;
  const heroSub = hero ? hero.querySelector('.dash-hero-sub') : null;
  if (heroNum) heroNum.textContent = nf(daysBetween(since, now));
  if (heroSub) heroSub.textContent = 'soit ' + humanDuration(since, now);
  setInterval(tickHero, 60000);

  // Sections
  let html = '';

  html += section('Votre histoire', '', [
    tile({ icon: 'cal', value: DATA.premierRdv, label: 'Premier rendez-vous', text: true }),
    tile({ icon: 'spark', value: nextAnniversaryDays(since, now), label: 'Jours avant votre date', accent: true }),
    tile({ icon: 'heart', value: nf(DATA.jeTaime), label: '« Je t’aime » (à la louche)', accent: true }),
  ].join(''));

  html += section('Voyages', '', [
    tile({ icon: 'globe', value: DATA.voyages.pays, label: 'Pays ensemble', accent: true }),
    tile({ icon: 'pin', value: DATA.voyages.villes, label: 'Villes visitées' }),
    tile({ icon: 'road', value: nf(DATA.voyages.kilometres) + ' km', label: 'Distance parcourue' }),
    tile({ icon: 'plane', value: DATA.voyages.prochaine, label: 'Prochaine destination', text: true }),
  ].join(''));

  html += section('Cinéma & séries', '', [
    tile({ icon: 'film', value: DATA.cine.films, label: 'Films vus', accent: true }),
    tile({ icon: 'tv', value: DATA.cine.series, label: 'Séries terminées' }),
    tile({ icon: 'pop', value: DATA.cine.soirees, label: 'Soirées ciné' }),
    donut(DATA.cine.genres),
  ].join(''));

  html += section('Quotidien & goûts', '', [
    tile({ icon: 'fork', value: DATA.quotidien.restaurants, label: 'Restaurants testés', accent: true }),
    tile({ icon: 'coffee', value: nf(DATA.quotidien.cafes), label: 'Cafés partagés' }),
    tile({ icon: 'music', value: DATA.quotidien.chansons, label: 'Chansons dans la playlist' }),
    tile({ icon: 'fork', value: DATA.quotidien.platPrefere, label: 'Plat préféré', text: true }),
  ].join(''));

  root.innerHTML = html;
});
