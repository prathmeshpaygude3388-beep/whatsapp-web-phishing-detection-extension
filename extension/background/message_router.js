// message_router.js
// Routes messages to detection logic

import { analyzeURL } from "../../detection_engine/index.js";
import { sendNotification } from "../../alerting/alert_manager.js";

export async function routeMessage(message, sender, sendResponse) {
  if (!message || !message.type) return;

  switch (message.type) {
    case "ANALYZE_URL":
      const url = message.payload.url;

      try {
        const result = await analyzeURL(url);

        // Notify user if malicious
        if (result.attackType !== "Benign") {
          sendNotification(result);
        }

        sendResponse(result);
      } catch (err) {
        console.error("[WP-PhishDetector] Analysis error:", err);
        sendResponse({
          attackType: "Suspicious",
          riskScore: 50,
          reason: ["Analysis error"]
        });
      }
      break;

    default:
      console.warn("[WP-PhishDetector] Unknown message type");
  }
}
