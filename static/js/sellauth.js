class SellAuthEmbed {
    constructor() {
      this.recaptchaSiteKey = '6LdtUw8qAAAAAOciQRvmRxTico0CL2IQmKUf8JyL';
  
      this.injectScripts();
      this.injectStyles();
    }
  
    injectScripts() {
      const recaptchaScript = document.createElement('script');
      recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${this.recaptchaSiteKey}`;
      document.head.appendChild(recaptchaScript);
    }
  
    injectStyles() {
      if (document.getElementById('sellauth-embed-style')) {
        return;
      }
  
      const style = document.createElement('style');
      style.id = 'sellauth-embed-style';
      style.textContent = `
        .grecaptcha-badge {
          visibility: hidden;
        }
  
        .sellauth-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
  
        .sellauth-button[data-checking-out] {
          opacity: 0.5;
          pointer-events: none;
        }
  
        .sellauth-button svg {
          width: 1.25rem;
          height: 1.25rem;
        }
  
        .sellauth-button[data-checking-out] .icon.spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
  
        .sellauth-button[data-checking-out] .icon.cart {
          display: none;
        }
  
        .sellauth-button:not([data-checking-out]) .icon.spinner {
          display: none;
        }
  
        .sellauth-button:not([data-checking-out]) .icon.cart {
          display: inline-block;
        }
  
        #sellauth-modal {
          max-width: 100vw;
          margin: auto;
          padding: 0;
          border: none;
          border-radius: 0.75rem;
          background-color: var(--c-black-blue);
          color: var(--c-white);
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
  
        #sellauth-modal::-webkit-scrollbar {
          display: none;
        }
  
        #sellauth-modal .close {
          position: absolute;
          top: 1.5rem;
          right: 1.125rem;
          padding: 0.25rem;
          border: none;
          outline: none;
          cursor: pointer;
          background: none;
          color: var(--c-light-grey);
        }
  
        #sellauth-modal [role="alertdialog"] {
          padding: 0;
          overflow: hidden;
        }
  
        #sellauth-modal::backdrop {
          background: rgba(24, 24, 38, 0.75);
        }
  
        #sellauth-modal[open] {
          animation: zoom 0.25s ease-out;
        }
  
        #sellauth-modal[open]::backdrop {
          animation: fade 0.25s ease-out;
        }
  
        #sellauth-modal iframe {
          width: 98vw;
          height: 46rem;
          border: none;
        }
  
        @media (min-width: 768px) {
          #sellauth-modal {
            max-width: 32rem;
          }
  
          #sellauth-modal iframe {
            width: 32rem;
            height: 52rem;
          }
        }
  
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
  
        @keyframes zoom {
          from {
            transform: scale(0.75);
          }
          to {
            transform: scale(1);
          }
        }
  
        @keyframes fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `;
    
      (document.head || document.body).appendChild(style);
    }
  
    async generateRecaptchaToken() {
      return new Promise((resolve) => {
        grecaptcha.ready(
          () =>
            void (async () => {
              const token = await grecaptcha.execute(this.recaptchaSiteKey, { action: 'checkout_embed' });
              resolve(token);
            })(),
        );
      });
    }
  
    async checkout(button, { cart, shopId, modal = true, scrollTop = false }) {
      if (this.isCheckingOut) {
        return;
      }
  
      this.isCheckingOut = true;
  
      if (button && button instanceof HTMLElement) {
        button.setAttribute('data-checking-out', '');
      }
  
      try {
        const formData = { cart, shopId };
  
        formData.recaptchaToken = await this.generateRecaptchaToken();
  
        const response = await fetch('https://api-internal.sellauth.com/v1/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        const responseData = await response.json();
  
        if (responseData.error) {
          throw new Error(responseData.error);
        }
  
        if (!responseData.url) {
          throw new Error('No checkout URL returned. Please try again.');
        }
  
        if (modal) {
          this.openModal(responseData.url, scrollTop);
        } else {
          window.open(responseData.url, '_blank');
        }
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
  
      this.isCheckingOut = false;
  
      if (button && button instanceof HTMLElement) {
        button.removeAttribute('data-checking-out');
      }
    }
  
    openModal(url, scrollTop = false) {
      this.closeModal();
  
      const currentScrollY = window.scrollY;
      const modalDiv = document.createElement('div');
  
      modalDiv.innerHTML = `
        <dialog id="sellauth-modal">
          <button onclick="window.sellAuthEmbed.closeModal()" class="close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
          </button>
          <div role="alertdialog">
            <iframe src="${url}" title="SellAuth Embed" referrerpolicy="no-referrer" allow="payment; clipboard-write"></iframe>
          </div>
        </dialog>
      `;
  
      document.body.appendChild(modalDiv);
      document.getElementById('sellauth-modal').showModal();
  
      if (scrollTop) {
        window.scrollTo(0, 0);
      }

      setTimeout(() => {
        window.scrollTo(0, currentScrollY);
      }, 0);
  
      document.body.style.overflow = 'hidden';
    }
  
    closeModal() {
      const modal = document.getElementById('sellauth-modal');
  
      if (modal) {
        modal.remove();
      }
  
      document.body.style.overflow = '';
    }
  }
  
  window.sellAuthEmbed = new SellAuthEmbed();