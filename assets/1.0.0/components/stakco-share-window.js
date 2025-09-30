class StakcoShareWindow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
  }

  connectedCallback() {
    this.render();
    this.setupKeyboardHandler();
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.keyHandler);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: var(--text-primary);
          z-index: 10000;
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          box-sizing: border-box;
        }
        :host(.show) {
          display: flex;
        }
        .container {
          position: relative;
          width: 400px;
          height: 400px;
          max-width: 80vw;
          max-height: 60vh;
          margin-bottom: 30px;
        }
        .text {
          background: var(--glass-bg);
          border: 2px solid var(--primary-color);
          border-radius: 20px;
          padding: 20px 30px;
          color: var(--primary-color);
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 600;
          text-align: center;
          backdrop-filter: blur(10px);
          margin-bottom: 30px;
          box-shadow: var(--shadow-glow);
        }
        ::slotted(.share-layer) {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
      </style>
      <div class="container" part="container">
        <slot name="layers"></slot>
      </div>
      <div class="text" part="text">
        <slot name="text"></slot>
      </div>
    `;
  }

  setupKeyboardHandler() {
    this.keyHandler = (e) => {
      if (this.isOpen && e.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  }

  async open(layerImages, message, autoShare = false) {
    this.isOpen = true;
    this.classList.add('show');
    
    this.populateContent(layerImages, message);
    
    if (autoShare) {
      setTimeout(async () => {
        await this.captureAndShare();
      }, 300);
    }
    
    this.dispatchEvent(new CustomEvent('open'));
  }

  close() {
    this.isOpen = false;
    this.classList.remove('show');
    this.dispatchEvent(new CustomEvent('close'));
  }

  populateContent(layerImages, message) {
    // Clear existing content
    const container = this.shadowRoot.querySelector('.container');
    container.innerHTML = '';
    
    // Add layers
    layerImages.forEach((imageUrl, index) => {
      const layerDiv = document.createElement('div');
      layerDiv.className = 'share-layer';
      layerDiv.style.backgroundImage = `url('${imageUrl}')`;
      layerDiv.style.transform = 'translate(-50%, -50%) rotate(0deg)';
      layerDiv.slot = 'layers';
      this.appendChild(layerDiv);
    });
    
    // Set message
    const textSlot = this.querySelector('[slot="text"]');
    if (textSlot) {
      textSlot.textContent = message;
    } else {
      const textElement = document.createElement('div');
      textElement.slot = 'text';
      textElement.textContent = message;
      this.appendChild(textElement);
    }
  }

  async captureAndShare() {
    try {
      const screenshotBlob = await this.captureScreenshot();
      await this.share(screenshotBlob);
    } catch (error) {
      console.error('Error in auto-share:', error);
      await this.shareTextOnly();
    } finally {
      this.close();
    }
  }

  async captureScreenshot() {
    if (!window.html2canvas) {
      throw new Error('html2canvas not loaded');
    }
    
    const canvas = await html2canvas(this, {
      backgroundColor: getComputedStyle(document.body).getPropertyValue('--text-primary') || '#000000',
      scale: 2,
      useCORS: true,
      allowTaint: false
    });
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 0.9);
    });
  }

  async share(screenshotBlob = null) {
    const shareUrl = this.getAttribute('share-url') || window.location.href;
    const textSlot = this.querySelector('[slot="text"]');
    const message = textSlot ? textSlot.textContent : 'Check out my puzzle!';
    
    const shareData = {
      title: this.getAttribute('title') || 'Stakco',
      text: message,
      url: shareUrl
    };
    
    if (screenshotBlob) {
      const filename = this.getAttribute('filename') || 'stakco-puzzle.png';
      shareData.files = [new File([screenshotBlob], filename, { type: 'image/png' })];
    }
    
    // Try native share with screenshot
    if (screenshotBlob && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        console.log('Native share failed, trying clipboard:', error);
      }
    }
    
    // Try clipboard with image
    if (screenshotBlob && navigator.clipboard && navigator.clipboard.write) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': screenshotBlob,
            'text/plain': new Blob([`${shareData.text} ${shareData.url}`], { type: 'text/plain' })
          })
        ]);
        alert('Screenshot and text copied to clipboard!');
        return;
      } catch (error) {
        console.log('Clipboard failed, falling back to text:', error);
      }
    }
    
    // Fallback to text-only share
    await this.shareTextOnly(shareData);
  }

  async shareTextOnly(shareData = null) {
    if (!shareData) {
      const shareUrl = this.getAttribute('share-url') || window.location.href;
      const textSlot = this.querySelector('[slot="text"]');
      const message = textSlot ? textSlot.textContent : 'Check out my puzzle!';
      
      shareData = {
        title: this.getAttribute('title') || 'Stakco',
        text: message,
        url: shareUrl
      };
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url
        });
        return;
      } catch (error) {
        console.log('Text share failed:', error);
      }
    }
    
    // Final fallback: copy to clipboard
    const textArea = document.createElement('textarea');
    textArea.value = `${shareData.text} ${shareData.url}`;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert(`Copied to clipboard: ${shareData.text} ${shareData.url}`);
  }
}

customElements.define('stakco-share-window', StakcoShareWindow);