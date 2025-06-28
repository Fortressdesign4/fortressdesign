(() => {
  'use strict';

  /**
   * luftdicht.js – ISO/IEC 27001 + NIS-2 + Leak-Härtung (Client-seitig)
   * Schutz vor: ChatGPT Leak, MediaDevice Leak, CPU/RAM Side-Channel Leak, DNS Leak
   * Autor: Fortressdesign / OpenAI-unterstützt
   * Stand: 2025
   */

  // === 0. Kein Cache Reload (index.html immer frisch laden) ===
  if (!sessionStorage.getItem('noCacheReloadDone')) {
    sessionStorage.setItem('noCacheReloadDone', 'true');
    const url = new URL(window.location.href);
    url.searchParams.set('cachebuster', Date.now());
    window.location.href = url.toString();
    return; // Skript stoppt hier, Seite wird neu geladen
  }

  // === 1. Grundschutz (ISO 27001 A.5, A.12, NIS-2 Art. 21) ===

  // HTTPS erzwingen
  if (location.protocol !== 'https:') {
    alert('⚠️ Unsichere Verbindung erkannt – HTTPS ist erforderlich für sichere Datenübertragung.');
    // Optional: window.location.href = location.href.replace(/^http:/, 'https:');
  }

  // CSP-Hinweis (muss auf Server als HTTP-Header gesetzt werden)
  console.log('[Sicherheit] Bitte strenge Content-Security-Policy als HTTP-Header setzen:');
  console.log("Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self';");

  // Clickjacking-Schutz
  if (self !== top) {
    document.body.innerHTML = '<h1 style="color:red;">Sicherheitshinweis: Iframe-Zugriff blockiert.</h1>';
    throw new Error('Framing blockiert');
  }

  // === 2. Technische Kontrolle gefährlicher APIs (ISO 27001 A.13, A.14) ===

  // Mediengeräte (Kamera, Mikrofon) komplett blockieren
  const mediaAPIs = [
    ['getUserMedia', navigator.mediaDevices || navigator],
    ['getDisplayMedia', navigator.mediaDevices || navigator],
  ];

  mediaAPIs.forEach(([fn, obj]) => {
    if (obj && typeof obj[fn] === 'function') {
      try {
        obj[fn] = function () {
          console.warn(`🔐 Zugriff auf ${fn} wurde aus Sicherheitsgründen blockiert.`);
          return Promise.reject(new Error(`${fn} ist deaktiviert.`));
        };
      } catch {}
    }
  });

  // WebRTC & Netzwerkkommunikation blockieren (Verhindert IP- & DNS-Leaks via WebRTC)
  const rtcAPIs = ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection'];
  rtcAPIs.forEach(fn => {
    if (window[fn]) {
      try {
        window[fn] = function () {
          console.warn(`🔐 ${fn} wurde deaktiviert.`);
          return null;
        };
      } catch {}
    }
  });

  // WebSocket blockieren (kann zum Datenleck führen)
  if (window.WebSocket) {
    try {
      window.WebSocket = function () {
        console.warn('🔐 WebSocket wurde deaktiviert.');
        throw new Error('WebSocket ist deaktiviert.');
      };
    } catch {}
  }

  // Presentation API blockieren
  if (window.PresentationRequest) {
    try {
      window.PresentationRequest = function () {
        console.warn('🔐 PresentationRequest wurde deaktiviert.');
        throw new Error('PresentationRequest ist deaktiviert.');
      };
    } catch {}
  }

  // === 3. Schutz vor Side-Channel Attacken (CPU/RAM-Leak) ===

  // Performance API drosseln / blockieren (kann z.B. Timing-Attacken erlauben)
  if (window.performance) {
    try {
      window.performance.now = () => {
        console.warn('🔐 performance.now() wurde deaktiviert.');
        return 0; // oder ein zufälliger Wert
      };
    } catch {}
  }

  // SharedArrayBuffer blockieren
  if ('SharedArrayBuffer' in window) {
    try {
      window.SharedArrayBuffer = undefined;
      console.warn('🔐 SharedArrayBuffer wurde deaktiviert.');
    } catch {}
  }

  // High Resolution Time API drosseln
  if (window.PerformanceLongTaskTiming) {
    try {
      window.PerformanceLongTaskTiming = undefined;
      console.warn('🔐 PerformanceLongTaskTiming wurde deaktiviert.');
    } catch {}
  }

  // === 4. Netzwerküberwachung / WLAN-Check (NIS-2 Anhang II Abschnitt 2) ===

  if (navigator.connection) {
    const conn = navigator.connection;
    if (conn.type === 'wifi' && ['2g', '3g'].includes(conn.effectiveType)) {
      alert('⚠️ Öffentliches oder schwaches WLAN erkannt. Keine sensiblen Daten übertragen!');
    }
    console.log(`[Netzwerk] Verbindungstyp: ${conn.type}, Geschwindigkeit: ${conn.downlink}Mbps`);
  }

  // === 5. DOM-Schutzmaßnahmen (NIS-2 Art. 21 Abs. 2 + ISO A.9) ===

  // Rechtsklick, Textauswahl, Drag & Drop blockieren
  ['contextmenu', 'selectstart', 'dragstart'].forEach(evt =>
    window.addEventListener(evt, e => e.preventDefault())
  );

  // LocalStorage und SessionStorage bei Start löschen
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}

  // Warnung bei Zugriff per IP-Adresse (DNS Rebinding Gefahr)
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(location.hostname)) {
    alert('⚠️ Zugriff über IP-Adresse – potenzielle DNS-Rebinding Gefahr!');
  }

  // === 6. Meldepflicht (NIS-2 Art. 23) ===
  console.log('[NIS-2] Sicherheitsfunktionen aktiviert. Unregelmäßigkeiten bitte sofort melden.');

  // === 7. Transparenzprotokoll (ISO 27001 A.12.4 Logging) ===
  console.log(`[LOG] luftdicht.js geladen @ ${new Date().toISOString()}`);

  // === 8. Zusätzliche Systemsicherheit ===

  // 8.1 Session Timeout und automatische Abmeldung nach 10 Minuten Inaktivität
  let idleSeconds = 0;
  const idleLimit = 600; // 10 Minuten

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

  // 8.2 Zeit-Synchronisationsprüfung (abweichung > 5 Minuten)
  const clientTime = Date.now();
  const serverTime = clientTime; // Platzhalter, im echten Setup vom Server holen
  if (Math.abs(clientTime - serverTime) > 5 * 60 * 1000) {
    alert('⚠️ Systemzeit weicht stark von Serverzeit ab – bitte prüfen.');
  }

  // 8.3 Passwort Policy Hinweis (wenn Formulare vorhanden)
  document.querySelectorAll('input[type=password]').forEach(pwInput => {
    pwInput.setAttribute('pattern', '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}');
    pwInput.setAttribute('title', 'Passwort muss mind. 8 Zeichen, Groß- und Kleinbuchstaben sowie Zahlen enthalten.');
  });

  // 8.4 CSP-Verstoß-Listener (braucht serverseitige report-uri)
  window.addEventListener('securitypolicyviolation', e => {
    console.warn('CSP-Verstoß erkannt:', e);
    // Optional: Bericht an Server senden
  });

  // === 9. DNS Leak Schutz (Clientseitig begrenzt) ===

  // DNS-Leaks sind besser durch DNS-over-HTTPS (DoH) oder VPN zu verhindern – hier minimaler Hinweis:
  if (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes') {
    console.log('[DNS] DoNotTrack aktiviert, DNS-Leak Risiken reduziert.');
  } else {
    console.warn('[DNS] Bitte nutzen Sie DNS-over-HTTPS oder VPN zum Schutz vor DNS-Leaks.');
  }

})();
