from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from database.main import Base


# pylint: disable=too-few-public-methods
class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    balance = Column(Float, nullable=False, default=0.0)
    state = Column(Boolean, nullable=False, default=True)
    is_main = Column(Boolean, nullable=False, default=False)
    date = Column(DateTime, default=datetime.now(timezone.utc))

    # Relations avec Transaction
    transactions_sent = relationship(
        "Transaction",
        foreign_keys="Transaction.id_account_sender",
        back_populates="sender_account",
    )
    transactions_received = relationship(
        "Transaction",
        foreign_keys="Transaction.id_account_receiver",
        back_populates="receiver_account",
    )

    user = relationship("User", back_populates="accounts")
    deposits = relationship("Deposit", back_populates="account")
