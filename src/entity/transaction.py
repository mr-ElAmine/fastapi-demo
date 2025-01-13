import datetime
from pydantic import BaseModel


class Transaction(BaseModel):
    id: int
    amount: float
    state: bool
    id_account_sender: int
    id_account_receiver: int
    date: datetime