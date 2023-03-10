import gsap from "./node_modules/gsap";

import * as THREE from "./node_modules/three/";

// import vertexShader from "./shaders/vertex.glsl";
// import fragmentShader from "./shaders/fragment.glsl";

// import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
// import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";

// import starsVertexShader from "./shaders/starsVertex.glsl";
// import starsFragmentShader from "./shaders/starsFragment.glsl";

// import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
// import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";

// import starsVertexShader from "./shaders/starsVertex.glsl";
// import starsFragmentShader from "./shaders/starsFragment.glsl";

const vertexShader = `
varying vec2 vertexUV;
varying vec3 vertexNormal;

void main(){
    vertexUV = uv;
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D globeTexture;

varying vec2 vertexUV;
varying vec3 vertexNormal;

void main(){
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(0.4, 0.6, 0.9) * pow(intensity, 1.5);
    gl_FragColor =  vec4(atmosphere + texture2D(globeTexture,vertexUV).xyz,1.0);
    }`;

const starsVertexShader = `varying vec3 vertexNormal;
void main(){
    vertexNormal = normalize(normalMatrix * normal);
    gl_PointSize = 100.0;
}
`;
const starsFragmentShader = `
varying vec3 vertexNormal;

void main(){
    float intensity = pow(1.2 - dot(vertexNormal, vec3(0,0, 1.0)), 1.8);
    gl_FragColor =  vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
`;

const atmosphereVertexShader = `
varying vec3 vertexNormal;

void main(){
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

`;
const atmosphereFragmentShader = `
varying vec3 vertexNormal;

void main(){
    float intensity = pow(0.6 - dot(vertexNormal, vec3(0,0, 1.0)), 1.8);
    gl_FragColor =  vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }

`;

import { Float32BufferAttribute } from "./node_modules/three";

// import { EffectComposer } from "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js";

// import { RenderPass } from "./node_modules/three/examples/jsm/postprocessing/RenderPass";
// import { UnrealBloomPass } from "./node_modules/three/examples/jsm/postprocessing/UnrealBloomPass";

import { EffectComposer } from "https://threejs.org/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://threejs.org/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://threejs.org/examples/jsm/postprocessing/UnrealBloomPass.js";

import openSimplexNoise from "https://cdn.skypack.dev/open-simplex-noise";

console.log(vertexShader);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
console.log(camera);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const sphereGeometry = new THREE.SphereGeometry(5, 50, 50);
const sphereMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    globeTexture: {
      value: new THREE.TextureLoader().load("./img/milky.jpg"),
    },
  },
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
console.log(sphere);

scene.add(sphere);
// scene.background = new THREE.Color(0x000000);
scene.background = new THREE.TextureLoader().load("./img/starc.jpg");

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);
atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
group.add(atmosphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  vertexShader: starsVertexShader,
  fragmentShader: starsFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  size: 0.2,
  // color: 0xffffff,
});

const starVertices = [];
for (let i = 0; i < 1; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 2000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute(
  "position",
  new Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
console.log(stars);

scene.add(stars);
// group.add(stars);

camera.position.z = 12;

const mouse = {
  x: undefined,
  y: undefined,
};

console.log(atmosphere);

let noise = openSimplexNoise.makeNoise4D(Date.now());
let clock = new THREE.Clock();
let newStars = [];
var starsAll;
function addStars() {
  for (let h = 0; h < 1000; h++) {
    var starGeometry = new THREE.SphereGeometry(0.5, 32, 32);

    var starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var newSphere = new THREE.Mesh(starGeometry, starMaterial);

    newSphere.position.x = Math.random() * 1000 - 500;
    newSphere.position.y = Math.random() * 1000 - 500;

    newSphere.position.z = -Math.random() * 2000;

    newSphere.scale.x = newSphere.scale.y = 1;

    scene.add(newSphere);

    newStars.push(newSphere);
    starsAll = newSphere;
  }
}
function animateStars() {
  for (var i = 0; i < newStars.length; i++) {
    let newStar = newStars[i];

    newStar.position.z += i / 10;

    if (newStar.position.z > 1000) newStar.position.z -= 2000;
  }
}
addStars();
animateStars();

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.6,
  0.1,
  0.1
);
composer.addPass(bloomPass);
console.log(bloomPass);

function bloomConfig() {
  bloomPass.exposure = 2;
  bloomPass.strength = 2.5;
  bloomPass.radius = 1;
  bloomPass.threshold = 0;
}

function animate() {
  renderer.render(scene, camera);
  composer.render();
  requestAnimationFrame(animate);

  bloomConfig();
  for (var i = 0; i < newStars.length; i++) {
    let newStar = newStars[i];

    newStar.position.z += i / 175;

    if (newStar.position.z > 1000) newStar.position.z -= 2000;
  }

  sphere.rotation.y += 0.0011;
  // sphere.rotation.x += 0.0003;
  sphere.geometry.dynamic = true;

  stars.position.x += Math.random() * 0.25;
  if (!isAbout) {
    gsap.to(group.rotation, {
      x: -mouse.y * 0.4,
      y: -mouse.x * 0.6,
      duration: 2,
    });
    gsap.to(camera.position, {
      y: -mouse.y * 0.5,
      x: -mouse.x * 1.5,
      duration: 3,
    });

    gsap.to(stars.position, {
      y: -mouse.y * 0.5,
      x: -mouse.x * 0.5,
      duration: 3,
    });
  }
}

function onDocumentMouseDown(e) {
  e.preventDefault();
  let camdist = 12;

  gsap.to(camera.position, {
    z: (camdist -= 3),
    duration: 3,
  });
}

addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;
});

function onDocumentMouseUp(e) {
  e.preventDefault();

  gsap.to(camera.position, {
    z: 12,
    duration: 3,
  });
}

addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;
});

document.addEventListener("mousedown", onDocumentMouseDown, false);
document.addEventListener("mouseup", onDocumentMouseUp, false);
document.addEventListener("contextmenu", (e) => e.preventDefault());

// groupAll.add(newStars);

const texts = document.querySelector(".texts");

const homeTexts = document.querySelector(".homeTexts");

const aboutText = document.querySelector(".aboutText");

let isAbout = false;

function aboutInfo(e) {
  e.preventDefault();

  isAbout = true;

  homeTexts.style.display = "none";

  texts.style.top = "25%";

  aboutText.style.display = "block";
  aboutText.classList.remove("hide");

  for (let i = 0; i < newStars.length; i++) {
    gsap.to(newStars[i].position, {
      x: Math.random() * 1000 - 500,
      y: -40,
      duration: 3,
    });
  }
  gsap.to(group.position, {
    z: -100,
    duration: 5,
  });

  console.log(camera.position.y);
}

const about = document.querySelector(".about");
about.addEventListener("click", aboutInfo);

function homePage() {
  isAbout = false;

  texts.style.top = "50%";

  gsap.to(group.position, {
    z: 0,
    duration: 5,
  });
  for (let i = 0; i < newStars.length; i++) {
    gsap.to(newStars[i].position, {
      y: Math.random() * 1000 - 500,
      // x: Math.random() * 10000,
      duration: 3,
    });
  }

  aboutText.style.display = "none";

  homeTexts.style.display = "block";
}

const homeButton = document.querySelector(".homeButton");
homeButton.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
homeButton.addEventListener("click", homePage);

animate();
