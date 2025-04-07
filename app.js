(function () {
  // --- Speichern des API-Schlüssels im Cookie ---
  function setApiKeyCookie(apiKey) {
    const d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000)); // 1 Jahr gültig
    const expires = "expires="+ d.toUTCString();
    document.cookie = "apiKey=" + apiKey + "; SameSite=None; Secure; " + expires + ";path=/";
  }

  function getApiKeyCookie() {
    const name = "apiKey=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // --- Beispiel für die Verwendung des API-Schlüssels ---
  const apiKey = getApiKeyCookie();
  if (apiKey) {
    console.log("API-Schlüssel geladen:", apiKey);
    // Hier können Sie den API-Schlüssel verwenden
  } else {
    const newApiKey = prompt("Bitte geben Sie Ihren API-Schlüssel ein:");
    if (newApiKey) {
      setApiKeyCookie(newApiKey);
      console.log("API-Schlüssel gespeichert:", newApiKey);
    }
  }

  // --- Dynamisches CSS inkl. Dark Mode, Nav & Cookie-Banner ---
  const style = document.createElement("style");
  style.textContent = `
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      transition: background 0.3s, color 0.3s;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #222;
      color: #fff;
      padding: 10px 20px;
    }
    #root header{
    height:50%;
    background-image: url('https://github.com/Fortressdesign4/fortressdesign/blob/main/bg.png');
    }
    .nav-icon, .dark-toggle {
      cursor: pointer;
      font-size: 20px;
      padding: 5px 10px;
      background: #333;
      color: white;
      border: none;
      border-radius: 5px;
    }
    .dark-toggle {
      margin-left: 10px;
    }
    .nav-bar {
      position: fixed;
      top: 0;
      right: -300px;
      width: 250px;
      height: 100vh;
      background: #444;
      color: white;
      padding: 20px;
      box-shadow: -2` ▋
