// ===============================
// 🛡️ LeakBlocker – Luftdichte Keyword-Erkennung
// ===============================
const leakBlockerKeywords = [
  "leak", "datenleck", "firewall", "vpn", "webrtc", "ip-blocker",
  "datensicherheit", "proxy", "rtsp", "rtmp", "dash", "exfiltration",
  "media stream", "media leak", "sicherheitsaudit", "incident response",
  "access control", "data loss", "data breach", "iso 27001", "nis2",
  "multi-factor authentication", "zero trust", "phishing", "malware",
  "penetration test", "audit trail", "threat intelligence", "key management",
  "vulnerability", "logging", "mfa", "authentifizierung", "encryption"
  // ... du kannst hier beliebig erweitern
];

// ===============================
// 🔍 Helper: Normalize Input
// ===============================
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFKC") // Unicode Normalisierung
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Zero-width chars
    .replace(/[\s\-\._]+/g, "") // Trennzeichen entfernen
    .replace(/[0@]/g, "o") // einfache Leetspeak-Korrekturen
    .replace(/[1!|]/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t");
}

// ===============================
// 🔍 Luftdichte Leak Scanner Funktion
// ===============================
function scanTextForLeaks(text) {
  const normalized = normalize(text);
  return leakBlockerKeywords.some(keyword => normalized.includes(normalize(keyword)));
}

// ===============================
// 🧪 Beispieltest
// ===============================
const examples = [
  "Diese Seite nutzt ein V P N", // absichtlich mit Unicode-Leerzeichen
  "F1rewall aktiv",
  "ISO-27001 🔐 zertifiziert",
  "Kein Le@k hier!",
  "Zugangskontrolle aktiviert",
  "Zero Trust Architektur" // mit Unicode Space
];

examples.forEach(example => {
  if (scanTextForLeaks(example)) {
    console.warn("⚠️ Leak erkannt:", example);
  } else {
    console.log("✅ Unauffällig:", example);
  }
});
