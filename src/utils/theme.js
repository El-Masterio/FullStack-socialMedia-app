/* Single source of truth for the colour theme.
   The initial class is applied by an inline script in public/index.html so the
   page never flashes the wrong theme; this module keeps React in sync with it. */

const KEY = 'theme';

export const getStoredTheme = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const getActiveTheme = () =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

export const applyTheme = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* private mode - the class still applied, it just won't persist */
  }
};

/* Follow the OS only while the user hasn't made an explicit choice. */
export const watchSystemTheme = (onChange) => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e) => {
    if (!getStoredTheme()) onChange(e.matches ? 'dark' : 'light');
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
};
