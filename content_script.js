(async function main() {

    chrome.storage.local.get(['zipCode', 'pages', 'include', 'exclude'], async function (result) {

        // Set the zip code input
        if (result.zipCode) {
            let input = document.querySelector('.filter-zip-code input');
            if (input) {
                input.value = result.zipCode;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                console.warn('Input element not found.');
            }
        } else {
            console.warn('Zip code not found in storage.');
        }

        // Scroll to the bottom N times to load all infinite scroll pages.
        if (result.pages) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            const delayScroll = 2000; // Delay between scrolls in milliseconds

            for (let i = 0; i < parseInt(result.pages); i++) {
                window.scrollTo(0, document.body.scrollHeight);
                await new Promise(resolve => setTimeout(resolve, delayScroll));
            }
        } else {
            console.warn('Pages not found in storage.');
        }

        // Convert the newline-separated strings into arrays,
        // trimming and filtering out any empty lines.
        let includeList = result.include
            ? result.include.split('\n').map(s => s.trim()).filter(s => s.length > 0)
            : [];
        let excludeList = result.exclude
            ? result.exclude.split('\n').map(s => s.trim()).filter(s => s.length > 0)
            : [];

        // Process each card element
        Array.prototype.forEach.call(document.querySelectorAll('article.result.card'), function (element) {
            // Reset display to block initially
            element.style.display = 'block';

            // Array to hold any reasons for hiding this element
            let reasons = [];

            // Get the element text
            let text = element.textContent;

            // For each include condition, check that it is present
            includeList.forEach(includeStr => {
                if (text.indexOf(includeStr) === -1) {
                    reasons.push('Missing "' + includeStr + '"');
                }
            });

            // For each exclude condition, check that it is NOT present
            excludeList.forEach(excludeStr => {
                if (text.indexOf(excludeStr) > -1) {
                    reasons.push('Contains "' + excludeStr + '"');
                }
            });

            // If any conditions are not met, hide the element and log the reasons
            if (reasons.length > 0) {
                element.style.display = 'none';
                console.log('Hiding element:', element, 'Reason(s):', reasons.join(', '));
            }
        });

        chrome.runtime.sendMessage({ action: 'closePopup' });

        window.scrollTo(0, 0, { behavior: 'smooth' });
    });
})();
