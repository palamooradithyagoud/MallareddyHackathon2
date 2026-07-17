from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ResumeVersionResponse(BaseModel):
    id: str
    resume_id: str
    version: int
    name: str
    file_size: int
    created_at: datetime

    class Config:
        from_attributes = True

class ResumeResponse(BaseModel):
    id: str
    user_id: str
    name: str
    file_size: int
    mime_type: str
    created_at: datetime
    updated_at: datetime
    versions: List[ResumeVersionResponse] = []

    class Config:
        from_attributes = True
