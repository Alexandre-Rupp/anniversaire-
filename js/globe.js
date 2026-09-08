/* =========================================================
   Page « Carte » — globe 3D lumineux (Three.js)
   Sphère sombre, continents en glow violet (texture générée à
   partir de vraies données géographiques), halo atmosphérique,
   anneaux orbitaux. Tourne tout seul et se laisse manipuler.
   Aucune étiquette : une Terre qui tourne ne révèle rien.
   Trois.js chargé via CDN (réseau requis) ; repli discret sinon.
   ========================================================= */
const GLOBE_THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
const GLOBE_ORBIT_CDN = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';

function gLoadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.async = true; s.onload = res; s.onerror = () => rej(new Error(src));
    document.head.appendChild(s);
  });
}

// Texture équirectangulaire : océan sombre, terres violettes + côtes en glow.
function makeGlobeTexture() {
  const c = document.createElement('canvas');
  c.width = WORLD_W; c.height = WORLD_H;
  const g = c.getContext('2d');
  // océan (quasi noir, très légère nuance bleu nuit)
  const grad = g.createLinearGradient(0, 0, 0, WORLD_H);
  grad.addColorStop(0, '#060610'); grad.addColorStop(0.5, '#08081a'); grad.addColorStop(1, '#060610');
  g.fillStyle = grad; g.fillRect(0, 0, WORLD_W, WORLD_H);

  const path = new Path2D(WORLD_PATH);
  // terres — violet profond
  g.fillStyle = '#191038';
  g.fill(path);
  // halo diffus des terres (glow large et doux)
  g.shadowColor = 'rgba(138,80,240,0.9)'; g.shadowBlur = 16;
  g.strokeStyle = 'rgba(120,66,210,0.55)'; g.lineWidth = 3.4;
  g.lineJoin = 'round'; g.lineCap = 'round';
  g.stroke(path);
  // côtes lumineuses (magenta / violet vif)
  g.shadowColor = 'rgba(178,110,255,1)'; g.shadowBlur = 9;
  g.strokeStyle = 'rgba(190,124,255,0.98)'; g.lineWidth = 2.2;
  g.stroke(path);
  g.shadowBlur = 0;
  // lumières de villes (points chauds, surtout côté nuit)
  for (let i = 0; i < 1500; i++) {
    const x = Math.random() * WORLD_W, y = Math.random() * WORLD_H;
    if (g.isPointInPath(path, x, y)) {
      g.fillStyle = Math.random() < 0.25 ? 'rgba(255,150,90,0.9)' : 'rgba(255,200,130,0.85)';
      g.fillRect(x, y, 1.2, 1.2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

async function initGlobe() {
  const host = document.querySelector('.globe-canvas');
  if (!host) return;
  try { await gLoadScript(GLOBE_THREE_CDN); await gLoadScript(GLOBE_ORBIT_CDN); }
  catch (e) { return; } // repli CSS (disque) reste visible
  if (!window.THREE || !THREE.OrbitControls) return;

  const stage = host.parentElement;
  let W = stage.clientWidth, H = stage.clientHeight || W;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  host.appendChild(renderer.domElement);
  host.classList.add('ready'); // masque le repli CSS

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const R = 2;

  // Globe
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(R, 64, 64),
    new THREE.MeshBasicMaterial({ map: makeGlobeTexture() })
  );
  globe.rotation.z = 0.41; // léger axe incliné
  scene.add(globe);

  // Halo atmosphérique (Fresnel, additif)
  const atm = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.16, 64, 64),
    new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'varying vec3 vN; void main(){ float i=pow(0.70 - dot(vN, vec3(0.0,0.0,1.0)), 3.2); i=clamp(i,0.0,1.0); gl_FragColor=vec4(0.36,0.30,0.86,1.0)*i; }',
    })
  );
  scene.add(atm);

  // Contrôles : rotation auto + manipulable
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false; controls.enablePan = false;
  controls.enableDamping = true; controls.dampingFactor = 0.07;
  controls.rotateSpeed = 0.6;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 0.6;
  controls.minPolarAngle = 0.35; controls.maxPolarAngle = Math.PI - 0.35;

  function onResize() {
    W = stage.clientWidth; H = stage.clientHeight || W;
    renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  function animate() {
    requestAnimationFrame(animate);
    if (!reduce) {
      globe.rotation.y += 0.0013;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', initGlobe);
