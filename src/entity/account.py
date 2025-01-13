import datetime
from pydantic import BaseModel


class Account(BaseModel):
    id: int
    user_id: int
    balance: float
    state: bool
    is_main: bool
    date: datetime