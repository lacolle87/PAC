const App = {
    data() {
        return {
            fields: [
                { id: 'volume', label: 'Volume of solution (ml):', value: null, min: 1, step: 1, required: true, type: 'number' },
                { id: 'percentage', label: 'ABV of solution:', value: null, min: 0, max: 97, step: 0.1, required: true, type: 'number' },
                { id: 'abv', label: 'Target ABV of hearts:', value: null, min: 0, max: 97, step: 0.1, required: true, type: 'number' },
                { id: 'temperature', label: 'Temperature (°C):', value: 20, min: 1, max: 78, step: 0.1, required: false, type: 'number', placeholder: '20' },
                { id: 'heads', label: 'Percentage of heads to take:', value: 10, min: 1, max: 20, step: 0.1, required: false, type: 'number', placeholder: '10' }
            ],
            results: [
                { id: 'totalResult', label: 'Pure alcohol', value: 0 },
                { id: 'headsResult', label: 'Heads', value: 0 },
                { id: 'heartsResult', label: 'Hearts', value: 0 },
                { id: 'tailsResult', label: 'Tails', value: 0 }
            ]
        };
    }
};

Vue.createApp(App).mount('#app');