// chatbot.js – Aux Folie's Burger
// Inclure dans index.html avec : <script src="chatbot.js"></script>

(function() {

  const SYSTEM_PROMPT = `Tu es Jade, l'assistante virtuelle d'Aux Folie's Burger. Tu es chaleureuse, enthousiaste et tu adores les bons burgers. Tu réponds en français, de manière concise et conviviale.

Voici tout ce que tu sais sur le restaurant :

RESTAURANT :
- Nom : Aux Folie's Burger
- Spécialité : Burgers artisanaux faits à la commande avec des produits frais
- Téléphone : 07 82 25 33 09
- Livraison : 18h45 – 21h45

MENU – BURGERS :
- Le Folie's Classic : steak haché artisanal, cheddar fondu, salade, tomate, oignons confits, sauce maison – 9,90 €
- Le Smash Folie's : double smash patty, bacon croustillant, double cheddar, pickles maison, sauce BBQ fumée – 12,50 €
- Le Inferno : steak épicé, jalapeños, sauce piquante, oignons frits, emmental – 11,00 € (épicé 🌶️)
- Le Folie's Chicken : filet de poulet croustillant, salade, tomate, sauce ranch, cheddar – 10,50 €
- Le Hot Chicken : poulet pané épicé, sauce buffalo, coleslaw, pickles – 11,50 €
- Le Royal Folie's : triple smash patty, triple cheddar, bacon, oignons caramélisés, sauce secrète – 15,90 €
- Le Green Folie's : steak végétal, avocat, salade, sauce yaourt citron (végétarien) – 10,00 €
- Le Double Cheese : double steak, double cheddar, moutarde, ketchup, cornichons – 11,00 €

ACCOMPAGNEMENTS :
- Frites maison : 3,50 € | Frites épicées : 4,00 € | Onion rings : 4,50 €
- Coleslaw : 2,50 € | Nuggets ×6 : 5,00 € | Sauce supplémentaire : 0,50 €

BOISSONS :
- Coca-Cola / Coca Zero / Fanta / Ice Tea : 2,50 € | Eau plate : 1,50 € | Milkshake (vanille/fraise/choco) : 4,50 €

PROGRAMME FOLIE'S+ :
- Programme de fidélité gratuit
- 1 commande = des points crédités par le gérant après scan du QR code
- Paliers : Bronze (0 pts) → Silver (500 pts) → Gold (1500 pts) → Diamond (4000 pts)
- Récompenses : 200 pts = frites offertes | 500 pts = -20% | 1000 pts = burger gratuit | 2000 pts = Secret Burger exclusif
- Inscription sur le site, section "Mon compte"
- Des défis hebdomadaires permettent de gagner des points bonus

COMMANDES :
- Les commandes se font par téléphone au 07 82 25 33 09
- La livraison est disponible de 18h45 à 21h45
- Les burgers sont préparés à la commande

Règles :
- Si tu ne sais pas quelque chose, invite le client à appeler le 07 82 25 33 09
- Ne jamais inventer d'informations sur le menu ou les prix
- Reste toujours positive et représente bien l'image du restaurant
- Réponds en 1 à 3 phrases maximum sauf si on te demande une liste complète`;

  // ── STYLES ──────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #fb-chat-bubble {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #7a5c18, #c9a84c, #f0d080, #c9a84c, #7a5c18);
      background-size: 200% 100%; background-position: right;
      border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(201,168,76,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; transition: transform 0.3s, background-position 0.4s, box-shadow 0.3s;
    }
    #fb-chat-bubble:hover { transform: scale(1.08); background-position: left; box-shadow: 0 6px 28px rgba(201,168,76,0.6); }
    #fb-chat-bubble .notif {
      position: absolute; top: -2px; right: -2px;
      width: 14px; height: 14px; background: #c62828; border-radius: 50%;
      border: 2px solid #0a0a08; display: none;
    }
    #fb-chat-bubble .notif.show { display: block; animation: notifPulse 1.5s ease infinite; }
    @keyframes notifPulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.3);} }

    #fb-chat-window {
      position: fixed; bottom: 96px; right: 28px; z-index: 9998;
      width: 360px; max-width: calc(100vw - 40px);
      background: #13130d;
      border: 1px solid rgba(201,168,76,0.25);
      border-radius: 4px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1);
      display: flex; flex-direction: column;
      max-height: 520px;
      transform: translateY(20px) scale(0.95);
      opacity: 0; pointer-events: none;
      transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    #fb-chat-window.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }

    .fb-chat-head {
      padding: 14px 16px; border-bottom: 1px solid rgba(201,168,76,0.15);
      display: flex; align-items: center; gap: 12px;
      background: linear-gradient(135deg, #1c1c12, #222217);
      border-radius: 4px 4px 0 0; flex-shrink: 0;
    }
    .fb-chat-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, #7a5c18, #c9a84c);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem; flex-shrink: 0;
    }
    .fb-chat-info { flex: 1; }
    .fb-chat-name { font-family: 'Cinzel', serif; font-size: 0.85rem; color: #c9a84c; letter-spacing: 1px; }
    .fb-chat-status { font-size: 0.72rem; font-style: italic; color: #6a5a3a; margin-top: 1px; }
    .fb-chat-status::before { content: '●'; color: #4caf50; margin-right: 4px; font-style: normal; font-size: 0.6rem; }
    .fb-chat-close { background: transparent; border: none; color: #6a5a3a; font-size: 1.2rem; cursor: pointer; padding: 4px; transition: color 0.2s; line-height: 1; }
    .fb-chat-close:hover { color: #c9a84c; }

    .fb-chat-messages {
      flex: 1; overflow-y: auto; padding: 16px 14px; display: flex; flex-direction: column; gap: 12px;
      scrollbar-width: thin; scrollbar-color: #2a2618 transparent;
    }
    .fb-chat-messages::-webkit-scrollbar { width: 4px; }
    .fb-chat-messages::-webkit-scrollbar-track { background: transparent; }
    .fb-chat-messages::-webkit-scrollbar-thumb { background: #2a2618; border-radius: 999px; }

    .fb-msg { display: flex; gap: 8px; animation: msgIn 0.3s ease both; }
    @keyframes msgIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
    .fb-msg.user { flex-direction: row-reverse; }
    .fb-msg-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#7a5c18,#c9a84c); display:flex; align-items:center; justify-content:center; font-size:0.8rem; flex-shrink:0; margin-top:2px; }
    .fb-msg-bubble {
      max-width: 78%; padding: 10px 13px; border-radius: 3px;
      font-family: 'Cormorant Garamond', Georgia, serif; font-size: 0.95rem; line-height: 1.55;
      color: #f5ead0;
    }
    .fb-msg.bot .fb-msg-bubble { background: #1c1c12; border: 1px solid rgba(201,168,76,0.12); border-radius: 3px 12px 12px 3px; }
    .fb-msg.user .fb-msg-bubble { background: linear-gradient(135deg,#7a5c18,#8a6820); border-radius: 12px 3px 3px 12px; color: #f5ead0; }

    .fb-typing { display: flex; gap: 4px; align-items: center; padding: 4px 2px; }
    .fb-typing span { width: 6px; height: 6px; border-radius: 50%; background: #6a5a3a; animation: typingDot 1.2s ease infinite; }
    .fb-typing span:nth-child(2) { animation-delay: 0.2s; }
    .fb-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingDot { 0%,60%,100%{transform:translateY(0);opacity:0.4;} 30%{transform:translateY(-4px);opacity:1;} }

    .fb-suggestions { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; flex-shrink: 0; }
    .fb-suggestion {
      font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 1px;
      padding: 5px 10px; border-radius: 2px;
      border: 1px solid rgba(201,168,76,0.2); color: #6a5a3a;
      background: transparent; cursor: pointer; transition: all 0.2s;
    }
    .fb-suggestion:hover { border-color: #c9a84c; color: #c9a84c; background: rgba(201,168,76,0.05); }

    .fb-chat-input-wrap {
      padding: 12px 14px; border-top: 1px solid rgba(201,168,76,0.12);
      display: flex; gap: 8px; align-items: flex-end; flex-shrink: 0;
      background: #0a0a08; border-radius: 0 0 4px 4px;
    }
    #fb-chat-input {
      flex: 1; background: #1c1c12; border: 1px solid #2a2618; border-radius: 2px;
      padding: 9px 12px; color: #f5ead0; font-size: 0.95rem;
      font-family: 'Cormorant Garamond', Georgia, serif;
      outline: none; resize: none; max-height: 80px; line-height: 1.4;
      transition: border-color 0.3s;
    }
    #fb-chat-input:focus { border-color: #c9a84c; }
    #fb-chat-input::placeholder { color: #6a5a3a; font-style: italic; }
    #fb-chat-send {
      width: 36px; height: 36px; flex-shrink: 0;
      background: linear-gradient(135deg,#7a5c18,#c9a84c);
      border: none; border-radius: 2px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #0a0a08; font-size: 1rem; transition: opacity 0.2s, transform 0.1s;
    }
    #fb-chat-send:hover { opacity: 0.85; }
    #fb-chat-send:active { transform: scale(0.95); }
    #fb-chat-send:disabled { opacity: 0.3; cursor: not-allowed; }

    .fb-chat-deco-top { height: 2px; background: linear-gradient(90deg,transparent,#c9a84c,#f0d080,#c9a84c,transparent); border-radius: 4px 4px 0 0; }
  `;
  document.head.appendChild(style);

  // ── HTML ────────────────────────────────────────────────────────────────
  const bubble = document.createElement('button');
  bubble.id = 'fb-chat-bubble';
  bubble.innerHTML = '🍔<div class="notif show" id="fb-notif"></div>';
  bubble.setAttribute('aria-label', 'Ouvrir le chat');
  document.body.appendChild(bubble);

  const win = document.createElement('div');
  win.id = 'fb-chat-window';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', 'Chat Aux Folie\'s Burger');
  win.innerHTML = `
    <div class="fb-chat-deco-top"></div>
    <div class="fb-chat-head">
      <div class="fb-chat-avatar">👩‍🍳</div>
      <div class="fb-chat-info">
        <div class="fb-chat-name">Jade – Folie's Burger</div>
        <div class="fb-chat-status">En ligne</div>
      </div>
      <button class="fb-chat-close" id="fb-close" aria-label="Fermer">✕</button>
    </div>
    <div class="fb-chat-messages" id="fb-messages"></div>
    <div class="fb-suggestions" id="fb-suggestions">
      <button class="fb-suggestion" onclick="fbSuggest(this)">Voir le menu</button>
      <button class="fb-suggestion" onclick="fbSuggest(this)">Horaires livraison</button>
      <button class="fb-suggestion" onclick="fbSuggest(this)">Programme Folie's+</button>
      <button class="fb-suggestion" onclick="fbSuggest(this)">Comment commander ?</button>
    </div>
    <div class="fb-chat-input-wrap">
      <textarea id="fb-chat-input" placeholder="Posez votre question…" rows="1"></textarea>
      <button id="fb-chat-send" aria-label="Envoyer">➤</button>
    </div>
  `;
  document.body.appendChild(win);

  // ── ÉTAT ────────────────────────────────────────────────────────────────
  let isOpen    = false;
  let isLoading = false;
  const history = [];

  // Message de bienvenue
  addBotMessage("Bonjour ! Je suis Jade, votre assistante Folie's Burger 🍔 Comment puis-je vous aider ? Menu, horaires, programme Folie's+… posez-moi toutes vos questions !");

  // ── TOGGLE ──────────────────────────────────────────────────────────────
  bubble.addEventListener('click', toggleChat);
  document.getElementById('fb-close').addEventListener('click', toggleChat);

  function toggleChat() {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    bubble.innerHTML = isOpen
      ? '✕<div class="notif" id="fb-notif"></div>'
      : '🍔<div class="notif" id="fb-notif"></div>';
    if (isOpen) {
      document.getElementById('fb-notif').classList.remove('show');
      document.getElementById('fb-chat-input').focus();
      scrollToBottom();
    }
  }

  // ── ENVOI ────────────────────────────────────────────────────────────────
  const input  = document.getElementById('fb-chat-input');
  const sendBtn= document.getElementById('fb-chat-send');

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });

  window.fbSuggest = function(btn) {
    input.value = btn.textContent;
    sendMessage();
  };

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    input.value = '';
    input.style.height = 'auto';
    addUserMessage(text);
    history.push({ role: 'user', content: text });
    document.getElementById('fb-suggestions').style.display = 'none';

    isLoading = true;
    sendBtn.disabled = true;
    const typingEl = addTyping();
    scrollToBottom();

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Je n'ai pas pu répondre, veuillez appeler le 07 82 25 33 09.";

      typingEl.remove();
      addBotMessage(reply);
      history.push({ role: 'assistant', content: reply });

      if (!isOpen) {
        document.getElementById('fb-notif').classList.add('show');
      }
    } catch {
      typingEl.remove();
      addBotMessage("Une erreur s'est produite. Appelez-nous directement au 07 82 25 33 09 🍔");
    }

    isLoading = false;
    sendBtn.disabled = false;
    scrollToBottom();
  }

  // ── HELPERS ──────────────────────────────────────────────────────────────
  function addBotMessage(text) {
    const msgs = document.getElementById('fb-messages');
    const el = document.createElement('div');
    el.className = 'fb-msg bot';
    el.innerHTML = `<div class="fb-msg-avatar">👩‍🍳</div><div class="fb-msg-bubble">${text}</div>`;
    msgs.appendChild(el);
    scrollToBottom();
    return el;
  }

  function addUserMessage(text) {
    const msgs = document.getElementById('fb-messages');
    const el = document.createElement('div');
    el.className = 'fb-msg user';
    el.innerHTML = `<div class="fb-msg-bubble">${text}</div><div class="fb-msg-avatar">🙂</div>`;
    msgs.appendChild(el);
    return el;
  }

  function addTyping() {
    const msgs = document.getElementById('fb-messages');
    const el = document.createElement('div');
    el.className = 'fb-msg bot';
    el.innerHTML = `<div class="fb-msg-avatar">👩‍🍳</div><div class="fb-msg-bubble"><div class="fb-typing"><span></span><span></span><span></span></div></div>`;
    msgs.appendChild(el);
    return el;
  }

  function scrollToBottom() {
    const msgs = document.getElementById('fb-messages');
    setTimeout(() => msgs.scrollTop = msgs.scrollHeight, 50);
  }

})();
