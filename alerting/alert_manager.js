// alert_manager.js
// Handles user alerts and statistics updates

import { buildExplanation } from "./explainability.js";

export function sendNotification(result) {
  if (!result || result.attackType === "Benign") return;

  const explanation = buildExplanation(result);

  // Browser notification
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png", // optional, safe if missing
    title: `⚠️ ${result.attackType} Detected`,
    message: explanation
  });

  // Update local stats
  chrome.storage.local.get(
    ["totalScanned", "threatsDetected"],
    (data) => {
      chrome.storage.local.set({
        totalScanned: (data.totalScanned || 0) + 1,
        threatsDetected: (data.threatsDetected || 0) + 1
      });
    }
  );
}
