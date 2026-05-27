import re
import httpx
from typing import Optional, Tuple


def parse_cf_url(url: str) -> Optional[Tuple[str, str]]:
    patterns = [
        r'codeforces\.com/contest/(\d+)/problem/([A-Z0-9]+)',
        r'codeforces\.com/problemset/problem/(\d+)/([A-Z0-9]+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, url, re.IGNORECASE)
        if match:
            return match.group(1), match.group(2).upper()
    return None


async def fetch_problem_metadata(problem_url: str) -> dict:
    result = {
        "problem_id": None,
        "problem_title": None,
        "difficulty_rating": None,
        "technique_tags": [],
    }

    if not problem_url:
        return result

    parsed = parse_cf_url(problem_url)
    if not parsed:
        return result

    contest_id, problem_index = parsed
    result["problem_id"] = f"{contest_id}{problem_index}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get("https://codeforces.com/api/problemset.problems")
            if response.status_code != 200:
                return result

            data = response.json()
            if data.get("status") != "OK":
                return result

            for problem in data["result"]["problems"]:
                if (
                    str(problem.get("contestId")) == contest_id
                    and problem.get("index", "").upper() == problem_index
                ):
                    result["problem_title"] = problem.get("name")
                    result["difficulty_rating"] = problem.get("rating")
                    result["technique_tags"] = problem.get("tags", [])
                    break
    except Exception:
        pass

    return result
