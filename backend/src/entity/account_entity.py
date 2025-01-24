from uuid import UUID
from sqlalchemy import Boolean, Column, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
import uuid

from database.main_database import Base
from entity.utile_entity import AccountType


# pylint: disable=too-few-public-methods
class Account(Base):
    __tablename__ = "accounts"

    id = Column(String(34), primary_key=True, index=True, unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    balance = Column(Float, nullable=False, default=0.0)
    state = Column(Boolean, nullable=False, default=True)
    is_main = Column(Boolean, nullable=False, default=False)
    date = Column(DateTime, nullable=False)
    type = Column(Enum(AccountType), default=AccountType.SAVINGS, nullable=False)
    uuid = Column(String(36), default=lambda: str(uuid.uuid4()), unique=True, nullable=False)

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
    sent_transactions_auto = relationship(
        "TransactionAuto",
        foreign_keys="TransactionAuto.sender_account_id",
        back_populates="sender_account",
    )
    received_transactions_auto = relationship(
        "TransactionAuto",
        foreign_keys="TransactionAuto.receiver_account_id",
        back_populates="receiver_account",
    )
    beneficiaries = relationship("Beneficiary", back_populates="beneficiary_account")

    user = relationship("User", back_populates="accounts")
    deposits = relationship("Deposit", back_populates="account")
