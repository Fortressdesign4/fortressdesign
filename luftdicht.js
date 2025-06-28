(function iso27001Luftdicht() {
  'use strict';

  const CONFIG = {
    accessToken: 'SuperSecretAccessToken987!',
    styleURL: 'https://raw.githubusercontent.com/Fortressdesign4/fortressdesign/main/style.css',
    scriptURL: '/js/1',
    expectedOrigin: window.location.origin
  };

  // 📛 Keine gefährlichen APIs zulassen
  ['eval', 'Function', 'setInterval', 'setTimeout'].forEach(fn => {
    if (typeof window[fn] === 'function') {
      window[fn] = () => {
        console.error(`🚫 Verwendung von ${fn} ist aus Sicherheitsgründen blockiert.`);
        throw new Error(`${fn} ist deaktiviert`);
      };
    }
  });

  // 📛 WebRTC & Presentation API blockieren
  if ('RTCPeerConnection' in window) delete window.RTCPeerConnection;
  if ('MediaDevices' in navigator) delete navigator.mediaDevices;
  if ('presentation' in navigator) delete navigator.presentation;

  // ⛔ iframe blockieren
  if (window.top !== window.self) {
    console.warn('⛔ In iframe geladen. Breche ab.');
    window.top.location = window.self.location;
  }

  // ✅ CSP/Policy-konformes Laden von CSS
  function loadSafeCSS(url) {
    fetch(url, { mode: 'cors', cache: 'no-store' })
      .then(r => r.ok ? r.text() : Promise.reject('CSS konnte nicht geladen werden'))
      .then(css => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
      })
      .catch(e => console.error('❌ Style-Fehler:', e));
  }

  // ✅ CSP-konformes Laden von remote JS über BLOB
  function loadSafeJS(url, token) {
    fetch(`${url}?_=${Date.now()}`, {
      method: 'GET',
      headers: { 'accesstoken': token },
      cache: 'no-store',
      mode: 'same-origin'
    })
      .then(r => r.ok ? r.text() : Promise.reject('Script konnte nicht geladen werden'))
      .then(js => {
        const blob = new Blob([js], { type: 'application/javascript' });
        const blobURL = URL.createObjectURL(blob);

        const script = document.createElement('script');
        script.src = blobURL;
        script.type = 'application/javascript';
        script.async = false;
        document.body.appendChild(script);

        script.onload = () => URL.revokeObjectURL(blobURL);
      })
      .catch(err => console.error('❌ Script-Fehler:', err));
  }

  // ✅ Ursprung prüfen
  if (window.origin !== CONFIG.expectedOrigin) {
    console.error('🚨 Ursprung nicht erlaubt:', window.origin);
    return;
  }

  // 🚀 Ausführung starten
  loadSafeCSS(CONFIG.styleURL);
  loadSafeJS(CONFIG.scriptURL, CONFIG.accessToken);

})();
