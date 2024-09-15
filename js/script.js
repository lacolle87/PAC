const HEADS_PERCENTAGE = 10;
const DEFAULT_TEMPERATURE = 20;
const TEMPERATURE_CORRECTION_FACTOR = 0.33;
const TAILS_PERCENTAGE = 20;

class PureAlcoholCalculator {
    constructor() {
        this.abvInput = document.getElementById("abv");
        this.volumeInput = document.getElementById("volume");
        this.percentageInput = document.getElementById("percentage");
        this.temperatureInput = document.getElementById("temperature");
        this.headsInput = document.getElementById("heads");
        this.resultDiv = document.getElementById("result");
        this.totalResult = document.getElementById("totalResult");
        this.headsResult = document.getElementById("headsResult");
        this.heartsResult = document.getElementById("heartsResult");
        this.tailsResult = document.getElementById("tailsResult");

        this.loadInputValues();
        this.loadResults();

        const form = document.getElementById("pureAlcoholCalcForm");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.calculate();
        });

        this.addInputListeners();
    }

    addInputListeners() {
        const inputs = [this.abvInput, this.volumeInput, this.percentageInput, this.temperatureInput, this.headsInput];
        inputs.forEach(input => {
            input.addEventListener("input", () => {
                this.calculate();
            });
        });
    }

    loadResults() {
        const results = sessionStorage.getItem("alcoholResults");
        if (results) {
            const { Sa, Sh, S, Sw } = JSON.parse(results);
            this.updateResults(Sa, Sh, S, Sw);
        } else {
            this.updateResults(0, 0, 0, 0);
        }
    }

    loadInputValues() {
        const inputs = sessionStorage.getItem("inputValues");
        if (inputs) {
            const { abv, volume, percentage, temperature, heads } = JSON.parse(inputs);
            this.abvInput.value = abv || '';
            this.volumeInput.value = volume || '';
            this.percentageInput.value = percentage || '';
            this.temperatureInput.value = temperature || '';
            this.headsInput.value = heads || '';
        } else {
            this.abvInput.value = '';
            this.volumeInput.value = '';
            this.percentageInput.value = '';
            this.temperatureInput.value = DEFAULT_TEMPERATURE;
            this.headsInput.value = HEADS_PERCENTAGE;
        }
    }

    getInputValues() {
        const A = parseFloat(this.abvInput.value) || 0; // Default to 0 if NaN
        const V = parseFloat(this.volumeInput.value) || 0; // Default to 0 if NaN
        const F = parseFloat(this.percentageInput.value) || 0; // Default to 0 if NaN
        const T = parseFloat(this.temperatureInput.value) || DEFAULT_TEMPERATURE; // Use default
        const H = parseFloat(this.headsInput.value) || HEADS_PERCENTAGE; // Use default

        return { A, V, F, T, H };
    }

    calculate() {
        const { A, V, F, T, H } = this.getInputValues();

        if (A <= 0 || V <= 0) {
            this.updateResults(0, 0, 0, 0); // Reset results if inputs are invalid
            return;
        }

        const correctedF = F - (TEMPERATURE_CORRECTION_FACTOR * (T - DEFAULT_TEMPERATURE));

        const Sa = this.calculatePureAlcohol(V, correctedF);
        const Sh = this.calculateHeads(Sa, H);
        const St = this.calculateTails(Sa);
        const Sha = this.calculateHeartsAbsolute(Sa, Sh, St);
        const S = this.calculateHearts(Sha, A);
        const Sw = this.calculateWash(V, S, Sh);

        this.updateResults(Sa, Sh, S, Sw);

        sessionStorage.setItem("alcoholResults", JSON.stringify({ Sa, Sh, S, Sw }));
        sessionStorage.setItem("inputValues", JSON.stringify({ abv: A, volume: V, percentage: F, temperature: T, heads: H }));
    }

    calculatePureAlcohol(V, correctedF) {
        return (V * correctedF) / 100;
    }

    calculateHeads(Sa, H) {
        return (Sa * H) / 100;
    }

    calculateTails(Sa) {
        return (Sa * TAILS_PERCENTAGE) / 100;
    }

    calculateHeartsAbsolute(Sa, Sh, St) {
        return Sa - Sh - St;
    }

    calculateHearts(Sha, A) {
        return (Sha * 100) / A;
    }

    calculateWash(V, S, Sh) {
        return V - S - Sh;
    }

    updateResults(Sa, Sh, S, Sw) {
        const roundedSa = Math.round(Sa);
        const roundedSh = Math.round(Sh);
        const roundedS = Math.round(S);
        const roundedSw = Math.round(Sw);

        this.totalResult.innerText = `${roundedSa}`;
        this.headsResult.innerText = `${roundedSh}`;
        this.heartsResult.innerText = `${roundedS}`;
        this.tailsResult.innerText = `${roundedSw}`;

        this.resultDiv.classList.remove("d-none");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PureAlcoholCalculator();
});
