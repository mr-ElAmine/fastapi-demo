from sqlalchemy import Column, Date, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database.main_database import Base
from entity.utile_entity import FrequencyEnum, State


# pylint: disable=too-few-public-methods
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    state = Column(Enum(State), default=State.PENDING)
    id_account_sender = Column(String, ForeignKey("accounts.id"), nullable=False)
    id_account_receiver = Column(String, ForeignKey("accounts.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    label = Column(String, nullable=True)

    # Relations avec Account
    sender_account = relationship("Account", foreign_keys=[id_account_sender])
    receiver_account = relationship("Account", foreign_keys=[id_account_receiver])


# pylint: disable=too-few-public-methods
class TransactionPending(Base):
    __tablename__ = "transactions_pending"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    id_account_sender = Column(String, ForeignKey("accounts.id"), nullable=False)
    id_account_receiver = Column(String, ForeignKey("accounts.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    label = Column(String, nullable=True)

    # Relations avec Account
    sender_account = relationship("Account", foreign_keys=[id_account_sender])
    receiver_account = relationship("Account", foreign_keys=[id_account_receiver])


# pylint: disable=too-few-public-methods
class TransactionAuto(Base):
    __tablename__ = "transaction_auto"

    id = Column(
        Integer, primary_key=True, autoincrement=True
    )  # ID unique de la transaction
    sender_account_id = Column(
        Integer, ForeignKey("accounts.id"), nullable=False
    )  # ID du compte qui envoie
    receiver_account_id = Column(
        Integer, ForeignKey("accounts.id"), nullable=False
    )  # ID du compte qui reçoit
    frequency = Column(Enum(FrequencyEnum), nullable=False)  # Enum pour la fréquence
    start_day = Column(Date, nullable=False)  # Date de début de la transaction
    last_updated = Column(DateTime, nullable=False)  # Date de la dernière mise à jour
    amount = Column(Float, nullable=False)

    sender_account = relationship(
        "Account", foreign_keys=[sender_account_id]
    )  # Relation avec le compte envoyeur
    receiver_account = relationship(
        "Account", foreign_keys=[receiver_account_id]
    )  # Relation avec le compte receveur
