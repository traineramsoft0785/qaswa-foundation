from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import supabase
from app.models.donation import DonationCreate, DonationStatusUpdate, DonationResponse
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/api/donations", tags=["Donations"])


@router.post("/", response_model=DonationResponse, status_code=201)
async def submit_donation(data: DonationCreate):
    result = (
        supabase.table("donations")
        .insert(data.model_dump())
        .execute()
    )
    return result.data[0]


@router.get("/", response_model=List[DonationResponse])
async def get_donations(
    status: str = None, admin: dict = Depends(get_current_admin)
):
    query = supabase.table("donations").select("*").order("created_at", desc=True)
    if status:
        query = query.eq("status", status)
    result = query.execute()
    return result.data


@router.get("/{donation_id}", response_model=DonationResponse)
async def get_donation(donation_id: str, admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("donations")
        .select("*")
        .eq("id", donation_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Donation not found")
    return result.data[0]


@router.put("/{donation_id}/status", response_model=DonationResponse)
async def update_donation_status(
    donation_id: str,
    data: DonationStatusUpdate,
    admin: dict = Depends(get_current_admin),
):
    result = (
        supabase.table("donations")
        .update({"status": data.status})
        .eq("id", donation_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Donation not found")
    return result.data[0]
