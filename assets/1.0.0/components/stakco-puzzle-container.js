/**
 * Stakco Puzzle Container Component
 * Manages puzzle layers, rotations, and animations
 * Usage: <stakco-puzzle-container layers="3" user-id="..." puzzle-id="..."></stakco-puzzle-container>
 */

import { StakcoUtils } from './stakco-utils.js';

class StakcoPuzzleContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // State
        this.currentLayer = 1;
        this.puzzleLayers = {};
        this.isSolved = false;
    }

    connectedCallback() {
        this.render();
        this.initialize();
    }

    static get observedAttributes() {
        return ['layers', 'user-id', 'puzzle-id', 'tolerance'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.shadowRoot.innerHTML) {
            this.initialize();
        }
    }

    render() {
        const layers = parseInt(this.getAttribute('layers')) || 3;
        
        /* html */
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    width: 90vmin;
                    height: 90vmin;
                    max-width: calc(100vw - 20px);
                    max-height: calc(100vh - 200px);
                }

                .container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .puzzle-layer {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    height: 100%;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    pointer-events: none;
                    transition: transform 0s;
                }

                .puzzle-layer.solving {
                    transition: transform 4s ease-out;
                }

                .puzzle-layer.active {
                    opacity: 1;
                }

                .layer-label {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--glass-bg);
                    color: var(--text-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', sans-serif;
                    font-size: 14px;
                    font-weight: 600;
                    box-shadow: var(--shadow-soft);
                    pointer-events: none;
                    z-index: 50000;
                }

                .puzzle-layer.active .layer-label {
                    background: var(--primary-gradient);
                    border-color: var(--primary-color);
                    color: white;
                    box-shadow: var(--shadow-glow);
                    animation: labelPulse 2s ease-in-out infinite;
                }

                @keyframes labelPulse {
                    0%, 100% {
                        background: var(--glass-bg);
                        color: var(--text-secondary);
                        box-shadow: var(--shadow-soft);
                    }
                    50% {
                        background: var(--primary-gradient);
                        color: white;
                        box-shadow: var(--shadow-glow);
                    }
                }
            </style>

            <div class="container">
                ${Array.from({ length: layers }, (_, i) => `
                    <div id="layer${i + 1}" class="puzzle-layer ${i === 0 ? 'active' : ''}">
                        <div class="layer-label">${i + 1}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async initialize() {
        const userId = this.getAttribute('user-id');
        const puzzleId = this.getAttribute('puzzle-id');
        const layers = parseInt(this.getAttribute('layers')) || 3;

        if (!userId || !puzzleId) {
            console.error('StakcoPuzzleContainer: user-id and puzzle-id are required');
            return;
        }

        // Initialize puzzle layers
        this.puzzleLayers = {};
        for (let i = 1; i <= layers; i++) {
            this.puzzleLayers[`layer${i}`] = {
                rotation: StakcoUtils.randomRotation(),
                url: null
            };
        }

        // Load images
        await this.loadPuzzleImages(userId, puzzleId);

        // Apply initial rotations
        this.applyInitialRotations();

        // Dispatch ready event
        this.dispatchEvent(new CustomEvent('puzzle-ready', {
            detail: { layers: this.puzzleLayers }
        }));
    }

    async loadPuzzleImages(userId, puzzleId) {
        const images = StakcoUtils.loadPuzzleImages(userId, puzzleId);
        
        Object.keys(this.puzzleLayers).forEach((layerKey, index) => {
            const url = images[layerKey];
            this.puzzleLayers[layerKey].url = url;
            
            const element = this.shadowRoot.getElementById(layerKey);
            if (element) {
                element.style.backgroundImage = `url('${url}')`;
            }
        });

        console.log('Puzzle images loaded');
    }

    applyInitialRotations() {
        Object.keys(this.puzzleLayers).forEach(layerKey => {
            const element = this.shadowRoot.getElementById(layerKey);
            const rotation = this.puzzleLayers[layerKey].rotation;
            if (element) {
                element.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            }
        });
    }

    // Public API methods

    switchLayer(layerNumber) {
        if (this.isSolved) return;

        // Update visual state
        this.shadowRoot.querySelectorAll('.puzzle-layer').forEach(layer => {
            layer.classList.remove('active');
        });
        
        const targetLayer = this.shadowRoot.getElementById(`layer${layerNumber}`);
        if (targetLayer) {
            targetLayer.classList.add('active');
        }

        this.currentLayer = layerNumber;

        // Dispatch event
        this.dispatchEvent(new CustomEvent('layer-switched', {
            detail: { 
                layer: layerNumber,
                rotation: this.puzzleLayers[`layer${layerNumber}`].rotation
            }
        }));
    }

    rotateCurrentLayer(delta) {
        if (this.isSolved) return;

        const layerKey = `layer${this.currentLayer}`;
        this.puzzleLayers[layerKey].rotation += delta;

        // Update display
        const element = this.shadowRoot.getElementById(layerKey);
        if (element) {
            element.style.transform = `translate(-50%, -50%) rotate(${this.puzzleLayers[layerKey].rotation}deg)`;
        }

        // Dispatch event
        this.dispatchEvent(new CustomEvent('layer-rotated', {
            detail: { 
                layer: this.currentLayer,
                rotation: this.puzzleLayers[layerKey].rotation,
                delta: delta
            }
        }));
    }

    rotateLayer(layerNumber, delta) {
        if (this.isSolved) return;

        const layerKey = `layer${layerNumber}`;
        if (!this.puzzleLayers[layerKey]) return;

        this.puzzleLayers[layerKey].rotation += delta;

        // Update display
        const element = this.shadowRoot.getElementById(layerKey);
        if (element) {
            element.style.transform = `translate(-50%, -50%) rotate(${this.puzzleLayers[layerKey].rotation}deg)`;
        }
    }

    checkAlignment() {
        if (this.isSolved) return false;

        const tolerance = parseFloat(this.getAttribute('tolerance')) || 2;
        const rotations = Object.values(this.puzzleLayers).map(layer => layer.rotation);

        const aligned = StakcoUtils.rotationsAligned(rotations, tolerance);

        if (aligned) {
            this.isSolved = true;
            this.dispatchEvent(new CustomEvent('puzzle-solved', {
                detail: { 
                    rotations: this.puzzleLayers,
                    layers: Object.values(this.puzzleLayers).map(l => l.url)
                }
            }));
        }

        return aligned;
    }

    animateToSolution(duration = 4000) {
        Object.keys(this.puzzleLayers).forEach(layerKey => {
            const element = this.shadowRoot.getElementById(layerKey);
            if (element) {
                element.classList.add('solving');
                element.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                this.puzzleLayers[layerKey].rotation = 0;
            }
        });

        // Dispatch event when animation completes
        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('animation-complete'));
        }, duration);
    }

    getCurrentLayer() {
        return this.currentLayer;
    }

    getCurrentRotation() {
        return this.puzzleLayers[`layer${this.currentLayer}`].rotation;
    }

    getAllRotations() {
        return Object.keys(this.puzzleLayers).reduce((acc, key) => {
            acc[key] = this.puzzleLayers[key].rotation;
            return acc;
        }, {});
    }

    getLayerImages() {
        return Object.values(this.puzzleLayers).map(layer => layer.url);
    }

    reset() {
        this.isSolved = false;
        this.currentLayer = 1;
        this.initialize();
    }

    setSolved(value) {
        this.isSolved = value;
    }
}

customElements.define('stakco-puzzle-container', StakcoPuzzleContainer);

export default StakcoPuzzleContainer;