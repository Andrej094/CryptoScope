export function createUtils(ctx) {
    const utils = {
        fmt: (n) =>
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(n),

        drawChart: (id, isPos, isDetail = false) => {
            const cvs = document.getElementById(id);
            if (!cvs) return;
            const g = cvs.getContext('2d');
            const w = cvs.width;
            const h = cvs.height;

            const isDark = ctx.state.theme === 'dark';

            g.clearRect(0, 0, w, h);
            g.beginPath();

            let x = 0;
            let y = h / 2;
            const steps = isDetail ? 200 : 25;
            const stepW = w / steps;
            const volatility = isDetail ? 15 : 10;

            g.moveTo(0, y);
            for (let i = 1; i <= steps; i++) {
                x = i * stepW;
                y += (Math.random() - 0.5) * volatility;
                if (y < 5) y = 5;
                if (y > h - 5) y = h - 5;
                g.lineTo(x, y);
            }

            if (isDetail) {
                g.strokeStyle = '#FF8C00';
            } else {
                g.strokeStyle = isPos
                    ? (isDark ? '#10B981' : '#059669')
                    : (isDark ? '#EF4444' : '#DC2626');
            }

            g.lineWidth = isDetail ? 4 : 3;
            g.lineCap = 'round';
            g.lineJoin = 'round';
            g.stroke();

            if (isDetail) {
                g.lineTo(w, h);
                g.lineTo(0, h);
                const grad = g.createLinearGradient(0, 0, 0, h);
                grad.addColorStop(0, isDark ? '#FF8C0044' : '#FF8C0022');
                grad.addColorStop(1, 'transparent');
                g.fillStyle = grad;
                g.fill();
            }
        },

        drawRealChart: (id, prices) => {
            const cvs = document.getElementById(id);
            if (!cvs) return;
            const g = cvs.getContext('2d');

            const dpr = window.devicePixelRatio || 1;
            const w = cvs.clientWidth || cvs.width;
            const h = cvs.clientHeight || cvs.height;

            cvs.width = w * dpr;
            cvs.height = h * dpr;
            g.setTransform(dpr, 0, 0, dpr, 0, 0);

            g.clearRect(0, 0, w, h);

            if (!prices || prices.length === 0) {
                utils.drawChart(id, true, true);
                return;
            }

            const closes = prices.map((p) => Number(p.close));
            const min = Math.min(...closes);
            const max = Math.max(...closes);
            const span = max - min || 1;

            g.beginPath();
            closes.forEach((value, i) => {
                const x = (i / (closes.length - 1)) * w;
                const y = h - ((value - min) / span) * h;
                if (i === 0) g.moveTo(x, y);
                else g.lineTo(x, y);
            });

            g.strokeStyle = '#FF8C00';
            g.lineWidth = 3;
            g.lineCap = 'round';
            g.lineJoin = 'round';
            g.stroke();

            g.lineTo(w, h);
            g.lineTo(0, h);
            const grad = g.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#FF8C0040');
            grad.addColorStop(1, 'transparent');
            g.fillStyle = grad;
            g.fill();
        },

        filterPrices: (prices, range) => {
            const now = new Date();
            let cutoff = null;

            if (range === '1D')
                cutoff = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
            if (range === '1Y')
                cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            if (range === '10Y')
                cutoff = new Date(now.getTime() - 3650 * 24 * 60 * 60 * 1000);

            if (!cutoff) return prices;

            return prices.filter((p) => new Date(p.date) >= cutoff);
        }
    };

    return utils;
}
