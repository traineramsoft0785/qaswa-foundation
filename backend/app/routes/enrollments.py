from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from app.database import supabase
from app.middleware.user_auth import get_current_user
import io

router = APIRouter(prefix="/api/enrollments", tags=["Enrollments"])


def generate_roll_number(quiz_no: int, quiz_id: str) -> str:
    prefix = f"QZ{quiz_no}"
    count_result = (
        supabase.table("quiz_enrollments")
        .select("id", count="exact")
        .eq("quiz_id", quiz_id)
        .execute()
    )
    next_number = (count_result.count or 0) + 1
    return f"{prefix}-{next_number:04d}"


@router.post("/")
async def enroll_in_quiz(data: dict, current_user: dict = Depends(get_current_user)):
    quiz_id = data.get("quiz_id")
    if not quiz_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="quiz_id is required",
        )

    quiz_result = (
        supabase.table("quizzes")
        .select("*")
        .eq("id", quiz_id)
        .eq("is_active", True)
        .execute()
    )
    if not quiz_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found or not active",
        )
    quiz = quiz_result.data[0]

    existing = (
        supabase.table("quiz_enrollments")
        .select("id")
        .eq("user_id", current_user["id"])
        .eq("quiz_id", quiz_id)
        .execute()
    )
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already enrolled in this quiz",
        )

    roll_number = generate_roll_number(quiz["quiz_no"], quiz_id)

    max_retries = 3
    for attempt in range(max_retries):
        try:
            enrollment_data = {
                "user_id": current_user["id"],
                "quiz_id": quiz_id,
                "roll_number": roll_number,
            }
            result = supabase.table("quiz_enrollments").insert(enrollment_data).execute()
            if result.data:
                return result.data[0]
        except Exception:
            parts = roll_number.rsplit("-", 1)
            next_num = int(parts[1]) + 1
            roll_number = f"{parts[0]}-{next_num:04d}"

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to create enrollment",
    )


@router.get("/my")
async def get_my_enrollments(current_user: dict = Depends(get_current_user)):
    enrollments = (
        supabase.table("quiz_enrollments")
        .select("*")
        .eq("user_id", current_user["id"])
        .order("enrolled_at", desc=True)
        .execute()
    )

    enriched = []
    for enrollment in enrollments.data:
        quiz_result = (
            supabase.table("quizzes")
            .select("*")
            .eq("id", enrollment["quiz_id"])
            .execute()
        )
        quiz = quiz_result.data[0] if quiz_result.data else None
        enriched.append({**enrollment, "quiz": quiz})

    return enriched


@router.get("/{enrollment_id}/admit-card")
async def download_admit_card(
    enrollment_id: str, current_user: dict = Depends(get_current_user)
):
    enrollment_result = (
        supabase.table("quiz_enrollments")
        .select("*")
        .eq("id", enrollment_id)
        .eq("user_id", current_user["id"])
        .execute()
    )
    if not enrollment_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found",
        )
    enrollment = enrollment_result.data[0]

    quiz_result = (
        supabase.table("quizzes")
        .select("*")
        .eq("id", enrollment["quiz_id"])
        .execute()
    )
    if not quiz_result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found",
        )
    quiz = quiz_result.data[0]

    user_result = (
        supabase.table("users")
        .select("*")
        .eq("id", current_user["id"])
        .execute()
    )
    user = user_result.data[0] if user_result.data else {}

    pdf_bytes = generate_admit_card_pdf(user, quiz, enrollment)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="admit-card-{enrollment["roll_number"]}.pdf"'
        },
    )


def _get_logo_path():
    import os
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(base, "assets", "logo.png")
    return path if os.path.exists(path) else None


def generate_admit_card_pdf(user: dict, quiz: dict, enrollment: dict) -> bytes:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import cm
    from reportlab.lib import colors
    from reportlab.pdfgen import canvas

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    margin = 1.5 * cm
    card_x = margin
    card_y = margin
    card_w = width - 2 * margin
    card_h = height - 2 * margin

    # Full page background
    c.setFillColor(colors.HexColor("#f1f5f9"))
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # Card background (white)
    c.setFillColor(colors.white)
    c.roundRect(card_x, card_y, card_w, card_h, 10, fill=1, stroke=0)

    # Top colored banner
    banner_h = 90
    banner_y = card_y + card_h - banner_h
    c.setFillColor(colors.HexColor("#0f3460"))
    c.roundRect(card_x, banner_y, card_w, banner_h + 10, 10, fill=1, stroke=0)
    # Square off the bottom corners of the banner
    c.rect(card_x, banner_y, card_w, 15, fill=1, stroke=0)

    # Logo in banner
    logo_path = _get_logo_path()
    logo_size = 68
    logo_x = card_x + 20
    logo_y = banner_y + (banner_h - logo_size) / 2 + 2

    if logo_path:
        c.drawImage(logo_path, logo_x, logo_y, logo_size, logo_size, preserveAspectRatio=True, mask="auto")
    else:
        # Fallback: white circle with Q
        cx = logo_x + logo_size / 2
        cy = logo_y + logo_size / 2
        c.setFillColor(colors.white)
        c.circle(cx, cy, 28, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#0f3460"))
        c.setFont("Helvetica-Bold", 26)
        c.drawCentredString(cx, cy - 9, "Q")

    # Foundation name in banner
    text_x = logo_x + logo_size + 18
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(text_x, banner_y + banner_h - 38, "The Qaswa Foundation")
    c.setFont("Helvetica-Oblique", 11)
    c.setFillColor(colors.HexColor("#93c5fd"))
    c.drawString(text_x, banner_y + banner_h - 56, "Education for All")

    # "ADMIT CARD" badge (overlapping banner bottom)
    badge_h = 32
    badge_w = 200
    badge_x = card_x + (card_w - badge_w) / 2
    badge_y = banner_y - badge_h / 2
    c.setFillColor(colors.HexColor("#e53e3e"))
    c.roundRect(badge_x, badge_y, badge_w, badge_h, 6, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(card_x + card_w / 2, badge_y + 9, "ADMIT CARD")

    # --- Content area ---
    content_y = badge_y - 25

    # --- Photo box (top right, bigger) ---
    photo_w = 4 * cm
    photo_h = 4.8 * cm
    photo_x = card_x + card_w - photo_w - 30
    photo_y = content_y - photo_h - 5

    # Photo box white background
    c.setFillColor(colors.white)
    c.rect(photo_x, photo_y, photo_w, photo_h, fill=1, stroke=0)

    # Dashed border
    c.setStrokeColor(colors.HexColor("#64748b"))
    c.setLineWidth(1.2)
    c.setDash(4, 4)
    c.rect(photo_x, photo_y, photo_w, photo_h)
    c.setDash()

    # Photo icon (camera-like shape)
    pcx = photo_x + photo_w / 2
    pcy = photo_y + photo_h / 2 + 8
    c.setFillColor(colors.HexColor("#cbd5e1"))
    c.circle(pcx, pcy, 14, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.circle(pcx, pcy, 8, fill=1, stroke=0)

    # Text below icon
    c.setFillColor(colors.HexColor("#94a3b8"))
    c.setFont("Helvetica", 9)
    c.drawCentredString(pcx, photo_y + photo_h / 2 - 16, "Paste Photo Here")

    # --- Student details ---
    detail_x = card_x + 30
    detail_start_y = content_y - 15
    label_x = detail_x
    value_x = detail_x + 130

    exam_date_str = quiz.get("exam_date", "N/A")
    exam_time_str = quiz.get("exam_time") or "N/A"
    venue_str = quiz.get("venue") or "N/A"
    duration = quiz.get("duration_minutes")
    duration_str = f"{duration} minutes" if duration else "N/A"

    rows = [
        ("Student Name", user.get("name", "N/A")),
        ("Roll Number", enrollment.get("roll_number", "N/A")),
    ]
    if user.get("school"):
        rows.append(("School", user["school"]))
    if user.get("class_name"):
        rows.append(("Class", user["class_name"]))
    rows += [
        ("Quiz", quiz.get("title", "N/A")),
        ("Exam Date", str(exam_date_str)),
        ("Exam Time", str(exam_time_str)),
        ("Venue", str(venue_str)),
        ("Duration", duration_str),
    ]

    row_height = 32
    y = detail_start_y
    # Stop the row backgrounds short of the photo box so they don't paint over it
    row_width = (photo_x - 10) - (detail_x - 10)

    for i, (label, value) in enumerate(rows):
        row_y = y - (i * row_height)

        # Alternating row background
        if i % 2 == 0:
            c.setFillColor(colors.HexColor("#f0f4ff"))
        else:
            c.setFillColor(colors.HexColor("#f8fafc"))
        c.rect(detail_x - 10, row_y - 10, row_width, row_height, fill=1, stroke=0)

        # Left accent bar on each row
        c.setFillColor(colors.HexColor("#0f3460"))
        c.rect(detail_x - 10, row_y - 10, 3, row_height, fill=1, stroke=0)

        # Label
        c.setFillColor(colors.HexColor("#64748b"))
        c.setFont("Helvetica", 10)
        c.drawString(label_x + 2, row_y, label)

        # Value
        c.setFillColor(colors.HexColor("#0f172a"))
        c.setFont("Helvetica-Bold", 12)
        c.drawString(value_x, row_y, value)

    # --- Bottom section ---
    bottom_area_y = y - (len(rows) * row_height) - 20

    # Thin accent line
    c.setStrokeColor(colors.HexColor("#0f3460"))
    c.setLineWidth(1.5)
    c.line(card_x + 25, bottom_area_y + 10, card_x + card_w - 25, bottom_area_y + 10)

    # Instructions box
    instr_y = bottom_area_y - 55
    instr_x = card_x + 25
    instr_w = card_w - 50
    c.setFillColor(colors.HexColor("#fffbeb"))
    c.roundRect(instr_x, instr_y, instr_w, 50, 4, fill=1, stroke=0)
    c.setStrokeColor(colors.HexColor("#f59e0b"))
    c.setLineWidth(0.5)
    c.roundRect(instr_x, instr_y, instr_w, 50, 4, fill=0, stroke=1)

    c.setFillColor(colors.HexColor("#92400e"))
    c.setFont("Helvetica-Bold", 9)
    c.drawString(instr_x + 12, instr_y + 33, "Instructions:")
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.HexColor("#78350f"))
    c.drawString(instr_x + 12, instr_y + 20, "1. Paste a recent passport-size photograph in the space provided.")
    c.drawString(instr_x + 12, instr_y + 8, "2. Bring this admit card along with a valid ID on the day of the exam.")

    # Signature lines
    sig_y = instr_y - 50
    # Student signature
    c.setStrokeColor(colors.HexColor("#94a3b8"))
    c.setLineWidth(0.5)
    c.line(card_x + 40, sig_y, card_x + 200, sig_y)
    c.setFillColor(colors.HexColor("#64748b"))
    c.setFont("Helvetica", 9)
    c.drawCentredString(card_x + 120, sig_y - 14, "Student Signature")

    # Authority signature
    c.line(card_x + card_w - 200, sig_y, card_x + card_w - 40, sig_y)
    c.drawCentredString(card_x + card_w - 120, sig_y - 14, "Authorized Signature")

    # Footer
    c.setFillColor(colors.HexColor("#94a3b8"))
    c.setFont("Helvetica", 7)
    c.drawCentredString(card_x + card_w / 2, card_y + 15, "This is a computer-generated admit card issued by The Qaswa Foundation.")

    c.save()
    return buffer.getvalue()
