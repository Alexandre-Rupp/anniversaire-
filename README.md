# Compte à rebours

Petit site statique, sans backend ni base de données. Trois pages + un easter egg
global. Le déblocage des contenus se base uniquement sur la date du jour, côté client.

## Structure

```
index.html      → Compte à rebours (visuel qui s'anime à l'approche de la date)
carte.html      → Carte stylisée d'Europe (mécanique de ciblage mouvant)
indices.html    → 5 indices, un par semaine (déblocage automatique le mardi)
css/style.css   → styles + thème « Nuit étoilée » (easter egg)
js/config.js    → toutes les dates au même endroit
js/theme.js     → navigation + easter egg (bouton pinceau)
js/countdown.js → décompte + animation
js/map.js       → carte + mécanique
js/clues.js     → indices (illustrations vectorielles)
```

## Dates (modifiables dans `js/config.js`)

- Cible du compte à rebours : **20 octobre 2026, minuit** (heure locale).
- Indices débloqués chaque mardi : 15, 22, 29 septembre puis 6 et 13 octobre 2026.

## Déploiement sur Vercel

Site 100 % statique : **aucune étape de build**, pas de `package.json`.

1. Pousser ce dépôt sur GitHub (déjà fait).
2. Sur Vercel → *Add New Project* → importer le dépôt.
3. Laisser les réglages par défaut :
   - Framework Preset : **Other**
   - Build Command : *(vide)*
   - Output Directory : *(vide / racine)*
4. *Deploy*.

Alternative en une commande depuis la racine du projet : `npx vercel`.

Le site fonctionne aussi en ouvrant simplement `index.html` dans un navigateur,
ou via `npx serve` en local.

## Mode aperçu (cette branche)

Cette branche `apercu-evolution` ajoute une barre en bas de l'écran pour
**voyager dans le temps** et voir comment chaque page évolue, sans attendre les
vraies dates :

- Boutons **‹ / ›** (ou flèches gauche/droite du clavier) pour avancer/reculer.
- 8 étapes : Lancement → chaque indice débloqué → la veille → Jour J.
- L'étape choisie s'applique aux trois pages (décompte, carte, indices).

C'est uniquement une prévisualisation : la branche `main` reste le vrai site,
piloté par la date réelle, sans cette barre.

## Notes

- Responsive pensé mobile d'abord.
- Le thème « Nuit étoilée » se déclenche via le petit bouton pinceau (en haut à
  droite) et se mémorise d'une page à l'autre.
