import {
  FiActivity,
  FiBarChart2,
  FiCpu,
  FiDatabase,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      id: 'aqi',
      icon: <FiActivity />,
      label: 'Indeks Jakości Powietrza',
      value: 'Brak danych',
      color: 'var(--accent-primary)',
      bg: 'rgba(20, 184, 166, 0.1)',
    },
    {
      id: 'predictions',
      icon: <FiBarChart2 />,
      label: 'Wykonane Predykcje',
      value: '0',
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.1)',
    },
    {
      id: 'models',
      icon: <FiCpu />,
      label: 'Wytrenowane Modele',
      value: '0',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      id: 'sources',
      icon: <FiDatabase />,
      label: 'Źródła Danych',
      value: null,
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.1)',
      list: ['Open-Meteo API', 'CSV Upload'],
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Witaj, <span className="highlight">{user?.username || 'Użytkowniku'}</span>!
            </h1>
            <p className="dashboard-subtitle">
              Panel systemu prognozowania jakości powietrza i smogu
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              className="stat-card"
              key={stat.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-icon-wrapper" style={{ background: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                {stat.list ? (
                  <ul className="stat-list">
                    {stat.list.map((item) => (
                      <li key={item} className="stat-list-item">
                        <span className="stat-dot" style={{ background: stat.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="stat-value">{stat.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info banner */}
        <div className="info-banner">
          <div className="info-banner-icon">🚧</div>
          <div className="info-banner-content">
            <p className="info-banner-title">System w przygotowaniu</p>
            <p className="info-banner-text">
              Pełne funkcjonalności pojawią się wkrótce. Pracujemy nad modułami predykcji,
              wizualizacji danych oraz integracją z modelami uczenia maszynowego.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
