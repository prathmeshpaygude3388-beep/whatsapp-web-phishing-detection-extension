// url_utils.js
// Helper functions for URL analysis

export function hasIPAddress(url) {
  const ipRegex = /(\d{1,3}\.){3}\d{1,3}/;
  return ipRegex.test(url);
}

export function getDomain(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function countSubdomains(domain) {
  return domain.split(".").length - 2;
}

export function hasSuspiciousTLD(domain, tldList) {
  const parts = domain.split(".");
  return tldList.includes(parts[parts.length - 1]);
}

export function containsShortener(domain, shorteners) {
  return shorteners.some(s => domain.includes(s));
}