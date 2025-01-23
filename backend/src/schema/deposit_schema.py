from datetime import datetime

from pydantic import BaseModel, Field


# pylint: disable=too-few-public-methods
class DepositSchema(BaseModel):
    id: int = Field(..., description="Unique ID of the deposit")
    account_id: str = Field(
        ..., description="ID of the account associated with the deposit"
    )
    amount: float = Field(..., gt=0, description="Deposited amount, must be positive")
    state: bool = Field(
        ..., description="Status of the deposit (True = success, False = failure)"
    )
    date: datetime = Field(..., description="Date and time of the deposit")

    class Config:
        from_attributes = True


# pylint: disable=too-few-public-methods
class DepositCreateSchema(BaseModel):
    account_id: str = Field(..., description="ID of the account to deposit into")
    amount: float = Field(..., gt=0, description="Amount to deposit (must be positive)")

    class Config:
        from_attributes = True
