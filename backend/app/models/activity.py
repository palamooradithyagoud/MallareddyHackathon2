import uuid
from sqlalchemy import Column, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    action = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="activity_logs")
