(function(){
  const page = [
    { name: "Fortressdesign", nav:[
        { name:"Startseite", href:"#startseite", key:"startseite" },
        { name:"Leistungen", href:"#leistungen", key:"leistungen" },
        { name:"Referenzen", href:"#referenzen", key:"referenzen" },
        { name:"Kontakt", href:"#kontakt", key:"kontakt" }
    ]}
  ];

  const pageContent = {
    startseite: '<h2>Willkommen auf der Startseite</h2><p>Hier ist der Inhalt der Startseite.</p>',
    leistungen: '<h2>Unsere Leistungen</h2><p>Beschreibung der Leistungen.</p>',
    referenzen: '<h2>Referenzen</h2><p>Einige Kundenreferenzen.</p>',
    kontakt: '<h2>Kontakt</h2><p>So erreichen Sie uns...</p>'
  };

  const app = document.getElementById('root');

  // Navigation bauen
  let navHtml = '<nav class="nav">';
  page[0].nav.forEach(item => {
    navHtml += `<a href="${item.href}" data-key="${item.key}" class="mi">${item.name}</a>`;
  });
  navHtml += '</nav>';

  // Grundstruktur setzen
  app.innerHTML = `
    <div class="top">
      <h1>${page[0].name}</h1>
      ${navHtml}
    </div>
    <div class="pages"></div>
  `;

  const pagesContainer = app.querySelector('.pages');
  const navLinks = app.querySelectorAll('.nav a.mi');

  function renderPage(key){
    if (!key || !pageContent[key]) key = 'startseite';
    pagesContainer.innerHTML = pageContent[key];

    // Aktiven Link markieren
    navLinks.forEach(link => {
      if (link.dataset.key === key) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Klick-Event für alle .mi Links
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const key = e.currentTarget.dataset.key;
      // Seite rendern ohne URL Hash zu ändern
      renderPage(key);
    });
  });

  // Optional: Seite mit URL-Hash laden (initial)
  let initialKey = window.location.hash.substring(1).toLowerCase();
  renderPage(initialKey);

  // Optional: Auch auf Hash-Änderung reagieren
  window.addEventListener('hashchange', () => {
    renderPage(window.location.hash.substring(1).toLowerCase());
  });
(() => {
  const styleContent = `
    /* Reset und Grundstyles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body, html, #root {
      height: 100%;
      font-family: Arial, sans-serif;
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

    #root li a {
      color: #fff;
      text-decoration: none;
      display: block;
      font-size: 18px;
      transition: color 0.3s ease;
    }

    #root .nav li a:hover,
    #root .nav li a.active {
      color: lightblue; 
      padding: 0px 15px; /* z.B. DodgerBlue als Highlight */
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
      border-radius: 8px blue;
      box-shadow: 2px 2px 18px lightblue;
      flex-grow: 1;
    }

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
  styleTag.textContent = styleContent;
  document.head.appendChild(styleTag);
})();

})();
