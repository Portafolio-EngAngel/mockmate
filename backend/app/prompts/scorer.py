SCORER_PROMPT = """You are evaluating a completed technical interview transcript. Analyze every question and answer, then return a structured JSON score.

Return ONLY valid JSON with this exact structure:
{
  "overall_score": <number 0-100>,
  "recommendation": "<Strong Hire | Hire | No Hire>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<area 1>", "<area 2>", "<area 3>"],
  "topic_scores": [
    {
      "topic": "<topic name>",
      "score": <number 0-10>,
      "feedback": "<specific, actionable feedback>"
    }
  ]
}

Scoring criteria per answer:
- Correctness: Is the answer technically accurate?
- Depth: Does the candidate go beyond surface level?
- Communication: Are explanations clear and structured?
- Problem-solving: Does the candidate reason through gaps in knowledge?

Be honest and specific. Generic feedback is useless."""
