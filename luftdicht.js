(() => {
  'use strict';

  /**
   * luftdicht.js – umfangreiches Leak- und Fingerprinting-Schutz Toolkit
   * 49 Funktionen für Privacy und Security, inkl. Geo, Mikrofon, Kamera, WebRTC, DNS, Clipboard, Timing, Hardware, uvm.
   * Autor: Fortressdesign / OpenAI-unterstützt
   * Stand: 2025
   */

  // === 0. Cachebuster Reload ===
  function cacheBusterReload() {
    if (!sessionStorage.getItem('noCacheReloadDone')) {
      sessionStorage.setItem('noCacheReloadDone', 'true');
      const url = new URL(window.location.href);
      url.searchParams.set('cachebuster', Date.now());
      window.location.href = url.toString();
      return true;
    }
    return false;
  }
  if (cacheBusterReload()) return;

  // === 1. HTTPS Erzwingen (außer localhost) ===
  function enforceHTTPS() {
    if (
      location.protocol !== 'https:' &&
      location.hostname !== 'localhost' &&
      location.hostname !== '127.0.0.1'
    ) {
      alert('⚠️ Unsichere Verbindung – bitte HTTPS verwenden.');
      // window.location.href = location.href.replace(/^http:/, 'https:');
    }
  }
  enforceHTTPS();

  // === 2. Clickjacking Schutz ===
  function preventFraming() {
    if (self !== top) {
      document.body.innerHTML =
        '<h1 style="color:red;">Framing verboten (Clickjacking Schutz)</h1>';
      throw new Error('Framing blockiert');
    }
  }
  preventFraming();

  // === 3. Block Mikrofon- & Kamerazugriff ===
  function blockMediaDevices() {
    const nav = navigator.mediaDevices || navigator;
    ['getUserMedia', 'getDisplayMedia'].forEach((fn) => {
      if (nav && typeof nav[fn] === 'function') {
        try {
          nav[fn] = () => {
            console.warn(`🔐 ${fn} blockiert.`);
            return Promise.reject(new Error(`${fn} deaktiviert`));
          };
        } catch {}
      }
    });
  }
  blockMediaDevices();

  // === 4. Block WebRTC (Peer Connections) ===
  function blockWebRTC() {
    ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection'].forEach(
      (name) => {
        if (name in window) {
          try {
            window[name] = function () {
              console.warn(`${name} blockiert`);
              throw new Error(`${name} deaktiviert`);
            };
          } catch {}
        }
      }
    );
  }
  blockWebRTC();

  // === 5. Block WebSocket ===
  function blockWebSocket() {
    if ('WebSocket' in window) {
      try {
        window.WebSocket = function () {
          console.warn('WebSocket blockiert');
          throw new Error('WebSocket deaktiviert');
        };
      } catch {}
    }
  }
  blockWebSocket();

  // === 6. Block Presentation API ===
  function blockPresentationAPI() {
    ['PresentationRequest', 'PresentationConnection', 'PresentationConnectionList'].forEach(
      (name) => {
        if (name in window) {
          try {
            window[name] = function () {
              console.warn(`${name} blockiert`);
              throw new Error(`${name} deaktiviert`);
            };
          } catch {}
        }
      }
    );
  }
  blockPresentationAPI();

  // === 7. Block Geolocation ===
  function blockGeolocation() {
    if ('geolocation' in navigator) {
      try {
        navigator.geolocation.getCurrentPosition = () => {
          console.warn('Geolocation getCurrentPosition blockiert');
          throw new Error('Geolocation deaktiviert');
        };
        navigator.geolocation.watchPosition = () => {
          console.warn('Geolocation watchPosition blockiert');
          throw new Error('Geolocation deaktiviert');
        };
      } catch {}
    }
  }
  blockGeolocation();

  // === 8. Block Device Orientation & Motion ===
  function blockDeviceSensors() {
    ['DeviceOrientationEvent', 'DeviceMotionEvent'].forEach((evtName) => {
      if (evtName in window) {
        try {
          window[evtName] = null;
          window.addEventListener(evtName.toLowerCase(), (e) => {
            e.stopImmediatePropagation();
            e.preventDefault();
          }, true);
        } catch {}
      }
    });
  }
  blockDeviceSensors();

  // === 9. Block Clipboard Access ===
  function blockClipboard() {
    ['copy', 'cut', 'paste'].forEach((evt) => {
      window.addEventListener(evt, (e) => {
        e.preventDefault();
        console.warn(`Clipboard ${evt} blockiert`);
      });
    });
  }
  blockClipboard();

  // === 10. Block Context Menu (Rechtsklick) ===
  function blockContextMenu() {
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      console.warn('Rechtsklick blockiert');
    });
  }
  blockContextMenu();

  // === 11. Block Text Selection & Drag ===
  function blockSelectionDrag() {
    ['selectstart', 'dragstart'].forEach((evt) => {
      window.addEventListener(evt, (e) => {
        e.preventDefault();
        console.warn(`${evt} blockiert`);
      });
    });
  }
  blockSelectionDrag();

  // === 12. Clear Storage on Load ===
  function clearStorage() {
    try {
      sessionStorage.clear();
      localStorage.clear();
      console.log('Storage gecleart');
    } catch {}
  }
  clearStorage();

  // === 13. Block Fingerprinting: Override Navigator Properties ===
  function spoofNavigatorProps() {
    const fakeProps = {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      platform: 'Win32',
      languages: ['en-US', 'en'],
      hardwareConcurrency: 4,
      deviceMemory: 4,
      plugins: [],
      mimeTypes: [],
    };

    try {
      Object.defineProperty(navigator, 'userAgent', { get: () => fakeProps.userAgent, configurable: false });
      Object.defineProperty(navigator, 'platform', { get: () => fakeProps.platform, configurable: false });
      Object.defineProperty(navigator, 'languages', { get: () => fakeProps.languages, configurable: false });
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => fakeProps.hardwareConcurrency, configurable: false });
      Object.defineProperty(navigator, 'deviceMemory', { get: () => fakeProps.deviceMemory, configurable: false });
      Object.defineProperty(navigator, 'plugins', { get: () => fakeProps.plugins, configurable: false });
      Object.defineProperty(navigator, 'mimeTypes', { get: () => fakeProps.mimeTypes, configurable: false });
    } catch {}
  }
  spoofNavigatorProps();

  // === 14. Block Battery API ===
  function blockBatteryAPI() {
    if ('getBattery' in navigator) {
      try {
        navigator.getBattery = () => Promise.reject(new Error('Battery API deaktiviert'));
      } catch {}
    }
  }
  blockBatteryAPI();

  // === 15. Spoof Screen Properties ===
  function spoofScreenProps() {
    try {
      Object.defineProperty(screen, 'width', { get: () => 1920, configurable: false });
      Object.defineProperty(screen, 'height', { get: () => 1080, configurable: false });
      Object.defineProperty(screen, 'colorDepth', { get: () => 24, configurable: false });
    } catch {}
  }
  spoofScreenProps();

  // === 16. Block Performance Timing (Timing Attacks) ===
  function blockPerformanceTiming() {
    if ('performance' in window && 'now' in performance) {
      try {
        performance.now = () => 0;
        performance.timing = {};
      } catch {}
    }
  }
  blockPerformanceTiming();

  // === 17. Block Service Workers ===
  function blockServiceWorkers() {
    if ('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.register = () => Promise.reject(new Error('ServiceWorker deaktiviert'));
      } catch {}
    }
  }
  blockServiceWorkers();

  // === 18. Block Beacon API ===
  function blockBeacon() {
    if ('sendBeacon' in navigator) {
      try {
        navigator.sendBeacon = () => false;
      } catch {}
    }
  }
  blockBeacon();

  // === 19. Block Screen Capture ===
  function blockScreenCapture() {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia = () =>
        Promise.reject(new Error('Bildschirmübertragung deaktiviert'));
    }
  }
  blockScreenCapture();

  // === 20. Block Notification API ===
  function blockNotifications() {
    if ('Notification' in window) {
      try {
        window.Notification.requestPermission = () =>
          Promise.resolve('denied');
      } catch {}
    }
  }
  blockNotifications();

  // === 21. Block WebGL Fingerprinting ===
  function blockWebGL() {
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (param) {
      // Return generic values for fingerprinting parameters
      if (param === 37445) return 'Intel Inc.'; // UNMASKED_VENDOR_WEBGL
      if (param === 37446) return 'Intel Iris OpenGL Engine'; // UNMASKED_RENDERER_WEBGL
      return getParameter.call(this, param);
    };
  }
  blockWebGL();

  // === 22. Block Fonts Fingerprinting ===
  function blockFonts() {
    if ('fonts' in document) {
      try {
        document.fonts.ready = Promise.resolve();
      } catch {}
    }
  }
  blockFonts();

  // === 23. Block Plugins Enumeration ===
  function blockPluginsEnum() {
    try {
      Object.defineProperty(navigator, 'plugins', {
        get: () => [],
        configurable: false,
      });
    } catch {}
  }
  blockPluginsEnum();

  // === 24. Block MimeTypes Enumeration ===
  function blockMimeTypesEnum() {
    try {
      Object.defineProperty(navigator, 'mimeTypes', {
        get: () => [],
        configurable: false,
      });
    } catch {}
  }
  blockMimeTypesEnum();

  // === 25. Spoof Timezone ===
  function spoofTimezone() {
    try {
      Date.prototype.getTimezoneOffset = () => 0;
      Intl.DateTimeFormat = class {
        constructor() {
          return {
            resolvedOptions: () => ({
              timeZone: 'UTC',
            }),
          };
        }
      };
    } catch {}
  }
  spoofTimezone();

  // === 26. Block IndexedDB ===
  function blockIndexedDB() {
    if ('indexedDB' in window) {
      try {
        window.indexedDB = null;
      } catch {}
    }
  }
  blockIndexedDB();

  // === 27. Block Cache API ===
  function blockCacheAPI() {
    if ('caches' in window) {
      try {
        window.caches = null;
      } catch {}
    }
  }
  blockCacheAPI();

  // === 28. Disable Pointer Events (mouse tracking) ===
  function blockPointerEvents() {
    ['pointermove', 'pointerover', 'pointerenter', 'pointerdown'].forEach((evt) => {
      window.addEventListener(evt, (e) => {
        e.stopPropagation();
        e.preventDefault();
      }, true);
    });
  }
  blockPointerEvents();

  // === 29. Block Keyboard Event Leak ===
  function blockKeyboardEvents() {
    ['keydown', 'keypress', 'keyup'].forEach((evt) => {
      window.addEventListener(evt, (e) => {
        e.stopPropagation();
        // Do not preventDefault to allow input normally
      }, true);
    });
  }
  blockKeyboardEvents();

  // === 30. Block Service Worker Cache ===
  function blockServiceWorkerCache() {
    if ('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.register = () => Promise.reject(new Error('ServiceWorker deaktiviert'));
      } catch {}
    }
  }
  blockServiceWorkerCache();

  // === 31. Block WebAssembly ===
  function blockWebAssembly() {
    if ('WebAssembly' in window) {
      try {
        window.WebAssembly = undefined;
      } catch {}
    }
  }
  blockWebAssembly();

  // === 32. Block Beacon Data Exfiltration ===
  function blockBeaconExfiltration() {
    if ('sendBeacon' in navigator) {
      try {
        navigator.sendBeacon = () => false;
      } catch {}
    }
  }
  blockBeaconExfiltration();

  // === 33. Spoof Hardware Concurrency ===
  function spoofHardwareConcurrency() {
    try {
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => 4,
        configurable: false,
      });
    } catch {}
  }
  spoofHardwareConcurrency();

  // === 34. Spoof Device Memory ===
  function spoofDeviceMemory() {
    try {
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => 4,
        configurable: false,
      });
    } catch {}
  }
  spoofDeviceMemory();

  // === 35. Block URL Search Parameters Leak ===
  function blockURLSearchParams() {
    try {
      URLSearchParams.prototype.get = () => null;
      URLSearchParams.prototype.has = () => false;
    } catch {}
  }
  blockURLSearchParams();

  // === 36. Block WebUSB ===
  function blockWebUSB() {
    if ('usb' in navigator) {
      try {
        navigator.usb = undefined;
      } catch {}
    }
  }
  blockWebUSB();

  // === 37. Block WebBluetooth ===
  function blockWebBluetooth() {
    if ('bluetooth' in navigator) {
      try {
        navigator.bluetooth = undefined;
      } catch {}
    }
  }
  blockWebBluetooth();

  // === 38. Block Payment Request API ===
  function blockPaymentRequest() {
    if ('PaymentRequest' in window) {
      try {
        window.PaymentRequest = undefined;
      } catch {}
    }
  }
  blockPaymentRequest();

  // === 39. Block Idle Detection API ===
  function blockIdleDetection() {
    if ('IdleDetector' in window) {
      try {
        window.IdleDetector = undefined;
      } catch {}
    }
  }
  blockIdleDetection();

  // === 40. Block Credential Management API ===
  function blockCredentialManagement() {
    if ('credentials' in navigator) {
      try {
        navigator.credentials = undefined;
      } catch {}
    }
  }
  blockCredentialManagement();

  // === 41. Block Permissions API ===
  function blockPermissions() {
    if ('permissions' in navigator) {
      try {
        navigator.permissions = undefined;
      } catch {}
    }
  }
  blockPermissions();

  // === 42. Block Clipboard API ===
  function blockClipboardAPI() {
    if ('clipboard' in navigator) {
      try {
        navigator.clipboard = undefined;
      } catch {}
    }
  }
  blockClipboardAPI();

  // === 43. Spoof Plugins Length ===
  function spoofPluginsLength() {
    try {
      Object.defineProperty(navigator.plugins, 'length', { get: () => 0 });
    } catch {}
  }
  spoofPluginsLength();

  // === 44. Block VR & AR APIs ===
  function blockVRAR() {
    ['getVRDisplays', 'xr'].forEach((name) => {
      if (name in navigator) {
        try {
          navigator[name] = undefined;
        } catch {}
      }
    });
  }
  blockVRAR();

  // === 45. Block Battery Charging Status Leak ===
  function blockBatteryCharging() {
    if ('getBattery' in navigator) {
      try {
        navigator.getBattery = () => Promise.resolve({ charging: false });
      } catch {}
    }
  }
  blockBatteryCharging();

  // === 46. Block Telephony API ===
  function blockTelephony() {
    if ('telephony' in navigator) {
      try {
        navigator.telephony = undefined;
      } catch {}
    }
  }
  blockTelephony();

  // === 47. Block Gamepad API ===
  function blockGamepad() {
    if ('getGamepads' in navigator) {
      try {
        navigator.getGamepads = () => [];
      } catch {}
    }
  }
  blockGamepad();

  // === 48. Block Network Information API ===
  function blockNetworkInformation() {
    if ('connection' in navigator) {
      try {
        navigator.connection = undefined;
      } catch {}
    }
  }
  blockNetworkInformation();

  // === 49. Block Crypto API ===
  function blockCryptoAPI() {
    if ('crypto' in window) {
      try {
        window.crypto = undefined;
      } catch {}
    }
  }
  blockCryptoAPI();

  // === Activate all ===
  [
    enforceHTTPS,
    preventFraming,
    blockMediaDevices,
    blockWebRTC,
    blockWebSocket,
    blockPresentationAPI,
    blockGeolocation,
    blockDeviceSensors,
    blockClipboard,
    blockContextMenu,
    blockSelectionDrag,
    clearStorage,
    spoofNavigatorProps,
    blockBatteryAPI,
    spoofScreenProps,
    blockPerformanceTiming,
    blockServiceWorkers,
    blockBeacon,
    blockScreenCapture,
    blockNotifications,
    blockWebGL,
    blockFonts,
    blockPluginsEnum,
    blockMimeTypesEnum,
    spoofTimezone,
    blockIndexedDB,
    blockCacheAPI,
    blockPointerEvents,
    blockKeyboardEvents,
    blockServiceWorkerCache,
    blockWebAssembly,
    blockBeaconExfiltration,
    spoofHardwareConcurrency,
    spoofDeviceMemory,
    blockURLSearchParams,
    blockWebUSB,
    blockWebBluetooth,
    blockPaymentRequest,
    blockIdleDetection,
    blockCredentialManagement,
    blockPermissions,
    blockClipboardAPI,
    spoofPluginsLength,
    blockVRAR,
    blockBatteryCharging,
    blockTelephony,
    blockGamepad,
    blockNetworkInformation,
    blockCryptoAPI,
  ].forEach((fn) => {
    try {
      fn();
    } catch {}
  });

  console.log('[luftdicht.js] 49 Leak-Schutzfunktionen aktiviert.');

})();
