// feature_extractor.js
// Extracts ML features from URL and detection signals

import { getDomain } from "../../extension/utils/url_utils.js";
import { calculateEntropy } from "../../extension/utils/entropy.js";

export function extractFeatures(url, signals = {}) {
  const domain = getDomain(url);
  const urlLength = url.length;
  const domainLength = domain.length;
  const entropy = calculateEntropy(domain.replace(/\./g, ""));

  return {
    urlLength,
    domainLength,
    entropy,

    hasIPAddress: signals.ipBasedURL ? 1 : 0,
    hasManySubdomains: signals.manySubdomains ? 1 : 0,
    usesShortener: signals.shortenedURL ? 1 : 0,
    suspiciousTLD: signals.suspiciousTLD ? 1 : 0,

    brandImpersonation: signals.fakeBrandDomain ? 1 : 0,
    authLure: signals.authLure ? 1 : 0,

    credentialHarvesting: signals.highConfidenceCredentialHarvest ? 1 : 0,
    redirectAbuse: signals.excessiveRedirects ? 1 : 0,
    newDomain: signals.newDomainPattern ? 1 : 0
  };
}
