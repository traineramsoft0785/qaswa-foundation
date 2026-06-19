from fastapi import APIRouter, Depends
from app.database import supabase
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_stats(admin: dict = Depends(get_current_admin)):
    programs = supabase.table("programs").select("id", count="exact").execute()
    contacts = (
        supabase.table("contacts")
        .select("id", count="exact")
        .eq("is_read", False)
        .execute()
    )
    donations = (
        supabase.table("donations")
        .select("amount")
        .eq("status", "completed")
        .execute()
    )
    gallery = supabase.table("gallery").select("id", count="exact").execute()
    notices = supabase.table("notices").select("id", count="exact").execute()

    total_donations = (
        sum(float(d["amount"]) for d in donations.data) if donations.data else 0
    )

    return {
        "total_programs": programs.count,
        "unread_contacts": contacts.count,
        "total_donations": total_donations,
        "total_gallery": gallery.count,
        "total_notices": notices.count,
    }
