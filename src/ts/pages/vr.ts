import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
const canvas = renderer.domElement;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(canvas);
renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Smooth motion
controls.dampingFactor = 0.05;
controls.minDistance = 1; // Optional limits
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2; // Prevent going below the ground

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

let renderRequested = false;

function render() {
  renderRequested = true;

  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

function requestRenderIfNotRequested() {
  if (!renderRequested) {
    renderRequested = true;
    requestAnimationFrame(render);
  }
}

controls.addEventListener("change", requestRenderIfNotRequested);
window.addEventListener("resize", render);

renderer.setAnimationLoop(render);
