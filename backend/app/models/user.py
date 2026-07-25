import re

from pydantic import BaseModel, EmailStr, field_validator, model_validator
from typing import Optional
from datetime import date, datetime
from uuid import UUID

PHONE_RE = re.compile(r"^[6-9]\d{9}$")


def normalize_phone(raw: str) -> str:
    digits = re.sub(r"\D", "", raw or "")
    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    elif len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]
    if not PHONE_RE.match(digits):
        raise ValueError("Enter a valid 10-digit mobile number")
    return digits


class UserRegisterRequest(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    login_mobile: Optional[str] = None
    password: str
    school: Optional[str] = None
    class_name: Optional[str] = None
    date_of_birth: Optional[date] = None

    @field_validator("login_mobile")
    @classmethod
    def validate_login_mobile(cls, value: Optional[str]) -> Optional[str]:
        return normalize_phone(value) if value else None

    @model_validator(mode="after")
    def require_email_or_login_mobile(self) -> "UserRegisterRequest":
        if not self.email and not self.login_mobile:
            raise ValueError("Provide an email or a mobile number for login")
        return self


class UserLoginRequest(BaseModel):
    identifier: str
    password: str


class UserTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserProfileResponse"


class UserProfileResponse(BaseModel):
    id: UUID
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    login_mobile: Optional[str] = None
    school: Optional[str] = None
    class_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    created_at: datetime


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    login_mobile: Optional[str] = None
    school: Optional[str] = None
    class_name: Optional[str] = None
    date_of_birth: Optional[date] = None

    @field_validator("login_mobile")
    @classmethod
    def validate_login_mobile(cls, value: Optional[str]) -> Optional[str]:
        return normalize_phone(value) if value else value


class UserChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
