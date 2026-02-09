// explainability.js
// Generates human-readable alert explanations

export function buildExplanation(result) {
  if (!result || !result.reason || result.reason.length === 0) {
    return "Suspicious activity detected in the received link.";
  }

  const maxReasons = 3; // keep alerts readable
  const reasons = result.reason.slice(0, maxReasons);

  let explanation = "Reasons:\n";

  reasons.forEach((reason, index) => {
    explanation += `${index + 1}. ${reason}\n`;
  });

  explanation += `\nRisk Score: ${result.riskScore}/100`;

  return explanation.trim();
}
