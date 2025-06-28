// nis2/firewall.js
(() => {
  const blockedProtocols = ['javascript:', 'data:', 'ftp:', 'file:', 'blob:', 'ws:', 'wss:'];
  const eventLog = [];

  // Prüft, ob die URL einen expliziten Port 0-65535 hat
  function hasPortInRange(url) {
    try {
      const u = new URL(url, location.href);
      if (u.port) {
        const portNum = Number(u.port);
        return portNum >= 0 && portNum <= 65535;
      }
      return false; // kein expliziter Port
    } catch {
      return false;
    }
  }

  // Prüft, ob die URL eine IPv6-Adresse im Host hat (z.B. [2001:db8::1])
  function isIPv6Url(url) {
    try {
      const u = new URL(url, location.href);
      return /\[[0-9a-fA-F:]+\]/.test(u.hostname);
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
    console.warn(`[Firewall] ${type.toUpperCase()}: ${message}`, meta);
    // Optional: Audit-Log per Beacon senden
    // navigator.sendBeacon('/log/firewall', JSON.stringify(entry));
  }

  // Link-Klick-Blocker
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (link && link.href) {
      const proto = new URL(link.href).protocol;
      if (blockedProtocols.includes(proto) || hasPortInRange(link.href) || isIPv6Url(link.href)) {
        e.preventDefault();
        logEvent("block", `Geblockter Link mit verbotenem Protokoll, Port oder IPv6-Adresse`, { href: link.href });
        alert("⚠️ Zugriff auf diese Ressource ist blockiert.");
      }
    }
  });

  // eval() und Function() deaktivieren
  window.eval = function () {
    logEvent("violation", "Versuch, eval() auszuführen");
    throw new Error("eval() ist aus Sicherheitsgründen deaktiviert.");
  };
  window.Function = function () {
    logEvent("violation", "Versuch, Function() dynamisch zu erstellen");
    throw new Error("Function() ist blockiert.");
  };

  // DOM-Mutation beobachten
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (node.nodeName === 'SCRIPT' || (node.textContent && node.textContent.includes("eval"))) {
          logEvent("alert", "Verdächtiges Skript dynamisch eingefügt", { node });
        }
      });
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // fetch blockieren
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const url = args[0];
    try {
      const proto = new URL(url, location.href).protocol;
      if (blockedProtocols.includes(proto) || hasPortInRange(url) || isIPv6Url(url)) {
        logEvent("block", `Geblockter fetch() Aufruf mit verbotenem Protokoll, Port oder IPv6-Adresse`, { url });
        return Promise.reject("Firewall blockierte Fetch-Ziel.");
      }
    } catch {}
    return originalFetch(...args);
  };

  // XMLHttpRequest blockieren
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    xhr.open = function (method, url, ...rest) {
      try {
        const proto = new URL(url, location.href).protocol;
        if (blockedProtocols.includes(proto) || hasPortInRange(url) || isIPv6Url(url)) {
          logEvent("block", `Geblockter XMLHttpRequest mit verbotenem Protokoll, Port oder IPv6-Adresse`, { url });
          throw new Error("Firewall blockierte XMLHttpRequest-Ziel.");
        }
      } catch {}
      return originalOpen.call(xhr, method, url, ...rest);
    };
    return xhr;
  };

  // WebSocket komplett blockieren
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function (url, ...args) {
    logEvent("block", "WebSocket-Verbindung blockiert", { url });
    throw new Error("WebSockets sind aus Sicherheitsgründen deaktiviert.");
  };

  // WebRTC blockieren (falls vorhanden)
  if (window.RTCPeerConnection) {
    window.RTCPeerConnection = function () {
      logEvent("block", "WebRTC-Verbindung blockiert");
      throw new Error("WebRTC ist deaktiviert.");
    };
  }

  // iframe src blockieren bei unsicheren Protokollen, IPv6 oder Ports
  const iframeObserver = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (node.tagName === "IFRAME" && node.src) {
          try {
            const proto = new URL(node.src, location.href).protocol;
            if (blockedProtocols.includes(proto) || hasPortInRange(node.src) || isIPv6Url(node.src)) {
              logEvent("block", "Geblocktes iframe mit verbotenem Protokoll, Port oder IPv6-Adresse", { src: node.src });
              node.remove();
            }
          } catch {}
        }
      });
    }
  });
  iframeObserver.observe(document.body, { childList: true, subtree: true });

  // Hinweis: ICMP (Ping) kann im Browser nicht blockiert werden
  logEvent("info", "Hinweis: ICMP/Ping kann nur auf Netzwerkebene (Firewall/Router) blockiert werden.");

  // Exports für Logs
  window.__NIS2_FIREWALL__ = {
    getLog: () => [...eventLog],
    clearLog: () => eventLog.length = 0,
  };

  logEvent("info", "NIS2-konforme JavaScript-Firewall mit Port- und IPv6-URL-Filter initialisiert");
})();
