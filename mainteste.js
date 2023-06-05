import * as THREE from "three";

// const vertexShader = `
// varying vec2 vertexUV;
// varying vec3 vertexNormal;

// void main(){
//     vertexUV = uv;
//     vertexNormal = normalize(normalMatrix * normal);
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `;

// const fragmentShader = `
//   uniform sampler2D globeTexture;
//   varying vec2 vertexUV;
//   varying vec3 vertexNormal;

//   void main() {
//     float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
//     vec3 atmosphere = vec3(0.4, 0.6, 0.9) * pow(intensity, 1.5);
//     gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
//   }
// `;

// const atmosphereVertexShader = `
//   varying vec3 vertexNormal;

//   void main() {
//     vertexNormal = normalize(normalMatrix * normal);
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;

// const atmosphereFragmentShader = `
//   varying vec3 vertexNormal;

//   void main() {
//     float intensity = pow(0.6 - dot(vertexNormal, vec3(0, 0, 1.0)), 1.8);
//     gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
//   }
// `;

const vertexShader = `
varying vec2 vertexUV;
varying vec3 vertexNormal;

void main() {
  vertexUV = uv;
  vertexNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D globeTexture;
varying vec2 vertexUV;
varying vec3 vertexNormal;

void main() {
  float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
  vec3 atmosphere = vec3(0.4, 0.6, 0.9) * pow(intensity, 1.5);
  vec4 globeColor = texture2D(globeTexture, vertexUV);
  gl_FragColor = vec4(globeColor.rgb + atmosphere, globeColor.a);
}
`;

const atmosphereVertexShader = `
varying vec3 vertexNormal;

void main() {
  vertexNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragmentShader = `
varying vec3 vertexNormal;

void main() {
  float intensity = pow(0.9 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 1.8);

  gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
}
`;
import { EffectComposer } from "https://threejs.org/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://threejs.org/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://threejs.org/examples/jsm/postprocessing/UnrealBloomPass.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

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

// scene.background = new THREE.TextureLoader().load("./img/starc.jpg");

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

group.position.set(0.0, 0.0, 0.0);
camera.position.z = 12;

window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight)
  //   1.6,
  //   0.1,
  //   0.1
);

composer.addPass(bloomPass);
console.log(bloomPass);

function bloomConfig() {
  //   bloomPass.exposure = 2;
  //   bloomPass.strength = 2.5;
  //   bloomPass.radius = 1;
  //   bloomPass.threshold = 0;
}

function animate() {
  renderer.render(scene, camera);

  composer.render();
  requestAnimationFrame(animate);
}
function onDocumentMouseDown(e) {
  e.preventDefault();

  gsap.to(camera.position, {
    z: 5,
    duration: 3,
  });
}
document.addEventListener("mousedown", onDocumentMouseDown, false);

animate();
