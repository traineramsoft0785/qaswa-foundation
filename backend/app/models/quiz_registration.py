from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class QuizRegistrationCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    phone: str = Field(..., min_length=1)
    school: Optional[str] = None
    class_name: Optional[str] = None
    notice_id: Optional[UUID] = None


class QuizRegistrationResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    phone: Optional[str]
    school: Optional[str]
    class_name: Optional[str]
    notice_id: Optional[UUID]
    created_at: datetime
