"""Geocoding router: search city coordinates via Open-Meteo Geocoding API."""

import logging
from typing import List
import httpx
from fastapi import APIRouter, Query

from app.schemas.user import CitySearchResult

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/geo", tags=["Geocoding"])

OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"


@router.get(
    "/cities",
    response_model=List[CitySearchResult],
    summary="Wyszukiwanie miejscowości (autouzupełnianie)",
)
async def search_cities(
    q: str = Query(..., min_length=2, description="Nazwa miejscowości do wyszukania"),
    count: int = Query(6, ge=1, le=15, description="Maksymalna liczba wyników"),
):
    """Search for cities matching query using Open-Meteo Geocoding API.

    Returns latitude, longitude, country, and admin region for suggestions.
    """
    clean_query = q.strip()
    if len(clean_query) < 2:
        return []

    params = {
        "name": clean_query,
        "count": count,
        "language": "pl",
        "format": "json",
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(OPEN_METEO_GEOCODING_URL, params=params)
            response.raise_for_status()
            data = response.json()

            results = data.get("results", [])
            output = []
            for item in results:
                output.append(
                    CitySearchResult(
                        id=item.get("id"),
                        name=item.get("name"),
                        latitude=item.get("latitude"),
                        longitude=item.get("longitude"),
                        country=item.get("country"),
                        country_code=item.get("country_code"),
                        admin1=item.get("admin1"),
                    )
                )
            return output
    except Exception as exc:
        logger.warning(f"Error querying Open-Meteo Geocoding API: {exc}")
        return []
