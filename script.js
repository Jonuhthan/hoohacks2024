document.addEventListener("DOMContentLoaded", function() {
    const toSelect = document.getElementById("to");
    const form = document.getElementById("currency-form");
    const resultDiv = document.getElementById("result");

    // Fetch exchange rates for USD
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
        .then(response => response.json())
        .then(data => {
            // Populate "To" select options
            for (const currency in data.rates) {
                const option = document.createElement("option");
                option.value = currency;
                option.textContent = currency;
                toSelect.appendChild(option);
            }
        })
        .catch(error => console.error("Error fetching exchange rates:", error));

    // Handle form submission
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById("amount").value);
        const targetCurrency = toSelect.value;

        // Fetch conversion rate
        fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
            .then(response => response.json())
            .then(data => {
                const conversionRate = data.rates[targetCurrency];
                const convertedAmount = amount * conversionRate;
                resultDiv.textContent = `${amount} USD is approximately ${convertedAmount.toFixed(2)} ${targetCurrency}`;
            })
            .catch(error => console.error("Error fetching conversion rate:", error));
    });
});
