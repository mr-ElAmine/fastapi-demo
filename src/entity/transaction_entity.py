from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from database.main import Base
from entity.utile_entity import State


# pylint: disable=too-few-public-methods
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    state = Column(Enum(State), default=State.PENDING)
    id_account_sender = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    id_account_receiver = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    date = Column(DateTime, nullable=False)

    # Relations avec Account
    sender_account = relationship("Account", foreign_keys=[id_account_sender])
    receiver_account = relationship("Account", foreign_keys=[id_account_receiver])


# pylint: disable=too-few-public-methods
class TransactionPending(Base):
    __tablename__ = "transactions_pending"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    id_account_sender = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    id_account_receiver = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    date = Column(DateTime, nullable=False)

    # Relations avec Account
    sender_account = relationship("Account", foreign_keys=[id_account_sender])
    receiver_account = relationship("Account", foreign_keys=[id_account_receiver])
