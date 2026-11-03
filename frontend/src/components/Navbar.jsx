import { Link, useNavigate, useLocation } from 'react-router-dom';
import { WiStrongWind } from 'react-icons/wi';
import { FiLogOut, FiUser, FiMapPin, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboardActive = location.pathname === '/dashboard' || location.pathname === '/';
  const isProfileActive = location.pathname === '/profile';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <WiStrongWind className="brand-icon" />
          <span className="brand-text">AirQ Predictor</span>
        </Link>

        <div className="navbar-right">
          {token && user ? (
            <div className="navbar-user">
              {/* Navigation links */}
              <div className="navbar-nav-links">
                <Link
                  to="/dashboard"
                  className={`nav-link ${isDashboardActive ? 'active' : ''}`}
                >
                  <FiGrid className="nav-icon" />
                  <span>Dashboard</span>
                </Link>
              </div>

              {/* Profile Link */}
              <Link
                to="/profile"
                className={`user-info user-profile-link ${isProfileActive ? 'active' : ''}`}
                title="Mój Profil i Ustawienia Miejscowości"
              >
                <FiUser className="user-icon" />
                <span className="user-name">{user.username}</span>
                {user.city && (
                  <span className="navbar-city-tag" title={`Domyślna miejscowość: ${user.city}`}>
                    <FiMapPin /> {user.city}
                  </span>
                )}
              </Link>

              <button
                className="btn-logout"
                onClick={handleLogout}
                title="Wyloguj się z systemu"
              >
                <FiLogOut />
                <span>Wyloguj</span>
              </button>
            </div>
          ) : (
            <div className="navbar-auth-links">
              <Link to="/login" className="nav-link">
                Logowanie
              </Link>
              <Link to="/register" className="nav-link nav-link-accent">
                Rejestracja
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
