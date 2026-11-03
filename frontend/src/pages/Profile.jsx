import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiCalendar, FiMapPin, FiSave, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import CitySearch from '../components/CitySearch';
import api from '../api/axios';
import '../styles/Profile.css';

function Profile() {
  const { user, updateUser } = useAuth();
  const [selectedCity, setSelectedCity] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.city) {
      setSelectedCity({
        name: user.city,
        latitude: user.city_latitude,
        longitude: user.city_longitude,
      });
    }
  }, [user]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        city: selectedCity?.name || null,
        city_latitude: selectedCity?.latitude || null,
        city_longitude: selectedCity?.longitude || null,
      };

      const response = await api.put('/user/profile', payload);
      updateUser(response.data);
      toast.success('Pomyślnie zaktualizowano domyślną miejscowość!');
    } catch (err) {
      console.error(err);
      toast.error('Nie udało się zapisać zmian w profilu.');
    } finally {
      setSaving(false);
    }
  };

  const handleClearCity = async () => {
    setSaving(true);
    try {
      const payload = {
        city: null,
        city_latitude: null,
        city_longitude: null,
      };
      const response = await api.put('/user/profile', payload);
      updateUser(response.data);
      setSelectedCity(null);
      toast.info('Usunięto domyślną miejscowość.');
    } catch (err) {
      console.error(err);
      toast.error('Nie udało się usunąć miejscowości.');
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Brak danych';

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Mój Profil</h1>
          <p className="profile-subtitle">
            Zarządzaj swoimi danymi oraz preferowaną miejscowością
          </p>
        </div>

        <div className="profile-grid">
          {/* Account Details Card */}
          <div className="profile-card user-info-card">
            <div className="profile-card-header">
              <div className="card-icon-box">
                <FiUser />
              </div>
              <h2 className="card-title">Dane Konta</h2>
            </div>

            <div className="profile-details-list">
              <div className="detail-item">
                <div className="detail-icon">
                  <FiUser />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Nazwa użytkownika</span>
                  <span className="detail-value">{user?.username || '—'}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <FiMail />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Adres e-mail</span>
                  <span className="detail-value">{user?.email || '—'}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <FiCalendar />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Data dołączenia</span>
                  <span className="detail-value">{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* City / Location Preference Card */}
          <div className="profile-card location-card">
            <div className="profile-card-header">
              <div className="card-icon-box location-icon-box">
                <FiMapPin />
              </div>
              <h2 className="card-title">Twoja Domyślna Miejscowość</h2>
            </div>

            <p className="location-desc">
              Ustawienie domyślnego miasta sprawi, że panel główny (Dashboard) natychmiast
              po zalogowaniu wyświetli aktualną jakość powietrza i prognozy smogu dla Twojej okolicy.
            </p>

            <form onSubmit={handleSaveProfile} className="location-form">
              <div className="form-group">
                <label className="form-label">
                  Wyszukaj i wybierz swoją miejscowość
                </label>
                <CitySearch
                  onSelectCity={handleCitySelect}
                  placeholder={user?.city ? `Zmień miejscowość (aktualnie: ${user.city})...` : "Wpisz nazwę miejscowości (np. Wrocław, Kraków)..."}
                />
              </div>

              {/* Status of selected city */}
              {selectedCity ? (
                <div className="selected-city-badge">
                  <div className="badge-icon">
                    <FiCheckCircle />
                  </div>
                  <div className="badge-text">
                    <span className="badge-title">Wybrana miejscowość:</span>
                    <strong className="badge-city-name">{selectedCity.name}</strong>
                    {selectedCity.latitude && selectedCity.longitude && (
                      <span className="badge-coords">
                        (Szerokość: {Number(selectedCity.latitude).toFixed(3)}°, Długość: {Number(selectedCity.longitude).toFixed(3)}°)
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-city-badge">
                  Nie wybrano jeszcze domyślnej miejscowości. Użyj pola powyżej, aby wyszukać.
                </div>
              )}

              <div className="profile-actions">
                <button
                  type="submit"
                  className="btn-save-profile"
                  disabled={saving || !selectedCity}
                >
                  <FiSave />
                  <span>{saving ? 'Zapisywanie...' : 'Zapisz miejscowość'}</span>
                </button>

                {user?.city && (
                  <button
                    type="button"
                    className="btn-clear-city"
                    onClick={handleClearCity}
                    disabled={saving}
                  >
                    <FiTrash2 />
                    <span>Usuń przypisanie</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
