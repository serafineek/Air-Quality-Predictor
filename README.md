# 🌬️ AirQ Predictor — Inteligentny System Prognozowania Jakości Powietrza i Smogu

**Autor:** Mateusz Serafin, 134969

Aplikacja webowa analizująca dane pogodowe (temperatura, wilgotność, wiatr, ciśnienie) z zewnętrznego API lub plików CSV. Przewiduje poziom zanieczyszczenia powietrza i wyjaśnia czynniki wpływające na wynik.

## 🛠️ Technologie

| Warstwa | Technologia |
|---------|------------|
| Frontend | React.js 18 (Vite) |
| Backend | Python (FastAPI) |
| Baza danych | SQLite |
| API pogodowe | Open-Meteo API |
| ML | scikit-learn, SHAP |
| Konteneryzacja | Docker + Docker Compose |

## 🚀 Uruchomienie (Docker)

```bash
# Klonowanie repozytorium
git clone https://github.com/serafineek/Air-Quality-Predictor.git
cd Air-Quality-Predictor

# Uruchomienie
docker-compose up --build
```

Aplikacja będzie dostępna pod adresami:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

## 📋 Funkcjonalności

### ✅ Zaimplementowane
- [x] Rejestracja użytkownika
- [x] Logowanie (JWT)
- [x] Dashboard (placeholder)
- [x] Konteneryzacja Docker

### 🔜 Planowane
- [ ] Pobieranie danych z Open-Meteo API
- [ ] Wczytywanie plików CSV
- [ ] Formularz ręcznego wpisywania danych pogodowych
- [ ] Masowa klasyfikacja z pliku CSV
- [ ] Modele ML (Random Forest, Gradient Boosting, Decision Tree)
- [ ] Zmiana parametrów modeli z poziomu interfejsu
- [ ] Wykresy predykcji i korelacji
- [ ] Metryki jakości modeli (Accuracy, Precision, Recall, F1, AUC)
- [ ] SHAP — wyjaśnianie decyzji modelu
- [ ] Eksport wyników do CSV

## 📁 Struktura projektu

```
Air-Quality-Predictor/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   └── services/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 📝 Licencja

Projekt studencki — ISI.

