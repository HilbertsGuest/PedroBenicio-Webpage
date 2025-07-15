/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as THREE from 'three';

// --- Constants ---
const ELEMENTS = {
    // Original set, with Potassium colors adjusted to be more pink/lilac and Lithium sparks enabled
    COPPER: { name: "Copper", color: "#b87333", flameColors: ["#22dd22", "#11ccff", "#33ff55"], sparks: { enabled: true, color: "#55ff77", count: 25 }, duration: 3000 },
    LITHIUM: { name: "Lithium", color: "#d3d3d3", flameColors: ["#ff0055", "#ee0033", "#ff4477"], sparks: { enabled: true, color: "#ff69b4", count: 35 }, duration: 3000 },
    SODIUM: { name: "Sodium", color: "#e0e0e0", flameColors: ["#ffdd00", "#ffcc00", "#ffee33"], sparks: { enabled: true, color: "#ffff55", count: 40 }, duration: 4000 },
    POTASSIUM: { name: "Potassium", color: "#cccccc", flameColors: ["#dda0dd", "#da70d6", "#ffc0cb"], sparks: { enabled: true, color: "#e6e6fa", count: 20 }, duration: 2500 },
    
    // New elements from the article
    ARSENIC: { name: "Arsenic", color: "#c8a2c8", flameColors: ["#c8a2c8", "#e6e6fa", "#dda0dd"], sparks: { enabled: true, color: "#e0bbe4", count: 15 }, duration: 3000 },
    BORON: { name: "Boron", color: "#98ff98", flameColors: ["#00ff00", "#32cd32", "#adff2f"], sparks: { enabled: true, color: "#7fff00", count: 30 }, duration: 3500 },
    CALCIUM: { name: "Calcium", color: "#f0f0f0", flameColors: ["#ff4500", "#ff6347", "#ff7f50"], sparks: { enabled: true, color: "#ff8c00", count: 20 }, duration: 4000 },
    CESIUM: { name: "Cesium", color: "#e0e0e0", flameColors: ["#8a2be2", "#4b0082", "#9400d3"], sparks: { enabled: true, color: "#9932cc", count: 25 }, duration: 3000 },
    INDIUM: { name: "Indium", color: "#d1d1d1", flameColors: ["#00008b", "#0000cd", "#4682b4"], sparks: { enabled: false }, duration: 2500 },
    LEAD: { name: "Lead", color: "#808080", flameColors: ["#add8e6", "#f0f8ff", "#b0c4de"], sparks: { enabled: true, color: "#ffffff", count: 10 }, duration: 3000 },
    MAGNESIUM: { name: "Magnesium", color: "#f5f5f5", flameColors: ["#ffffff", "#f8f8ff", "#f5f5f5"], sparks: { enabled: true, color: "#ffffff", count: 80 }, duration: 2000 },
    MANGANESE: { name: "Manganese", color: "#a9a9a9", flameColors: ["#adff2f", "#9acd32", "#ffff00"], sparks: { enabled: false }, duration: 3000 },
    MOLYBDENUM: { name: "Molybdenum", color: "#c0c0c0", flameColors: ["#9acd32", "#adff2f", "#bfff00"], sparks: { enabled: false }, duration: 3000 },
    PHOSPHORUS: { name: "Phosphorus", color: "#fffff0", flameColors: ["#b0e0e6", "#afeeee", "#7fffd4"], sparks: { enabled: true, color: "#e0ffff", count: 15 }, duration: 3500 },
    RADIUM: { name: "Radium", color: "#f0f0f0", flameColors: ["#dc143c", "#ff0000", "#b22222"], sparks: { enabled: true, color: "#ff4500", count: 40 }, duration: 4000 },
    RUBIDIUM: { name: "Rubidium", color: "#e0e0e0", flameColors: ["#c71585", "#d02090", "#ff1493"], sparks: { enabled: false }, duration: 3000 },
    SELENIUM: { name: "Selenium", color: "#d3d3d3", flameColors: ["#48d1cc", "#00ced1", "#20b2aa"], sparks: { enabled: true, color: "#40e0d0", count: 20 }, duration: 3000 },
    STRONTIUM: { name: "Strontium", color: "#f0f0f0", flameColors: ["#dc143c", "#ff0000", "#b22222"], sparks: { enabled: true, color: "#ff6347", count: 45 }, duration: 4000 },
    TELLURIUM: { name: "Tellurium", color: "#d1d1d1", flameColors: ["#98fb98", "#adff2f", "#90ee90"], sparks: { enabled: false }, duration: 3000 },
    THALLIUM: { name: "Thallium", color: "#c0c0c0", flameColors: ["#008000", "#006400", "#2e8b57"], sparks: { enabled: false }, duration: 3000 },
    ZINC: { name: "Zinc", color: "#dcdcdc", flameColors: ["#add8e6", "#b0e0e6", "#90ee90"], sparks: { enabled: true, color: "#f0ffff", count: 15 }, duration: 2500 },
};

const DEFAULT_FLAME_COLORS = ["#448aff", "#1976d2", "#ffeb3b", "#fbc02d", "#ff8f00"];
const NOZZLE_TIP_Y = 0.85;
const MAX_PARTICLES = 5000;

// --- 3D Scene State ---
let scene;
let camera;
let renderer;
let torch;
let flameParticles = [];
let particleGeometry;
let particleSystem;
let flameLight;
let activePellet = null;
let pelletTargetTime = 0;
let pelletDropCallback = null;

// --- App State ---
let currentFlameColors = [...DEFAULT_FLAME_COLORS];
let reactionTimeout = null;
let realisticGraphics = false;

// --- DOM ---
const controlsContainer = document.getElementById("element-buttons");
const simulationContainer = document.getElementById("simulation-container");
const graphicsToggle = document.getElementById("graphics-toggle");

// --- Initialization ---
function init() {
  // Scene setup
  scene = new THREE.Scene();
  
  // Camera setup
  const aspect = simulationContainer.clientWidth / simulationContainer.clientHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
  camera.position.set(0, 1.5, 3);
  camera.lookAt(0, 0.5, 0);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(simulationContainer.clientWidth, simulationContainer.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  simulationContainer.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  flameLight = new THREE.PointLight(0xffaa33, 1, 10, 2);
  flameLight.position.set(0, NOZZLE_TIP_Y, 0);
  scene.add(flameLight);

  // Create objects
  torch = createBlowtorch();
  scene.add(torch);

  createParticleSystem();
  
  // Controls
  initializeControls();
  initializeGraphicsToggle();

  // Event Listeners
  window.addEventListener("resize", onWindowResize);

  // Start animation loop
  animate();
}

// --- 3D Object Creation ---
function createBlowtorch() {
  const group = new THREE.Group();

  const nozzleMat = new THREE.MeshStandardMaterial({ color: 0xb98a21, metalness: 0.8, roughness: 0.3 });
  const nozzleGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
  const nozzle = new THREE.Mesh(nozzleGeom, nozzleMat);
  nozzle.position.y = 0.6;

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.2 });
  const bodyGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.8, 20);
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = 0;

  const handleMat = new THREE.MeshStandardMaterial({ color: 0x4b5358, metalness: 0.2, roughness: 0.8 });
  const handleGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 24);
  const handle = new THREE.Mesh(handleGeom, handleMat);
  handle.position.y = -0.55;

  group.add(nozzle);
  group.add(body);
  group.add(handle);

  return group;
}

function createParticleSystem() {
    particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_PARTICLES * 3);
    const colors = new Float32Array(MAX_PARTICLES * 3);
    const sizes = new Float32Array(MAX_PARTICLES);
    const opacities = new Float32Array(MAX_PARTICLES);

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    
    // Create realistic flame texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Create radial gradient for flame particle
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 200, 100, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 100, 50, 0.4)');
    gradient.addColorStop(0.8, 'rgba(255, 50, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const flameTexture = new THREE.CanvasTexture(canvas);
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
        map: flameTexture,
        alphaTest: 0.001,
    });

    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
}

// --- Core Logic ---
function createParticle(pos, vel, color, size, life) {
  return { pos, vel, color, size, life, initialLife: life };
}

function generateFlame() {
  if (flameParticles.length >= MAX_PARTICLES) return;

  if (realisticGraphics) {
    generateRealisticFlame();
  } else {
    generateClassicFlame();
  }
}

function generateClassicFlame() {
  const count = 5;
  for (let i = 0; i < count; i++) {
    const pos = new THREE.Vector3((Math.random() - 0.5) * 0.1, NOZZLE_TIP_Y, (Math.random() - 0.5) * 0.1);
    const vel = new THREE.Vector3((Math.random() - 0.5) * 0.005, 0.015 + Math.random() * 0.01, (Math.random() - 0.5) * 0.005);
    const colorStr = currentFlameColors[Math.floor(Math.random() * currentFlameColors.length)];
    const color = new THREE.Color(colorStr);
    const size = 15 + Math.random() * 10;
    const life = 45 + Math.random() * 20;
    flameParticles.push(createParticle(pos.clone(), vel, color, size, life));
  }
}

function generateRealisticFlame() {
  const count = 12; // More particles for realistic look
  
  // Core flame (blue/white hot center)
  for (let i = 0; i < 3; i++) {
    const pos = new THREE.Vector3((Math.random() - 0.5) * 0.05, NOZZLE_TIP_Y, (Math.random() - 0.5) * 0.05);
    const vel = new THREE.Vector3((Math.random() - 0.5) * 0.003, 0.025 + Math.random() * 0.015, (Math.random() - 0.5) * 0.003);
    
    // Hot core colors - blue to white
    let color;
    if (currentFlameColors === DEFAULT_FLAME_COLORS) {
      color = new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.8, 0.9); // Blue-white core
    } else {
      const colorStr = currentFlameColors[Math.floor(Math.random() * currentFlameColors.length)];
      color = new THREE.Color(colorStr).multiplyScalar(1.2); // Brighter version
    }
    
    const size = 8 + Math.random() * 6;
    const life = 35 + Math.random() * 15;
    flameParticles.push(createParticle(pos.clone(), vel, color, size, life));
  }
  
  // Middle flame (orange/yellow)
  for (let i = 0; i < 6; i++) {
    const pos = new THREE.Vector3((Math.random() - 0.5) * 0.08, NOZZLE_TIP_Y + Math.random() * 0.1, (Math.random() - 0.5) * 0.08);
    const vel = new THREE.Vector3((Math.random() - 0.5) * 0.006, 0.018 + Math.random() * 0.012, (Math.random() - 0.5) * 0.006);
    
    let color;
    if (currentFlameColors === DEFAULT_FLAME_COLORS) {
      color = new THREE.Color().setHSL(0.1 + Math.random() * 0.1, 0.9, 0.7); // Orange-yellow
    } else {
      const colorStr = currentFlameColors[Math.floor(Math.random() * currentFlameColors.length)];
      color = new THREE.Color(colorStr);
    }
    
    const size = 12 + Math.random() * 8;
    const life = 40 + Math.random() * 20;
    flameParticles.push(createParticle(pos.clone(), vel, color, size, life));
  }
  
  // Outer flame (red/orange tips)
  for (let i = 0; i < 3; i++) {
    const pos = new THREE.Vector3((Math.random() - 0.5) * 0.12, NOZZLE_TIP_Y + Math.random() * 0.15, (Math.random() - 0.5) * 0.12);
    const vel = new THREE.Vector3((Math.random() - 0.5) * 0.008, 0.012 + Math.random() * 0.008, (Math.random() - 0.5) * 0.008);
    
    let color;
    if (currentFlameColors === DEFAULT_FLAME_COLORS) {
      color = new THREE.Color().setHSL(0.05 + Math.random() * 0.05, 0.8, 0.5); // Red-orange tips
    } else {
      const colorStr = currentFlameColors[Math.floor(Math.random() * currentFlameColors.length)];
      color = new THREE.Color(colorStr).multiplyScalar(0.8); // Darker version
    }
    
    const size = 16 + Math.random() * 12;
    const life = 50 + Math.random() * 25;
    flameParticles.push(createParticle(pos.clone(), vel, color, size, life));
  }
}

function triggerReaction(element) {
  if (reactionTimeout) clearTimeout(reactionTimeout);
  
  currentFlameColors = element.flameColors;

  if (element.sparks.enabled) {
    const sparkCount = realisticGraphics ? (element.sparks.count || 5) * 1.5 : (element.sparks.count || 5);
    
    for (let i = 0; i < sparkCount; i++) {
        if (flameParticles.length >= MAX_PARTICLES) continue;
        const pos = new THREE.Vector3(0, NOZZLE_TIP_Y, 0);
        const angle = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.2) * (Math.PI / 2);
        const speed = 0.02 + Math.random() * 0.02;

        const vel = new THREE.Vector3(
            Math.cos(angle) * Math.cos(pitch) * speed,
            Math.sin(pitch) * speed + 0.025, // Upward boost
            Math.sin(angle) * Math.cos(pitch) * speed
        );
        
        let color = new THREE.Color(element.sparks.color || "#ffffff");
        let size, life;
        
        if (realisticGraphics) {
          // More varied spark properties for realism
          const sparkType = Math.random();
          if (sparkType < 0.3) {
            // Bright white-hot sparks
            color = new THREE.Color(0xffffff);
            size = 6 + Math.random() * 4;
            life = 80 + Math.random() * 60;
          } else if (sparkType < 0.7) {
            // Medium temperature sparks
            color = new THREE.Color(element.sparks.color || "#ffffff").multiplyScalar(0.9);
            size = 8 + Math.random() * 6;
            life = 60 + Math.random() * 40;
          } else {
            // Cooler, longer-lasting sparks
            color = new THREE.Color(element.sparks.color || "#ffffff").multiplyScalar(0.7);
            size = 12 + Math.random() * 8;
            life = 100 + Math.random() * 80;
          }
        } else {
          size = 10 + Math.random() * 5;
          life = 60 + Math.random() * 40;
        }
        
        flameParticles.push(createParticle(pos, vel, color, size, life));
    }
  }

  reactionTimeout = window.setTimeout(() => {
    currentFlameColors = [...DEFAULT_FLAME_COLORS];
    reactionTimeout = null;
  }, element.duration);
}

function createPellet(element) {
    if(activePellet) return; // Only one pellet at a time

    const pelletGeom = new THREE.SphereGeometry(0.05, 16, 16);
    const pelletMat = new THREE.MeshStandardMaterial({
        color: element.color,
        emissive: element.color,
        emissiveIntensity: 0.5
    });
    activePellet = new THREE.Mesh(pelletGeom, pelletMat);
    activePellet.position.set(0.5, 2.5, 1); // Start from top-right
    scene.add(activePellet);
    
    pelletTargetTime = Date.now() + 500; // 0.5s travel time
    pelletDropCallback = () => triggerReaction(element);
}

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);

  const now = Date.now();
  
  generateFlame();
  updateParticles();
  updatePellet(now);

  flameLight.intensity = 0.5 + (flameParticles.length / MAX_PARTICLES) * 2;

  renderer.render(scene, camera);
}

function updateParticles() {
    const positions = particleGeometry.attributes.position.array;
    const colors = particleGeometry.attributes.color.array;
    const sizes = particleGeometry.attributes.size.array;
    const opacities = particleGeometry.attributes.opacity.array;
    
    let liveParticles = 0;
    flameParticles.forEach(p => {
        if (p.life > 0) {
            if (realisticGraphics) {
                updateRealisticParticle(p);
            } else {
                updateClassicParticle(p);
            }
            
            const lifeRatio = Math.max(0, p.life / p.initialLife);
            
            positions[liveParticles * 3] = p.pos.x;
            positions[liveParticles * 3 + 1] = p.pos.y;
            positions[liveParticles * 3 + 2] = p.pos.z;

            let currentColor;
            if (realisticGraphics) {
                // More realistic color transitions
                const temp = 1.0 - lifeRatio;
                currentColor = p.color.clone();
                
                // Simulate temperature-based color changes
                if (temp > 0.7) {
                    currentColor.lerp(new THREE.Color(0x000000), (temp - 0.7) * 3);
                } else if (temp > 0.4) {
                    currentColor.lerp(new THREE.Color(0xff4400), (temp - 0.4) * 0.5);
                }
                
                currentColor.multiplyScalar(lifeRatio * lifeRatio); // Non-linear fade
            } else {
                currentColor = p.color.clone().multiplyScalar(lifeRatio);
            }
            
            colors[liveParticles * 3] = currentColor.r;
            colors[liveParticles * 3 + 1] = currentColor.g;
            colors[liveParticles * 3 + 2] = currentColor.b;

            if (realisticGraphics) {
                sizes[liveParticles] = p.size * (0.5 + lifeRatio * 0.5); // Less dramatic size change
                opacities[liveParticles] = lifeRatio * lifeRatio; // Non-linear opacity fade
            } else {
                sizes[liveParticles] = p.size * lifeRatio;
                opacities[liveParticles] = lifeRatio;
            }

            liveParticles++;
        }
    });

    flameParticles = flameParticles.filter(p => p.life > 0);

    particleGeometry.setDrawRange(0, liveParticles);
    particleGeometry.attributes.position.needsUpdate = true;
    particleGeometry.attributes.color.needsUpdate = true;
    particleGeometry.attributes.size.needsUpdate = true;
    particleGeometry.attributes.opacity.needsUpdate = true;
}

function updateClassicParticle(p) {
    p.pos.add(p.vel);
    p.vel.y -= 0.00005; // Gravity effect
    p.vel.x *= 0.98;
    p.vel.z *= 0.98;
    p.life--;
}

function updateRealisticParticle(p) {
    // More complex physics for realistic flames
    p.pos.add(p.vel);
    
    // Buoyancy effect (hot air rises)
    const buoyancy = 0.0002 * (1 - p.life / p.initialLife);
    p.vel.y += buoyancy;
    
    // Turbulence for realistic flame movement
    const turbulence = 0.001;
    p.vel.x += (Math.random() - 0.5) * turbulence;
    p.vel.z += (Math.random() - 0.5) * turbulence;
    
    // Air resistance
    p.vel.multiplyScalar(0.985);
    
    // Slight gravity
    p.vel.y -= 0.00002;
    
    p.life--;
}

function updatePellet(now) {
    if (!activePellet) return;

    const targetPos = new THREE.Vector3(0, NOZZLE_TIP_Y + 0.1, 0);
    if (now < pelletTargetTime) {
        const progress = 1 - (pelletTargetTime - now) / 500;
        activePellet.position.lerp(targetPos, progress * 0.1); // Ease-out effect
    } else {
        scene.remove(activePellet);
        activePellet = null;
        if(pelletDropCallback) {
            pelletDropCallback();
            pelletDropCallback = null;
        }
    }
}

// --- UI and Event Handlers ---
function initializeControls() {
  for (const key in ELEMENTS) {
    const element = ELEMENTS[key];
    const button = document.createElement("button");
    button.className = "element-button";
    button.textContent = element.name;
    button.addEventListener("click", () => createPellet(element));
    controlsContainer.appendChild(button);
  }
}

function initializeGraphicsToggle() {
  graphicsToggle.addEventListener("click", () => {
    realisticGraphics = !realisticGraphics;
    graphicsToggle.textContent = `Realistic Graphics: ${realisticGraphics ? 'ON' : 'OFF'}`;
    
    // Update particle material when switching modes
    updateParticleMaterial();
  });
}

function updateParticleMaterial() {
  if (realisticGraphics) {
    // Enhanced material for realistic mode
    particleSystem.material.size = 0.15;
    particleSystem.material.opacity = 0.8;
    flameLight.intensity = 1.5;
    flameLight.distance = 15;
  } else {
    // Classic material
    particleSystem.material.size = 0.1;
    particleSystem.material.opacity = 1.0;
    flameLight.intensity = 1.0;
    flameLight.distance = 10;
  }
}

function onWindowResize() {
  camera.aspect = simulationContainer.clientWidth / simulationContainer.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(simulationContainer.clientWidth, simulationContainer.clientHeight);
}

// --- Start ---
init();