// impersonation_check.js
// Advanced web / brand impersonation detection

import { BRAND_KEYWORDS } from "./brand_keywords.js";
import { getDomain } from "../../extension/utils/url_utils.js";

/**
 * Simple Levenshtein distance (typosquatting detection)
 */
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

export function checkBrandImpersonation(url) {
  let score = 0;
  const reasons = [];
  const signals = {};

  const urlLower = url.toLowerCase();
  const domain = getDomain(url);

  if (!domain) return { score, reasons, signals };

  let detectedBrand = null;

  // 1️⃣ Detect brand keyword anywhere in URL
  for (const brand of BRAND_KEYWORDS) {
    if (urlLower.includes(brand)) {
      detectedBrand = brand;
      break;
    }
  }

  if (!detectedBrand) {
    return { score, reasons, signals };
  }

  signals.brandMentioned = true;
  signals.brandName = detectedBrand;

  // 2️⃣ Brand mentioned but NOT in domain → classic impersonation
  if (!domain.includes(detectedBrand)) {
    score += 30;
    reasons.push(`Brand impersonation suspected: ${detectedBrand}`);
    signals.fakeBrandDomain = true;
  }

  // 3️⃣ Authentication / action lure words
  const authKeywords = [
    "login",
    "verify",
    "verification",
    "secure",
    "update",
    "account",
    "support",
    "refund"
  ];

  if (authKeywords.some(k => urlLower.includes(k))) {
    score += 15;
    reasons.push("Brand-based authentication lure detected");
    signals.authLure = true;
  }

  // 4️⃣ Hyphenated or extended brand domains
  // e.g. paytm-login-secure.xyz
  if (
    domain.includes("-") &&
    domain.replace(/-/g, "").includes(detectedBrand)
  ) {
    score += 10;
    reasons.push("Hyphenated brand domain detected");
    signals.hyphenatedBrandDomain = true;
  }

  // 5️⃣ Typosquatting detection (edit distance)
  const domainParts = domain.split(".");
  for (const part of domainParts) {
    const distance = levenshtein(part, detectedBrand);
    if (distance > 0 && distance <= 2) {
      score += 20;
      reasons.push("Possible typosquatting of brand name");
      signals.typosquatting = true;
      break;
    }
  }

  // 6️⃣ High-confidence web impersonation
  if (
    signals.fakeBrandDomain &&
    (signals.authLure || signals.typosquatting)
  ) {
    score += 15;
    reasons.push("High-confidence web impersonation attack");
    signals.highConfidenceImpersonation = true;
  }

  return {
    score,
    reasons,
    signals
  };
}
