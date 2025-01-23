from datetime import date, datetime

from pydantic import BaseModel, Field

from entity.utile_entity import FrequencyEnum


# pylint: disable=too-few-public-methods
class TransactionSchema(BaseModel):
    id: str = Field(..., ge=1, description="Unique identifier for the transaction")
    amount: float = Field(..., gt=0.0, description="Transaction amount")
    state: str = Field(
        ..., description="State of the transaction (successful or failed)"
    )
    id_account_sender: str = Field(..., description="ID of the sender's account")
    id_account_receiver: str = Field(..., description="ID of the receiver's account")
    date: datetime = Field(None, description="Date of the transaction")
    label: str = Field(None, description="Label for the transaction")

    class Config:
        from_attributes = True


# pylint: disable=too-few-public-methods
class TransactionCreateSchema(BaseModel):
    amount: float = Field(..., gt=0.0, description="Transaction amount")
    id_account_sender: str = Field(..., description="ID of the sender's account")
    id_account_receiver: str = Field(..., description="ID of the receiver's account")
    label: str = Field(None, description="Label for the transaction")

    class Config:
        from_attributes = True


class TransactionAutoSchema(BaseModel):
    id: int = Field(..., description="Unique identifier for the automatic transaction")
    sender_account_id: str = Field(..., description="ID of the sender account")
    receiver_account_id: str = Field(..., description="ID of the receiver account")
    frequency: FrequencyEnum = Field(..., description="Frequency of the transaction")
    start_day: date = Field(..., description="Start date of the transaction")
    last_updated: datetime = Field(..., description="Last updated timestamp")
    amount: float = Field(..., description="Amount of the transaction", gt=0)

    class Config:
        from_attributes = True


class TransactionAutoCreateSchema(BaseModel):
    sender_account_id: str = Field(..., description="ID of the sender account")
    receiver_account_id: str = Field(..., description="ID of the receiver account")
    frequency: FrequencyEnum = Field(..., description="Frequency of the transaction")
    start_day: date = Field(..., description="Start date of the transaction")
    amount: float = Field(..., description="Amount of the transaction", gt=0)

    class Config:
        from_attributes = True
