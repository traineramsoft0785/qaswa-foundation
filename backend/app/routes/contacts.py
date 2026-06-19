from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database import supabase
from app.models.contact import ContactCreate, ContactResponse
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/api/contacts", tags=["Contacts"])


@router.post("/", response_model=ContactResponse, status_code=201)
async def submit_contact(data: ContactCreate):
    result = (
        supabase.table("contacts")
        .insert(data.model_dump())
        .execute()
    )
    return result.data[0]


@router.get("/", response_model=List[ContactResponse])
async def get_contacts(
    unread_only: bool = False, admin: dict = Depends(get_current_admin)
):
    query = supabase.table("contacts").select("*").order("created_at", desc=True)
    if unread_only:
        query = query.eq("is_read", False)
    result = query.execute()
    return result.data


@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(contact_id: str, admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("contacts")
        .select("*")
        .eq("id", contact_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Contact not found")
    return result.data[0]


@router.put("/{contact_id}/read", response_model=ContactResponse)
async def mark_contact_read(contact_id: str, admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("contacts")
        .update({"is_read": True})
        .eq("id", contact_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Contact not found")
    return result.data[0]


@router.delete("/{contact_id}", status_code=204)
async def delete_contact(contact_id: str, admin: dict = Depends(get_current_admin)):
    supabase.table("contacts").delete().eq("id", contact_id).execute()
