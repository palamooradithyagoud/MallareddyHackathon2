import sys
import os
import traceback

# Add the backend directory to the Python path so imports resolve as `from app.*`
_backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
sys.path.insert(0, os.path.abspath(_backend_dir))


def _load_app():
    """Load the real FastAPI app, returning (app, error_info) tuple."""
    try:
        from app.main import app as _app
        return _app, None
    except Exception as e:
        return None, (str(e), traceback.format_exc())


_loaded_app, _startup_error = _load_app()

if _loaded_app is not None:
    # ✅ Happy path — real app is loaded
    app = _loaded_app
else:
    # ❌ Startup failed — expose error as JSON so we can debug on Vercel
    _err_msg, _err_trace = _startup_error
    print(f"[STARTUP ERROR] {_err_msg}\n{_err_trace}")

    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse

    app = FastAPI(title="HireMate API — Startup Failed")

    @app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
    async def startup_error_handler(path: str, request: Request):
        return JSONResponse(
            status_code=500,
            content={
                "startup_error": _err_msg,
                "traceback": _err_trace,
                "hint": "Check DATABASE_URL, JWT_SECRET_KEY, ENVIRONMENT in Vercel env vars",
            },
        )

    @app.get("/")
    async def root_error():
        return JSONResponse(
            status_code=500,
            content={"startup_error": _err_msg, "traceback": _err_trace},
        )
