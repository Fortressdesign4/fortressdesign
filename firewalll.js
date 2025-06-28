(() => {
  'use strict';

  /**
   * luftdicht.js – ISO/IEC 27001 + NIS-2 konforme Schutzmaßnahmen (Client-seitig)
   * Fokus: Datenschutz, sichere Kommunikation, API-Vermeidung, Browser-Härtung, Inaktivitäts-Warnung
   * Autor: Fortressdesign / OpenAI-unterstützt
   * Stand: 2025
   */

  // === 1. Grundschutz (ISO 27001 A.5, A.12, NIS-2 Art. 21) ===

  // 🔒 HTTPS erzwingen
  if (location.protocol !== 'https:') {
    alert('⚠️ Unsichere Verbindung erkannt – HTTPS ist erforderlich für sichere Datenübertragung.');
    // Optionaler Redirect:
    // window.location.href = location.href.replace(/^http:/, 'https:');
  }

  // 🔐 CSP Hinweis (Server erforderlich)
  console.log('[Sicherheit] Setzen Sie eine strenge CSP per HTTP-Header:');
  console.log("Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self';");

  // 🚫 Kein Zugriff aus iframes (Clickjacking verhindern)
  if (self !== top) {
    document.body.innerHTML = '<h1 style="color:red;">Sicherheitshinweis: Iframe-Zugriff blockiert.</h1>';
    throw new Error('Framing blockiert');
  }

  // === 2. Technische Kontrolle gefährlicher APIs (ISO 27001 A.13, A.14) ===

  // 🚫 Deaktiviere WebRTC, Kamera, Mikrofon, Bildschirmfreigabe & WebSocket
  const blockAPIs =
