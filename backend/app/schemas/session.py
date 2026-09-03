from datetime import datetime

from pydantic import BaseModel

from app.models.session import Difficulty, SessionStatus, Track


class SessionCreate(BaseModel):
    track: Track
    difficulty: Difficulty


class SessionResponse(BaseModel):
    id: str
    track: Track
    difficulty: Difficulty
    status: SessionStatus
    created_at: datetime

    model_config = {"from_attributes": True}
