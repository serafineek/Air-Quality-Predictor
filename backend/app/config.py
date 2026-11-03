"""Application configuration loaded from environment variables."""

import secrets
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings with sensible defaults."""

    SECRET_KEY: str = os.getenv("SECRET_KEY") or secrets.token_hex(32)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data/air_quality.db")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )
    ALGORITHM: str = "HS256"


settings = Settings()
