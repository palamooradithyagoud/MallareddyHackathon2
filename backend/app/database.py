import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings


def _get_safe_database_url(url: str) -> str:
    """
    Fix DATABASE_URL for SQLAlchemy:
    - Handles special characters in passwords (especially '@')
    - Adds sslmode=require for Supabase connections
    SQLAlchemy's URL parser chokes on '@' inside passwords, so we
    parse manually using rindex('@') to find the true credential boundary.
    """
    if not url.startswith(("postgresql://", "postgres://")):
        return url

    try:
        scheme, rest = url.split("://", 1)
        # rindex finds the LAST @, which separates credentials from host
        at_idx = rest.rindex("@")
        credentials = rest[:at_idx]
        host_part = rest[at_idx + 1:]

        # Split on first colon to get username and raw password
        colon_idx = credentials.index(":")
        username = credentials[:colon_idx]
        raw_password = credentials[colon_idx + 1:]

        # URL-encode password so special chars (@, #, %, etc.) are safe
        encoded_password = urllib.parse.quote(raw_password, safe="")

        safe_url = f"{scheme}://{username}:{encoded_password}@{host_part}"

        # Supabase pooler requires SSL
        if "supabase" in safe_url and "sslmode" not in safe_url:
            separator = "&" if "?" in safe_url else "?"
            safe_url += f"{separator}sslmode=require"

        return safe_url
    except Exception as e:
        print(f"Warning: Could not sanitize DATABASE_URL: {e}")
        return url


_database_url = _get_safe_database_url(settings.DATABASE_URL)

# If using SQLite, add check_same_thread configuration
if _database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

engine = create_engine(
    _database_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
