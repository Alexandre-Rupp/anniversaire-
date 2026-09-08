/* =========================================================
   Carte stylisée d'Europe + mécanique de « ciblage mouvant »
   - Au survol / tap : tout devient rouge sauf un pays vert.
   - Le pays vert change aléatoirement toutes les 2,5 s.
   - Cliquer le pays vert n'est jamais la bonne réponse :
     un court message neutre apparaît, puis la carte se réinitialise.
   - Aucun nom de ville n'est écrit sur cette page.
   ========================================================= */

// Rendu vectoriel « maison » : silhouettes simplifiées, non géographiques.
const COUNTRIES = [
  { id: 'ie', p: '205,215 245,225 240,265 215,295 180,280 175,245' },
  { id: 'uk', p: '300,120 330,150 320,185 345,210 330,250 350,285 320,315 285,300 300,265 275,245 295,215 270,190 285,160 275,140' },
  { id: 'pt', p: '245,510 255,510 250,560 258,610 240,625 225,585 230,540' },
  { id: 'es', p: '255,505 360,500 430,520 425,585 380,635 300,640 250,610 245,560' },
  { id: 'fr', p: '355,360 430,350 470,375 505,420 480,470 430,500 380,485 340,435 350,395' },
  { id: 'be', p: '470,322 525,325 520,352 478,352 468,338' },
  { id: 'nl', p: '492,278 545,282 540,318 500,320 488,300' },
  { id: 'de', p: '528,280 610,278 650,300 640,360 655,410 600,430 545,420 525,360 540,315' },
  { id: 'dk', p: '552,222 600,222 605,258 575,275 552,258' },
  { id: 'no', p: '545,70 610,60 640,120 620,175 600,225 565,215 555,160 540,110' },
  { id: 'se', p: '620,80 680,95 710,150 700,215 660,250 635,215 645,160 630,120' },
  { id: 'fi', p: '720,80 785,90 800,150 775,210 735,215 725,160' },
  { id: 'ch', p: '508,442 568,440 565,472 515,475 505,458' },
  { id: 'at', p: '572,440 660,438 680,462 640,478 585,475 572,460' },
  { id: 'it', p: '548,462 600,465 610,510 640,560 655,610 640,660 610,650 600,600 575,555 560,510 548,485' },
  { id: 'pl', p: '652,282 760,285 780,340 760,390 690,392 660,350 648,315' },
  { id: 'cz', p: '612,402 700,400 700,438 650,442 615,432' },
  { id: 'hr', p: '662,470 745,475 760,510 720,540 675,520 660,495' },
  { id: 'gr', p: '735,565 810,562 820,610 790,660 745,650 730,610' },
];

// Messages neutres et doux (jamais taquins, jamais moqueurs).
const MESSAGES = [
  'Pas ici.',
  'Ce n’est pas là.',
  'Non, pas cet endroit.',
  'Continue de chercher.',
  'Regarde encore un peu.',
  'Pas cette fois.',
];

const SVGNS = 'http://www.w3.org/2000/svg';

document.addEventListener('DOMContentLoaded', () => {
  const stage = document.querySelector('.map-stage');
  const group = document.querySelector('.map-group');
  const tease = document.querySelector('.tease');
  if (!stage || !group) return;

  // Construit les pays
  COUNTRIES.forEach((c) => {
    const poly = document.createElementNS(SVGNS, 'polygon');
    poly.setAttribute('points', c.p);
    poly.setAttribute('class', 'country');
    poly.dataset.id = c.id;
    group.appendChild(poly);
  });

  const countries = Array.from(group.querySelectorAll('.country'));
  let greenId = null;
  let teaseTimer = null;

  function pickGreen() {
    let next;
    do {
      next = countries[Math.floor(Math.random() * countries.length)].dataset.id;
    } while (countries.length > 1 && next === greenId);
    greenId = next;
    countries.forEach((c) => c.classList.toggle('is-green', c.dataset.id === greenId));
  }

  function arm() { stage.classList.add('armed'); }
  function disarm() { stage.classList.remove('armed'); }

  function showMessage() {
    if (!tease) return;
    tease.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    tease.classList.add('show');
    clearTimeout(teaseTimer);
    teaseTimer = setTimeout(() => tease.classList.remove('show'), 1900);
  }

  // Démarre la cible mouvante dès le lancement
  pickGreen();
  setInterval(pickGreen, 2500);

  // Bureau : le survol arme la carte
  stage.addEventListener('pointerenter', arm);
  stage.addEventListener('pointerleave', disarm);
  // Mobile : le premier contact arme la carte
  stage.addEventListener('pointerdown', arm);

  countries.forEach((c) => {
    c.addEventListener('click', (e) => {
      e.stopPropagation();
      if (c.dataset.id === greenId) {
        showMessage();
        // Réinitialisation : nouvelle cible + on relâche l'état survolé (utile mobile)
        pickGreen();
        setTimeout(disarm, 250);
      }
    });
  });

  // Resserrement progressif vers la région (Pays-Bas) au fil des semaines.
  // Subtil : léger zoom, sans jamais nommer quoi que ce soit.
  const progress = computeProgress();
  const scale = 1 + 0.3 * progress;
  group.style.transformOrigin = '516px 300px';
  group.style.transform = 'scale(' + scale.toFixed(3) + ')';
});
