from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class ProgramCreate(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0


class ProgramUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class ProgramResponse(BaseModel):
    id: UUID
    title: str
    description: str
    image_url: Optional[str]
    is_active: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
