// iso27001-firewall.js
(() => {
  'use strict';

  const blockedProtocols = ['javascript:', 'data:', 'ftp:', 'file:', 'blob:', 'ws:', 'wss:'];
  const eventLog = [];

  function hasPortInRange(url) {
    try {
      const u = new URL(url, location.href);
      if (!u.port) return false;
      const portNum = Number(u.port);
      return portNum >= 0 && portNum <= 65535;
    } catch {
      return false;
    }
  }

  function isIPv6Url(url) {
    try {
      return /\[[0-9a-fA-F:]+\]/.test(new URL(url, location.href).hostname);
    } catch {
      return false;
    }
  }

  function logEvent(type, message, meta = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      meta
    };
    eventLog.push(entry);
    console.log(`[ISO27001 Firewall] ${type.toUpperCase()}: ${message}`, meta);
  }

  // Link-Klick-Blocker
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (link?.href) {
      try {
        const proto = new URL(link.href).protocol;
        if (blockedProtocols.includes(proto) || hasPortInRange(link.href) || isIPv6Url(link.href)) {
          e.preventDefault();
          logEvent('block', 'Link mit unsicherer URL blockiert', { href: link.href });
          alert('⚠️ Zugriff auf unsichere Ressource blockiert.');
        }
      } catch {}
    }
  });

  // eval & Function verbieten
  window.eval = () => {
    logEvent('violation', 'Versuch, eval() auszuführen');
    throw new Error('eval() ist aus Sicherheitsgründen deaktiviert.');
  };
  window.Function = () => {
    logEvent('violation', 'Versuch, Function() zu erstellen');
    throw new Error('Function() ist aus Sicherheitsgründen blockiert.');
  };

  // MutationObserver für dynamisch eingefügte Skripte
  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName === 'SCRIPT' || (node.textContent && node.textContent.includes('eval'))) {
          logEvent('alert', 'Verdächtiges Skript dynamisch eingefügt', { node });
        }
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  // fetch blockieren
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    const url = args[0];
    try {
      const proto = new URL(url, location.href).protocol;
      if (blockedProtocols.includes(proto) || hasPortInRange(url) || isIPv6Url(url)) {
        logEvent('block', 'fetch() Aufruf zu unsicherer URL blockiert', { url });
        return Promise.reject('Firewall blockiert fetch() zu unsicherer URL');
      }
    } catch {}
    return originalFetch(...args);
  };

  // XMLHttpRequest blockieren
  const OriginalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    const xhr = new OriginalXHR();
    const origOpen = xhr.open;
    xhr.open = function (method, url, ...rest) {
      try {
        const proto = new URL(url, location.href).protocol;
        if (blockedProtocols.includes(proto) || hasPortInRange(url) || isIPv6Url(url)) {
          logEvent('block', 'XMLHttpRequest zu unsicherer URL blockiert', { url });
          throw new Error('Firewall blockiert XMLHttpRequest zu unsicherer URL');
        }
      } catch {}
      return origOpen.call(xhr, method, url, ...rest);
    };
    return xhr;
  };

  // WebSocket komplett blockieren
  window.WebSocket = function (url, ...args) {
    logEvent('block', 'WebSocket-Verbindung blockiert', { url });
    throw new Error('WebSocket sind aus Sicherheitsgründen deaktiviert.');
  };

  // WebRTC blockieren
  if (window.RTCPeerConnection) {
    window.RTCPeerConnection = function () {
      logEvent('block', 'WebRTC-Verbindung blockiert');
      throw new Error('WebRTC ist aus Sicherheitsgründen deaktiviert.');
    };
  }

  // iframe src blockieren bei unsicheren URLs
  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.tagName === 'IFRAME' && node.src) {
          try {
            const proto = new URL(node.src, location.href).protocol;
            if (blockedProtocols.includes(proto) || hasPortInRange(node.src) || isIPv6Url(node.src)) {
              logEvent('block', 'iframe mit unsicherer URL blockiert', { src: node.src });
              node.remove();
            }
          } catch {}
        }
      });
    });
  }).observe(document.body, { childList: true, subtree: true });

  logEvent('info', 'ISO27001-konforme Firewall im Browser aktiviert.');

  // API für Log-Ausgabe und Löschung (z.B. Monitoring)
  window.ISO27001Firewall = {
    getLog: () => [...eventLog],
    clearLog: () => (eventLog.length = 0)
  };
})();
