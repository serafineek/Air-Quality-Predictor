import { Link, useNavigate } from 'react-router-dom';
import { WiStrongWind } from 'react-icons/wi';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
              <div className="user-info">
                <FiUser className="user-icon" />
                <span className="user-name">{user.username}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
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
