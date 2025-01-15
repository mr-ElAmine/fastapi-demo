from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from database.main import Base


# pylint: disable=too-few-public-methods
class Deposit(Base):
    __tablename__ = "deposits"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    amount = Column(Float, nullable=False)
    state = Column(Boolean, nullable=False, default=True)
    date = Column(DateTime, nullable=False)

    # Relation avec la table Account
    account = relationship("Account", back_populates="deposits")
