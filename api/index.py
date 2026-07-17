"""
api/index.py — Vercel Serverless Entrypoint for HireMate FastAPI

This file is the single handler Vercel calls for every /api/* request.
It adds the backend directory to sys.path so `from app.*` imports resolve,
then directly imports and re-exports the real FastAPI `app` from main.py.

There is NO stub-app rebind pattern here. If the import fails, the error
is re-raised immediately so Vercel surfaces the real traceback in its logs
(instead of silently serving a stub app with no routes).
"""
import sys
import os

# ---------------------------------------------------------------------------
# Path setup — must happen before any `from app.*` import
# ---------------------------------------------------------------------------
_backend_dir = os.path.abspath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend")
)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

# ---------------------------------------------------------------------------
# Import the real FastAPI application
# Any exception here is intentionally NOT caught so Vercel logs the full
# traceback rather than silently returning 404 for every route.
# ---------------------------------------------------------------------------
from app.main import app  # noqa: E402  (import after sys.path manipulation)

# `app` is now the fully-configured FastAPI instance with all routers mounted.
# Vercel's Python runtime looks for a module-level `app` object to serve.
__all__ = ["app"]
