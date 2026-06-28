from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import supabase
from app.models.advisor import AdvisorCreate, AdvisorUpdate, AdvisorResponse
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/api/advisors", tags=["Board Advisors"])


@router.get("/", response_model=List[AdvisorResponse])
async def get_active_advisors():
    result = (
        supabase.table("board_advisors")
        .select("*")
        .eq("is_active", True)
        .order("sort_order")
        .execute()
    )
    return result.data


@router.get("/admin/all", response_model=List[AdvisorResponse])
async def get_all_advisors(admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("board_advisors")
        .select("*")
        .order("sort_order")
        .execute()
    )
    return result.data


@router.post("/", response_model=AdvisorResponse, status_code=201)
async def create_advisor(data: AdvisorCreate, admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("board_advisors")
        .insert(data.model_dump())
        .execute()
    )
    return result.data[0]


@router.put("/{advisor_id}", response_model=AdvisorResponse)
async def update_advisor(
    advisor_id: str, data: AdvisorUpdate, admin: dict = Depends(get_current_admin)
):
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = (
        supabase.table("board_advisors")
        .update(update_data)
        .eq("id", advisor_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Advisor not found")
    return result.data[0]


@router.delete("/{advisor_id}", status_code=204)
async def delete_advisor(advisor_id: str, admin: dict = Depends(get_current_admin)):
    supabase.table("board_advisors").delete().eq("id", advisor_id).execute()
