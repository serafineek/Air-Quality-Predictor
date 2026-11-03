"""Dashboard router: summary endpoint with placeholder data."""

from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get(
    "/summary",
    summary="Podsumowanie dashboardu",
)
def get_dashboard_summary(current_user: User = Depends(get_current_user)):
    """Return a placeholder dashboard summary.

    This endpoint is protected by JWT authentication. Once the ML
    pipeline and data ingestion are implemented, it will return
    real air-quality predictions and statistics.
    """
    return {
        "air_quality_index": None,
        "message": "System w przygotowaniu. Dane pojawią się wkrótce.",
        "stats": {
            "total_predictions": 0,
            "models_trained": 0,
            "data_sources": ["Open-Meteo API", "CSV Upload"],
        },
    }
