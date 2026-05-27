"""Run with: python seed.py from the backend directory."""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from database import engine, AsyncSessionLocal, Base
from models import ReasoningTrace


SEED_TRACES = [
    {
        "problem_id": "1A",
        "problem_title": "Theatre Square",
        "problem_url": "https://codeforces.com/problemset/problem/1/A",
        "difficulty_rating": 1000,
        "technique_tags": ["math"],
        "core_observation": "The theatre square must be covered completely by a×a flagstones. Since flagstones cannot be cut, any row or column requiring partial coverage still requires a full flagstone. Therefore the minimum number of flagstones needed is ⌈n/a⌉ × ⌈m/a⌉.",
        "proof_type": "other",
        "proof_body": "Consider the rows independently: to cover n meters with tiles of size a, we need ⌈n/a⌉ tiles, because each tile covers exactly a meters and the last tile is still required even if it extends beyond n. The same argument applies to columns. Since the tiles form a grid, the total is the product of the two ceiling values.",
        "why_naive_fails": "Dividing total area n×m by a² and rounding up gives the wrong answer because it conflates area coverage with tile placement. Corner tiles cover partial rows AND partial columns but count as one tile, not two — area-based counting double-subtracts this corner waste.",
        "key_insight": "Apply ceiling division independently to each dimension and multiply — partial coverage in any direction still requires a full tile.",
        "proof_rigor": "formal",
        "source_editorial": "The answer is ceil(n/a) * ceil(m/a). We need ceil(n/a) flagstones per column and ceil(m/a) flagstones per row.",
        "quality_score": 0.90,
        "quality_flags": [],
    },
    {
        "problem_id": "4C",
        "problem_title": "Registration System",
        "problem_url": "https://codeforces.com/problemset/problem/4/C",
        "difficulty_rating": 1300,
        "technique_tags": ["implementation", "hash_map"],
        "core_observation": "Each name must be unique in the system. When a name appears for the k-th time (k > 1), we must append k-1 to produce a unique name. The first occurrence has no suffix. This requires tracking occurrence counts per name, which is efficiently done with a hash map.",
        "proof_type": "invariant",
        "proof_body": "Maintain invariant: count[name] = number of times 'name' has been registered so far. For each new registration: if count[name] == 0, output 'name' unchanged and set count[name] = 1. Otherwise output 'name' + str(count[name]) then increment count[name]. This invariant guarantees the k-th registration of any name gets suffix k-1, making every output unique since each suffix value is used exactly once per base name.",
        "why_naive_fails": "An O(n²) approach checking each new name against all previous names would time out for n up to 10^5. Even with early termination, worst-case (all same name) degrades to O(n²) string comparisons each taking O(L) time.",
        "key_insight": "Track name frequencies in a hash map and append the current count as a suffix before incrementing — the k-th occurrence gets suffix k-1.",
        "proof_rigor": "formal",
        "source_editorial": "Use a dictionary to count how many times each name has been registered. For the first occurrence, output the name unchanged. For the k-th occurrence (k>1), output name+str(k-1).",
        "quality_score": 0.90,
        "quality_flags": [],
    },
    {
        "problem_id": "71A",
        "problem_title": "Way Too Long Words",
        "problem_url": "https://codeforces.com/problemset/problem/71/A",
        "difficulty_rating": 800,
        "technique_tags": ["strings", "implementation"],
        "core_observation": "A word only needs abbreviation when its length strictly exceeds 10. The abbreviated form replaces the interior characters with their count: first_letter + (length - 2) + last_letter. Words of length ≤ 10 are output unchanged.",
        "proof_type": "other",
        "proof_body": "For a word of length L > 10, the abbreviation is word[0] + str(L-2) + word[-1]. This is correct by the problem definition. The middle portion has exactly L-2 characters (all except first and last). For L ≤ 10, the word fits in 10 characters so no abbreviation is needed.",
        "why_naive_fails": "There is no efficiency concern here — the problem is straightforward. The key mistake to avoid is using len-1 or len instead of len-2 for the middle count, or applying the abbreviation to words of exactly length 10 (which should not be abbreviated).",
        "key_insight": "Abbreviate to word[0] + str(len-2) + word[-1] only when word length strictly exceeds 10.",
        "proof_rigor": "assertion",
        "source_editorial": "For each word: if len > 10, print word[0] + str(len-2) + word[-1]. Otherwise print the word as-is.",
        "quality_score": 0.65,
        "quality_flags": ["no_naive_analysis"],
    },
    {
        "problem_id": "545C",
        "problem_title": "Woodcutters",
        "problem_url": "https://codeforces.com/problemset/problem/545/C",
        "difficulty_rating": 1600,
        "technique_tags": ["greedy"],
        "core_observation": "Trees are sorted by position. For each tree, it can fall left if its stump minus height is strictly greater than the previous tree's position, or fall right if its stump plus height is strictly less than the next tree's position. The greedy choice is: always prefer falling left, because this keeps the right side free and can only help subsequent trees.",
        "proof_type": "exchange_argument",
        "proof_body": "Suppose an optimal solution cuts tree i to the right when it could also be cut left. Swap tree i to fall left instead: the left neighbor is unaffected (we only needed x_i - h_i > x_{i-1}), and tree i's right space is now freed — this can only increase or maintain the number of cuttable trees to the right. Therefore, preferring left cuts never decreases the total count, proving the greedy is optimal.",
        "why_naive_fails": "Brute force tries all 3^n combinations (left/right/skip) for n trees, giving O(3^n) which is completely infeasible for n up to 10^5. Even O(n²) DP on all pairwise choices fails on time.",
        "key_insight": "Greedy left-first: always prefer cutting a tree left to keep right space open — the exchange argument shows this never decreases the optimal count.",
        "proof_rigor": "intuitive",
        "source_editorial": "Process trees left to right. Track the effective right boundary of the previous cut tree. For each tree: try to cut left (x - h > prev_boundary). If yes, increment count and update boundary to x. Else try to cut right (x + h < next_x). If yes, increment count (boundary stays x).",
        "quality_score": 0.85,
        "quality_flags": [],
    },
    {
        "problem_id": "455A",
        "problem_title": "Boredom",
        "problem_url": "https://codeforces.com/problemset/problem/455/A",
        "difficulty_rating": 1500,
        "technique_tags": ["dp", "counting"],
        "core_observation": "Selecting any element with value v forces deletion of ALL elements with value v-1 and v+1. Therefore if we select value v, we gain v × count(v) points but cannot select v-1 or v+1. This is structurally identical to the 'house robber' problem: we cannot take two adjacent values, and taking all occurrences of v is always strictly optimal if we take v at all.",
        "proof_type": "reduction",
        "proof_body": "Let cnt[v] = frequency of value v. Define dp[v] = maximum points achievable using only values {1, ..., v}. Base cases: dp[1] = 1 × cnt[1], dp[2] = max(dp[1], 2 × cnt[2]). Transition: dp[v] = max(dp[v-1], dp[v-2] + v × cnt[v]). Correctness follows from: (1) selecting v and v±1 is impossible by the deletion rule; (2) if we select value v, we should select ALL occurrences of v since each gives v points at no additional cost; (3) dp[v-1] captures the best solution that skips v entirely.",
        "why_naive_fails": "Brute force over all 2^n element subsets is O(2^n) — impossible for n = 10^5. Greedy (take highest-value elements first) fails because taking value v blocks v±1, and v-1 occurrences might be more valuable than v occurrences.",
        "key_insight": "Reduce to house robber DP: bucket elements by value, treat each distinct value v as a 'house' worth v × cnt[v], and adjacent houses cannot both be taken.",
        "proof_rigor": "formal",
        "source_editorial": "Count frequency cnt[v] for each value v. Run DP: dp[0]=0, dp[1]=cnt[1], dp[i]=max(dp[i-1], dp[i-2]+i*cnt[i]) for i from 2 to max_value.",
        "quality_score": 0.95,
        "quality_flags": [],
    },
]


def compute_quality_score(data: dict) -> float:
    score = 0.0
    if data.get("core_observation") and len(data["core_observation"]) > 40:
        score += 0.35
    if data.get("proof_body") and len(data["proof_body"]) > 60:
        score += 0.30
        if data.get("proof_type") and data["proof_type"] != "other":
            score += 0.10
    if data.get("why_naive_fails") and len(data["why_naive_fails"]) > 30:
        score += 0.15
    if data.get("proof_rigor") == "formal":
        score += 0.10
    elif data.get("proof_rigor") == "intuitive":
        score += 0.05
    return min(score, 1.0)


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        for data in SEED_TRACES:
            data["quality_score"] = compute_quality_score(data)
            trace = ReasoningTrace(**data)
            session.add(trace)
        await session.commit()

    print(f"Seeded {len(SEED_TRACES)} reasoning traces.")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
