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

const dropdown = document.querySelector('.dropdown');
const dropdownContent = document.getElementById('dropdownContent');

// Expand the dropdown when it gains focus
dropdown.addEventListener('focus', function() {
  dropdownContent.style.maxHeight = '300px';
  dropdownContent.style.opacity = '1';
});

// Collapse the dropdown when it loses focus, unless it loses focus to one of its children
dropdown.addEventListener('blur', function() {
  setTimeout(() => {
      if (!dropdown.contains(document.activeElement)) {
          dropdownContent.style.maxHeight = '0';
          dropdownContent.style.opacity = '0';
      }
  }, 100);
});

dropdown.addEventListener('keydown', function(e) {
  const siteEntries = dropdownContent.querySelectorAll('.site-entry');
  let currentIndex = -1;

  siteEntries.forEach((entry, index) => {
      if (entry === document.activeElement) {
          currentIndex = index;
      }
  });

  switch (e.key) {
      case 'ArrowDown':
          e.preventDefault(); // Prevent default behavior of arrow keys
          if (currentIndex < siteEntries.length - 1) {
              siteEntries[currentIndex + 1].focus();
          } else if (currentIndex === -1 && siteEntries.length > 0) {
              siteEntries[0].focus();
          }
          break;
      case 'ArrowUp':
          e.preventDefault(); // Prevent default behavior of arrow keys
          if (currentIndex > 0) {
              siteEntries[currentIndex - 1].focus();
          }
          break;
      case 'Enter':
          e.preventDefault(); // Prevent default behavior of Enter key
          if (currentIndex !== -1) {
              siteEntries[currentIndex].click();
          }
          break;
      case 'Tab':
          // Allow tabbing to move out of the dropdown and collapse it
          dropdownContent.style.maxHeight = '0';
          dropdownContent.style.opacity = '0';
          
          // Allow focus transition to the next element
          setTimeout(() => {
              // Move focus to the next element after collapsing the dropdown
              document.activeElement.blur();
          }, 100);
          break;
      default:
          break;
  }
});

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

function saveSiteEntry(url, faviconUrl, title) {
  const entries = getEntries();
  entries.push({ url, faviconUrl, title });
  localStorage.setItem('siteEntries', JSON.stringify(entries));
  displaySiteEntries(entries);
}

function displaySiteEntries(entries) {
  const siteList = document.getElementById('siteList');
  siteList.innerHTML = '';
  entries.forEach((entry, index) => {
      const entryElement = document.getElementById('siteEntryTemplate').content.cloneNode(true);
      const siteEntry = entryElement.querySelector('.site-entry');
      siteEntry.tabIndex = -1; // Make the site entry not focusable via tab
      siteEntry.querySelector('img').src = entry.faviconUrl;
      siteEntry.querySelector('span').textContent = entry.title;

      siteEntry.addEventListener('focus', () => {
          siteEntry.classList.add('focused');
      });

      siteEntry.addEventListener('blur', () => {
          siteEntry.classList.remove('focused');
      });

      siteEntry.querySelector('.move-up').addEventListener('click', (e) => {
          e.stopPropagation();
          moveEntryUp(index);
      });
      siteEntry.querySelector('.move-down').addEventListener('click', (e) => {
          e.stopPropagation();
          moveEntryDown(index);
      });
      siteEntry.querySelector('.remove').addEventListener('click', (e) => {
          e.stopPropagation();
          removeEntry(index);
      });
      siteEntry.addEventListener('click', () => {
          window.location.href = entry.url;
      });

      siteList.appendChild(entryElement);
  });
}

function formatUrl(url) {
  let formattedUrl = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  formattedUrl = formattedUrl.charAt(0).toUpperCase() + formattedUrl.slice(1);
  return formattedUrl;
}

function getEntries() {
  return JSON.parse(localStorage.getItem('siteEntries')) || [];
}

function moveEntryUp(index) {
  const entries = getEntries();
  if (index > 0) {
      const temp = entries[index - 1];
      entries[index - 1] = entries[index];
      entries[index] = temp;
      localStorage.setItem('siteEntries', JSON.stringify(entries));
      displaySiteEntries(entries);
  }
}

function moveEntryDown(index) {
  const entries = getEntries();
  if (index < entries.length - 1) {
      const temp = entries[index + 1];
      entries[index + 1] = entries[index];
      entries[index] = temp;
      localStorage.setItem('siteEntries', JSON.stringify(entries));
      displaySiteEntries(entries);
  }
}

function removeEntry(index) {
  const entries = getEntries();
  entries.splice(index, 1);
  localStorage.setItem('siteEntries', JSON.stringify(entries));
  displaySiteEntries(entries);
}

function formatUrlInput(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
  }
  return url;
}

document.addEventListener('DOMContentLoaded', function() {
  const entries = getEntries();
  displaySiteEntries(entries);
});
