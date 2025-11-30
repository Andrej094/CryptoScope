export function createRouter(ctx) {
    const router = {
        current: 'landing',

        go: (view, data) => {
            // Toggle main containers
            const landing = document.getElementById('view-landing');
            const appContainer = document.getElementById('app-container');

            if (landing && appContainer) {
                landing.classList.toggle('hidden-view', view !== 'landing');
                appContainer.classList.toggle('hidden-view', view === 'landing');
            }

            // Sub-views
            ['dashboard', 'watchlist', 'detail'].forEach((v) => {
                const el = document.getElementById(`view-${v}`);
                if (el) el.classList.add('hidden-view');
            });
            if (view !== 'landing') {
                const activeView = document.getElementById(`view-${view}`);
                if (activeView) activeView.classList.remove('hidden-view');
            }

            // Desktop nav
            document.querySelectorAll('.nav-link').forEach((el) => {
                el.classList.remove(
                    'active',
                    'text-gray-900',
                    'dark:text-white',
                    'border-brand-orange'
                );
            });
            const btn = document.getElementById(`nav-${view}`);
            if (btn) btn.classList.add('active', 'border-brand-orange');

            // Mobile nav
            document.querySelectorAll('.mobile-nav-link').forEach((el) => {
                el.classList.remove('active', 'text-brand-orange');
                el.classList.add('text-gray-400', 'dark:text-gray-500');
            });
            const mobBtn = document.getElementById(`mob-nav-${view}`);
            if (mobBtn) {
                mobBtn.classList.add('active', 'text-brand-orange');
                mobBtn.classList.remove('text-gray-400', 'dark:text-gray-500');
            }

            // Logic
            router.current = view;
            if (view === 'watchlist') ctx.ui.renderWatchlist();
            if (view === 'dashboard') ctx.ui.renderDashboard();
            if (view === 'detail' && data) ctx.ui.renderDetail(data);

            window.scrollTo(0, 0);
        },

        back: () => router.go('dashboard')
    };

    return router;
}
