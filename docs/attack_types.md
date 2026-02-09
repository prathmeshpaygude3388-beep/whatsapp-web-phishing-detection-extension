# Attack Type Classification

## Overview

The system classifies malicious URLs into specific attack categories based on correlated signals from multiple detection layers. This improves explainability and helps users understand the nature of the threat.

---

## Attack Taxonomy

### 1. Credential Phishing
**Description:**
Fake login or verification pages designed to steal credentials.

**Indicators:**
- Brand impersonation
- Authentication lures (login, verify, OTP)
- Credential harvesting behavior
- High risk score

**Example:**
https://paytm-login-secure.xyz

---

### 2. Brand Impersonation
**Description:**
Fake websites pretending to be legitimate brands without directly harvesting credentials.

**Indicators:**
- Brand mentioned in URL
- Brand not present in domain
- Typosquatting
- Hyphenated brand domains

**Example:**
https://amazon-refund-alert.top

---

### 3. Malware Delivery
**Description:**
Links designed to deliver malicious payloads or redirect to exploit kits.

**Indicators:**
- IP-based URLs
- Excessive redirect chains
- Suspicious HTTPS behavior
- High entropy domains

**Example:**
http://185.XX.XX.23/update.exe

---

### 4. Financial Scam
**Description:**
Fraudulent schemes involving money, refunds, prizes, or investments.

**Indicators:**
- Redirect abuse
- Newly registered domains
- Scam-related keywords
- Medium to high risk score

**Example:**
https://upi-reward-claim.xyz

---

### 5. Suspicious Link
**Description:**
Links showing risky behavior but insufficient evidence for a specific attack type.

**Indicators:**
- Multiple low-confidence signals
- Medium risk score

---

### 6. Benign
**Description:**
Legitimate URLs with no malicious indicators.

---

## Classification Logic

The classifier uses:
- High-confidence behavioral signals
- Brand impersonation indicators
- Aggregated risk score thresholds

Only one final attack type is assigned to avoid ambiguity.
