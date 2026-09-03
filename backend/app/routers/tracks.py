from fastapi import APIRouter

router = APIRouter(prefix="/tracks", tags=["tracks"])

TRACKS = {
    "backend": {
        "label": "Backend Engineering",
        "description": "REST APIs, databases, caching, auth, and system reliability",
        "difficulties": ["junior", "mid", "senior"],
    },
    "system_design": {
        "label": "System Design",
        "description": "Design scalable, distributed systems from scratch",
        "difficulties": ["junior", "mid", "senior"],
    },
    "security": {
        "label": "Security Engineering",
        "description": "OWASP, vulnerabilities, cryptography, and secure architecture",
        "difficulties": ["junior", "mid", "senior"],
    },
}


@router.get("")
def list_tracks():
    return TRACKS
