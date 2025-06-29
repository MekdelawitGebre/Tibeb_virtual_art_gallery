import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(18.57,4.02,1.02);

let controls;

function initControls(domElement) {
  controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 1.0;
  controls.panSpeed = 1.0;

  controls.minDistance = 2;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 1.5;

  controls.target.set(0, 0, 0);
  controls.update();
}

function moveCameraTo(pos) {
  const duration = 1.5;
  const start = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };

  const steps = 60 * duration;
  let frame = 0;

  const interval = setInterval(() => {
    frame++;
    const t = frame / steps;
    camera.position.set(
      lerp(start.x, pos.x, t),
      lerp(start.y, pos.y, t),
      lerp(start.z, pos.z, t)
    );
    controls.update();

    if (frame >= steps) {
      clearInterval(interval);
    }
  }, 1000 / 60);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export { initControls, camera, controls, moveCameraTo };
