(() => {
  const blockedProtocols = ['javascript:', 'data:', 'ftp:', 'file:', 'blob:', 'ws:', 'wss:'];
  const eventLog = [];

  function hasPortInRange(url) {
    try {
      const u = new URL(url, location.href);
      const portNum = Number(u.port);
      return u.port && portNum >= 0 && portNum <= 65535;
    } catch { return false; }
  }

  function isIPv6Url(url) {
    try {
      return /\[[0-9a-fA-F:]+\]/.test(new URL(url, location.href).hostname);
    } catch { return false; }
  }

  function logEvent(type, message, meta = {}) {
    const entry = { timestamp: new Date().toISOString(), type, message, meta };
    eventLog.push(entry);
    console.warn(`[Firewall] ${type.toUpperCase()}: ${message}`, meta);
    // Optional: send to server
    // navigator.sendBeacon('/log/firewall', JSON.stringify(entry));
  }

  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (link?.href) {
      const proto = new URL(link.href).protocol;
      if (blockedProtocols.includes(proto) || hasPortInRange(link.href) || isIPv6Url(link.href)) {
        e.preventDefault();
        logEvent("block", "Geblockter Link", { href: link.href });
        alert("⚠️ Zugriff blockiert.");
      }
    }
  });

  window.eval = function () {
    logEvent("violation", "eval() blockiert");
    throw new Error("eval() ist deaktiviert.");
  };

  window.Function = function () {
    logEvent("violation", "Function() blockiert");
    throw new Error("Function() ist deaktiviert.");
  };

  const observer = new MutationObserver(m => {
    m.forEach(({ addedNodes }) => {
      addedNodes.forEach(n => {
        if (n.nodeName === 'SCRIPT' || n.textContent?.includes('eval')) {
          logEvent("alert", "Dynamisches Skript eingefügt", { node: n });
        }
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  const origFetch = window.fetch;
  window.fetch = function (...args) {
    const url = args[0];
    try {
      const proto = new URL(url, location.href).protocol;
      if (blockedProtocols.includes(proto) || hasPortInRange(url) || isIPv6Url(url)) {
        logEvent("block", "fetch blockiert", { url });
        return Promise.reject("Geblockt durch Firewall");
      }
    } catch {}
    return origFetch(...args);
  };

  const origXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    const xhr = new origXHR();
    const open = xhr.open;
    xhr.open = function (method, url, ...rest) {
      try {
        const proto = new URL(url, location.href).protocol;
        if (blockedProtocols.includes(proto) || hasPortInRange(url) || isIPv6Url(url)) {
          logEvent("block", "XHR blockiert", { url });
          throw new Error("XHR geblockt");
        }
      } catch {}
      return open.call(xhr, method, url, ...rest);
    };
    return xhr;
  };

  window.WebSocket = function (url, ...args) {
    logEvent("block", "WebSocket blockiert", { url });
    throw new Error("WebSocket deaktiviert");
  };

  if (window.RTCPeerConnection) {
    window.RTCPeerConnection = function () {
      logEvent("block", "WebRTC blockiert");
      throw new Error("WebRTC deaktiviert");
    };
  }

  const iframeObs = new MutationObserver(m => {
    m.forEach(({ addedNodes }) => {
      addedNodes.forEach(n => {
        if (n.tagName === "IFRAME" && n.src) {
          const proto = new URL(n.src, location.href).protocol;
          if (blockedProtocols.includes(proto) || hasPortInRange(n.src) || isIPv6Url(n.src)) {
            logEvent("block", "iframe blockiert", { src: n.src });
            n.remove();
          }
        }
      });
    });
  });
  iframeObs.observe(document.body, { childList: true, subtree: true });

  logEvent("info", "Firewall geladen (Browser)");

  window.__NIS2_FIREWALL__ = {
    getLog: () => [...eventLog],
    clearLog: () => (eventLog.length = 0),
  };
})();
