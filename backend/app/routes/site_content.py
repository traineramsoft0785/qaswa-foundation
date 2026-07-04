from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import supabase
from app.models.site_content import SiteContentUpdate, SiteContentResponse
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/api/site-content", tags=["Site Content"])


@router.get("/{page}", response_model=List[SiteContentResponse])
async def get_page_content(page: str):
    result = (
        supabase.table("site_content")
        .select("*")
        .eq("page", page)
        .execute()
    )
    return result.data


@router.put("/{page}/{section_key}", response_model=SiteContentResponse)
async def update_section_content(
    page: str, section_key: str, data: SiteContentUpdate, admin: dict = Depends(get_current_admin)
):
    result = (
        supabase.table("site_content")
        .update({"data": data.data})
        .eq("page", page)
        .eq("section_key", section_key)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Section not found")
    return result.data[0]
