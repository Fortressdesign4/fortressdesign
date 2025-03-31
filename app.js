(function () {
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
    background-image: url("https://github.com/Fortressdesign4/fortressdesign/blob/main/bg.png");
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
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
      transition: right 0.3s ease;
      z-index: 1000;
    }
    .nav-bar.active {
      right: 0;
    }
    body.dark {
      background: #121212;
      color: #f0f0f0;
    }
    body.dark .top {
      background: #1f1f1f;
    }
    body.dark .nav-bar {
      background: #222;
    }
    body.dark .nav-icon,
    body.dark .dark-toggle {
      background: #333;
      color: #f0f0f0;
    }
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #222;
      color: #fff;
      padding: 15px 20px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 9999;
    }
    .cookie-banner button {
      margin-left: 10px;
      padding: 6px 12px;
      font-size: 14px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .cookie-accept {
      background-color: #28a745;
      color: #fff;
    }
    .cookie-decline {
      background-color: #dc3545;
      color: #fff;
    }
      #root .top{
      display: flex;
      juatify-content: space-between;
      }
  `;
  document.head.appendChild(style);

  // --- HTML-Struktur via JS ---
  const app = `
    <div class="top">
      <h1>Fortressdesign</h1><div class="nav-icon"><i class="fa-solid fa-bars"></i></div>
      <div style="display: flex; gap: 10px;">
        <button class="dark-toggle">🌓</button>
      </div>
    </div>
    <div class="nav-bar" id="navBar">
      <h2>Navigation</h2><span>&times;</span>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Projekte</a></li>
        <li><a href="#">Kontakt</a></li>
      </ul>
    </div>
    <header id="header" style="padding:20px;">
    <h1>Willkommen bei Fortressdesign</h1>
      <p>Willkommen bei Fortressdesign. Toggle Dark Mode, Navigation & Cookie-Zustimmung!</p>
    </header>
  `;

  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = app;

    // Navigation Toggle
    const navIcon = root.querySelector('.nav-icon');
    const navBar = document.getElementById('navBar');
    navIcon.addEventListener('click', () => {
      navBar.classList.toggle('active');
    });

    // Dark Mode Toggle
    const toggleBtn = root.querySelector('.dark-toggle');
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });

    // Cookie Consent Banner
    const status = localStorage.getItem("cookieConsent");
    if (status === "accepted") {
      loadAnalytics();
    } else if (!status) {
      showCookieBanner();
    }
  }

  // --- Cookie Banner anzeigen ---
  function showCookieBanner() {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.innerHTML = `
      <div>
        🍪 Diese Website verwendet Cookies für Technik & – mit Zustimmung – Google Analytics.
      </div>
      <div>
        <button class="cookie-accept">Zustimmen</button>
        <button class="cookie-decline">Ablehnen</button>
      </div>
    `;
    document.body.appendChild(banner);

    banner.querySelector(".cookie-accept").addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "accepted");
      banner.remove();
      loadAnalytics();
    });

    banner.querySelector(".cookie-decline").addEventListener("click", () => {
      localStorage.setItem("cookieConsent", "declined");
      banner.remove();
      console.log("🚫 Analytics abgelehnt");
    });
  }

  // --- Analytics nur bei Zustimmung laden ---
  function loadAnalytics() {
    console.log("📊 Lade Google Analytics...");
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-JYCZLWZZVD'; // Deine GA-ID
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-JYCZLWZZVD'); // GA-ID auch hier

    console.log("✅ Google Analytics aktiviert");
  }
})();
