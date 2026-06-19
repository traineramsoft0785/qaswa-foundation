from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime
from uuid import UUID


class NoticeCreate(BaseModel):
    title: str
    content: str
    url: Optional[HttpUrl] = None
    is_pinned: bool = False
    is_active: bool = True
    is_quiz: bool = False


class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    url: Optional[HttpUrl] = None
    is_pinned: Optional[bool] = None
    is_active: Optional[bool] = None
    is_quiz: Optional[bool] = None


class NoticeResponse(BaseModel):
    id: UUID
    title: str
    content: str
    url: Optional[HttpUrl] = None
    is_pinned: bool
    is_active: bool
    is_quiz: bool
    created_at: datetime
    updated_at: datetime
