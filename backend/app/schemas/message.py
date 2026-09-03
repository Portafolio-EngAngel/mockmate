from datetime import datetime

from pydantic import BaseModel


class MessageSend(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatResponse(BaseModel):
    message: MessageResponse
    interview_complete: bool
