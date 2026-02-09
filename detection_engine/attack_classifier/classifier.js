// classifier.js
// Final attack type classification logic

import { ATTACK_TYPES } from "./attack_types.js";

export function classifyAttack(signals) {
  const risk = signals.riskScore || 0;

  /* =========================
     1️⃣ Credential Phishing
     ========================= */
  if (
    signals.highConfidenceCredentialHarvest ||
    (
      signals.authLure &&
      signals.fakeBrandDomain &&
      risk >= 60
    )
  ) {
    return ATTACK_TYPES.CREDENTIAL_PHISHING;
  }

  /* =========================
     2️⃣ Brand Impersonation
     ========================= */
  if (
    signals.highConfidenceImpersonation ||
    (
      signals.fakeBrandDomain &&
      signals.brandMentioned &&
      risk >= 50
    )
  ) {
    return ATTACK_TYPES.BRAND_IMPERSONATION;
  }

  /* =========================
     3️⃣ Malware Delivery
     ========================= */
  if (
    signals.ipBasedURL &&
    signals.excessiveRedirects &&
    risk >= 55
  ) {
    return ATTACK_TYPES.MALWARE_DELIVERY;
  }

  /* =========================
     4️⃣ Financial Scam
     ========================= */
  if (
    signals.moneyKeywords ||
    (
      signals.redirectAbuse &&
      signals.newDomainPattern &&
      risk >= 45
    )
  ) {
    return ATTACK_TYPES.FINANCIAL_SCAM;
  }

  /* =========================
     5️⃣ Suspicious
     ========================= */
  if (risk >= 35) {
    return ATTACK_TYPES.SUSPICIOUS;
  }

  /* =========================
     6️⃣ Benign
     ========================= */
  return ATTACK_TYPES.BENIGN;
}
