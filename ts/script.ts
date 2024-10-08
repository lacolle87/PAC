const HEADS_PERCENTAGE = 10;
const DEFAULT_TEMPERATURE = 20;
const TEMPERATURE_CORRECTION_FACTOR = 0.33;
const TAILS_PERCENTAGE = 20;
const ZERO = 0;

class PureAlcoholCalculator {
    abvInput: HTMLInputElement;
    volumeInput: HTMLInputElement;
    percentageInput: HTMLInputElement;
    temperatureInput: HTMLInputElement;
    headsInput: HTMLInputElement;
    resultDiv: HTMLElement;
    totalResult: HTMLElement;
    headsResult: HTMLElement;
    heartsResult: HTMLElement;
    tailsResult: HTMLElement;

    constructor() {
        this.abvInput = document.getElementById("abv") as HTMLInputElement;
        this.volumeInput = document.getElementById("volume") as HTMLInputElement;
        this.percentageInput = document.getElementById("percentage") as HTMLInputElement;
        this.temperatureInput = document.getElementById("temperature") as HTMLInputElement;
        this.headsInput = document.getElementById("heads") as HTMLInputElement;
        this.resultDiv = document.getElementById("result") as HTMLElement;
        this.totalResult = document.getElementById("totalResult") as HTMLElement;
        this.headsResult = document.getElementById("headsResult") as HTMLElement;
        this.heartsResult = document.getElementById("heartsResult") as HTMLElement;
        this.tailsResult = document.getElementById("tailsResult") as HTMLElement;

        this.loadInputValues();
        this.loadResults();

        this.addInputListeners();
    }

    addInputListeners() {
        const inputs = [this.abvInput, this.volumeInput, this.percentageInput, this.temperatureInput, this.headsInput];
        inputs.forEach(input => {
            input.addEventListener("input", () => {
                this.calculate();
            });

            input.addEventListener("keydown", (event: KeyboardEvent) => {
                if (event.key === "Enter") {
                    this.validateAndCorrectInput(input);
                    event.preventDefault();
                    input.blur();
                }
            });

            input.addEventListener("blur", () => {
                this.validateAndCorrectInput(input);
            });
        });
    }

    validateAndCorrectInput(input: HTMLInputElement) {
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        const step = parseFloat(input.step);
        let value = input.value;

        if (value === "") {
            input.value = "";
            return;
        }

        value = parseFloat(value).toString();

        if (isNaN(parseFloat(value))) {
            value = input.placeholder ? parseFloat(input.placeholder).toString() : min.toString();
        }

        let numericValue = parseFloat(value);
        if (numericValue < min) numericValue = min;
        if (numericValue > max) numericValue = max;

        numericValue = Math.round(numericValue / step) * step;
        numericValue = parseFloat(numericValue.toFixed(1));

        if (input.value.length >= 2) {
            if (input.id === "abv") {
                const percentageValue = parseFloat(this.percentageInput.value);
                if (numericValue < percentageValue) {
                    numericValue = percentageValue;
                }
            }

            if (input.id === "percentage") {
                const abvValue = parseFloat(this.abvInput.value);
                if (numericValue > abvValue) {
                    this.abvInput.value = numericValue.toString();
                }
            }
        }

        input.value = numericValue.toString();
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
            this.temperatureInput.value = DEFAULT_TEMPERATURE.toString();
            this.headsInput.value = HEADS_PERCENTAGE.toString();
        }
    }

    getInputValues() {
        const A = parseFloat(this.abvInput.value) || ZERO;
        const V = parseFloat(this.volumeInput.value) || ZERO;
        const F = parseFloat(this.percentageInput.value) || ZERO;
        const T = parseFloat(this.temperatureInput.value) || DEFAULT_TEMPERATURE;
        const H = parseFloat(this.headsInput.value) || HEADS_PERCENTAGE;

        return { A, V, F, T, H };
    }

    calculate() {
        const { A, V, F, T, H } = this.getInputValues();

        if (A <= 0 || V <= 0) {
            this.updateResults(0, 0, 0, 0);
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

    calculatePureAlcohol(V: number, correctedF: number): number {
        return (V * correctedF) / 100;
    }

    calculateHeads(Sa: number, H: number): number {
        return (Sa * H) / 100;
    }

    calculateTails(Sa: number): number {
        return (Sa * TAILS_PERCENTAGE) / 100;
    }

    calculateHeartsAbsolute(Sa: number, Sh: number, St: number): number {
        return Sa - Sh - St;
    }

    calculateHearts(Sha: number, A: number): number {
        return (Sha * 100) / A;
    }

    calculateWash(V: number, S: number, Sh: number): number {
        return V - S - Sh;
    }

    updateResults(Sa: number, Sh: number, S: number, Sw: number) {
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
