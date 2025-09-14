import * as THREE from 'three';
import { initMovement, updateMovement } from './movement';
import { initBuildings } from './buildings';
import { initExperiences } from './experience';
import { scene } from './sceneManager';
import { initHome } from './home';
import { initEvents } from './events';

// Config & setup
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
export const renderer = new THREE.WebGLRenderer();
export const raycaster = new THREE.Raycaster();
export const mouse = new THREE.Vector2();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.set(0, 5, 0); // Eye level
camera.rotation.order = 'YXZ';

// Animations
function animate() {
  requestAnimationFrame(animate);
  updateMovement();
  if (scene) renderer.render(scene.scene, camera);
}
animate();

// Init
initMovement();
initBuildings();
initExperiences();
initHome();
initEvents();

// Resize handling
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Message
alert(
    'This is a proof-of-concept & is incomplete.' + '\n\n' + 
    'This project is structured in a way that there is a home scene, ' +
    'which you begin in, that contains buildings. These buildings house "experiences" ' +
    'which are associated to specific coordinates and scenes they apply to. ' +
    'When a user enters the radius of an experience entry point, a red button appears in the lower-right corner of the page. ' +
    'Experiences can be fully interactive, like in this example with wordle, or disable movements and remain static.'
);
alert(
    'CONTROLS' + '\n\n' + 
    '- Arrow keys to walk' + '\n' +
    '- Left click + move mouse to turn & look around'
);
alert(
    'GAMEPLAY' + '\n\n' + 
    'In this example, the wordle building does not have a custom texture and instead is rendered with plain colors. ' +
    'The entry point is in the center of the yellow face of the object (e.g. where a door would be in a custom texture). ' +
    'So just walk into the building wall LOL. ' +
    'Once you enter the experience / wordle building, use the button to guess words' + '\n\n' +
    'Be sure to walk around and explore the 3D-ness of the wordle game :D'
);
