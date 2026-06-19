from pydantic import BaseModel, constr, validator


class LoginRequest(BaseModel):
    email: str
    password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: constr(min_length=8)
    confirm_password: str

    @validator("confirm_password")
    def passwords_match(cls, value, values):
        if "new_password" in values and value != values["new_password"]:
            raise ValueError("Passwords do not match")
        return value


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminUserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
