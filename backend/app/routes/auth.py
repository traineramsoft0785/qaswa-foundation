from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.database import supabase
from app.config import settings
from app.models.auth import LoginRequest, TokenResponse, AdminUserResponse
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
