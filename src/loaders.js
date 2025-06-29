
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function loadGalleryAssets(scene) {
  return new Promise((resolve, reject) => {
    // Remove the placeholder painting plane (do not add it to the scene)
    // const paintingGeometry = new THREE.PlaneGeometry(5, 3);
    // const paintingMaterial = new THREE.MeshStandardMaterial({
    //   color: 0x8b4513,
    //   roughness: 0.7,
    //   metalness: 0.1,
    // });
    // const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
    // painting.position.set(0, 3, -10);
    // painting.castShadow = true;
    // painting.receiveShadow = true;
    // scene.add(painting);

    const loader = new GLTFLoader();
    loader.load(
      "/assets/models/VR.glb",
      (gltf) => {
        const model = gltf.scene;

        // Center and scale the model properly
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Position model at origin and scale appropriately
        model.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 20 / maxDim; // Scale to fit in 20 unit cube (was 10)
        model.scale.setScalar(scale);

        // Move to a good viewing position
        model.position.set(0, 0, 0);

        // Enable shadows for all meshes in the model
        const interactives = [];
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            // Ensure materials are properly configured
            if (child.material) {
              child.material.needsUpdate = true;
            }
            // Tag meshes with a name starting with 'art_' or 'statue_'
            if (
              child.name &&
              (child.name.startsWith("art_") ||
                child.name.startsWith("statue_"))
            ) {
              interactives.push(child);
            }
          }
        });

        scene.add(model);
        // Expose interactives for later use
        window.galleryInteractives = interactives;
        console.log("✅ GLB model loaded successfully");
        console.log("Model dimensions:", size);
        console.log("Model scale applied:", scale);
        resolve();
      },
      (progress) => {
        console.log(
          "Loading progress:",
          (progress.loaded / progress.total) * 100 + "%"
        );
      },
      (error) => {
        console.error("❌ Failed to load model:", error);
        resolve();
      }
    );
  });
}

export { loadGalleryAssets };
