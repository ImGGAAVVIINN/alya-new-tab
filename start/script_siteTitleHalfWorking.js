document.getElementById('urlInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
      const url = e.target.value.trim();
      if (url) {
          addSiteEntry(url);
          e.target.value = '';
      }
  }
});

function addSiteEntry(url) {
  const faviconUrl = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

  fetch(proxyUrl)
      .then(response => response.text())
      .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          let title = url;

          if (doc) {
              const titleElement = doc.querySelector('title');
              title = titleElement ? titleElement.innerText : url;
          }

          displaySiteEntry(url, faviconUrl, title);
      })
      .catch(() => {
          displaySiteEntry(url, faviconUrl, 'Unnamed Site');
      });
}

function displaySiteEntry(url, faviconUrl, title) {
  const siteList = document.getElementById('siteList');
  const entry = document.createElement('div');
  entry.className = 'site-entry';
  entry.innerHTML = `<img src="${faviconUrl}" alt="favicon" /><span>${title}</span>`;
  entry.addEventListener('click', () => {
      window.location.href = url;
  });
  siteList.appendChild(entry);
}
