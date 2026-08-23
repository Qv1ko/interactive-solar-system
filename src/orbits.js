import * as THREE from 'three';

const TWO_PI = Math.PI * 2;

function ellipticalPosition(distance, eccentricity, angle, out) {
  const r = (distance * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(angle));
  out.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
  return r;
}

export function updateSystem(records, dtDays) {
  for (const record of records) {
    const p = record.def;
    record.angle += (TWO_PI / p.periodDays) * dtDays;
    ellipticalPosition(p.distance, p.eccentricity, record.angle, record.holder.position);

    if (p.rotationHours) {
      const spin = (TWO_PI / (Math.abs(p.rotationHours) / 24)) * dtDays * Math.sign(p.rotationHours);
      record.mesh.rotation.y += spin;
    }

    for (const moon of record.moons) {
      const direction = Math.sign(moon.def.periodDays) || 1;
      moon.angle += (TWO_PI / Math.abs(moon.def.periodDays)) * dtDays * direction;
      moon.mesh.position.set(
        Math.cos(moon.angle) * moon.distance,
        0,
        Math.sin(moon.angle) * moon.distance
      );
      moon.mesh.rotation.y += TWO_PI * dtDays * 0.2;
    }
  }
}

export function createStarfield(count = 2500, minR = 700, maxR = 1400) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const v = new THREE.Vector3()
      .randomDirection()
      .multiplyScalar(minR + Math.random() * (maxR - minR));
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 1.1, sizeAttenuation: true });
  return new THREE.Points(geometry, material);
}
