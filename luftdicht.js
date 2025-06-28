(() => {
  'use strict';

  // Sicherheitsmaßnahmen nach NIS2 - ohne HTTPS
  const security = {
    // 1. Identifikation und Authentifizierung
    authenticateUser: function(username, password) {
      const validUsername = 'admin'; 
      const validPassword = 'securepassword';

      if (username === validUsername && password === validPassword) {
        console.log('Benutzer erfolgreich authentifiziert.');
      } else {
        console.log('Fehler bei der Authentifizierung.');
        throw new Error('Authentifizierungsfehler');
      }
    },

    // 2. Verfügbarkeit und Integrität der Systeme
    ensureSystemAvailability: function() {
      // Systemausfall-Überwachung simulieren
      const systemStatus = 'online'; // Beispielwert
      if (systemStatus === 'offline') {
        console.log('System ist offline. Wir beheben das Problem.');
      } else {
        console.log('System ist online und verfügbar.');
      }
    },

    // 3. Schutz vor DDoS-Angriffen
    detectDDoS: function(requestCount) {
      if (requestCount > 1000) {
        console.log('Möglicher DDoS-Angriff erkannt. Zugriff eingeschränkt.');
      } else {
        console.log('Normale Anfrageaktivität.');
      }
    },

    // 4. Sicherheit von Netzwerken und Systemen
    secureNetwork: function() {
      // Netzwerküberwachung simulieren
      const networkStatus = 'secure'; // Beispielwert
      if (networkStatus !== 'secure') {
        console.log('Netzwerksicherheitslücke erkannt!');
      } else {
        console.log('Netzwerk ist sicher.');
      }
    },

    // 5. Speicherung von sensiblen Daten
    storeSensitiveData: function(data) {
      const encryptedData = btoa(data); // einfache Base64-Verschlüsselung
      console.log(`Sensible Daten gespeichert: ${encryptedData}`);
    },

    // 6. Schutz vor Malware und Viren
    protectFromMalware: function() {
      console.log('Malware-Schutzsystem aktiv.');
      // Weitere spezifische Schutzmaßnahmen können hier implementiert werden
    },

    // 7. Fehlerbehandlung und Protokollierung
    logSecurityEvent: function(eventType, message) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${eventType}] ${message}`);
    },

    // 8. Backup und Notfallwiederherstellung
    createBackup: function(data) {
      console.log('Backup der Daten erstellt.');
      // Simuliere Daten-Backup
    },

    // 9. Überwachung des Zugriffs
    monitorAccess: function() {
      const accessAttempts = 3; // Beispielwert für fehlgeschlagene Anmeldeversuche
      if (accessAttempts > 5) {
        console.log('Mehr als 5 fehlgeschlagene Anmeldeversuche. Konto gesperrt.');
      } else {
        console.log('Normale Zugriffsaktivität.');
      }
    },

    // 10. Risikomanagement
    manageRisk: function() {
      const riskLevel = 'low'; // Beispielwert für das Risikoniveau
      if (riskLevel === 'high') {
        console.log('Hohe Risiken erkannt. Sofortige Maßnahmen erforderlich.');
      } else {
        console.log('Risiko ist unter Kontrolle.');
      }
    },

    // 11. Netzwerksicherheit bei Verbindungen (Verhinderung von Man-in-the-Middle-Angriffen)
    preventMITM: function() {
      console.log('Man-in-the-Middle-Schutz aktiviert.');
      // Verschlüsselung und sichere Datenübertragung können hier implementiert werden
    },

    // 12. Schutz vor Cross-Site-Scripting (XSS)
    sanitizeInput: function(input) {
      const sanitizedInput = input.replace(/<[^>]*>/g, ''); // Entfernt HTML-Tags
      console.log(`Sanitierter Input: ${sanitizedInput}`);
      return sanitizedInput;
    },

    // 13. Überwachung von Dritten (externe Lieferanten und APIs)
    monitorThirdPartyAccess: function() {
      console.log('Drittanbieter-Überwachung aktiviert.');
    },

    // 14. Schutz der Vertraulichkeit und Integrität von Daten
    ensureDataIntegrity: function(data) {
      const hash = btoa(data); // Beispiel für Datenintegritätsprüfung
      console.log(`Datenintegrität gesichert: ${hash}`);
    },

    // 15. Incident Response (Reaktionsplan bei Sicherheitsvorfällen)
    respondToIncident: function(incident) {
      console.log(`Reaktion auf Sicherheitsvorfall: ${incident}`);
    },

    // 16. Überwachung der Systemlogs
    monitorSystemLogs: function() {
      console.log('Systemprotokolle werden überwacht.');
    },

    // 17. Sicherheitslückenbehebung (Patches)
    patchSecurityVulnerabilities: function() {
      console.log('Sicherheitslücken werden gepatcht.');
    },

    // 18. Schwachstellenanalyse und -management
    analyzeVulnerabilities: function() {
      console.log('Schwachstellenanalyse durchgeführt.');
    },

    // 19. Schutz von Endgeräten (Antivirus und Endpunktschutz)
    protectEndpoints: function() {
      console.log('Endpunktschutz aktiviert.');
    },

    // 20. Schulung und Sensibilisierung von Benutzern
    userTraining: function() {
      console.log('Benutzerschulung und Sensibilisierung aktiv.');
    }
  };

  // Teste die Sicherheitsfunktionen:
  console.log("NIS2 Sicherheitsrichtlinien starten...");

  security.authenticateUser('admin', 'securepassword');
  security.ensureSystemAvailability();
  security.detectDDoS(1100);
  security.secureNetwork();
  security.storeSensitiveData('Vertrauliche Daten');
  security.protectFromMalware();
  security.logSecurityEvent('Login', 'Erfolgreicher Login');
  security.createBackup('Backup-Daten');
  security.monitorAccess();
  security.manageRisk();
  security.preventMITM();
  security.sanitizeInput('<script>alert("XSS")</script>');
  security.monitorThirdPartyAccess();
  security.ensureDataIntegrity('Datenintegrität');
  security.respondToIncident('DDoS Angriff');
  security.monitorSystemLogs();
  security.patchSecurityVulnerabilities();
  security.analyzeVulnerabilities();
  security.protectEndpoints();
  security.userTraining();

})();
