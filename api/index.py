"""
api/index.py — Vercel Serverless Entrypoint for HireMate FastAPI

This file is the single handler Vercel calls for every /api/* request.
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

try:
    from app.main import app
except Exception as e:
    import traceback
    # Print to stderr instead of stdout so it doesn't corrupt Vercel's IPC channel at build time
    print("=== STARTUP FAILED ===", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    raise e

__all__ = ["app"]
