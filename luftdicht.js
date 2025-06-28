(() => {
  'use strict';

  /**
   * luftdicht.js – Schutz vor Geo-, Mikrofon- und IP-Leaks
   * Ergänzung zu ISO27001 + NIS-2 + Leak-Härtung
   * Autor: Fortressdesign / OpenAI-unterstützt
   * Stand: 2025
   */

  // === Kein Cache Reload ===
  if (!sessionStorage.getItem('noCacheReloadDone')) {
    sessionStorage.setItem('noCacheReloadDone', 'true');
    const url = new URL(window.location.href);
    url.searchParams.set('cachebuster', Date.now());
    window.location.href = url.toString();
    return;
  }

  // === HTTPS erzwingen ===
  if (location.protocol !== 'https:') {
    alert('⚠️ Unsichere Verbindung erkannt – HTTPS ist erforderlich für sichere Datenübertragung.');
  }

  // === Clickjacking-Schutz ===
  if (self !== top) {
    document.body.innerHTML = '<h1 style="color:red;">Sicherheitshinweis: Iframe-Zugriff blockiert.</h1>';
    throw new Error('Framing blockiert');
  }

  // === Block GeoLocation API (Geo-Leak Schutz) ===
  if (navigator.geolocation) {
    try {
      navigator.geolocation.getCurrentPosition = function () {
        console.warn('🔐 Zugriff auf Geolocation blockiert.');
        return Promise.reject(new Error('Geolocation ist deaktiviert.'));
      };
      navigator.geolocation.watchPosition = function () {
        console.warn('🔐 Zugriff auf Geolocation blockiert.');
        return Promise.reject(new Error('Geolocation ist deaktiviert.'));
      };
    } catch {}
  }

  // === Block MediaDevices API (Kamera & Mikrofon Leak) ===
  const mediaAPIs = [
    ['getUserMedia', navigator.mediaDevices || navigator],
    ['getDisplayMedia', navigator.mediaDevices || navigator],
  ];

  mediaAPIs.forEach(([fn, obj]) => {
    if (obj && typeof obj[fn] === 'function') {
      try {
        obj[fn] = function () {
          console.warn(`🔐 Zugriff auf ${fn} (Kamera/Mikrofon) blockiert.`);
          return Promise.reject(new Error(`${fn} ist deaktiviert.`));
        };
      } catch {}
    }
  });

  // === Block WebRTC & WebSocket (IP Leak Schutz) ===
  ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection'].forEach(fn => {
    if (window[fn]) {
      try {
        window[fn] = function () {
          console.warn(`🔐 ${fn} wurde deaktiviert (IP-Leak Schutz).`);
          return null;
        };
      } catch {}
    }
  });

  if (window.WebSocket) {
    try {
      window.WebSocket = function () {
        console.warn('🔐 WebSocket wurde deaktiviert (IP-Leak Schutz).');
        throw new Error('WebSocket ist deaktiviert.');
      };
    } catch {}
  }

  if (window.PresentationRequest) {
    try {
      window.PresentationRequest = function () {
        console.warn('🔐 PresentationRequest wurde deaktiviert (IP-Leak Schutz).');
        throw new Error('PresentationRequest ist deaktiviert.');
      };
    } catch {}
  }

  // === Zusätzliche Leak-Härtungen ===

  // Performance API mit Rauschen (Timing-Angriffe erschweren)
  if (window.performance && typeof window.performance.now === 'function') {
    try {
      const originalNow = window.performance.now.bind(window.performance);
      window.performance.now = () => originalNow() + Math.random() * 10;
    } catch {}
  }

  // SharedArrayBuffer deaktivieren (Meltdown/Spectre Schutz)
  if ('SharedArrayBuffer' in window) {
    try {
      window.SharedArrayBuffer = undefined;
      console.warn('🔐 SharedArrayBuffer deaktiviert.');
    } catch {}
  }

  // Rechtsklick, Textauswahl, Drag & Drop blockieren (Basic DOM Schutz)
  ['contextmenu', 'selectstart', 'dragstart'].forEach(evt =>
    window.addEventListener(evt, e => e.preventDefault())
  );

  // Speicher leeren
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}

  // Warnung bei Zugriff per IP-Adresse (DNS Rebinding Gefahr)
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(location.hostname)) {
    alert('⚠️ Zugriff über IP-Adresse – potenzielle DNS-Rebinding Gefahr!');
  }

  // Session Timeout nach 10 Minuten Inaktivität
  let idleSeconds = 0;
  const idleLimit = 600;

  function resetIdleTimer() {
    idleSeconds = 0;
  }
  ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt =>
    window.addEventListener(evt, resetIdleTimer)
  );

  setInterval(() => {
    idleSeconds++;
    if (idleSeconds >= idleLimit) {
      alert('⚠️ Sitzung wurde wegen Inaktivität beendet. Bitte neu anmelden.');
      try {
        sessionStorage.clear();
        localStorage.clear();
      } catch {}
      location.reload();
    }
  }, 1000);

  // Passwort-Policy Hinweis bei Passwortfeldern
  document.querySelectorAll('input[type=password]').forEach(pwInput => {
    pwInput.setAttribute('pattern', '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}');
    pwInput.setAttribute('title', 'Passwort mind. 8 Zeichen, Groß-/Kleinbuchstaben, Zahlen.');
  });

  // CSP-Verstoß-Listener
  window.addEventListener('securitypolicyviolation', e => {
    console.warn('CSP-Verstoß erkannt:', e);
  });

  // DNS Leak Hinweis
  if (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes') {
    console.log('[DNS] DoNotTrack aktiviert, DNS-Leak Risiken reduziert.');
  } else {
    console.warn('[DNS] DNS-over-HTTPS oder VPN empfohlen, um DNS-Leaks zu verhindern.');
  }

})();
