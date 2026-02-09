// popup.js
// Handles popup UI logic and statistics display

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(
    ["totalScanned", "threatsDetected"],
    (data) => {
      document.getElementById("totalScanned").innerText =
        data.totalScanned || 0;

      document.getElementById("threatsDetected").innerText =
        data.threatsDetected || 0;
    }
  );
});
