/* =========================================================
   Mascotte 3D flottante (présente sur toutes les pages)

   >>> COMMENT AJOUTER TON PERSONNAGE <<<
   1. Dépose ton fichier 3D ici :   assets/rocky.glb
      (format .glb de préférence, ou .gltf ; garde-le < ~8 Mo).
   2. C'est tout : la mascotte apparaît en bas à droite, tourne
      doucement, joue son animation intégrée si elle en a une, et
      se laisse faire pivoter à la souris / au doigt.

   Réglages rapides ci-dessous (MASCOT) : chemin du fichier, taille
   à l'écran, vitesse de rotation, etc. Tant que le fichier n'existe
   pas, rien ne s'affiche (le site fonctionne normalement).

   Trois.js et les loaders sont chargés depuis un CDN (réseau requis).
   ========================================================= */
const MASCOT = {
  model: 'assets/rocky.glb',   // <-- dépose ton modèle ici
  boxSize: 132,                // taille du cadre à l'écran (px)
  autoSpin: 0.35,              // vitesse de rotation auto (0 = immobile)
  bob: 6,                      // amplitude du petit flottement (unités modèle)
  playClips: true,             // jouer les animations intégrées au modèle
  dismissible: true,           // petit bouton pour masquer
};

const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
const GLTF_CDN = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
const ORBIT_CDN = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';

const MASCOT_HIDDEN_KEY = 'mascot-hidden';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error('script ' + src));
    document.head.appendChild(s);
  });
}

async function initMascot() {
  // Respecte un éventuel masquage mémorisé
  try { if (localStorage.getItem(MASCOT_HIDDEN_KEY) === '1') return; } catch (e) {}

  // Charge Three.js + loaders (silencieux si le réseau/CDN est indisponible)
  try {
    await loadScript(THREE_CDN);
    await loadScript(GLTF_CDN);
    await loadScript(ORBIT_CDN);
  } catch (e) { return; }
  if (!window.THREE || !THREE.GLTFLoader) return;

  // Conteneur flottant (caché tant que le modèle n'est pas chargé)
  const wrap = document.createElement('div');
  wrap.className = 'mascot';
  wrap.hidden = true;
  wrap.style.width = MASCOT.boxSize + 'px';
  wrap.style.height = MASCOT.boxSize + 'px';
  if (MASCOT.dismissible) {
    const close = document.createElement('button');
    close.className = 'mascot-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Masquer');
    close.textContent = '×';
    close.addEventListener('click', (e) => {
      e.stopPropagation();
      wrap.remove();
      try { localStorage.setItem(MASCOT_HIDDEN_KEY, '1'); } catch (er) {}
    });
    wrap.appendChild(close);
  }
  document.body.appendChild(wrap);

  const W = MASCOT.boxSize, H = MASCOT.boxSize;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  wrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 1000);
  camera.position.set(0, 0, 100);

  // Lumières (douces + un point verdâtre pour l'esprit « pierre luminescente »)
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(40, 60, 60); scene.add(key);
  const rim = new THREE.PointLight(0x7be08a, 0.5, 400); rim.position.set(-40, 10, 40);
  scene.add(rim);

  const pivot = new THREE.Group();
  scene.add(pivot);

  let mixer = null;
  const clock = new THREE.Clock();

  const loader = new THREE.GLTFLoader();
  loader.load(
    MASCOT.model,
    (gltf) => {
      const model = gltf.scene;

      // Centre + met à l'échelle pour tenir dans le cadre
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3(); box.getSize(size);
      const center = new THREE.Vector3(); box.getCenter(center);
      model.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const target = 60; // hauteur visée en unités scène
      pivot.scale.setScalar(target / maxDim);
      pivot.add(model);

      if (MASCOT.playClips && gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
      }
      wrap.hidden = false; // on ne révèle qu'une fois prêt
    },
    undefined,
    () => { wrap.remove(); } // fichier absent / illisible : on retire proprement
  );

  // Rotation à la souris / au doigt
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.8;
  controls.autoRotate = MASCOT.autoSpin > 0;
  controls.autoRotateSpeed = MASCOT.autoSpin * 6;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) controls.autoRotate = false;

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    if (mixer) mixer.update(dt);
    // petit flottement vertical
    if (!reduce && MASCOT.bob) { t += dt; pivot.position.y = Math.sin(t * 1.6) * (MASCOT.bob / (pivot.scale.x || 1)); }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', initMascot);
