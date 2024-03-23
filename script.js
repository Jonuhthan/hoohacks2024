document.addEventListener("DOMContentLoaded", function() {
    const fromSelect = document.getElementById("from");
    const toSelect = document.getElementById("to");
    const form = document.getElementById("currency-form");
    const resultDiv = document.getElementById("result");

    // Fetch available currencies and populate select options
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
        .then(response => response.json())
        .then(data => {
            for (const currency in data.rates) {
                const optionFrom = document.createElement("option");
                optionFrom.value = currency;
                optionFrom.textContent = currency;

                const optionTo = document.createElement("option");
                optionTo.value = currency;
                optionTo.textContent = currency;

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
        fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
            .then(response => response.json())
            .then(data => {
                const conversionRate = data.rates[toCurrency];
                const convertedAmount = amount * conversionRate;
                resultDiv.textContent = `${amount} ${fromCurrency} is approximately ${convertedAmount.toFixed(2)} ${toCurrency}`;
            })
            .catch(error => console.error("Error fetching conversion rate:", error));
    });
});
