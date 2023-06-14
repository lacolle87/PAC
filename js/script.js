// Define constants
const HEADS_PERCENTAGE = 10; // Default percentage of heads to take
const DEFAULT_TEMPERATURE = 20; // Default temperature in Celsius

// Get input elements
const abvInput = document.getElementById("abv");
const volumeInput = document.getElementById("volume");
const percentageInput = document.getElementById("percentage");
const temperatureInput = document.getElementById("temperature");
const headsInput = document.getElementById("heads");

// Add event listener to calculate button
const calculateButton = document.querySelector("button[type='submit']");
calculateButton.addEventListener("click", PureAlcoholCalc);

function PureAlcoholCalc() {
    // Get input values
    const A = abvInput.value;
    const V = volumeInput.value;
    const F = percentageInput.value;
    const T = temperatureInput.value || DEFAULT_TEMPERATURE;
    const H = headsInput.value || HEADS_PERCENTAGE; // Use default if heads input is empty

    // Apply temperature correction to percentage of alcohol by volume (F)
    const correctedF = F - (0.33 * (T - 20));

    // Calculate amount of pure alcohol (Sa)
    const Sa = (V * correctedF) / 100;

    // Calculate amount of heads (Sh)
    const Sh = (Sa * H) / 100;

    // Calculate amount of tails (St)
    const St = (Sa * 20) / 100;

    // Calculate amount of hearts absolute(Sha)
    const Sha = Sa - Sh - St;

    // Calculate amount of hearts absolute(S)
    const S = (Sha * 100) / (A);

    // Calculate amount of wash
    const Sw = V - S - Sh;

    // Round results
    const roundedSa = Math.round(Sa);
    const roundedSh = Math.round(Sh);
    const roundedS = Math.round(S);
    const roundedSw = Math.round(Sw);

    // Show the results
    const resultDiv = document.getElementById("result");
    resultDiv.classList.remove("d-none");
    const totalResult = document.getElementById("totalResult");
    const headsResult = document.getElementById("headsResult");
    const heartsResult = document.getElementById("heartsResult");
    const tailsResult = document.getElementById("tailsResult");
    totalResult.innerText = `${roundedSa}`;
    headsResult.innerText = `${roundedSh}`;
    heartsResult.innerText = `${roundedS}`;
    tailsResult.innerText = `${roundedSw}`;
}
