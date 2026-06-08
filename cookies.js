// cookies.js – Bannière RGPD Aux Folie's Burger
(function() {
  const STORAGE_KEY = 'folies_cookies_consent';

  // Si déjà accepté/refusé, ne pas afficher
  if (localStorage.getItem(STORAGE_KEY)) return;

  const style = document.createElement('style');
  style.textContent = `
    #cookie-banner {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999;
      background: #13130d;
      border-top: 2px solid rgba(201,168,76,0.4);
      padding: 20px 28px;
      display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
      box-shadow: 0 -8px 32px rgba(0,0,0,0.6);
      animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
    }
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    #cookie-banner .cb-text {
      flex: 1; min-width: 260px;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 0.95rem; font-style: italic;
      color: #a09070; line-height: 1.5;
    }
    #cookie-banner .cb-text strong {
      font-family: 'Cinzel', serif; font-size: 0.75rem;
      letter-spacing: 2px; text-transform: uppercase;
      color: #c9a84c; font-style: normal; display: block; margin-bottom: 5px;
    }
    #cookie-banner .cb-text a {
      color: #c9a84c; text-decoration: underline; font-style: normal;
    }
    #cookie-banner .cb-btns {
      display: flex; gap: 10px; flex-shrink: 0; flex-wrap: wrap;
    }
    #cookie-accept {
      font-family: 'Cinzel', serif; font-size: 0.65rem; font-weight: 700;
      letter-spacing: 2px; text-transform: uppercase;
      background: linear-gradient(135deg, #7a5c18, #c9a84c, #f0d080, #c9a84c, #7a5c18);
      background-size: 200% 100%; background-position: right;
      color: #0a0a08; padding: 10px 22px; border: none;
      border-radius: 2px; cursor: pointer;
      transition: background-position 0.4s;
    }
    #cookie-accept:hover { background-position: left; }
    #cookie-refuse {
      font-family: 'Cinzel', serif; font-size: 0.65rem;
      letter-spacing: 2px; text-transform: uppercase;
      background: transparent; color: #6a5a3a;
      padding: 9px 18px; border: 1px solid rgba(201,168,76,0.2);
      border-radius: 2px; cursor: pointer;
      transition: all 0.3s;
    }
    #cookie-refuse:hover { border-color: #c9a84c; color: #c9a84c; }
  `;
  document.head.appendChild(style);

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML = `
    <div class="cb-text">
      <strong>🍪 Cookies & Confidentialité</strong>
      Ce site utilise des cookies techniques nécessaires à l'authentification et au programme de fidélité Folie's+.
      Aucun cookie publicitaire. <a href="legales.html">En savoir plus</a>
    </div>
    <div class="cb-btns">
      <button id="cookie-accept">Accepter</button>
      <button id="cookie-refuse">Continuer sans accepter</button>
    </div>
  `;
  document.body.appendChild(banner);

  function dismiss(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    banner.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    banner.style.transform  = 'translateY(100%)';
    banner.style.opacity    = '0';
    setTimeout(() => banner.remove(), 350);
  }

  document.getElementById('cookie-accept').onclick  = () => dismiss('accepted');
  document.getElementById('cookie-refuse').onclick  = () => dismiss('refused');
})();
