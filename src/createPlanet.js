import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { SUN, PLANETS } from './data/solarSystem.js';

function makeGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255, 210, 110, 0.85)');
  gradient.addColorStop(0.25, 'rgba(255, 160, 60, 0.4)');
  gradient.addColorStop(0.6, 'rgba(255, 120, 30, 0.12)');
  gradient.addColorStop(1, 'rgba(255, 110, 20, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export function createSun() {
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(SUN.visualRadius, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0xffc860 })
  );
  mesh.userData.body = { type: 'sun', name: SUN.name, info: SUN.info };
  const light = new THREE.PointLight(0xffffff, 2.5, 0, 0);
  light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 300;
  light.shadow.bias = -0.0004;
  light.shadow.normalBias = 0.02;
  group.add(mesh, light);
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeGlowTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    })
  );
  glow.scale.setScalar(SUN.visualRadius * 4.2);
  group.add(glow);
  return { group, mesh };
}

function createLabel(text, offsetY, isMoon) {
  const div = document.createElement('div');
  div.className = isMoon ? 'label moon-label' : 'label';
  div.textContent = text;
  const label = new CSS2DObject(div);
  label.position.set(0, offsetY, 0);
  return label;
}

function createRings(def) {
  const inner = def.visualRadius * def.rings.innerFactor;
  const outer = def.visualRadius * def.rings.outerFactor;
  const geometry = new THREE.RingGeometry(inner, outer, 128);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    color: def.rings.color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: def.rings.opacity,
  });
  return new THREE.Mesh(geometry, material);
}

function enableShadows(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
}

export function buildSolarSystem(scene) {
  const records = [];
  const orbitLines = [];
  const labels = [];
  const pickables = [];

  const sun = createSun();
  scene.add(sun.group);
  pickables.push(sun.mesh);

  for (const planet of PLANETS) {
    const orbitPlane = new THREE.Group();
    orbitPlane.rotation.x = THREE.MathUtils.degToRad(planet.orbitInclinationDeg);
    scene.add(orbitPlane);

    const holder = new THREE.Group();
    orbitPlane.add(holder);

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = THREE.MathUtils.degToRad(planet.axialTiltDeg);
    holder.add(tiltGroup);

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(planet.visualRadius, 48, 48),
      new THREE.MeshStandardMaterial({ color: planet.color, roughness: 0.85, metalness: 0.1 })
    );
    mesh.userData.body = { type: 'planet', name: planet.name, info: planet.info };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    tiltGroup.add(mesh);
    pickables.push(mesh);

    let ringOuter = null;
    if (planet.rings) {
      const rings = createRings(planet);
      enableShadows(rings);
      tiltGroup.add(rings);
      ringOuter = planet.visualRadius * planet.rings.outerFactor;
    }

    const planetLabel = createLabel(planet.name, planet.visualRadius + 0.7, false);
    mesh.add(planetLabel);
    labels.push(planetLabel);

    const points = [];
    for (let i = 0; i <= 256; i++) {
      const theta = (i / 256) * Math.PI * 2;
      const e = planet.eccentricity;
      const r = (planet.distance * (1 - e * e)) / (1 + e * Math.cos(theta));
      points.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
    }
    const orbitLine = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0x3a4566, transparent: true, opacity: 0.7 })
    );
    orbitPlane.add(orbitLine);
    orbitLines.push(orbitLine);

    const moons = planet.moons.map((moonDef, idx) => {
      const baseDist = ringOuter
        ? ringOuter * 1.3
        : planet.visualRadius * 1.7;
      const moonDistance = baseDist + idx * 0.55;

      const moonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(moonDef.visualRadius, 24, 24),
        new THREE.MeshStandardMaterial({ color: moonDef.color, roughness: 0.95, metalness: 0 })
      );
      moonMesh.userData.body = {
        type: 'moon',
        name: moonDef.name,
        info: [
          ...moonDef.info,
          ['Planeta', planet.name],
        ],
      };
      enableShadows(moonMesh);
      holder.add(moonMesh);
      pickables.push(moonMesh);

      const moonLabel = createLabel(moonDef.name, moonDef.visualRadius + 0.3, true);
      moonMesh.add(moonLabel);
      labels.push(moonLabel);

      return {
        def: moonDef,
        mesh: moonMesh,
        distance: moonDistance,
        angle: Math.random() * Math.PI * 2,
      };
    });

    records.push({
      def: planet,
      holder,
      mesh,
      angle: Math.random() * Math.PI * 2,
      moons,
    });
  }

  return { sunMesh: sun.mesh, records, orbitLines, labels, pickables };
}
