from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
import uuid


class TraceBase(BaseModel):
    problem_id: Optional[str] = None
    problem_title: Optional[str] = None
    problem_url: Optional[str] = None
    difficulty_rating: Optional[int] = None
    technique_tags: Optional[List[str]] = []
    core_observation: Optional[str] = None
    proof_type: Optional[str] = None
    proof_body: Optional[str] = None
    why_naive_fails: Optional[str] = None
    key_insight: Optional[str] = None
    proof_rigor: Optional[str] = None
    source_editorial: Optional[str] = None
    quality_score: Optional[float] = None
    quality_flags: Optional[List[str]] = []


class TraceCreate(TraceBase):
    pass


class TraceResponse(TraceBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    created_at: datetime


class TraceCardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    problem_id: Optional[str] = None
    problem_title: Optional[str] = None
    problem_url: Optional[str] = None
    difficulty_rating: Optional[int] = None
    technique_tags: Optional[List[str]] = []
    proof_type: Optional[str] = None
    key_insight: Optional[str] = None
    quality_score: Optional[float] = None
    created_at: datetime


class UserTraceBase(BaseModel):
    session_id: str
    user_observation: Optional[str] = None
    user_proof_attempt: Optional[str] = None
    user_naive_attempt: Optional[str] = None
    user_approach: Optional[str] = None
    time_spent_minutes: Optional[int] = None


class UserTraceCreate(UserTraceBase):
    pass


class UserTraceResponse(UserTraceBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    trace_id: uuid.UUID
    ai_comparison: Optional[str] = None
    divergence_points: Optional[List[str]] = []
    created_at: datetime


class ExtractRequest(BaseModel):
    editorial_text: str
    problem_url: Optional[str] = None


class ExtractResponse(BaseModel):
    core_observation: Optional[str] = None
    proof_type: Optional[str] = None
    proof_body: Optional[str] = None
    why_naive_fails: Optional[str] = None
    technique_tags: Optional[List[str]] = []
    key_insight: Optional[str] = None
    proof_rigor: Optional[str] = None
    quality_score: Optional[float] = None
    quality_flags: Optional[List[str]] = []
    problem_id: Optional[str] = None
    problem_title: Optional[str] = None
    problem_url: Optional[str] = None
    difficulty_rating: Optional[int] = None
    source_editorial: Optional[str] = None
