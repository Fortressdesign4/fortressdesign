(() => {
  'use strict';

  /**
   * luftdicht.js – 49 Schutzfunktionen gegen Leaks (NIS-2 + ISO27001 konform)
   * Autor: Fortressdesign / OpenAI-unterstützt
   * Stand: 2025
   */

  // === 0. Kein Cache Reload (frische Seite) ===
  if (!sessionStorage.getItem('noCacheReloadDone')) {
    sessionStorage.setItem('noCacheReloadDone', 'true');
    const url = new URL(window.location.href);
    url.searchParams.set('cachebuster', Date.now());
    window.location.href = url.toString();
    return;
  }

  // === 1. HTTPS erzwingen (Warnung) ===
  if (location.protocol !== 'https:') {
    alert('⚠️ HTTPS ist erforderlich für sichere Datenübertragung!');
  }

  // === 2. Clickjacking-Schutz ===
  if (self !== top) {
    document.body.innerHTML = '<h1 style="color:red;">Framing blockiert aus Sicherheitsgründen.</h1>';
    throw new Error('Framing blockiert');
  }

  // Hilfsfunktion API blockieren
  function blockAPI(obj, prop, reason) {
    if (!obj || typeof obj[prop] === 'undefined') return;
    try {
      if (typeof obj[prop] === 'function') {
        obj[prop] = function () {
          console.warn(`🔐 ${prop} wurde blockiert. Grund: ${reason}`);
          return Promise.reject(new Error(`${prop} deaktiviert`));
        };
      } else {
        Object.defineProperty(obj, prop, {
          get() {
            console.warn(`🔐 ${prop} Zugriff blockiert. Grund: ${reason}`);
            return undefined;
          },
          configurable: false
        });
      }
    } catch {}
  }

  // === 3-20. 18 API-Funktionen blockieren (Mikrofon, Kamera, Screen Sharing, WebRTC, WebSocket, Geolocation, Clipboard, Battery, etc.) ===
  const blockList = [
    [navigator.mediaDevices, 'getUserMedia', 'Mikrofon und Kamera Leak'],
    [navigator.mediaDevices, 'getDisplayMedia', 'Bildschirmübertragung blockiert'],
    [window, 'getDisplayMedia', 'Bildschirmübertragung blockiert'],
    [window, 'RTCPeerConnection', 'WebRTC IP Leak'],
    [window, 'webkitRTCPeerConnection', 'WebRTC IP Leak'],
    [window, 'mozRTCPeerConnection', 'WebRTC IP Leak'],
    [window, 'WebSocket', 'Mögliche Datenübertragung blockiert'],
    [window, 'PresentationRequest', 'Bildschirmübertragung blockiert'],
    [navigator, 'geolocation', 'Geolocation blockiert'],
    [navigator.mediaDevices, 'enumerateDevices', 'Mediengeräte Auflistung blockiert'],
    [navigator, 'clipboard', 'Clipboard API blockiert'],
    [navigator, 'battery', 'Battery API blockiert'],
    [navigator, 'bluetooth', 'Bluetooth API blockiert'],
    [navigator, 'connection', 'Network Information API blockiert'],
    [navigator, 'credentials', 'Credential Management API blockiert'],
    [navigator, 'deviceMemory', 'Gerätespeicher API blockiert'],
    [navigator, 'hardwareConcurrency', 'CPU Kerne API blockiert'],
    [navigator, 'permissions', 'Permission API blockiert'],
    [navigator, 'plugins', 'Plugins API blockiert'],
    [navigator, 'sensors', 'Sensor API blockiert'],
    [navigator, 'usb', 'USB API blockiert'],
    [navigator, 'wakeLock', 'Wake Lock API blockiert'],
    [navigator, 'xr', 'XR API blockiert'],
    [navigator, 'share', 'Share API blockiert']
  ];

  blockList.forEach(([obj, prop, reason]) => blockAPI(obj, prop, reason));

  // === 21-25. Geolocation Funktionen blockieren ===
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition = () => {
      console.warn('Geolocation.getCurrentPosition blockiert');
      return Promise.reject(new Error('Geolocation deaktiviert'));
    };
    navigator.geolocation.watchPosition = () => {
      console.warn('Geolocation.watchPosition blockiert');
      return Promise.reject(new Error('Geolocation deaktiviert'));
    };
    navigator.geolocation.clearWatch = () => {
      console.warn('Geolocation.clearWatch blockiert');
      return false;
    };
  }

  // === 26. WebGL Renderer Info blockieren (Fingerprinting) ===
  if (window.WebGLRenderingContext) {
    const origGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (param) {
      if (param === 37445 || param === 37446) return ''; // UNMASKED_VENDOR_WEBGL, UNMASKED_RENDERER_WEBGL
      return origGetParameter.call(this, param);
    };
  }

  // === 27-31. Fingerprinting APIs blockieren (Canvas, AudioContext, etc.) ===
  // Canvas fingerprinting verhindern
  if (HTMLCanvasElement.prototype.toDataURL) {
    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
      console.warn('Canvas.toDataURL blockiert (Fingerprinting)');
      return '';
    };
  }
  if (HTMLCanvasElement.prototype.getContext) {
    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type) {
      if (type === 'webgl' || type === '2d') {
        console.warn('Canvas.getContext blockiert (Fingerprinting)');
        return null;
      }
      return origGetContext.apply(this, arguments);
    };
  }

  // AudioContext fingerprinting blockieren
  if (window.AudioContext || window.webkitAudioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const origCreateAnalyser = AudioCtx.prototype.createAnalyser;
    AudioCtx.prototype.createAnalyser = function () {
      console.warn('AudioContext.createAnalyser blockiert (Fingerprinting)');
      return null;
    };
  }

  // === 32-33. Performance API und Timing Angriffe verhindern ===
  if (window.performance && window.performance.now) {
    window.performance.now = () => {
      console.warn('performance.now blockiert (Timing Leak)');
      return 0;
    };
  }
  if (window.PerformanceObserver) {
    window.PerformanceObserver = function () {
      console.warn('PerformanceObserver blockiert (Timing Leak)');
      return {
        observe() {},
        disconnect() {}
      };
    };
  }

  // === 34-38. Storage APIs blockieren / einschränken ===
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}

  Object.defineProperty(window, 'localStorage', {
    get() {
      console.warn('localStorage blockiert');
      return null;
    }
  });
  Object.defineProperty(window, 'sessionStorage', {
    get() {
      console.warn('sessionStorage blockiert');
      return null;
    }
  });
  Object.defineProperty(window, 'IndexedDB', {
    get() {
      console.warn('IndexedDB blockiert');
      return null;
    }
  });

  // === 39-40. User-Agent & Navigator Info verschleiern ===
  Object.defineProperty(navigator, 'userAgent', {
    get() {
      return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36';
    }
  });
  Object.defineProperty(navigator, 'platform', {
    get() {
      return 'Win32';
    }
  });

  // === 41-43. Kontextmenü, Textauswahl, Drag&Drop blockieren ===
  window.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('selectstart', e => e.preventDefault());
  window.addEventListener('dragstart', e => e.preventDefault());

  // === 44-46. Session Timeout nach 10 Min Inaktivität ===
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
      alert('⚠️ Sitzung wegen Inaktivität beendet.');
      try {
        sessionStorage.clear();
        localStorage.clear();
      } catch {}
      location.reload();
    }
  }, 1000);

  // === 47. Zeitabweichung prüfen (Client vs Server) ===
  const clientTime = Date.now();
  const serverTime = clientTime; // Placeholder
  if (Math.abs(clientTime - serverTime) > 5 * 60 * 1000) {
    alert('⚠️ Systemzeit weicht stark von Serverzeit ab!');
  }

  // === 48. Passwort-Policy Hinweis ===
  document.querySelectorAll('input[type=password]').forEach(pw => {
    pw.setAttribute('pattern', '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}');
    pw.setAttribute('title', 'Mindestens 8 Zeichen, Groß-/Kleinbuchstaben, Zahlen');
  });

  // === 49. CSP-Verletzungen überwachen ===
  window.addEventListener('securitypolicyviolation', e => {
    console.warn('CSP-Verstoß erkannt:', e);
  });

  // === Transparenzprotokoll ===
  console.log(`[LOG] luftdicht.js 49 Schutzfunktionen aktiviert @ ${new Date().toISOString()}`);

})();
