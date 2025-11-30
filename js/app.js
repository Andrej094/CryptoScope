import { state, internal } from './state.js';
import { createUtils } from './utils.js';
import { createTheme } from './theme.js';
import { createRouter } from './router.js';
import { createUI } from './ui.js';

// Глобален app објект кој ќе го користат onclick во HTML
const app = {
    state,
    internal
};

// Attach submodules
app.utils = createUtils(app);
app.theme = createTheme(app);
app.router = createRouter(app);
app.ui = createUI(app);

// init (исто како во оригиналниот код)
app.init = async function () {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/symbols');
        const data = await res.json();
        console.log('Loaded symbols:', data);

        app.state.coins = data.map((c) => ({
            id: c.id,
            rank: c.rank,
            symbol: c.name,       // BTC
            fullSymbol: c.symbol, // BTC-USD
            name: c.name,
            price: parseFloat(c.price) || 0,
            change: parseFloat(c.change) || 0,
            vol: c.vol || '0',
            mcap: '?'
        }));

        const tick = document.getElementById('ticker');
        if (tick) {
            let h = '';
            app.state.coins.slice(0, 10).forEach((c) => {
                const col =
                    c.change >= 0 ? 'text-emerald-400' : 'text-red-400';
                h += `<span class="mx-8 font-mono">${c.symbol} <span class="${col}">${c.change}%</span></span>`;
            });
            tick.innerHTML = h + h;
        }

        // прв render (кога ќе кликнат Initialize Terminal)
        app.ui.renderDashboard();
    } catch (err) {
        console.error('Failed to init app', err);
    }
};

// expose на window за HTML onclick="app.xxx"
window.app = app;

// onload
window.addEventListener('load', () => {
    app.theme.init();
    app.init();
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
