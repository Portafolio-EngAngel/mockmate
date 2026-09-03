from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.message import Message
from app.models.score import Score
from app.models.session import Session as SessionModel, SessionStatus
from app.schemas.message import ChatResponse, MessageResponse, MessageSend
from app.schemas.score import ReportResponse, ScoreResponse, TopicScore
from app.schemas.session import SessionCreate, SessionResponse
from app.services.interviewer import get_next_message, is_complete
from app.services.scorer import score_interview

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=SessionResponse)
def create_session(body: SessionCreate, db: Session = Depends(get_db)):
    session = SessionModel(track=body.track, difficulty=body.difficulty)
    db.add(session)
    db.flush()

    opening = get_next_message(body.track.value, body.difficulty.value, [])
    db.add(Message(session_id=session.id, role="assistant", content=opening))
    db.commit()
    db.refresh(session)
    return session


@router.get("/{session_id}/messages", response_model=list[MessageResponse])
def get_messages(session_id: str, db: Session = Depends(get_db)):
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return [MessageResponse.model_validate(m) for m in session.messages]


@router.post("/{session_id}/messages", response_model=ChatResponse)
def send_message(session_id: str, body: MessageSend, db: Session = Depends(get_db)):
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status == SessionStatus.completed:
        raise HTTPException(status_code=400, detail="Interview already completed")

    # Build full history before saving the new message
    history = [{"role": m.role, "content": m.content} for m in session.messages]
    history.append({"role": "user", "content": body.content})

    db.add(Message(session_id=session_id, role="user", content=body.content))
    db.flush()

    ai_text = get_next_message(session.track.value, session.difficulty.value, history)
    ai_msg = Message(session_id=session_id, role="assistant", content=ai_text)
    db.add(ai_msg)

    interview_done = is_complete(ai_text)
    if interview_done:
        session.status = SessionStatus.completed
        session.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(ai_msg)
    return ChatResponse(message=MessageResponse.model_validate(ai_msg), interview_complete=interview_done)


@router.post("/{session_id}/score", response_model=ReportResponse)
def generate_report(session_id: str, db: Session = Depends(get_db)):
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.status != SessionStatus.completed:
        raise HTTPException(status_code=400, detail="Interview not completed yet")

    if not session.score:
        history = [{"role": m.role, "content": m.content} for m in session.messages]
        result = score_interview(session.track.value, session.difficulty.value, history)
        score = Score(
            session_id=session_id,
            overall_score=result["overall_score"],
            recommendation=result["recommendation"],
            strengths=result["strengths"],
            improvements=result["improvements"],
            topic_scores=result["topic_scores"],
        )
        db.add(score)
        db.commit()
        db.refresh(score)
    else:
        score = session.score

    return ReportResponse(
        session_id=session_id,
        track=session.track.value,
        difficulty=session.difficulty.value,
        messages=[MessageResponse.model_validate(m) for m in session.messages],
        score=ScoreResponse(
            overall_score=score.overall_score,
            recommendation=score.recommendation,
            strengths=score.strengths,
            improvements=score.improvements,
            topic_scores=[TopicScore(**t) for t in score.topic_scores],
        ),
    )
