from fastapi import APIRouter, HTTPException, status
from app.database import supabase
from app.models.quiz_registration import QuizRegistrationCreate, QuizRegistrationResponse

router = APIRouter(prefix="/api/quiz-registrations", tags=["QuizRegistrations"])


@router.post("/", response_model=QuizRegistrationResponse, status_code=201)
async def create_quiz_registration(data: QuizRegistrationCreate):
    quiz_result = (
        supabase.table("notices")
        .select("id")
        .eq("is_active", True)
        .eq("is_quiz", True)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    if not quiz_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active quiz announcement available",
        )

    notice_id = quiz_result.data[0]["id"]
    insert_data = data.model_dump(exclude_none=True)
    insert_data["notice_id"] = notice_id
    result = supabase.table("quiz_registrations").insert(insert_data).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save registration",
        )
    return result.data[0]
