from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import Session, Message, Score  # noqa: F401 — registers models with SQLAlchemy
from app.routers import sessions, tracks

app = FastAPI(title="MockMate API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
app.include_router(tracks.router)


@app.get("/health")
def health():
    return {"status": "ok"}
