import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Enum, String
from sqlalchemy.orm import relationship

from app.database import Base


class Track(str, enum.Enum):
    backend = "backend"
    system_design = "system_design"
    security = "security"


class Difficulty(str, enum.Enum):
    junior = "junior"
    mid = "mid"
    senior = "senior"


class SessionStatus(str, enum.Enum):
    active = "active"
    completed = "completed"


class Session(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    track = Column(Enum(Track), nullable=False)
    difficulty = Column(Enum(Difficulty), nullable=False)
    status = Column(Enum(SessionStatus), default=SessionStatus.active)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    messages = relationship("Message", back_populates="session", order_by="Message.created_at")
    score = relationship("Score", back_populates="session", uselist=False)
