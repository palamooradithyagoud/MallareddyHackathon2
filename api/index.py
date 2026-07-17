import sys
import os
import traceback

# Add the backend directory to the Python path so imports resolve as `from app.*`
_backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
sys.path.insert(0, os.path.abspath(_backend_dir))

try:
    from app.main import app
except Exception as _startup_error:
    _error_detail = traceback.format_exc()
    print(f"[STARTUP ERROR] {_startup_error}\n{_error_detail}")

    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse

    app = FastAPI(title="HireMate API — Startup Failed")

    @app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
    async def startup_error(path: str, request: Request):
        return JSONResponse(
            status_code=500,
            content={
                "startup_error": str(_startup_error),
                "traceback": _error_detail,
                "hint": "Check DATABASE_URL and JWT_SECRET_KEY env vars in Vercel dashboard"
            }
        )

    @app.get("/")
    async def root_error():
        return JSONResponse(
            status_code=500,
            content={"startup_error": str(_startup_error), "traceback": _error_detail}
        )

