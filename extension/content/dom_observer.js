// dom_observer.js
// Observes WhatsApp Web DOM for new messages and triggers URL scanning

(function () {
  console.log("[WP-PhishDetector] DOM Observer initialized");

  const TARGET_NODE_SELECTOR = "#main"; // WhatsApp chat container

  function observeChatContainer() {
    const targetNode = document.querySelector(TARGET_NODE_SELECTOR);
    if (!targetNode) {
      setTimeout(observeChatContainer, 2000);
      return;
    }

    const config = {
      childList: true,
      subtree: true
    };

    const callback = function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.addedNodes.length > 0) {
          window.dispatchEvent(
            new CustomEvent("WP_NEW_MESSAGE_DETECTED")
          );
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    console.log("[WP-PhishDetector] Chat container observed");
  }

  observeChatContainer();
})();
