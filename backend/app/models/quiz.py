from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime
from uuid import UUID


class QuizCreate(BaseModel):
    title: str
    description: Optional[str] = None
    exam_date: date
    exam_time: Optional[str] = None
    venue: Optional[str] = None
    duration_minutes: Optional[int] = None
    is_active: bool = True


class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    exam_date: Optional[date] = None
    exam_time: Optional[str] = None
    venue: Optional[str] = None
    duration_minutes: Optional[int] = None
    is_active: Optional[bool] = None


class QuizResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    exam_date: date
    exam_time: Optional[str] = None
    venue: Optional[str] = None
    duration_minutes: Optional[int] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class EnrollmentResponse(BaseModel):
    id: UUID
    user_id: UUID
    quiz_id: UUID
    roll_number: str
    enrolled_at: datetime
    quiz: Optional[QuizResponse] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    user_school: Optional[str] = None
    user_class: Optional[str] = None
