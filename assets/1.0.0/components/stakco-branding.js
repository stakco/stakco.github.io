/**
 * Stakco Branding Component
 * Displays product branding with title, version, and subtitle
 * Usage: <stakco-branding title="Stakco Azimuth" version="v2.0.0" subtitle="Compass Puzzle"></stakco-branding>
 */

class StakcoBranding extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['title', 'version', 'subtitle', 'hidden'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const title = this.getAttribute('title') || 'Stakco';
        const version = this.getAttribute('version') || '';
        const subtitle = this.getAttribute('subtitle') || '';
        const isHidden = this.hasAttribute('hidden');

        /* html */
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: ${isHidden ? 'none' : 'block'};
                    position: absolute;
                    top: 18px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 100;
                    pointer-events: none;
                }

                :host([hidden]) {
                    display: none;
                }

                .branding {
                    font-size: 14px;
                    text-align: center;
                    font-family: 'Inter', sans-serif;
                    color: var(--primary-color, #F9A744);
                    text-shadow: var(--shadow-glow, 0 2px 8px rgba(249, 167, 68, 0.3));
                    letter-spacing: 1px;
                    font-weight: 500;
                }

                .title-line {
                    display: inline;
                    margin: 0;
                }

                .version {
                    margin-left: 2px;
                    vertical-align: middle;
                }

                .subtitle {
                    margin: 2px 0 0 0;
                }
            </style>

            <div class="branding">
                <p class="title-line">
                    ${title}
                    ${version ? `<span class="version">${version}</span>` : ''}
                </p>
                ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
            </div>
        `;
    }

    // Public methods
    show() {
        this.removeAttribute('hidden');
    }

    hide() {
        this.setAttribute('hidden', '');
    }

    toggle() {
        if (this.hasAttribute('hidden')) {
            this.show();
        } else {
            this.hide();
        }
    }

    updateTitle(title) {
        this.setAttribute('title', title);
    }

    updateVersion(version) {
        this.setAttribute('version', version);
    }

    updateSubtitle(subtitle) {
        this.setAttribute('subtitle', subtitle);
    }
}

customElements.define('stakco-branding', StakcoBranding);

export default StakcoBranding;