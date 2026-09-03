import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, JSON, String
from sqlalchemy.orm import relationship

from app.database import Base


class Score(Base):
    __tablename__ = "scores"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("sessions.id"), nullable=False, unique=True)
    overall_score = Column(Float, nullable=False)
    recommendation = Column(String, nullable=False)
    strengths = Column(JSON, nullable=False)
    improvements = Column(JSON, nullable=False)
    topic_scores = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    session = relationship("Session", back_populates="score")
