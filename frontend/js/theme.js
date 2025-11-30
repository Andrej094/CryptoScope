export function createTheme(ctx) {
    const theme = {
        init: () => {
            const prefersDark = window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (
                localStorage.theme === 'dark' ||
                (!('theme' in localStorage) && prefersDark)
            ) {
                theme.set('dark');
            } else {
                theme.set('light');
            }
        },

        set: (val) => {
            ctx.state.theme = val;
            localStorage.theme = val;

            if (val === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },

        toggle: () => {
            theme.set(ctx.state.theme === 'dark' ? 'light' : 'dark');
        }
    };

    return theme;
}
