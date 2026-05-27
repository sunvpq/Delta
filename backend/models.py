import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, JSON, Uuid
from sqlalchemy.orm import relationship
from database import Base


class ReasoningTrace(Base):
    __tablename__ = "reasoning_traces"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    problem_id = Column(String, nullable=True)
    problem_title = Column(String, nullable=True)
    problem_url = Column(String, nullable=True)
    difficulty_rating = Column(Integer, nullable=True)
    technique_tags = Column(JSON, default=list, nullable=True)

    core_observation = Column(Text, nullable=True)
    proof_type = Column(String, nullable=True)
    proof_body = Column(Text, nullable=True)
    why_naive_fails = Column(Text, nullable=True)
    key_insight = Column(Text, nullable=True)
    proof_rigor = Column(String, nullable=True)

    source_editorial = Column(Text, nullable=True)
    quality_score = Column(Float, nullable=True)
    quality_flags = Column(JSON, default=list, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user_traces = relationship("UserTrace", back_populates="trace", cascade="all, delete-orphan")


class UserTrace(Base):
    __tablename__ = "user_traces"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trace_id = Column(Uuid(as_uuid=True), ForeignKey("reasoning_traces.id"), nullable=False)
    session_id = Column(String, nullable=False)

    user_observation = Column(Text, nullable=True)
    user_proof_attempt = Column(Text, nullable=True)
    user_naive_attempt = Column(Text, nullable=True)
    user_approach = Column(Text, nullable=True)
    time_spent_minutes = Column(Integer, nullable=True)

    ai_comparison = Column(Text, nullable=True)
    divergence_points = Column(JSON, default=list, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    trace = relationship("ReasoningTrace", back_populates="user_traces")
