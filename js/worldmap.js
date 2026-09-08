/* =========================================================
   Page « Carte » — carte du monde en pointillés (« dot map »)
   Chaque point de terre est un petit rond, sur le fond sombre.
   Aucun texte, aucun marqueur. Données : js/worldmap-data.js
   (grille terre générée depuis des contours géographiques réels).
   ========================================================= */
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

  function draw() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = host.clientWidth, H = host.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const cell = Math.min(W / cols, H / rows);
    const ox = (W - cell * cols) / 2;
    const oy = (H - cell * rows) / 2;
    const rad = Math.max(0.6, cell * 0.32);

    for (const [c, r] of WORLD_DOTS) {
      const x = ox + (c - minC + 0.5) * cell;
      const y = oy + (r - minR + 0.5) * cell;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233,124,92,' + alphaFor(c, r).toFixed(2) + ')';
      ctx.fill();
    }
  }

  draw();
  window.addEventListener('resize', draw);
});
