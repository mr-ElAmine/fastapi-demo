from pydantic import BaseModel, EmailStr, Field, field_validator


class UserSchema(BaseModel):
    first_name: str = Field(..., max_length=50, description="User's first name")
    last_name: str = Field(..., max_length=50, description="User's last name")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(
        ..., min_length=8, description="Password with at least 8 characters"
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if (
            not any(c.isupper() for c in value)
            or not any(c.islower() for c in value)
            or not any(c.isdigit() for c in value)
            or all(c not in "@$!%*?&" for c in value)
        ):
            raise ValueError(
                """
                Password must contain at least one uppercase letter, 
                one lowercase letter, one digit, and one special character (@$!%*?&).
                """
            )
        return value


class LoginSchema(BaseModel):
    email: EmailStr = Field(..., description="Email de l'utilisateur")
    password: str = Field(..., description="Mot de passe de l'utilisateur")
