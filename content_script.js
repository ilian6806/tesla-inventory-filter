(async function main() {
    // 1. Fill the input with the number 93055.
    // Adjust this selector accordingly if your target input is different.
    let input = document.querySelector("input");
    if (input) {
      input.value = "93055";
      // Dispatch an input event if needed (e.g. if the page listens for input events).
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      console.warn("Input element not found.");
    }

    // 2. Wait 5 seconds for the page to reload or update.
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 3. Scroll to the bottom N times to load all infinite scroll pages.
    const nTimes = 10;        // Number of times to scroll down (adjust as needed)
    const delayScroll = 2000; // Delay between scrolls in milliseconds

    for (let i = 0; i < nTimes; i++) {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(resolve => setTimeout(resolve, delayScroll));
    }

    // 4. Execute the provided filtering code.
    Array.prototype.forEach.call(document.querySelectorAll("article.result.card"), function(element) {
        // Reset display to block initially
        element.style.display = "block";

        // Array to hold any reasons for hiding this element
        let reasons = [];

        // Check each condition individually
        if (element.textContent.indexOf("2021 Model") === -1) {
          reasons.push('Missing "2021 Model"');
        }

        if (element.textContent.indexOf("Unfallreparatur in der Vergangenheit") > -1) {
          reasons.push('Contains "Unfallreparatur in der Vergangenheit"');
        }

        if (element.textContent.indexOf("Sofort zur Auslieferung verfügbar") === -1) {
          reasons.push('Missing "Sofort zur Auslieferung verfügbar"');
        }

        if (element.textContent.indexOf("Maximale Reichweite Allradantrieb") === -1) {
          reasons.push('Missing "Maximale Reichweite Allradantrieb"');
        }

        // If any conditions are not met, hide the element and log the reasons
        if (reasons.length > 0) {
          element.style.display = "none";
          console.log("Hiding element:", element, "Reason(s):", reasons.join(", "));
        }
    });
})();