// statistics.js
// Stores detection history for analysis & demo purposes

export function storeDetectionResult(result) {
  if (!result || !result.url) return;

  chrome.storage.local.get(["detections"], (data) => {
    const detections = data.detections || [];

    detections.push({
      url: result.url,
      attackType: result.attackType,
      riskScore: result.riskScore,
      timestamp: new Date().toISOString()
    });

    // Keep last 100 detections only
    const trimmed = detections.slice(-100);

    chrome.storage.local.set({
      detections: trimmed
    });
  });
}
