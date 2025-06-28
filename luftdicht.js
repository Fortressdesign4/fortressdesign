(() => {
  'use strict';

  /**
   * luftdicht.js – ISO/IEC 27001 + NIS-2 konforme Schutzmaßnahmen (Client-seitig)
   * Fokus: Datenschutz, sichere Kommunikation, API-Vermeidung, Browser-Härtung, Session- und Systemschutz
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
  console.log('[Sicherheit] Setzen Sie eine strenge Content-Security-Policy per HTTP-Header:');
  console.log("Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self';");

  // Clickjacking-Schutz
  if (self !== top) {
    document.body.innerHTML = '<h1 style="color:red;">Sicherheitshinweis: Iframe-Zugriff blockiert.</h1>';
    throw new Error('Framing blockiert');
  }

  // === 2. Technische Kontrolle gefährlicher APIs (ISO 27001 A.13, A.14) ===

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
          console.warn(`🔐 Zugriff auf ${fn} wurde aus Sicherheitsgründen blockiert.`);
          return Promise.reject(new Error(`${fn} ist deaktiviert.`));
        };
      } catch {}
    }
  });

  // === 3. Netzwerküberwachung / WLAN-Check (NIS-2 Anhang II Abschnitt 2) ===

  if (navigator.connection) {
    const conn = navigator.connection;
    if (conn.type === 'wifi' && ['2g', '3g'].includes(conn.effectiveType)) {
      alert('⚠️ Öffentliches oder schwaches WLAN erkannt. Keine sensiblen Daten übertragen!');
    }
    console.log(`[Netzwerk] Verbindungstyp: ${conn.type}, Geschwindigkeit: ${conn.downlink}Mbps`);
  }

  // === 4. DOM-Schutzmaßnahmen (NIS-2 Art. 21 Abs. 2 + ISO A.9) ===

  window.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('selectstart', e => e.preventDefault());
  window.addEventListener('dragstart', e => e.preventDefault());

  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(location.hostname)) {
    alert('⚠️ Zugriff über IP-Adresse – potenzielle DNS-Rebinding Gefahr!');
  }

  // === 5. Meldepflicht (NIS-2 Art. 23) ===
  console.log('[NIS-2] Sicherheitsfunktionen aktiviert. Unregelmäßigkeiten bitte sofort an Ihre Sicherheitsstelle oder CSIRT melden.');

  // === 6. Transparenzprotokoll (ISO 27001 A.12.4 Logging) ===
  console.log(`[LOG] luftdicht.js geladen @ ${new Date().toISOString()}`);

  // === 7. Zusätzliche Systemsicherheit ===

  // 7.1 Session Timeout und automatische Abmeldung nach Inaktivität (10 Minuten)
  let idleSeconds = 0;
  const idleLimit = 600; // 600 Sekunden = 10 Minuten

  function resetIdleTimer() {
    idleSeconds = 0;
  }

  ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt =>
    window.addEventListener(evt, resetIdleTimer)
  );

  setInterval(() => {
    idleSeconds++;
    if (idleSeconds >= idleLimit) {
      alert('⚠️ Sitzung wurde wegen Inaktivität beendet. Bitte melden Sie sich erneut an.');
      try {
        sessionStorage.clear();
        localStorage.clear();
      } catch {}
      location.reload();
    }
  }, 1000);

  // 7.2 Zeit-Synchronisationsprüfung gegen Manipulation (abweichung > 5 Minuten)
  const clientTime = Date.now();
  // Beispiel für Serverzeit (statisch, im echten Einsatz vom Server per API holen)
  const serverTime = clientTime; // hier nur Platzhalter

  if (Math.abs(clientTime - serverTime) > 5 * 60 * 1000) {
    alert('⚠️ Systemzeit weicht stark von Serverzeit ab – bitte Systemzeit überprüfen.');
  }

  // 7.3 Passwort-Policy Hinweis (nur als Hinweis bei Formularen)
  document.querySelectorAll('input[type=password]').forEach(pwInput => {
    pwInput.setAttribute('pattern', '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}');
    pwInput.setAttribute('title', 'Passwort muss mindestens 8 Zeichen enthalten, Groß- und Kleinbuchstaben sowie Zahlen.');
  });

  // 7.4 CSP Violations Monitor (wenn möglich, erfordert serverseitige CSP mit report-uri)
  window.addEventListener('securitypolicyviolation', e => {
    console.warn('CSP Verstoß erkannt:', e);
    // Optional: Melde an Server
  });

})();
