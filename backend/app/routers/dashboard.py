"""Dashboard router: summary endpoint with placeholder data and active city context."""

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get(
    "/summary",
    summary="Podsumowanie dashboardu dla wybranej lub domyślnej miejscowości",
)
def get_dashboard_summary(
    city: str | None = Query(None, description="Opcjonalna nazwa miejscowości do analizy"),
    lat: float | None = Query(None, description="Szerokość geograficzna"),
    lon: float | None = Query(None, description="Długość geograficzna"),
    current_user: User = Depends(get_current_user),
):
    """Return a dashboard summary for the selected or user's default city.

    If no city is passed, falls back to the user's saved preferred city,
    or Warszawa as system fallback.
    """
    user_city = current_user.city
    active_city_name = city or user_city or "Warszawa"
    active_lat = lat if lat is not None else (current_user.city_latitude if current_user.city_latitude is not None else 52.2297)
    active_lon = lon if lon is not None else (current_user.city_longitude if current_user.city_longitude is not None else 21.0122)

    is_user_default = bool(user_city and active_city_name.lower() == user_city.lower())

    return {
        "user_default_city": user_city,
        "selected_city": {
            "name": active_city_name,
            "latitude": active_lat,
            "longitude": active_lon,
            "is_user_default": is_user_default,
        },
        "air_quality_index": None,
        "message": f"System w przygotowaniu. Prognozy jakości powietrza dla miejscowości {active_city_name} pojawią się wkrótce.",
        "stats": {
            "total_predictions": 0,
            "models_trained": 0,
            "data_sources": ["Open-Meteo API", "CSV Upload"],
        },
    }
