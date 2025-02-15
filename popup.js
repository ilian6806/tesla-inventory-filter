document.getElementById("runButton").addEventListener("click", async () => {
    // Get the active tab in the current window.
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Inject the content script to run our main function.
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content_script.js']
    });
});