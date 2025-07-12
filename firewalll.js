// ===============================
// 📦 LeakBlocker Keyword-Liste
// ===============================
const leakBlockerKeywords = [
  
  // Deine vorhandenen Leak-Begriffe
  "Leak", "Leak Blocker", "Datenleck", "Datenschutz", "Datensicherheit",
  "Netzwerküberwachung", "Traffic-Filter", "Firewall", "IP-Blocker", "DNS-Filter",
  "URL-Filter", "Proxy-Server", "Verschlüsselung", "SSL/TLS", "HTTPS-FILTER", "VPN", "Anonymität",
  "Media Connection Leak", "Media Stream Leak", "Media Server Exposure", "RTSP Leak", "RTMP Leak",
  "HLS Stream Exposure", "DASH Stream Leak", "WebRTC Leak", "WebRTC IP Leak", "STUN Leak",
  "TURN Server Exposure", "ICE Candidate Leak", "Insecure Media Session", "Media Peer Connection Leak",
  "Media Transport Leak", "SRTP Leak", "SDP Exposure", "RTP Leak", "Audio Stream Exposure",
  "Video Stream Exposure", "Media Buffer Leak", "Unencrypted Media Channel", "WebRTC Metadata Leak",
  "Remote Media Capture", "Unauthorized Media Session", "VoIP Media Leak", "Real-Time Media Leak",
  "Media Codec Exploit", "Media Player Exploit", "Media Proxy Leak", "Live Stream Hijack",
  "Media Access without Consent", "Silent Media Transmission", "Background Media Stream",
  "App Media Stream Leak", "Media Broadcast Exposure", "Media Content Sniffing", "CDN Media Leak",
  "Streaming Analytics Leak", "Media Capture API Abuse", "WebRTC Track Leak", "Remote Audio Stream",
  "Remote Video Stream", "Insecure Media Routing", "Media Negotiation Leak", "Media Port Exposure",
  "Media NAT Traversal Leak", "Stream Recording Leak", "Camera Stream Hijack", "Unprotected Media Source",
  "Media Event Listener Abuse", "WebRTC Signaling Exploit", "Media Session Hijacking", "Media Relay Abuse",
  "Insecure Media Framework",

  // NIS2 / ISO 27001 relevante Begriffe
  "Informationssicherheitsvorfall", "Security Incident", "Incident Response", "Notfallmanagement",
  "Risikoanalyse", "Risk Assessment", "Schwachstelle", "Vulnerability", "Patchmanagement",
  "Zugriffskontrolle", "Access Control", "Authentifizierung", "Authentication", "Autorisation",
  "Authorization", "Sicherheitsaudit", "Security Audit", "ISO 27001", "NIS2",
  "Informationssicherheit", "Information Security", "Compliance", "Datenschutzverletzung",
  "Data Breach", "Kontinuitätsmanagement", "Business Continuity", "Disaster Recovery",
  "Verschlüsselungsstandard", "Encryption Standard", "Schlüsselmanagement", "Key Management",
  "Multi-Faktor-Authentifizierung", "Multi-Factor Authentication", "MFA",
  "Security Policy", "Sicherheitsrichtlinie", "Security Awareness", "Security Training",
  "Meldepflicht", "Reporting Obligation", "Incident Management", "Logging", "Audit Trail",
  "Datenintegrität", "Data Integrity", "Cybersecurity", "Cyber-Angriff", "Cyber Attack",
  "Malware", "Phishing", "Social Engineering", "Zero Trust", "Least Privilege",
  "Netzwerksegmentierung", "Network Segmentation", "Schutzmaßnahmen", "Safeguards",
  "Sicherheitskontrollen", "Security Controls", "Zertifizierung", "Certification",
  "Penetrationstest", "Penetration Test", "SOC", "Security Operations Center",
  "Monitoring", "Threat Intelligence", "Bedrohungsanalyse", "Threat Analysis",
  "Datenverlust", "Data Loss", "Insider Threat", "Exfiltration", "Cyberabwehr",
  "Media Connection Leak", "Media Stream Leak", "Media Server Exposure", "RTSP Leak", "RTMP Leak",
  "HLS Stream Exposure", "DASH Stream Leak", "WebRTC Leak", "WebRTC IP Leak", "STUN Leak",
  "TURN Server Exposure", "ICE Candidate Leak", "Insecure Media Session", "Media Peer Connection Leak",
  "Media Transport Leak", "SRTP Leak", "SDP Exposure", "RTP Leak", "Audio Stream Exposure",
  "Video Stream Exposure", "Media Buffer Leak", "Unencrypted Media Channel", "WebRTC Metadata Leak",
  "Remote Media Capture", "Unauthorized Media Session", "VoIP Media Leak", "Real-Time Media Leak",
  "Media Codec Exploit", "Media Player Exploit", "Media Proxy Leak", "Live Stream Hijack",
  "Media Access without Consent", "Silent Media Transmission", "Background Media Stream",
  "App Media Stream Leak", "Media Broadcast Exposure", "Media Content Sniffing", "CDN Media Leak",
  "Streaming Analytics Leak", "Media Capture API Abuse", "WebRTC Track Leak", "Remote Audio Stream",
  "Remote Video Stream", "Insecure Media Routing", "Media Negotiation Leak", "Media Port Exposure",
  "Media NAT Traversal Leak", "Stream Recording Leak", "Camera Stream Hijack", "Unprotected Media Source",
  "Media Event Listener Abuse", "WebRTC Signaling Exploit", "Media Session Hijacking", "Media Relay Abuse",
  "Insecure Media Framework",

  // NEU hinzugefügt:
  "MediaDevice Leak"
];

console.log(`✅ LeakBlocker aktiv. Überwachte Schlüsselwörter: ${leakBlockerKeywords.length}`);

];

console.log(`✅ LeakBlocker aktiv. Überwachte Schlüsselwörter: ${leakBlockerKeywords.length}`);

// ===============================
// 🔍 Leak Scanner Funktion
// ===============================
function scanTextForLeaks(text) {
  return leakBlockerKeywords.some(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Beispiel-Nutzung
const testText = "Diese Seite verwendet ein VPN und eine Firewall.";
if (scanTextForLeaks(testText)) {
  console.warn("⚠️ Potenzielles Datenleck erkannt!");
}

// ===============================
// 🔐 Port Blocker (≠ 80/443)
// ===============================
function isBlockedPort(url) {
  try {
    const parsedUrl = new URL(url);
    const port = parsedUrl.port || (parsedUrl.protocol === "https:" ? "443" : "80");
    return port !== "80" && port !== "443";
  } catch (err) {
    console.warn("🚫 Ungültige URL erkannt:", url);
    return false;
  }
}

// 🧠 Patch: fetch()
const originalFetch = window.fetch;
window.fetch = async function (...args) {
  if (args[0] && isBlockedPort(args[0])) {
    console.warn("⛔ Blockierter Port erkannt (fetch):", args[0]);
    return Promise.reject(new Error("Verbindung über unsicheren Port blockiert."));
  }
  return originalFetch.apply(this, args);
};

// 🧠 Patch: XMLHttpRequest
const OriginalXHR = window.XMLHttpRequest;
window.XMLHttpRequest = function () {
  const xhr = new OriginalXHR();
  const originalOpen = xhr.open;
  xhr.open = function (method, url, ...rest) {
    if (url && isBlockedPort(url)) {
      console.warn("⛔ Blockierter Port erkannt (XHR):", url);
      throw new Error("Verbindung über unsicheren Port blockiert.");
    }
    return originalOpen.call(this, method, url, ...rest);
  };
  return xhr;
};

// 🧠 Patch: WebSocket
const OriginalWebSocket = window.WebSocket;
window.WebSocket = function (url, ...rest) {
  if (isBlockedPort(url)) {
    console.warn("⛔ Blockierter Port erkannt (WebSocket):", url);
    throw new Error("WebSocket über unsicheren Port blockiert.");
  }
  return new OriginalWebSocket(url, ...rest);
};

// 🧠 Patch: RTCPeerConnection (WebRTC)
const OriginalRTCPeerConnection = window.RTCPeerConnection;
window.RTCPeerConnection = function (config) {
  if (config?.iceServers) {
    config.iceServers = config.iceServers.filter(server => {
      try {
        const urls = Array.isArray(server.urls) ? server.urls : [server.urls || server.url];
        return urls.every(urlStr => {
          const url = new URL(urlStr);
          const port = url.port;
          if (port && port !== "80" && port !== "443") {
            console.warn("⛔ WebRTC ICE-Server blockiert (Port):", urlStr);
            return false;
          }
          return true;
        });
      } catch (e) {
        return true;
      }
    });
  }
  return new OriginalRTCPeerConnection(config);
};

console.log("✅ PortBlocker aktiv. Nur Verbindungen über Port 80/443 erlaubt.");
