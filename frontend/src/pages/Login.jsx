import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { WiDust } from 'react-icons/wi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Proszę wypełnić wszystkie pola.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Zalogowano pomyślnie!');
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Wystąpił błąd podczas logowania. Spróbuj ponownie.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
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
          <h1 className="auth-title">Witaj ponownie</h1>
          <p className="auth-subtitle">
            Zaloguj się do systemu prognozowania jakości powietrza
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
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
                autoFocus
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete="current-password"
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
                Logowanie...
              </span>
            ) : (
              <>
                <FiLogIn />
                <span>Zaloguj się</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Nie masz konta?{' '}
            <Link to="/register" className="auth-link">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
