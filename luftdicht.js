(() => {
  'use strict';

  /**
   * luftdicht.js – umfassender Schutz gegen Geo-, Mikrofon- und andere Leaks,
   * angepasst für localhost (lokale Entwicklung)
   */

  // === Kein Cache Reload (frische Seite immer) ===
  if (!sessionStorage.getItem('noCacheReloadDone')) {
    sessionStorage.setItem('noCacheReloadDone', 'true');
    const url = new URL(window.location.href);
    url.searchParams.set('cachebuster', Date.now());
    window.location.href = url.toString();
    return;
  }

  // === HTTPS erzwingen - aber localhost ausnehmen ===
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    alert('⚠️ Unsichere Verbindung! HTTPS ist erforderlich.');
    // window.location.href = location.href.replace(/^http:/, 'https:');
  }

  // === Clickjacking Schutz ===
  if (self !== top) {
    document.body.innerHTML = '<h1 style="color:red;">Framing verboten!</h1>';
    throw new Error('Framing blockiert');
  }

  // === APIs blockieren (Microphone, Camera, Screen Sharing, WebRTC, Presentation API) ===
  const blockAPIs = [
    ['getUserMedia', navigator.mediaDevices || navigator],
    ['getDisplayMedia', navigator.mediaDevices || navigator],
    ['RTCPeerConnection', window],
    ['webkitRTCPeerConnection', window],
    ['mozRTCPeerConnection', window],
    ['WebSocket', window],
    ['PresentationRequest', window],
    ['Notification', window],
    ['DeviceOrientationEvent', window],
    ['DeviceMotionEvent', window],
  ];

  blockAPIs.forEach(([fn, obj]) => {
    if (obj && typeof obj[fn] === 'function') {
      try {
        obj[fn] = function () {
          console.warn(`🔐 API ${fn} blockiert.`);
          return Promise.reject(new Error(`${fn} deaktiviert.`));
        };
      } catch {}
    }
  });

  // PresentationConnection und Verwandte blockieren
  ['PresentationConnection', 'PresentationConnectionList'].forEach(name => {
    if (name in window) {
      try {
        window[name] = class {
          constructor() {
            console.warn(`${name} blockiert`);
            throw new Error(`${name} deaktiviert`);
          }
        };
      } catch {}
    }
  });

  // WebSocket blockieren
  if ('WebSocket' in window) {
    try {
      window.WebSocket = class {
        constructor() {
          console.warn('WebSocket blockiert');
          throw new Error('WebSocket deaktiviert');
        }
      };
    } catch {}
  }

  // === Geolocation blockieren ===
  if ('geolocation' in navigator) {
    try {
      navigator.geolocation.getCurrentPosition = function () {
        console.warn('Geolocation getCurrentPosition blockiert');
        throw new Error('Geolocation deaktiviert');
      };
      navigator.geolocation.watchPosition = function () {
        console.warn('Geolocation watchPosition blockiert');
        throw new Error('Geolocation deaktiviert');
      };
    } catch {}
  }

  // === Fingerprinting stark reduzieren ===
  const props = {
    userAgent: 'Blocked UserAgent',
    platform: 'Blocked Platform',
    languages: ['en-US', 'en'],
    plugins: [],
    mimeTypes: [],
    hardwareConcurrency: 4,
    deviceMemory: 4,
    screenWidth: 1920,
    screenHeight: 1080,
    colorDepth: 24,
    timezoneOffset: 0
  };

  try {
    Object.defineProperty(navigator, 'userAgent', { get: () => props.userAgent, configurable: false });
    Object.defineProperty(navigator, 'platform', { get: () => props.platform, configurable: false });
    Object.defineProperty(navigator, 'languages', { get: () => props.languages, configurable: false });
    Object.defineProperty(navigator, 'plugins', { get: () => props.plugins, configurable: false });
    Object.defineProperty(navigator, 'mimeTypes', { get: () => props.mimeTypes, configurable: false });
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => props.hardwareConcurrency, configurable: false });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => props.deviceMemory, configurable: false });
    Object.defineProperty(screen, 'width', { get: () => props.screenWidth, configurable: false });
    Object.defineProperty(screen, 'height', { get: () => props.screenHeight, configurable: false });
    Object.defineProperty(screen, 'colorDepth', { get: () => props.colorDepth, configurable: false });
    Date.prototype.getTimezoneOffset = () => props.timezoneOffset;
  } catch {}

  // === Session Timeout (10 Minuten) ===
  let idleSeconds = 0;
  const idleLimit = 600;
  ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt => window.addEventListener(evt, () => idleSeconds = 0));
  setInterval(() => {
    idleSeconds++;
    if (idleSeconds >= idleLimit) {
      alert('⚠️ Sitzung wegen Inaktivität beendet.');
      try {
        sessionStorage.clear();
        localStorage.clear();
      } catch {}
      location.reload();
    }
  }, 1000);

  // === Kontextmenü, Textauswahl, Drag blockieren ===
  ['contextmenu', 'selectstart', 'dragstart'].forEach(evt => {
    window.addEventListener(evt, e => e.preventDefault());
  });

  // === DNS Rebinding Warnung bei IP-Zugriff ===
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(location.hostname)) {
    alert('⚠️ Zugriff via IP-Adresse – DNS Rebinding möglich!');
  }

  // === Keine Bildschirmübertragung erlauben ===
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    navigator.mediaDevices.getDisplayMedia = () => {
      console.warn('Bildschirmübertragung blockiert');
      return Promise.reject(new Error('Bildschirmübertragung deaktiviert'));
    };
  }

  // === Fehler- und CSP-Logging ===
  window.addEventListener('securitypolicyviolation', e => console.warn('CSP Verstoß:', e));
  window.addEventListener('error', e => console.error('JS Fehler:', e));

  // === Hinweis für serverseitigen Schutz ===
  console.log('[Hinweis] Cookies sollten HttpOnly & Secure sein (serverseitig).');
  console.log('[Hotspot] Geräte sollten immer Ende-zu-Ende verschlüsselt kommunizieren.');

  console.log('[luftdicht.js] Sicherheitsfunktionen aktiv.');

})();
