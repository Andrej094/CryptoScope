export const state = {
    coins: [],
    watchlist: new Set([1, 3]),
    filter: '',
    theme: 'light',
    fullHistory: [],
    currentSymbol: null
};

export const internal = {
    smallChartsDrawn: new Set(),
    watchChartsDrawn: new Set()
};
