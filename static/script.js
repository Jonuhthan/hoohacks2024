document.addEventListener("DOMContentLoaded", function() {
    // Initialize select, form, and result tags
    const fromSelect = document.getElementById("from");
    const toSelect = document.getElementById("to");
    const form = document.getElementById("currency-form");
    const resultDiv = document.getElementById("result");

    // Fetch available currencies and populate select options
    fetch('https://open.er-api.com/v6/latest/USD')
        .then(response => response.json())
        .then(data => {
            // Iterate through each currency and create options for both "From" and "To" select tags
            for (const currency in data.rates) {
                const optionFrom = document.createElement("option");
                optionFrom.value = currency;
                optionFrom.textContent = currency;

                const optionTo = document.createElement("option");
                optionTo.value = currency;
                optionTo.textContent = currency;

                // Append options to select elements
                fromSelect.appendChild(optionFrom);
                toSelect.appendChild(optionTo);
            }
        })
        .catch(error => console.error("Error fetching currencies:", error));

    // Waits for form to be submitted
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById("amount").value);
        const fromCurrency = fromSelect.value;
        const toCurrency = toSelect.value;

        // Fetch conversion rate
        fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`)
            .then(response => response.json())
            .then(data => {
                const conversionRate = data.rates[toCurrency];
                const convertedAmount = amount * conversionRate;
                // Update result to express final conversion
                resultDiv.textContent = `${amount} ${fromCurrency} is approximately ${convertedAmount.toFixed(2)} ${toCurrency}`;
            // Add green background only when there is a result
            resultDiv.classList.add('populated-result');
        })
        .catch(error => {
            console.error("Error fetching conversion rate:", error);
            // Removes green background and resets result content
            resultDiv.textContent = '';
            resultDiv.classList.remove('populated-result');
        });
});

// Initialize result without green background
resultDiv.classList.remove('populated-result');
    
    // Updates flag backgrounds
    function updateFlag(selectElement, flagElementId) {
        let countryCode = selectElement.value.substring(0, 2).toUpperCase(); // Assumes first 2 letters of currency abbreviation corresponds to country code
        if(countryCode === "AN"){
            countryCode = "NL";     // Netherlands is exception
        }
        const flagElement = document.getElementById(flagElementId);
        // CountryFlagsAPI call, returns PNG image
        flagElement.style.backgroundImage = `url('https://countryflagsapi.netlify.app/flag/${countryCode}.svg')`;
    }

    // Update flags when currency selection changes
    fromSelect.addEventListener('change', function() {
        updateFlag(this, 'fromFlag');
    });

    toSelect.addEventListener('change', function() {
        updateFlag(this, 'toFlag');
    });

    // Switches currency positions when swap button is pressed
    document.getElementById("switchButton").addEventListener("click", function() {
        let temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;

        // Update flags accordingly
        updateFlag(fromSelect, 'fromFlag');
        updateFlag(toSelect, 'toFlag');
    });

    // Initialize flags on first load
    updateFlag(fromSelect, 'fromFlag');
    updateFlag(toSelect, 'toFlag');

});
