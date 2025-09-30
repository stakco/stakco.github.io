/**
 * Stakco Share Button Component
 * A success button that appears after puzzle completion and triggers sharing
 * Usage: <stakco-share-button label="Share Success!"></stakco-share-button>
 */

class StakcoShareButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isVisible = false;
    }

    connectedCallback() {
        this.render();
        this.setupListeners();
    }

    static get observedAttributes() {
        return ['label'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const label = this.getAttribute('label') || 'Share Success!';

        /* html */
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1000;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }

                :host(.show) {
                    opacity: 1;
                    pointer-events: auto;
                }

                button {
                    background: var(--primary-gradient, linear-gradient(135deg, #F9A744 0%, #E8943C 100%));
                    color: white;
                    border: none;
                    padding: 15px 20px;
                    border-radius: 25px;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: var(--shadow-glow, 0 4px 15px rgba(249, 167, 68, 0.4));
                    transition: all 0.3s ease;
                    font-family: 'Inter', sans-serif;
                    outline: none;
                    -webkit-tap-highlight-color: transparent;
                    white-space: nowrap;
                }

                button:hover {
                    box-shadow: 0 10px 25px rgba(249, 167, 68, 0.4);
                    transform: translateY(-2px);
                }

                button:active {
                    transform: translateY(0);
                }

                @media (max-width: 768px) {
                    button {
                        padding: 12px 18px;
                        font-size: 16px;
                    }
                }
            </style>

            <button>${label}</button>
        `;
    }

    setupListeners() {
        const button = this.shadowRoot.querySelector('button');
        button.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('share-clicked', {
                bubbles: true,
                composed: true
            }));
        });
    }

    // Public API methods

    show() {
        this.classList.add('show');
        this.isVisible = true;
    }

    hide() {
        this.classList.remove('show');
        this.isVisible = false;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    setLabel(label) {
        this.setAttribute('label', label);
    }
}

customElements.define('stakco-share-button', StakcoShareButton);

export default StakcoShareButton;