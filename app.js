(function(){
  // Richtiges Objekt-Format in Array
  const page = [
    { 
      name: "Fortressdesign",
      nav: [
        { name:"Startseite", href:"?startseite" },
        { name:"Leistungen", href:"?leistungen" },
        { name:"Referenzen", href:"?referenzen" }
      ]
    }
  ];

  // Korrekte Schreibweise: getElementById
  const app = document.getElementById('root');

  // Erstelle Navigation HTML aus nav-Array
  const navHtml = page[0].nav.map(item => 
    `<a href="${item.href}">${item.name}</a>`
  ).join(' ');

  // Setze kompletten Inhalt mit nav rein
  app.innerHTML = `
    <div class="top">
      <h1>${page[0].name}</h1>
      <nav class="nav">${navHtml}</nav>
    </div>
  `;
})();
