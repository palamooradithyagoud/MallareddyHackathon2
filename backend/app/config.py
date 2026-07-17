import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./hiremate.db")
    
    # JWT Security Settings
    # Use a secure default for development, but in production, this must be set!
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "hiremate_super_secret_session_key_2026_dev")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for convenience

    # Google Auth Settings (Optional)
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    
    # Upload folder — use /tmp on serverless (Vercel), local path in development
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "/tmp/hiremate_uploads")

    class Config:
        case_sensitive = True

settings = Settings()

# Ensure uploads directory exists — wrapped so a read-only filesystem never crashes startup
try:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
except Exception:
    pass

