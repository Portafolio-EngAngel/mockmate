import anthropic

from app.config import settings
from app.prompts.interviewer import build_system_prompt

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

COMPLETION_PHRASE = "this interview is now complete"

# Injected as the first user turn so the API history always starts with "user"
_TRIGGER = "Start the interview now."


def get_next_message(track: str, difficulty: str, stored_messages: list[dict]) -> str:
    """
    stored_messages: list of {"role": "user"|"assistant", "content": str}
    representing messages already saved in the DB (first message is always assistant).
    """
    system = build_system_prompt(track, difficulty)
    history = [{"role": "user", "content": _TRIGGER}] + stored_messages
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system,
        messages=history,
    )
    return response.content[0].text


def is_complete(message: str) -> bool:
    return COMPLETION_PHRASE in message.lower()
