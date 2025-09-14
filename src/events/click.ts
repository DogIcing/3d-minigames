import * as THREE from 'three';
import { camera, mouse, raycaster } from "../main";

export const clickEvents: {
    object: THREE.Mesh,
    handler: (object: THREE.Mesh) => void,
    reset: (object: THREE.Mesh) => void
}[] = [];

export function initClickEvents() {
    window.addEventListener('mousedown', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        clickEvents.forEach(ev => {
            const intersects = raycaster.intersectObject(ev.object);
            if (intersects.length > 0) {
                ev.handler(ev.object);

                const resetHandler = () => {
                    ev.reset(ev.object)
                    window.removeEventListener('mouseup', resetHandler);
                };
                window.addEventListener('mouseup', resetHandler);
            }
        })
    });
}
