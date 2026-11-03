import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiMapPin, FiX, FiLoader } from 'react-icons/fi';
import api from '../api/axios';
import '../styles/CitySearch.css';

function CitySearch({ onSelectCity, placeholder = 'Wyszukaj miejscowość (np. Kraków, Warszawa, Gdańsk)...' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await api.get('/geo/cities', {
          params: { q: trimmed, count: 6 },
        });
        setSuggestions(response.data || []);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Błąd pobierania podpowiedzi miast:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (city) => {
    setQuery(city.name);
    setIsOpen(false);
    if (onSelectCity) {
      onSelectCity(city);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="city-search-wrapper" ref={wrapperRef}>
      <div className="city-search-input-box">
        <FiSearch className="city-search-icon" />
        <input
          type="text"
          className="city-search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {loading && <FiLoader className="city-search-spinner" />}
        {query && !loading && (
          <button
            type="button"
            className="city-search-clear-btn"
            onClick={handleClear}
            title="Wyczyść"
          >
            <FiX />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="city-suggestions-dropdown">
          {suggestions.map((city, idx) => {
            const isSelected = idx === selectedIndex;
            const regionDetails = [city.admin1, city.country].filter(Boolean).join(', ');

            return (
              <li
                key={`${city.name}-${city.latitude}-${city.longitude}-${idx}`}
                className={`city-suggestion-item ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelect(city)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="city-suggestion-icon">
                  <FiMapPin />
                </div>
                <div className="city-suggestion-text">
                  <span className="city-name">{city.name}</span>
                  {regionDetails && (
                    <span className="city-region">{regionDetails}</span>
                  )}
                </div>
                <div className="city-coords">
                  {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {isOpen && !loading && query.trim().length >= 2 && suggestions.length === 0 && (
        <div className="city-suggestions-empty">
          Nie znaleziono miejscowości dla zapytania „{query}”
        </div>
      )}
    </div>
  );
}

export default CitySearch;
