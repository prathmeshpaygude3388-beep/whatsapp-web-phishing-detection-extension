// url_structure.js
// Structural heuristic analysis of URLs

import {
  hasIPAddress,
  getDomain,
  countSubdomains,
  hasSuspiciousTLD,
  containsShortener
} from "../../extension/utils/url_utils.js";

import {
  SUSPICIOUS_TLDS,
  URL_SHORTENERS
} from "../../extension/utils/constants.js";

import { calculateEntropy } from "../../extension/utils/entropy.js";

export function analyzeURLStructure(url) {
  let score = 0;
  const reasons = [];
  const signals = {};

  const domain = getDomain(url);

  // 1️⃣ IP address instead of domain
  if (hasIPAddress(url)) {
    score += 25;
    reasons.push("IP address used instead of domain");
    signals.ipBasedURL = true;
  }

  // 2️⃣ Excessive URL length
  if (url.length > 75) {
    score += 10;
    reasons.push("Unusually long URL");
    signals.longURL = true;
  }

  // 3️⃣ Too many subdomains
  const subdomainCount = countSubdomains(domain);
  if (subdomainCount >= 3) {
    score += 15;
    reasons.push("Excessive subdomains detected");
    signals.manySubdomains = true;
  }

  // 4️⃣ Suspicious TLD
  if (hasSuspiciousTLD(domain, SUSPICIOUS_TLDS)) {
    score += 15;
    reasons.push("Suspicious top-level domain");
    signals.suspiciousTLD = true;
  }

  // 5️⃣ URL shortener usage
  if (containsShortener(domain, URL_SHORTENERS)) {
    score += 20;
    reasons.push("URL shortener detected");
    signals.shortenedURL = true;
  }

  // 6️⃣ High entropy domain (random-looking)
  const entropy = calculateEntropy(domain.replace(/\./g, ""));
  if (entropy > 4.2) {
    score += 15;
    reasons.push("Random or obfuscated domain detected");
    signals.highEntropyDomain = true;
  }

  return {
    score,
    reasons,
    signals
  };
}
