interface MovementFlags {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
}

export const movementFlags: MovementFlags = {
    forward: false,
    backward: false,
    left: false,
    right: false,
};

export function setMovementFlags(flags: Partial<MovementFlags>) {
    for (const prop in flags) {
        (movementFlags as any)[prop] = flags[prop as keyof MovementFlags];
    }
}

interface LookAroundData {
    isMouseDown: boolean;
    yaw: number;
    pitch: number;
    prevMouseX: number;
    prevMouseY: number;
}

export const lookAroundData: LookAroundData = {
    isMouseDown: false,
    yaw: 0,
    pitch: 0,
    prevMouseX: 0,
    prevMouseY: 0,
};

export function setLookAroundData(data: Partial<LookAroundData>) {
    for (const prop in data) {
        (lookAroundData as any)[prop] = data[prop as keyof LookAroundData];
    }
}
