(function(){
    const page = [
      { name: "Fortressdesign", nav:[
          { name:"Startseite", href:"#startseite" },
          { name:"Leistungen", href:"#leistungen" },
          { name:"Referenzen", href:"#referenzen" },
          { name:"Kontakt", href:"#kontakt" }
      ]}
    ];

    // Inhalte für die Seiten
    const pageContent = {
      startseite: '<h2>Willkommen auf der Startseite</h2><p>Hier ist der Inhalt der Startseite.</p>',
      leistungen: '<h2>Unsere Leistungen</h2><p>Beschreibung der Leistungen.</p>',
      referenzen: '<h2>Referenzen</h2><p>Einige Kundenreferenzen.</p>',
      kontakt: '<h2>Kontakt</h2><p>So erreichen Sie uns...</p>'
    };

    const app = document.getElementById('root');

    // Baue Navigation
    let navHtml = '<nav class="nav">';
    page[0].nav.forEach(item => {
      navHtml += `<a href="${item.href}" id="nav-${item.name.toLowerCase()}">${item.name}</a>`;
    });
    navHtml += '</nav>';

    // Setze Grundstruktur
    app.innerHTML = `
      <div class="top">
        <h1>${page[0].name}</h1>
        ${navHtml}
      </div>
      <div class="pages"></div>
    `;

    const pagesContainer = app.querySelector('.pages');
    const navLinks = app.querySelectorAll('.nav a');

    function renderPage(){
      let hash = window.location.hash.substring(1).toLowerCase();
      if (!hash || !pageContent[hash]) hash = 'startseite';

      // Inhalt aktualisieren
      pagesContainer.innerHTML = pageContent[hash];

      // Aktiven Nav-Link markieren
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

    // Bei Hash-Änderung neu rendern
    window.addEventListener('hashchange', renderPage);

  })();
