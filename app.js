(function(){
  // ✅ Richtiges Objekt-Format in Array
  const page = [
    { name: "Fortressdesign" }
  ];

  // ✅ Korrekte Schreibweise: getElementById (nicht getEelementBYid)
  const app = document.getElementById('root');

  // ✅ Korrekte Eigenschaft: innerHTML (nicht innerHtml)
  // ✅ Template literal sauber schließen
  app.innerHTML = `<div class="top">
    <h1>${page[0].name}</h1>
  </div>`;
})();
