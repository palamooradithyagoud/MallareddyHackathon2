import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    theme = Column(String(50), default="dark")
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    language = Column(String(50), default="en")
    privacy_profile_public = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="settings")
