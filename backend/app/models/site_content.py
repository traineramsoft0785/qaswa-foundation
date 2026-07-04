from pydantic import BaseModel
from typing import Any, Dict
from datetime import datetime


class SiteContentUpdate(BaseModel):
    data: Dict[str, Any]


class SiteContentResponse(BaseModel):
    page: str
    section_key: str
    data: Dict[str, Any]
    updated_at: datetime
