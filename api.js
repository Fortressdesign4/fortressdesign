(function () {
  const accessToken = 'SuperSecretAccessToken987!'; // Muss zum Server passen
  const url = '/js/1?_=' + Date.now(); // Cache-Busting

  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader('accesstoken', accessToken);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const script = document.createElement('script');
          script.text = xhr.responseText;
          document.body.appendChild(script);
        } catch (err) {
          console.error('❌ Fehler beim Ausführen des JS:', err);
        }
      } else {
        console.error(`❌ Fehler beim Laden von ${url}: Status ${xhr.status}`);
      }
    }
  };

  xhr.send();
})();
