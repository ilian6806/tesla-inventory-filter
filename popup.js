
const DEFAULT_ZIP_CODE = '93055';
const DEFAULT_PAGES = 5;
const DEFAULT_INCLUDE = `2021 Model
Sofort zur Auslieferung verfügbar
Maximale Reichweite Allradantrieb
`;
const DEFAULT_EXCLUDE = `Unfallreparatur in der Vergangenheit`;

const view = {
    zipCode: document.getElementById('zipCode'),
    pages: document.getElementById('pages'),
    include: document.getElementById('include'),
    exclude: document.getElementById('exclude'),
    runButton: document.getElementById('runButton'),
    status: document.getElementById('status')
};

chrome.storage.local.get('zipCode', function(result) {
    if (result.zipCode) {
        view.zipCode.value = result.zipCode;
    } else {
        view.zipCode.value = DEFAULT_ZIP_CODE;
        chrome.storage.local.set({ zipCode: DEFAULT_ZIP_CODE });
    }
});

view.zipCode.addEventListener('input', function() {
    chrome.storage.local.set({ zipCode: view.zipCode.value });
});

chrome.storage.local.get('pages', function(result) {
    if (result.pages) {
        view.pages.value = result.pages;
    } else {
        view.pages.value = DEFAULT_PAGES;
        chrome.storage.local.set({ pages: DEFAULT_PAGES });
    }
});

view.pages.addEventListener('input', function() {
    chrome.storage.local.set({ pages: view.pages.value });
});

chrome.storage.local.get('include', function(result) {
    if (result.include) {
        view.include.value = result.include;
    } else {
        view.include.value = DEFAULT_INCLUDE;
        chrome.storage.local.set({ include: DEFAULT_INCLUDE });
    }
});

view.include.addEventListener('input', function() {
    chrome.storage.local.set({ include: view.include.value });
});

chrome.storage.local.get('exclude', function(result) {
    if (result.exclude) {
        view.exclude.value = result.exclude;
    } else {
        view.exclude.value = DEFAULT_EXCLUDE;
        chrome.storage.local.set({ exclude: DEFAULT_EXCLUDE });
    }
});

view.exclude.addEventListener('input', function() {
    chrome.storage.local.set({ exclude: view.exclude.value });
});

view.runButton.addEventListener('click', async () => {

    // Get the active tab in the current window.
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    view.runButton.disabled = true;

    // Inject the content script to run our main function.
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content_script.js']
    });

    view.status.textContent = 'Status: Running...';

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'closePopup') {
            view.status.textContent = 'Status: Done!';
            setTimeout(() => {
                window.close();
            }, 3000);
        }
    });
});