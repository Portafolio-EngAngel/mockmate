# MockMate — AI Interview Simulator

Practice technical interviews with an AI interviewer powered by Claude. Get real-time feedback and a detailed performance report at the end.

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI · Python 3.12 |
| AI | Anthropic SDK (Claude Sonnet) |
| Database | PostgreSQL 16 |
| Frontend | Next.js 14 · TypeScript · Tailwind CSS |
| Infrastructure | Docker Compose |

## Interview Tracks

| Track | Levels |
|-------|--------|
| Backend Engineering | Junior · Mid · Senior |
| System Design | Junior · Mid · Senior |
| Security Engineering | Junior · Mid · Senior |

## Quick Start

**Prerequisites:** Docker Desktop, an Anthropic API key

```bash
# 1. Clone the repo
git clone https://github.com/Portafolio-EngAngel/mockmate.git
cd mockmate

# 2. Set your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 3. Run everything
docker compose up --build

# 4. Open the app
# http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tracks` | List available interview tracks |
| `POST` | `/sessions` | Create a new interview session |
| `GET` | `/sessions/{id}/messages` | Get session message history |
| `POST` | `/sessions/{id}/messages` | Send an answer, receive next question |
| `POST` | `/sessions/{id}/score` | Generate the final performance report |
| `GET` | `/health` | Health check |

## How It Works

1. Select a track and difficulty level
2. The AI interviewer asks questions one at a time
3. Answer naturally — the AI follows up based on your response
4. After covering all topics the interview ends automatically
5. View your scored report: overall score, recommendation, per-topic breakdown, strengths and areas to improve
