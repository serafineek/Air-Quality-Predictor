import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import '../styles/Footer.css';

function Footer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <p className="footer-text">
          © 2026 AirQ Predictor — Mateusz Serafin, 134969
        </p>
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Tryb ciemny' : 'Tryb jasny'}
          aria-label={theme === 'light' ? 'Przełącz na tryb ciemny' : 'Przełącz na tryb jasny'}
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
          <span>{theme === 'light' ? 'Tryb ciemny' : 'Tryb jasny'}</span>
        </button>
      </div>
    </footer>
  );
}

export default Footer;

