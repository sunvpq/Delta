from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from database import get_db
from models import ReasoningTrace, UserTrace
from schemas import UserTraceCreate, UserTraceResponse
from services.extractor import generate_comparison

router = APIRouter()


@router.post("/traces/{trace_id}/user-trace", response_model=UserTraceResponse)
async def create_user_trace(
    trace_id: uuid.UUID,
    user_trace_in: UserTraceCreate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ReasoningTrace).where(ReasoningTrace.id == trace_id)
    )
    expert_trace = result.scalar_one_or_none()
    if not expert_trace:
        raise HTTPException(status_code=404, detail="Trace not found")

    user_trace = UserTrace(trace_id=trace_id, **user_trace_in.model_dump())

    try:
        comparison = await generate_comparison(expert_trace, user_trace)
        user_trace.ai_comparison = comparison.get("ai_comparison")
        user_trace.divergence_points = comparison.get("divergence_points", [])
    except Exception:
        user_trace.ai_comparison = "Comparison generation is unavailable right now. Your reasoning has been saved."
        user_trace.divergence_points = []

    db.add(user_trace)
    await db.commit()
    await db.refresh(user_trace)
    return user_trace


@router.get("/traces/{trace_id}/user-trace/{session_id}", response_model=UserTraceResponse)
async def get_user_trace(
    trace_id: uuid.UUID,
    session_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UserTrace).where(
            UserTrace.trace_id == trace_id,
            UserTrace.session_id == session_id,
        )
    )
    user_trace = result.scalar_one_or_none()
    if not user_trace:
        raise HTTPException(status_code=404, detail="User trace not found")
    return user_trace
