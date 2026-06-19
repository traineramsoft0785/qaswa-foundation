from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import supabase
from app.models.program import ProgramCreate, ProgramUpdate, ProgramResponse
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/api/programs", tags=["Programs"])


@router.get("/", response_model=List[ProgramResponse])
async def get_active_programs():
    result = (
        supabase.table("programs")
        .select("*")
        .eq("is_active", True)
        .order("sort_order")
        .execute()
    )
    return result.data


@router.get("/admin/all", response_model=List[ProgramResponse])
async def get_all_programs(admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("programs")
        .select("*")
        .order("sort_order")
        .execute()
    )
    return result.data


@router.get("/{program_id}", response_model=ProgramResponse)
async def get_program(program_id: str):
    result = (
        supabase.table("programs")
        .select("*")
        .eq("id", program_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Program not found")
    return result.data[0]


@router.post("/", response_model=ProgramResponse, status_code=201)
async def create_program(data: ProgramCreate, admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("programs")
        .insert(data.model_dump())
        .execute()
    )
    return result.data[0]


@router.put("/{program_id}", response_model=ProgramResponse)
async def update_program(
    program_id: str, data: ProgramUpdate, admin: dict = Depends(get_current_admin)
):
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = (
        supabase.table("programs")
        .update(update_data)
        .eq("id", program_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Program not found")
    return result.data[0]


@router.delete("/{program_id}", status_code=204)
async def delete_program(program_id: str, admin: dict = Depends(get_current_admin)):
    supabase.table("programs").delete().eq("id", program_id).execute()
