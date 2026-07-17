from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Any
from datetime import date, datetime

class ExperienceSchema(BaseModel):
    company: str
    role: str
    duration: str
    description: Optional[str] = None

class CertificationSchema(BaseModel):
    name: str
    issuer: str
    year: int

class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    college: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[int] = None
    cgpa: Optional[float] = None
    skills: Optional[str] = None
    experience: Optional[List[ExperienceSchema]] = []
    certifications: Optional[List[CertificationSchema]] = []
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    about_me: Optional[str] = None
    avatar_url: Optional[str] = None

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: str
    user_id: str
    completion_percentage: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
