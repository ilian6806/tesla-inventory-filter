document.getElementById("runButton").addEventListener("click", async () => {
    // Get the active tab in the current window.
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    document.getElementById("runButton").disabled = true;

    // Inject the content script to run our main function.
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content_script.js']
    });

    document.getElementById("status").textContent = "Status: Running...";

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "closePopup") {
        document.getElementById("status").textContent = "Status: Done!";
        setTimeout(() => {
          window.close();
        }, 3000);
      }
    });
});