export function createUI(ctx) {
    const ui = {
        scrollDown: () => {
            const el = document.getElementById('features-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        },

        searchTimer: null,

        handleSearch(val) {
            clearTimeout(ui.searchTimer);
            ui.searchTimer = setTimeout(() => {
                val = (val || '').toLowerCase().trim();
                ctx.state.filter = val === '' ? null : val;
                ui.renderDashboard();
            }, 150);
        },

        focusSearch: () => {
            if (ctx.router.current !== 'dashboard') {
                ctx.router.go('dashboard');
            }
            setTimeout(() => {
                const input = document.getElementById('mobile-search-input');
                if (input) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    input.focus();
                }
            }, 100);
        },

        toggleWatch: (e, id) => {
            e.stopPropagation();
            if (ctx.state.watchlist.has(id)) {
                ctx.state.watchlist.delete(id);
            } else {
                ctx.state.watchlist.add(id);
            }
            ui.renderDashboard();
            ui.renderWatchlist();
        },

        renderDashboard() {
            const coins = ctx.state.coins;
            const filter = ctx.state.filter;
            const isFiltering = filter !== null;

            const topContainer = document.getElementById('top-cards-container');
            const tbody = document.getElementById('market-table-body');
            const noRes = document.getElementById('no-results');

            if (!topContainer || !tbody || !noRes) return;

            let list;
            if (isFiltering) {
                const f = filter;
                list = coins.filter(
                    (c) =>
                        c.name.toLowerCase().includes(f) ||
                        c.symbol.toLowerCase().includes(f)
                );
            } else {
                list = coins.slice(5);
            }

            // Top 5 cards
            let topHtml = '';
            if (!isFiltering) {
                topContainer.classList.remove('hidden-view');
                ctx.internal.smallChartsDrawn.clear();
                coins.slice(0, 5).forEach((c, i) => {
                    const isPos = c.change >= 0;
                    const trendCls = isPos
                        ? 'text-emerald-500 bg-emerald-500/10'
                        : 'text-red-500 bg-red-500/10';

                    topHtml += `
                        <div onclick="app.router.go('detail', ${c.id})"
                             class="scope-card rounded-2xl p-4 md:p-6 cursor-pointer animate-fade-in relative overflow-hidden group"
                             style="animation-delay:${i * 40}ms">
                            <div class="flex justify-between items-start mb-3 md:mb-4">
                                <div class="flex items-center gap-2 md:gap-3">
                                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white font-bold border border-gray-200 dark:border-gray-600 text-base md:text-lg shadow-sm">
                                        ${c.symbol[0]}
                                    </div>
                                    <div>
                                        <div class="font-bold text-gray-900 dark:text-white text-base md:text-lg leading-none mb-0.5 md:mb-1">
                                            ${c.name}
                                        </div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                            ${c.symbol}
                                        </div>
                                    </div>
                                </div>
                                <div class="${trendCls} px-2 md:px-2.5 py-1 rounded-lg text-xs md:text-sm font-bold">
                                    ${isPos ? '+' : ''}${c.change}%
                                </div>
                            </div>
                            <div class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 md:mb-4 tracking-tight">
                                ${ctx.utils.fmt(c.price)}
                            </div>
                            <div class="h-12 md:h-16 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                                <canvas id="chart-${c.id}" width="250" height="60"></canvas>
                            </div>
                        </div>
                    `;
                });
            } else {
                topContainer.classList.add('hidden-view');
            }
            topContainer.innerHTML = topHtml;

            // Table
            if (list.length === 0) {
                noRes.classList.remove('hidden-view');
                tbody.innerHTML = '';
            } else {
                noRes.classList.add('hidden-view');
                let rowsHtml = '';
                list.forEach((c) => {
                    const isPos = c.change >= 0;
                    const isWatched = ctx.state.watchlist.has(c.id);

                    rowsHtml += `
                        <tr onclick="app.router.go('detail', ${c.id})"
                            class="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer group transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                            <td class="py-4 md:py-5 pl-4 md:pl-8 text-gray-400 text-xs font-mono">
                                ${c.rank}
                            </td>
                            <td class="py-4 md:py-5 px-2 md:px-4">
                                <div class="flex items-center gap-2 md:gap-4">
                                    <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs md:text-sm font-bold">
                                        ${c.symbol[0]}
                                    </div>
                                    <div>
                                        <div class="font-bold text-gray-900 dark:text-white text-sm md:text-base">
                                            ${c.name}
                                        </div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">
                                            ${c.symbol}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="py-4 md:py-5 px-2 md:px-4 text-right font-medium text-gray-900 dark:text-white font-mono text-sm md:text-base">
                                ${ctx.utils.fmt(c.price)}
                            </td>
                            <td class="py-4 md:py-5 px-2 md:px-4 text-right text-xs md:text-sm font-bold ${
                        isPos ? 'text-emerald-500' : 'text-red-500'
                    }">
                                ${isPos ? '+' : ''}${c.change}%
                            </td>
                            <td class="py-4 md:py-5 px-2 md:px-4 text-right text-gray-500 dark:text-gray-400 text-sm hidden md:table-cell">
                                ${c.vol}
                            </td>
                            <td class="py-4 md:py-5 px-2 md:px-4 text-right pr-4 md:pr-6">
                                <button onclick="app.ui.toggleWatch(event, ${c.id})"
                                        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all transform active:scale-90">
                                    <span class="${
                        isWatched
                            ? 'text-brand-orange'
                            : 'text-gray-300 dark:text-gray-600'
                    } text-base md:text-lg">
                                        ★
                                    </span>
                                </button>
                            </td>
                        </tr>
                    `;
                });
                tbody.innerHTML = rowsHtml;
            }

            if (!isFiltering) {
                setTimeout(ui.renderCharts, 30);
            }
        },

        renderWatchlist() {
            const list = ctx.state.coins.filter((c) =>
                ctx.state.watchlist.has(c.id)
            );
            const tbody = document.getElementById('watchlist-table-body');
            const countEl = document.getElementById('watchlist-count');
            const content = document.getElementById('watchlist-content');
            const empty = document.getElementById('watchlist-empty');

            if (!tbody || !countEl || !content || !empty) return;

            countEl.innerText = list.length.toString();

            if (list.length === 0) {
                content.classList.add('hidden-view');
                empty.classList.remove('hidden-view');
                tbody.innerHTML = '';
                return;
            }

            content.classList.remove('hidden-view');
            empty.classList.add('hidden-view');

            let rowsHtml = '';
            list.forEach((c) => {
                const isPos = c.change >= 0;
                rowsHtml += `
                    <tr onclick="app.router.go('detail', ${c.id})"
                        class="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <td class="py-4 md:py-5 pl-4 md:pl-8">
                            <div class="flex items-center gap-2 md:gap-4">
                                <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold text-xs md:text-sm">
                                    ${c.symbol[0]}
                                </div>
                                <div>
                                    <div class="font-bold text-gray-900 dark:text-white text-sm md:text-base">
                                        ${c.name}
                                    </div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">
                                        ${c.symbol}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 md:py-5 px-2 md:px-4 text-right font-bold text-gray-900 dark:text-white font-mono text-sm md:text-base">
                            ${ctx.utils.fmt(c.price)}
                        </td>
                        <td class="py-4 md:py-5 px-2 md:px-4 text-right font-bold text-sm md:text-base ${
                    isPos ? 'text-emerald-500' : 'text-red-500'
                }">
                            ${isPos ? '+' : ''}${c.change}%
                        </td>
                        <td class="py-4 md:py-5 px-2 md:px-4 text-right text-gray-500 dark:text-gray-400 text-sm hidden md:table-cell">
                            ${c.vol}
                        </td>
                        <td class="py-4 md:py-5 px-2 md:px-4 text-right w-24 md:w-40">
                            <canvas id="watch-chart-${c.id}" width="150" height="45"></canvas>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = rowsHtml;

            setTimeout(() => {
                list.forEach((c) => {
                    ctx.utils.drawChart(
                        `watch-chart-${c.id}`,
                        c.change >= 0,
                        false
                    );
                });
            }, 30);
        },

        async renderDetail(id) {
            const c = ctx.state.coins.find((x) => x.id === id);
            if (!c) return;

            document.getElementById('detail-name').innerText = c.name;
            document.getElementById('detail-symbol').innerText = c.symbol;
            document.getElementById('detail-icon').innerText = c.symbol[0];

            let prices = [];
            try {
                const res = await fetch(
                    `http://127.0.0.1:8000/api/prices/${encodeURIComponent(
                        c.fullSymbol
                    )}`
                );
                prices = await res.json();
            } catch (err) {
                console.error('Failed to load prices', err);
            }

            if (prices && prices.length > 0) {
                const last = prices[prices.length - 1];
                document.getElementById('detail-price').innerText =
                    ctx.utils.fmt(last.close);
            } else {
                document.getElementById('detail-price').innerText = ctx.utils.fmt(
                    c.price || 0
                );
            }

            setTimeout(() => {
                ctx.utils.drawRealChart('detail-chart-canvas', prices);
            }, 60);

            ctx.state.fullHistory = prices;
            ctx.state.currentSymbol = c.fullSymbol;

            // default range highlight (10Y)
            ui.setRange('10Y');
        },

        renderCharts() {
            if (ctx.router.current !== 'dashboard') return;
            const firstFive = ctx.state.coins.slice(0, 5);
            firstFive.forEach((c) => {
                const id = `chart-${c.id}`;
                if (!ctx.internal.smallChartsDrawn.has(id)) {
                    ctx.utils.drawChart(id, c.change >= 0, false);
                    ctx.internal.smallChartsDrawn.add(id);
                }
            });
        },

        setRange(range) {
            const full = ctx.state.fullHistory || [];
            const filtered = ctx.utils.filterPrices(full, range);

            ctx.utils.drawRealChart('detail-chart-canvas', filtered);

            const buttons = document.querySelectorAll('.range-btn');
            buttons.forEach((btn) => btn.classList.remove('active-range'));

            const active = [...buttons].find(
                (b) => b.innerText.trim().toUpperCase() === range.toUpperCase()
            );
            if (active) active.classList.add('active-range');
        }
    };

    return ui;
}
