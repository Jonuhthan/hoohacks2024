// Adds all options to select tags based on API call to currencies available
function populateFields(field, data) {
    for (const currency in data.rates) {
        const option = document.createElement("option");
        option.value = currency;
        option.textContent = currency;
        field.appendChild(option);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const fromSelect = document.getElementById("from");
    const toSelect = document.getElementById("to");
    const form = document.getElementById("currency-form");
    const result = document.getElementById("result");
    
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
        .then(response => response.json())
        .then(data => {
            populateFields(toSelect, data);
            populateFields(fromSelect, data);
        })
        .catch(error => console.error("Error fetching exchange rates:", error));

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
                result.innerText = `${amount} USD is approximately ${convertedAmount.toFixed(2)} ${targetCurrency}`;
            })
            .catch(error => console.error("Error fetching conversion rate:", error));
    });
});
    