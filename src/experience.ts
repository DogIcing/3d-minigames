import * as THREE from 'three';
import { camera } from './main';
import { updateDependenciesOfMovement } from './movement';
import { setScene } from './sceneManager';

interface Experience {
    x: number,
    z: number,
    name: string,
    scene: THREE.Scene,
    canMove: boolean,
    on: THREE.Scene[],
    playerPosition?: {
        x?: number | undefined,
        y?: number | undefined,
        z?: number | undefined
    } | undefined
}

export const experienceListeners: Experience[] = []

let availableExperience: Experience | null = null;
export function setAvailableExperience(exp: Experience | null) {
    availableExperience = exp;

    const btn = document.querySelector('#experience-btn');
    if (exp === null) btn?.classList.add('hidden');
    else {
        const content = btn?.querySelector('#content');
        if (content) content.innerHTML = exp.name;
        btn?.classList.remove('hidden');
    }
}

export function initExperiences() {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.createElement('div');
        btn.id = 'experience-btn';
        const content = document.createElement('span');
        content.id = 'content';
        btn.append(content);
        document.querySelector('body')?.append(btn);

        btn.addEventListener('click', () => {
            if (availableExperience) {
                setScene({
                    scene: availableExperience.scene,
                    move: availableExperience.canMove
                });

                const playerPos = availableExperience.playerPosition;
                camera.position.x = playerPos?.x ?? camera.position.x;
                camera.position.y = playerPos?.y ?? camera.position.y;
                camera.position.z = playerPos?.z ?? camera.position.z;

                updateDependenciesOfMovement();
            }
        });
    });
}
