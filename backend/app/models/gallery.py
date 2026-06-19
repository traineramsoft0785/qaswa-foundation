from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class GalleryCreate(BaseModel):
    title: str
    image_url: str
    category: Optional[str] = None


class GalleryUpdate(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None


class GalleryResponse(BaseModel):
    id: UUID
    title: str
    image_url: str
    category: Optional[str]
    created_at: datetime
