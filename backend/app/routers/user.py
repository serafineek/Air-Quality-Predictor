"""User router: profile view and update endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserProfileUpdate

router = APIRouter(prefix="/api/user", tags=["User Profile"])


@router.get(
    "/profile",
    response_model=UserResponse,
    summary="Pobierz profil aktualnego użytkownika",
)
def get_profile(current_user: User = Depends(get_current_user)):
    """Return the profile data of the currently authenticated user."""
    return current_user


@router.put(
    "/profile",
    response_model=UserResponse,
    summary="Zaktualizuj profil użytkownika (miejscowość)",
)
def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user's preferred city and coordinates."""
    if profile_data.city is not None:
        current_user.city = profile_data.city.strip() if profile_data.city else None
    if profile_data.city_latitude is not None:
        current_user.city_latitude = profile_data.city_latitude
    if profile_data.city_longitude is not None:
        current_user.city_longitude = profile_data.city_longitude

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user
