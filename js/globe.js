/* =========================================================
   Page « Carte » — Terre réaliste (Three.js)
   Textures NASA/Blue Marble (fournies avec three.js, libres de
   droits) : jour, lumières de villes la nuit, nuages. Transition
   jour/nuit douce (terminateur), halo atmosphérique bleu.
   La Terre tourne sur son axe et se laisse manipuler (souris/doigt).
   Trois.js chargé via CDN ; repli discret (disque) sinon.
   ========================================================= */
const GLOBE_THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
const GLOBE_ORBIT_CDN = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';

const EARTH_DAY = 'assets/earth/earth_atmos_2048.jpg';
const EARTH_NIGHT = 'assets/earth/earth_lights_2048.png';
const EARTH_CLOUDS = 'assets/earth/earth_clouds_1024.png';

function gLoadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.async = true; s.onload = res; s.onerror = () => rej(new Error(src));
    document.head.appendChild(s);
  });
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
  renderer.outputEncoding = THREE.sRGBEncoding;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const R = 2;

  // Direction du « soleil » (fixe dans le monde)
  const sunDir = new THREE.Vector3(5, 2.2, 4).normalize();
  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.position.copy(sunDir);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0x223044, 0.25));

  // Charge les textures
  const loader = new THREE.TextureLoader();
  const load = (url) => new Promise((res, rej) => loader.load(url, res, undefined, rej));
  let dayTex, nightTex, cloudTex;
  try {
    [dayTex, nightTex, cloudTex] = await Promise.all([load(EARTH_DAY), load(EARTH_NIGHT), load(EARTH_CLOUDS)]);
  } catch (e) { return; } // textures indisponibles : on garde le repli
  dayTex.encoding = THREE.sRGBEncoding;
  nightTex.encoding = THREE.sRGBEncoding;

  // Terre : shader mélangeant jour / nuit selon l'angle au soleil
  const earthMat = new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: { value: dayTex },
      nightTexture: { value: nightTex },
      sunDirection: { value: sunDir },
    },
    vertexShader:
      'varying vec2 vUv; varying vec3 vWorldN;' +
      'void main(){ vUv=uv; vWorldN=normalize(mat3(modelMatrix)*normal);' +
      'gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader:
      'uniform sampler2D dayTexture; uniform sampler2D nightTexture; uniform vec3 sunDirection;' +
      'varying vec2 vUv; varying vec3 vWorldN;' +
      'void main(){' +
      '  float d=dot(normalize(vWorldN), normalize(sunDirection));' +
      '  float m=smoothstep(-0.12, 0.22, d);' +
      '  vec3 day=texture2D(dayTexture, vUv).rgb;' +
      '  vec3 night=texture2D(nightTexture, vUv).rgb * 1.5;' +
      '  gl_FragColor=vec4(mix(night, day, m), 1.0);' +
      '}',
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 64), earthMat);
  earth.rotation.y = -1.2; // vue de départ (Europe/Afrique visibles)
  scene.add(earth);

  // Nuages (éclairés par le soleil ; sombres côté nuit)
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.012, 64, 64),
    new THREE.MeshPhongMaterial({ alphaMap: cloudTex, transparent: true, depthWrite: false, opacity: 0.85 })
  );
  earth.add(clouds); // suit la rotation de la Terre

  // Halo atmosphérique bleu (Fresnel, additif)
  const atm = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.14, 64, 64),
    new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'varying vec3 vN; void main(){ float i=pow(0.7 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); i=clamp(i,0.0,1.0); gl_FragColor=vec4(0.32,0.55,1.0,1.0)*i; }',
    })
  );
  scene.add(atm);

  host.classList.add('ready'); // masque le repli CSS

  // Contrôles : manipulable (la Terre tourne d'elle-même)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false; controls.enablePan = false;
  controls.enableDamping = true; controls.dampingFactor = 0.07;
  controls.rotateSpeed = 0.6;
  controls.minPolarAngle = 0.3; controls.maxPolarAngle = Math.PI - 0.3;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onResize() {
    W = stage.clientWidth; H = stage.clientHeight || W;
    renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  function animate() {
    requestAnimationFrame(animate);
    if (!reduce) {
      earth.rotation.y += 0.0006;      // rotation sur l'axe (terminateur qui défile)
      clouds.rotation.y += 0.00025;    // nuages un peu plus rapides
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', initGlobe);
