// Event listener for Enter key in URL input
document.getElementById('urlInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
      let url = e.target.value.trim();
      if (url) {
          url = formatUrlInput(url);
          addSiteEntry(url);
          e.target.value = '';
      }
  }
});

// Function to format and validate URL input
function formatUrlInput(url) {
  // Add https:// if not present
  if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
  }
  return url;
}

// Function to add a site entry
async function addSiteEntry(url) {
  const faviconUrl = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`;
  const formattedTitle = formatUrl(url);

  try {
      const response = await fetch(`https://api.microlink.io?url=${url}`);
      const data = await response.json();
      const title = data.data.title || formattedTitle;
      saveSiteEntry(url, faviconUrl, title);
  } catch (error) {
      console.error('Error fetching site title:', error);
      saveSiteEntry(url, faviconUrl, formattedTitle);
  }
}

// Function to save a site entry to local storage
function saveSiteEntry(url, faviconUrl, title) {
  const entries = getEntries();
  entries.push({ url, faviconUrl, title });
  localStorage.setItem('siteEntries', JSON.stringify(entries));
  displaySiteEntries(entries);
}

// Function to display all site entries
function displaySiteEntries(entries) {
  const siteList = document.getElementById('siteList');
  siteList.innerHTML = '';
  entries.forEach((entry, index) => {
      const entryElement = document.getElementById('siteEntryTemplate').content.cloneNode(true);
      entryElement.querySelector('img').src = entry.faviconUrl;
      entryElement.querySelector('span').textContent = entry.title;

      // Add event listeners to buttons
      entryElement.querySelector('.move-up').addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent the event from bubbling up
          moveEntry(index, -1);
      });

      entryElement.querySelector('.move-down').addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent the event from bubbling up
          moveEntry(index, 1);
      });

      entryElement.querySelector('.remove').addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent the event from bubbling up
          removeEntry(index);
      });

      // Make the site entry clickable
      entryElement.querySelector('.site-entry').addEventListener('click', () => {
          window.location.href = entry.url;
      });

      siteList.appendChild(entryElement);
  });
}

// Function to move an entry up or down
function moveEntry(index, direction) {
  const entries = getEntries();
  const newIndex = index + direction;
  if (newIndex >= 0 && newIndex < entries.length) {
      [entries[index], entries[newIndex]] = [entries[newIndex], entries[index]];
      localStorage.setItem('siteEntries', JSON.stringify(entries));
      displaySiteEntries(entries);
  }
}

// Function to remove an entry
function removeEntry(index) {
  const entries = getEntries();
  entries.splice(index, 1);
  localStorage.setItem('siteEntries', JSON.stringify(entries));
  displaySiteEntries(entries);
}

// Function to format URL for display
function formatUrl(url) {
  let formattedUrl = url.replace(/^https?:\/\/(?:www\.)?/, '');
  formattedUrl = formattedUrl.replace(/\.(com|net|org)$/, '');
  formattedUrl = formattedUrl.charAt(0).toUpperCase() + formattedUrl.slice(1);
  return formattedUrl;
}

// Function to get entries from local storage
function getEntries() {
  const entries = localStorage.getItem('siteEntries');
  return entries ? JSON.parse(entries) : [];
}

// Load entries on page load
function loadEntries() {
  const entries = getEntries();
  displaySiteEntries(entries);
}

// Initial load of entries
window.addEventListener('load', loadEntries);