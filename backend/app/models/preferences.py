import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, JSON, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.app.database import Base

class CareerPreferences(Base):
    __tablename__ = "career_preferences"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    preferred_role = Column(String(255), nullable=True)
    preferred_industry = Column(String(255), nullable=True)
    preferred_location = Column(String(255), nullable=True)
    employment_type = Column(String(100), nullable=True) # Full-time, Part-time, Internship, Contract
    work_mode = Column(String(100), nullable=True) # Remote, Hybrid, On-site
    salary_expectation = Column(Integer, nullable=True)
    skills_interested_in = Column(JSON, default=list) # List of skills
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="career_preferences")
