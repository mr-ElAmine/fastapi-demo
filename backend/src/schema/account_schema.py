from datetime import datetime
from typing import List

from pydantic import BaseModel, Field

from entity.utile_entity import AccountType
from schema.transaction_schema import TransactionAutoSchema, TransactionSchema


# pylint: disable=too-few-public-methods
class AccountSchema(BaseModel):
    id: str = Field(..., description="Unique identifier for the account")
    user_id: int = Field(..., ge=1, description="ID of the user who owns the account")
    name: str = Field(
        ..., min_length=1, max_length=100, description="Name of the account"
    )
    balance: float = Field(..., ge=0.0, description="Current balance of the account")
    state: bool = Field(..., description="State of the account (active or inactive)")
    is_main: bool = Field(
        ..., description="Indicates if this is the primary account for the user"
    )
    type: AccountType = Field(..., description="Type of the account")

    date: datetime = Field(
        None, description="Creation or last updated date of the account"
    )
    transactions_sent: List[TransactionSchema] = Field(
        [], description="List of transactions sent from this account"
    )
    transactions_received: List[TransactionSchema] = Field(
        [], description="List of transactions received by this account"
    )
    sent_transactions_auto: List[TransactionAutoSchema] = Field(
        [], description="List of automatic transactions sent from this account"
    )
    received_transactions_auto: List[TransactionAutoSchema] = Field(
        [], description="List of automatic transactions received by this account"
    )

    class Config:
        from_attributes = True


# pylint: disable=too-few-public-methods
class CreateAccountSchema(BaseModel):
    name: str = Field(
        ..., min_length=1, max_length=100, description="Name of the account"
    )
    type: AccountType = Field(..., description="Type of the account")

    class Config:
        from_attributes = True
