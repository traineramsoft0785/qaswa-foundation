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
    quizzes = supabase.table("quizzes").select("id", count="exact").execute()
    quiz_enrollments = supabase.table("quiz_enrollments").select("id", count="exact").execute()
    users = supabase.table("users").select("id", count="exact").execute()
    try:
        advisors = supabase.table("board_advisors").select("id", count="exact").execute()
        total_advisors = advisors.count
    except Exception:
        total_advisors = 0

    total_donations = (
        sum(float(d["amount"]) for d in donations.data) if donations.data else 0
    )

    return {
        "total_programs": programs.count,
        "unread_contacts": contacts.count,
        "total_donations": total_donations,
        "total_gallery": gallery.count,
        "total_notices": notices.count,
        "total_quizzes": quizzes.count,
        "total_enrollments": quiz_enrollments.count,
        "total_users": users.count,
        "total_advisors": total_advisors,
    }
