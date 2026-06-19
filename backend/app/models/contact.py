from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str


class ContactResponse(BaseModel):
    id: UUID
    name: str
    email: str
    phone: Optional[str]
    subject: Optional[str]
    message: str
    is_read: bool
    created_at: datetime
