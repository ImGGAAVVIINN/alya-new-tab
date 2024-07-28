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
  dropdownContent.style.maxHeight = '800px';
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
      e.preventDefault();
      if (currentIndex < siteEntries.length - 1) {
        siteEntries[currentIndex + 1].focus();
      } else if (currentIndex === -1 && siteEntries.length > 0) {
        siteEntries[0].focus();
      }
      break;
    case 'ArrowUp':
      e.preventDefault();
      if (currentIndex > 0) {
        siteEntries[currentIndex - 1].focus();
      } else if (currentIndex === -1 && siteEntries.length > 0) {
        siteEntries[siteEntries.length - 1].focus();
      }
      break;
    case 'Enter':
      if (currentIndex !== -1) {
        if (e.ctrlKey) {
          window.open(siteEntries[currentIndex].dataset.url, '_blank');
        } else {
          siteEntries[currentIndex].click();
        }
      }
      break;
    case 'Tab':
      dropdown.blur();
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
    siteEntry.querySelector('img').src = entry.faviconUrl;
    const siteTitle = siteEntry.querySelector('.site-title');
    const renameInput = siteEntry.querySelector('.rename-input');

    siteEntry.dataset.url = entry.url; // Store the URL in a data attribute

    siteTitle.textContent = entry.title;

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
    siteEntry.querySelector('.rename').addEventListener('click', (e) => {
      e.stopPropagation();
      renameInput.style.display = 'inline-block';
      siteTitle.style.display = 'none';
      renameInput.value = siteTitle.textContent;
      renameInput.focus();
    });
    renameInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    renameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const newTitle = renameInput.value.trim();
        if (newTitle) {
          entry.title = newTitle;
          localStorage.setItem('siteEntries', JSON.stringify(entries));
          displaySiteEntries(entries);
        }
      }
    });
    renameInput.addEventListener('blur', () => {
      renameInput.style.display = 'none';
      siteTitle.style.display = 'inline-block';
    });
    siteEntry.querySelector('.remove').addEventListener('click', (e) => {
      e.stopPropagation();
      removeEntry(index);
    });
    siteEntry.addEventListener('click', (e) => {
      if (e.button === 0) { // Left click
        window.location.href = entry.url;
      }
    });
    siteEntry.addEventListener('auxclick', (e) => {
      if (e.button === 1) { // Middle click
        window.open(entry.url, '_blank');
      }
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

document.addEventListener('DOMContentLoaded', (event) => {
  const siteList = document.getElementById('siteList');

  siteList.addEventListener('mouseenter', (event) => {
    const target = event.target;
    if (target.classList.contains('site-title')) {
      const wrapperWidth = target.parentElement.offsetWidth;
      const textWidth = target.scrollWidth;

      if (textWidth > wrapperWidth) {
        target.style.animation = 'scrollText 5s linear infinite';
      } else {
        target.style.animation = 'none';
      }
    }
  }, true);

  siteList.addEventListener('mouseleave', (event) => {
    const target = event.target;
    if (target.classList.contains('site-title')) {
      target.style.animation = 'none';
    }
  }, true);
});
