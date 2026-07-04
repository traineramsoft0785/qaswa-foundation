from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import supabase
from app.models.trustee import TrusteeCreate, TrusteeUpdate, TrusteeResponse
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/api/trustees", tags=["Board Trustees"])


@router.get("/", response_model=List[TrusteeResponse])
async def get_active_trustees():
    result = (
        supabase.table("board_trustees")
        .select("*")
        .eq("is_active", True)
        .order("sort_order")
        .execute()
    )
    return result.data


@router.get("/admin/all", response_model=List[TrusteeResponse])
async def get_all_trustees(admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("board_trustees")
        .select("*")
        .order("sort_order")
        .execute()
    )
    return result.data


@router.post("/", response_model=TrusteeResponse, status_code=201)
async def create_trustee(data: TrusteeCreate, admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("board_trustees")
        .insert(data.model_dump())
        .execute()
    )
    return result.data[0]


@router.put("/{trustee_id}", response_model=TrusteeResponse)
async def update_trustee(
    trustee_id: str, data: TrusteeUpdate, admin: dict = Depends(get_current_admin)
):
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = (
        supabase.table("board_trustees")
        .update(update_data)
        .eq("id", trustee_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Trustee not found")
    return result.data[0]


@router.delete("/{trustee_id}", status_code=204)
async def delete_trustee(trustee_id: str, admin: dict = Depends(get_current_admin)):
    supabase.table("board_trustees").delete().eq("id", trustee_id).execute()
