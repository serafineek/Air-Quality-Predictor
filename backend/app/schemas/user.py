"""Pydantic schemas for user-related requests and responses."""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Schema for user registration."""

    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6, max_length=128)


class UserLogin(BaseModel):
    """Schema for user login."""

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for returning user data (no password)."""

    id: int
    email: str
    username: str
    city: str | None = None
    city_latitude: float | None = None
    city_longitude: float | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserProfileUpdate(BaseModel):
    """Schema for updating user profile."""

    city: str | None = None
    city_latitude: float | None = None
    city_longitude: float | None = None


class CitySearchResult(BaseModel):
    """Schema for city search suggestions from geocoding."""

    id: int | None = None
    name: str
    latitude: float
    longitude: float
    country: str | None = None
    country_code: str | None = None
    admin1: str | None = None  # Województwo / region


class Token(BaseModel):
    """Schema for JWT token response."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse
