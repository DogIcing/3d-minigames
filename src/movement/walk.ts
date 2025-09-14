import { scene } from "../sceneManager";
import { setMovementFlags } from "./shared";

export function initWalkMovement() {
    const canMove = () => scene?.move ?? false;

    document.addEventListener('keydown', (event) => {
        if (!canMove()) return;
        switch (event.key) {
            case 'ArrowUp':
                setMovementFlags({ forward: true });
                break;
            case 'ArrowDown':
                setMovementFlags({ backward: true });
                break;
            case 'ArrowLeft':
                setMovementFlags({ left: true });
                break;
            case 'ArrowRight':
                setMovementFlags({ right: true });
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (!canMove()) return;
        switch (event.key) {
            case 'ArrowUp':
                setMovementFlags({ forward: false });
                break;
            case 'ArrowDown':
                setMovementFlags({ backward: false });
                break;
            case 'ArrowLeft':
                setMovementFlags({ left: false });
                break;
            case 'ArrowRight':
                setMovementFlags({ right: false });
                break;
        }
    });
}
