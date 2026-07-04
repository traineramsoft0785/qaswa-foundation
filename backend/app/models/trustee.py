from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class TrusteeCreate(BaseModel):
    name: str
    designation: str
    bio: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class TrusteeUpdate(BaseModel):
    name: Optional[str] = None
    designation: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class TrusteeResponse(BaseModel):
    id: UUID
    name: str
    designation: str
    bio: Optional[str]
    image_url: Optional[str]
    sort_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
