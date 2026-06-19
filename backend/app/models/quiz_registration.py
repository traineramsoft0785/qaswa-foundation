from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date
from uuid import UUID


class QuizRegistrationCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: Optional[EmailStr] = None
    phone: str = Field(..., min_length=1)
    school: Optional[str] = None
    class_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    notice_id: Optional[UUID] = None


class QuizRegistrationResponse(BaseModel):
    id: UUID
    name: str
    email: Optional[EmailStr]
    phone: Optional[str]
    school: Optional[str]
    class_name: Optional[str]
    date_of_birth: Optional[date]
    notice_id: Optional[UUID]
    created_at: datetime
