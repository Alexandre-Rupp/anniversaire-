/* =========================================================
   Mode APERÇU (branche de prévisualisation uniquement)
   Permet d'avancer / reculer dans le temps pour voir comment
   chaque page évolue : indices qui se débloquent, décompte,
   resserrement de la carte, vivacité de l'animation.
   -> Ce fichier n'existe pas sur la branche de production.
   ========================================================= */
(function () {
  const STAGES = [
    { label: 'Lancement',        date: new Date(2026, 8, 1, 12, 0) },   // 1 sept.
    { label: 'Indice 1 débloqué', date: new Date(2026, 8, 15, 12, 0) }, // 15 sept.
    { label: 'Indice 2 débloqué', date: new Date(2026, 8, 22, 12, 0) }, // 22 sept.
    { label: 'Indice 3 débloqué', date: new Date(2026, 8, 29, 12, 0) }, // 29 sept.
    { label: 'Indice 4 débloqué', date: new Date(2026, 9, 6, 12, 0) },  // 6 oct.
    { label: 'Indice 5 (tous)',   date: new Date(2026, 9, 13, 12, 0) }, // 13 oct.
    { label: 'La veille',         date: new Date(2026, 9, 19, 12, 0) }, // 19 oct.
    { label: 'Jour J',            date: new Date(2026, 9, 20, 8, 0) },  // 20 oct.
  ];
  const KEY = 'preview-stage';

  let idx = 0;
  try {
    const v = parseInt(localStorage.getItem(KEY), 10);
    if (!isNaN(v)) idx = v;
  } catch (e) {}
  idx = Math.max(0, Math.min(STAGES.length - 1, idx));

  // Pose la date simulée AVANT le rendu (les autres scripts la liront via appNow()).
  window.__previewDate = STAGES[idx].date;

  function fmt(d) {
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function go(n) {
    const next = Math.max(0, Math.min(STAGES.length - 1, n));
    try { localStorage.setItem(KEY, next); } catch (e) {}
    location.reload(); // rechargement = re-rendu complet (canvas, indices, zoom)
  }

  document.addEventListener('DOMContentLoaded', function () {
    const bar = document.createElement('div');
    bar.className = 'preview-bar';
    bar.innerHTML =
      '<button class="pv-btn pv-prev" type="button" aria-label="Étape précédente">‹</button>' +
      '<div class="pv-info">' +
        '<span class="pv-tag">Aperçu · étape ' + (idx + 1) + ' / ' + STAGES.length + '</span>' +
        '<span class="pv-label">' + STAGES[idx].label + '</span>' +
        '<span class="pv-date">' + fmt(STAGES[idx].date) + '</span>' +
      '</div>' +
      '<button class="pv-btn pv-next" type="button" aria-label="Étape suivante">›</button>';
    document.body.appendChild(bar);

    const prev = bar.querySelector('.pv-prev');
    const next = bar.querySelector('.pv-next');
    prev.disabled = idx === 0;
    next.disabled = idx === STAGES.length - 1;
    prev.addEventListener('click', function () { go(idx - 1); });
    next.addEventListener('click', function () { go(idx + 1); });

    // Flèches gauche/droite au clavier
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' && idx > 0) go(idx - 1);
      if (e.key === 'ArrowRight' && idx < STAGES.length - 1) go(idx + 1);
    });
  });
})();
