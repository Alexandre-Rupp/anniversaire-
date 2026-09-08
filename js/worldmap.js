/* =========================================================
   Page « Carte » — carte du monde en pointillés (« dot map »)
   Chaque point de terre est un petit rond, sur le fond sombre.
   Aucun texte, aucun marqueur. Données : js/worldmap-data.js
   (grille terre générée depuis des contours géographiques réels).

   Au fil des étapes (plus on approche du 20 octobre), la carte
   se resserre progressivement sur les Pays-Bas.
   ========================================================= */

// Centre de zoom : Pays-Bas (~5.3°E, 52.2°N) dans la grille équirectangulaire.
const NL_COL = (5.3 + 180) / 360 * WMAP_COLS;   // ≈ 133.8
const NL_ROW = (90 - 52.2) / 180 * WMAP_ROWS;   // ≈ 27.3
const MAP_ZOOM_MAX = 5;                          // zoom au jour J (Europe de l'Ouest, centrée Pays-Bas)

document.addEventListener('DOMContentLoaded', () => {
  const host = document.querySelector('.worldmap');
  if (!host || typeof WORLD_DOTS === 'undefined') return;

  const canvas = document.createElement('canvas');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // Bornes de la terre (pour cadrer)
  let minC = Infinity, maxC = -Infinity, minR = Infinity, maxR = -Infinity;
  for (const [c, r] of WORLD_DOTS) {
    if (c < minC) minC = c; if (c > maxC) maxC = c;
    if (r < minR) minR = r; if (r > maxR) maxR = r;
  }
  const cols = maxC - minC + 1, rows = maxR - minR + 1;

  // Opacité pseudo-aléatoire stable par point (léger grain)
  function alphaFor(c, r) {
    const f = Math.abs(Math.sin(c * 12.9898 + r * 78.233) * 43758.5453);
    return 0.5 + 0.35 * (f - Math.floor(f));
  }

  function progressNow() {
    const now = (typeof appNow === 'function') ? appNow() : new Date();
    return computeProgress(now);
  }

  function draw() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = host.clientWidth, H = host.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Progression 0 → 1 : facteur de zoom + centre glissant vers les Pays-Bas.
    const prog = progressNow();
    const zoom = 1 + prog * (MAP_ZOOM_MAX - 1);
    const cell = Math.min(W / cols, H / rows) * zoom;
    const rad = Math.max(0.6, cell * 0.32);

    // Centre visé : interpolation entre le centre de la carte et les Pays-Bas.
    const mapCol = (minC + maxC) / 2, mapRow = (minR + maxR) / 2;
    const cc = mapCol + (NL_COL - mapCol) * prog;
    const cr = mapRow + (NL_ROW - mapRow) * prog;
    const ox = W / 2 - (cc - minC + 0.5) * cell;
    const oy = H / 2 - (cr - minR + 0.5) * cell;

    const pad = rad + 2;
    for (const [c, r] of WORLD_DOTS) {
      const x = ox + (c - minC + 0.5) * cell;
      const y = oy + (r - minR + 0.5) * cell;
      if (x < -pad || x > W + pad || y < -pad || y > H + pad) continue; // hors cadre
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233,124,92,' + alphaFor(c, r).toFixed(2) + ')';
      ctx.fill();
    }
  }

  draw();
  window.addEventListener('resize', draw);
});
