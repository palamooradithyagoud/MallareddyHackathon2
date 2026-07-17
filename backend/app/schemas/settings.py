from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserSettingsBase(BaseModel):
    theme: Optional[str] = "dark"
    email_notifications: Optional[bool] = True
    push_notifications: Optional[bool] = True
    language: Optional[str] = "en"
    privacy_profile_public: Optional[bool] = False

class UserSettingsUpdate(UserSettingsBase):
    pass

class UserSettingsResponse(UserSettingsBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
