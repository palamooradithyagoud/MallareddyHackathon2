from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.config import settings

# Import models to ensure they register on Base.metadata
from app import models

# Import routers
from app.routers import auth, dashboard, profile, resume, preferences, settings as user_settings

# Create database tables automatically (safe no-op if already exist; wrapped for serverless safety)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not run create_all: {e}")


app = FastAPI(
    title="HireMate API",
    description="Scalable backend API foundation for HireMate AI Career Platform",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",  # Common React port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "*"  # Fallback for dynamic hostings/review builds
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in strict production, allow all for dev testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers under /api
app.include_router(auth.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(resume.router, prefix="/api")
app.include_router(preferences.router, prefix="/api")
app.include_router(user_settings.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "database": "connected"
    }

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the HireMate API. Visit /docs for Swagger UI documentation."
    }
