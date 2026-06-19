from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import supabase
from app.models.notice import NoticeCreate, NoticeUpdate, NoticeResponse
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/api/notices", tags=["Notices"])


@router.get("/", response_model=List[NoticeResponse])
async def get_active_notices():
    result = (
        supabase.table("notices")
        .select("*")
        .eq("is_active", True)
        .order("is_pinned", desc=True)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.get("/admin/all", response_model=List[NoticeResponse])
async def get_all_notices(admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("notices")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.get("/{notice_id}", response_model=NoticeResponse)
async def get_notice(notice_id: str):
    result = (
        supabase.table("notices")
        .select("*")
        .eq("id", notice_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Notice not found")
    return result.data[0]


@router.post("/", response_model=NoticeResponse, status_code=201)
async def create_notice(data: NoticeCreate, admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("notices")
        .insert(data.model_dump())
        .execute()
    )
    return result.data[0]


@router.put("/{notice_id}", response_model=NoticeResponse)
async def update_notice(
    notice_id: str, data: NoticeUpdate, admin: dict = Depends(get_current_admin)
):
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = (
        supabase.table("notices")
        .update(update_data)
        .eq("id", notice_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Notice not found")
    return result.data[0]


@router.delete("/{notice_id}", status_code=204)
async def delete_notice(notice_id: str, admin: dict = Depends(get_current_admin)):
    supabase.table("notices").delete().eq("id", notice_id).execute()
