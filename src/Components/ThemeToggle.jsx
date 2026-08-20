import { useEffect, useState } from 'react';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

import {
  applyTheme,
  getActiveTheme,
  watchSystemTheme,
} from '../utils/theme';

const ThemeToggle = ({ className = '' }) => {
  const [theme, setTheme] = useState(getActiveTheme);

  useEffect(() => watchSystemTheme(setTheme), []);

  useEffect(() => {
    if (theme !== getActiveTheme()) applyTheme(theme);
  }, [theme]);

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`relative h-11 w-11 shrink-0 grid place-items-center rounded-pill
                  text-muted hover:text-ink bg-raised
                  transition-colors duration-200 ease-out ${className}`}
    >
      {/* Both icons stay mounted and cross-fade, so the swap doesn't jump. */}
      <HiOutlineSun
        size={19}
        className={`absolute transition-all duration-300 ease-out ${
          theme === 'dark'
            ? 'opacity-0 -rotate-90 scale-50'
            : 'opacity-100 rotate-0 scale-100'
        }`}
      />
      <HiOutlineMoon
        size={18}
        className={`absolute transition-all duration-300 ease-out ${
          theme === 'dark'
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 rotate-90 scale-50'
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
