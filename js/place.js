/* =========================================================
   Page « Le lieu » — 9 lettres floutées à révéler
   Les 9 images (assets/lettres/1..9.jpg) forment un mot.
   Elles restent floutées jusqu'à ce que :
     - la date du 20 octobre 2026 soit atteinte, OU
     - le bon mot de passe soit saisi.
   Aucune mention du mot en clair : ce sont les images qui parlent.
   ========================================================= */
const LIEU_KEY = 'lieu-unlocked';
const LIEU_PASSWORD = 'saucisson';

function lieuNow() { return (typeof appNow === 'function') ? appNow() : new Date(); }
function lieuNorm(s) {
  return (s || '').toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
}

document.addEventListener('DOMContentLoaded', () => {
  const row = document.querySelector('.letters-row');
  if (!row) return;

  // Construit les 9 tuiles (floutées par défaut)
  for (let i = 1; i <= 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'letter locked';
    const img = document.createElement('img');
    img.src = 'assets/lettres/' + i + '.jpg';
    img.alt = '';
    img.decoding = 'async';
    cell.appendChild(img);
    row.appendChild(cell);
  }
  const cells = Array.from(row.querySelectorAll('.letter'));

  const form = document.querySelector('.lieu-lock');
  const input = document.querySelector('.lieu-input');
  const msg = document.querySelector('.lieu-msg');
  const toggle = document.querySelector('.lieu-toggle');

  // Affiche (show=true) ou masque (show=false) les lettres, sans changer le
  // déverrouillage : c'est un simple bouton montrer / cacher.
  function setShown(show) {
    cells.forEach((c) => c.classList.toggle('locked', !show));
    row.classList.toggle('revealed', show);
    if (toggle) toggle.textContent = show ? 'Cacher' : 'Montrer';
  }

  // Déverrouille : cache le formulaire et affiche le bouton montrer / cacher.
  function reveal(persist) {
    if (persist) { try { localStorage.setItem(LIEU_KEY, '1'); } catch (e) {} }
    if (form) form.hidden = true;
    if (msg) msg.hidden = true;
    if (toggle) toggle.hidden = false;
    setShown(true);
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      setShown(!row.classList.contains('revealed'));
    });
  }

  // État initial : déjà trouvé, ou date atteinte
  let already = false;
  try { already = localStorage.getItem(LIEU_KEY) === '1'; } catch (e) {}
  if (already || lieuNow() >= TARGET_DATE) reveal(false);

  // Mot de passe
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (lieuNorm(input.value) === LIEU_PASSWORD) {
        reveal(true);
      } else {
        if (msg) { msg.textContent = 'Ce n’est pas le mot.'; msg.hidden = false; }
        form.classList.remove('shake');
        void form.offsetWidth; // relance l'animation
        form.classList.add('shake');
        if (input) input.select();
      }
    });
  }
});
