// import gsap from "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js";

// import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
// import gsap from "gsap";
import * as THREE from "three";

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

const canvas = document.querySelector(".canvas");

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
//gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

const atmosphereFragmentShader = `
varying vec3 vertexNormal;

void main(){
    float intensity = pow(0.6 - dot(vertexNormal, vec3(0,0, 1.0)), 1.8);
    gl_FragColor =  vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }

`;

// gl_FragColor =  vec4(0.3, 0.6, 1.0, 1.0) * intensity;

import { Float32BufferAttribute } from "https://unpkg.com/three@0.127.0/build/three.module.js";

// import { EffectComposer } from "./node_modules/three/examples/jsm/postprocessing/EffectComposer.js";

// import { RenderPass } from "./node_modules/three/examples/jsm/postprocessing/RenderPass";
// import { UnrealBloomPass } from "./node_modules/three/examples/jsm/postprocessing/UnrealBloomPass";

import { EffectComposer } from "https://threejs.org/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://threejs.org/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://threejs.org/examples/jsm/postprocessing/UnrealBloomPass.js";

import openSimplexNoise from "https://cdn.skypack.dev/open-simplex-noise";

import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://threejs.org/examples/jsm/loaders/DRACOLoader.js";
import { OBJLoader } from "https://threejs.org/examples/jsm/loaders/OBJLoader.js";

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
    c: { type: "f", value: 0.0 },
    p: { type: "f", value: 3.3 },
    glowColor: { type: "c", value: new THREE.Color(0xffff00) },
    viewVector: { type: "v3", value: camera.position },
    globeTexture: {
      value: new THREE.TextureLoader().load("./img/milky.jpg"),
    },
  },
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// scene.add(sphere);
// scene.background = new THREE.Color(0x0d0d0d);
scene.background = new THREE.TextureLoader().load("./img/starc.jpg");
// scene.background = new THREE.Color(0x171717);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    uniforms: {
      c: { type: "f", value: 0.0 },
      p: { type: "f", value: 3.3 },
      glowColor: { type: "c", value: new THREE.Color(0x74d5f2) },
      viewVector: { type: "v3", value: camera.position },
    },
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

group.position.set(0.0, 0.0, -400);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  vertexShader: starsVertexShader,
  fragmentShader: starsFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  size: 0.2,
  // color: 0xffffff,
});

// const starVertices = [];
// for (let i = 0; i < 1; i++) {
//   const x = (Math.random() - 0.5) * 2000;
//   const y = (Math.random() - 0.5) * 2000;
//   const z = -Math.random() * 2000;
//   starVertices.push(x, y, z);
// }
// starGeometry.setAttribute(
//   "position",
//   new Float32BufferAttribute(starVertices, 3)
// );

// const stars = new THREE.Points(starGeometry, starMaterial);
// console.log(stars);

// scene.add(stars);
// group.add(stars);

camera.position.z = 12;

const mouse = {
  x: undefined,
  y: undefined,
};

console.log(atmosphere);

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

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
  // stars.position.x += Math.random() * 0.25;
  if (!isAbout && !isPortfolio) {
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

    // gsap.to(stars.position, {
    //   y: -mouse.y * 0.5,
    //   x: -mouse.x * 0.5,
    //   duration: 3,
    // });
  }
  if (isPortfolio) {
    const cameraDistance = camera.position.z - group.position.z;
    const mouseVector = new THREE.Vector3(mouse.x, mouse.y, cameraDistance);
    mouseVector.unproject(camera);
    const direction = mouseVector.sub(camera.position).normalize();
    const distance = -camera.position.z / direction.z;
    const finalPosition = camera.position
      .clone()
      .add(direction.multiplyScalar(distance));
    gsap.to(group.position, {
      y: finalPosition.y,
      x: finalPosition.x,
      z: finalPosition.z,
      duration: 0.3,
    });
    group.position.copy(finalPosition);
  } else if (!isPortfolio && !isAbout) {
    if (group.position.z == -400 || group.position.z != 0) {
      group.visible = true;
      gsap.to(group.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 3.5,
      });
    }
    // group.position.set(0, 0, -400);
    // gsap.to(group.position, {
    //   y: 0,
    //   x: 0,
    //   z: -40,
    //   duration: 3.5,
    // });
    // gsap.to(group.position, {
    //   z: 0,
    //   duration: 3.5,
    // });

    group.scale.set(1, 1, 1);
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

  // if (isPortfolio) {
  //   sphere.position.x = mouse.x * sphere.position.z; // Ajuste o valor multiplicador para controlar a sensibilidade do movimento
  //   sphere.position.y = mouse.y * sphere.position.z;
  // }
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

const portfolioItems = document.querySelector(".portfolioItems");

let isAbout = false;
let isPortfolio = false;

function aboutInfo(e) {
  e.preventDefault();

  isAbout = true;
  isPortfolio = false;

  homeButton.style.display = "block";

  homeTexts.style.display = "none";
  portfolioItems.style.display = "none";

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
  group.scale.set(1, 1, 1);
  gsap.to(group.position, {
    x: 0,
    y: 0,
    z: -100,
    duration: 5,
  });

  console.log(camera.position.y);
}

const about = document.querySelector(".about");
about.addEventListener("click", aboutInfo);

function homePage() {
  isAbout = false;
  if (isPortfolio) {
    group.visible = false;
    gsap.to(group.position, {
      z: -400,
      duration: 0.4,
    });
  } else {
    gsap.to(group.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 3,
    });
  }
  isPortfolio = false;
  homeButton.style.display = "none";

  texts.style.top = "50%";

  // gsap.to(group.position, {
  //   z: 0,
  //   duration: 3.5,
  // });
  console.log(group.position);
  console.log(group.position);
  for (let i = 0; i < newStars.length; i++) {
    gsap.to(newStars[i].position, {
      y: Math.random() * 1000 - 500,
      // x: Math.random() * 10000,
      duration: 3,
    });
  }

  aboutText.style.display = "none";

  homeTexts.style.display = "block";

  portfolioItems.style.display = "none";
}

const portfolioButton = document.querySelector(".portfolio");

portfolioButton.addEventListener("click", portfolioPage);

function portfolioPage(e) {
  isPortfolio = true;
  if (isPortfolio) {
    const cards = document.getElementById("cards");
    homeButton.style.display = "block";

    homeTexts.style.display = "none";
    aboutText.style.display = "none";

    texts.style.top = "50%";

    portfolioItems.style.display = "flex";

    group.scale.set(0.1, 0.1, 0.1);

    if (cards) {
      // Verifica se o jQuery e o Slick Carousel estão carregados
      if (typeof jQuery !== "undefined" && typeof $.fn.slick !== "undefined") {
        $(cards).not(".slick-initialized").slick({
          prevArrow:
            "<img class='a-left control-c prev slick-prev' src='./svgs/prevarrow.svg'>",
          nextArrow:
            "<img class='a-right control-c next slick-next' src='./svgs/nextarrow.svg'>",

          slidesToShow: 1,
          autoplay: false,
          arrows: true,
          dots: false,
          // Adicione mais opções conforme necessário
        });
      }
    }
  }

  // atmosphere.scale.set(0.15, 0.15, 0.15);

  // gsap.to(group.position, {
  //   z: -50,
  //   duration: 0,
  // });
}

const homeButton = document.querySelector(".homeButton");
homeButton.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
homeButton.addEventListener("click", homePage);

// }

let loadingComplete = false;

const loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = () => {
  loadingComplete = true;
  hideLoadingScreen();
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const progress = itemsLoaded / itemsTotal;
  updateLoadingScreen(progress);
};

function updateLoadingScreen(progress) {
  // Atualize a barra de progresso ou qualquer outro elemento visual de carregamento
  // com base no valor de progress
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
  // Código para carregar os elementos Three.js aqui

  // Simulação de carregamento
  setTimeout(() => {
    loadingManager.onLoad();
  }, 3000);
});

animate();
