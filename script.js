const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const resultBox = document.getElementById("result");
const convertBtn = document.getElementById("convert-btn");
const swapBtn = document.getElementById("swap-btn");

let rates;

// Load all currencies from Frankfurter API
async function loadCurrencies() {
  const res = await fetch("https://api.frankfurter.dev/v1/latest?base=USD");
  const data = await res.json(); 

  rates = data.rates;

  const currencyNames = Object.keys(data.rates);

  // Populate both dropdowns
  for (const index in currencyNames) {
    const option1 = document.createElement("option");

    option1.value = currencyNames[index];
    option1.textContent = currencyNames[index];

    fromCurrency.appendChild(option1);

    const option2 = option1.cloneNode(true);
    toCurrency.appendChild(option2);
  }

  // Restore last used currencies
  const saveFrom = localStorage.getItem("fromCurrency");
  const saveTo = localStorage.getItem("toCurrency");

  fromCurrency.value = saveFrom;
  toCurrency.value = saveTo;
}

// Call loadCurrencies on page load
loadCurrencies();

// Convert currency when user clicks "Convert"
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  // Validate amount
  if (isNaN(amount) || amount <= 0) {
    resultBox.textContent = "Please enter a valid amount.";
    return;
  }
  
  console.log(rates);
  console.log(amount, from, to, rates[to]);

  // Get converted value
  const converted = (amount / rates[from]) * rates[to];

  // Update result on the page
  resultBox.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;

  // Save last used currencies
  localStorage.setItem("fromCurrency", from);
  localStorage.setItem("toCurrency", to);
}

// Event listener for "Convert" button
convertBtn.addEventListener("click", convertCurrency);

// Swap currencies and recalculate
swapBtn.addEventListener("click", () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  convertCurrency();
});


 