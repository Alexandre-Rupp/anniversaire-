# Modèle 3D de la mascotte

Dépose ici ton fichier 3D sous le nom **`rocky.glb`** :

```
assets/rocky.glb
```

- Formats acceptés : `.glb` (recommandé, tout-en-un) ou `.gltf`.
- Poids conseillé : **< ~8 Mo** pour un chargement rapide sur mobile.
- Si le modèle contient une **animation intégrée**, elle sera jouée
  automatiquement. Sinon, la mascotte tourne doucement et flotte.

Une fois le fichier ajouté et poussé, la mascotte apparaît en bas à droite
de toutes les pages (on peut la faire pivoter à la souris / au doigt, et la
masquer via la petite croix).

## Réglages
Tout se règle en haut de `js/mascot.js` (objet `MASCOT`) :
chemin du fichier, taille à l'écran, vitesse de rotation, flottement, etc.

## Utiliser un autre nom / emplacement
Change simplement `MASCOT.model` dans `js/mascot.js`
(ex. `'assets/mon-perso.glb'`).

> Utilise un modèle que tu as le droit d'employer. Le personnage « Rocky »
> de *Project Hail Mary* et les modèles de studios sont protégés : n'utilise
> ici qu'un fichier libre de droits ou pour lequel tu as une licence.
