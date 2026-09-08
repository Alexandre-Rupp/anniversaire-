/* =========================================================
   Page « Le lieu »
   Carte vectorielle d'une ville traversée par un fleuve
   (centre de Rotterdam : Nieuwe Maas, Noordereiland,
   Wilhelminapier / Kop van Zuid, Erasmusbrug, Willemsbrug,
   Het Park, bassins portuaires, trame des rues).
   Aucun texte / nom : c'est le flou qui se lève, semaine après
   semaine, qui fait l'indice. Le flou dépend de la date réelle.
   ========================================================= */

// Trame de « blocs » de ville (texture cartographique ; l'eau posée
// par-dessus les recouvre là où il le faut).
function cityBlocks() {
  let s = '';
  for (let y = 96; y < 566; y += 30) {
    for (let x = 40; x < 772; x += 34) {
      const w = 24 + ((x + y) % 5);
      s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="21" rx="2" fill="#e5eadf"/>';
    }
  }
  return s;
}

function rotterdamSVG() {
  const blocks = cityBlocks();

  // Fleuve (Nieuwe Maas) : bande courbe, avec l'encoche de la presqu'île
  // (Kop van Zuid / Wilhelminapier) découpée directement dans la rive sud.
  const river =
    'M-30 250 C120 262 260 286 360 300 C440 314 510 308 575 293 ' +
    'C665 272 745 240 830 220 L830 352 C750 344 675 360 600 372 ' +
    'L600 338 Q600 328 590 328 L512 328 Q502 328 502 338 L502 366 ' +
    'C430 372 300 356 160 336 C70 324 -30 316 -30 316 Z';

  // Noordereiland : île dans le fleuve, à l'est.
  const island =
    'M612 292 Q612 286 620 286 L712 288 Q720 288 720 296 L718 326 ' +
    'Q718 334 710 334 L624 332 Q614 332 613 324 Z';

  // Het Park (vert) sur la rive nord, à l'ouest du pont.
  const park =
    'M338 302 L338 274 Q352 252 386 250 L452 254 L452 302 Z';

  // Bassins portuaires (eau) découpés dans les rives.
  const leuvehaven = '<rect x="450" y="236" width="22" height="66" rx="6" fill="#a4c9df"/>';
  const wijnhaven = '<rect x="482" y="248" width="16" height="54" rx="5" fill="#a4c9df"/>';
  const rijnhaven =
    '<path d="M614 372 L614 454 Q614 472 632 472 L694 472 Q712 472 712 454 ' +
    'L712 372 Z" fill="#a4c9df"/>';

  // Grands axes (rues principales).
  const roads =
    '<g stroke="#e0c39b" stroke-width="6" stroke-linecap="round" fill="none">' +
    '<path d="M420 120 L420 302"/>' +            // Coolsingel (nord-sud)
    '<path d="M290 206 L600 194"/>' +            // axe est-ouest (Blaak)
    '<path d="M170 150 L250 352"/>' +            // diagonale ouest
    '<path d="M520 372 L600 470"/>' +            // Kop van Zuid
    '<path d="M120 300 C260 316 360 308 452 302"/>' + // quai rive nord
    '</g>' +
    '<g stroke="#ecd9b6" stroke-width="3" stroke-linecap="round" fill="none">' +
    '<path d="M350 130 L350 250"/><path d="M490 130 L490 250"/>' +
    '<path d="M250 250 L590 250"/><path d="M250 168 L590 168"/>' +
    '<path d="M560 402 L690 402"/><path d="M610 424 L610 470"/>' +
    '</g>';

  // Erasmusbrug : le pont-icône. Grand pylône blanc coudé (« le cygne »)
  // sur la rive nord, tablier vers la presqu'île, haubans en éventail.
  const baseX = 476, baseY = 300, apexX = 486, apexY = 206, tipX = 500, tipY = 196;
  let cables = '';
  [ [464, 300], [468, 302], [472, 316], [488, 330], [496, 330], [505, 332] ].forEach((p) => {
    cables += '<line x1="' + apexX + '" y1="' + apexY + '" x2="' + p[0] + '" y2="' + p[1] +
      '" stroke="#c4d0d6" stroke-width="1.3"/>';
  });
  const erasmus =
    '<g>' +
    '<path d="M462 300 L512 332" stroke="#5f6f77" stroke-width="4.5" stroke-linecap="round"/>' +
    cables +
    '<path d="M' + baseX + ' ' + baseY + ' L' + apexX + ' ' + apexY + ' L' + tipX + ' ' + tipY +
    '" fill="none" stroke="#f1f5f7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M' + baseX + ' ' + baseY + ' L' + apexX + ' ' + apexY +
    '" fill="none" stroke="#d3dde2" stroke-width="2.4" stroke-linecap="round"/>' +
    '</g>';

  // Willemsbrug (rougeâtre), à l'est, via Noordereiland.
  const willems =
    '<g stroke="#c0554e" stroke-width="4" stroke-linecap="round">' +
    '<line x1="656" y1="266" x2="662" y2="288"/>' +
    '<line x1="668" y1="332" x2="676" y2="360"/></g>';

  // Euromast (petit repère), au bord de Het Park.
  const euromast =
    '<g stroke="#8d938a" stroke-width="2" stroke-linecap="round">' +
    '<line x1="352" y1="302" x2="352" y2="214"/></g>' +
    '<circle cx="352" cy="210" r="4" fill="#8d938a"/>' +
    '<rect x="348" y="238" width="8" height="10" rx="2" fill="#8d938a"/>';

  return '<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" ' +
    'role="img" aria-label="Plan d’une ville traversée par un fleuve">' +
    '<rect x="0" y="0" width="800" height="600" fill="#eef1ea"/>' +
    blocks +
    '<path d="' + river + '" fill="#a4c9df"/>' +
    leuvehaven + wijnhaven + rijnhaven +
    '<path d="' + island + '" fill="#eef1ea"/>' +
    '<path d="' + park + '" fill="#bcd8ac"/>' +
    roads +
    willems + erasmus + euromast +
    '</svg>';
}

document.addEventListener('DOMContentLoaded', () => {
  const stage = document.querySelector('.place-map');
  if (!stage) return;
  stage.innerHTML = rotterdamSVG();
  const svg = stage.querySelector('svg');

  // Le flou se lève à l'approche de la date : très flou au début, net au bout.
  const p = computeProgress();
  const blur = (1 - p) * 20; // px
  const desat = 0.35 * (1 - p); // léger grisé quand c'est encore flou
  svg.style.filter = 'blur(' + blur.toFixed(1) + 'px) saturate(' + (1 - desat).toFixed(2) + ')';

  const meter = document.querySelector('.place-meter-fill');
  if (meter) meter.style.width = (p * 100).toFixed(1) + '%';
});
