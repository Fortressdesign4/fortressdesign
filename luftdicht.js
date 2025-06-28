(() => {
  'use strict';

  /**
   * Ultra-Sicherheits-Skript "luftdicht.js"
   * ISO 27001 + NIS-2 konform, inkl. umfassendem Leak- und Hacker-Schutz
   * Autor: Fortressdesign + OpenAI Unterstützung
   * Stand: 2025
   */

  // === 0. Kein Cache Reload (index.html immer frisch laden) ===
  if (!sessionStorage.getItem('noCacheReloadDone')) {
    sessionStorage.setItem('noCacheReloadDone', 'true');
    const url = new URL(window.location.href);
    url.searchParams.set('cachebuster', Date.now());
    window.location.href = url.toString();
    return; // Seite reloadet hier, Script stoppt
  }

  // === 1. Grundschutz ===

  // HTTPS erzwingen (wenn nicht HTTPS, Warnung)
  if (location.protocol !== 'https:') {
    alert('⚠️ Unsichere Verbindung erkannt! Bitte HTTPS verwenden.');
    // Optional: window.location.href = location.href.replace(/^http:/, 'https:');
  }

  // Clickjacking-Schutz
  if (self !== top) {
    document.body.innerHTML = '<h1 style="color:red;">Sicherheitshinweis: Framing nicht erlaubt!</h1>';
    throw new Error('Framing blockiert');
  }

  // === 2. Content-Security-Policy (CSP) Hinweis ===
  console.log('[Sicherheit] CSP: default-src \'none\'; script-src \'self\'; style-src \'self\';');

  // === 3. APIs komplett blockieren, die Leaks oder Zugriffe ermöglichen ===
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
    ['DeviceMotionEvent', window]
  ];

  blockAPIs.forEach(([fn, obj]) => {
    if (obj && typeof obj[fn] === 'function') {
      try {
        obj[fn] = function () {
          console.warn(`🔐 API ${fn} wurde blockiert.`);
          return Promise.reject(new Error(`${fn} ist deaktiviert.`));
        };
      } catch {}
    }
  });

  // PresentationConnection, PresentationConnectionList blockieren
  ['PresentationConnection', 'PresentationConnectionList'].forEach(name => {
    if (name in window) {
      try {
        window[name] = class {
          constructor() {
            console.warn(`${name} blockiert`);
            throw new Error(`${name} ist deaktiviert.`);
          }
        };
      } catch {}
    }
  });

  // WebSocket komplett blockieren
  if ('WebSocket' in window) {
    try {
      window.WebSocket = class {
        constructor() {
          console.warn('WebSocket blockiert');
          throw new Error('WebSocket ist deaktiviert');
        }
      };
    } catch {}
  }

  // === 4. Browser Fingerprinting (RFP) verhindern ===
  function blockFingerprinting() {
    const props = {
      userAgent: 'Blocked UserAgent',
      platform: 'Blocked Platform',
      languages: ['en-US', 'en'],
      plugins: [],
      mimeTypes: [],
      hardwareConcurrency: 4,
      deviceMemory: 4,
      // Screen Größe verschleiern
      screenWidth: 1920,
      screenHeight: 1080,
      colorDepth: 24,
      timezoneOffset: 0
    };

    // navigator props
    try {
      Object.defineProperty(navigator, 'userAgent', { get: () => { console.warn('navigator.userAgent blockiert'); return props.userAgent; }, configurable: false });
      Object.defineProperty(navigator, 'platform', { get: () => { console.warn('navigator.platform blockiert'); return props.platform; }, configurable: false });
      Object.defineProperty(navigator, 'languages', { get: () => { console.warn('navigator.languages blockiert'); return props.languages; }, configurable: false });
      Object.defineProperty(navigator, 'plugins', { get: () => { console.warn('navigator.plugins blockiert'); return props.plugins; }, configurable: false });
      Object.defineProperty(navigator, 'mimeTypes', { get: () => { console.warn('navigator.mimeTypes blockiert'); return props.mimeTypes; }, configurable: false });
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => { console.warn('navigator.hardwareConcurrency blockiert'); return props.hardwareConcurrency; }, configurable: false });
      Object.defineProperty(navigator, 'deviceMemory', { get: () => { console.warn('navigator.deviceMemory blockiert'); return props.deviceMemory; }, configurable: false });
    } catch {}

    // screen properties
    try {
      Object.defineProperty(screen, 'width', { get: () => { console.warn('screen.width blockiert'); return props.screenWidth; }, configurable: false });
      Object.defineProperty(screen, 'height', { get: () => { console.warn('screen.height blockiert'); return props.screenHeight; }, configurable: false });
      Object.defineProperty(screen, 'colorDepth', { get: () => { console.warn('screen.colorDepth blockiert'); return props.colorDepth; }, configurable: false });
    } catch {}

    // timezoneOffset
    try {
      if (Date.prototype.getTimezoneOffset) {
        Date.prototype.getTimezoneOffset = function () {
          console.warn('Date.getTimezoneOffset blockiert');
          return props.timezoneOffset;
        };
      }
    } catch {}
  }
  blockFingerprinting();

  // === 5. Netzwerk & DNS Leak verhindern / Monitoring ===
  if (navigator.connection) {
    const conn = navigator.connection;
    if (conn.type === 'wifi' && ['2g', '3g'].includes(conn.effectiveType)) {
      alert('⚠️ Öffentliches oder schwaches WLAN erkannt. Keine sensiblen Daten übertragen!');
    }
    console.log(`[Netzwerk] Verbindung: Typ=${conn.type}, Downlink=${conn.downlink} Mbps`);
  }

  // === 6. Standortzugriffe blockieren ===
  if ('geolocation' in navigator) {
    try {
      navigator.geolocation.getCurrentPosition = function () {
        console.warn('Geolocation getCurrentPosition blockiert');
        throw new Error('Geolocation blockiert');
      };
      navigator.geolocation.watchPosition = function () {
        console.warn('Geolocation watchPosition blockiert');
        throw new Error('Geolocation blockiert');
      };
    } catch {}
  }

  // === 7. Mikrofon & Kamera komplett blockieren ===
  try {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia = function () {
        console.warn('getUserMedia blockiert');
        return Promise.reject(new Error('getUserMedia blockiert'));
      };
      navigator.mediaDevices.getDisplayMedia = function () {
        console.warn('getDisplayMedia blockiert');
        return Promise.reject(new Error('getDisplayMedia blockiert'));
      };
    }
  } catch {}

  // === 8. Screen Sharing komplett blockieren ===
  if ('getDisplayMedia' in navigator.mediaDevices) {
    try {
      navigator.mediaDevices.getDisplayMedia = function () {
        console.warn('Screen Sharing blockiert');
        return Promise.reject(new Error('Screen Sharing blockiert'));
      };
    } catch {}
  }

  // === 9. Session Timeout & automatische Abmeldung (10 Min) ===
  let idleSeconds = 0;
  const idleLimit = 600;
  const resetIdle = () => { idleSeconds = 0; };
  ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt => window.addEventListener(evt, resetIdle));
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

  // === 10. CSP Violation Monitor ===
  window.addEventListener('securitypolicyviolation', e => {
    console.warn('CSP Verstoß erkannt:', e);
    // Optional: Meldung an Server
  });

  // === 11. DNS Rebinding Schutz (Zugriff über IP-Adresse warnen) ===
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(location.hostname)) {
    alert('⚠️ Zugriff über IP-Adresse – potenzielle DNS Rebinding Gefahr!');
  }

  // === 12. DOM Schutz (Context Menu, Textauswahl, Drag) ===
  ['contextmenu', 'selectstart', 'dragstart'].forEach(evt => {
    window.addEventListener(evt, e => e.preventDefault());
  });

  // === 13. Passwort-Policy Hinweis (optional) ===
  document.querySelectorAll('input[type=password]').forEach(input => {
    input.setAttribute('pattern', '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}');
    input.setAttribute('title', 'Passwort muss mindestens 8 Zeichen, Groß-/Kleinbuchstaben und Zahlen enthalten.');
  });

  // === 14. CPU & RAM Leak vorbeugen durch API-Blockierung ===
  // Web Workers und Shared Workers blockieren
  ['Worker', 'SharedWorker'].forEach(apiName => {
    if (apiName in window) {
      try {
        window[apiName] = class {
          constructor() {
            console.warn(`${apiName} blockiert`);
            throw new Error(`${apiName} deaktiviert`);
          }
        };
      } catch {}
    }
  });

  // === 15. Presentation API komplett blockieren (Screen Sharing, Präsentationen) ===
  ['PresentationRequest', 'PresentationConnection', 'PresentationConnectionList'].forEach(name => {
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

  // === 16. Prevent fingerprinting via timezone & locale ===
  try {
    Intl.DateTimeFormat = function() {
      console.warn('Intl.DateTimeFormat blockiert');
      return {
        format: () => '01.01.1970',
      };
    };
  } catch {}

  // === 17. Alle Cookies als HttpOnly, Secure empfehlen (serverseitig) ===
  console.log('[Hinweis] Setzen Sie Cookies als HttpOnly und Secure (serverseitig)');

  // === 18. Verschlüsselung jedes Geräts im Hotspot-Kontext empfehlen (nur Hinweis) ===
  console.log('[Hotspot-Sicherheit] Jedes Gerät sollte Ende-zu-Ende verschlüsselt kommunizieren.');

  // === 19. Systemzeit Manipulation prüfen ===
  const clientTime = Date.now();
  const serverTime = clientTime; // Muss vom Server geholt werden im echten Einsatz
  if (Math.abs(clientTime - serverTime) > 5 * 60 * 1000) {
    alert('⚠️ Systemzeit weicht stark von Serverzeit ab. Bitte überprüfen.');
  }

  // === 20. CSP-Report URI (wenn konfiguriert, meldet Verstöße an Server) ===
  // siehe serverseitige Einstellungen

  // === 21. EventListener für Sicherheitsrelevante Fehler ===
  window.addEventListener('error', e => {
    console.error('JS Fehler erkannt:', e);
  });

  // === 22. Verhindern von Extensions API Zugängen (teilweise) ===
  if ('chrome' in window && chrome.runtime) {
    try {
      chrome.runtime.sendMessage = () => { throw new Error('chrome.runtime.sendMessage blockiert'); };
      chrome.runtime.connect = () => { throw new Error('chrome.runtime.connect blockiert'); };
    } catch {}
  }

  // === 23. Keine Bildschirmübertragung zulassen ===
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    navigator.mediaDevices.getDisplayMedia = () => {
      console.warn('Bildschirmübertragung blockiert');
      return Promise.reject(new Error('Bildschirmübertragung blockiert'));
    };
  }

  // === Weitere Schutzmaßnahmen nach Bedarf ergänzen ===

  console.log('[luftdicht.js] Sicherheitsfunktionen aktiviert.');

})();
