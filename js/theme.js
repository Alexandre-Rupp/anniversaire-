/* =========================================================
   Thème global + easter egg « Van Gogh »
   - Un bouton discret (pinceau) présent sur chaque page.
   - Bascule tout le site vers l'ambiance « Nuit étoilée ».
   - État mémorisé (localStorage) pour rester actif entre les pages.
   - Jamais expliqué ni commenté : c'est un indice en soi.
   ========================================================= */

const VG_KEY = 'vg-theme';

function isVanGogh() {
  try { return localStorage.getItem(VG_KEY) === '1'; } catch (e) { return false; }
}

function setVanGogh(on) {
  document.documentElement.classList.toggle('vangogh', on);
  const btn = document.querySelector('.brush-btn');
  if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  const layer = document.querySelector('.starry-layer');
  if (layer) layer.setAttribute('aria-hidden', on ? 'false' : 'true');
  try { localStorage.setItem(VG_KEY, on ? '1' : '0'); } catch (e) {}
}

function toggleVanGogh() {
  setVanGogh(!document.documentElement.classList.contains('vangogh'));
}

// Injecte la couche animée « Nuit étoilée » (tourbillons CSS) une seule fois.
function ensureStarryLayer() {
  if (document.querySelector('.starry-layer')) return;
  const layer = document.createElement('div');
  layer.className = 'starry-layer';
  layer.setAttribute('aria-hidden', 'true');
  // Tourbillons composés de plusieurs voiles en rotation + points d'étoiles.
  layer.innerHTML =
    '<div class="swirl swirl-a"></div>' +
    '<div class="swirl swirl-b"></div>' +
    '<div class="swirl swirl-c"></div>' +
    '<div class="stars"></div>';
  document.body.appendChild(layer);
}

// Marque le lien de navigation correspondant à la page courante.
function markActiveNav() {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });
  // Si la barre défile (petits écrans), amène le lien courant dans le champ.
  const active = document.querySelector('.nav-links a.is-active');
  const wrap = document.querySelector('.nav-links');
  if (active && wrap && wrap.scrollWidth > wrap.clientWidth + 1) {
    const a = active.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    wrap.scrollLeft += (a.left - w.left) - 14;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ensureStarryLayer();
  markActiveNav();

  const btn = document.querySelector('.brush-btn');
  if (btn) {
    btn.addEventListener('click', toggleVanGogh);
    btn.setAttribute('aria-pressed', isVanGogh() ? 'true' : 'false');
  }
  // Applique l'état mémorisé (la classe est déjà posée par le script inline
  // du <head> pour éviter tout flash ; on synchronise juste les attributs).
  setVanGogh(isVanGogh());
});
