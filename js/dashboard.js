/* =========================================================
   Page « Nous deux » — petit tableau de bord de stats.

   >>> TES VRAIES VALEURS SONT ICI <<<
   Tout est dans l'objet DATA ci-dessous : change / ajoute librement.
   (Rien ici ne révèle la surprise finale.)
   ========================================================= */
const DATA = {
  // Date de début de relation : new Date(année, mois-1, jour)  (mois : 0 = janvier)
  // « depuis avril 2023 » — ajuste le jour exact si tu veux.
  ensembleDepuis: new Date(2023, 3, 1),   // 1er avril 2023
  depuisTexte: 'avril 2023',

  // Pays visités ensemble
  pays: ['Pays-Bas', 'Suisse', 'Danemark', 'Suède', 'Corfou'],
  prochaineDestination: 'bientôt',          // garde-le mystérieux

  // Petits doudous adoptés ensemble
  doudous: 3,

  // Notre bilan (pour le moment) — à faire grandir avec le temps
  bilan: [
    { icon: 'sausage', value: 50, label: 'saucissons' },
    { icon: 'can', value: 95, label: 'Red Bull' },
    { icon: 'sushi', value: 140, label: 'sushis' },
    { icon: 'belt', value: 1, label: 'ceinture cassée' },
  ],
};

/* ---------- petites icônes ---------- */
const IC = {
  heart: '<path d="M12 21s-7.5-4.6-10-9.1C.4 8.9 2 5.5 5.2 5.5c2 0 3.2 1.2 3.8 2.2C9.6 6.7 10.8 5.5 12.8 5.5c3.2 0 4.8 3.4 3.2 6.4C19.5 16.4 12 21 12 21z"/>',
  spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
  cal: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  pin: '<path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/>',
  plane: '<path d="M10.2 3.3a1.7 1.7 0 0 1 3 0l.4 6 6.4 3.8v2.3l-6.4-2 -.5 4.4 2 1.5v1.7l-3.4-1-3.4 1v-1.7l2-1.5-.5-4.4-6.4 2v-2.3l6.4-3.8z"/>',
  teddy: '<circle cx="12" cy="13.5" r="6.2"/><circle cx="6.6" cy="8" r="2.6"/><circle cx="17.4" cy="8" r="2.6"/><circle cx="10" cy="13" r=".6" fill="currentColor"/><circle cx="14" cy="13" r=".6" fill="currentColor"/><path d="M10.5 16.5c.9.8 2.1.8 3 0"/>',
  sausage: '<rect x="3.2" y="8.6" width="17.6" height="6.8" rx="3.4"/><path d="M7 10.4l1.4 3.2M11 10l1.4 4M15 10.4l1.4 3.2"/>',
  can: '<rect x="8" y="3.2" width="8" height="17.6" rx="2"/><path d="M9.6 3.6h4.8M8 8h8"/>',
  sushi: '<circle cx="12" cy="12" r="7.6"/><circle cx="12" cy="12" r="4.3"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  belt: '<rect x="3" y="9.6" width="18" height="4.8" rx="1.5"/><rect x="9.8" y="8" width="6.2" height="8" rx="1.5"/><path d="M12.8 10.4v3.2"/>',
};
function icon(name) {
  return '<svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    (IC[name] || '') + '</svg>';
}
function nf(n) { return Number(n).toLocaleString('fr-FR'); }

function tile(opts) {
  const cls = 'stat-tile' + (opts.text ? ' text' : '') + (opts.span2 ? ' span2' : '');
  const val = '<div class="stat-value' + (opts.accent ? ' accent' : '') + '">' + opts.value + '</div>';
  return '<div class="' + cls + '">' + icon(opts.icon) + val +
    '<div class="stat-label">' + opts.label + '</div></div>';
}
function section(title, tilesHtml) {
  return '<section class="dash-section"><h2><span class="sec-dot"></span>' + title + '</h2>' +
    '<div class="stat-grid">' + tilesHtml + '</div></section>';
}

/* ---------- calculs de dates ---------- */
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
  if (next <= now) next = new Date(now.getFullYear() + 1, from.getMonth(), from.getDate());
  return daysBetween(now, next);
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.dash');
  if (!root) return;

  const now = new Date();
  const since = DATA.ensembleDepuis;

  // Hero : compteur « jours ensemble » en direct
  const hero = document.querySelector('.dash-hero');
  const heroNum = hero ? hero.querySelector('.dash-hero-num') : null;
  const heroSub = hero ? hero.querySelector('.dash-hero-sub') : null;
  function tickHero() {
    if (heroNum) heroNum.textContent = nf(daysBetween(since, new Date()));
  }
  tickHero();
  if (heroSub) heroSub.textContent = 'soit ' + humanDuration(since, now) + ' ensemble';
  setInterval(tickHero, 60000);

  let html = '';

  // — Votre histoire —
  html += section('Votre histoire', [
    tile({ icon: 'cal', value: DATA.depuisTexte, label: 'Ensemble depuis', text: true }),
    tile({ icon: 'spark', value: nextAnniversaryDays(since, now), label: 'Jours avant votre date', accent: true }),
    tile({ icon: 'teddy', value: DATA.doudous, label: 'Doudous adoptés', accent: true }),
  ].join(''));

  // — Voyages —
  html += section('Voyages', [
    tile({ icon: 'globe', value: DATA.pays.length, label: 'Pays ensemble', accent: true }),
    tile({ icon: 'pin', value: DATA.pays.join(' · '), label: 'Nos escales', text: true, span2: true }),
    tile({ icon: 'plane', value: DATA.prochaineDestination, label: 'Prochaine destination', text: true }),
  ].join(''));

  // — Notre bilan (pour le moment) —
  html += section('Notre bilan (pour le moment)',
    DATA.bilan.map((b, i) => tile({
      icon: b.icon, value: nf(b.value), label: b.label, accent: i % 2 === 0,
    })).join(''));

  root.innerHTML = html;
});
