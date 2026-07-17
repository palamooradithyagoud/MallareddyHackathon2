"""
api/index.py — Vercel Serverless Entrypoint for HireMate FastAPI with Diagnostics

This file functions as the Vercel entrypoint. It runs a diagnostic startup check,
lists registered routes, and prints a complete traceback if any module fails to import.
"""
import sys
import os
import platform
import traceback

print("=== STARTUP BEGIN ===")
print(f"Python Version: {platform.python_version()}")
print(f"Current Working Directory: {os.getcwd()}")

# ---------------------------------------------------------------------------
# Path setup
# ---------------------------------------------------------------------------
_backend_dir = os.path.abspath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend")
)
print(f"Backend directory path resolved: {_backend_dir}")
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)
print(f"sys.path: {sys.path}")

try:
    print("Importing app.main...")
    from app.main import app
    print("Successfully imported app.main")

    # Logging key imported modules
    print(f"Successfully loaded {len(sys.modules)} modules.")

    # Audit & Log registered endpoints
    print("Registered Routers & Endpoints:")
    for route in app.routes:
        methods = sorted(list(route.methods)) if hasattr(route, "methods") and route.methods else ["ANY"]
        path = getattr(route, "path", "unknown")
        name = getattr(route, "name", "unnamed")
        print(f"  [{', '.join(methods)}] {path} -> {name}")

    print("=== STARTUP COMPLETE ===")

except Exception as e:
    print("=== STARTUP FAILED ===")
    traceback.print_exc()
    raise e

# Export the application for Vercel WSGI/ASGI handler
__all__ = ["app"]
