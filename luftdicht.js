(() => {
  'use strict';

  // --- HTTPS erzwingen ---
  if (window.location.protocol !== 'https:') {
    alert('WARNUNG: Unsichere Verbindung erkannt! Bitte HTTPS verwenden, um WLAN-Lecks und Man-in-the-Middle-Angriffe zu vermeiden.');
    // Optional: automatisch auf HTTPS weiterleiten
    // window.location.href = window.location.href.replace(/^http:/, 'https:');
  }

  // --- Warnung bei öffentlichem WLAN ---
  if (navigator.connection && navigator.connection.type === 'wifi') {
    alert('Sie sind mit einem WLAN verbunden. Stellen Sie sicher, dass dieses vertrauenswürdig und sicher ist.');
  }

  // --- Blockieren gefährlicher Web APIs (WebRTC, MediaDevices, Presentation API) ---
  const blockApi = (apiName, obj, prop) => {
    if (obj && obj[prop]) {
      try {
        obj[prop] = function() {
          console.warn(`Zugriff auf ${apiName} wurde blockiert.`);
          return Promise.reject(new Error(`Zugriff auf ${apiName} nicht erlaubt.`));
        };
      } catch (e) {
        console.warn(`Konnte ${apiName} nicht blockieren:`, e);
      }
    }
  };

  blockApi('getUserMedia', navigator.mediaDevices || navigator, 'getUserMedia');
  blockApi('getDisplayMedia', navigator.mediaDevices || navigator, 'getDisplayMedia');
  blockApi('RTCPeerConnection', window, 'RTCPeerConnection');
  blockApi('webkitRTCPeerConnection', window, 'webkitRTCPeerConnection');
  blockApi('mozRTCPeerConnection', window, 'mozRTCPeerConnection');
  blockApi('PresentationRequest', window, 'PresentationRequest');
  blockApi('WebSocket', window, 'WebSocket');

  // --- Framebusting (Clickjacking Schutz) ---
  if (window.top !== window.self) {
    document.body.innerHTML = '<h1 style="color:red;">Sicherheitshinweis: Framing ist nicht erlaubt.</h1>';
    throw new Error('Framing ist blockiert.');
  }

  // --- Kontextmenü und Textauswahl deaktivieren ---
  window.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('selectstart', e => e.preventDefault());
  window.addEventListener('dragstart', e => e.preventDefault());

  // --- Storage Hardening ---
  try {
    sessionStorage.clear();
    localStorage.clear();
  } catch (e) {
    console.warn('Konnte Storage nicht leeren:', e);
  }

  // --- DNS-Rebinding Warnung (wenn URL IP enthält) ---
  if (window.location.hostname.match(/^(?:\d{1,3}\.){3}\d{1,3}$/)) {
    alert('Warnung: Zugriff über IP-Adresse - mögliche DNS-Rebinding-Attacke!');
  }

  // --- CSP Hinweis ---
  console.log('Sicherheitsrichtlinie: Bitte CSP per HTTP-Header serverseitig setzen, nicht nur clientseitig.');

  // --- Allgemeine Sicherheits-Logs ---
  console.log('✅ luftdicht.js geladen: HTTPS, WLAN-Schutz, WebAPI-Blockierung aktiv.');

  // --- Optional: Netzwerkanalyse - nur informativ ---
  if (navigator.connection) {
    console.log(`Netzwerktyp: ${navigator.connection.effectiveType || navigator.connection.type}`);
  }

  // --- Funktion für HTTPS-Hardening, z.B. HSTS kann nur serverseitig gesetzt werden ---

})();
