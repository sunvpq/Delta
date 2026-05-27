from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, cast, String
from typing import Optional, List
import uuid

from database import get_db
from models import ReasoningTrace
from schemas import TraceCreate, TraceResponse, TraceCardResponse

router = APIRouter()


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


@router.post("/traces", response_model=TraceResponse)
async def create_trace(trace_in: TraceCreate, db: AsyncSession = Depends(get_db)):
    trace_dict = trace_in.model_dump()
    trace_dict["quality_score"] = compute_quality_score(trace_dict)
    trace = ReasoningTrace(**trace_dict)
    db.add(trace)
    await db.commit()
    await db.refresh(trace)
    return trace


@router.get("/traces", response_model=List[TraceCardResponse])
async def list_traces(
    technique: Optional[str] = None,
    proof_type: Optional[str] = None,
    min_rating: Optional[int] = None,
    max_rating: Optional[int] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    query = select(ReasoningTrace)

    if technique:
        # JSON column stored as text in SQLite — check for the quoted tag value
        query = query.where(cast(ReasoningTrace.technique_tags, String).contains(f'"{technique}"'))
    if proof_type:
        query = query.where(ReasoningTrace.proof_type == proof_type)
    if min_rating is not None:
        query = query.where(ReasoningTrace.difficulty_rating >= min_rating)
    if max_rating is not None:
        query = query.where(ReasoningTrace.difficulty_rating <= max_rating)
    if search:
        term = f"%{search}%"
        query = query.where(
            or_(
                ReasoningTrace.core_observation.ilike(term),
                ReasoningTrace.key_insight.ilike(term),
                ReasoningTrace.problem_title.ilike(term),
            )
        )

    query = query.order_by(ReasoningTrace.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/traces/{trace_id}", response_model=TraceResponse)
async def get_trace(trace_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ReasoningTrace).where(ReasoningTrace.id == trace_id)
    )
    trace = result.scalar_one_or_none()
    if not trace:
        raise HTTPException(status_code=404, detail="Trace not found")
    return trace
