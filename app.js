(() => {
  'use strict';

  // Google Fonts per XHR laden und als <style> einfügen
  const loadGoogleFonts = () => {
    const url = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const styleTag = document.createElement('style');
        styleTag.id = 'poppins-font-style';
        styleTag.textContent = xhr.responseText;
        document.head.appendChild(styleTag);
        console.log('[Fonts] Poppins font CSS loaded and injected.');
      } else {
        console.error('[Fonts] Fehler beim Laden der Google Fonts CSS:', xhr.status);
      }
    };
    xhr.onerror = () => {
      console.error('[Fonts] Netzwerkausfall beim Laden der Google Fonts CSS');
    };
    xhr.send();
  };

  loadGoogleFonts();

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

  function renderPage() {
    let hash = window.location.hash.substring(1).toLowerCase();
    if (!hash || !pageContent[hash]) hash = 'startseite';

    // Inhalt und Klasse setzen
    pagesContainer.innerHTML = pageContent[hash];
    pagesContainer.className = 'pages ' + hash;

    // Aktiven Nav-Link markieren
    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  renderPage();
  window.addEventListener('hashchange', renderPage);

})();
