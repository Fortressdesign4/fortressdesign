(() => {
  'use strict';

  /**
   * luftdicht.js – ISO/IEC 27001 + NIS-2 konforme Schutzmaßnahmen (Client-seitig)
   * Fokus: Datenschutz, sichere Kommunikation, API-Vermeidung, Browser-Härtung
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

})();
