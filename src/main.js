import './styles.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { setupScene } from './scene.js';
import { buildSolarSystem } from './createPlanet.js';
import { updateSystem, createStarfield } from './orbits.js';
import { initControls } from './ui/controls.js';
import { initInfoPanel, show, setCurrentBody, setFollowState } from './ui/infoPanel.js';

const DAYS_PER_SECOND = 6;

const container = document.getElementById('app');
const { scene, camera, renderer } = setupScene(container);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.left = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 3;
controls.maxDistance = 800;

scene.add(createStarfield());

const { sunMesh, records, orbitLines, labels, pickables } = buildSolarSystem(scene);

const state = {
  paused: false,
  speed: 1,
};

initControls({
  onSpeedChange: (speed) => (state.speed = speed),
  onPauseChange: (paused) => (state.paused = paused),
  onToggleOrbits: (visible) => orbitLines.forEach((line) => (line.visible = visible)),
  onToggleLabels: (visible) => labels.forEach((label) => (label.visible = visible)),
});

let selected = null;
let followed = null;
const lastFollowPos = new THREE.Vector3();

function findMesh(body) {
  if (!body) return null;
  if (body.type === 'sun') return sunMesh;
  for (const record of records) {
    if (body.type === 'planet' && record.def.name === body.name) return record.mesh;
    if (body.type === 'moon') {
      const moon = record.moons.find((m) => m.def.name === body.name);
      if (moon) return moon.mesh;
    }
  }
  return null;
}

function stopFollowing() {
  followed = null;
}

initInfoPanel({
  onClose: () => {},
  onFollow: (body) => {
    const isAlreadyFollowing =
      followed && followed.name === body.name && followed.type === body.type;
    if (isAlreadyFollowing) {
      stopFollowing();
      return false;
    }
    const target = findMesh(body);
    if (!target) return false;
    followed = body;
    target.getWorldPosition(lastFollowPos);

    const radius = target.geometry?.parameters?.radius ?? 1;
    const dist = Math.max(radius * 8, 4);
    const dir = new THREE.Vector3().subVectors(camera.position, lastFollowPos);
    if (dir.lengthSq() < 1e-6) dir.set(0, 0.5, 1);
    dir.normalize().multiplyScalar(dist);
    camera.position.copy(lastFollowPos).add(dir);
    controls.target.copy(lastFollowPos);
    controls.update();
    return true;
  },
});

function selectBody(body) {
  selected = body;
  setCurrentBody(body.name, body.type, body.info);
  show(body.name, body.type, body.info);
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downPos = null;

renderer.domElement.addEventListener('pointerdown', (event) => {
  downPos = { x: event.clientX, y: event.clientY };
});

renderer.domElement.addEventListener('pointerup', (event) => {
  if (!downPos) return;
  const moved = Math.hypot(event.clientX - downPos.x, event.clientY - downPos.y);
  downPos = null;
  if (moved > 5) return;

  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickables, false);
  if (hits.length === 0) return;
  selectBody(hits[0].object.userData.body);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setFollowState(false);
    hide();
    selected = null;
    stopFollowing();
  }
});

const clock = new THREE.Clock();
const followPos = new THREE.Vector3();

const fpsEl = document.getElementById('fps-counter');
let fpsAccum = 0;
let fpsFrames = 0;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  fpsAccum += delta;
  fpsFrames++;
  if (fpsAccum >= 0.5) {
    fpsEl.textContent = `${Math.round(fpsFrames / fpsAccum)} FPS`;
    fpsAccum = 0;
    fpsFrames = 0;
  }
  if (!state.paused) {
    updateSystem(records, delta * DAYS_PER_SECOND * state.speed);
  }

  if (followed) {
    const target = findMesh(followed);
    if (target) {
      target.getWorldPosition(followPos);
      const drift = followPos.clone().sub(lastFollowPos);
      camera.position.add(drift);
      controls.target.add(drift);
      lastFollowPos.copy(followPos);
    }
  }

  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

animate();
