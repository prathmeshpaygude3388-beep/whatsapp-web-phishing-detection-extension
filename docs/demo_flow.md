# Demo & Execution Flow

## Objective
Demonstrate real-time phishing detection on WhatsApp Web using the browser extension.

---

## Step-by-Step Demo Flow

### Step 1: Load Extension
- Open Chrome → chrome://extensions
- Enable Developer Mode
- Load unpacked extension
- Confirm popup shows "Active on WhatsApp Web"

---

### Step 2: Open WhatsApp Web
- Navigate to https://web.whatsapp.com
- Open any chat conversation

---

### Step 3: Receive a Link
Example test link:
https://paytm-login-secure.xyz

---

### Step 4: Detection Pipeline Execution
1. DOM Observer detects new message
2. URL is extracted
3. Background service worker receives URL
4. Detection engine runs:
   - URL heuristics
   - Brand impersonation
   - Behavioral analysis
   - ML risk scoring
5. Attack classifier assigns attack type

---

### Step 5: User Alert
- Malicious link highlighted in chat
- Browser notification displayed
- Tooltip shows explanation and risk score

---

### Step 6: Popup Dashboard
- Total scanned count increases
- Threats detected count updates
- Detection statistics stored locally

---

## Expected Demo Outcome

- Clear warning for phishing links
- No alerts for benign links
- Explainable detection reasoning

---

## Key Talking Points (Viva)

- WhatsApp Web limitation workaround
- Multi-layer detection without dataset dependency
- Explainability-driven security design
- Browser-safe behavioral analysis
