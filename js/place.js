/* =========================================================
   Page « Le lieu » — carte ILLUSTRÉE (style poster) d'une ville
   traversée par un fleuve. Dessin 100 % original (aucune œuvre
   copiée) : landmarks au trait, eau turquoise, accents corail.
   Aucune date/nom n'est révélé tant que c'est flou : le titre
   ne devient lisible qu'une fois l'image nette (proche du 20 oct).
   Le flou dépend de la date réelle.
   ========================================================= */

// Palette de l'illustration
const CO = {
  cream: '#f7ecd6', ground: '#f2e6cc',
  water: '#83c9c4', waterEdge: '#3f9b97',
  ink: '#274a4f', coral: '#e17a4c', coralD: '#c85f36',
  teal: '#57b8b4', green: '#5aa06e', sand: '#e7d5b3',
  cube: '#e8c15a', white: '#f2efe6', roof: '#d76a4f',
};

function tree(x, y, r) {
  r = r || 10;
  return '<g stroke="' + CO.ink + '" stroke-width="2" stroke-linejoin="round">' +
    '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + 12) + '"/>' +
    '<circle cx="' + x + '" cy="' + (y - r * 0.4) + '" r="' + r + '" fill="' + CO.green + '"/></g>';
}

function rotterdamSVG() {
  const S = CO;
  const O = 'stroke="' + S.ink + '" stroke-width="2.3" stroke-linejoin="round" stroke-linecap="round"';

  // Fleuve (Nieuwe Maas) — bande turquoise, presqu'île découpée dans la rive sud.
  const river =
    'M-30 250 C120 262 260 286 360 300 C440 314 510 308 575 293 ' +
    'C665 272 745 240 830 220 L830 352 C750 344 675 360 600 372 ' +
    'L600 338 Q600 328 590 328 L512 328 Q502 328 502 338 L502 366 ' +
    'C430 372 300 356 160 336 C70 324 -30 316 -30 316 Z';

  const water =
    '<path d="' + river + '" fill="' + S.water + '" stroke="' + S.waterEdge + '" stroke-width="2"/>' +
    // bassins portuaires
    '<path d="M614 372 L614 452 Q614 470 632 470 L694 470 Q712 470 712 452 L712 372 Z" fill="' + S.water + '" stroke="' + S.waterEdge + '" stroke-width="2"/>' +
    '<rect x="452" y="240" width="22" height="62" rx="6" fill="' + S.water + '" stroke="' + S.waterEdge + '" stroke-width="2"/>' +
    // petites vagues
    '<g stroke="' + S.waterEdge + '" stroke-width="1.6" stroke-linecap="round" opacity="0.7" fill="none">' +
    '<path d="M120 300 q8 -5 16 0 t16 0"/><path d="M300 342 q8 -5 16 0 t16 0"/>' +
    '<path d="M660 300 q8 -5 16 0 t16 0"/><path d="M640 430 q8 -5 16 0 t16 0"/></g>';

  // Rues (fines, pointillées) pour la texture
  const streets =
    '<g stroke="' + S.sand + '" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9">' +
    '<path d="M120 120 L120 300"/><path d="M250 110 L300 300"/>' +
    '<path d="M60 210 L470 200"/><path d="M560 400 L700 402"/>' +
    '<path d="M330 430 L520 470"/></g>';

  // Itinéraire pointillé (fil rouge)
  const route =
    '<path d="M120 360 C220 320 320 400 430 348 C540 300 610 380 700 338" fill="none" ' +
    'stroke="' + S.coral + '" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>';

  // — Landmarks —
  // Central Station (toit pointu)
  const station =
    '<g ' + O + '>' +
    '<rect x="66" y="150" width="120" height="26" fill="' + S.ground + '"/>' +
    '<path d="M62 150 L138 116 L214 150 Z" fill="' + S.coral + '"/>' +
    '<path d="M138 116 L138 150"/>' +
    '<g stroke-width="1.6"><path d="M84 158 L84 170"/><path d="M104 158 L104 170"/><path d="M164 158 L164 170"/></g></g>';

  // Euromast (tour)
  const euromast =
    '<g ' + O + '>' +
    '<line x1="150" y1="205" x2="150" y2="216"/>' +
    '<path d="M146 216 L154 216 L158 360 L142 360 Z" fill="' + S.white + '"/>' +
    '<ellipse cx="150" cy="298" rx="13" ry="9" fill="' + S.teal + '"/>' +
    '<path d="M140 360 L160 360 L156 372 L144 372 Z" fill="#cdd8d5"/></g>';

  // Markthal (arche en fer à cheval)
  const markthal =
    '<path d="M262 214 L262 172 A46 46 0 0 1 354 172 L354 214 L334 214 L334 176 ' +
    'A26 26 0 0 0 282 176 L282 214 Z" fill="#d8cbb0" ' + O + '/>' +
    '<path d="M300 214 L300 190 A8 8 0 0 1 316 190 L316 214 Z" fill="' + S.teal + '" ' + O + '/>';

  // Kubuswoningen (maisons cubes inclinées)
  function cube(cx, cy, s) {
    return '<g ' + O + '><line x1="' + cx + '" y1="' + (cy + s) + '" x2="' + cx + '" y2="' + (cy + s + 12) + '"/>' +
      '<polygon points="' + cx + ',' + (cy - s) + ' ' + (cx + s) + ',' + cy + ' ' + cx + ',' + (cy + s) + ' ' + (cx - s) + ',' + cy + '" fill="' + S.cube + '"/>' +
      '<path d="M' + cx + ' ' + (cy - s) + ' L' + cx + ' ' + (cy + s) + '"/></g>';
  }
  const cubes = cube(422, 150, 15) + cube(452, 158, 13);

  // Erasmusbrug (le « cygne »)
  const baseX = 476, baseY = 300, apexX = 486, apexY = 208, tipX = 500, tipY = 198;
  let cables = '';
  [[464, 300], [469, 302], [474, 316], [488, 330], [497, 330], [506, 332]].forEach((p) => {
    cables += '<line x1="' + apexX + '" y1="' + apexY + '" x2="' + p[0] + '" y2="' + p[1] + '" stroke="' + S.ink + '" stroke-width="1.4"/>';
  });
  const erasmus =
    '<g stroke-linecap="round">' +
    '<path d="M462 300 L512 332" stroke="' + S.ink + '" stroke-width="4.5"/>' + cables +
    '<path d="M' + baseX + ' ' + baseY + ' L' + apexX + ' ' + apexY + ' L' + tipX + ' ' + tipY + '" fill="none" stroke="' + S.white + '" stroke-width="6" stroke-linejoin="round"/>' +
    '<path d="M' + baseX + ' ' + baseY + ' L' + apexX + ' ' + apexY + '" fill="none" stroke="' + S.ink + '" stroke-width="2"/></g>';

  // De Rotterdam (tours décalées)
  const deRotterdam =
    '<g ' + O + '>' +
    '<rect x="545" y="252" width="20" height="120" fill="#bcd0cf"/>' +
    '<rect x="566" y="238" width="20" height="134" fill="#a6c4c2"/>' +
    '<rect x="587" y="258" width="20" height="114" fill="#cddad8"/>' +
    '<g stroke-width="1.3" opacity="0.7"><path d="M545 300 H607"/><path d="M545 330 H607"/></g></g>';

  // Hotel New York (deux tourelles vertes)
  const hotel =
    '<g ' + O + '>' +
    '<rect x="316" y="392" width="70" height="42" fill="#ecdfc2"/>' +
    '<path d="M320 392 q8 -15 16 0 Z" fill="' + S.green + '"/>' +
    '<path d="M366 392 q8 -15 16 0 Z" fill="' + S.green + '"/>' +
    '<g stroke-width="1.4"><path d="M334 402 V424"/><path d="M351 402 V424"/><path d="M368 402 V424"/></g></g>';

  // SS Rotterdam (paquebot)
  const ship =
    '<g ' + O + '>' +
    '<path d="M120 502 L252 502 L240 526 L140 526 Z" fill="' + S.white + '"/>' +
    '<rect x="150" y="482" width="86" height="20" fill="#f4ede0"/>' +
    '<rect x="168" y="466" width="12" height="18" rx="2" fill="' + S.coral + '"/>' +
    '<rect x="190" y="466" width="12" height="18" rx="2" fill="' + S.coral + '"/>' +
    '<g stroke-width="1.4"><path d="M160 490 h70"/></g></g>';

  // Spido (bateau-mouche)
  const spido =
    '<g ' + O + '>' +
    '<path d="M590 238 L638 238 L631 250 L597 250 Z" fill="' + S.white + '"/>' +
    '<rect x="600" y="228" width="28" height="10" rx="2" fill="' + S.teal + '"/></g>';

  // Boussole
  const compass =
    '<g ' + O + '>' +
    '<circle cx="702" cy="474" r="22" fill="' + S.cream + '"/>' +
    '<polygon points="702,454 708,474 702,494 696,474" fill="' + S.coral + '"/>' +
    '<polygon points="680,474 702,468 724,474 702,480" fill="' + S.teal + '"/>' +
    '</g><text x="702" y="449" text-anchor="middle" font-family="' + "'Nunito',sans-serif" + '" font-size="12" font-weight="700" fill="' + S.ink + '">N</text>';

  // Arbres / verdure
  const trees = tree(96, 372, 12) + tree(120, 384, 9) + tree(252, 300, 10) +
    tree(700, 250, 10) + tree(724, 262, 8) + tree(360, 250, 9);

  // Titre lettré (illisible tant que c'est flou)
  const title =
    '<text x="780" y="92" text-anchor="end" font-family="' + "'Shantell Sans','Trebuchet MS',sans-serif" +
    '" font-size="50" font-weight="700" fill="' + S.ink + '">Rotterdam</text>' +
    '<path d="M604 106 q44 -9 92 0 t92 -1" fill="none" stroke="' + S.coral + '" stroke-width="3" stroke-linecap="round"/>';

  return '<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" ' +
    'role="img" aria-label="Plan illustré d’une ville traversée par un fleuve">' +
    '<rect x="0" y="0" width="800" height="600" fill="' + S.cream + '"/>' +
    streets + water + route +
    station + euromast + markthal + cubes + deRotterdam + hotel + erasmus +
    ship + spido + trees + compass + title +
    '</svg>';
}

document.addEventListener('DOMContentLoaded', () => {
  const stage = document.querySelector('.place-map');
  if (!stage) return;
  stage.innerHTML = rotterdamSVG();
  const svg = stage.querySelector('svg');

  // Le flou se lève à l'approche de la date : très flou au début, net au bout.
  const p = computeProgress();
  const blur = (1 - p) * 20;
  const desat = 0.35 * (1 - p);
  svg.style.filter = 'blur(' + blur.toFixed(1) + 'px) saturate(' + (1 - desat).toFixed(2) + ')';

  const meter = document.querySelector('.place-meter-fill');
  if (meter) meter.style.width = (p * 100).toFixed(1) + '%';
});
