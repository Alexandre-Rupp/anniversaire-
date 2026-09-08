/* =========================================================
   Page « Indices »
   - 5 cartes purement visuelles (aucun texte d'accompagnement).
   - Déblocage automatique le mardi (dates réelles, cf. config.js).
   - Verrouillé : grisé + flouté, avec la date de déblocage visible.
   - Débloqué : reste consultable à tout moment.
   ========================================================= */

// --- Petits générateurs pour les visuels riches ---
function tulipField() {
  let t = '';
  const colors = ['#d7534b', '#e08a3c', '#f0c33c'];
  const rows = [
    { y: 44, n: 6, s: 13 },
    { y: 58, n: 7, s: 12 },
    { y: 72, n: 8, s: 11 },
    { y: 86, n: 9, s: 10 },
  ];
  rows.forEach((row, ri) => {
    const startX = 12 - ri * 2;
    for (let i = 0; i < row.n; i++) {
      const x = startX + i * row.s + (ri % 2) * (row.s / 2);
      if (x < 6 || x > 94) continue;
      const c = colors[(i + ri) % colors.length];
      t += '<rect x="' + (x - 0.6) + '" y="' + row.y + '" width="1.2" height="7" fill="#2e8b62"/>';
      t += '<path d="M' + (x - 3.2) + ' ' + row.y +
        ' q0 -5 3.2 -5 q3.2 0 3.2 5 q-1.6 -2.4 -3.2 -2.4 q-1.6 0 -3.2 2.4 z" fill="' + c + '"/>';
    }
  });
  return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
    '<rect x="0" y="0" width="100" height="100" rx="8" fill="#eaf4ec"/>' +
    '<rect x="0" y="34" width="100" height="66" fill="#dcefe0"/>' + t + '</svg>';
}

function bridge() {
  // Erasmusbrug — pylône unique, coudé (« le cygne »), haubans en éventail.
  let cables = '';
  const top = { x: 47, y: 30 };
  const deckY = 70;
  const backs = [16, 24, 32, 40];
  const fores = [55, 64, 73, 82];
  backs.forEach((x) => { cables += line(top.x, top.y, x, deckY); });
  fores.forEach((x) => { cables += line(top.x, top.y, x, deckY); });
  function line(x1, y1, x2, y2) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke="#9fb4bf" stroke-width="0.9"/>';
  }
  return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
    '<rect x="0" y="0" width="100" height="100" rx="8" fill="#eef4f7"/>' +
    '<rect x="0" y="72" width="100" height="28" fill="#b9d6e5"/>' +
    '<g opacity="0.9">' + cables + '</g>' +
    '<rect x="6" y="69" width="88" height="4" rx="1" fill="#596b74"/>' +
    // pylône coudé
    '<path d="M43 70 L46 34 L52 24" fill="none" stroke="#e7edf0" stroke-width="5" ' +
    'stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M43 70 L46 34" fill="none" stroke="#cdd9df" stroke-width="2.4" ' +
    'stroke-linecap="round"/>' +
    // reflet
    '<path d="M43 74 L45 84" stroke="#cfe0ea" stroke-width="3" stroke-linecap="round" opacity="0.6"/>' +
    '</svg>';
}

// --- Les 5 visuels, dans l'ordre des dates (config.js: CLUES) ---
const CLUE_ART = {
  // 1 — Heineken : bouteille verte, capsule dorée, étoile rouge
  c1: '<svg viewBox="0 0 100 100" aria-hidden="true">' +
    '<defs><linearGradient id="btl" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#1f5a41"/><stop offset="0.5" stop-color="#3fa572"/>' +
    '<stop offset="1" stop-color="#1f5a41"/></linearGradient></defs>' +
    '<rect x="42" y="8" width="16" height="9" rx="2" fill="#c9962f"/>' +
    '<rect x="44" y="16" width="12" height="15" fill="url(#btl)"/>' +
    '<path d="M44 30 C40 34 34 40 34 52 L34 86 Q34 92 40 92 L60 92 Q66 92 66 86 L66 52 ' +
    'C66 40 60 34 56 30 Z" fill="url(#btl)"/>' +
    '<rect x="36" y="57" width="28" height="23" rx="3" fill="#f5f8f3"/>' +
    '<path fill="#d7534b" d="M50 60 l2.6 5.3 5.8 .8 -4.2 4.1 1 5.8 -5.2 -2.7 -5.2 2.7 ' +
    '1 -5.8 -4.2 -4.1 5.8 -.8 Z"/></svg>',

  // 2 — Max Verstappen : monoplace, livrée orange, numéro 1
  c2: '<svg viewBox="0 0 100 100" aria-hidden="true">' +
    '<rect x="4" y="44" width="12" height="4" fill="#e08a3c"/>' +
    '<rect x="6" y="44" width="4" height="19" fill="#0d1526"/>' +
    '<path d="M8 60 L20 60 C24 52 34 50 46 50 L58 50 C62 45 70 45 76 49 L90 51 ' +
    'C94 52 94 58 90 60 L82 62 L20 62 Z" fill="#16233f"/>' +
    '<path d="M40 52 L58 52 L54 58 L36 58 Z" fill="#e08a3c"/>' +
    '<path d="M50 50 q9 -6 15 -0.5" fill="none" stroke="#0d1526" stroke-width="2.4"/>' +
    '<rect x="86" y="58" width="11" height="6" rx="1" fill="#0d1526"/>' +
    '<circle cx="26" cy="64" r="12" fill="#111"/><circle cx="26" cy="64" r="5" fill="#d3d3d3"/>' +
    '<circle cx="72" cy="64" r="12" fill="#111"/><circle cx="72" cy="64" r="5" fill="#d3d3d3"/>' +
    '<path fill="#ffffff" d="M47 51 l3 0 0 10 -3 0 0 -7 -2.4 1.4 -1 -2.4 z"/></svg>',

  // 3 — Champ de tulipes
  c3: tulipField(),

  // 4 — « Skeletons » : squelette
  c4: '<svg viewBox="0 0 100 100" aria-hidden="true">' +
    '<rect x="0" y="0" width="100" height="100" rx="10" fill="#20303a"/>' +
    '<path d="M35 22 q15 -12 30 0 q6 8 4 20 q-1 6 -6 9 l0 6 q-13 5 -26 0 l0 -6 ' +
    'q-5 -3 -6 -9 q-2 -12 4 -20z" fill="#f1eee1"/>' +
    '<ellipse cx="43" cy="36" rx="5" ry="6" fill="#0e181e"/>' +
    '<ellipse cx="57" cy="36" rx="5" ry="6" fill="#0e181e"/>' +
    '<path d="M50 42 l-3 7 6 0 z" fill="#0e181e"/>' +
    '<g fill="#0e181e"><rect x="44" y="54" width="2" height="5"/>' +
    '<rect x="49" y="54" width="2" height="5"/><rect x="54" y="54" width="2" height="5"/></g>' +
    '<rect x="48.5" y="65" width="3" height="20" fill="#f1eee1"/>' +
    '<g fill="none" stroke="#f1eee1" stroke-width="3" stroke-linecap="round">' +
    '<path d="M50 69 q-14 2 -16 10"/><path d="M50 69 q14 2 16 10"/>' +
    '<path d="M50 75 q-13 2 -14 9"/><path d="M50 75 q13 2 14 9"/></g></svg>',

  // 5 — Erasmusbrug (le pont « cygne »)
  c5: bridge(),
};

const LOCK_ICON =
  '<svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.clue-grid');
  if (!grid) return;
  const now = appNow();

  CLUES.forEach((clue) => {
    const unlocked = now >= clue.unlock;
    const card = document.createElement('div');
    card.className = 'clue-card ' + (unlocked ? 'unlocked' : 'locked');

    const art = document.createElement('div');
    art.className = 'art';
    art.innerHTML = CLUE_ART[clue.id] || '';
    card.appendChild(art);

    if (!unlocked) {
      const ov = document.createElement('div');
      ov.className = 'lock-overlay';
      ov.innerHTML = LOCK_ICON +
        '<span class="lock-date">' + formatShortDate(clue.unlock) + '</span>' +
        '<span class="lock-sub">à venir</span>';
      card.appendChild(ov);
      card.setAttribute('aria-label', 'Indice à débloquer le ' + formatShortDate(clue.unlock));
    } else {
      card.setAttribute('aria-label', 'Indice débloqué');
    }

    grid.appendChild(card);
  });
});
