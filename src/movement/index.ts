import * as THREE from 'three';
import { camera } from '../main';
import { lookAroundData, movementFlags } from './shared';
import { initWalkMovement } from './walk';
import { initLookMovement } from './look';
import { buildingBoxes } from '../shared';
import { experienceListeners, setAvailableExperience } from '../experience';
import { scene } from '../sceneManager';

const moveSpeed = 0.2;
const playerSize = 1;
const experienceRadius = 3;

export function updateMovement() {
    const direction = new THREE.Vector3();
    if (movementFlags.forward) direction.z -= 1;
    if (movementFlags.backward) direction.z += 1;
    if (movementFlags.left) direction.x -= 1;
    if (movementFlags.right) direction.x += 1;
    direction.normalize();

    const yawMatrix = new THREE.Matrix4().makeRotationY(lookAroundData.yaw);
    direction.applyMatrix4(yawMatrix);

    const nextPosition = camera.position.clone().addScaledVector(direction, moveSpeed);
    const nextBox = new THREE.Box3().setFromCenterAndSize(
        nextPosition,
        new THREE.Vector3(playerSize, playerSize, playerSize)
    );

    const collides = buildingBoxes.some(box => box.intersectsBox(nextBox));
    if (!collides) camera.position.copy(nextPosition);

    camera.position.y = Math.max(camera.position.y, 2);

    updateDependenciesOfMovement();
}

export function updateDependenciesOfMovement() {
    const pos = camera.position;
    let experienceAvailable = false;
    experienceListeners.forEach(exp => {
        if (
            pos.x > exp.x - experienceRadius &&
            pos.x < exp.x + experienceRadius &&
            pos.z > exp.z - experienceRadius &&
            pos.z < exp.z + experienceRadius &&
            exp.on.map(s => s.uuid).includes(scene?.scene.uuid ?? '')
        ) {
            experienceAvailable = true;
            setAvailableExperience(exp);
        }
    });
    if (!experienceAvailable) setAvailableExperience(null);
}

export function initMovement() {
    initWalkMovement();
    initLookMovement();
}
