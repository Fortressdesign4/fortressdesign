(() => {
  'use strict';

  // --- Styles per JS injizieren ---
  const styles = `
    /* Reset und Grundstyles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body, html, #root {
      height: 100%;
      font-family: 'Poppins', Arial, sans-serif;
      background-color: #000;
      color: #fff;
    }

    /* Container */
    #root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Navigation */
    #root .nav {
      background-color: #111;
      border-bottom: 1px solid #444; /* feine Linie unter der Nav */
    }
    #root .nav ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    #root .nav li {
      padding: 10px 15px;
    }
    #root .nav li a {
      color: #fff;
      text-decoration: none;
      display: block;
      font-size: 18px;
      transition: color 0.3s ease;
    }
    #root .nav li a:hover,
    #root .nav li a.active {
      color: lightblue;
      padding: 0 15px;
    }

    /* Top Bereich */
    #root .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1em;
      border-bottom: 1px solid #444; /* feine Linie unter dem Header */
    }
    #root .top h1 {
      font-size: 2rem;
      color: #fff;
    }

    /* Seiteninhalt */
    #root .pages {
      max-width: calc(100% - 20%);
      margin: 25px auto;
      padding: 1em 2em;
      background-color: #111;
      border-radius: 8px;
      box-shadow: 2px 2px 18px lightblue;
      flex-grow: 1;
    }

    /* Beispiel-Seiten-spezifische Styles */
    .pages.startseite { background-color: #001f3f; }
    .pages.leistungen { background-color: #003366; }
    .pages.referenzen { background-color: #004080; }
    .pages.kontakt { background-color: #00264d; }

    /* Responsive Navigation: Hamburger für kleine Bildschirme */
    @media (max-width: 600px) {
      #root .nav ul {
        flex-direction: column;
        align-items: center;
      }
      #root .nav li {
        padding: 8px 0;
        width: 100%;
        text-align: center;
      }
      #root .top {
        flex-direction: column;
        gap: 0.5em;
      }
    }
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);

  // --- SPA-Daten ---
  const page = [
    {
      name: "Fortressdesign",
      nav: [
        { name: "Startseite", href: "#startseite", class: "startseite" },
        { name: "Leistungen", href: "#leistungen", class: "leistungen" },
        { name: "Referenzen", href: "#referenzen", class: "referenzen" },
        { name: "Kontakt", href: "#kontakt", class: "kontakt" }
      ]
    }
  ];

  const pageContent = {
    startseite: '<h2>Willkommen auf der Startseite</h2><p>Hier ist der Inhalt der Startseite.</p>',
    leistungen: '<h2>Unsere Leistungen</h2><p>Beschreibung der Leistungen.</p>',
    referenzen: '<h2>Referenzen</h2><p>Einige Kundenreferenzen.</p>',
    kontakt: '<h2>Kontakt</h2><p>So erreichen Sie uns...</p>'
  };

  // --- DOM Referenzen ---
  const app = document.getElementById('root');

  // Navigation HTML bauen
  let navHtml = '<nav class="nav"><ul>';
  page[0].nav.forEach(item => {
    navHtml += `<li><a href="${item.href}" id="nav-${item.class}">${item.name}</a></li>`;
  });
  navHtml += '</ul></nav>';

  // Grundstruktur setzen
  app.innerHTML = `
    <div class="top">
      <h1>${page[0].name}</h1>
      ${navHtml}
    </div>
    <div class="pages"></div>
  `;

  const pagesContainer = app.querySelector('.pages');
  const navLinks = app.querySelectorAll('.nav a');

  // Seite rendern
  function renderPage() {
    let hash = window.location.hash.substring(1).toLowerCase();
    if (!hash || !pageContent[hash]) hash = 'startseite';

    pagesContainer.innerHTML = pageContent[hash];
    pagesContainer.className = 'pages ' + hash;

    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Erstes Rendern
  renderPage();

  // Auf Hash-Änderung reagieren
  window.addEventListener('hashchange', renderPage);

})();
