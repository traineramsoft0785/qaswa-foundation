from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class DonationCreate(BaseModel):
    donor_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    amount: float
    payment_id: Optional[str] = None
    payment_method: Optional[str] = None
    message: Optional[str] = None


class DonationStatusUpdate(BaseModel):
    status: str


class DonationResponse(BaseModel):
    id: UUID
    donor_name: str
    email: Optional[str]
    phone: Optional[str]
    amount: float
    payment_id: Optional[str]
    payment_method: Optional[str]
    status: str
    message: Optional[str]
    created_at: datetime
