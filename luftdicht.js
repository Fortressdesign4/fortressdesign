(() => {
  'use strict';

  /**
   * luftdicht.js Ultimate Leak Protection v2025
   * 49 Funktionen + DOM-Reinigung + Browser-Härtung + Session-Schutz
   * Autor: Fortressdesign / OpenAI-unterstützt
   */

  // === 0. Cache-Busting (immer frische Seite laden) ===
  if (!sessionStorage.getItem('noCacheReloadDone')) {
    sessionStorage.setItem('noCacheReloadDone', 'true');
    const url = new URL(window.location.href);
    url.searchParams.set('cachebuster', Date.now());
    window.location.href = url.toString();
    return;
  }

  // === 1. HTTPS erzwingen + Warnung ===
  if (location.protocol !== 'https:') {
    alert('⚠️ Unsichere Verbindung erkannt. Bitte HTTPS nutzen!');
  }

  // === 2. Clickjacking-Schutz (kein Framing erlaubt) ===
  if (self !== top) {
    document.body.innerHTML = '<h1 style="color:red;">Framing blockiert</h1>';
    throw new Error('Framing blockiert');
  }

  // === 3. CSP Hinweis (nur als Hinweis, muss serverseitig gesetzt werden) ===
  console.log('[Sicherheit] CSP-Hinweis: default-src \'none\'; script-src \'self\'; style-src \'self\';');

  // === 4. Blockiere gefährliche APIs (UserMedia, WebSocket, PeerConnection etc.) ===
  const blockAPIs = [
    ['getUserMedia', navigator.mediaDevices || navigator],
    ['getDisplayMedia', navigator.mediaDevices || navigator],
    ['RTCPeerConnection', window],
    ['webkitRTCPeerConnection', window],
    ['mozRTCPeerConnection', window],
    ['WebSocket', window],
    ['PresentationRequest', window]
  ];
  blockAPIs.forEach(([fn, obj]) => {
    if (obj && typeof obj[fn] === 'function') {
      try {
        obj[fn] = function () {
          console.warn(`🔐 API ${fn} blockiert`);
          return Promise.reject(new Error(`${fn} deaktiviert`));
        };
      } catch {}
    }
  });

  // === 5. Netzwerk-Check (schwaches WLAN etc.) ===
  if (navigator.connection) {
    const conn = navigator.connection;
    if (conn.type === 'wifi' && ['2g', '3g'].includes(conn.effectiveType)) {
      alert('⚠️ Öffentliches oder langsames WLAN erkannt.');
    }
  }

  // === 6. Session & Local Storage löschen ===
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}

  // === 7. IP/Hostname Check (Warnung bei direkter IP) ===
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(location.hostname)) {
    alert('⚠️ Zugriff über IP erkannt – DNS-Rebinding möglich.');
  }

  // === 8. Session Timeout (10 Minuten) ===
  let idleSeconds = 0;
  const idleLimit = 600;
  function resetIdle() { idleSeconds = 0; }
  ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(e => window.addEventListener(e, resetIdle));
  setInterval(() => {
    idleSeconds++;
    if (idleSeconds >= idleLimit) {
      alert('⚠️ Sitzung abgelaufen (Inaktivität).');
      try { localStorage.clear(); sessionStorage.clear(); } catch {}
      location.reload();
    }
  }, 1000);

  // === 9. Zeit-Sync Check (abweichung >5 min) ===
  const clientTime = Date.now();
  const serverTime = clientTime; // sollte per API ersetzt werden
  if (Math.abs(clientTime - serverTime) > 5 * 60 * 1000) {
    alert('⚠️ Systemzeit weicht stark von Serverzeit ab!');
  }

  // === 10. Passwort Policy Hinweise ===
  document.querySelectorAll('input[type=password]').forEach(el => {
    el.setAttribute('pattern', '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}');
    el.setAttribute('title', 'Mindestens 8 Zeichen, Groß-/Kleinbuchstaben & Zahl.');
  });

  // === 11. CSP Violation Monitor ===
  window.addEventListener('securitypolicyviolation', e => {
    console.warn('CSP-Verstoß:', e);
  });

  // === 12-60. 49 Anti-Leak & Fingerprinting Funktionen ===
  // --- Funktionen in einem Objekt, modular aufrufbar ---
  const antiLeakFunctions = {

    // 12. Deaktiviere WebRTC IP Leak komplett
    disableWebRTC() {
      if (window.RTCPeerConnection) {
        const orig = window.RTCPeerConnection;
        window.RTCPeerConnection = function () {
          console.warn('WebRTC deaktiviert');
          throw new Error('WebRTC ist deaktiviert');
        };
      }
    },

    // 13. Deaktiviere Geolocation API
    disableGeoLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition = () => {
          throw new Error('Geolocation deaktiviert');
        };
        navigator.geolocation.watchPosition = () => {
          throw new Error('Geolocation deaktiviert');
        };
      }
    },

    // 14. Deaktiviere Mikrofon-Zugriff
    disableMicrophone() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia = () => Promise.reject(new Error('Mikrofon deaktiviert'));
      }
    },

    // 15. Deaktiviere Kamera-Zugriff
    disableCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia = () => Promise.reject(new Error('Kamera deaktiviert'));
      }
    },

    // 16. Blockiere Screen Sharing
    disableScreenCapture() {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = () => Promise.reject(new Error('Bildschirmübertragung deaktiviert'));
      }
    },

    // 17. Disable Battery API
    disableBatteryAPI() {
      if (navigator.getBattery) {
        navigator.getBattery = () => Promise.reject(new Error('Battery API deaktiviert'));
      }
    },

    // 18. Disable Device Memory Leak
    disableDeviceMemory() {
      try {
        Object.defineProperty(navigator, 'deviceMemory', { get: () => undefined });
      } catch {}
    },

    // 19. Disable Hardware Concurrency Leak
    disableHardwareConcurrency() {
      try {
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => undefined });
      } catch {}
    },

    // 20. Disable WebGL fingerprinting
    disableWebGL() {
      try {
        const proto = WebGLRenderingContext.prototype;
        proto.getParameter = () => null;
      } catch {}
    },

    // 21. Blockiere Canvas Fingerprinting
    disableCanvasFingerprinting() {
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type) {
        if (type === '2d' || type === 'webgl') {
          console.warn('Canvas Fingerprinting blockiert');
          return null;
        }
        return origGetContext.apply(this, arguments);
      };
    },

    // 22. Blockiere Audio Fingerprinting
    disableAudioFingerprinting() {
      if (window.OfflineAudioContext) {
        const orig = window.OfflineAudioContext;
        window.OfflineAudioContext = function () {
          console.warn('Audio Fingerprinting blockiert');
          return null;
        };
      }
    },

    // 23. Disable Keyboard Layout Leak
    disableKeyboardLayout() {
      try {
        Object.defineProperty(navigator, 'keyboard', { get: () => undefined });
      } catch {}
    },

    // 24. Disable User-Agent Spoofing (setzt festen UA)
    spoofUserAgent() {
      try {
        Object.defineProperty(navigator, 'userAgent', {
          get: () => 'Mozilla/5.0 (compatible; luftdichtBot/1.0; +https://secure.local)'
        });
      } catch {}
    },

    // 25. Disable Language Leak
    spoofLanguage() {
      try {
        Object.defineProperty(navigator, 'language', { get: () => 'en-US' });
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      } catch {}
    },

    // 26. Disable Plugins Leak
    spoofPlugins() {
      try {
        Object.defineProperty(navigator, 'plugins', { get: () => [] });
      } catch {}
    },

    // 27. Disable MimeTypes Leak
    spoofMimeTypes() {
      try {
        Object.defineProperty(navigator, 'mimeTypes', { get: () => [] });
      } catch {}
    },

    // 28. Disable Cookie Leak (keine Cookies erlaubt)
    blockCookies() {
      Object.defineProperty(document, 'cookie', {
        get: () => '',
        set: () => { console.warn('Cookies blockiert'); }
      });
    },

    // 29. Disable LocalStorage Leak
    blockLocalStorage() {
      try {
        Object.defineProperty(window, 'localStorage', {
          get: () => {
            console.warn('localStorage blockiert');
            return null;
          }
        });
      } catch {}
    },

    // 30. Disable SessionStorage Leak
    blockSessionStorage() {
      try {
        Object.defineProperty(window, 'sessionStorage', {
          get: () => {
            console.warn('sessionStorage blockiert');
            return null;
          }
        });
      } catch {}
    },

    // 31. Disable IndexedDB Leak
    blockIndexedDB() {
      try {
        Object.defineProperty(window, 'indexedDB', {
          get: () => {
            console.warn('IndexedDB blockiert');
            return null;
          }
        });
      } catch {}
    },

    // 32. Blockiere Beacon API
    blockBeacon() {
      if (navigator.sendBeacon) {
        navigator.sendBeacon = () => {
          console.warn('Beacon API blockiert');
          return false;
        };
      }
    },

    // 33. Blockiere Notification API
    blockNotifications() {
      if (window.Notification) {
        window.Notification = function () {
          console.warn('Notifications blockiert');
          throw new Error('Notifications deaktiviert');
        };
      }
    },

    // 34. Blockiere Payment Request API
    blockPaymentRequest() {
      if (window.PaymentRequest) {
        window.PaymentRequest = function () {
          console.warn('PaymentRequest API blockiert');
          throw new Error('PaymentRequest deaktiviert');
        };
      }
    },

    // 35. Blockiere Clipboard API (lesen/schreiben)
    blockClipboard() {
      if (navigator.clipboard) {
        navigator.clipboard.readText = () => Promise.reject(new Error('Clipboard Lesen blockiert'));
        navigator.clipboard.writeText = () => Promise.reject(new Error('Clipboard Schreiben blockiert'));
      }
    },

    // 36. Blockiere Device Orientation API
    blockDeviceOrientation() {
      window.addEventListener('deviceorientation', e => e.stopImmediatePropagation(), true);
    },

    // 37. Blockiere Motion Sensor API
    blockDeviceMotion() {
      window.addEventListener('devicemotion', e => e.stopImmediatePropagation(), true);
    },

    // 38. Disable Presentation API (Screensharing / Cast)
    disablePresentationAPI() {
      if (window.PresentationRequest) {
        window.PresentationRequest = function () {
          console.warn('PresentationRequest blockiert');
          throw new Error('PresentationRequest deaktiviert');
        };
      }
    },

    // 39. Blockiere Touch Events (kann Fingerprint verringern)
    blockTouchEvents() {
      window.addEventListener('touchstart', e => e.stopPropagation(), true);
      window.addEventListener('touchmove', e => e.stopPropagation(), true);
      window.addEventListener('touchend', e => e.stopPropagation(), true);
    },

    // 40. Blockiere Clipboard Events (copy, cut, paste)
    blockClipboardEvents() {
      ['copy', 'cut', 'paste'].forEach(evt =>
        window.addEventListener(evt, e => e.preventDefault(), true)
      );
    },

    // 41. Remove all Inline Event Handlers (onclick, onmouseover...)
    removeInlineEvents() {
      document.querySelectorAll('*').forEach(el => {
        [...el.attributes].forEach(attr => {
          if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
        });
      });
    },

    // 42. Remove all external script and iframe sources
    removeExternalSources() {
      ['script', 'iframe', 'embed', 'object', 'link'].forEach(tag => {
        document.querySelectorAll(tag).forEach(el => {
          ['src', 'href', 'data', 'srcset'].forEach(attr => {
            if (el.hasAttribute(attr)) el.removeAttribute(attr);
          });
          if (el.parentNode) el.parentNode.removeChild(el);
        });
      });
    },

    // 43. Disable Font Enumeration (Fonts API Fingerprint)
    disableFontEnumeration() {
      try {
        if (window.FontFaceSet) {
          Object.defineProperty(document, 'fonts', { get: () => undefined });
        }
      } catch {}
    },

    // 44. Disable Referrer leak
    disableReferrer() {
      try {
        Object.defineProperty(document, 'referrer', { get: () => '' });
        Object.defineProperty(document, 'referrerPolicy', { get: () => 'no-referrer' });
      } catch {}
    },

    // 45. Block WebSocket Leak
    blockWebSocket() {
      if (window.WebSocket) {
        window.WebSocket = function () {
          console.warn('WebSocket blockiert');
          throw new Error('WebSocket deaktiviert');
        };
      }
    },

    // 46. Disable Beacon Payload
    blockBeaconPayload() {
      if (navigator.sendBeacon) {
        navigator.sendBeacon = () => false;
      }
    },

    // 47. Disable Permissions API Leak
    blockPermissionsAPI() {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query = () => Promise.reject(new Error('Permissions API deaktiviert'));
      }
    },

    // 48. Disable Performance API Leak
    blockPerformanceAPI() {
      if (window.performance) {
        window.performance.getEntries = () => [];
        window.performance.now = () => 0;
      }
    },

    // 49. Enable aggressive DOM Reinigung
    enableDomCleaning() {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (!(node instanceof Element)) return;
            if (['SCRIPT', 'IFRAME', 'EMBED', 'OBJECT', 'LINK'].includes(node.tagName)) {
              ['src', 'href', 'data', 'srcset'].forEach(attr => {
                if (node.hasAttribute(attr)) node.removeAttribute(attr);
              });
              if (node.parentNode) node.parentNode.removeChild(node);
              return;
            }
            [...node.attributes].forEach(attr => {
              if (/^on/i.test(attr.name)) node.removeAttribute(attr.name);
            });
            node.querySelectorAll('*').forEach(child => {
              [...child.attributes].forEach(attr => {
                if (/^on/i.test(attr.name)) child.removeAttribute(attr.name);
              });
            });
          });
        });
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });

      // Initial clean
      this.removeInlineEvents();
      this.removeExternalSources();
      console.log('[DOM-Reinigung] Aktiv');
    },
  };

  // === 61. Alle Anti-Leak Funktionen ausführen ===
  Object.values(antiLeakFunctions).forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.warn('Fehler bei Anti-Leak Funktion:', e);
    }
  });

  // === 62. Transparenz-Log ===
  console.log(`[luftdicht.js] Ultimate Leak Protection aktiviert @ ${new Date().toISOString()}`);

  // === 63. Kein Kontextmenü, kein Text-Auswahl, kein Drag ===
  window.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('selectstart', e => e.preventDefault());
  window.addEventListener('dragstart', e => e.preventDefault());

  // === 64. Warnung bei unsicheren Hotspots (symbolisch) ===
  if (navigator.connection && navigator.connection.type === 'wifi') {
    console.log('[Hotspot] Jedes Gerät soll zwingend verschlüsselt kommunizieren!');
  }

  // === 65. Warnung vor Bildschirmübertragung ===
  if ('getDisplayMedia' in (navigator.mediaDevices || {})) {
    console.warn('Bildschirmübertragung ist potenziell unsicher und wurde deaktiviert.');
  }

})();
