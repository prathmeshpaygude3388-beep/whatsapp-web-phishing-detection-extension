// content.js
// Extracts URLs from WhatsApp Web messages and sends them for analysis

console.log("[WP-PhishDetector] Content script loaded");

const scannedURLs = new Set();
const URL_REGEX =
  /(https?:\/\/[^\s]+)/gi;

/**
 * Extract URLs from visible chat messages
 */
function extractURLs() {
  const messageNodes = document.querySelectorAll("div[data-pre-plain-text]");

  messageNodes.forEach(node => {
    const links = node.querySelectorAll("a[href]");

    links.forEach(link => {
      const url = link.href;

      if (!scannedURLs.has(url)) {
        scannedURLs.add(url);
        sendForAnalysis(url, link);
      }
    });
  });
}

/**
 * Send URL to background script
 */
function sendForAnalysis(url, domElement) {
  chrome.runtime.sendMessage(
    {
      type: "ANALYZE_URL",
      payload: {
        url: url
      }
    },
    response => {
      if (!response) return;

      applyResult(response, domElement);
    }
  );
}

/**
 * Apply visual indicators based on analysis
 */
function applyResult(result, element) {
  if (!result || result.attackType === "Benign") return;

  // Visual warning styles
  element.style.border = "2px solid red";
  element.style.padding = "2px";
  element.style.borderRadius = "4px";

  // Tooltip explanation
  element.title =
    `⚠️ ${result.attackType}\n` +
    `Risk Score: ${result.riskScore}\n` +
    `Reason: ${result.reason.join(", ")}`;

  // Optional inline warning label
  const warningLabel = document.createElement("span");
  warningLabel.innerText = " ⚠️ Phishing Risk";
  warningLabel.style.color = "red";
  warningLabel.style.fontWeight = "bold";
  warningLabel.style.marginLeft = "4px";

  element.parentNode.appendChild(warningLabel);
}

/**
 * Initial scan (for already loaded messages)
 */
setTimeout(() => {
  extractURLs();
}, 3000);

/**
 * Re-scan when new messages arrive
 */
window.addEventListener("WP_NEW_MESSAGE_DETECTED", () => {
  extractURLs();
});
