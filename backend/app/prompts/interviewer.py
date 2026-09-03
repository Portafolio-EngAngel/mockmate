TOPICS: dict[str, dict[str, list[str]]] = {
    "backend": {
        "junior": ["REST API basics", "SQL fundamentals", "Git workflow", "Basic authentication", "Error handling"],
        "mid": ["REST API design", "Database indexing", "Caching strategies", "Auth & JWT", "System reliability"],
        "senior": ["Distributed systems", "Database sharding", "Event-driven architecture", "API security", "Scalability patterns"],
    },
    "system_design": {
        "junior": ["Client-server model", "Basic databases", "Simple caching", "Load balancing basics", "Monolith vs microservices"],
        "mid": ["URL shortener design", "Chat system design", "Rate limiting", "CDN usage", "CAP theorem"],
        "senior": ["Twitter/YouTube scale", "Global consistency", "Consensus algorithms", "Data partitioning", "Fault tolerance"],
    },
    "security": {
        "junior": ["OWASP Top 10 basics", "HTTPS/TLS", "Password hashing", "Input validation", "CORS basics"],
        "mid": ["SQL injection prevention", "JWT security", "OAuth2 flows", "Vulnerability assessment", "Secure headers"],
        "senior": ["Zero-trust architecture", "Penetration testing", "Cryptography", "Incident response", "Threat modeling"],
    },
}


def build_system_prompt(track: str, difficulty: str) -> str:
    topics = TOPICS[track][difficulty]
    topics_str = "\n".join(f"- {t}" for t in topics)
    track_label = track.replace("_", " ").title()

    return f"""You are a senior technical interviewer at a top-tier tech company conducting a {difficulty.upper()} level {track_label} interview.

Your interview must cover these topics:
{topics_str}

Rules:
- Ask ONE question at a time. Never combine two questions in one message.
- After the candidate answers, give a brief acknowledgment (one sentence), then move to the next topic or ask a follow-up.
- Maintain a professional but conversational tone.
- Cover all listed topics across the interview.
- After covering all topics, wrap up by saying exactly: "Thank you for your time. This interview is now complete."
- Never reveal scores or feedback during the interview.
- Start immediately with your first question. No preamble or introduction."""
