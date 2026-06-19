from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.database import supabase
from app.middleware.auth import get_current_admin
import uuid

router = APIRouter(prefix="/api/upload", tags=["Upload"])

ALLOWED_BUCKETS = ["program-images", "gallery-images", "notice-attachments"]
ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
MAX_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/image/{bucket}")
async def upload_file(
    bucket: str,
    file: UploadFile = File(...),
    admin: dict = Depends(get_current_admin),
):
    if bucket not in ALLOWED_BUCKETS:
        raise HTTPException(status_code=400, detail="Invalid bucket")
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="File type not allowed")

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"

    supabase.storage.from_(bucket).upload(
        filename, contents, {"content-type": file.content_type}
    )

    public_url = supabase.storage.from_(bucket).get_public_url(filename)
    return {"url": public_url, "filename": filename}


@router.delete("/image/{bucket}/{filename}")
async def delete_file(
    bucket: str, filename: str, admin: dict = Depends(get_current_admin)
):
    if bucket not in ALLOWED_BUCKETS:
        raise HTTPException(status_code=400, detail="Invalid bucket")
    supabase.storage.from_(bucket).remove([filename])
    return {"status": "deleted"}
