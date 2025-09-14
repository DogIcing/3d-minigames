import * as THREE from 'three';
import { buildingBoxes } from '../../shared';
import { experienceListeners } from '../../experience';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { generate } from 'random-words';
import { BOARD_DEPTH, CHANCES, GUTTER, LETTER_DEPTH, LETTER_SIZE, PADDING, UNGUESSED_INSET, WORD_LENGTH, WORDLE_COLORS } from './constants';
import type { LetterMeshData } from './types';
import { clickEvents } from '../../events/click';
import { homeScene, registerHomeMesh } from '../../home';

export function initWordle() {
    // Wordle building
    const buildingGeometry = new THREE.BoxGeometry(10, 10, 10);
    const buildingMaterials = [
        new THREE.MeshBasicMaterial({ color: 0x888888 }), // right
        new THREE.MeshBasicMaterial({ color: 0x888888 }), // left
        new THREE.MeshBasicMaterial({ color: 0x888888 }), // top
        new THREE.MeshBasicMaterial({ color: 0x888888 }), // bottom
        new THREE.MeshBasicMaterial({ color: 0xe6cc00 }), // front / facing user
        new THREE.MeshBasicMaterial({ color: 0x888888 })  // back
    ];
    const building = new THREE.Mesh(buildingGeometry, buildingMaterials);
    building.position.set(0, 5, -20);
    registerHomeMesh(building);

    // Boundary for building
    const buildingBox = new THREE.Box3().setFromObject(building);
    buildingBoxes.push(buildingBox);

    // Enter building
    experienceListeners.push({
        x: building.position.x,
        z: building.position.z + 5,
        name: 'Wordle',
        scene: buildWordleScene(),
        canMove: true,
        on: [homeScene],
        playerPosition: { x: 0, z: 0 }
    });
}

function buildWordleScene() {
    // Init scene
    const scene = new THREE.Scene();

    // Calculate locations / dimensions
    const BOARD_DIMENSIONS = {
        width: PADDING * 2 + WORD_LENGTH * LETTER_SIZE + GUTTER * (WORD_LENGTH - 1),
        height: PADDING * 2 + CHANCES * LETTER_SIZE + GUTTER * (CHANCES - 1),
        depth: BOARD_DEPTH
    };
    const BOARD_POS = {
        x: 0,
        y: BOARD_DIMENSIONS.height / 2,
        z: -20
    };
    const BUTTON_STAND_DIMENSIONS = {
        width: 1,
        height: 2,
        depth: 1
    };
    const BUTTON_STAND_POSITION = {
        x: BOARD_POS.x,
        y: BUTTON_STAND_DIMENSIONS.height / 2,
        z: BOARD_POS.z + BOARD_DIMENSIONS.depth / 2 + BUTTON_STAND_DIMENSIONS.depth / 2 + 5
    };
    const BUTTON_DIMENSIONS = {
        width: BUTTON_STAND_DIMENSIONS.width - 0.2,
        height: 0.2,
        depth: BUTTON_STAND_DIMENSIONS.depth - 0.2
    };
    const BUTTON_POSITION = {
        x: BUTTON_STAND_POSITION.x,
        y: BUTTON_STAND_POSITION.y + BUTTON_STAND_DIMENSIONS.height / 2 + BUTTON_DIMENSIONS.height / 2,
        z: BUTTON_STAND_POSITION.z
    };

    // Generate random word
    const wordleWord = (generate({ minLength: WORD_LENGTH, maxLength: WORD_LENGTH }) as string).toLowerCase().split('');

    // Board mesh
    const board = new THREE.Mesh(
        new THREE.BoxGeometry(
            BOARD_DIMENSIONS.width,
            BOARD_DIMENSIONS.height,
            BOARD_DIMENSIONS.depth
        ), new THREE.MeshBasicMaterial({
            color: 0x666666
        })
    );
    board.position.set(BOARD_POS.x, BOARD_POS.y, BOARD_POS.z);
    scene.add(board);

    // Letter boxes
    let letterMeshes: LetterMeshData[][] = new Array(CHANCES).fill(null).map(_ =>
        new Array(WORD_LENGTH).fill({
            letter: null,
            mesh: null
        })
    );

    for (let row = 0; row < CHANCES; row++) {
        for (let col = 0; col < WORD_LENGTH; col++) {
            const letter = new THREE.Mesh(
                new THREE.BoxGeometry(
                    LETTER_SIZE,
                    LETTER_SIZE,
                    LETTER_DEPTH
                ), new THREE.MeshBasicMaterial({
                    color: 0xd4d4d4
                })
            );

            const boardFaceZ = BOARD_POS.z + BOARD_DIMENSIONS.depth / 2;
            const boardLeft = BOARD_POS.x - BOARD_DIMENSIONS.width / 2;
            const boardBottom = BOARD_POS.y - BOARD_DIMENSIONS.height / 2;

            letter.position.set(
                boardLeft + PADDING + (GUTTER + LETTER_SIZE) * col + LETTER_SIZE / 2,
                boardBottom + PADDING + (GUTTER + LETTER_SIZE) * row + LETTER_SIZE / 2,
                boardFaceZ + LETTER_DEPTH / 2 - UNGUESSED_INSET
            );
            scene.add(letter);

            letterMeshes[row][col] = {
                letter: null,
                mesh: letter
            };
        }
    }

    // Button stand
    const buttonStand = new THREE.Mesh(
        new THREE.BoxGeometry(
            BUTTON_STAND_DIMENSIONS.width,
            BUTTON_STAND_DIMENSIONS.height,
            BUTTON_STAND_DIMENSIONS.depth
        ), new THREE.MeshBasicMaterial({
            color: 0x888888
        })
    );
    buttonStand.position.set(
        BUTTON_STAND_POSITION.x,
        BUTTON_STAND_POSITION.y,
        BUTTON_STAND_POSITION.z
    );
    scene.add(buttonStand);

    // Button
    const button = new THREE.Mesh(
        new THREE.BoxGeometry(
            BUTTON_DIMENSIONS.width,
            BUTTON_DIMENSIONS.height,
            BUTTON_DIMENSIONS.depth
        ), new THREE.MeshBasicMaterial({
            color: 0xff0000
        })
    );
    button.position.set(
        BUTTON_POSITION.x,
        BUTTON_POSITION.y,
        BUTTON_POSITION.z
    );
    scene.add(button);

    // Register button click event & logic
    clickEvents.push({
        object: button,
        handler: (obj) => {
            obj.position.y = BUTTON_POSITION.y - 0.1;
        },
        reset: (obj) => {
            // Reset position
            obj.position.y = BUTTON_POSITION.y;

            // Prompt for word
            const input = window.prompt('Enter a 5-letter word:');
            if (!input || !input.length) return;
            if (input.length !== WORD_LENGTH) return alert('Please enter a 5 letter word');
            const guessedWord = input.toLowerCase();

            // Validate word
            const req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    // No definitions = invalid word
                    if (!JSON.parse(req.responseText)?.en?.length) return alert(`The word ${guessedWord} isn't valid`);

                    // Get highest empty row
                    const row = letterMeshes.slice().reverse().find(row =>
                        row.every(col => col.letter === null)
                    );

                    if (!row) return alert("You've lost!\nThere should be something after this, but this is just a POC.");
                    else if (guessedWord === wordleWord.join('')) alert("You've won!\nThere should be something after this, but this is just a POC.");

                    const correctWordCopy: (string | null)[] = [...wordleWord];
                    const guessLetters = guessedWord.split('');
                    const colorMap: (keyof typeof WORDLE_COLORS)[] = Array(guessLetters.length).fill('gray');

                    // Pass 1 - Green
                    for (let i = 0; i < guessLetters.length; i++) {
                        if (guessLetters[i] === correctWordCopy[i]) {
                            colorMap[i] = 'green';
                            correctWordCopy[i] = null;
                        }
                    }

                    // Pass 2  Yellow
                    for (let i = 0; i < guessLetters.length; i++) {
                        if (colorMap[i] === 'gray' && correctWordCopy.includes(guessLetters[i])) {
                            colorMap[i] = 'yellow';
                            correctWordCopy[correctWordCopy.indexOf(guessLetters[i])] = null;
                        }
                    }

                    for (let i = 0; i < WORD_LENGTH; i++) {
                        const letter = row[i];
                        const loader = new FontLoader();

                        loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
                            letter.letter = guessedWord[i];

                            const letterMesh = letter.mesh;
                            letterMesh.position.z += UNGUESSED_INSET;
                            const material = letterMesh.material as THREE.MeshBasicMaterial;
                            material.color.setHex(WORDLE_COLORS[colorMap[i]])

                            const textGeometry = new TextGeometry(guessedWord[i].toUpperCase(), {
                                font: font,
                                size: 0.6,
                                depth: 0.1
                            });
                            const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

                            textMesh.position.set(
                                letter.mesh.position.x - 0.3,
                                letter.mesh.position.y - 0.3,
                                letter.mesh.position.z + 0.3
                            );

                            scene.add(textMesh);
                        });
                    }
                }
            };
            req.open("GET", `https://en.wiktionary.org/api/rest_v1/page/definition/${guessedWord}`, true);
            req.send();
        }
    })

    return scene;
}
