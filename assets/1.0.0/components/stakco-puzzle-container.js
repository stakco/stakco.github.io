/**
 * Stakco Puzzle Container Component
 * Manages puzzle layers, rotations, and animations with Background and Top layer support
 * Usage: <stakco-puzzle-container layers="3" user-id="..." puzzle-id="..." highlight-all="true"></stakco-puzzle-container>
 */

import { StakcoUtils } from './stakco-utils.js';

class StakcoPuzzleContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // State
        this.currentLayer = 1;
        this.puzzleLayers = {};
        this.backgroundLayer = { rotation: 0, url: null, customImage: null };
        this.topLayer = { rotation: 0, url: null, customImage: null };
        this.isSolved = false;
        
        // Bind resize handler
        this._handleResize = this._handleResize.bind(this);
    }

    connectedCallback() {
        this.render();
        this.initialize();
        
        // Listen for resize to update label positions
        window.addEventListener('resize', this._handleResize);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this._handleResize);
    }

    static get observedAttributes() {
        return ['layers', 'user-id', 'puzzle-id', 'puzzle-type', 'tolerance', 'highlight-all'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.shadowRoot.innerHTML) {
            if (name === 'highlight-all') {
                this.updateHighlighting();
            } else {
                this.initialize();
            }
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
                    width: min(90vmin, calc(100vw - 20px), calc(100vh - 200px));
                    height: min(90vmin, calc(100vw - 20px), calc(100vh - 200px));
                    aspect-ratio: 1 / 1;
                }

                .container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Background layer - lowest z-index */
                .background-layer {
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
                    z-index: 1;
                }

                /* Regular puzzle layers - medium z-index */
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
                    z-index: 10;
                }

                /* Top layer - highest z-index */
                .top-layer {
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
                    z-index: 100;
                }

                .puzzle-layer.solving {
                    transition: transform 4s ease-out;
                }

                .puzzle-layer.active {
                    opacity: 1;
                }

                /* Stacking order for multiple puzzle layers */
                #layer1 { z-index: 10; }
                #layer2 { z-index: 20; }
                #layer3 { z-index: 30; }
                #layer4 { z-index: 40; }
                #layer5 { z-index: 50; }

                /* Layer labels - positioned at edge with random offsets */
                .layer-label {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-left: -10px;
                    margin-top: -10px;
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
                    transition: background 0.3s, color 0.3s, box-shadow 0.3s;
                    transform-origin: center center;
                }

                /* Default: Only active layer is highlighted */
                .puzzle-layer.active .layer-label {
                    background: var(--primary-gradient);
                    border-color: var(--primary-color);
                    color: white;
                    box-shadow: var(--shadow-glow);
                    animation: labelPulse 2s ease-in-out infinite;
                }

                /* When highlight-all is true: All layers are highlighted */
                :host([highlight-all="true"]) .layer-label {
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

                /* Slot for overlay content (like clock face) */
                ::slotted(*) {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
            </style>

            <div class="container">
                <!-- Background Layer (B) - z-index: 1 -->
                <div id="background-layer" class="background-layer"></div>
                
                <!-- Puzzle Layers (rotating) - z-index: 10-50 -->
                ${Array.from({ length: layers }, (_, i) => `
                    <div id="layer${i + 1}" class="puzzle-layer ${i === 0 ? 'active' : ''}">
                        <div class="layer-label">${i + 1}</div>
                    </div>
                `).join('')}
                
                <!-- Top Layer (T) - z-index: 100 -->
                <div id="top-layer" class="top-layer"></div>
                
                <slot name="overlay"></slot>
            </div>
        `;
    }

    async initialize() {
        const userId = this.getAttribute('user-id');
        const puzzleId = this.getAttribute('puzzle-id');
        const puzzleType = this.getAttribute('puzzle-type') || 'play';
        const layers = parseInt(this.getAttribute('layers')) || 3;

        if (!userId || !puzzleId) {
            console.error('StakcoPuzzleContainer: user-id and puzzle-id are required');
            return;
        }

        // Initialize puzzle layers with random label offsets
        this.puzzleLayers = {};
        const labelOffsets = this._generateLabelOffsets(layers);
        
        for (let i = 1; i <= layers; i++) {
            this.puzzleLayers[`layer${i}`] = {
                rotation: StakcoUtils.randomRotation(),
                url: null,
                customImage: null,
                labelOffset: labelOffsets[i - 1]
            };
        }

        // Load images
        await this.loadPuzzleImages(userId, puzzleId, puzzleType, layers);

        // Apply initial rotations (this also positions labels)
        this.applyInitialRotations();

        // Dispatch ready event
        this.dispatchEvent(new CustomEvent('puzzle-ready', {
            detail: { 
                layers: this.puzzleLayers,
                background: this.backgroundLayer,
                top: this.topLayer
            }
        }));
    }

    /**
     * Generate random label offsets ensuring minimum separation between labels
     */
    _generateLabelOffsets(layerCount) {
        const offsets = [];
        const minSeparation = 60; // Minimum 60 degrees apart
        
        for (let i = 0; i < layerCount; i++) {
            let offset;
            let attempts = 0;
            
            do {
                offset = Math.floor(Math.random() * 360);
                attempts++;
            } while (
                attempts < 50 && 
                offsets.some(existing => {
                    const diff = Math.abs(offset - existing);
                    const wrappedDiff = Math.min(diff, 360 - diff);
                    return wrappedDiff < minSeparation;
                })
            );
            
            offsets.push(offset);
        }
        
        return offsets;
    }

    /**
     * Get the edge distance for label positioning (uses smaller dimension for circular path)
     */
    _getEdgeDistance() {
        const container = this.shadowRoot.querySelector('.container');
        if (!container) return 100; // fallback
        
        const rect = container.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        return (size / 2) - 20; // 20px inset from edge
    }

    /**
     * Update a single layer's label position based on rotation
     */
    _updateLabelPosition(layerNumber) {
        const layerKey = `layer${layerNumber}`;
        const layerData = this.puzzleLayers[layerKey];
        if (!layerData) return;

        const element = this.shadowRoot.getElementById(layerKey);
        if (!element) return;

        const label = element.querySelector('.layer-label');
        if (!label) return;

        const labelOffset = layerData.labelOffset || 0;
        const rotation = layerData.rotation || 0;
        const edgeDistance = this._getEdgeDistance();

        // Position label at edge using rotate + translateY
        // Counter-rotate by (labelOffset + rotation) to keep text upright
        label.style.transform = `
            rotate(${labelOffset}deg)
            translateY(${-edgeDistance}px)
            rotate(${-labelOffset - rotation}deg)
        `;
    }

    /**
     * Update all label positions (called on resize)
     */
    _updateAllLabelPositions() {
        const layers = parseInt(this.getAttribute('layers')) || 3;
        for (let i = 1; i <= layers; i++) {
            this._updateLabelPosition(i);
        }
    }

    /**
     * Handle window resize
     */
    _handleResize() {
        this._updateAllLabelPositions();
    }

    async loadPuzzleImages(userId, puzzleId, puzzleType, layers) {
        const images = StakcoUtils.loadPuzzleImages(userId, puzzleId, puzzleType, layers);
        
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
        Object.keys(this.puzzleLayers).forEach((layerKey, index) => {
            const layerNumber = index + 1;
            const element = this.shadowRoot.getElementById(layerKey);
            const rotation = this.puzzleLayers[layerKey].rotation;
            
            if (element) {
                element.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            }
            
            // Position the label
            this._updateLabelPosition(layerNumber);
        });
    }

    updateHighlighting() {
        this.dispatchEvent(new CustomEvent('highlight-changed', {
            detail: { highlightAll: this.getHighlightAll() }
        }));
    }

    // Public API methods for Background and Top layers

    setBackgroundImage(imageUrl) {
        this.backgroundLayer.customImage = imageUrl;
        const element = this.shadowRoot.getElementById('background-layer');
        if (element) {
            element.style.backgroundImage = `url('${imageUrl}')`;
        }
        this.dispatchEvent(new CustomEvent('background-updated', {
            detail: { imageUrl }
        }));
    }

    setTopImage(imageUrl) {
        this.topLayer.customImage = imageUrl;
        const element = this.shadowRoot.getElementById('top-layer');
        if (element) {
            element.style.backgroundImage = `url('${imageUrl}')`;
        }
        this.dispatchEvent(new CustomEvent('top-updated', {
            detail: { imageUrl }
        }));
    }

    setLayerImage(layerNumber, imageUrl) {
        const layerKey = `layer${layerNumber}`;
        if (!this.puzzleLayers[layerKey]) return;

        this.puzzleLayers[layerKey].customImage = imageUrl;
        const element = this.shadowRoot.getElementById(layerKey);
        if (element) {
            element.style.backgroundImage = `url('${imageUrl}')`;
        }
        
        this.dispatchEvent(new CustomEvent('layer-image-updated', {
            detail: { layer: layerNumber, imageUrl }
        }));
    }

    // Existing public API methods

    switchLayer(layerNumber) {
        if (this.isSolved) return;

        this.shadowRoot.querySelectorAll('.puzzle-layer').forEach(layer => {
            layer.classList.remove('active');
        });
        
        const targetLayer = this.shadowRoot.getElementById(`layer${layerNumber}`);
        if (targetLayer) {
            targetLayer.classList.add('active');
        }

        this.currentLayer = layerNumber;

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

        const element = this.shadowRoot.getElementById(layerKey);
        if (element) {
            element.style.transform = `translate(-50%, -50%) rotate(${this.puzzleLayers[layerKey].rotation}deg)`;
        }

        // Update label position
        this._updateLabelPosition(this.currentLayer);

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

        const element = this.shadowRoot.getElementById(layerKey);
        if (element) {
            element.style.transform = `translate(-50%, -50%) rotate(${this.puzzleLayers[layerKey].rotation}deg)`;
        }

        // Update label position
        this._updateLabelPosition(layerNumber);
    }

    setLayerRotation(layerNumber, angle) {
        const layerKey = `layer${layerNumber}`;
        if (!this.puzzleLayers[layerKey]) return;

        this.puzzleLayers[layerKey].rotation = angle;

        const element = this.shadowRoot.getElementById(layerKey);
        if (element) {
            element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        }

        // Update label position
        this._updateLabelPosition(layerNumber);
    }

    checkAlignment() {
        if (this.isSolved) return false;

        const tolerance = parseFloat(this.getAttribute('tolerance')) || 2;
        const rotations = Object.values(this.puzzleLayers).map(layer => layer.rotation);

        const aligned = StakcoUtils.rotationsAligned(rotations, tolerance);

        if (aligned) {
            this.isSolved = true;
            this.animateToSolution();
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
        // PHASE 1: Align all layers to a common rotation first
        const layerKeys = Object.keys(this.puzzleLayers);
        const referenceRotation = this.puzzleLayers[layerKeys[0]].rotation;

        layerKeys.forEach((layerKey, index) => {
            const layerNumber = index + 1;
            const element = this.shadowRoot.getElementById(layerKey);
            if (element) {
                element.classList.add('aligning');
                element.style.transition = 'transform 0.4s ease-out';
                element.style.transform = `translate(-50%, -50%) rotate(${referenceRotation}deg)`;
                this.puzzleLayers[layerKey].rotation = referenceRotation;
                this._updateLabelPosition(layerNumber);
            }
        });

        // Wait 0.5s after alignment finishes
        setTimeout(() => {
            // PHASE 2: Now rotate all to zero
            layerKeys.forEach((layerKey, index) => {
                const layerNumber = index + 1;
                const element = this.shadowRoot.getElementById(layerKey);
                if (element) {
                    element.classList.remove('aligning');
                    element.classList.add('solving');
                    element.style.transition = `transform ${duration}ms ease-in-out`;
                    element.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                    this.puzzleLayers[layerKey].rotation = 0;
                    this._updateLabelPosition(layerNumber);
                }
            });

            // Complete after full duration
            setTimeout(() => {
                this.dispatchEvent(new CustomEvent('animation-complete'));
            }, duration);
        }, 400 + 500); // 0.4s align + 0.5s wait
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

    getHighlightAll() {
        return this.getAttribute('highlight-all') === 'true';
    }

    setHighlightAll(value) {
        this.setAttribute('highlight-all', value.toString());
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