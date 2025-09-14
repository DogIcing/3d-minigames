import * as THREE from 'three';
import { setScene } from '../sceneManager';

export const homeScene = new THREE.Scene();

export function initHome() {
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    homeScene.add(floor);

    setScene({
        scene: homeScene,
        move: true
    });
}

export function registerHomeMesh(mesh: THREE.Mesh) {
    homeScene.add(mesh);
}
