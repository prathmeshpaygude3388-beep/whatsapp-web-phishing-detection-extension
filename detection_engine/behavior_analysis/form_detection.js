// form_detection.js
// Detects credential harvesting behavior using sandboxed inspection

import { getDomain } from "../../extension/utils/url_utils.js";

export async function detectForms(url) {
  let score = 0;
  const reasons = [];
  const signals = {};

  let pageHTML = "";

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "no-cors"
    });

    // If fetch succeeds but body is opaque, still suspicious
    signals.pageFetched = true;
  } catch {
    score += 10;
    reasons.push("Unable to fetch page for behavioral analysis");
    signals.fetchBlocked = true;

    return { score, reasons, signals };
  }

  /*
    NOTE:
    Due to browser CORS restrictions, we cannot fully read page HTML.
    Therefore we use URL + behavioral indicators heuristically.
  */

  const lowerURL = url.toLowerCase();

  // 1️⃣ Login / credential lure detection
  const credentialKeywords = [
    "login",
    "signin",
    "sign-in",
    "verify",
    "verification",
    "password",
    "otp",
    "account"
  ];

  if (credentialKeywords.some(k => lowerURL.includes(k))) {
    score += 20;
    reasons.push("Credential-related page behavior detected");
    signals.credentialLure = true;
  }

  // 2️⃣ Suspicious action keywords
  const actionKeywords = [
    "submit",
    "confirm",
    "validate",
    "continue"
  ];

  if (actionKeywords.some(k => lowerURL.includes(k))) {
    score += 10;
    reasons.push("Suspicious user action prompt detected");
    signals.actionPrompt = true;
  }

  // 3️⃣ Cross-domain credential suspicion
  const domain = getDomain(url);

  if (
    domain &&
    lowerURL.includes("login") &&
    !lowerURL.includes(domain)
  ) {
    score += 15;
    reasons.push("Possible cross-domain credential harvesting");
    signals.crossDomainCredential = true;
  }

  // 4️⃣ High confidence credential harvesting
  if (signals.credentialLure && signals.crossDomainCredential) {
    score += 15;
    reasons.push("High-confidence credential harvesting behavior");
    signals.highConfidenceCredentialHarvest = true;
  }

  return {
    score,
    reasons,
    signals
  };
}
