from datetime import datetime

from pydantic import BaseModel, Field


# pylint: disable=too-few-public-methods
class TransactionSchema(BaseModel):
    id: str = Field(..., ge=1, description="Unique identifier for the transaction")
    amount: float = Field(..., gt=0.0, description="Transaction amount")
    state: str = Field(
        ..., description="State of the transaction (successful or failed)"
    )
    id_account_sender: str = Field(..., description="ID of the sender's account")
    id_account_receiver: str = Field(
        ..., description="ID of the receiver's account"
    )
    date: datetime = Field(None, description="Date of the transaction")

    class Config:
        from_attributes = True


# pylint: disable=too-few-public-methods
class TransactionCreateSchema(BaseModel):
    amount: float = Field(..., gt=0.0, description="Transaction amount")
    id_account_sender: str = Field(..., description="ID of the sender's account")
    id_account_receiver: str = Field(
        ..., description="ID of the receiver's account"
    )

    class Config:
        from_attributes = True
