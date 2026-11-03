import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { WiDust } from 'react-icons/wi';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Proszę wypełnić wszystkie pola.');
      return;
    }

    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków.');
      return;
    }

    setSubmitting(true);
    try {
      await register(username, email, password);
      toast.success('Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.');
      navigate('/login');
    } catch (err) {
      const detail = err.response?.data?.detail;
      let msg;
      if (typeof detail === 'string') {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail.map((d) => d.msg || d).join('. ');
      } else {
        msg =
          err.response?.data?.message ||
          'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.';
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative background elements */}
      <div className="auth-bg-decoration">
        <div className="bg-circle bg-circle-1" />
        <div className="bg-circle bg-circle-2" />
        <div className="bg-circle bg-circle-3" />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <WiDust className="auth-icon" />
          </div>
          <h1 className="auth-title">Utwórz konto</h1>
          <p className="auth-subtitle">
            Dołącz do systemu prognozowania jakości powietrza
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nazwa użytkownika
            </label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="jan_kowalski"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Adres e-mail
            </label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="jan.kowalski@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Hasło
            </label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Min. 6 znaków"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={submitting}
          >
            {submitting ? (
              <span className="btn-loading">
                <span className="btn-spinner" />
                Rejestracja...
              </span>
            ) : (
              <>
                <FiUserPlus />
                <span>Zarejestruj się</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Masz już konto?{' '}
            <Link to="/login" className="auth-link">
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
