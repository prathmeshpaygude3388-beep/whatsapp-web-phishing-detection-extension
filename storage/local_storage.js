// local_storage.js
// Centralized Chrome local storage helpers

export function initStorage() {
  chrome.storage.local.get(
    ["totalScanned", "threatsDetected"],
    (data) => {
      chrome.storage.local.set({
        totalScanned: data.totalScanned || 0,
        threatsDetected: data.threatsDetected || 0
      });
    }
  );
}

export function incrementScanned() {
  chrome.storage.local.get(["totalScanned"], (data) => {
    chrome.storage.local.set({
      totalScanned: (data.totalScanned || 0) + 1
    });
  });
}

export function incrementThreats() {
  chrome.storage.local.get(["threatsDetected"], (data) => {
    chrome.storage.local.set({
      threatsDetected: (data.threatsDetected || 0) + 1
    });
  });
}
