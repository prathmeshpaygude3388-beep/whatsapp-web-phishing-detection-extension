// sandbox_iframe.js
// Safe behavioral probing using sandboxed iframe

export function analyzeSandboxBehavior(url) {
  let score = 0;
  const reasons = [];
  const signals = {};

  try {
    const iframe = document.createElement("iframe");

    iframe.src = url;
    iframe.style.display = "none";
    iframe.sandbox = "allow-forms allow-same-origin";

    document.body.appendChild(iframe);

    // Heuristic timeout-based observation
    setTimeout(() => {
      try {
        const iframeLocation = iframe.contentWindow.location.href;

        if (iframeLocation && iframeLocation !== url) {
          score += 20;
          reasons.push("Automatic redirect behavior detected");
          signals.autoRedirect = true;
        }
      } catch {
        score += 10;
        reasons.push("Restricted iframe behavior detected");
        signals.iframeRestricted = true;
      }

      iframe.remove();
    }, 3000);

  } catch {
    score += 10;
    reasons.push("Sandbox behavior analysis failed");
    signals.sandboxFailed = true;
  }

  return {
    score,
    reasons,
    signals
  };
}
