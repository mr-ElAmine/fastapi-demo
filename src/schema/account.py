from datetime import datetime
from typing import List

from pydantic import BaseModel, Field

from schema.transaction import TransactionSchema


# pylint: disable=too-few-public-methods
class AccountSchema(BaseModel):
    id: int = Field(..., ge=1, description="Unique identifier for the account")
    user_id: int = Field(..., ge=1, description="ID of the user who owns the account")
    balance: float = Field(..., ge=0.0, description="Current balance of the account")
    state: bool = Field(..., description="State of the account (active or inactive)")
    is_main: bool = Field(
        ..., description="Indicates if this is the primary account for the user"
    )
    date: datetime = Field(
        None, description="Creation or last updated date of the account"
    )
    transactions_sent: List[TransactionSchema] = Field(
        [], description="List of transactions sent from this account"
    )
    transactions_received: List[TransactionSchema] = Field(
        [], description="List of transactions received by this account"
    )

    class Config:
        from_attributes = True


class AccountCreateSchema(BaseModel):
    user_id: int = Field(..., ge=1, description="ID of the user who owns the account")
