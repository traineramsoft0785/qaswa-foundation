from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime
from uuid import UUID


class UserRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    school: Optional[str] = None
    class_name: Optional[str] = None
    date_of_birth: Optional[date] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserProfileResponse"


class UserProfileResponse(BaseModel):
    id: UUID
    name: str
    email: str
    phone: str
    school: Optional[str] = None
    class_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    created_at: datetime


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    school: Optional[str] = None
    class_name: Optional[str] = None
    date_of_birth: Optional[date] = None


class UserChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
