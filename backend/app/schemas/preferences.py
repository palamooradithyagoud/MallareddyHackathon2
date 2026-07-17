from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CareerPreferencesBase(BaseModel):
    preferred_role: Optional[str] = None
    preferred_industry: Optional[str] = None
    preferred_location: Optional[str] = None
    employment_type: Optional[str] = None # Full-time, Part-time, Internship, etc.
    work_mode: Optional[str] = None # Remote, Hybrid, On-site
    salary_expectation: Optional[int] = None
    skills_interested_in: Optional[List[str]] = []

class CareerPreferencesUpdate(CareerPreferencesBase):
    pass

class CareerPreferencesResponse(CareerPreferencesBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
