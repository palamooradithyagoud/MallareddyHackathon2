from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.schemas.resume import ResumeResponse

class ActivityLogResponse(BaseModel):
    id: str
    action: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardResponse(BaseModel):
    profile_completion: int
    resume_uploaded: bool
    resume: Optional[ResumeResponse] = None
    stats: Dict[str, Any]
    recent_activities: List[ActivityLogResponse] = []
    saved_jobs: List[Dict[str, Any]] = []
    applications: List[Dict[str, Any]] = []
    ai_insights: List[Dict[str, Any]] = []
