window.onload = function() {
  setTimeout(function() {
      window.scrollTo(0, 0); // Scrolls to the top-left corner of the page
  }, 100); // 100 milliseconds = 0.1 second

  setTimeout(function() {
      window.scrollTo(0, 0); // Scrolls to the top-left corner of the page
  }, 200); // 200 milliseconds = 0.2 second

  setTimeout(function() {
      window.scrollTo(0, 0); // Scrolls to the top-left corner of the page
  }, 500); // 500 milliseconds = 0.5 second

  setTimeout(function() {
      window.scrollTo(0, 0); // Scrolls to the top-left corner of the page
  }, 1000); // 1000 milliseconds = 1 second
};

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
  const formattedTitle = formatUrl(url);
  
  // Primary favicon URL (Google's service)
  let faviconUrl = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`;
  
  try {
    const response = await fetch(`https://api.microlink.io?url=${url}`);
    const data = await response.json();
    const title = data.data.title || formattedTitle;
    
    // Try to get favicon from microlink.io API as well
    const apiFaviconUrl = data.data.logo || data.data.image;
    if (apiFaviconUrl) {
      // Handle both string URLs and object URLs
      if (typeof apiFaviconUrl === 'string') {
        faviconUrl = apiFaviconUrl;
      } else if (apiFaviconUrl && apiFaviconUrl.url) {
        faviconUrl = apiFaviconUrl.url;
      }
    }
    
    saveSiteEntry(url, faviconUrl, title);
  } catch (error) {
    console.error('Error fetching site data:', error);
    saveSiteEntry(url, faviconUrl, formattedTitle);
  }
}

function createImageWithFallback(faviconUrl, fallbackUrl, altText = "Site Icon") {
  const img = document.createElement('img');
  img.alt = altText;
  img.style.width = '15px';
  img.style.height = '15px';
  img.style.marginTop = '8px';
  
  // Ensure faviconUrl is a string, not an object
  let finalFaviconUrl = faviconUrl;
  if (typeof faviconUrl === 'object' && faviconUrl.url) {
    finalFaviconUrl = faviconUrl.url;
  } else if (typeof faviconUrl !== 'string') {
    console.warn('Invalid favicon URL format:', faviconUrl);
    finalFaviconUrl = fallbackUrl; // Use fallback immediately if format is wrong
  }
  
  // Primary favicon URL
  img.src = finalFaviconUrl;
  
  // Fallback when primary fails
  img.onerror = function() {
    console.log('Primary favicon failed, trying fallback for:', finalFaviconUrl);
    
    if (this.src !== fallbackUrl) {
      this.src = fallbackUrl;
      
      // If fallback also fails, use a default icon or letter
      this.onerror = function() {
        console.log('Fallback favicon also failed, using default');
        // You can either use a default icon URL or create a text-based icon
        this.style.display = 'none'; // Hide the broken image
        
        // Create a text-based fallback
        const textIcon = document.createElement('div');
        textIcon.style.width = '15px';
        textIcon.style.height = '15px';
        textIcon.style.marginTop = '8px';
        textIcon.style.backgroundColor = '#4285f4';
        textIcon.style.color = 'white';
        textIcon.style.fontSize = '10px';
        textIcon.style.textAlign = 'center';
        textIcon.style.lineHeight = '15px';
        textIcon.style.borderRadius = '2px';
        
        // Extract domain name for the letter
        try {
          const domain = new URL(fallbackUrl.includes('://') ? fallbackUrl : 'https://' + fallbackUrl).hostname;
          textIcon.textContent = domain.charAt(0).toUpperCase();
        } catch(e) {
          textIcon.textContent = '?';
        }
        
        // Replace the img with the text icon
        this.parentNode.replaceChild(textIcon, this);
      };
    }
  };
  
  return img;
}

function saveSiteEntry(url, faviconUrl, title) {
  const entries = getEntries();
  entries.push({ url, faviconUrl, title });
  localStorage.setItem('siteEntries', JSON.stringify(entries));
  displaySiteEntries(entries);
}

function applySiteListStyle() {
  const siteList = document.getElementById('siteList');
  if (siteList.children.length > 0) {
    siteList.style.padding = '8px';
    siteList.style.paddingTop = '6px';
  } else {
    siteList.style.paddingLeft = '8px';
    siteList.style.paddingRight = '8px';
    siteList.style.paddingTop = '';
    siteList.style.paddingBottom = '';
  }
}

function displaySiteEntries(entries) {
  const siteList = document.getElementById('siteList');
  siteList.innerHTML = '';
  entries.forEach((entry, index) => {
    const entryElement = document.getElementById('siteEntryTemplate').content.cloneNode(true);
    const siteEntry = entryElement.querySelector('.site-entry');
    
    // Replace the existing img with our fallback-enabled version
    const existingImg = siteEntry.querySelector('img');
    const domain = new URL(entry.url).hostname;
    const fallbackFaviconUrl = `https://favicon.yandex.net/favicon/${domain}`;
    const newImg = createImageWithFallback(entry.faviconUrl, fallbackFaviconUrl, 'Site Icon');
    existingImg.parentNode.replaceChild(newImg, existingImg);
    
    const siteTitle = siteEntry.querySelector('.site-title');
    const renameInput = siteEntry.querySelector('.rename-input');

    siteEntry.dataset.url = entry.url;
    siteTitle.textContent = entry.title;

    // ... rest of your existing displaySiteEntries code remains the same
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
      if (e.button === 0) {
        window.location.href = entry.url;
      }
    });
    siteEntry.addEventListener('auxclick', (e) => {
      if (e.button === 1) {
        window.open(entry.url, '_blank');
      }
    });

    siteList.appendChild(entryElement);
  });

  applySiteListStyle();
}

document.addEventListener('DOMContentLoaded', function() {
  const entries = getEntries();
  displaySiteEntries(entries);
});

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

//search engine selector
document.addEventListener('DOMContentLoaded', function() {
  const dropdownItems = document.querySelectorAll('#siteList div');

  // Load the saved script on page load
  const savedScript = localStorage.getItem('selectedScript');
  if (savedScript) {
      loadScript(savedScript);
  }

  dropdownItems.forEach(item => {
      item.addEventListener('click', function() {
          const file = this.getAttribute('data-file');
          localStorage.setItem('selectedScript', file); // Save the selected script
          loadScript(file);
      });
  });

  function loadScript(src) {
      // Remove existing script if it exists
      const existingScript = document.getElementById('dynamic-script');
      if (existingScript) {
          existingScript.remove();
      }

      // Create a new script element
      const script = document.createElement('script');
      script.src = src;
      script.id = 'dynamic-script';
      document.body.appendChild(script);
  }
});


//toggle big searchbox
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('metaToggle');
  const metaTag = document.querySelector('meta[http-equiv="Refresh"]');

  // Restore toggle state from localStorage
  const toggleState = localStorage.getItem('metaToggleState');
  if (toggleState === 'true') {
    toggle.checked = true;
    if (!metaTag) {
      addMetaTag();
    }
    // Clear page content and set background color
    clearPageContent();
  }

  toggle.addEventListener('change', toggleMetaRefresh);

  // Check for removal request from bigSearchBox.html
  if (localStorage.getItem('removeMetaTag') === 'true') {
    removeMetaTag();
    localStorage.removeItem('removeMetaTag');
  }
});

function toggleMetaRefresh() {
  const toggle = document.getElementById('metaToggle');

  if (toggle.checked) {
    addMetaTag();
    localStorage.setItem('metaToggleState', 'true');
    clearPageContent(); // Clear the page content and set background color
  } else {
    removeMetaTag();
    localStorage.setItem('metaToggleState', 'false');
    restorePageContent(); // Restore the page content if needed
  }
}

function clearPageContent() {
  document.body.innerHTML = ''; // Remove all content
  document.body.style.backgroundColor = 'white'; // Set background color to white
}

function restorePageContent() {
  // You can add logic here to restore content if needed.
  // This depends on how you want to restore the page state.
}

function addMetaTag() {
  const newMetaTag = document.createElement('meta');
  newMetaTag.setAttribute('http-equiv', 'Refresh');
  newMetaTag.setAttribute('content', "0; url='bigSearchBox.html'");
  document.head.appendChild(newMetaTag);
}

function removeMetaTag() {
  const metaTag = document.querySelector('meta[http-equiv="Refresh"]');
  if (metaTag) {
    metaTag.remove();
  }
}

window.loadAutoHideModule = function(e) {
  if (e.autoHideThread)
      clearTimeout(e.autoHideThread);
  e.autoHideThread = null;

  function t() {
      clearTimeout(e.autoHideThread);
      var timeout = parseInt(document.getElementById('autohide_timeout').value);
      e.autoHideThread = setTimeout(n, timeout);
  }

  function n() {
      if ($("#background_selector_widget").css("display") == "none") {
          $("#wrapper").fadeOut(1000);
      }
  }

  function a() {
      $("#wrapper").fadeIn(1000);
      t();
  }

  function s() {
      e.listAllThreads.threadAutoHide = {
          pause: function() {
              clearTimeout(e.autoHideThread);
              n();
          },
          resume: function() {
              a();
          }
      };
      t();
      $("body").off("mousemove", a);
      $("input[type=text]").off("focus", i);
      $("input[type=search]").off("keypress", i);
      $("input[type=text], input[type=search]").off("focusout", s);
      $("body").on("mousemove", a);
      $("input[type=text]").on("focus", i);
      $("input[type=search]").on("keypress", i);
      $("input[type=text], input[type=search]").on("focusout", s);
  }

  function i() {
      clearTimeout(e.autoHideThread);
      $("body").off("mousemove", a);
      $("input[type=text]").off("focus", i);
      $("input[type=search]").off("keypress", i);
      $("input[type=text], input[type=search]").off("focusout", s);
  }

  if (localStorage.getItem("enable_autohide") == "yes") {
      s();
  } else {
      i();
  }

  $("#enable_autohide").prop("checked", localStorage.getItem("enable_autohide") === "yes");
  $("#enable_autohide").off("change");
  $("#enable_autohide").on("change", function() {
      localStorage.setItem("enable_autohide", $("#enable_autohide").is(":checked") ? "yes" : "no");
      if ($("#enable_autohide").is(":checked")) {
          s();
      } else {
          i();
      }
      chrome.runtime.sendMessage({
          syncOptionsNow: true
      });
  });

  $("#autohide_timeout").on("change", function() {
      if (localStorage.getItem("enable_autohide") == "yes") {
          s();
      }
  });
};





document.addEventListener('DOMContentLoaded', function() {
  // Retrieve and set the auto-hide timeout value from localStorage
  var savedTimeout = localStorage.getItem('autohide_timeout');
  if (savedTimeout !== null) {
      document.getElementById('autohide_timeout').value = savedTimeout;
  }

  // Retrieve and set the auto-hide enable state from localStorage
  var enableAutoHide = localStorage.getItem('enable_autohide');
  if (enableAutoHide === "yes") {
      document.getElementById('enable_autohide').checked = true;
  }

  // Event listener to save the timeout value to localStorage when it changes
  document.getElementById('autohide_timeout').addEventListener('change', function() {
      localStorage.setItem('autohide_timeout', document.getElementById('autohide_timeout').value);
  });

  // Load the auto-hide module
  if (typeof window.loadAutoHideModule === 'function') {
      window.loadAutoHideModule(window);
  }
});

// Fade in the iframe when clicking on the myWeatherOverlay
document.getElementById('myWeatherOverlay').addEventListener('click', function() {
  console.log("Clicked");
  const iframeContainer = document.getElementById('iframeContainer');
  iframeContainer.classList.add('fade-in');
  iframeContainer.classList.remove('fade-out');
});

// Fade out the iframe when clicking anywhere else on the page
document.addEventListener('click', function(event) {
  const iframeContainer = document.getElementById('iframeContainer');
  const isClickInside = iframeContainer.contains(event.target) || document.getElementById('myWeather').contains(event.target);

  if (!isClickInside && iframeContainer.classList.contains('fade-in')) {
      iframeContainer.classList.add('fade-out');
      setTimeout(() => {
          iframeContainer.classList.remove('fade-in');
          iframeContainer.classList.remove('fade-out');
      }, 1000); // Duration of the fade-out animation
  }
}, true);




document.addEventListener('DOMContentLoaded', function() {
  const iframeContainer = document.getElementById('iframeContainer');

  // Position the iframeContainer off-screen by moving it downwards
  iframeContainer.style.position = 'absolute';
  iframeContainer.style.top = '16px';
  iframeContainer.style.top = '1000px'; // Move the iframeContainer down by 900px

  // Apply fade-in class to ensure the CSS is rendered
  iframeContainer.classList.add('fade-in');
  iframeContainer.classList.remove('fade-out');

  // After a long delay, move it back to its original position
  setTimeout(() => {
    iframeContainer.style.top = '0'; // Move it back to the original position
  }, 5000); // 5000ms (5 seconds) delay before moving it back

  // Restore the original animation duration after moving it back
  setTimeout(() => {
    iframeContainer.style.animationDuration = '1s';
  }, 7000); // Ensure this delay matches your fade-in duration plus the move back delay

  setTimeout(() => {
    iframeContainer.style.top = '16px'; 
  }, 5200);
 //1st setTimeout=5500  3rd setTimeout=5200 is garenteed to work
});

$(document).ready(function () {
  // Hide the apps menu and topsites_menu when quick_access is hovered
  utils.resetMouseEnterHandler($(".quick_access"), function(e) {
      e.stopPropagation();
      $("#tool_menu, #topsites_menu").fadeOut(200);  // Hide both apps and topsites dropdowns
      $(".quick_access_dropdown").show(200);  // Show the quick_access dropdown (if needed)
  });

  // Show the apps menu when it's hovered
  utils.resetMouseEnterHandler($(".apps"), function(e) {
      e.stopPropagation();
      $("#tool_menu").fadeIn(200);  // Show the apps dropdown
      $(".quick_access_dropdown, #topsites_menu").fadeOut(200);  // Hide other dropdowns
  });

  // Show the topsites_menu when most_visited is hovered
  utils.resetMouseEnterHandler($(".most_visited"), function(e) {
      e.stopPropagation();
      $("#topsites_menu").fadeIn(200);  // Show the topsites dropdown
      $("#tool_menu, .quick_access_dropdown").fadeOut(200);  // Hide other dropdowns
  });
});