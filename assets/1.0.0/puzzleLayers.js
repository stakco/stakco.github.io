// puzzleLayers.js
import { applyRotationToElement } from './rotation.js';

export let puzzleSolved = false;
export let puzzleLayers = {};
export let currentLayer = 1;

export function initializePuzzleLayers(totalLayers) {
    puzzleLayers = {};
    for (let i = 1; i <= totalLayers; i++) {
        puzzleLayers[`layer${i}`] = { rotation: Math.floor(Math.random() * 360) };
    }
}

export function applyInitialRotations() {
    Object.entries(puzzleLayers).forEach(([layerKey, data]) => {
        const layerElement = document.getElementById(layerKey);
        if (layerElement) applyRotationToElement(layerElement, data.rotation);
    });
}

export function applyRotation(deltaAngle) {
    if (puzzleSolved) return;
    const layerKey = `layer${currentLayer}`;
    puzzleLayers[layerKey].rotation += deltaAngle;

    const layerElement = document.getElementById(layerKey);
    if (layerElement) applyRotationToElement(layerElement, puzzleLayers[layerKey].rotation);

    checkSolution();
}

export function switchLayer(layerNumber) {
    if (puzzleSolved || layerNumber === currentLayer) return;

    document.querySelectorAll('.puzzle-layer, .layer-button').forEach(el => el.classList.remove('active'));

    const targetLayer = document.getElementById(`layer${layerNumber}`);
    const targetButton = document.querySelector(`[data-layer="${layerNumber}"]`);
    if (targetLayer) targetLayer.classList.add('active');
    if (targetButton) targetButton.classList.add('active');

    currentLayer = layerNumber;
}

export function checkSolution(tolerance = 1) {
    if (puzzleSolved) return;

    const rotations = Object.values(puzzleLayers).map(layer => ((layer.rotation % 360) + 360) % 360);
    const allAligned = rotations.every(rotation => Math.abs(rotation - rotations[0]) <= tolerance);

    if (allAligned) solvePuzzle();
}

export function solvePuzzle() {
    puzzleSolved = true;
    console.log('Puzzle solved!');

    // Animate layers to 0
    Object.keys(puzzleLayers).forEach(layerKey => {
        const layerElement = document.getElementById(layerKey);
        if (!layerElement) return;

        let currentRotation = puzzleLayers[layerKey].rotation || 0;
        if (currentRotation > 0) currentRotation -= 360;
        puzzleLayers[layerKey].rotation = currentRotation;
        applyRotationToElement(layerElement, currentRotation);

        requestAnimationFrame(() => {
            layerElement.style.transition = 'transform 4000ms ease-out';
            applyRotationToElement(layerElement, 0);
        });
        puzzleLayers[layerKey].rotation = 0;
    });
}
