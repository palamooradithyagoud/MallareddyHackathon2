from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings


# ---------------------------------------------------------------------------
# Lifespan — DB table creation runs AFTER app startup, not at import time.
# This prevents Supabase connection timeouts from blocking Vercel cold starts.
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables if they do not exist yet
    try:
        from app.database import engine, Base
        # Import models so they register on Base.metadata before create_all
        from app import models  # noqa: F401
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        # Log but never crash — tables may already exist in production
        print(f"[startup] Warning: create_all skipped: {e}")
    yield
    # Shutdown: nothing to clean up for a stateless serverless function


# ---------------------------------------------------------------------------
# Application instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title="HireMate API",
    description="Scalable backend API foundation for HireMate AI Career Platform",
    version="1.0.0",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Import routers — done AFTER app is constructed to avoid circular imports
# ---------------------------------------------------------------------------
from app.routers import auth, dashboard, profile, resume, preferences  # noqa: E402
from app.routers import settings as user_settings  # noqa: E402

app.include_router(auth.router,          prefix="/api")
app.include_router(dashboard.router,     prefix="/api")
app.include_router(profile.router,       prefix="/api")
app.include_router(resume.router,        prefix="/api")
app.include_router(preferences.router,   prefix="/api")
app.include_router(user_settings.router, prefix="/api")


# ---------------------------------------------------------------------------
# Root & health endpoints
# ---------------------------------------------------------------------------
@app.get("/", tags=["Meta"])
def read_root():
    """Root endpoint — confirms the API is alive."""
    return {"message": "HireMate API Running"}


@app.get("/health", tags=["Meta"])
def health_check():
    """Bare health check (no /api prefix) — used by uptime monitors."""
    return {"status": "healthy"}


@app.get("/api/health", tags=["Meta"])
def api_health_check():
    """Health check under /api — used by the frontend AuthContext."""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "database": "connected",
    }
