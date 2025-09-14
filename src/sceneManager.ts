import * as THREE from 'three';

interface RichSceneData {
    scene: THREE.Scene,
    move: boolean
}

export let scene: RichSceneData | null = null;

export function setScene(_scene: RichSceneData) {
    scene = _scene;
}
