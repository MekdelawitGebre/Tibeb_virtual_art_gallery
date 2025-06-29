import { initUI } from "./ui.js";
import { initControls, camera, controls } from "./controls.js";
import { loadGalleryAssets } from "./loaders.js";

import * as THREE from "three";

let scene, renderer;
let stats;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Room camera positions
const roomCameraPositions = {
  "Collider 1": {
    x: 7.94,
    y: 1.51,
    z: 5.94,
    rotationX: -18.4,
    rotationY: 70.3,
    rotationZ: 17.4,
  },
  "Collider 2": {
    x: 3.98,
    y: 2.04,
    z: 3.23,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
  },
  "Collider 3": {
    x: 5.35,
    y: 0.21,
    z: 6.02,
    rotationX: 95.5,
    rotationY: 84.0,
    rotationZ: -95.6,
  },
  "Room 1": {
    x: 4.03,
    y: 2.21,
    z: -1.64,
    rotationX: -103.9,
    rotationY: -69.6,
    rotationZ: -104.7,
  },
  "Room 2": {
    x: 3.12,
    y: 2.4,
    z: -5.85,
    rotationX: -103.9,
    rotationY: -69.6,
    rotationZ: -104.8,
  },
  "Room 3": {
    x: -5.65,
    y: 1.98,
    z: 3.39,
    rotationX: -18.2,
    rotationY: -9.2,
    rotationZ: -3.0,
  },
};

// Numbered navigation buttons with positions and descriptions
const numberedNavigationButtons = {
  1: {
    buttonPosition: { x: 5.04, y: 0.16, z: 4.76 },
    cameraPosition: { x: 8.95, y: 1.02, z: 6.11 },

    title: "Haile Selassie I",
    description: `Reign: 1930 – 1974
Regnal Name: His Imperial Majesty Haile Selassie I, King of Kings, Lord of Lords, Conquering Lion of the Tribe of Judah`,
  },
  2: {
    buttonPosition: { x: 6.4, y: 0.61, z: 0.53 },
    cameraPosition: { x: 6.36, y: 1.79, z: 7.52 },

    title: "Lion of Judah Art String",
    description: `This string art shows the Lion of Judah. It is a symbol of strength and royalty in Ethiopia.`,
  },
  3: {
    buttonPosition: { x: 1.9, y: 1.2, z: -2.07 },
    cameraPosition: { x: 3.8, y: 1.9, z: 3.35 },
    rotationX: -6.9,
    rotationY: -3.8,
    rotationZ: -0.5,

    title: "Sebastopol Cannon",
    description: `The Sebastopol Cannon, brought by Emperor Tewodros II, symbolizes strength and resistance.`,
  },

  4: {
    buttonPosition: { x: 7.72, y: 1.07, z: -3.27 },
    cameraPosition: { x: 3.54, y: 1.59, z: 0.02 },
    rotationX: 11,
    rotationY: -42.7,
    rotationZ: 8.2,
    title: " African Heritage",
    description: `A vibrant tribute to Africa's culture and unity by renowned artist Afewerk Tekle.`,
  },

  5: {
    buttonPosition: { x: 8, y: 0.61, z: -6.19 },
    cameraPosition: { x: 2.36, y: 1.32, z: -3.67 },
    rotationX: 23.4,
    rotationY: -37.1,
    rotationZ: 14.7,
    title: "Priest with Begena ",
    description: `A spiritual artwork depicting an Ethiopian Orthodox priest (Kes) playing the Begena`,
  },
  6: {
    buttonPosition: { x: -4.32, y: 0.2, z: -1.64 },
    cameraPosition: { x: -5.37, y: 1.17, z: 4.52 },
    rotationX: -0.4,
    rotationY: -9.7,
    rotationZ: -0.1,
    title: "Walia Ibex",
    description: `This statue representing the endemic Walia Ibex found only in the Simien Mountains.`,
  },
  7: {
    buttonPosition: { x: -0.63, y: 0.7, z: -2.12 },
    cameraPosition: { x: -6.52, y: 0.98, z: -4.84 },
    rotationX: 165.4,
    rotationY: -36.7,
    rotationZ: 171.2,
    title: "Church Fathers",
    description: `Ethiopian orthodox church fathers and deacons`,
  },

  8: {
    buttonPosition: { x: -9, y: 0.9, z: 3 },
    cameraPosition: { x: -3.65, y: 1.09, z: 2.48 },
    rotationX: 145.8,
    rotationY: 60.9,
    rotationZ: -149.3,
    title: "Food Ceremony",
    description: `Ethiopian family having a traditional meal`,
  },
  9: {
    buttonPosition: { x: 1.74, y: 0.75, z: 3.0 },
    cameraPosition: { x: 5.72, y: 0.17, z: 7.51 },
    rotationX: 4.4,
    rotationY: 44.8,
    rotationZ: -3.1,
    title: "Chair",
    description: `Take a rest here.you can sit.`,
  },
};

initApp();

function initApp() {
  initUI(startGallery);
}

function startGallery() {
  // Show loading overlay
  document.getElementById("loadingOverlay").style.display = "flex";

  setTimeout(() => {
    initScene();
  }, 2);
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222822);

  // Optimized renderer settings for better performance
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
  });

  // Limit pixel ratio for better performance
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  document.body.appendChild(renderer.domElement);

  // Improved lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const spotLight = new THREE.SpotLight(0xffffff, 1.5);
  spotLight.position.set(10, 20, 10);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  scene.add(spotLight);

  initControls(renderer.domElement);

  // Load assets
  loadGalleryAssets(scene).then(() => {
    document.getElementById("loadingOverlay").style.display = "none";
    createMeshButtons();
    createRoomButtons();
    createInteractiveMarkers();
  });

  window.addEventListener("resize", onWindowResize, false);

  animate();
}

let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  controls.update();
  renderer.render(scene, camera);

  if (stats) {
    stats.update();
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function showInfoPanel(object) {
  let panel = document.getElementById("infoPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "infoPanel";
    panel.style.position = "fixed";
    panel.style.bottom = "30px";
    panel.style.left = "50%";
    panel.style.transform = "translateX(-50%)";
    panel.style.background = "#888";
    panel.style.color = "white";
    panel.style.padding = "6px 12px";
    panel.style.borderRadius = "4px";
    panel.style.fontFamily = "sans-serif";
    panel.style.fontSize = "13px";
    panel.style.zIndex = "2000";
    panel.style.display = "none";
    document.body.appendChild(panel);
  }

  // Check if it's a custom marker with userData
  if (object.userData && object.userData.description) {
    panel.innerHTML = `<b>${object.userData.title}</b><br>${object.userData.description}`;
  } else {
    // Handle regular gallery objects
    const meta = galleryDescriptions[object.name];
    if (meta) {
      panel.innerHTML = `<b>${meta.title}</b><br><i>${meta.artist}</i> (${meta.year})<br>${meta.description}`;
    } else {
      panel.innerHTML = `<b>${object.name}</b><br>No description available.`;
    }
  }

  panel.style.display = "block";
  setTimeout(() => {
    panel.style.display = "none";
  }, 5000);
}

function onDocumentClick(event) {
  if (!window.galleryInteractives) return;
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    window.galleryInteractives,
    true
  );
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

    // Check if it's a navigation button
    if (clickedObject.userData && clickedObject.userData.isNavigationButton) {
      // Move camera to the button's camera position
      const buttonData =
        numberedNavigationButtons[clickedObject.userData.buttonNumber];
      if (buttonData) {
        moveCameraTo(buttonData.cameraPosition);
        showInfoPanel(clickedObject);
      }
    } else {
      // Handle regular gallery objects
      showInfoPanel(clickedObject);
    }
  }
}

document.addEventListener("click", onDocumentClick, false);

// After galleryInteractives are loaded, create numbered buttons for each
function createMeshButtons() {
  if (!window.galleryInteractives) return;
  let panel = document.getElementById("meshButtonsPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "meshButtonsPanel";
    panel.style.position = "fixed";
    panel.style.top = "80px";
    panel.style.right = "30px";
    panel.style.background = "rgba(0,0,0,0)";
    panel.style.padding = "5px";
    panel.style.borderRadius = "8px";
    panel.style.zIndex = "1500";
    document.body.appendChild(panel);
  }
  panel.innerHTML = "";
  window.galleryInteractives.forEach((mesh, idx) => {
    const btn = document.createElement("button");
    btn.textContent = (idx + 1).toString();
    btn.style.margin = "4px";
    btn.style.padding = "8px 12px";
    btn.style.fontSize = "16px";
    btn.style.borderRadius = "4px";
    btn.style.border = "none";
    btn.style.background = "#fff";
    btn.style.cursor = "pointer";
    btn.onclick = () => {
      // Move camera to mesh
      const box = new THREE.Box3().setFromObject(mesh);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      // Position camera a bit away from the center, looking at the mesh
      const offset = Math.max(size.x, size.y, size.z) * 2 + 2;
      const camPos = {
        x: center.x + offset,
        y: center.y + offset * 0.3,
        z: center.z + offset,
      };
      moveCameraTo(camPos);
      showInfoPanel(mesh);
    };
    panel.appendChild(btn);
  });
}

function moveCameraTo(position) {
  if (
    position.x !== undefined &&
    position.y !== undefined &&
    position.z !== undefined
  ) {
    camera.position.set(position.x, position.y, position.z);
  }

  // Handle rotation if provided (convert degrees to radians)
  if (
    position.rotationX !== undefined ||
    position.rotationY !== undefined ||
    position.rotationZ !== undefined
  ) {
    // Temporarily disable controls to set rotation
    const wasEnabled = controls.enabled;
    controls.enabled = false;

    camera.rotation.set(
      ((position.rotationX || 0) * Math.PI) / 180,
      ((position.rotationY || 0) * Math.PI) / 180,
      ((position.rotationZ || 0) * Math.PI) / 180
    );

    // Update controls target to match camera direction
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(camera.quaternion);
    const target = camera.position.clone().add(direction);
    controls.target.copy(target);

    // Re-enable controls
    controls.enabled = wasEnabled;
  }

  camera.updateMatrixWorld();
  controls.update();
}

function createRoomButtons() {
  let panel = document.getElementById("roomButtonsPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "roomButtonsPanel";
    panel.style.position = "fixed";
    panel.style.top = "55px";
    panel.style.left = "20px";
    panel.style.background = "rgba(25, 23, 23, 0.8)";
    panel.style.padding = "15px";
    panel.style.borderRadius = "12px";
    panel.style.zIndex = "1500";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.gap = "8px";
    panel.style.minWidth = "120px";
    panel.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
    panel.style.border = "1px solid rgba(255,255,255,0.1)";
    document.body.appendChild(panel);
  }
  panel.innerHTML = "";

  // Add title
  const title = document.createElement("div");
  title.textContent = "Rooms";
  title.style.color = "white";
  title.style.fontSize = "14px";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "8px";
  title.style.textAlign = "center";
  title.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
  title.style.paddingBottom = "8px";
  panel.appendChild(title);

  Object.entries(roomCameraPositions).forEach(([room, pos]) => {
    const btn = document.createElement("button");
    btn.textContent = room;
    btn.style.width = "100%";
    btn.style.padding = "4px";
    btn.style.fontSize = "14px";
    btn.style.fontWeight = "400";
    btn.style.borderRadius = "8px";
    btn.style.border = "none";
    btn.style.background =
      "linear-gradient(135deg,rgb(93, 114, 139),rgb(55, 74, 92))";
    btn.style.color = "white";
    btn.style.cursor = "pointer";
    btn.style.transition = "all 0.2s ease";
    btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    btn.style.fontFamily = "Arial, sans-serif";

    // Hover effects
    btn.onmouseenter = () => {
      btn.style.background =
        "linear-gradient(135deg,rgb(44, 72, 102), #4a90e2)";
      btn.style.transform = "translateY(-1px)";
      btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    };

    btn.onmouseleave = () => {
      btn.style.background = "linear-gradient(135deg, #4a90e2, #357abd)";
      btn.style.transform = "translateY(0)";
      btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    };

    // Click effect
    btn.onmousedown = () => {
      btn.style.transform = "translateY(0)";
      btn.style.boxShadow = "0 1px 2px rgba(0,0,0,0.2)";
    };

    btn.onmouseup = () => {
      btn.style.transform = "translateY(-1px)";
      btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    };

    btn.onclick = () => {
      moveCameraTo(pos);
    };

    panel.appendChild(btn);
  });
}

function createInteractiveMarkers() {
  // Create circular number label texture
  const createButtonTexture = (number) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 64;
    canvas.height = 64;

    // Draw circular background
    context.beginPath();
    context.arc(32, 32, 28, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
    context.strokeStyle = "#333";
    context.lineWidth = 2;
    context.stroke();

    // Draw number
    context.fillStyle = "black";
    context.font = "bold 24px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(number.toString(), 32, 32);

    return new THREE.CanvasTexture(canvas);
  };

  // Create button geometry and material
  const buttonGeometry = new THREE.PlaneGeometry(0.4, 0.4);

  // Create buttons for each navigation point
  Object.entries(numberedNavigationButtons).forEach(([number, data]) => {
    const texture = createButtonTexture(number);
    const buttonMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.position.set(
      data.buttonPosition.x,
      data.buttonPosition.y,
      data.buttonPosition.z
    );
    button.name = `NavigationButton${number}`;
    button.userData = {
      title: data.title,
      description: data.description,
      isNavigationButton: true,
      buttonNumber: number,
    };

    scene.add(button);

    // Add to interactive objects for click detection
    if (!window.galleryInteractives) {
      window.galleryInteractives = [];
    }
    window.galleryInteractives.push(button);
  });
}
