// ssl_analysis.js
// SSL / HTTPS heuristic analysis (browser-safe)

export async function analyzeSSL(url) {
  let score = 0;
  const reasons = [];
  const signals = {};

  let parsedURL;

  try {
    parsedURL = new URL(url);
  } catch {
    score += 10;
    reasons.push("Invalid URL format");
    signals.invalidURL = true;

    return { score, reasons, signals };
  }

  // 1️⃣ Non-HTTPS URL
  if (parsedURL.protocol !== "https:") {
    score += 30;
    reasons.push("Connection is not using HTTPS");
    signals.noHTTPS = true;

    return { score, reasons, signals };
  }

  // HTTPS is present
  signals.usesHTTPS = true;

  // 2️⃣ HTTPS used with suspicious keywords (false trust indicator)
  const suspiciousKeywords = ["secure", "login", "verify", "update", "account"];

  const urlString = url.toLowerCase();
  const keywordFound = suspiciousKeywords.some(k => urlString.includes(k));

  if (keywordFound) {
    score += 5;
    reasons.push("HTTPS used with sensitive keywords (possible trust abuse)");
    signals.httpsTrustAbuse = true;
  }

  // 3️⃣ Attempt HEAD request to detect downgrade / blocking behavior
  try {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors"
    });

    // If fetch succeeds silently, it's okay
    signals.sslFetchAttempted = true;
  } catch {
    score += 10;
    reasons.push("HTTPS connection behavior is suspicious");
    signals.sslFetchBlocked = true;
  }

  // 4️⃣ Heuristic: suspicious HTTPS + new domain pattern
  if (
    signals.httpsTrustAbuse &&
    parsedURL.hostname.length > 25
  ) {
    score += 10;
    reasons.push("Suspicious HTTPS usage on long domain");
    signals.suspiciousHTTPSPattern = true;
  }

  return {
    score,
    reasons,
    signals
  };
}