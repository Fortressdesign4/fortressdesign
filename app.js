(() => {
  'use strict';

  // Google Fonts URL für Poppins
  const fontUrl = 'https://fonts.googleapis.com/css2?family=Poppins&display=swap';

  // Fonts per Fetch laden und als Style einfügen
  fetch(fontUrl)
    .then(res => {
      if (!res.ok) throw new Error('Fonts konnten nicht geladen werden');
      return res.text();
    })
    .then(css => {
      const styleFont = document.createElement('style');
      styleFont.textContent = css;
      document.head.appendChild(styleFont);
    })
    .catch(() => {
      console.warn('Fonts konnten nicht geladen werden.');
    });

  // Styles injizieren
  const css = `
    * {
      margin: 0; padding: 0; box-sizing: border-box;
    }
    body, html, #root {
      height: 100%;
      font-family: 'Poppins', Arial, sans-serif;
      background: #000;
      color: #fff;
    }
    #root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .nav {
      background: #111;
      border-bottom: 1px solid #444;
    }
    .nav ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .nav li {
      padding: 10px 15px;
    }
    .nav li a {
      color: #fff;
      text-decoration: none;
      font-size: 18px;
      transition: color 0.3s ease;
      display: block;
    }
    .nav li a:hover,
    .nav li a.active {
      transition: 0.18s all ease-out;
      color: lightblue;
      padding: 0 15px;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1em;
      border-bottom: 1px solid #444;
    }
    .pages .content{
    display: flex;
    }
    .top h1 {
      font-size: 2rem;
    }
    .pages {
      max-width: calc(100% - 20%);
      width: 980px;
      margin: 25px auto;
      padding: 1em 2em;
      background: #111;
      border-radius: 8px;
      box-shadow: 2px 2px 18px lightblue;
      flex-grow: 1;
    }
    .pages.startseite { background-color: #001f3f; }
    .pages.leistungen { background-color: #003366; }
    .pages.referenzen { background-color: #004080; }
    .pages.kontakt { background-color: #00264d; }
    @media (max-width: 600px) {
      .nav ul {
        flex-direction: column;
        align-items: center;
      }
      .nav li {
        padding: 8px 0;
        width: 100%;
        text-align: center;
      }
      .top {
        flex-direction: column;
        gap: 0.5em;
      }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Daten
  const pagesData = [
    {
      name: 'Fortressdesign',
      nav: [
        { name: 'Startseite', href: '#startseite', class: 'startseite' },
        { name: 'Leistungen', href: '#leistungen', class: 'leistungen' },
        { name: 'Referenzen', href: '#referenzen', class: 'referenzen' },
        { name: 'Kontakt', href: '#kontakt', class: 'kontakt' },
      ]
    }
  ];
const leistungen={
  { name:"webdesign", image: "./images/webdesign.png"}
  ]
  const pageContent = {
    startseite: `<h2>Willkommen auf der Startseite</h2>
                 <p>Herzlich Willkommen auf Fortressdesign</p>
                 <h1>Auszug unserer <span style="color:lightblue">Leistungen</span></h1>
                 <div class="content">
                 <section class="webdesign"><img src="./images/webdesign.png" alt="Webdesign"></section>`,
    leistungen: '<h2>Unsere Leistungen</h2><p>Beschreibung der Leistungen.</p>',
    referenzen: '<h2>Referenzen</h2><p>Einige Kundenreferenzen.</p>',
    kontakt: '<h2>Kontakt</h2><p>So erreichen Sie uns...</p>'
  };

  const root = document.getElementById('root');

  // Navigation html bauen
  let navHtml = '<nav class="nav"><ul>';
  pagesData[0].nav.forEach(item => {
    navHtml += `<li><a href="${item.href}" id="nav-${item.class}">${item.name}</a></li>`;
  });
  navHtml += '</ul></nav>';

  // Grundstruktur
  root.innerHTML = `
    <div class="top">
      <h1>${pagesData[0].name}</h1>
      ${navHtml}
    </div>
    <div class="pages"></div>
  `;

  const pagesDiv = root.querySelector('.pages');
  const navLinks = root.querySelectorAll('.nav a');

  function render() {
    let hash = window.location.hash.slice(1).toLowerCase();
    if (!hash || !pageContent[hash]) hash = 'startseite';

    pagesDiv.innerHTML = pageContent[hash];
    pagesDiv.className = 'pages ' + hash;

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + hash);
    });
  }

  // Erstes Rendern
  render();

  // Auf Hash-Änderung reagieren
  window.addEventListener('hashchange', render);

})();
