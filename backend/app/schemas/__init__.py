from backend.app.schemas.auth import UserRegister, UserLogin, UserResponse, Token, GoogleLoginRequest
from backend.app.schemas.profile import ProfileUpdate, ProfileResponse, ExperienceSchema, CertificationSchema
from backend.app.schemas.preferences import CareerPreferencesUpdate, CareerPreferencesResponse
from backend.app.schemas.resume import ResumeResponse, ResumeVersionResponse
from backend.app.schemas.settings import UserSettingsUpdate, UserSettingsResponse
from backend.app.schemas.dashboard import DashboardResponse, ActivityLogResponse

__all__ = [
    "UserRegister",
    "UserLogin",
    "UserResponse",
    "Token",
    "GoogleLoginRequest",
    "ProfileUpdate",
    "ProfileResponse",
    "ExperienceSchema",
    "CertificationSchema",
    "CareerPreferencesUpdate",
    "CareerPreferencesResponse",
    "ResumeResponse",
    "ResumeVersionResponse",
    "UserSettingsUpdate",
    "UserSettingsResponse",
    "DashboardResponse",
    "ActivityLogResponse",
]
