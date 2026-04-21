import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Light mode' : 'Dark mode'}
    >
      {darkMode ? 'Light' : 'Dark'}
    </button>
  );
}
