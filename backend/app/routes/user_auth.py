from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.database import supabase
from app.config import settings
from app.models.user import (
    UserRegisterRequest,
    UserLoginRequest,
    UserTokenResponse,
    UserProfileResponse,
    UserProfileUpdate,
    UserChangePasswordRequest,
)
from app.middleware.user_auth import get_current_user

router = APIRouter(prefix="/api/user/auth", tags=["UserAuth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user_token(user: dict) -> str:
    token_data = {
        "sub": user["id"],
        "email": user["email"],
        "name": user["name"],
        "type": "user",
        "exp": datetime.utcnow() + timedelta(minutes=settings.jwt_expiration_minutes),
    }
    return jwt.encode(token_data, settings.jwt_secret, algorithm=settings.jwt_algorithm)


@router.post("/register", response_model=UserTokenResponse)
async def register(data: UserRegisterRequest):
    existing = (
        supabase.table("users")
        .select("id")
        .eq("email", data.email)
        .execute()
    )
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_password = pwd_context.hash(data.password)
    user_data = {
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "password_hash": hashed_password,
        "school": data.school,
        "class_name": data.class_name,
        "date_of_birth": str(data.date_of_birth) if data.date_of_birth else None,
    }

    result = supabase.table("users").insert(user_data).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user",
        )

    user = result.data[0]
    token = create_user_token(user)
    return UserTokenResponse(
        access_token=token,
        user=UserProfileResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            phone=user["phone"],
            school=user.get("school"),
            class_name=user.get("class_name"),
            date_of_birth=user.get("date_of_birth"),
            created_at=user["created_at"],
        ),
    )


@router.post("/login", response_model=UserTokenResponse)
async def login(data: UserLoginRequest):
    result = (
        supabase.table("users")
        .select("*")
        .eq("email", data.email)
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    user = result.data[0]
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is disabled",
        )
    if not pwd_context.verify(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_user_token(user)
    return UserTokenResponse(
        access_token=token,
        user=UserProfileResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            phone=user["phone"],
            school=user.get("school"),
            class_name=user.get("class_name"),
            date_of_birth=user.get("date_of_birth"),
            created_at=user["created_at"],
        ),
    )


@router.get("/me", response_model=UserProfileResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    result = (
        supabase.table("users")
        .select("*")
        .eq("id", current_user["id"])
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    user = result.data[0]
    return UserProfileResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        phone=user["phone"],
        school=user.get("school"),
        class_name=user.get("class_name"),
        date_of_birth=user.get("date_of_birth"),
        created_at=user["created_at"],
    )


@router.put("/profile", response_model=UserProfileResponse)
async def update_profile(
    data: UserProfileUpdate, current_user: dict = Depends(get_current_user)
):
    update_data = data.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    if "date_of_birth" in update_data and update_data["date_of_birth"]:
        update_data["date_of_birth"] = str(update_data["date_of_birth"])

    result = (
        supabase.table("users")
        .update(update_data)
        .eq("id", current_user["id"])
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile",
        )

    user = result.data[0]
    return UserProfileResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        phone=user["phone"],
        school=user.get("school"),
        class_name=user.get("class_name"),
        date_of_birth=user.get("date_of_birth"),
        created_at=user["created_at"],
    )


@router.put("/change-password")
async def change_password(
    data: UserChangePasswordRequest, current_user: dict = Depends(get_current_user)
):
    result = (
        supabase.table("users")
        .select("*")
        .eq("id", current_user["id"])
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user = result.data[0]
    if not pwd_context.verify(data.current_password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid current password",
        )

    hashed_password = pwd_context.hash(data.new_password)
    supabase.table("users").update({"password_hash": hashed_password}).eq(
        "id", current_user["id"]
    ).execute()

    return {"message": "Password updated successfully"}
