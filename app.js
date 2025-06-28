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

})();
