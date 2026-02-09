// domain_age.js
// Domain age heuristic analysis (browser-safe)

export async function analyzeDomainAge(url) {
  let score = 0;
  const reasons = [];
  const signals = {};

  let hostname;

  try {
    hostname = new URL(url).hostname;
  } catch {
    score += 10;
    reasons.push("Invalid domain format");
    signals.invalidDomain = true;

    return { score, reasons, signals };
  }

  // 1️⃣ Heuristic: suspicious new-domain patterns
  const suspiciousPatterns = [
    /-\d{2,}/,                 // domain-23, login-2024
    /(secure|login|verify)/i,  // phishing keywords
    /^[a-z0-9]{12,}$/i         // random-looking domains
  ];

  if (suspiciousPatterns.some(p => p.test(hostname))) {
    score += 15;
    reasons.push("Domain name pattern resembles newly registered domain");
    signals.newDomainPattern = true;
  }

  // 2️⃣ Heuristic: excessive domain length
  if (hostname.length > 30) {
    score += 10;
    reasons.push("Unusually long domain name");
    signals.longDomainName = true;
  }

  // 3️⃣ Heuristic: multiple hyphens (cheap domains)
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 2) {
    score += 10;
    reasons.push("Domain contains multiple hyphens");
    signals.multipleHyphens = true;
  }

  // 4️⃣ Heuristic: numeric-heavy domains
  const digitCount = (hostname.match(/\d/g) || []).length;
  if (digitCount >= 4) {
    score += 10;
    reasons.push("Domain contains excessive numeric characters");
    signals.numericHeavyDomain = true;
  }

  // 5️⃣ Heuristic: recently abused TLDs combined with age indicators
  const youngTLDs = ["xyz", "top", "zip", "tk", "ml", "ga"];
  const tld = hostname.split(".").pop();

  if (youngTLDs.includes(tld)) {
    score += 15;
    reasons.push("Domain uses TLD commonly associated with new registrations");
    signals.newTLD = true;
  }

  return {
    score,
    reasons,
    signals
  };
}
