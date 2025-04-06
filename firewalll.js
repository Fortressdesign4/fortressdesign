(function nis2DevFirewall() {
    const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  
    if (localStorage.getItem('nis2_banned') === '1' && !isLocal) {
      document.body.innerHTML = '<h1 style="color:red">🚫 Zugriff gesperrt</h1><p>Dauerhafter Bann aktiv. Verbindung verboten.</p><button onclick="localStorage.removeItem(\'nis2_banned\');location.reload()">🔓 Entbannen</button>';
      throw new Error('Zugriff gebannt');
    }
  
    const ban = (reason) => {
      if (isLocal) {
        console.warn('⚠️ Bann ausgelöst, aber lokal erlaubt:', reason);
        return;
      }
      console.warn('[NIS2] BLOCK + BAN:', reason);
      localStorage.setItem('nis2_banned', '1');
      location.href = 'about:blank';
    };
  
    const blockedPorts = [53, 80, 443, 3478, 1935, 19302];
    const pattern = /localhost|127\.0\.0\.1|\[::1]|\.local|\.test|\.invalid|stun:|turn:|ws:|wss:|::/i;
  
    // Kritische APIs blockieren
    try {
      window.RTCPeerConnection = () => null;
      window.WebSocket = () => null;
      navigator.sendBeacon = () => null;
    } catch (e) {}
  
    // fetch blockieren
    const origFetch = window.fetch;
    window.fetch = function (...args) {
      const url = args[0]?.toString() || '';
      if (pattern.test(url) || blockedPorts.some(p => url.includes(':' + p))) {
        ban('Verdächtige fetch-Verbindung: ' + url);
        return Promise.reject('Gebannt');
      }
      return origFetch.apply(this, args);
    };
  
    // XMLHttpRequest blockieren
    const origXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
      const xhr = new origXHR();
      const origOpen = xhr.open;
      xhr.open = function (method, url, ...rest) {
        if (pattern.test(url) || blockedPorts.some(p => url.includes(':' + p))) {
          ban('Verdächtige XHR-Verbindung: ' + url);
          throw new Error('XHR gebannt');
        }
        return origOpen.call(this, method, url, ...rest);
      };
      return xhr;
    };
  
    // TCPv6 Leak Test
    ['http://[::1]:80'].forEach(url => {
      try {
        fetch(url, { mode: 'no-cors' }).then(() => ban('TCPv6 Leak: ' + url)).catch(() => {});
      } catch (e) {}
    });
  
    // ICMP / DNS Leak Test
    const img = new Image();
    img.src = 'http://icmp-leak.test/?x=' + Math.random();
    img.onload = () => ban('ICMP/DNS Leak erkannt');
  
    // UDPv6 Leak Test
    [
      'https://[2001:4860:4860::8888]:3478',
      'https://[2606:4700:4700::1111]:19302'
    ].forEach(url => {
      try {
        fetch(url, { mode: 'no-cors' }).then(() => ban('UDPv6 Leak erkannt: ' + url)).catch(() => {});
      } catch (e) {}
    });
  
    // VPN / Proxy / Cloud Erkennung
    fetch('https://ipapi.co/json')
      .then(r => r.json())
      .then(d => {
        const org = (d?.org || '').toLowerCase();
        const asn = d?.asn || '';
        const banned = /vpn|proxy|cloudflare|aws|azure|digitalocean|google/.test(org) ||
                       ['A1', 'A2'].includes(d?.country_code) ||
                       asn.startsWith('AS1') || asn.startsWith('AS2');
        if (banned) ban('VPN/Cloud erkannt: ' + org);
      });
  
    console.log('[NIS2] Entwicklungsfirewall aktiv (Whitelist: localhost erlaubt)');
  })();
  
