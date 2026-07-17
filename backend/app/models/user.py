import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=True)
    google_id = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    career_preferences = relationship("CareerPreferences", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resume = relationship("Resume", back_populates="user", uselist=False, cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
