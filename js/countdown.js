/* =========================================================
   Compte à rebours vers le 20 octobre 2026 (minuit).
   - Décompte jours / heures / minutes, mis à jour en continu.
   - Visuel évolutif : plus on approche, plus les pétales/points
     sont nombreux, vifs et vivants (l'unique animation marquante).
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const elDays = document.querySelector('[data-days]');
  const elHours = document.querySelector('[data-hours]');
  const elMins = document.querySelector('[data-mins]');
  const fill = document.querySelector('.progress-fill');
  const note = document.querySelector('.count-note');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now = new Date();
    let diff = Math.max(0, TARGET_DATE - now);

    const dayMs = 86400000;
    const days = Math.floor(diff / dayMs); diff -= days * dayMs;
    const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);

    if (elDays) elDays.textContent = days;
    if (elHours) elHours.textContent = pad(hours);
    if (elMins) elMins.textContent = pad(mins);

    const p = computeProgress(now);
    if (fill) fill.style.width = (p * 100).toFixed(1) + '%';

    if (note && TARGET_DATE - now <= 0) {
      note.textContent = 'C’est aujourd’hui.';
    }
  }

  tick();
  setInterval(tick, 1000 * 20); // rafraîchit régulièrement (minutes)
  // Mise à jour plus fréquente la première minute pour un affichage vivant
  setInterval(tick, 1000);

  initPetals();
});

/* --- Animation « pétales » sur canvas, intensité ∝ avancement --- */
function initPetals() {
  const canvas = document.querySelector('canvas.petals');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const progress = computeProgress();
  // Nombre de particules et vivacité augmentent avec l'avancement.
  const count = Math.round(10 + progress * 44);
  const speedBoost = 0.4 + progress * 1.1;
  const vividness = 0.25 + progress * 0.6; // opacité globale

  function vgActive() { return document.documentElement.classList.contains('vangogh'); }

  const parts = [];
  for (let i = 0; i < count; i++) {
    parts.push(newPart(true));
  }
  function newPart(spread) {
    return {
      x: Math.random() * w,
      y: spread ? Math.random() * h : -20,
      r: 3 + Math.random() * 6 + progress * 4,
      vy: (0.3 + Math.random() * 0.9) * speedBoost,
      vx: (Math.random() - 0.5) * 0.6 * speedBoost,
      spin: (Math.random() - 0.5) * 0.04,
      a: Math.random() * Math.PI * 2,
      hue: Math.random(),
    };
  }

  function colorFor(pt) {
    if (vgActive()) {
      // Ambiance nuit étoilée : bleus/jaunes
      return pt.hue > 0.5 ? 'rgba(244,211,94,ALPHA)' : 'rgba(120,170,255,ALPHA)';
    }
    // Palette normale : verts avec quelques touches orange
    if (pt.hue > 0.78) return 'rgba(224,138,60,ALPHA)';   // orange discret
    if (pt.hue > 0.5) return 'rgba(124,196,163,ALPHA)';   // vert clair
    return 'rgba(46,139,98,ALPHA)';                        // vert
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const pt of parts) {
      pt.y += pt.vy;
      pt.x += pt.vx;
      pt.a += pt.spin;
      if (pt.y - pt.r > h) Object.assign(pt, newPart(false));
      if (pt.x < -20) pt.x = w + 20;
      if (pt.x > w + 20) pt.x = -20;

      const alpha = (0.35 + 0.45 * Math.abs(Math.sin(pt.a))) * vividness;
      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(pt.a);
      ctx.fillStyle = colorFor(pt).replace('ALPHA', alpha.toFixed(2));
      // pétale : petite ellipse
      ctx.beginPath();
      ctx.ellipse(0, 0, pt.r, pt.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  if (reduce) { draw(); } else { requestAnimationFrame(draw); }
}
