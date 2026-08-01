from fastapi import APIRouter, Depends, HTTPException, status
from app.database import supabase
from app.middleware.auth import get_current_admin
from app.models.quiz import QuizCreate, QuizUpdate

router = APIRouter(prefix="/api/quizzes", tags=["Quizzes"])


@router.get("/")
async def get_active_quizzes():
    result = (
        supabase.table("quizzes")
        .select("*")
        .eq("is_active", True)
        .order("exam_date", desc=True)
        .execute()
    )
    return result.data


@router.get("/admin/all")
async def get_all_quizzes(admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("quizzes")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    quizzes = result.data

    for quiz in quizzes:
        count_result = (
            supabase.table("quiz_enrollments")
            .select("id", count="exact")
            .eq("quiz_id", quiz["id"])
            .execute()
        )
        quiz["enrollment_count"] = count_result.count or 0

    return quizzes


@router.get("/{quiz_id}")
async def get_quiz(quiz_id: str):
    result = (
        supabase.table("quizzes")
        .select("*")
        .eq("id", quiz_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found",
        )
    return result.data[0]


@router.post("/")
async def create_quiz(data: QuizCreate, admin: dict = Depends(get_current_admin)):
    quiz_data = data.model_dump()
    if quiz_data.get("exam_date"):
        quiz_data["exam_date"] = str(quiz_data["exam_date"])

    result = supabase.table("quizzes").insert(quiz_data).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create quiz",
        )
    return result.data[0]


@router.put("/{quiz_id}")
async def update_quiz(
    quiz_id: str, data: QuizUpdate, admin: dict = Depends(get_current_admin)
):
    update_data = data.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    if "exam_date" in update_data and update_data["exam_date"]:
        update_data["exam_date"] = str(update_data["exam_date"])

    result = (
        supabase.table("quizzes")
        .update(update_data)
        .eq("id", quiz_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found",
        )
    return result.data[0]


@router.delete("/{quiz_id}")
async def delete_quiz(quiz_id: str, admin: dict = Depends(get_current_admin)):
    result = (
        supabase.table("quizzes")
        .delete()
        .eq("id", quiz_id)
        .execute()
    )
    return {"message": "Quiz deleted successfully"}


@router.get("/{quiz_id}/enrollments")
async def get_quiz_enrollments(
    quiz_id: str, admin: dict = Depends(get_current_admin)
):
    enrollments = (
        supabase.table("quiz_enrollments")
        .select("*")
        .eq("quiz_id", quiz_id)
        .execute()
    )

    def roll_order_key(enrollment: dict) -> int:
        last_four = (enrollment.get("roll_number") or "")[-4:]
        return int(last_four) if last_four.isdigit() else 0

    sorted_enrollments = sorted(enrollments.data, key=roll_order_key)

    enriched = []
    for enrollment in sorted_enrollments:
        user_result = (
            supabase.table("users")
            .select("name, email, phone, login_mobile, school, class_name")
            .eq("id", enrollment["user_id"])
            .execute()
        )
        user = user_result.data[0] if user_result.data else {}
        enriched.append({
            **enrollment,
            "user_name": user.get("name"),
            "user_email": user.get("email"),
            "user_phone": user.get("login_mobile") or user.get("phone"),
            "user_school": user.get("school"),
            "user_class": user.get("class_name"),
        })

    return enriched
