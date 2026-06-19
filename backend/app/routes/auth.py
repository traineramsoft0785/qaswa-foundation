from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.database import supabase
from app.config import settings
from app.models.auth import (
    LoginRequest,
    TokenResponse,
    AdminUserResponse,
    ChangePasswordRequest,
)
from app.middleware.auth import get_current_admin

router = APIRouter(prefix="/api/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    result = (
        supabase.table("admin_users")
        .select("*")
        .eq("email", data.email)
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    user = result.data[0]
    if not pwd_context.verify(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    token_data = {
        "sub": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(minutes=settings.jwt_expiration_minutes),
    }
    token = jwt.encode(token_data, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=AdminUserResponse)
async def get_me(admin: dict = Depends(get_current_admin)):
    return admin


@router.put("/change-password")
async def change_password(
    data: ChangePasswordRequest, admin: dict = Depends(get_current_admin)
):
    result = (
        supabase.table("admin_users")
        .select("*")
        .eq("id", admin["id"])
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin user not found",
        )

    user = result.data[0]
    if not pwd_context.verify(data.current_password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid current password",
        )

    hashed_password = pwd_context.hash(data.new_password)
    update_result = (
        supabase.table("admin_users")
        .update({"password_hash": hashed_password})
        .eq("id", admin["id"])
        .execute()
    )
    if update_result.status_code not in (200, 204):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update password",
        )

    return {"message": "Password updated successfully"}
