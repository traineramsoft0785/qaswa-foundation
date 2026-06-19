from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import supabase
from app.models.gallery import GalleryCreate, GalleryUpdate, GalleryResponse
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/api/gallery", tags=["Gallery"])


@router.get("/", response_model=List[GalleryResponse])
async def get_gallery(category: str = None):
    query = supabase.table("gallery").select("*").order("created_at", desc=True)
    if category:
        query = query.eq("category", category)
    result = query.execute()
    return result.data


@router.get("/categories")
async def get_categories():
    result = supabase.table("gallery").select("category").execute()
    categories = list({item["category"] for item in result.data if item["category"]})
    return sorted(categories)


@router.post("/", response_model=GalleryResponse, status_code=201)
async def create_gallery_item(data: GalleryCreate, admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("gallery")
        .insert(data.model_dump())
        .execute()
    )
    return result.data[0]


@router.put("/{item_id}", response_model=GalleryResponse)
async def update_gallery_item(
    item_id: str, data: GalleryUpdate, admin: dict = Depends(get_current_admin)
):
    update_data = data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = (
        supabase.table("gallery")
        .update(update_data)
        .eq("id", item_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return result.data[0]


@router.delete("/{item_id}", status_code=204)
async def delete_gallery_item(item_id: str, admin: dict = Depends(get_current_admin)):
    supabase.table("gallery").delete().eq("id", item_id).execute()
