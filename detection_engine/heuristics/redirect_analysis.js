// redirect_analysis.js
// Detects suspicious redirect behavior in URLs

export async function analyzeRedirects(url) {
  let score = 0;
  const reasons = [];
  const signals = {};

  let redirectCount = 0;
  let finalURL = url;

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow"
    });

    // Browser automatically follows redirects
    finalURL = response.url;

    // Estimate redirect count using response.redirected flag
    if (response.redirected) {
      redirectCount = estimateRedirects(url, finalURL);
    }
  } catch (err) {
    // Fetch blocked or failed → suspicious in itself
    score += 10;
    reasons.push("Unable to analyze redirects (fetch blocked)");
    signals.redirectCheckFailed = true;

    return { score, reasons, signals };
  }

  // 1️⃣ Multiple redirects
  if (redirectCount >= 2) {
    score += 15;
    reasons.push("Multiple URL redirects detected");
    signals.multipleRedirects = true;
  }

  // 2️⃣ Excessive redirects (high risk)
  if (redirectCount >= 4) {
    score += 25;
    reasons.push("Excessive redirect chain detected");
    signals.excessiveRedirects = true;
  }

  // 3️⃣ Final domain mismatch
  try {
    const originalHost = new URL(url).hostname;
    const finalHost = new URL(finalURL).hostname;

    if (originalHost !== finalHost) {
      score += 10;
      reasons.push("Final destination domain differs from original");
      signals.domainChanged = true;
    }
  } catch {
    // Ignore parsing errors
  }

  signals.redirectCount = redirectCount;

  return {
    score,
    reasons,
    signals
  };
}

/**
 * Estimate redirect count heuristically
 * (Browsers do not expose redirect chain directly)
 */
function estimateRedirects(original, final) {
  if (original === final) return 0;

  // Heuristic estimation
  if (final.includes("login") || final.includes("secure")) return 3;
  return 2;
}
