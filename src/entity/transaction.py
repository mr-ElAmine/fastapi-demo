from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from database.main import Base


# pylint: disable=too-few-public-methods
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    state = Column(Boolean, nullable=False, default=False)
    id_account_sender = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    id_account_receiver = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)

    # Relations avec Account
    sender_account = relationship("Account", foreign_keys=[id_account_sender])
    receiver_account = relationship("Account", foreign_keys=[id_account_receiver])
