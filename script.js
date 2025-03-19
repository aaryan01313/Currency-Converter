const API_KEY = "YOUR_API_KEY"; 
const BASE_URL = "https://open.er-api.com/v6/latest/";

const dropdowns = document.querySelectorAll("select");
const btn = document.getElementById("convertBtn");
const fromCurr = document.getElementById("fromCurrency");
const toCurr = document.getElementById("toCurrency");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let option = document.createElement("option");
        option.innerText = currCode;
        option.value = currCode;

        if (select.id === "fromCurrency" && currCode === "USD") option.selected = true;
        if (select.id === "toCurrency" && currCode === "INR") option.selected = true;

        select.append(option);
    }
    select.addEventListener("change", (e) => updateFlag(e.target));
}


const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

const updateExchangeRate = async () => {
    let amount = document.getElementById("amount").value;
    if (amount === "" || amount < 1) {
        amount = 1;
        document.getElementById("amount").value = "1";
    }

    try {
        let response = await fetch(`${BASE_URL}${fromCurr.value}?apikey=${API_KEY}`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        let data = await response.json();
        let rate = data.rates[toCurr.value];

        if (!rate) throw new Error("Invalid currency data received");

        let finalAmount = amount * rate;
        msg.innerText = `${amount} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate!";
        console.error("Error:", error);
    }
};


btn.addEventListener("click", (e) => {
    e.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => updateExchangeRate());
