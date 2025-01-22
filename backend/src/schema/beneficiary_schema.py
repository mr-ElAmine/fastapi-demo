from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# pylint: disable=too-few-public-methods
class BeneficiarySchema(BaseModel):
    id: int = Field(..., description="Unique identifier for the beneficiary")
    added_by_user_id: str = Field(
        ..., ge=1, description="ID of the user who added the beneficiary"
    )
    beneficiary_account_id: str = Field(
        ..., description="Account ID associated with the beneficiary"
    )
    name: str = Field(..., max_length=255, description="Name of the beneficiary")
    created_at: Optional[datetime] = Field(
        None, description="The date and time when the beneficiary was created"
    )
    updated_at: Optional[datetime] = Field(
        None, description="The date and time when the beneficiary was last updated"
    )

    class Config:
        from_attributes = True


class BeneficiaryCreateSchema(BaseModel):
    beneficiary_account_id: str = Field(
        ..., description="Account ID of the beneficiary"
    )
    name: str = Field(..., max_length=255, description="Name of the beneficiary")
