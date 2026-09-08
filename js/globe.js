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
  // océan
  const grad = g.createLinearGradient(0, 0, 0, WORLD_H);
  grad.addColorStop(0, '#0b0b1c'); grad.addColorStop(0.5, '#0a0a17'); grad.addColorStop(1, '#0b0b1c');
  g.fillStyle = grad; g.fillRect(0, 0, WORLD_W, WORLD_H);

  const path = new Path2D(WORLD_PATH);
  // terres
  g.fillStyle = '#221847';
  g.fill(path);
  // côtes lumineuses (violet)
  g.lineJoin = 'round'; g.lineCap = 'round';
  g.shadowColor = 'rgba(150,90,255,0.95)'; g.shadowBlur = 7;
  g.strokeStyle = 'rgba(163,104,255,0.95)'; g.lineWidth = 2.4;
  g.stroke(path);
  g.shadowBlur = 0;
  // lumières de villes (points dans les terres)
  g.fillStyle = 'rgba(255,206,138,0.9)';
  for (let i = 0; i < 1600; i++) {
    const x = Math.random() * WORLD_W, y = Math.random() * WORLD_H;
    if (g.isPointInPath(path, x, y)) g.fillRect(x, y, 1.3, 1.3);
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
      fragmentShader: 'varying vec3 vN; void main(){ float i=pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); i=clamp(i,0.0,1.0); gl_FragColor=vec4(0.42,0.32,0.95,1.0)*i; }',
    })
  );
  scene.add(atm);

  // Anneaux orbitaux (fins, crème)
  const rings = new THREE.Group();
  function ring(rad, rx, ry, rz, op) {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(rad, 0.006, 8, 220),
      new THREE.MeshBasicMaterial({ color: 0xe9e6d6, transparent: true, opacity: op })
    );
    m.rotation.set(rx, ry, rz);
    return m;
  }
  rings.add(ring(R * 1.55, 1.15, 0.2, 0.3, 0.75));
  rings.add(ring(R * 1.7, -0.5, 0.9, 1.1, 0.55));
  rings.add(ring(R * 1.42, 1.9, 0.4, -0.4, 0.5));
  scene.add(rings);

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
      globe.rotation.y += 0.0015;
      rings.rotation.y += 0.0018;
      rings.rotation.x += 0.0006;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', initGlobe);
