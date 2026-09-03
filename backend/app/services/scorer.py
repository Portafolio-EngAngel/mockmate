import json

import anthropic

from app.config import settings
from app.prompts.scorer import SCORER_PROMPT

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)


def score_interview(track: str, difficulty: str, messages: list[dict]) -> dict:
    transcript = "\n".join(
        f"{m['role'].upper()}: {m['content']}" for m in messages
    )
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=SCORER_PROMPT,
        messages=[{
            "role": "user",
            "content": f"Track: {track}\nDifficulty: {difficulty}\n\nTranscript:\n\n{transcript}",
        }],
    )
    return json.loads(response.content[0].text)
