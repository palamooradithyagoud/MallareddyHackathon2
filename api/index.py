"""
api/index.py — Vercel Serverless Entrypoint for HireMate FastAPI

This file is the single handler Vercel calls for every /api/* request.
We import 'app' at the top level of this module (unindented) so Vercel's
static checker can discover the FastAPI instance.
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
# This statement is at the absolute top-level (unindented) to satisfy the
# Vercel static parser's inspection of the entrypoint file.
# ---------------------------------------------------------------------------
from app.main import app
