// background.js
// Service worker: central analysis & decision engine

import { routeMessage } from "./message_router.js";

console.log("[WP-PhishDetector] Background service worker started");

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  routeMessage(message, sender, sendResponse);
  return true; // Keeps message channel open (async support)
});
