import uuid
from sqlalchemy import Column, String, Integer, Numeric, Date, Text, ForeignKey, JSON, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)
    phone_number = Column(String(50), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    college = Column(String(255), nullable=True)
    degree = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    cgpa = Column(Numeric(4, 2), nullable=True)
    skills = Column(Text, nullable=True) # Store as comma-separated or text for simple searching
    experience = Column(JSON, default=list) # List of dictionaries: company, role, duration, description
    certifications = Column(JSON, default=list) # List of dictionaries: name, issuer, year
    linkedin_url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)
    portfolio_url = Column(String(255), nullable=True)
    about_me = Column(Text, nullable=True)
    avatar_url = Column(String(255), nullable=True)
    completion_percentage = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="profile")
