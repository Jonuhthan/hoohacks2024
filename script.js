document.addEventListener("DOMContentLoaded", function() {
    const fromSelect = document.getElementById("from");
    const toSelect = document.getElementById("to");
    const form = document.getElementById("currency-form");
    const resultDiv = document.getElementById("result");

    // Fetch available currencies and populate select options
    fetch('https://open.er-api.com/v6/latest/USD')
        .then(response => response.json())
        .then(data => {
            // Iterate through each currency and create options for both source and target select elements
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

    // Handle form submission
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
                resultDiv.textContent = `${amount} ${fromCurrency} is approximately ${convertedAmount.toFixed(2)} ${toCurrency}`;
            })
            .catch(error => console.error("Error fetching conversion rate:", error));
    });
    
    // Function to update flag backgrounds
    function updateFlag(selectElement, flagElementId) {
        const countryCode = selectElement.value.substring(0, 2).toLowerCase(); // Assuming the currency code corresponds to country code
        const flagElement = document.getElementById(flagElementId);
        flagElement.style.backgroundImage = `url('https://flagcdn.com/w20/${countryCode}.jpg')`;
    }

    // Update flags when currency selection changes
    fromSelect.addEventListener('change', function() {
        updateFlag(this, 'fromFlag');
    });

    toSelect.addEventListener('change', function() {
        updateFlag(this, 'toFlag');
    });

    // Handle the currency switch button
    document.getElementById("switchButton").addEventListener("click", function() {
        let temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;

        // Update flags accordingly
        updateFlag(fromSelect, 'fromFlag');
        updateFlag(toSelect, 'toFlag');

        // Optionally, re-fetch conversion rates and update result
    });

    // Initialize flags on first load
    updateFlag(fromSelect, 'fromFlag');
    updateFlag(toSelect, 'toFlag');

});