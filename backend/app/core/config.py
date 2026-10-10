from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    app_name: str = "Nityasadhana API"
    environment: str = "development"
    database_url: str = f"sqlite:///{(PROJECT_ROOT / 'test.db').as_posix()}"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000,https://nityasadhanaiskon.vercel.app"
    frontend_url: str = "https://nityasadhanaiskon.vercel.app"
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_sender: str | None = None

    model_config = SettingsConfigDict(
        env_file=(PROJECT_ROOT / ".env", PROJECT_ROOT / "backend" / ".env"),
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        origins: list[str] = []
        for origin in self.cors_origins.split(","):
            cleaned = origin.strip().rstrip("/")
            if cleaned and cleaned not in origins:
                origins.append(cleaned)
        return origins


@lru_cache
def get_settings() -> Settings:
    return Settings()
