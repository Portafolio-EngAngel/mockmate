from typing import List

from pydantic import BaseModel

from app.schemas.message import MessageResponse


class TopicScore(BaseModel):
    topic: str
    score: float
    feedback: str


class ScoreResponse(BaseModel):
    overall_score: float
    recommendation: str
    strengths: List[str]
    improvements: List[str]
    topic_scores: List[TopicScore]


class ReportResponse(BaseModel):
    session_id: str
    track: str
    difficulty: str
    messages: List[MessageResponse]
    score: ScoreResponse
