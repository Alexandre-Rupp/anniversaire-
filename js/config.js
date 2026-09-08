/* =========================================================
   Configuration partagée — un seul endroit pour les dates.
   Mois en JS : 0 = janvier … 9 = octobre.
   ========================================================= */

// Date/heure visée par le compte à rebours : 20 octobre 2026, minuit (heure locale).
const TARGET_DATE = new Date(2026, 9, 20, 0, 0, 0);

// Ancre de départ pour l'évolution visuelle progressive (plus on approche,
// plus le visuel s'anime). Choisie ~7 semaines avant la cible.
const PROGRESS_START = new Date(2026, 8, 1, 0, 0, 0); // 1er septembre 2026

// Les 5 indices, débloqués chaque mardi à 00h00 (heure locale).
// Aucun texte descriptif ici n'est affiché tel quel : le rendu est purement visuel.
const CLUES = [
  { id: 'c1', unlock: new Date(2026, 8, 15, 0, 0, 0) }, // mardi 15 sept. 2026
  { id: 'c2', unlock: new Date(2026, 8, 22, 0, 0, 0) }, // mardi 22 sept. 2026
  { id: 'c3', unlock: new Date(2026, 8, 29, 0, 0, 0) }, // mardi 29 sept. 2026
  { id: 'c4', unlock: new Date(2026, 9, 6, 0, 0, 0) },  // mardi 6 oct. 2026
  { id: 'c5', unlock: new Date(2026, 9, 13, 0, 0, 0) }, // mardi 13 oct. 2026
];

// Renvoie un facteur d'avancement entre 0 (loin) et 1 (jour J), basé sur la date réelle.
function computeProgress(now = new Date()) {
  const total = TARGET_DATE - PROGRESS_START;
  const done = now - PROGRESS_START;
  const p = done / total;
  return Math.max(0, Math.min(1, p));
}

// Formatte une date courte en français : « 15 sept. »
function formatShortDate(d) {
  const mois = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
    'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  return d.getDate() + ' ' + mois[d.getMonth()];
}
