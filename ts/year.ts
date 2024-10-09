const currentYearElement = document.getElementById('currentYear') as HTMLElement;

if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear().toString();
}