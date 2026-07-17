import sys
import os

# Add backend to path so `from app.*` imports work
_backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
sys.path.insert(0, os.path.abspath(_backend_dir))

from fastapi import FastAPI

# Declare app here first — Vercel's static checker requires a literal FastAPI() at top level
app = FastAPI(title="HireMate API")

# Now replace with the real configured app from backend
# If the import fails, the empty app above stays active (requests will 404 cleanly)
try:
    from app.main import app  # noqa: F811 — intentionally rebinds app
except Exception as _e:
    import traceback
    print(f"[STARTUP ERROR] {_e}\n{traceback.format_exc()}")
