import { camera } from "../main";
import { setLookAroundData, lookAroundData } from "./shared";

export function initLookMovement() {
    document.addEventListener('mousedown', (event) => {
        if (event.button === 0) setLookAroundData({
            isMouseDown: true,
            prevMouseX: event.clientX,
            prevMouseY: event.clientY
        });
    });

    document.addEventListener('mouseup', (event) => {
        if (event.button === 0) setLookAroundData({
            isMouseDown: false
        });
    });

    document.addEventListener('mousemove', (event) => {
        if (lookAroundData.isMouseDown) {
            const deltaX = event.clientX - lookAroundData.prevMouseX;
            const deltaY = event.clientY - lookAroundData.prevMouseY;

            let pitch = lookAroundData.pitch - deltaY * 0.002;
            pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // Clamp pitch

            setLookAroundData({
                prevMouseX: event.clientX,
                prevMouseY: event.clientY,
                yaw: lookAroundData.yaw - deltaX * 0.002,
                pitch
            });

            camera.rotation.set(lookAroundData.pitch, lookAroundData.yaw, 0); // No roll
        }
    });
}
