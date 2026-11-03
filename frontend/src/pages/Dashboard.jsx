import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiActivity,
  FiBarChart2,
  FiCpu,
  FiDatabase,
  FiMapPin,
  FiStar,
  FiRotateCcw,
  FiArrowRight,
  FiCheckCircle,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import CitySearch from '../components/CitySearch';
import api from '../api/axios';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user, updateUser } = useAuth();

  // Active viewing city (defaults to user's city if available, otherwise Warszawa)
  const [activeCity, setActiveCity] = useState({
    name: user?.city || 'Warszawa',
    latitude: user?.city_latitude || 52.2297,
    longitude: user?.city_longitude || 21.0122,
    isUserDefault: Boolean(user?.city),
  });

  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [savingDefault, setSavingDefault] = useState(false);

  // Update active city if user object changes and no manual search was made yet
  useEffect(() => {
    if (user?.city && (!activeCity || activeCity.name === 'Warszawa')) {
      setActiveCity({
        name: user.city,
        latitude: user.city_latitude,
        longitude: user.city_longitude,
        isUserDefault: true,
      });
    }
  }, [user]);

  // Fetch summary whenever activeCity changes
  const fetchSummary = useCallback(async (cityObj) => {
    setLoadingSummary(true);
    try {
      const response = await api.get('/dashboard/summary', {
        params: {
          city: cityObj.name,
          lat: cityObj.latitude,
          lon: cityObj.longitude,
        },
      });
      setSummaryData(response.data);
    } catch (err) {
      console.error('Błąd pobierania danych dashboardu:', err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  useEffect(() => {
    if (activeCity) {
      fetchSummary(activeCity);
    }
  }, [activeCity, fetchSummary]);

  // When a new city is selected from search
  const handleSelectCity = (city) => {
    const isDefault = Boolean(user?.city && user.city.toLowerCase() === city.name.toLowerCase());
    const newCity = {
      name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      admin1: city.admin1,
      country: city.country,
      isUserDefault: isDefault,
    };
    setActiveCity(newCity);
    toast.info(`Wybrano miejscowość: ${city.name}`);
  };

  // Set the current active city as user's default city
  const handleSetAsDefault = async () => {
    if (!activeCity) return;
    setSavingDefault(true);
    try {
      const payload = {
        city: activeCity.name,
        city_latitude: activeCity.latitude,
        city_longitude: activeCity.longitude,
      };
      const response = await api.put('/user/profile', payload);
      updateUser(response.data);
      setActiveCity((prev) => ({ ...prev, isUserDefault: true }));
      toast.success(`${activeCity.name} ustawiono jako Twoje domyślne miasto!`);
    } catch (err) {
      console.error(err);
      toast.error('Nie udało się zapisać domyślnego miasta.');
    } finally {
      setSavingDefault(false);
    }
  };

  // Reset view back to user's default city
  const handleResetToUserCity = () => {
    if (user?.city) {
      setActiveCity({
        name: user.city,
        latitude: user.city_latitude,
        longitude: user.city_longitude,
        isUserDefault: true,
      });
      toast.info(`Przywrócono domyślne miasto: ${user.city}`);
    }
  };

  const isCurrentCityUserDefault = Boolean(
    user?.city && activeCity?.name?.toLowerCase() === user.city.toLowerCase()
  );

  const stats = [
    {
      id: 'aqi',
      icon: <FiActivity />,
      label: `Jakość Powietrza (${activeCity.name})`,
      value: summaryData?.air_quality_index || 'Brak danych',
      color: 'var(--accent-primary)',
      bg: 'var(--accent-primary-light)',
    },
    {
      id: 'predictions',
      icon: <FiBarChart2 />,
      label: 'Wykonane Predykcje',
      value: summaryData?.stats?.total_predictions ?? '0',
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.1)',
    },
    {
      id: 'models',
      icon: <FiCpu />,
      label: 'Wytrenowane Modele',
      value: summaryData?.stats?.models_trained ?? '0',
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
      list: summaryData?.stats?.data_sources || ['Open-Meteo API', 'CSV Upload'],
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

        {/* City Search Bar & Location Control Section */}
        <section className="dashboard-city-section">
          <div className="city-search-container">
            <label className="search-label">
              <FiMapPin className="label-icon" /> Sprawdź inną miejscowość:
            </label>
            <CitySearch
              onSelectCity={handleSelectCity}
              placeholder="Wpisz nazwę miejscowości (np. Kraków, Zakopane, Katowice, Gdańsk)..."
            />
          </div>

          {/* Active Location Info Bar */}
          <div className="active-location-card">
            <div className="location-info-left">
              <div className="location-pin-icon">
                <FiMapPin />
              </div>
              <div className="location-details">
                <div className="location-title-row">
                  <h2 className="current-city-name">{activeCity.name}</h2>
                  {isCurrentCityUserDefault ? (
                    <span className="badge-default-city" title="Twoje domyślne miasto zapisane w profilu">
                      <FiStar /> Domyślna lokalizacja
                    </span>
                  ) : (
                    <span className="badge-searched-city">
                      Wyszukana lokalizacja
                    </span>
                  )}
                </div>
                {activeCity.latitude && activeCity.longitude && (
                  <p className="current-city-coords">
                    Współrzędne: {Number(activeCity.latitude).toFixed(3)}° N, {Number(activeCity.longitude).toFixed(3)}° E
                    {activeCity.admin1 ? ` • Woj. ${activeCity.admin1}` : ''}
                  </p>
                )}
              </div>
            </div>

            <div className="location-actions">
              {!isCurrentCityUserDefault && (
                <button
                  type="button"
                  className="btn-set-default"
                  onClick={handleSetAsDefault}
                  disabled={savingDefault}
                  title="Ustaw to miasto jako domyślne dla Twojego konta"
                >
                  <FiStar />
                  <span>{savingDefault ? 'Zapisywanie...' : 'Ustaw jako domyślne'}</span>
                </button>
              )}

              {user?.city && !isCurrentCityUserDefault && (
                <button
                  type="button"
                  className="btn-reset-city"
                  onClick={handleResetToUserCity}
                  title={`Wróć do Twojego domyślnego miasta (${user.city})`}
                >
                  <FiRotateCcw />
                  <span>Wróć do: {user.city}</span>
                </button>
              )}
            </div>
          </div>

          {/* Prompt if user hasn't configured a default city yet */}
          {!user?.city && (
            <div className="default-city-prompt">
              <div className="prompt-text">
                💡 <strong>Wskazówka:</strong> Nie ustawiłeś jeszcze swojego domyślnego miasta.
                Wyszukaj miejscowość powyżej i kliknij <em>„Ustaw jako domyślne”</em> lub przejdź do Profilu.
              </div>
              <Link to="/profile" className="prompt-link">
                Przejdź do profilu <FiArrowRight />
              </Link>
            </div>
          )}
        </section>

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
              {summaryData?.message ||
                `Pełne funkcjonalności pojawią się wkrótce. Pracujemy nad modułami predykcji smogu dla lokalizacji ${activeCity.name}, integracją z modelami ML oraz wizualizacją parametrów.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
