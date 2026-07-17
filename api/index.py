import sys
import os
import traceback

# Add backend to path so `from app.*` imports work
_backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
sys.path.insert(0, os.path.abspath(_backend_dir))

from fastapi import FastAPI
from fastapi.responses import JSONResponse

# Declare app here first — satisfies Vercel's static checker
# Also acts as fallback app if backend import fails (debug routes are registered below)
app = FastAPI(title="HireMate API")

# Store startup error so debug endpoint can expose it
_startup_error_detail = None


@app.get("/api/debug")
async def debug_startup():
    """Debug endpoint — shows startup error if backend failed to load."""
    if _startup_error_detail:
        return JSONResponse(status_code=500, content={"startup_error": _startup_error_detail})
    return {"status": "ok", "message": "App loaded from backend successfully"}


# Try to import and replace app with the real backend app
try:
    from app.main import app  # noqa: F811 — intentionally rebinds app to backend app
except Exception as _e:
    _startup_error_detail = traceback.format_exc()
    print(f"[STARTUP ERROR]\n{_startup_error_detail}")
