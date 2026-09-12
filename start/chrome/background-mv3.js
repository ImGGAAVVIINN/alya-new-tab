/* MV3 service worker for Alya Start Page.
 * Replaces the old MV2 background scripts (settings.js + background.js)
 * which crashed with "localStorage is not defined" because service
 * workers have no DOM / localStorage access.
 * This worker uses chrome.storage.local only and always responds,
 * so callers like search-form.js never get `undefined` (which caused
 * `.filter` / `.length` TypeErrors) and never hit
 * "Could not establish connection. Receiving end does not exist."
 */
"use strict";

const DEFAULT_BG = "/start/skin/images/bg-01.jpg";

function safeSendResponse(sendResponse, payload) {
  try {
    if (typeof sendResponse === "function") sendResponse(payload);
  } catch (e) {
    // Receiver may have gone away (newtab closed). Ignore.
  }
}

// Best-effort local cache backed by chrome.storage.local (async).
// We keep an in-memory copy so sync handlers stay fast.
let memCache = {};
chrome.storage.local.get(null, (items) => {
  if (items && typeof items === "object") memCache = items;
});
function memGet(key, fallback = null) {
  return memCache[key] !== undefined ? memCache[key] : fallback;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Allow string messages like "click-TopSites", "click-Rate", etc.
  // Old code just logged them. Acknowledge to avoid lastError.
  if (typeof msg === "string") {
    safeSendResponse(sendResponse, "ok");
    return false;
  }
  if (!msg || typeof msg !== "object") {
    safeSendResponse(sendResponse, null);
    return false;
  }

  // Named click events: { name: "click-...", data: ... }
  if (typeof msg.name === "string" && msg.name.indexOf("click-") === 0) {
    safeSendResponse(sendResponse, "ok");
    return false;
  }

  if (msg.error) {
    try { console.warn("[alya] page error:", msg.error, msg.detail); } catch {}
    safeSendResponse(sendResponse, "ok");
    return false;
  }

  // --- Most visited (fixes search-form.js:131 `e.length` crash) ---
  if (msg.topSites) {
    try {
      if (chrome.topSites && chrome.topSites.get) {
        chrome.topSites.get((sites) => {
          safeSendResponse(sendResponse, Array.isArray(sites) ? sites : []);
        });
        return true; // async
      }
    } catch {}
    safeSendResponse(sendResponse, []);
    return false;
  }

  // --- Apps list (fixes search-form.js:73 `e.filter` crash) ---
  if (msg.appGetAll) {
    try {
      if (chrome.management && chrome.management.getAll) {
        chrome.management.getAll((apps) => {
          if (chrome.runtime.lastError) {
            safeSendResponse(sendResponse, []);
          } else {
            safeSendResponse(sendResponse, Array.isArray(apps) ? apps : []);
          }
        });
        return true;
      }
    } catch {}
    safeSendResponse(sendResponse, []);
    return false;
  }

  if (msg.appGet && msg.appGet.id) {
    try {
      chrome.management.get(msg.appGet.id, (info) => {
        safeSendResponse(sendResponse, info || null);
      });
      return true;
    } catch {
      safeSendResponse(sendResponse, null);
      return false;
    }
  }

  if (msg.appLaunch && msg.appLaunch.id) {
    try {
      // launchApp was removed for non-app extensions; fall back gracefully.
      if (chrome.management.launchApp) {
        chrome.management.launchApp(msg.appLaunch.id, () => safeSendResponse(sendResponse, "ok"));
        return true;
      }
    } catch {}
    safeSendResponse(sendResponse, "ok");
    return false;
  }

  if (msg.appSetEnabled && msg.appSetEnabled.id !== undefined) {
    try {
      chrome.management.setEnabled(msg.appSetEnabled.id, !!msg.appSetEnabled.enabled, () => {
        safeSendResponse(sendResponse, "ok");
      });
      return true;
    } catch {
      safeSendResponse(sendResponse, "ok");
      return false;
    }
  }

  if (msg.getGlobalOptions) {
    // Newtab reads most settings from localStorage directly.
    // Return storage snapshot so callers never get undefined.
    try {
      chrome.storage.local.get(null, (items) => {
        safeSendResponse(sendResponse, items || {});
      });
      return true;
    } catch {
      safeSendResponse(sendResponse, {});
      return false;
    }
  }

  if (msg.getContentScriptVars) {
    // Used by content-homepage.js on google.com pages.
    let bgImg = "";
    try { bgImg = chrome.runtime.getURL("start/skin/images/bg-01.jpg"); } catch {}
    safeSendResponse(sendResponse, {
      landingPage: "https://freeaddon.com/",
      updatePage: "https://freeaddon.com/",
      showMinor: false,
      bgImg,
      debug: false
    });
    return false;
  }

  if (msg.autoSuggest && msg.URL) {
    // MV3 workers have no XHR; use fetch, then forward to the tab.
    try {
      fetch(msg.URL).then((r) => r.text()).then((text) => {
        try {
          if (sender && sender.tab && sender.tab.id !== undefined) {
            chrome.tabs.sendMessage(sender.tab.id, {
              autoSuggestResponse: true,
              val: msg.val,
              xmlHttpResponse: text
            });
          }
        } catch {}
      }).catch(() => {});
    } catch {}
    // No direct response needed; response goes via tabs.sendMessage.
    return false;
  }

  if (msg.getNewTabURL || msg.openNewTab) {
    safeSendResponse(sendResponse, "ok");
    return false;
  }

  if (msg.syncOptionsNow || msg.changeOptions || msg.noteChange ||
      msg.syncNote || msg.updateNote || msg.rateStatus) {
    // Old sync logic required localStorage + external whitelist servers.
    // Acknowledge safely so the newtab UI doesn't hang.
    safeSendResponse(sendResponse, "ok");
    return false;
  }

  // Unknown message: acknowledge to prevent "Receiving end does not exist".
  safeSendResponse(sendResponse, null);
  return false;
});

chrome.runtime.onMessageExternal.addListener((_msg, _sender, sendResponse) => {
  safeSendResponse(sendResponse, null);
  return false;
});

// Action click: open a new tab (replaces chrome.browserAction.onClicked).
try {
  if (chrome.action && chrome.action.onClicked) {
    chrome.action.onClicked.addListener(() => {
      try {
        chrome.tabs.create({ url: chrome.runtime.getURL("start/index.html") });
      } catch {}
    });
  }
} catch {}

chrome.runtime.onInstalled.addListener(() => {
  // Seed minimal defaults so first run has sane values.
  try {
    chrome.storage.local.get(["hideLink", "hideApp", "had_wl"], (cur) => {
      const seed = {};
      if (!Array.isArray(cur.hideLink)) seed.hideLink = "[]";
      if (!Array.isArray(cur.hideApp) && typeof cur.hideApp !== "string") seed.hideApp = "[]";
      if (Object.keys(seed).length) chrome.storage.local.set(seed, () => {});
    });
  } catch {}
});
