import json
import re
import os
from dotenv import load_dotenv
from anthropic import AsyncAnthropic

load_dotenv()

SYSTEM_PROMPT = """
You are an expert in competitive programming and mathematical reasoning.
Your job is to read a raw editorial for a competitive programming problem and extract a structured reasoning trace from it.

You must respond ONLY with a valid JSON object. No preamble, no explanation, no markdown fences.

Extract the following fields:

{
  "core_observation": "The single key observation or insight that makes the problem solvable. Usually 1-3 sentences. This is the 'aha moment' that an expert sees immediately. If the editorial states it explicitly, use that. If not, infer it from the solution logic.",

  "proof_type": "One of: exchange_argument | induction | contradiction | invariant | reduction | complexity_bound | other. Choose the proof pattern used to justify the solution's correctness.",

  "proof_body": "The actual justification or proof of why the approach is correct. Extract or reconstruct from the editorial. Can be intuitive but must explain WHY the solution works, not just HOW.",

  "why_naive_fails": "What is the most obvious/brute-force approach, and why does it fail? (time complexity, wrong answer, counterexample). If the editorial does not mention this, infer it from context.",

  "technique_tags": ["array of technique names used, e.g. greedy, binary_search, dp, segment_tree, bfs, dfs, two_pointers, math, number_theory, graph, sorting, etc."],

  "key_insight": "A single sentence that a student should memorize. The distilled essence of the expert's insight. Start with an action word. Example: 'Recognize that sorting by X transforms this into a standard greedy problem.'",

  "proof_rigor": "One of: formal | intuitive | assertion. Formal means the editorial actually proves correctness rigorously. Intuitive means it argues convincingly but informally. Assertion means it states the approach without justification.",

  "quality_score": "A float from 0.0 to 1.0 rating how clearly this editorial captures expert reasoning. Score 1.0 if it has a clear observation, a real proof, and explains why naive fails. Score 0.5 if it only explains the approach without proof. Score 0.2 if it just describes the algorithm with no justification.",

  "quality_flags": ["list of issues found, chosen from: missing_observation | missing_proof | assertion_only | no_naive_analysis | vague_insight | incomplete_explanation. Empty array if high quality."]
}
"""

RETRY_SUFFIX = "\n\nYour previous response was not valid JSON. Respond ONLY with the JSON object — no text, no markdown fences, no code blocks."


def _get_client() -> AsyncAnthropic:
    return AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def _strip_fences(text: str) -> str:
    text = re.sub(r'^```(?:json)?\s*', '', text.strip())
    text = re.sub(r'\s*```$', '', text)
    return text.strip()


async def extract_reasoning(editorial_text: str) -> dict:
    client = _get_client()
    user_message = f"Extract the reasoning trace from this editorial:\n\n{editorial_text}"

    response = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        temperature=0,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )
    content = _strip_fences(response.content[0].text)

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        retry_response = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            temperature=0,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": content},
                {"role": "user", "content": RETRY_SUFFIX},
            ],
        )
        retry_content = _strip_fences(retry_response.content[0].text)
        return json.loads(retry_content)


async def generate_comparison(expert_trace, user_trace) -> dict:
    client = _get_client()
    prompt = f"""A student attempted to solve a competitive programming problem. Compare their reasoning to the expert editorial reasoning.

EXPERT REASONING:
Core observation: {expert_trace.core_observation}
Proof type: {expert_trace.proof_type}
Proof: {expert_trace.proof_body}
Why naive fails: {expert_trace.why_naive_fails}

STUDENT REASONING:
What they observed: {user_trace.user_observation}
What they tried first: {user_trace.user_naive_attempt}
Their justification: {user_trace.user_proof_attempt}
Their approach: {user_trace.user_approach}

Respond ONLY with a JSON object:
{{
  "ai_comparison": "2-4 sentences comparing the student's reasoning to the expert's. Be specific about what they got right, what they missed, and what the key conceptual gap is if any. Be honest but constructive.",
  "divergence_points": ["list of 1-4 specific points where student reasoning diverged from expert reasoning. Each is a short phrase."]
}}"""

    response = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        temperature=0,
        messages=[{"role": "user", "content": prompt}],
    )
    content = _strip_fences(response.content[0].text)
    return json.loads(content)
